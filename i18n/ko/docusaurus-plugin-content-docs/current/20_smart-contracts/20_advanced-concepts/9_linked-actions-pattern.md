---
title: 연결된 작업 패턴
---

계약과 상호 작용하는 사용자가 다른 계약을 사용했는지 확인하려는 경우가 있습니다.
그들이 당신의 것을 사용하기 전에 계약하십시오. 예를 들어, 그들이 가지고 있는지 확인하고 싶을 수 있습니다.
계약을 사용하기 전에 계약 계정으로 토큰을 전송합니다.

토큰과 관련하여 종종 "예금 패턴"이라고 하지만 토큰 예치
이 패턴을 사용하려는 유일한 시간이 아니므로 "Linked-Action Pattern"이라는 용어가 사용됩니다.

입금 패턴을 예로 들어 이 트랜잭션이 어떻게 보이는지 살펴보겠습니다.
```- Transaction
    1. eosio.token::transfer (Token Transfer) 
        -[inline] mycontract::on_transfer (Notifiable Action Receiver) 
    2. mycontract::record (Regular Action)
```

위의 표는 트랜잭션에서 작업의 실행 순서를 보여줍니다.

트랜잭션에는 토큰 전송과 "기록" 작업만 있지만
또한 토큰 전송에 의해 트리거되는 이벤트 수신자 기능
컨트랙트는 토큰 전송과 기록 작업 사이를 잡아서 놓을 것입니다.

이 패턴이 해결하는 일반적인 문제는
기록 작업이 발생하도록 허용하기 전에 토큰 전송이 발생했습니다.

패턴이 없는 이에 대한 몇 가지 코드를 살펴보겠습니다.


#### 토큰 전송 작업
```cpp
ACTION transfer(name from, name to, asset quantity, string memo){
    // ...
    require_recipient( from );
    require_recipient( to );
    // ...
}
```

#### 이벤트 수신자 및 레코드 작업
```cpp
#include <eosio/asset.hpp>

[[eosio::on_notify("eosio.token::transfer")]]
void on_transfer(name from, name to, asset quantity, string memo){
    // ...
}

ACTION record(name from, uint64_t internal_id, uint8_t status){
    // ...
}
```

위에서 볼 수 있듯이 자금을 이체하는 사용자에 대한 추가 정보를 추가하고 싶습니다.
그러나 우리가 사용할 수 있는 모든 것이 있기 때문에 토큰 전송 작업에서는 그렇게 할 수 없습니다
그만큼 `memo` 문자열인 필드입니다.

> ⚠ **성능 고려 사항**
>
> 데이터를 얻기 위해 일부 문자열 조작 및 변환을 수행할 수 있다고 추측했을 수 있습니다.
> 당신은 `memo` 필드이지만 권장되지 않습니다. 그만큼 `memo` 필드는 256으로 제한되지 않습니다.
> 대부분의 토큰 계약의 문자이지만 스마트 계약 내에서 문자열 조작은 다음 중 하나입니다.
> 수행할 수 있는 가장 비용이 많이 드는 작업입니다.

대신 연결된 작업 패턴을 사용하여 토큰 전송이 발생했는지 확인할 수 있습니다.
우리가 허용하기 전에 `record` 필요한 추가 정보를 전달할 수도 있습니다.
~로 `record` 행동.

를 업데이트하자 `on_transfer` 이벤트 리시버와 `record` 그들 사이를 연결하는 행동
연결된 작업 패턴을 사용합니다.


먼저 우리는 `multi_index` 전달해야 하는 정보를 저장하기 위한 계약 테이블
두 행동 사이.

```cpp
TABLE transfer_info {
    name from;
    asset quantity;
    
    uint64_t primary_key() const { return from.value; }
};

using _transfers = multi_index<"transfers"_n, transfer_info>;

[[eosio::on_notify("eosio.token::transfer")]]
void on_transfer(name from, name to, asset quantity, string memo){
    _transfers transfers( get_self(), get_self().value );
    transfers.emplace( get_self(), [&]( auto& row ) {
        row.from = from;
        row.quantity = quantity;
    });
}
```

> ⚠ **경고**
>
> 더 많은 검사를 받아야 합니다. `on_transfer` 이 예에서 우리가 여기 있는 것보다. 이 가이드는 아닙니다
> 보안에 대해 명확하게 하기 위해 이러한 검사를 생략하고 있지만 토큰 이벤트 수신기를 배포해서는 안 됩니다.
> 이렇게 제작합니다.

그런 다음 우리 `record` 조치 우리는 전송이 존재하는지 확인할 수 있고 존재한다면 우리는 할 수 있습니다
RAM을 확보하고 논리를 수행하기 위해 테이블에서 삭제하십시오.

그렇지 않은 경우 오류가 발생하여 사용자에게 토큰을 전송해야 한다고 알릴 수 있습니다.
그들이 그것을 사용하기 전에 계약에.


```cpp

ACTION record(name from, uint64_t internal_id, uint8_t status){
    // ...
    _transfers transfers( get_self(), get_self().value );
    auto transfer = transfers.find( from.value );
    check( transfer != transfers.end(), "Must transfer tokens to contract before using it" );
    transfers.erase( transfer );
    
    // Do your logic here
}
```

## RAM 남용 문제

위의 패턴은 잘 작동하지만 문제가 있습니다. 사용자가 계약에 토큰을 전송하는 경우
하지만 절대 부르지 않는다. `record` 조치, 전송 정보를 저장하는 데 사용된 RAM은
해방되다.

귀하의 계약은 RAM에 대한 비용을 지불하는 것이므로 계정이 소량의 토큰을 보낼 수 있음을 의미합니다.
귀하의 RAM을 소비하고 귀하의 계약을 지나치게 비싸게 만드는 귀하의 계약에.

다음을 추가하여 이 문제를 해결할 수 있습니다. `check` ~로 `on_transfer` 수량을 확인하는 이벤트 수신기
전송 정보를 저장하기 전에 일부 임계값을 초과합니다.

```cpp
[[eosio::on_notify("eosio.token::transfer")]]
void on_transfer(name from, name to, asset quantity, string memo){
    check(quantity.amount > 100, "Must transfer more than 100 tokens");
    
    ...    
}
```

또는 이러한 비용을 소비하고 테이블을 주기적으로 정리하여 RAM을 확보할 수 있습니다.
더 이상 필요하지 않습니다.

```cpp
ACTION cleanup(){
    _transfers transfers( get_self(), get_self().value );
    auto transfer = transfers.begin();
    
    uint8_t count = 0;
    while( transfer != transfers.end() && count < 100 ) {
        transfer = transfers.erase( transfer );
        count++;
    }
}
```

RAM 사용량을 줄이려면 이 작업을 주기적으로 직접 호출해야 합니다.
그러나 금전적 가치와 관련이 없는 연결된 행동 패턴의 경우 이는 좋은
RAM 사용량을 줄이는 방법.

## 도전

위의 코드를 변경하여 NFT 전송을 캡처하고 작업을 연결하여
소유자와 올바른 NFT만 트리거할 수 있습니다. `record` 행동?


