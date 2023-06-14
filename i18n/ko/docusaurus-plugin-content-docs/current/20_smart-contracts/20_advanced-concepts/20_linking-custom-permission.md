---
title: "사용자 지정 권한 생성 및 연결"
---

## 소개

EOS 블록체인에서 계정에 대한 다양한 사용자 정의 권한을 생성할 수 있습니다. 사용자 지정 권한은 나중에 계약 작업에 연결할 수 있습니다. 이 권한 시스템을 통해 스마트 계약은 유연한 인증 체계를 가질 수 있습니다.

이 자습서에서는 사용자 지정 권한 생성 및 이후 권한을 작업에 연결하는 방법을 설명합니다. 단계가 완료되면 새로 연결된 권한의 승인이 제공되지 않는 한 계약의 작업이 실행되지 않습니다. 이를 통해 계정과 계정의 다양한 작업을 더 세밀하게 제어할 수 있습니다.

큰 힘에는 큰 책임이 따른다. 이 기능은 계약 및 해당 사용자의 보안에 몇 가지 문제를 제기합니다. 사용하기 전에 개념과 단계를 이해했는지 확인하십시오.

[[정보 |부모 권한 ]]
| 사용자 지정 권한을 생성하면 해당 권한은 항상 상위 권한 아래에 생성됩니다.

사용자 지정 권한이 생성된 상위 권한의 권한이 있는 경우 해당 사용자 지정 권한이 필요한 작업을 항상 실행할 수 있습니다.

## 1단계. 사용자 지정 권한 만들기

먼저 새 권한 수준을 만들어 보겠습니다. `alice` 계정:

```shell
dune -- cleos set account permission alice upsert YOUR_PUBLIC_KEY owner -p alice@owner
```

몇 가지 참고 사항:

1. **upsert**라는 새로운 권한이 생성되었습니다.
2. **upsert** 권한은 개발 공개 키를 권한 증명으로 사용합니다.
3. 이 권한은 `alice` 계정

예를 들어 다른 계정 집합과 같이 이 권한에 대한 공개 키 이외의 권한을 지정할 수도 있습니다.

## 2단계. 사용자 지정 권한에 권한 부여 연결

인증을 연결하여 `upsert` 새로 생성된 권한이 있는 작업:

```shell
dune -- cleos set action permission alice addressbook upsert upsert
```

이 예에서는 인증을 `upsert` 주소록 계약에서 이전에 생성된 작업입니다.

## 3단계. 테스트

다음을 사용하여 작업을 호출해 보겠습니다. `active` 허가:

```shell
dune -- cleos push action addressbook upsert '["alice", "alice", "liddel", 21, "Herengracht", "land", "dam"]' -p alice@active
```

아래와 같은 오류가 표시됩니다.

```text
Error 3090005: Irrelevant authority included
Please remove the unnecessary authority from your action!
Error Details:
action declares irrelevant authority '{"actor":"alice","permission":"active"}'; minimum authority is {"actor":"alice","permission":"upsert"}
```

이제 **upsert** 권한을 시도합니다. 이번에는 방금 생성한 **upsert** 권한을 명시적으로 선언합니다. `-p alice@upsert`)

```text
dune -- cleos push action addressbook upsert '["alice", "alice", "liddel", 21, "Herengracht", "land", "dam"]' -p alice@upsert
```

이제 작동합니다.

```text
dune -- cleos push action addressbook upsert '["alice", "alice", "liddel", 21, "Herengracht", "land", "dam"] -p alice@upsert
executed transaction:

2fe21b1a86ca2a1a72b48cee6bebce9a2c83d30b6c48b16352c70999e4c20983  144 bytes  9489 us
#   addressbook <= addressbook::upsert          {"user":"alice","first_name":"alice","last_name":"liddel","age":21,"street":"Herengracht","city":"land",...
#   addressbook <= addressbook::notify          {"user":"alice","msg":"alice successfully modified record to addressbook"}
#         eosio <= addressbook::notify          {"user":"alice","msg":"alice successfully modified record to addressbook"}
#     abcounter <= abcounter::count             {"user":"alice","type":"modify"}
```
