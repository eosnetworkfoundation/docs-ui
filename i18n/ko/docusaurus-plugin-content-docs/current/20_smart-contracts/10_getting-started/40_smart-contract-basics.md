--- 
title: 스마트 계약 기초
---

스마트 계약은 블록체인에서 실행되는 프로그램입니다. Todo 애플리케이션과 같은 단순한 것부터 블록체인에서 완전히 실행되는 본격적인 RPG 게임에 이르기까지 계정에 기능을 추가할 수 있습니다.

이 가이드는 **DUNE** 및 C++ 프로그래밍 언어를 사용하여 기본 EOS 스마트 계약을 개발하는 방법을 보여줍니다.

## 준비 단계

### 계약 계정 생성

스마트 계약을 배포하려면 배포할 계정이 필요합니다. 계정 만들기 `hello` 다음 명령으로:

```shell
dune --create-account hello
```

### 테스트 계정 만들기

두 번째 계정을 만들고, `ama`, 테스트 목적으로.

```shell
dune --create-account ama
```

### 듄

스마트 계약을 개발하기 위해 노드 관리 기능을 수행하고, 스마트 계약을 컴파일하고, EOS 블록체인에서 스마트 계약을 개발하는 데 필요한 기타 여러 일반적인 작업을 수행할 수 있는 도구인 DUNE(노드 실행용 Docker 유틸리티)를 사용합니다.

DUNE이 설치되어 있는지 확인하십시오. 그렇지 않으면 다음을 따르십시오. [DUNE 개발 설정](../10_getting-started/10_dune-guide.md#installation) 선적 서류 비치.

## 스마트 계약 생성

스마트 계약을 생성하려면 다음이 필요합니다.

1. DUNE 기본 애플리케이션을 생성합니다.
2. 원하는 사용자 지정 작업을 수행하도록 애플리케이션을 확장합니다.
3. 스마트 계약을 출력하는 DUNE 애플리케이션을 빌드합니다.
4. 애플리케이션 구축 결과 스마트 계약을 배포합니다.

### DUNE 애플리케이션 생성

```shell
dune --create-cmake-app hello .
cd hello
ls
```

이 명령의 결과는 `hello` 다음 구조의 디렉토리:

- CMakeLists.txt, cmake 구성 파일.
- README.txt, cmake로 이 응용 프로그램을 빌드하는 방법에 대한 정보가 포함된 텍스트 파일입니다.
- build, 처음에 출력 빌드 폴더가 비어 있습니다.
- include, C++ 포함 파일 폴더, 처음에는 hello.hpp 파일만 포함합니다.
- ricardian 폴더에는 스마트 계약 ricardian 정의인 hello.contracts.md 파일이 포함되어 있습니다.
- src, C++ 구현 파일 폴더, 처음에는 hello.cpp 파일만 포함되어 있습니다.

### DUNE 애플리케이션 구축

DUNE cmake 애플리케이션을 빌드하려면 다음 명령을 실행하십시오.

```shell
dune --cmake-build <PATH_TO_CMakeLists.txt_PARENT_DIR>
ls <PATH_TO_CMakeLists.txt_PARENT_DIR>/build/hello
```

위 빌드 명령의 결과는 `./build/hello/` 폴더:

- hello.wasm, 스마트 계약용 WebAssembly 바이너리 파일.
- hello.abi, 스마트 계약용 애플리케이션 바이너리 인터페이스(ABI) 파일.

### 스마트 계약 배포

다음 명령을 실행하여 `hello` 에 스마트 계약 `hello` 계정:

```shell
dune --deploy <PATH_TO_CMakeLists.txt_PARENT_DIR>/build/hello
```

## 스마트 계약 소스 파일

스마트 계약 C++ 소스 파일은 다음과 같습니다.

- hello.hpp
-hello.cpp

### hpp 파일

C++ 프로그래밍에서는 `.hpp` file은 프로그램의 다른 부분에서 사용하기 위한 클래스, 함수, 변수 및 기타 엔터티의 선언을 포함하는 헤더 파일입니다. 그만큼 `.hpp` 파일은 일반적으로 소스 코드 파일(`.cpp`) #include 전처리기 지시문을 사용합니다.

그만큼 `hello.hpp` 포함 `hello` 스마트 계약 C++ 클래스 선언.

```cpp
#include <eosio/eosio.hpp>
using namespace eosio;

CONTRACT hello : public contract {
   public:
      using contract::contract;

      ACTION hi( name nm );
};
```

스마트 계약 클래스 선언은 다음을 충족해야 합니다.

- 컴파일러에게 스마트 계약 클래스임을 알리는 [[eosio::contract]] 속성에 의해 주석이 추가됩니다. 에서 `hello.hpp` 생성된 코드 `CONTRACT` `macro` 로 확장되어 사용됩니다. `class [[eosio::contract]]` 컴파일 시간의 C++ 코드.
- 에서 파생 `contract` 기본 스마트 계약 기능을 제공하는 클래스입니다.
- 적어도 공개 행동 기능을 정의하십시오.

> ℹ️ **C++ 매크로**
C++에서는 `macro` 코드 또는 값의 속기를 정의하는 방법입니다. 때 `macro` 가 코드에서 사용되면 전처리기는 코드가 컴파일되기 전에 자동으로 해당 정의로 대체합니다. 이렇게 하면 반복을 줄이고 추상화를 증가시켜 코드를 더 읽기 쉽고 유지 관리할 수 있습니다.

나중에 작업에 대해 자세히 알아볼 것입니다.

### cpp 파일

C++ 프로그래밍에서는 `.cpp` 파일은 C++ 코드를 포함하는 소스 코드 파일입니다. 그만큼 `.cpp` file은 원하는 기능을 수행하는 코드의 실제 구현을 포함하므로 C++ 프로젝트에서 가장 중요한 파일 중 하나입니다.

그만큼 `hello.cpp` 파일에는 `hello` 클래스의 모든 멤버 함수에 대한 스마트 계약 C++ 클래스 구현.

## 작업

작업은 스마트 계약 클래스에 의해 정의되고 구현되는 메서드입니다. 작업에는 매개 변수와 반환 값이 있을 수 있으며 그들의 책임은 계약의 비즈니스 논리를 실행하는 것입니다. 다른 계약이나 EOS Chain API를 사용하는 외부 계정에서 호출할 수 있습니다. 각 작업에는 작업의 코드에서 지정할 수 있는 특정 수준의 인증이 필요할 수 있습니다.

그만큼 `hello` 스마트 계약 클래스에는 하나의 작업만 구현됩니다. `hi` 공개 회원 기능.

```cpp
#include <hello.hpp>

ACTION hello::hi( name nm ) {
   /* fill in action body */
   print_f("Name : %\n",nm);
}
```

스마트 계약 작업을 구현하는 기능은 `[[eosio::action("action.name")]]` 기인하다. 그만큼 `action.name` 선택 사항이며 지정하지 않으면 작업을 구현하는 함수 이름으로 작업 이름이 지정됩니다.
에서 `hello.cpp` 생성된 코드 `ACTION` 다음으로 확장되는 매크로가 사용됩니다. `[[eosio::action]] void` 컴파일 시간의 C++ 코드.

작업 이름은 다음과 같아야 합니다.

- 13자 이하여야 합니다.
- 만 포함 `.`, `a`-`z`, 또는 `1`-`5` 문자.
- 로 끝나지 않음 `.`.

다음을 사용할 때 참고하십시오. `ACTION` 매크로 액션 이름은 이를 구현하는 함수 이름과 동일합니다. 그 때문에 액션 이름도 C++ 함수 이름의 제한 사항을 상속합니다. `.` 그것에.
당신이 사용하는 경우 `[[eosio::action("action.name")]]` 특성을 구현하는 함수 이름과 다르게 작업 이름을 지정할 수 있습니다.

### 액션 보내기

보내기 `hi` 로컬 노드에 대한 조치를 취하고 입력 매개변수로 설정합니다. `ama` 테스트 계정 이름:

```shell
dune --send-action hello hi '[ama]' hello@active
```

위 명령의 출력은 다음과 같은 한 줄에 표시됩니다. `hello::hi` 작업이 입력 매개변수로 실행되었습니다. `{"nm":"ama"}` 두 번째 줄에는 작업 자체의 출력이 있습니다. `Name: ama`.

```txt
#         hello <= hello::hi   {"nm":"ama"}
>> Name : ama
```

## 인라인 액션

인라인 작업은 스마트 계약 작업에 의해 시작되며 상위 작업과 동일한 트랜잭션 내에서 실행됩니다. 인라인 작업은 스마트 계약 작업이 다른 스마트 계약과 상호 작용해야 하는 상황에서 유용합니다. 잠재적으로 새 트랜잭션이 발생할 수 있는 다른 계약에 대한 외부 호출을 수행하는 대신 동일한 트랜잭션 내에서 작업을 인라인으로 실행할 수 있습니다. 트랜잭션의 일부가 실패하면 인라인 작업이 나머지 트랜잭션과 함께 해제됩니다.

인라인 작업을 실행하는 가장 쉬운 방법은 다음을 사용하는 것입니다. `SEND_INLINE_ACTION` 매크로.

### 인라인 작업 보내기

Hello 스마트 계약을 다음과 같이 확장해 보겠습니다.

- 라는 새 작업을 구현합니다. `inlineaction` 콘솔에 메시지를 인쇄합니다.
- 수정 `hi` 인라인을 보내는 작업 `inlineaction` 블록체인에 대한 조치.

```hpp
#include <eosio/eosio.hpp>
using namespace eosio;

CONTRACT hello : public contract {
   public:
      using contract::contract;

      ACTION hi( name nm );
      ACTION inlineaction();
};
```

```cpp
#include <hello.hpp>

ACTION hello::hi( name nm ) {
   print_f("Name : %\n",nm);

   SEND_INLINE_ACTION(*this, inlineaction, {get_self(), "active"_n}, {});
}

ACTION hello::inlineaction() {
   printf("Inline action message.\n");
}
```

그만큼 `SEND_INLINE_ACTION` 매크로 세 번째 매개변수는 `_n()` 변환할 문자열 연산자 `"active"` 문자열을 `name` 물체. `"active"_n` 바로 가기입니다 `name("active")`. 그리고 `name` EOS 내장형입니다. 이 가이드의 뒷부분에서 기본 제공 형식에 대해 자세히 알아봅니다.

> ℹ️ **C++ 연산자**
C++ 프로그래밍에서 연산자는 변수 또는 값에 대한 작업을 수행하는 데 사용되는 기호 또는 키워드입니다. C++ 연산자의 예로는 산술 연산자(+, -, *, /), 대입 연산자(=, +=, -=, *=, /=), 비교 연산자(==, !=, <, >, <)가 있습니다. =, >=), 논리 연산자(&&, ||, !) 등이 있습니다.

이전에 했던 것처럼 스마트 계약을 다시 빌드하고 로컬 노드에 배포합니다.

보내 `hi` 로컬 노드에 대한 조치를 취하고 둘 다 관찰하십시오. `hi` 그리고 `inlineactions` 조치가 실행됩니다.

```shell
dune --send-action hello hi '[ama]' hello@active
```

```txt
#         hello <= hello::hi                    {"nm":"ama"}
>> Name : ama
#         hello <= hello::inlineaction          ""
>> Inline action message.
```

## 내장 유형

EOS는 스마트 계약 개발을 위한 여러 C++ 데이터 유형을 지원합니다. 개발자는 이러한 유형을 사용하여 데이터 구조를 정의하고 EOS 블록체인 및 스마트 계약 시스템과 상호 작용하는 기능을 작성할 수 있습니다.

다음은 내장 유형의 전체 목록입니다.

| 적분 유형 | 설명 |
| --- | --- |
| 포함할 헤더 파일 | `<eosio/eosio.hpp>` |
| `bool` | 부울(참/거짓) |
| `int8_t` | 부호 있는 8비트 정수 |
| `uint8_t` | 무부호 8비트 정수 |
| `int16_t` | 부호 있는 16비트 정수 |
| `uint16_t` | 부호 없는 16비트 정수 |
| `int32_t` | 부호 있는 32비트 정수 |
| `uint32_t` | 부호 없는 32비트 정수 |
| `int64_t` | 부호 있는 64비트 정수 |
| `uint64_t` | 부호 없는 64비트 정수 |
| `int128_t` | 부호 있는 128비트 정수 |
| `uint128_t` | 부호 없는 128비트 정수 |
| 포함할 헤더 파일 | `<eosio/varint.hpp>` |
| `signed_int` | 가변 길이 부호 있는 32비트 정수 |
| `unsigned_int` | 가변 길이 부호 없는 32비트 정수 |

| 플로트 유형 | 설명 |
| --- | --- |
| 포함할 헤더 파일 | `<eosio/eosio.hpp>` |
| `float` | 32비트 부동 소수점 숫자 |
| `double` | 64비트 부동 소수점 숫자 |

| 시간 유형 | 설명 |
| --- | --- |
| 포함할 헤더 파일 | `<eosio/eosio.hpp>` |
| `time_point` | 특정 시점 |
| `time_point_sec` | 초정밀도의 특정 시점 |
| `block_timestamp_type` | 블록 타임스탬프 |

| 이름 유형 | 설명 |
| --- | --- |
| 포함할 헤더 파일 | `<eosio/eosio.hpp>` |
| `name` | 계정 이름 |

| Blob 유형 | 설명 |
| --- | --- |
| 포함할 헤더 파일 | `<eosio/eosio.hpp>` |
| `bytes` | 원시 바이트 시퀀스 |
| `string` | 문자열 |

| 체크섬 유형 | 설명 |
| --- | --- |
| 포함할 헤더 파일 | `<eosio/eosio.hpp>` |
| `checksum160` | 160비트 체크섬 |
| `checksum256` | 256비트 체크섬 |
| `checksum512` | 512비트 체크섬 |

| 암호화 유형 | 설명 |
| --- | --- |
| 포함할 헤더 파일 | `<eosio/crypto.hpp>` |
| `public_key` | 공개 키 |
| `signature` | 서명 |

| 자산 유형 | 설명 |
| --- | --- |
| 포함할 헤더 파일 | `<eosio/asset.hpp>` |
| `symbol` | 자산 기호 |
| `symbol_code` | 자산 기호 코드 |
| `asset` | 자산 |
| `extended_asset` | 확장된 정밀도의 자산 |

## 멀티 인덱스 테이블

다중 인덱스 테이블은 개발자가 지속적이고 효율적인 방식으로 데이터를 저장하고 관리할 수 있는 데이터베이스와 같은 데이터 구조입니다. 다중 인덱스 테이블은 다음을 사용하여 정의됩니다. `TABLE` 매크로를 사용하며 각각 관련 데이터 요소 집합을 포함하는 여러 행을 저장할 수 있습니다.

연장하다 `hello` 계약:

- 추가 `userdata` 테이블 선언.
- 추가하다 `createrow` 관리자가 아닌 새 사용자를 생성하는 작업입니다.
- 추가하다 `readrow` 사용자의 데이터를 읽는 작업.
- 추가하다 `updaterow` 기존 사용자의 데이터를 업데이트하는 작업입니다.
- 추가하다 `deleterow` 기존 사용자의 데이터를 삭제하는 조치.

hello.hpp 파일은 다음과 같습니다.

```cpp
#include <eosio/eosio.hpp>
using namespace eosio;

CONTRACT hello : public contract {
   public:
      using contract::contract;

      ACTION hi(name nm);

      ACTION inlineaction();

      // Table actions
      ACTION createrow(name nm);
      ACTION readrow(name nm);
      ACTION updaterow(name nm, bool is_admin);
      ACTION deleterow(name nm);

   private:

   TABLE user_data {
      name user;
      bool is_admin;

      uint64_t primary_key() const { return user.value; }
   };
   using user_data_table = eosio::multi_index<"userdata"_n, user_data>;
};
```

위의 코드는 `user_data_table` 이름이 있는 테이블의 유형인 type `userdata`에 의해 정의된 행을 저장하는 `user_data` 구조. 구조에는 두 개의 필드가 있습니다. 계정 `name`, 사용자가 관리자인지 나타내는 부울. 그만큼 `primary_key()` 인라인 메서드는 테이블의 기본 키를 정의하며, 이 경우 64비트 부호 없는 정수 값으로 표시되는 사용자의 계정 이름입니다.

다중 인덱스 테이블의 이름은 작업 이름과 동일한 제한이 있습니다.

### 다중 색인: 코드 및 범위로 인스턴스화

개발자는 `user_data_table` 유형을 입력하여 테이블 **내** 참조를 인스턴스화하고 해당 테이블에서 다음과 같은 다양한 작업을 수행합니다.

- 특정 데이터에 대한 테이블 쿼리,
- 새 행 삽입,
- 기존 행 수정,
- 기존 행을 삭제합니다.

이름이 있는 테이블 내에서 참조를 정의하는 방법입니다. `userdata`:

```cpp
user_data_table users(get_self(), get_self().value);
```

첫 번째 매개변수는 `code` 매개변수이고 두 번째는 `scope`.

- `code` (`name`)는 스마트 계약(및 테이블)을 소유한 계정입니다.

- `scope` (`integer`)는 다중 인덱스 테이블 내에서 관련 데이터를 그룹화하는 데 사용됩니다. 동일한 계약 내에서 모든 관련 데이터를 그룹화하기 위해 범위는 종종 계약 계정 자체로 설정됩니다.

위의 코드에서 `code`, 로 초기화됩니다. `get_self()`, 계약이 배포된 계정을 반환합니다. 그만큼 `scope`, 로 초기화됩니다. `get_self().value`, 계정 이름의 숫자 표현을 반환합니다.

이 두 매개변수를 사용하면 서로 다른 테이블에 액세스할 수 있습니다. `instances` 같은 테이블의 `type`. 예를 들어, 동일한 `code` 두 번째 매개변수에 다른 값을 사용하여 동일한 유형의 다른 테이블에 액세스할 수 있습니다. `scope`. 이 모든 테이블은 동일한 계정 집합에 속합니다. `code` 매개변수.

그것을 보는 또 다른 방법은 `users` object는 이름이 있는 테이블 내의 참조입니다. `userdata` (유형입니다 `user_data_table`). 이 참조는 이 테이블에 할당된 RAM 저장 공간 내의 주소입니다. `code` 그리고 `scope` 정의 ( `get_self()` 그리고 `get_self().value`). 내부 테이블 수 `userdata` 테이블은 (`code`, `scope`) 쌍은 테이블 참조를 인스턴스화하는 데 사용됩니다.

다음으로 선언된 각 작업을 구현합니다. `hello.hpp` 파일. 열기 `hello.cpp` 파일을 만들고 다음 함수 구현을 복사하여 붙여넣습니다.

### 멀티 인덱스: 행 생성

이것은 행을 만드는 방법입니다. `user_data_table`:

```cpp
ACTION hello::createrow(name nm) {
   user_data_table users(get_self(), get_self().value);

   auto itr = users.find(name.value);

   if ( itr == users.end() ) {
      users.emplace(get_self(), [&](auto& row) {
         row.user = nm;
         row.is_admin = false;
      });
      printf("User % added as non-admin.\n", nm);
   }
   else {
      printf("User % already exists.\n", nm);
   }
}
```

위의 코드는 다음을 사용합니다. `emplace` 새 사용자를 테이블에 삽입하는 메서드입니다.

### 멀티 인덱스: 행 읽기

쿼리하는 방법입니다. `user_data_table` 기본 키를 기반으로:

```cpp
ACTION hello::readrow(name nm) {
   user_data_table users(get_self(), get_self().value);

   auto itr = users.find(nm.value);
   if ( itr != users.end() ) {
      if (itr->is_admin) {
         print_f("User admin % found.\n", itr->user);
      }
      else {
         print_f("User non-admin % found.\n", itr->user);
      }
   }
   else {
      printf("User % not found.\n", nm);
   }
}
```

### 다중 색인: 행 수정

기존 행을 수정하는 방법입니다. `user_data_table`:

```cpp
ACTION hello::updaterow(name nm, bool is_admin) {
   user_data_table users(get_self(), get_self().value);

   auto itr = users.find(nm.value);
   if ( itr != users.end() ) {
      users.modify(itr, get_self(), [&](auto& row) {
         row.is_admin = is_admin;
      });
      print_f("User % is_admin was set to %.\n", itr->user, itr->is_admin);
   }
   else{
      printf("User % not found.\n", nm);
   } 
}
```

### 다중 인덱스: 행 삭제

다음은 엔터티를 삭제하는 방법입니다. `user_data_table`:

```cpp
ACTION hello::deleterow(name nm) {
   user_data_table users(get_self(), get_self().value);

   auto itr = users.find(nm.value);
   if ( itr != users.end() ) {
      users.erase(itr);
      printf("User % erased.\n", nm);
   }
   else{
      printf("User % not found.\n", nm);
   }
}
```

### 멀티 인덱스: 테스트

스마트 계약을 다시 빌드하고 배포하고 `createrow` 몇 번 행동하고 결과를 관찰하십시오.

```shell
dune --send-action hello createrow '[ama]' hello@active
```

```txt
#         hello <= hello::createrow             {"nm":"ama"}
>> User added as non-admin.
```

```shell
dune --send-action hello createrow '[ama]' hello@active
```

```txt
#         hello <= hello::createrow             {"nm":"ama"}
>> User already exists.
```

첫 번째 작업이 관리자가 아닌 사용자를 생성한 방법에 유의하십시오. `ama` 두 번째는 사용자가 이미 존재했기 때문에 발생하지 않았습니다.

읽기 `ama` 사용자 데이터:

```shell
dune --send-action hello readrow '[ama]' hello@active
```

```txt
#         hello <= hello::readrow               {"nm":"ama"}
>> User non-admin ama found.
```

사용자 만들기 `ama` 관리자:

```shell
dune --send-action hello updaterow '[ama, 1]' hello@active
```

```txt
#         hello <= hello::updaterow             {"nm":"ama","is_admin":1}
>> User ama is_admin was set to true.
```

사용자 삭제 `ama`:

```shell
dune --send-action hello deleterow '[ama]' hello@active
```

```txt
#         hello <= hello::deleterow             {"nm":"ama"}
>> User erased.
```

## 싱글톤

싱글톤은 싱글톤 유형의 각 인스턴스에 대해 단일 데이터 행을 저장하도록 설계된 특수 다중 인덱스 테이블입니다. 싱글톤은 계약에서 전역 상태 변수 또는 구성 매개변수를 저장하는 데 자주 사용됩니다.

코드와 범위에 대한 설명을 기억하는 것이 중요합니다. 싱글톤을 인스턴스화할 때 코드 매개변수를 고정하고 범위 매개변수를 변경할 수 있습니다. 이렇게 하면 범위당 하나의 항목을 저장할 수 있으므로 예를 들어 계정별 구성을 저장할 수 있습니다.

다음은 싱글톤 선언의 예입니다.

```cpp
TABLE statsdata {
    int count;
};
using stats_singleton = eosio::singleton<"stats"_n, statsdata>;
```

위의 코드는 싱글톤 유형을 정의합니다. `stats_singleton`. 이 싱글톤은 다음에 의해 정의된 통계 데이터를 저장합니다. `statsdata` 구조. 구조는 다음을 포함합니다. `count` 임의의 정수 값을 보유할 수 있는 데이터 멤버입니다.

개발자는 `stats_singleton` 단일 테이블의 참조를 인스턴스화하고 다음과 같은 다양한 작업을 수행하기 위한 템플릿 유형:

- 싱글톤 데이터를 읽고,
- 기존 싱글톤 데이터 수정,
- 기존 싱글톤 데이터를 삭제합니다.

### 싱글톤: 코드 및 범위로 인스턴스화

코드와 범위는 [다중 인덱스 테이블](#multi-index-code-and-scope).
이것은 이름이 있는 싱글톤 내에서 참조를 인스턴스화하는 방법입니다. `stats`. 그만큼 `code` 그리고 `scope` 약정 소유자 계정으로 설정됩니다.

```cpp
   stats_singleton stats(get_self(), get_self().value);
```

확장 `hello` 다음과 계약:

- 싱글톤 추가 `stats`.
- 추가하다 `updatestats` 주어진 값으로 통계를 업데이트하는 작업입니다.
- 추가하다 `readstats` 싱글톤에 저장된 통계를 읽는 작업입니다.
- 추가하다 `deletestats` 싱글톤에 저장된 통계를 삭제하는 작업입니다.

맨 위에 다음 줄을 추가하십시오. `hello.hpp` 파일:

```cpp
#include <eosio/singleton.hpp>
```

싱글톤 관련 작업을 추가합니다.

```cpp
   ACTION updatestats(int value);
   ACTION readstats();
   ACTION deletestats();
```

싱글톤 정의를 추가합니다.

```cpp
   TABLE statsdata {
      int count;
   };
   using stats_singleton = eosio::singleton<"stats"_n, statsdata>;
```

### 싱글톤: 데이터 수정

싱글톤 데이터를 수정하는 방법은 다음과 같습니다.

```cpp
ACTION hello::updatestats(int value) {
   stats_singleton stats(get_self(), get_self().value);

   auto current_stats = stats.get_or_create(get_self(), {0});
   current_stats.count = value;
   stats.set(current_stats, get_self());

   print_f("Stats updated with value %.\n", value);
}
```

### 싱글톤: 데이터 읽기

다음은 싱글톤 데이터를 얻는 방법입니다.

```cpp
ACTION hello::readstats() {
   stats_singleton stats(get_self(), get_self().value);
   
   if (stats.exists()) {
      auto current_stats = stats.get();   
      print_f("Stats value: %\n", current_stats.count);
   }
   else {
      print_f("Stats not initialized.");
   }
}
```

### 싱글톤: 데이터 삭제

싱글톤 데이터를 삭제하는 방법은 다음과 같습니다.

```cpp
ACTION hello::deletestats() {
   stats_singleton stats(get_self(), get_self().value);
   
   if (stats.exists()) {
      stats.remove();
      print_f("Stats have been removed.");
   }
   else {
      print_f("Stats not initialized.");
   }
}
```

### 싱글톤: 테스트

스마트 계약을 다시 빌드 및 배포하고 방금 추가한 세 가지 새 작업을 보냅니다.

```shell
dune --send-action hello readstats '[]' hello@active
```

```txt
#         hello <= hello::readstats             ""
>> Stats not initialized.
```

```shell
dune --send-action hello updatestats '[999]' hello@active
```

```txt
#         hello <= hello::updatestats           {"value":999}
>> Stats updated with value 999.
```

```shell
dune --send-action hello readstats '[]' hello@active
```

```txt
#         hello <= hello::readstats             ""
>> Stats value: 999
```

```shell
dune --send-action hello deletestats '[]' hello@active
```

```txt
#         hello <= hello::deletestats           ""
>> Stats have been removed.
```

```shell
dune --send-action hello readstats '[]' hello@active
```

이제 통계가 더 이상 초기화되지 않습니다.

```txt
#         hello <= hello::getstats              ""
>> Stats not initialized.
```

## 인덱스

인덱스는 다중 인덱스 테이블에 저장된 데이터에 대한 효율적이고 유연한 액세스를 제공합니다. 인덱스는 특정 필드 또는 필드 조합을 기반으로 테이블에서 데이터를 조회할 수 있는 특수 데이터 구조입니다. 인덱스는 테이블에서 데이터를 검색하는 쿼리의 성능을 최적화하는 데 사용할 수 있으며 데이터에 고유성 제약 조건을 적용할 수도 있습니다(기본 인덱스만 해당).

EOS는 두 가지 유형의 인덱스를 지원합니다.

- 기본 인덱스
- 보조 인덱스

### 기본 인덱스

기본 인덱스는 다중 인덱스 테이블의 각 행에 대한 고유 식별자입니다. 다음을 사용하여 명시적으로 정의됩니다. `primary_key()` 회원 기능. 이 함수는 `struct` 테이블을 나타내며 각 행을 고유하게 식별하는 값을 반환해야 합니다. 에서 `hello` 스마트 계약에 대해 정의된 기본 인덱스가 이미 있습니다. `user_balance` 테이블 구조 정의.

```cpp
uint64_t primary_key() const { return user.value; }
```

### 보조 인덱스

보조 인덱스는 데이터를 효율적으로 검색하고 필터링하는 데 사용할 수 있는 테이블 구조의 추가 필드입니다.
보조 인덱스는 고유하지 않은 데이터 멤버와 고유하지 않은 데이터 멤버에 정의될 수 있습니다. 최대 16개의 보조 인덱스가 있을 수 있습니다. 보조 인덱스는 다음 유형을 지원합니다.

- `uint64_t`
- `uint128_t`
- `uint256_t`
- `double`
- `long double`

기존 다중 인덱스 테이블에 새 보조 인덱스를 추가하면 행 삽입 또는 업데이트 시 인덱스가 적용되기 때문에 예측할 수 없는 결과가 발생합니다.

### 보조 색인 추가

이제 보조 인덱스가 무엇이고 정의하는 방법을 알게 되었습니다.
연장하다 `hello` 두 가지 새로운 작업이 포함된 스마트 계약:

- `addmsg`, 계정이 테이블에 저장되고 메시지 내용으로 인덱싱되는 메시지를 보낼 수 있습니다.
- `searchmsg`, 정의된 보조 색인을 사용하여 메시지를 조회할 수 있습니다.

#### 데이터 구조 추가

맨 위에 `hello.hpp` 파일에 다음 줄을 추가합니다.

```cpp
#include <eosio/crypto.hpp>
```

그런 다음 이전 테이블 정의 뒤에 기본 데이터 구조를 추가합니다. `user_messages` 테이블:

```cpp
TABLE user_messages {
    name user;
    std::string message;
    checksum256 messagecks;
    uint64_t time;

    uint64_t primary_key() const { return time; }
    checksum256 message_idx() const { return messagecks; }
};
```

위의 코드에서 참고:

- `primary_key()` 메소드는 `time` 데이터 멤버. 기본 인덱스는 고유하므로 고유한 값을 보유하는 데이터 멤버에 대해 정의되어야 합니다.
- `message_idx()` 메소드는 `messagecks` 의 SHA-256 해시를 보유하는 데이터 멤버 `message` 데이터.

#### 보조 인덱스로 테이블 정의

에서 `hello.hpp` 파일 정의 `messages_table` 보조 인덱스가 있는 테이블 유형:

```cpp
using messages_table = eosio::multi_index<
    "messages"_n,
    user_messages,
    indexed_by<"messageidx"_n, const_mem_fun<user_messages, checksum256, &user_messages::message_idx>>
    >;
```

위의 코드에서 참고 `messages_table` 이전에 정의한 것과 거의 같은 방식으로 정의됩니다. `user_data_table`. 이번에 다른 점은 `"messageidx"` 보조 인덱스는 `indexed_by` 그리고 `const_mem_fun` 템플릿. 그만큼 `const_mem_fun` 다음 세 가지 매개변수를 받습니다.

- `user_messages`: 다중 인덱스 테이블 구조 이름,
- `checksum256`: 인덱스가 정의된 데이터의 유형,
- `&user_messages::message_idx`: 구조체에 정의된 보조 인덱스 함수에 대한 참조입니다.

보조 인덱스의 이름에는 작업 이름과 동일한 제한이 있습니다.

#### 작업 정의 및 구현

에서 `hello.hpp` 파일은 다음을 사용할 두 가지 작업을 정의합니다. `messages_table` 그리고 그것의 `messageidx` 보조 색인.

```cpp
ACTION searchmsg(std::string message);
ACTION addmsg(name nm, std::string message);
```

에서 `hello.cpp` 다음 코드를 추가하여 두 작업을 구현합니다.

```cpp
ACTION hello::addmsg(name nm, std::string message) {
   messages_table messages(get_self(), get_self().value);

   messages.emplace(get_self(), [&](auto& row) {
      row.user = nm;
      row.message = message;
      row.messagecks = eosio::sha256(message.data(), message.size());
      row.time = current_time_point().time_since_epoch().count();
   });
}

ACTION hello::searchmsg(std::string message) {
   messages_table messages(get_self(), get_self().value);
   auto message_idx = messages.get_index<"messageidx"_n>();

   auto messagecks = eosio::sha256(message.data(), message.size());
   auto itr = message_idx.find(messagecks);
   if (itr != message_idx.end()) {
      print_f("First message found. User: %, Message: %\n", itr->user, itr->message);
      for ( auto itr_idx = ++itr; itr_idx->messagecks == messagecks; itr_idx++ ){
         print_f("Other message: User: %, Message: %\n", itr_idx->user, itr_idx->message);
      }
   } else {
      print_f("Message not found.");
   }
}
```

위의 코드에서 참고 `eosio::sha256` 함수는 고정 길이 256비트(32바이트) 해시 값을 checksum256 개체로 반환합니다. 해시 값은 널리 사용되는 암호화 해시 함수인 SHA-256 알고리즘을 사용하여 계산됩니다. checksum256 유형은 32바이트의 고정 길이 배열에 대한 typedef이며 EOS 코드베이스 전체에서 해시 값을 나타내는 데 사용됩니다.

두 번째 작업은 보조 인덱스를 사용하여 해시로 메시지를 검색합니다. 고유 인덱스가 아니므로 검색과 일치하는 첫 번째 값을 찾지만, 그 뒤에도 동일한 검색 값을 가진 행이 여러 개 존재할 수 있으니 주의하시기 바랍니다. 그렇기 때문에 `searchmsg` 함수는 발견된 첫 번째 메시지와 모든 후속 메시지를 인쇄합니다.

### 인덱스: 테스트

스마트 계약을 다시 빌드하고 배포하고 `addmsg` 두 개의 다른 계정을 첫 번째 매개변수로, 동일한 메시지를 두 번째 매개변수로 사용하여 작업을 두 번 수행한 다음 추가된 메시지를 검색하여 발견되었는지 확인합니다.

```shell
dune --send-action hello addmsg '[ama, "good morning sunshine"]' hello@active
dune --send-action hello addmsg '[hello, "good morning sunshine"]' hello@active
```

찾기 `good morning sunshine` 메시지:

```shell
dune --send-action hello searchmsg '["good morning sunshine"]' hello@active
```

```txt
#         hello <= hello::searchmsg             {"message":"good morning sunshine"}
>> First message found. User: ama, Message: good morning sunshine
>> Other message: User: hello, Message: good morning sunshine
```

## 어설션

어설션은 계약을 실행하는 동안 특정 조건이 참인지 확인하는 메커니즘입니다. 조건이 참이 아니면 어설션으로 인해 계약이 오류 메시지와 함께 종료됩니다.

### 사용 assert()

다음과 같은 표준 오류 메시지로 어설션 확인을 구현합니다.

```cpp
assert(message.size() <= 10);
```

### 체크() 사용

다음과 같은 사용자 지정 오류 메시지로 어설션 확인을 구현합니다.

```cpp
check(message.size() <= 10, "Message can not be bigger than 10 characters.");
```

### Assert로 스마트 계약 확장

위의 검사를 `addmsg` 구현, 매번 다시 계약을 컴파일 및 배포한 다음 명령을 실행하여 블록체인에 작업을 서명하고 보냅니다.

```shell
dune --send-action hello addmsg '[ama, "01234567891"]' ama@active
```

이것은 다음을 사용할 때 표시되는 표준 오류 메시지입니다. `assert()` 기능:

```txt
failed transaction: 50c7566e784a34509e02e4775e6b63b5978d3ddf5ab02618bee8c8a68ff5ce8d  <unknown> bytes  <unknown> us
error 2023-03-01T16:49:50.792 cleos     main.cpp:700                  print_result         ] soft_except->to_detail_string(): 3050008 abort_called: Abort Called
abort() called
    {}
    nodeos  cf_system.cpp:7 abort
pending console output: Assertion failed: message.size() <= 10 (hello.cpp: addmsg: 94)

    {"console":"Assertion failed: message.size() <= 10 (hello.cpp: addmsg: 94)\n"}
    nodeos  apply_context.cpp:124 exec_one
```

이것은 다음을 사용할 때 표시되는 사용자 지정 오류 메시지입니다. `check()` 기능:

```txt
failed transaction: 6d18bc090aa65880b28a4f697e8bf08999e68d209c2a1367f16d596e11bbed02  <unknown> bytes  <unknown> us
error 2023-03-01T16:54:04.555 cleos     main.cpp:700                  print_result         ] soft_except->to_detail_string(): 3050003 eosio_assert_message_exception: eosio_assert_message assertion failure
assertion failure with message: Message can not be bigger than 10 characters.
    {"s":"Message can not be bigger than 10 characters."}
    nodeos  cf_system.cpp:14 eosio_assert
pending console output: 
    {"console":""}
    nodeos  apply_context.cpp:124 exec_one
```

## 승인

사용자 또는 계약이 작업을 보내려고 하면 EOS 블록체인 소프트웨어에서 해당 작업을 확인할 수 있습니다. 이 유효성 검사 프로세스에는 사용자 또는 계약에 작업을 수행할 수 있는 권한이 있는지 확인하는 작업이 포함됩니다.

그만큼 `hello` 계약은 승인 확인을 수행하지 않습니다. 모든 계정은 'hello' 계약의 작업을 블록체인으로 보낼 수 있으며 실행됩니다.

보내다 `hi` 조치를 취하고 서명하십시오. `hello@active` 개인 키 성공:

```shell
dune --send-action hello addmsg '[ama, "hi again"]' hello@active
```

```txt
#         hello <= hello::addmsg                {"nm":"ama","message":"hi again"}
```

보내다 `hi` 조치를 취하고 서명하십시오. `ama@active` 개인 키도 성공합니다.

```shell
dune --send-action hello addmsg '[ama, "hi again"]' ama@active
```

```txt
#         hello <= hello::addmsg                {"nm":"ama","message":"hi again"}
```

권한 확인을 구현하여 특정 계정만 허용하거나 하나의 계정만 실행하도록 허용할 수 있습니다. `hello` 계약의 조치.

### has_auth()와 함께 check() 사용

권한 확인을 수행하려면 다음을 사용하십시오. `check()` 와 함께 기능 `has_auth` 기능. 이 조합은 조치를 시행합니다. `addmsg` 계정이 트랜잭션에 서명하는 데 사용하는 권한(예: 소유자, 활성, 코드)에 관계없이 첫 번째 매개 변수로 전송된 계정에 의해서만 실행됩니다. 확인에 실패하면 사용자 지정 메시지와 함께 오류가 발생합니다.

```cpp
ACTION hello::addmsg(name nm, std::string message) {

    check(has_auth(user), "User is not authorized to perform this action.");

    messages_table messages(get_self(), get_self().value);

    messages.emplace(get_self(), [&](auto& row) {
        row.user = nm;
        row.message = message;
        row.messagecks = eosio::sha256(message.data(), message.size());
        row.time = current_time_point().time_since_epoch().count();
    });
}
```

스마트 계약을 컴파일 및 배포하고 `addmsg` 첫 번째 매개변수가 있는 작업 `ama` 그리고 서명 `hello@active` 키를 누른 다음 사용자 지정 오류 메시지와 함께 실패하는 방법을 관찰합니다.

```cpp
dune --send-action hello addmsg '[ama, "hi again"]' hello@active
```

```txt
failed transaction: 6d2e11e24d9adc066136f94bc66c13df2dfce952f1a5a0fa7a0286043a67f0c6  <unknown> bytes  <unknown> us
error 2023-03-01T15:44:02.588 cleos     main.cpp:700                  print_result         ] soft_except->to_detail_string(): 3050003 eosio_assert_message_exception: eosio_assert_message assertion failure
assertion failure with message: User is not authorized to perform this action.
    {"s":"User is not authorized to perform this action."}
    nodeos  cf_system.cpp:14 eosio_assert
pending console output: 
    {"console":""}
    nodeos  apply_context.cpp:124 exec_one
```

### require_auth() 사용

실패한 경우 발생하는 오류 메시지를 사용자 정의할 수 없다는 점만 이전 조합과 동일합니다.

```cpp
ACTION hello::addmsg(name nm, std::string message) {

    require_auth( nm );

    messages_table messages(get_self(), get_self().value);

    messages.emplace(get_self(), [&](auto& row) {
        row.user = nm;
        row.message = message;
        row.messagecks = eosio::sha256(message.data(), message.size());
        row.time = current_time_point().time_since_epoch().count();
    });
}
```

스마트 계약을 컴파일 및 배포하고 `addmsg` 첫 번째 매개변수가 있는 작업 `ama` 그리고 서명 `hello@active` 키를 누른 다음 표준 오류 메시지와 함께 실패하는 방법을 관찰합니다.

```cpp
dune --send-action hello addmsg '[ama, "hi again"]' hello@active
```

```txt
failed transaction: 8887cca7fababeb883aa6806c220eece3d5f3c618824b2378ac25a67c09a063a  <unknown> bytes  <unknown> us
error 2023-03-01T15:53:35.033 cleos     main.cpp:700                  print_result         ] soft_except->to_detail_string(): 3090004 missing_auth_exception: Missing required authority
missing authority of ama
    {"account":"ama"}
    nodeos  apply_context.cpp:256 require_authorization
pending console output: 
    {"console":""}
    nodeos  apply_context.cpp:124 exec_one
```

### require_auth2() 사용

그만큼 `require_auth2()` 트랜잭션 서명에 사용된 권한이 두 번째 매개변수로 지정된 권한인 경우에만 첫 번째 매개변수로 설정된 계정에 의해서만 실행을 강제합니다. 확인에 실패하면 사용자 정의할 수 없는 표준 오류 메시지가 표시됩니다.

```cpp
ACTION hello::addmsg(name nm, std::string message) {

   require_auth2(nm.value, "active"_n.value);

   messages_table messages(get_self(), get_self().value);

   messages.emplace(get_self(), [&](auto& row) {
      row.user = nm;
      row.message = message;
      row.messagecks = eosio::sha256(message.data(), message.size());
      row.time = current_time_point().time_since_epoch().count();
   });
}
```

스마트 계약을 컴파일 및 배포하고 `addmsg` 첫 번째 매개변수가 있는 작업 `ama`, 서명 `ama@owner` 개인 키를 선택한 다음 표준 오류 메시지와 함께 실패하는 방법을 관찰합니다.

```shell
dune --send-action hello addmsg '[ama, "hi again"]' ama@owner
```

경우에도 `ama@owner` 개인 키가 위의 트랜잭션에 서명하는 데 사용되었으며 필요한 서명이 `ama@active`.

```txt
failed transaction: 7dcb10621e4102ec933cdbaf544f0204446cc96bc20b76242391b17286f1408e  <unknown> bytes  <unknown> us
error 2023-03-01T16:00:02.853 cleos     main.cpp:700                  print_result         ] soft_except->to_detail_string(): 3090004 missing_auth_exception: Missing required authority
missing authority of ama/active
    {"account":"ama","permission":"active"}
    nodeos  apply_context.cpp:275 require_authorization
pending console output: 
    {"console":""}
    nodeos  apply_context.cpp:124 exec_one
```

## 이벤트

EOS 스마트 계약 개발자는 이벤트 메커니즘을 사용하여 다른 스마트 계약 작업에서 보낸 알림을 수신하는 스마트 계약을 구현할 수 있습니다. EOS 이벤트 메커니즘은 두 행위자에 의해 정의됩니다.

- 작업 중 하나에서 이벤트를 발생시키는 스마트 계약입니다.
- 첫번째 스마트 컨트랙트의 액션에 의해 발생한 이벤트를 듣는 스마트 컨트랙트.

### 요구 수신자()

스마트 계약 작업에서 이벤트를 발생시키려면 `require_recipient()` 알림을 받을 계정 집합에 지정된 수신자 계정을 추가하는 기능. 현재 작업이 실행된 후 목록에서 각 수신자 계정으로 알림이 전송됩니다. 그리고 해당 계정에 스마트 계약이 배포되어 `on_notify()` 보내는 컨트랙트 계정과 액션이 등록된 메서드를 사용하면 알림을 받고 그에 따라 행동할 수 있습니다.

### on_notify()

스마트 계약의 작업으로 발생한 이벤트를 수신하려면 다음을 구현하십시오. `on_notify()` 기능을 수행하고 특정 스마트 계약 및 해당 작업에 대해 등록합니다.

경청하는 두 번째 스마트 계약을 구현하십시오. `hello::addmsg` 작업 알림.

```shell
dune --create-cmake-app hellolisten ./
```

열기 `hellolisten.hpp` 구현 `on_notify()` 아래와 같은 방법:

```cpp
#include <eosio/eosio.hpp>

using namespace eosio;

CONTRACT hellolisten : public contract {
   public:
      using contract::contract;

      ACTION hi( name nm );

      [[eosio::on_notify("hello::addmsg")]]
      void handle_addmsg(name nm, std::string message) {
         // take action based on this notification
         print_f("Notification received. From: %, message: %\n", nm, message);
      }

   private:
};
```

변경 `hello::addmsg` 에 대한 이벤트를 제기하는 조치 `hellolisten` 새 메시지가 추가될 때마다 계약 계정.

```cpp
ACTION hello::addmsg(name nm, std::string message) {

   check(has_auth(nm), "User is not authorized to perform this action.");
   check(message.size() <= 10, "Message can not be bigger than 10 characters.");

   require_recipient("hellolisten"_n);

   messages_table messages(get_self(), get_self().value);

   messages.emplace(get_self(), [&](auto& row) {
      row.user = nm;
      row.message = message;
      row.messagecks = eosio::sha256(message.data(), message.size());
      row.time = current_time_point().time_since_epoch().count();
   });
}
```

계정 만들기 `hellolisten`, 그런 다음 새로 생성된 계정에 새 스마트 계약을 빌드하고 배포합니다.

```shell
dune --create-account hellolisten
dune --cmake-build ./hellolisten/
dune --deploy ./hellolisten/build/hellolisten hellolisten
```

보내기 `addmsg` ~로 `hello` 계약하고 그 출력을 관찰하십시오.

```shell
dune --send-action hello addmsg '[ama, "hi notify"]' ama@active
```

```txt
#         hello <= hello::addmsg                {"nm":"ama","message":"hi notify"}
#   hellolisten <= hello::addmsg                {"nm":"ama","message":"hi notify"}
>> Notification received. From: ama, message: hi notify
```

출력에서 마지막 두 줄은 다음을 보여줍니다.

- `hello::addmsg` 매개변수가 포함된 조치가 다음으로 전송되었습니다. `hellolisten` 계정 및
- `hellolisten::on_notify` 방법이 실행되었습니다. 결과적으로 두 개의 입력 매개변수가 콘솔에 인쇄되었습니다.
