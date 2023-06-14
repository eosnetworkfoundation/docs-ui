---
title: 모래 언덕
---

[노드 실행을 위한 Docker 유틸리티(DUNE)](https://github.com/AntelopeIO/DUNE) 블록체인 개발자와 노드 운영자가 스마트 계약 개발 및 노드 관리 기능과 관련된 상용구 작업을 수행할 수 있도록 하는 클라이언트 도구입니다.

스마트 계약 개발을 시작하기 전에 DUNE 및 이를 플랫폼에 설치하는 방법에 대해 알아야 합니다.

### 설치

DUNE은 다음 플랫폼에서 설치하고 실행할 수 있습니다.
* 리눅스
* 윈도우
* 맥 OS

지원되는 각 플랫폼에 대한 설치 지침은 [DUNE의 github 프로젝트](https://github.com/AntelopeIO/DUNE) 페이지.

완료되면 실행할 수 있습니다. `dune --help` 지원되는 모든 명령 목록을 보려면.

## 지갑

DUNE은 지갑 관리를 대신 처리하므로 사용자가 할 필요가 없습니다.

새 키를 지갑으로 가져와야 하는 경우:

```shell
dune --import-dev-key <PRIVATE_KEY>
```

## 노드 관리

DUNE을 사용하면 새로운 로컬 EOS 블록체인을 쉽게 생성할 수 있습니다.

```shell
dune --start <NODE_NAME>
```

위의 명령은 다음과 같은 새 노드를 생성합니다. `NODE_NAME` 기본 설정으로 시작합니다.
노드는 스마트 계약을 배포하고 테스트를 수행할 수 있는 API/생산자 노드 역할을 하도록 구성됩니다.

> ❔ **오류**
>
> 노드 설정 프로세스가 끝날 때 오류가 표시될 수 있습니다.
> 그렇다면 이 가이드를 참조하여 일반적인 오류를 해결하거나
> [텔레그램 채널](https://t.me/antelopedevs) 도와주기 위해.

시스템에서 EOS 노드 목록을 볼 수 있습니다.

```shell
dune --list
```

활성 노드의 RPC API가 활성 상태인지 확인할 수도 있습니다.

```shell
dune -- cleos get info
```

노드를 종료하려면:

```shell
dune --stop <NODE_NAME>
```

노드를 완전히 제거하려면:

```shell
dune --remove <NODE_NAME>
```


### 환경 부트스트랩

개발 환경에서 다음과 같이 의존해야 할 수 있는 몇 가지 시스템 계약이 있습니다.
- `eosio.token` **EOS** 토큰 전송용
- `eosio.msig` 다중 서명 트랜잭션
- `eosio.system` 리소스 관리와 같은 시스템 수준 작업

로컬 노드를 부트스트랩하는 것은 쉽습니다. 활성 노드가 실행되면 다음을 사용하여 부트스트랩할 수 있습니다.

```shell
dune --bootstrap-system-full
```


## 계정 관리

계정 위에 계약을 배포하고 이를 사용하여 스마트 계약과 상호 작용합니다.

새 계정을 만들려면:

```shell
dune --create-account <ACCOUNT_NAME>
```

계정 정보를 얻으려면:

```shell
dune -- cleos get account <ACCOUNT_NAME>
```

## 스마트 계약 개발

DUNE을 사용하여 스마트 계약을 컴파일, 배포 및 상호 작용하는 방법을 배울 수 있도록 샘플 프로젝트를 만들어 봅시다.

프로젝트를 만들려는 디렉터리로 이동한 후 다음 명령을 실행합니다.

```shell
dune --create-cmake-app hello .
```

이렇게 하면 `hello` cmake 스타일의 EOS 스마트 계약 프로젝트가 있는 디렉토리.

의 내용을 교체 `src/hello.cpp` 다음 코드로:

```cpp
#include <eosio/eosio.hpp>
using namespace eosio;

CONTRACT hello : public contract {
   public:
      using contract::contract;

      TABLE user_record {
         name user;
         uint64_t primary_key() const { return user.value; }
      };
      typedef eosio::multi_index< name("users"), user_record> user_index;

      ACTION test( name user ) {
         print_f("Hello World from %!\n", user);
         user_index users( get_self(), get_self().value );
         users.emplace( get_self(), [&]( auto& new_record ) {
            new_record.user = user;
         });
      }
};
```

### 컨트랙트 컴파일

프로젝트의 루트에서 다음 명령을 실행하여 계약을 컴파일합니다.

```shell
dune --cmake-build .
```
계약이 컴파일되는 것을 볼 수 있습니다. 오류가 있으면 출력에 오류가 표시됩니다.

### 계약 배포

귀하의 계약에 대한 계정을 생성해야 합니다. 그런 다음 계약을 배포할 수 있습니다.

```shell
dune --create-account hello
dune --deploy ./build/hello hello
```

> 👀 **코드 권한**
>
> 기본적으로 DUNE은 `eosio.code` 계약을 배포할 때 계정에 대한 권한. 이를 통해
> 다른 스마트 계약에서 인라인 작업을 트리거할 수 있는 계약.

### 계약과 상호 작용

계약과 상호 작용하기 위해 로컬 EOS 노드에서 트랜잭션을 보냅니다. EOS 거래는 다음과 같이 구성됩니다.
`actions`, 그래서 우리는 귀하의 계약에 단일 조치를 보낼 것입니다.

또한 작업을 보낼 테스트 계정을 만듭니다.

```shell
dune --create-account testaccount

# format: dune --send-action <CONTRACT> <ACTION> <PARAMETERS> <SENDER>
dune --send-action hello test '[bob]' testaccount
```

처음에 성공적으로 실행된 트랜잭션이 표시되어야 하며 이 명령을 반복하려고 하면
해당 행이 계약의 데이터베이스에 이미 있기 때문에 실패합니다.

### 계약에서 데이터 가져오기

방금 계약의 데이터베이스에 행을 추가했습니다. 체인에서 해당 데이터를 가져오겠습니다.

```shell
# format: dune --get-table <CONTRACT> <SCOPE> <TABLE>
dune --get-table hello hello users
```

하나 이상의 행이 있는 테이블 결과를 얻어야 합니다. 위의 상호 작용이 성공했는지 확인하지 못한 경우.

## DUNE에서 원시 프로그램 사용

원시 EOS 스택을 활용하려면 다음을 사용할 수 있습니다. `DUNE -- <COMMAND>` 컨테이너 내의 모든 항목에 액세스할 수 있는 형식입니다.

예:
    
```shell
dune -- cleos get info
dune -- nodeos --help
```
