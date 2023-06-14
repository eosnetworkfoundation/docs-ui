---
title: 작업 유형
---

작업은 스마트 계약의 진입점입니다. 통해 계정에서 호출할 수 있는 기능입니다.
인라인 작업을 통해 블록체인의 API 또는 다른 스마트 계약과 상호 작용합니다.

EOS 네트워크로 전송되는 트랜잭션에는 하나 이상의 작업이 포함됩니다.

EOS에는 다양한 목적으로 사용되는 작업을 선언할 수 있는 몇 가지 방법이 있습니다.


## 호출 가능한 작업

호출 가능한 작업은 가장 일반적인 작업 유형입니다.
그들은 모든 계정에서 호출할 수 있는 계약에 대한 사용자 지정 진입점을 설정합니다.

두 가지 방법으로 호출 가능 조치를 정의할 수 있습니다.


### 사용 `[[eosio::action]]` 기인하다

```cpp
[[eosio::action]] void youraction(){}
```

이는 작업을 정의하는 가장 다양한 방법입니다. 그것은 당신이 지정할 수 있습니다
작업이 값을 반환하도록 할 수 있도록 작업의 반환 유형입니다.

> ⚠ **반환 값 및 결합 가능성**
>
> 리턴 값은 블록체인 외부에서만 사용 가능하며, 현재 사용 불가
> 스마트 컨트랙트 결합성을 위해 EOS에서.

### 사용 `ACTION` 매크로

```cpp
ACTION youraction(){}
```

이것은 다음의 줄임말입니다. `[[eosio::action]]` 기인하다. 하지만,
포함하는 작업의 반환 유형을 지정할 수 없습니다. `void`
기본적으로 반환 유형입니다.


## 이벤트 수신자

이벤트 수신자는 작업이 아니라 다른 작업이 계약에 태그를 지정할 때 호출되는 기능입니다.
수신자로. 이는 토큰 전송과 같은 다른 스마트 계약을 추적하는 데 유용합니다.

아래는 이벤트를 보내는 계약과 이벤트를 받는 계약의 두 가지 계약입니다.

### 발신자 계약

```cpp
[[eosio::action]] 
void transfer(name from, name to, asset quantity, std::string memo) {
    require_recipient(to);
}
```

그만큼 `require_recipient` 함수는 다음으로 이벤트를 보냅니다. `to` 계정. 만약 `to` 계정이
이벤트를 수신하는 스마트 계약이 있으면 이벤트에 따라 조치를 취할 수 있습니다.

> ❔ **이벤트는 누가 받을 수 있나요?**
>
> 모든 계정이 이벤트를 받을 수 있지만, `require_recipient` 기능
> 알려드립니다. 귀하를 수신자로 요구하지 않은 계약의 이벤트를 수신할 수 없습니다.


### 수신자 계약

```cpp
[[eosio::on_notify("*::transfer")]] 
void catchevent(name from, name to, asset quantity, std::string memo) {
    print("Received ", quantity, " from ", from);
}
```

### on_notify 구문 이해

그만큼 `on_notify` 속성은 문자열을 인수로 사용합니다. 이 문자열은 결정하는 데 사용되는 필터입니다.
어떤 행동이 `catchevent` 행동. 필터는 다음과 같은 형태입니다. `contract::action`, 어디 `contract`
이벤트를 전송하는 컨트랙트의 이름이며, `action` 해당 계약 내의 작업 이름입니다.
이벤트를 촉발했습니다.

그만큼 `*` 문자는 모든 계약 또는 작업과 일치하는 와일드카드입니다. 따라서 위의 예에서 `catchevent` 행동
계약이 보낼 때마다 호출됩니다. `transfer` 에 대한 조치 `receiver` 계약.

와일드카드는 필터의 계약 및 작업 측면 모두에서 지원되므로 모든 계약, 모든 작업 또는 둘 다를 일치시키는 데 사용할 수 있습니다.

예:
- `*::*` - 모든 계약 및 작업 일치
- `yourcontract::*` - 모든 작업 일치 `yourcontract`
- `*::transfer` - 아무거나 일치 `transfer` 모든 계약에 대한 조치
- `yourcontract::transfer` - 일치하는 `transfer` 에 대한 조치 `yourcontract`

## 인라인 액션

인라인 액션은 액션 내에서 다른 액션을 호출하는 방법입니다. 이것을 보여드리겠습니다
두 개의 간단한 계약으로 아래에서.


### 호출자 계약

```cpp
// This contract is deployed to the account `contract1`
[[eosio::action]]
void callme(name user) {
    action(
        permission_level{get_self(), name("active")},
        name("contract2"),
        name("inlined"),
        std::make_tuple(user)
    ).send();
}
```

### 수신자 계약

```cpp
// This contract is deployed to the account `contract2`
[[eosio::action]]
void inlined(name user) {
    print("I was called by ", user);
}
```

전화를 걸었다면 `callme` 에 대한 조치 `contract1`, 그것은 인라인 작업을 보낼 것입니다 `contract2`, 그것은
그런 다음 `inlined` 조치를 취하고 매개변수로 전달된 사용자의 이름을 인쇄하십시오.

의 구조를 살펴보자. `action` 함수 호출:

```cpp
action(permission_level, code, action, data).send();
```

그만큼 `action` 함수는 다음 네 가지 인수를 사용합니다.

#### 권한 수준

그만큼 `permission_level` 인수는 작업이 호출될 권한 수준을 지정하는 데 사용됩니다.
계약은 **반드시** 작업을 호출할 권한이 있어야 합니다. 그렇지 않으면 인라인 작업 호출이 실패합니다.

구성하려면 `permission_level`:
```cpp
permission_level{name account, name permission}
```

#### 코드

그만큼 `code` 인수는 조치가 호출될 계정을 지정하는 데 사용됩니다.

#### 행동

그만큼 `action` 인수는 호출될 조치의 이름을 지정하는 데 사용됩니다.

#### 데이터

그만큼 `data` 인수는 조치에 전달될 데이터를 지정하는 데 사용됩니다.
다음을 사용해야 합니다. `std::make_tuple` 작업에 전달될 인수의 튜플을 만드는 함수입니다.

그만큼 `tuple` 조치에 전달될 인수의 쉼표로 구분된 목록입니다.

> ⚠ **컨트랙트는 새로운 송신자입니다**
>
> 인라인 작업을 호출하면 작업을 호출하는 계약이 새 발신자가 됩니다.
> 위의 조치를 보낸 경우 `someaccount`, 그 다음에 `contract2` 볼 것이다 `contract1` 보낸 사람으로
> 인라인 작업의 `someaccount`.
>
> 이것은 다음을 의미하므로 주의해야 합니다. `require_auth` 토큰 계약과 같은 기능
> 다른 계정을 대신하여 토큰을 보낼 수 없습니다.

### 코드 권한

그만큼 `eosio.code` 권한은 계약이 인라인 작업을 호출할 수 있도록 허용하는 특수 계정 권한입니다.
이 권한이 없으면 계약에서 다른 계약에 대한 작업을 호출할 수 없습니다.

이 권한은 `active` 권한 수준, 다른 계약이 사용하도록 `require_auth`
기능은 귀하의 계약에 조치를 호출할 권한이 있는지 확인할 수 있습니다.

코드 권한을 추가하려면 다음에서 제어할 계정의 활성 권한을 업데이트해야 합니다.
`<YOURACCOUNT>@eosio.code` **현재 활성 권한과 함께**.

> ⚠ **현재 활성 권한 컨트롤러를 제거하지 마십시오**
>
> 더 `eosio.code` 권한은 기존 활성 권한을 대체하는 것이 아니라 추가하기 위한 것입니다.
> 현재 활성 권한 컨트롤러를 제거하면 계정/계약에 대한 액세스 권한을 잃게 됩니다.

계정에 대한 코드 권한이 있는 예제 권한 구조 `yourcontract` 다음과 같이 보일 것입니다:
- **소유자**: `YOUR_PUBLIC_KEY`
  - **활동적인**:
      - `YOUR_PUBLIC_KEY`
      - `yourcontract@eosio.code`

