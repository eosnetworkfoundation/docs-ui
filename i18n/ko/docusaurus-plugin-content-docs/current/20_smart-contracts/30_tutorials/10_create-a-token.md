---
title: "토큰 만들기"
---


토큰은 가상 수집품 또는 게임 내 통화와 같은 소유 가능한 디지털 자산입니다. 데이터 구조에 지나지 않습니다.
블록체인에 저장되는 것입니다.

토큰 계약은 토큰을 구성하는 데이터 구조, 해당 구조의 저장소,
토큰을 조작하기 위해 취할 수 있는 조치.

널리 사용되는 두 가지 유형의 블록체인 토큰이 있습니다.
- **대체 가능한 토큰**은 상호 교환이 가능하며 모든 토큰은 게임의 금처럼 서로 동일합니다.
- **대체 불가능한 토큰**은 수집 가능한 카드나 땅 조각처럼 고유합니다.

이 자습서에서는 *대체 가능한 토큰*인 **GOLD**라는 게임 내 통화를 만듭니다.

## 개발 환경

당신이 가지고 있는지 확인 [모래 언덕](../10_getting-started/10_dune-guide.md) 설치된
계약을 체결하는 방법을 이해합니다.

각 단계가 끝나면 계약을 컴파일하고 오류가 있는지 확인해야 합니다.

## 새 계약 만들기

시작하려면 기본 계약 스캐폴드를 설정해 보겠습니다.

만들기 `token.cpp` 파일을 만들고 다음 코드를 추가합니다.

```cpp
#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include <eosio/singleton.hpp>
using namespace eosio;

CONTRACT token : public contract {

    public:
    using contract::contract;

    // TODO: Add actions
};
```

## 액션 만들기

토큰 계약에는 세 가지 작업이 있습니다.

```cpp
    ACTION issue(name to, asset quantity){
        
    }
    
    ACTION burn(name owner, asset quantity){
        
    }
    
    ACTION transfer(name from, name to, asset quantity, std::string memo){
        
    }
```

이를 계약에 추가한 다음 각 작업을 자세히 살펴보고 수행하는 작업과 수행하는 매개변수를 살펴보겠습니다.

### 문제

그만큼 `issue` 작업은 새 토큰을 생성하여 계정의 잔액과 총 공급량에 추가합니다.

다음 두 가지 매개변수를 사용합니다.
- **to**: 토큰이 발행될 계정
- **quantity**: 발행할 토큰의 양

### 불타다

그만큼 `burn` 조치는 계정의 잔액과 총 공급량에서 토큰을 제거합니다.

다음 두 가지 매개변수를 사용합니다.
- **소유자**: 토큰을 소각할 계정
- **quantity**: 소각할 토큰의 양

### 옮기다

그만큼 `transfer` 액션은 한 계정에서 다른 계정으로 토큰을 전송합니다.

다음 네 가지 매개변수를 사용합니다.
- **from**: 토큰을 보내는 계정
- **to**: 토큰을 받는 계정
- **quantity**: 전송할 토큰의 양
- **메모**: 송금 시 포함할 메모

## 기호 및 정밀도 설정

모든 대체 가능한 토큰에는 **기호**와 **정밀도**가 있습니다.

**기호**는 토큰의 식별자(예: EOS, BTC 또는 이 경우 GOLD)이고 **정밀도**는 토큰이 지원하는 소수 자릿수입니다.
계약에 상수 변수를 추가하여 `symbol` 그리고 `precision` 우리 토큰의.

위에 이것을 추가하십시오 `issue` 행동:

```cpp
    const symbol TOKEN_SYMBOL = symbol(symbol_code("GOLD"), 4);
    
    ACTION issue ...
```

위의 줄은 기호로 토큰을 만들 것임을 의미합니다. `GOLD` 그리고 정밀도 `4`.

그것은처럼 보일 것입니다 `100.0000 GOLD` 또는 `0.0001 GOLD`.

## 데이터 구조 추가

이제 작업을 정의했으므로 토큰 데이터를 저장하는 데 사용할 데이터 구조를 추가하겠습니다.

이것을 아래에 놓으십시오. `TOKEN_SYMBOL` 방금 추가했습니다.

```cpp
    const symbol TOKEN_SYMBOL = symbol(symbol_code("GOLD"), 4);

    TABLE balance {
        name     owner;
        asset    balance;

        uint64_t primary_key()const { 
            return owner.value; 
        }
    };
    
    using balances_table = multi_index<"balances"_n, balance>;
```

방금 만들었습니다. `balance` 에 저장될 데이터를 정의하는 구조체 `balances` 테이블.
그런 다음 `balances_table` type 행을 저장할 테이블의 정의입니다. `balance` 모델.

나중에 `balances_table` 에 대한 참조를 인스턴스화하는 유형 `balances` 테이블에 대한 참조를 사용하십시오.
블록체인에서 데이터를 저장하고 검색합니다.

그만큼 `owner` 재산은 유형입니다 `name` (EOS 계정 이름) 토큰을 소유한 계정을 식별하는 데 사용됩니다.
그만큼 `name` type은 문자열을 64비트 정수로 효율적으로 압축하는 방법입니다. a-z, 1-5 및 마침표로 제한되며
최대 12자입니다.

그만큼 `balance` 재산은 유형입니다 `asset` 계정이 소유한 토큰의 양을 저장하는 데 사용됩니다.
그만큼 `asset` type은 기호, 정밀도 및 금액을 포함하는 특수 유형입니다. 그것은 `asset.symbol` 재산
그리고 `asset.amount` 속성(유형 `int64_t`).

그만큼 `primary_key` 구조의 함수는 인덱싱 목적으로 각 행을 고유하게 식별하는 데 사용됩니다. 이 경우,
우리는 `owner` 필드를 기본 키로 사용하지만 `uint64_t` 대신 효율성을 위해 표현합니다.

다음으로 토큰의 총 공급량을 저장할 또 다른 테이블이 필요합니다. 아래에 이것을 추가하십시오. `balances_table` 방금 추가했습니다:

```cpp
    using supply_table = singleton<"supply"_n, asset>;
```

여기서는 다른 유형의 테이블을 사용하고 있습니다. `singleton`. ㅏ `singleton` 범위당 하나의 행만 있는 테이블입니다.
이것은 구성과 같은 것을 저장하는 데 적합합니다. 토큰의 총 공급량을 저장하는 데 사용할 것입니다.
계약에 하나의 토큰만 있습니다.

또한 우리는 `asset` 저장할 유형
총 공급.

## 액션 채우기

이제 데이터 구조를 정의했으므로 작업을 작성해 보겠습니다.

### 문제

먼저 우리는 `issue` 새 토큰을 생성하고 계정 잔액에 추가하는 작업입니다.

계약이 배포된 계정만 호출할 수 있기를 원합니다. `issue` 추가하겠습니다.
작업을 호출하는 계정이 계약이 배포된 계정과 동일한지 확인하는 어설션.

```cpp
    ACTION issue(name to, asset quantity){
        check(has_auth(get_self()), "only contract owner can issue new GOLD");
    }
```

다음으로 토큰을 발행할 계정이 블록체인에 존재하는지 확인합니다. 우리는 그것을 원하지 않는다
낭비할 달콤한 게임 내 GOLD!

```cpp
    ...
    check(is_account(to), "the account you are trying to issue GOLD to does not exist");
```

다음으로, 우리는 `quantity` 매개변수는 양수이며 올바른
`symbol` 그리고 `precision`.

```cpp
    ...
    check(quantity.is_valid(), "invalid quantity");
    check(quantity.amount > 0, "must issue a positive quantity");
    check(quantity.symbol == TOKEN_SYMBOL, "symbol precision and/or ticker mismatch");
```

쉿! 많은 확인이 필요하지만 게임 내 골드를 보호하고 있는지 확인하는 것이 중요합니다!

이제 잔액 테이블을 다루기 시작하겠습니다.

```cpp
    ...
    balances_table balances(get_self(), get_self().value);
```

우리는 `balances_table` 이전에 정의하고 새 인스턴스를 생성한 유형 `balances_table` 물체. 우리는 통과
`get_self()` 첫 번째 매개변수로 기능( `code` 매개변수), 계약 계정의 이름을 반환합니다. 우리는 통과 `get_self().value`
두 번째 매개변수로( `scope` 매개변수)를 반환합니다. `uint64_t` 계약 계정의 이름을 나타냅니다.

> ❔ **범위**: 범위는 테이블의 행을 함께 그룹화하는 방법입니다. 폴더라고 생각하시면 됩니다.
> 테이블의 모든 행을 포함합니다. 이 경우 계약 계정의 이름을 범위로 사용하므로 모든
> 행 `balances` 테이블은 계약 계정의 이름으로 함께 그룹화됩니다. 만약 당신이
> 범위에 대해 자세히 알아보려면 다음을 확인하세요. [스마트 계약 가이드 시작하기](../10_getting-started/40_smart-contract-basics.md#multi-index-instantiate-with-code-and-scope).

다음으로, 우리는 `to` 계정에 이미 잔액이 있습니다. 다음을 사용하여 이 작업을 수행할 수 있습니다. `find` 기능
`balances` 테이블.

```cpp
    ...
    auto to_balance = balances.find(to.value);
```

그만큼 `find` 함수는 기본 키와 일치하는 테이블의 행에 대한 반복자를 반환합니다. 만약 `to` 계정은 않습니다
잔액이 없으면 `find` 함수는 반복자를 테이블 끝에 반환합니다. 기본 키를 기억하십시오
테이블은 `uint64_t`, 그래서 우리는 `to.value` 얻기 위해 `uint64_t` 의 표현 `to` 계정.

이미 잔액이 있는 경우 기존 잔액에 새 토큰을 추가해야 합니다. 다음을 사용하여 이 작업을 수행할 수 있습니다.
`modify` 기능 `balances` 테이블. 우리는 확인할 것입니다 `to_balance` 반복자가 끝과 같지 않습니다.
그렇지 않은 경우 행을 수정합니다.

```cpp
    ...
    if(to_balance != balances.end()){
        balances.modify(to_balance, get_self(), [&](auto& row){
            row.balance += quantity;
        });
    }
```

그만큼 `modify` 함수는 세 가지 매개변수를 사용합니다.
- **반복자**: 수정하려는 행의 반복자
- **payer**: 수정된 행을 저장하기 위한 RAM 비용을 지불할 계정
- **lambda**: 수정하려는 행에 대한 참조를 제공하는 람다 함수

람다 함수는 실제로 행을 수정하는 곳입니다. 이 경우 기존 토큰에 새 토큰을 추가합니다.
균형.

잔액이 아직 없는 경우 새 잔액을 생성해야 합니다. `to` 계정. 우리는 이것을 사용하여 이것을 할 수 있습니다
그만큼 `emplace` 기능 `balances` 테이블.

```cpp
    ...
    else{
        balances.emplace(get_self(), [&](auto& row){
            row.owner = to;
            row.balance = quantity;
        });
    }
```

그만큼 `emplace` 함수는 두 개의 매개변수를 사용합니다.
- **payer**: 새 행을 저장하기 위한 RAM 비용을 지불할 계정
- **lambda**: 새로운 행에 대한 참조를 제공하는 람다 함수

람다 함수는 실제로 새 행을 초기화하는 곳입니다. 이 경우, 우리는 `owner` ~로 `to`
계정 및 `balance` ~로 `quantity`.

마지막으로 토큰의 총 공급량을 업데이트해야 합니다. 우리는 이것을 얻음으로써 이것을 할 수 있습니다 `supply` 테이블.

```cpp
    ...
    supply_table supply(get_self(), get_self().value);
    auto current_supply = supply.get_or_default(asset(0, TOKEN_SYMBOL));
``` 

우리는 `supply_table` 우리는 이전에 정의하고 새로운 인스턴스를 생성했습니다. `supply_table` 물체. 예전처럼 우린 지나갔어
에서 `get_self()` 첫 번째 및 두 번째 매개변수 모두에 대한 기능(각각: `code`, 그리고 `scope`).

다음으로 우리는 `get_or_default` 토큰의 현재 공급을 가져오거나 새 공급을 생성하기 위한 싱글톤의 기능
이것이 이 계약에서 발행되는 첫 번째 토큰인 경우. 그만큼 `get_or_default` 함수는 하나의 매개변수를 사용합니다.
값이 이미 존재하지 않는 경우 생성할 값입니다. 우리의 경우, 그 기본값은 새로운 `asset` 우리가
값으로 초기화 `0` 그리고 `TOKEN_SYMBOL` 앞에서 정의한 상수입니다. 이것은 다음과 같이 보일 것입니다 `0.0000 GOLD`.

이제 현재 공급이 있으므로 새 토큰을 현재 공급에 추가하고 값을 블록체인에 저장할 수 있습니다.
이후 둘 다 `current_supply` 그리고 `quantity` 유형이다 `asset`, 우리는 `+` 연산자를 사용하여 함께 추가합니다.

> ✔ **자동 오버플로우 방지**
>
> 더 `asset` 클래스는 오버플로우/언더플로우를 자동으로 처리합니다. 오버플로우가 있는 경우
> 오류가 발생하고 트랜잭션이 자동으로 중단됩니다. 당신은 아무것도 할 필요가 없습니다
> 사용시 특별 점검 `asset`. 그러나 사용하는 경우 `uint64_t` 또는 다른 기본 유형.

```cpp
    ...
    auto new_supply = current_supply + quantity;
    supply.set(new_supply, get_self());
```

우리는 `set` 새로운 공급을 블록체인에 저장하는 싱글톤의 기능.

그만큼 `set` 함수는 두 개의 매개변수를 사용합니다.
- **값**: 블록체인에 저장할 새 값
- **payer**: 새로운 값을 저장하기 위해 RAM을 지불할 계정

### 불타다

그만큼 `burn` 동작은 와 매우 유사합니다. `issue` 행동. 유일한 차이점은 우리가 토큰을 빼는 것입니다.
그만큼 `owner` 계정과 공급을 늘리는 대신.

이전과 같이 검사부터 시작한 다음 논리로 들어가겠습니다.

```cpp
    ACTION burn(name owner, asset quantity){
        check(has_auth(owner), "only the owner of these tokens can burn them");
        check(quantity.is_valid(), "invalid quantity");
        check(quantity.amount > 0, "must burn a positive quantity");
        check(quantity.symbol == TOKEN_SYMBOL, "symbol precision and/or ticker mismatch");
    }
```

우리는 `issue` 를 제외한 조치 `is_account` 우리는 이미 될 것이기 때문에 확인
있는지 확인하기 위한 테스트 `owner` 에 균형이 있다 `balances` 테이블.

```cpp
    ...
    balances_table balances(get_self(), get_self().value);
    auto owner_balance = balances.find(owner.value);
    check(owner_balance != balances.end(), "account does not have any GOLD");
```

이제 `owner` 계정에 소각할 충분한 토큰이 있습니다.

```cpp
    ...
    check(owner_balance->balance.amount >= quantity.amount, "owner doesn't have enough GOLD to burn");
```

에 대한 새로운 잔액을 계산해 봅시다. `owner` 계정.

```cpp
    ...
    auto new_balance = owner_balance->balance - quantity;
```

우리는 확인할 필요가 없습니다 `new_balance` 이미 확인했기 때문에 0 미만입니다. `owner` 계정에 충분한 토큰이 있습니다
타다.

에서 토큰을 빼자. `owner` 계정. 만약 `new_balance` 0이면 그냥 지울 수 있습니다.
에서 행 `balances` **RAM**을 저장할 테이블입니다.

```cpp
    ...
    if(new_balance.amount == 0){
        balances.erase(owner_balance);
    }
```

만약 `new_balance` 0이 아니면 다음에서 행을 수정해야 합니다. `balances` 테이블.

```cpp
    ...
    else {
        balances.modify(owner_balance, get_self(), [&](auto& row){
           row.balance -= quantity;
        });
    }
```

또한 총 공급량에서 토큰을 제거해야 합니다.

```cpp
    ...
    supply_table supply(get_self(), get_self().value);
    supply.set(supply.get() - quantity, get_self());
```

짜잔, 이제 가상 GOLD를 태울 수 있습니다.

### 옮기다

그만큼 `transfer` 액션은 생각보다 조금 더 복잡하다. `issue` 그리고 `burn` 행위. 에서 토큰을 전송해야 합니다.
한 계정을 다른 계정으로 연결하고 `from` 계정에 전송할 충분한 토큰이 있습니다.

또한 다른 계약이 우리 토큰과 상호 작용할 수 있도록 만들고 싶습니다.
그 위에 물건을 짓습니다.

다시 확인으로 시작한 다음 논리로 들어가겠습니다.

```cpp
    ACTION transfer(name from, name to, asset quantity, string memo){
        check(has_auth(from), "only the owner of these tokens can transfer them");
        check(is_account(to), "to account does not exist");
        check(quantity.is_valid(), "invalid quantity");
        check(quantity.amount > 0, "must transfer a positive quantity");
        check(quantity.symbol == TOKEN_SYMBOL, "symbol precision and/or ticker mismatch");
    }
```

우리는 이전과 거의 동일한 검사를 수행하고 있지만 이번에는 `from` 계정(발신자)이 하나입니다.
전송을 승인하고 있으며 `to` 계정이 존재합니다.

다음으로, 우리는 `balances` 테이블을 확인하고 `from` 계정에 잔액이 있습니다.

```cpp
    ...
    balances_table balances(get_self(), get_self().value);
    auto from_balance = balances.find(from.value);
    check(from_balance != balances.end(), "account does not have any GOLD");
```

있는지 확인해보자 `from` 계정에 전송할 충분한 토큰이 있습니다.

```cpp
    ...
    check(from_balance->balance.amount >= quantity.amount, "owner doesn't have enough GOLD to transfer");
```

우리는 확인해야합니다 `to` 계정에 잔액이 있습니다. `balances` 테이블.

```cpp
    ...
    auto to_balance = balances.find(to.value);
```

만약 `to` 계정에 잔액이 없으면 새 행을 생성해야 합니다. `balances` 테이블.

```cpp
    ...
    if(to_balance == balances.end()){
        balances.emplace(get_self(), [&](auto& row){
            row.owner = to;
            row.balance = quantity;
        });
    }
```

만약 `to` 계정 _does_에 잔액이 있으면 다음 행을 수정해야 합니다. `balances` 테이블.

```cpp
    ...
    else {
        balances.modify(to_balance, get_self(), [&](auto& row){
            row.balance += quantity;
        });
    }
```

이제 우리는 `from` 계정에 동일한 금액의 잔액이 있습니다. `quantity` 우리는 이전하고 있습니다. 만약에
그런 다음 행을 지울 수 있습니다. `balances` 다시 한 번 **RAM**을 저장합니다.

```cpp
    ...
    if(from_balance->balance.amount == quantity.amount){
        balances.erase(from_balance);
    }
```

만약 `from` 계정의 잔액이 `quantity` 우리는 이전하고 있습니다.
의 행을 수정하십시오. `balances` 테이블.

```cpp
    ...
    else {
        balances.modify(from_balance, get_self(), [&](auto& row){
            row.balance -= quantity;
        });
    }
```

마지막으로 다른 계약에서 수신할 수 있는 이벤트를 내보내야 합니다. 우리는 두 개의 이벤트를 방출할 것입니다. `from` 
수취인으로 계정 및 `to` 받는 사람으로 계정. 이렇게 하면 어느 쪽이든 들을 수 있습니다.
이벤트에 참여하고 해당 계정에 계약이 배포된 경우 이벤트로 작업을 수행합니다.

```cpp
    ...
    require_recipient(from);
    require_recipient(to);
```


## 전체 계약

전체 계약서를 복사하고 자신의 계약서와 일치시키려면 아래에서 찾을 수 있습니다.

<상세>
    <summary>전체 코드를 보려면 여기를 클릭하십시오.</summary>

```cpp
#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include <eosio/singleton.hpp>
using namespace eosio;

CONTRACT token : public contract {
   public:
      using contract::contract;

   const symbol TOKEN_SYMBOL = symbol(symbol_code("GOLD"), 4);

   TABLE balance {
      name     owner;
      asset    balance;

      uint64_t primary_key()const { 
         return owner.value; 
      }
   };

   using balances_table = multi_index<"balances"_n, balance>;

   using supply_table = singleton<"supply"_n, asset>;




   ACTION issue(name to, asset quantity){
      check(has_auth(get_self()), "only contract owner can issue new GOLD");
      check(is_account(to), "the account you are trying to issue GOLD to does not exist");
      check(quantity.is_valid(), "invalid quantity");
      check(quantity.amount > 0, "must issue a positive quantity");
      check(quantity.symbol == TOKEN_SYMBOL, "symbol precision and/or ticker mismatch");

      balances_table balances(get_self(), get_self().value);

      auto to_balance = balances.find(to.value);

      if(to_balance != balances.end()){
            balances.modify(to_balance, get_self(), [&](auto& row){
               row.balance += quantity;
            });
      }
      else{
            balances.emplace(get_self(), [&](auto& row){
               row.owner = to;
               row.balance = quantity;
            });
      }

      supply_table supply(get_self(), get_self().value);

      auto current_supply = supply.get_or_default(asset(0, TOKEN_SYMBOL));

      supply.set(current_supply + quantity, get_self());
   }

   ACTION burn(name owner, asset quantity){
      check(has_auth(owner), "only the owner of these tokens can burn them");
      check(quantity.is_valid(), "invalid quantity");
      check(quantity.amount > 0, "must burn a positive quantity");
      check(quantity.symbol == TOKEN_SYMBOL, "symbol precision and/or ticker mismatch");

      balances_table balances(get_self(), get_self().value);
      auto owner_balance = balances.find(owner.value);
      check(owner_balance != balances.end(), "account does not have any GOLD");
      check(owner_balance->balance.amount >= quantity.amount, "owner doesn't have enough GOLD to burn");

      auto new_balance = owner_balance->balance - quantity;
      check(new_balance.amount >= 0, "quantity exceeds available supply");

      if(new_balance.amount == 0){
         balances.erase(owner_balance);
      }
      else {
         balances.modify(owner_balance, get_self(), [&](auto& row){
               row.balance -= quantity;
         });
      }

      supply_table supply(get_self(), get_self().value);
      supply.set(supply.get() - quantity, get_self());
   }

   ACTION transfer(name from, name to, asset quantity, std::string memo){
      check(has_auth(from), "only the owner of these tokens can transfer them");
      check(is_account(to), "to account does not exist");
      check(quantity.is_valid(), "invalid quantity");
      check(quantity.amount > 0, "must transfer a positive quantity");
      check(quantity.symbol == TOKEN_SYMBOL, "symbol precision and/or ticker mismatch");

      balances_table balances(get_self(), get_self().value);
      auto from_balance = balances.find(from.value);
      check(from_balance != balances.end(), "from account does not have any GOLD");
      check(from_balance->balance.amount >= quantity.amount, "from account doesn't have enough GOLD to transfer");

      auto to_balance = balances.find(to.value);
      if(to_balance == balances.end()){
         balances.emplace(get_self(), [&](auto& row){
               row.owner = to;
               row.balance = quantity;
         });
      }
      else {
         balances.modify(to_balance, get_self(), [&](auto& row){
               row.balance += quantity;
         });
      }

      if(from_balance->balance.amount == quantity.amount){
         balances.erase(from_balance);
      }
      else {
         balances.modify(from_balance, get_self(), [&](auto& row){
               row.balance -= quantity;
         });
      }

      require_recipient(from);
      require_recipient(to);
   }
};
```
</세부 사항>


## 전투 테스트를 거친 소스 코드를 잡아라

EOS 네트워크에서 대부분의 대체 가능한 토큰에 사용되는 소스 코드를 간단히 사용하고 싶다면
[eosio.token](https://github.com/eosnetworkfoundation/eos-system-contracts/tree/4702c8f2d95dd06f0924688560b8457962522216/contracts/eosio.token)
그것을 잡아 저장소. 이 코드 전투는 테스트되었을 뿐만 아니라 기본 EOS 토큰을 지원합니다.

기준이니 참고하세요 `eosio.token` 계약은 이 튜토리얼과 상당히 다릅니다. 그것은 더 복잡한
계약과 상호 작용하는 사용자가 자신의 RAM 비용을 지불할 수 있도록 허용하는 것과 같은 고급 기능을 허용하는 계약,
또는 단일 계약 내에서 여러 토큰을 생성합니다.

당신은 필요합니다 `create` 새 토큰을 추가한 다음 `issue` 해당 토큰을 계정으로 전송하기 전에.
당신은 또한 필요합니다 `open` 토큰을 이체하기 전에 계정의 잔액.


## 도전

이 토큰에는 `MAXIMUM_SUPPLY`. 최대 공급량을 정의하는 상수를 계약에 어떻게 추가할 수 있습니까?
토큰을 확인하고 `issue` 조치가 이 최대 공급을 초과하지 않습니까?
