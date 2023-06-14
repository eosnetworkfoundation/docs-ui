---
title: 거래 광부
--- 

EOS EVM 트랜잭션 마이너는 이더리움 형식의 트랜잭션과
EOS 네이티브 노드의 EOS EVM 계약으로 푸시합니다.


## 광부 계정

**광부 계정** 역할을 할 EOS 네트워크 계정이 필요합니다.

EOS EVM Miner 소프트웨어는 수신한 EVM 트랜잭션을 가져와 EOS 트랜잭션으로 변환한 다음 전송합니다.
~로 `eosio.evm` 기본 EOS 네트워크에 대한 계약.

이러한 거래의 중계자로서 귀하는 귀하가 제공하는 서비스에 대한 보상을 받을 기회가 있습니다.

### 광부 및 자원

광부 계정이 트랜잭션을 릴레이함에 따라 천천히 CPU 및 NET 리소스가 고갈됩니다. 이들을 관리해야 합니다.
광부가 계속 작동할 수 있도록 리소스를 제공합니다.

PowerUp과 같은 서비스는 채굴자 계정에 계속 운영하기에 충분한 리소스가 있는지 확인하기 위해 자동화되어야 합니다.
중단없이.

> ❔ **RAM은 필요하지 않습니다**
>
> 광부 계정은 거래를 중계하므로 RAM 리소스를 고갈시키지 않습니다. CPU 및 NET 리소스만 사용합니다.
> 더 `eosio.evm` 계약은 EVM 트랜잭션에서 수집한 수수료를 통해 EOS EVM이 사용하는 RAM에 대해 지불합니다.

### 채굴기 등록

광부 계정이 있으면 해당 계정에 등록해야 합니다. `eosio.evm` 계약.

```bash
cleos -u https://eos.greymass.com/ push action eosio.evm open '["<your-miner-account>"]' -p <your-miner-account>
```

웹 인터페이스를 사용하여 등록하려면 다음을 방문하십시오. [bloks.io](https://bloks.io/account/eosio.evm?loadContract=true&tab=Actions&account=eosio.evm&scope=eosio.evm&limit=100&action=open)
다음과 같은 지갑을 사용하여 거래에 서명하십시오. [닻](https://www.greymass.com/anchor).

### 채굴 보상 보기

그만큼 `eosio.evm` Contract는 마이닝에서 얻은 보상을 테이블에 저장합니다. 이 보상은 다음을 통해 언제든지 볼 수 있습니다.
계약에서 테이블 행 가져오기 `balances` 광부 계정에 상한선과 하한선이 설정된 테이블:

```bash
cleos -u https://eos.greymass.com/ get table eosio.evm eosio.evm balances -U <your-miner-account> -L <your-miner-account>
```

에서 동일한 데이터를 볼 수도 있습니다. [bloks.io](https://bloks.io/account/eosio.evm?loadContract=true&tab=Tables&account=eosio.evm&scope=eosio.evm&limit=100&table=balances)


### 채굴 보상 철회

그만큼 `eosio.evm` Contract는 마이닝에서 얻은 보상을 테이블에 저장합니다. 언제든지 이러한 보상을 인출할 수 있습니다.
거래를 보내서 시간 `eosio.evm` 다음 조치로 계약:

```bash
cleos -u https://eos.greymass.com/ push action eosio.evm withdraw '["<your-miner-account>", "1.0000 EOS"]' -p <your-miner-account>
```

웹 인터페이스를 사용하여 청구하려면 다음을 방문하십시오. [bloks.io](https://bloks.io/account/eosio.evm?loadContract=true&tab=Actions&account=eosio.evm&scope=eosio.evm&limit=100&table=balances&action=withdraw)
다음과 같은 지갑을 사용하여 거래에 서명하십시오. [닻](https://www.greymass.com/anchor).


## 채굴기 설정

### 설치

당신이 가지고 있는지 확인 `node` 컴퓨터에 설치됩니다.

권장 버전은 [`18.16.0`](https://nodejs.org/en/download), 최소 버전은 `16.16.0`.

#### GitHub에서 광부를 가져와 모든 종속성을 설치합니다.

```bash
git clone https://github.com/eosnetworkfoundation/eos-evm-miner.git
cd eos-evm-miner
yarn
```

#### 환경 변수도 설정해야 합니다.
복사 `.env.example` 에 제출 `.env` 환경 변수를 입력합니다.

| 이름 | 설명 | 기본값 |
| --- | --- | --- |
| `PRIVATE_KEY` | 광부 계정의 개인 키 | |
| `MINER_ACCOUNT` | EOS 네트워크의 광부 계정 이름 | |
| `RPC_ENDPOINTS` | 연결할 EOS RPC 엔드포인트 목록, 쉼표로 구분 | |
| `PORT` | 들어오는 Ethereum 트랜잭션을 수신할 포트 | `50305` |
| `LOCK_GAS_PRICE` | 로 설정한 경우 `true`, 하나의 가스 가격이 설정되면 이 광부는 새로운 가스 가격을 가져오기 위해 EOS API 노드를 다시 누르지 않습니다 | `true`  |




### 마이닝 시작

```bash
yarn mine
```

> 📄 **로그**:
>
> 에이 `logs` 디렉토리는 두 개의 로그 파일과 함께 프로젝트 루트에 생성됩니다.
> - **error.log**: 오류 로그만
> - **combined.log**: 기타 모든 항목





