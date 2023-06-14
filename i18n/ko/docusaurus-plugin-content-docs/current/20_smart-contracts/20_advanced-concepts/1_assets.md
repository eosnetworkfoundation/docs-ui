---
title: 자산
---

안 `asset` 블록체인 토큰을 위해 특별히 만들어진 특별한 유형입니다.

자산의 두 가지 기본 구성 요소는 `symbol` 그리고 `amount`.

그만큼 `symbol` 문자열과 숫자의 조합입니다. 문자열은
토큰의 이름과 숫자는 소수점 이하 자릿수입니다.

그만큼 `amount` 64비트 부호 있는 정수입니다.

## 자산 정의

계약에 자산을 사용하려면 다음을 포함해야 합니다. `asset.hpp`:

```cpp
#include <eosio/asset.hpp>
```

그런 다음 계약에서 자산 유형을 사용할 수 있습니다. 먼저 기호를 설정해 보겠습니다.

```cpp
symbol TOKEN_SYMBOL = symbol("COOL", 8);
// or
symbol TOKEN_SYMBOL("COOL", 8);
```

이렇게 하면 이름이 있는 기호가 생성됩니다. `COOL` 및 소수점 이하 8자리.

이제 자산을 만들 수 있습니다.

```cpp
asset my_asset = asset(1'00000000, TOKEN_SYMBOL);
// or
asset my_asset(1'00000000, TOKEN_SYMBOL);
```

위의 선언은 자산의 문자열 표현이 다음과 같다는 것을 의미합니다. `1.00000000 COOL`.

## 자산운용사

자산 유형에는 자산을 조작하는 데 사용할 수 있는 몇 가지 연산자가 있습니다.

### 수학 연산

두 자산을 함께 추가할 수 있습니다.

```cpp
asset a = asset(1'00000000, TOKEN_SYMBOL);
asset b = asset(2'00000000, TOKEN_SYMBOL);
asset c = a + b;
```

이로 인해 `c` 동등하다 `3.00000000 COOL`. 또는 그냥
두 자산의 금액을 직접 합산:

```cpp
uint64_t c = a.amount + b.amount;
```

> ⚠ 두 자산의 심볼은 동일해야 합니다.
>
> 다른 기호로 수학 연산을 수행하면 실행 중에 오류가 발생합니다.
> 스마트 계약 내의 자산으로 작업할 때 기호가 일치하는지 항상 확인해야 합니다.

다른 수학 연산도 사용할 수 있습니다.

```cpp
asset a = asset(1'00000000, TOKEN_SYMBOL);
asset b = asset(2'00000000, TOKEN_SYMBOL);
asset c = a - b; 
asset d = a * 2;
asset e = a / 2; 
e += a; 
e -= a; 
e *= 2; 
e /= 2;
```

## 비교 연산자

두 자산을 서로 비교할 수 있습니다.

```cpp
asset a = asset(1'00000000, TOKEN_SYMBOL);
asset b = asset(2'00000000, TOKEN_SYMBOL);
bool c = a > b;
bool d = a < b; 
bool e = a == b; 
bool f = a != b;
```

## 자산 인쇄

오류 메시지 또는 콘솔 로그에서 자산을 인쇄하려면 다음을 사용할 수 있습니다. `to_string()` 방법.

```cpp
asset a = asset(1'00000000, TOKEN_SYMBOL);
check(false, "You have " + a.to_string() + " tokens.");
```

## 유효성 확인

자산을 사용하기 전에 항상 자산이 유효한지 확인해야 합니다. 이것은 `is_valid()` 방법.
이것은 자산이 유효한 값의 범위 내에 있는지와 기호가 유효한지 여부를 확인합니다.

```cpp
asset a = asset(1'00000000, TOKEN_SYMBOL);
check(a.is_valid(), "Asset is not valid.");
```



## 오버플로 고려 사항

자산 유형에는 오버플로우/언더플로우 보호 기능이 내장되어 있습니다.

즉, 두 자산을 함께 추가하려는 경우 결과가 64비트 정수의 최대값보다 크면 오류가 발생합니다.

부호 있는 64비트 정수 범위를 벗어나는 금액으로 자산을 생성할 수 없습니다.






