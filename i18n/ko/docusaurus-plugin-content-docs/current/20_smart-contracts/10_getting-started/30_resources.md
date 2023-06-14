---
title: 자원
---

EOS 블록체인은 CPU, NET 및 RAM의 세 가지 시스템 리소스와 함께 작동합니다. EOS 계정은 블록체인에 배포된 스마트 계약과 상호 작용하기 위해 충분한 시스템 리소스가 필요합니다.

* [RAM 리소스](#ram-resource)
* [CPU 자원](#cpu-resource)
* [NET 리소스](#net-resource)

계정에 RAM 리소스를 할당하려면 다음을 수행해야 합니다. [RAM 구입](#how-to-purchase-ram).
CPU 및 NET 리소스를 계정에 할당하려면 다음을 수행해야 합니다. [계정을 강화](#account-power-up).

## RAM 리소스

RAM 리소스는 블록체인이 데이터를 저장하는 메모리, 저장 공간입니다. 컨트랙트가 블록체인에 데이터를 저장해야 하는 경우 블록체인의 RAM에 데이터를 저장할 수 있습니다. `multi-index table` 또는 `singleton`.

### RAM 고성능

EOS 블록체인에 저장된 데이터는 저장 매체로 RAM을 사용합니다. 따라서 블록체인 데이터에 대한 액세스는 성능이 뛰어나고 빠릅니다. 성능 벤치마크는 다른 블록체인에서 거의 달성할 수 없는 수준에 도달할 수 있습니다. 이 능력은 EOS 블록체인을 전 세계에서 가장 빠른 블록체인의 경쟁자로 끌어올립니다.

### RAM 중요성

RAM은 다음과 같은 이유로 중요한 시스템 리소스입니다.

* 램은 한정된 자원입니다. 퍼블릭 EOS 블록체인은 총 64GB의 RAM으로 시작되었습니다. 잠시 후 블록 생산자는 블록당 1KB씩 메모리를 늘리기로 결정했습니다. 이런 식으로 RAM 공급은 지속적으로 증가하지만 가격은 더 느린 속도로 가속됩니다.

* 블록체인에 의한 많은 작업 실행에는 RAM이 사용됩니다. 예를 들어 새 계정을 만들면 새 계정 정보가 블록체인의 RAM에 저장됩니다. 또한 계정이 이전에 보유하지 않은 토큰을 수락하면 새로 수락된 토큰의 잔액을 보유하는 새 레코드를 생성해야 합니다. 블록체인 메모리는 토큰을 전송하는 계정이나 새 토큰 유형을 수락하는 계정에서 구매해야 합니다.

* 스마트 컨트랙트가 할당된 RAM을 모두 소모하면 추가 정보를 저장할 수 없습니다. 블록체인 데이터베이스에 데이터를 계속 저장하려면 다음 조건 중 하나 또는 둘 다를 충족해야 합니다.

  * 점유된 RAM의 일부는 스마트 계약에 의해 해제됩니다.
  * RAM 구매 프로세스를 통해 더 많은 RAM이 스마트 컨트랙트 계정에 할당됩니다.

### RAM 구입 방법

RAM 리소스는 `EOS` 시스템 토큰. RAM 가격은 시스템 컨트랙트에 구현된 독특한 Bancor 유동성 알고리즘에 따라 계산됩니다.

RAM 가격을 계산하는 가장 빠른 방법:

1. 다음 dune 명령을 실행합니다. (**참고:** 선택한 메인넷 또는 테스트넷에 대해 실행해야 합니다.)

    ```shell
    dune -- cleos get table eosio eosio rammarket
```

2. 아래 샘플과 같은 출력을 관찰합니다.

    ```text
    {
        "supply": "10000000000.0000 RAMCORE",
        "base": {
            "balance": "35044821247 RAM",
            "weight": "0.50000000000000000"
        },
        "quote": {
            "balance": "3158350.8754 EOS",
            "weight": "0.50000000000000000"
        }
    }
```

3. 다음 사항을 기록해 둡니다. `base balance`, 이 경우 35044821247입니다.
4. 다음 사항을 기록해 둡니다. `quote balance`, 이 경우 3158350.8754입니다.
5. 1Kib의 RAM 가격을 다음과 같이 계산합니다. `quote balance` * 1024 / `base balance` = 0.0922EOS.

#### 명령줄 인터페이스로 RAM 구입

dune 명령줄 인터페이스 도구를 통해 RAM을 구입할 수 있습니다. 바이트로 표시된 명시적인 양의 RAM 또는 명시된 양의 EOS에 해당하는 양의 RAM을 구입할 수 있습니다.

#### EOS에서 RAM 구매

예를 들어 아래 명령은 계정에 대한 구매 `bob` 현재 시장 RAM 가격으로 0.1 EOS 상당의 RAM. RAM 비용과 이 트랜잭션의 실행은 `alice` 계정 및 거래는 `active` 의 열쇠 `alice` 계정.

```shell
dune -- cleos system buyram alice bob "0.1 EOS" -p alice@active
```

#### 바이트 단위로 RAM 구매

예를 들어 아래 명령은 계정에 대한 구매 `bob` 현재 시장 RAM 가격으로 1000 RAM 바이트. RAM 비용과 이 트랜잭션의 실행은 `alice` 계정 및 거래는 `active` 의 열쇠 `alice` 계정.

```shell
dune -- cleos system buyrambytes alice bob "1000" -p alice@active
```

### RAM 계산 방법

데이터를 저장하기 위해 스마트 계약에 필요한 RAM은 사용된 블록체인 상태에서 계산됩니다.

개발자로서 스마트 계약에 필요한 RAM의 양을 이해하려면 스마트 계약이 인스턴스화하고 사용하는 다중 인덱스 테이블의 기본 데이터 구조에 주의를 기울이십시오. 하나의 다중 인덱스 테이블을 기반으로 하는 데이터 구조는 테이블의 행을 정의합니다. 데이터 구조의 각 데이터 멤버는 테이블의 행 셀에 해당합니다.
하나의 다중 인덱스 행이 블록체인에 저장해야 하는 RAM의 양을 추정하려면 각 데이터 멤버 유형의 크기와 정의된 각 인덱스에 대한 메모리 오버헤드(있는 경우)를 추가해야 합니다. 다중 인덱스 테이블, 인덱스 및 데이터 유형에 대해 EOS 코드로 정의된 오버헤드를 아래에서 찾으십시오.

* [다중 인덱스 RAM 바이트 오버헤드](https://github.com/AntelopeIO/leap/blob/f6643e434e8dc304bba742422dd036a6fbc1f039/libraries/chain/include/eosio/chain/contract_table_objects.hpp#L240)
* [인덱스 RAM 바이트당 행당 오버헤드](https://github.com/AntelopeIO/leap/blob/a4c29608472dd195d36d732052784aadc3a779cb/libraries/chain/include/eosio/chain/config.hpp#L109)
* [고정 오버헤드 공유 벡터 RAM 바이트](https://github.com/AntelopeIO/leap/blob/a4c29608472dd195d36d732052784aadc3a779cb/libraries/chain/include/eosio/chain/config.hpp#L108)
* [계정 RAM 바이트당 오버헤드](https://github.com/AntelopeIO/leap/blob/a4c29608472dd195d36d732052784aadc3a779cb/libraries/chain/include/eosio/chain/config.hpp#L110)
* [Setcode RAM 바이트 승수](https://github.com/AntelopeIO/leap/blob/a4c29608472dd195d36d732052784aadc3a779cb/libraries/chain/include/eosio/chain/config.hpp#L111)
* [RAM 사용량 업데이트 기능](https://github.com/AntelopeIO/leap/blob/9f0679bd0a42d6c24a966bb79de6d8c0591872a5/libraries/chain/apply_context.cpp#L725)

## CPU 자원

NET 및 RAM으로서 CPU 리소스는 EOS 블록체인에서 매우 중요한 시스템 리소스입니다. CPU 시스템 리소스는 블록체인 계정에 처리 능력을 제공합니다. 블록체인이 트랜잭션을 실행할 때 CPU와 NET을 소비합니다. 트랜잭션이 완료되려면 지불자 계정에 충분한 CPU가 할당되어야 합니다. 계정이 보유한 CPU 양은 마이크로초 단위로 측정되며 이를 `cpu bandwidth` 에 `dune -- cleos get account` 명령 출력.

### CPU 계산 방법

블록체인에 의해 실행되는 트랜잭션에는 하나 이상의 작업이 포함됩니다. 각 트랜잭션은 최소 및 최대 트랜잭션 CPU 사용량 값으로 미리 정의된 제한 내에서 CPU 양을 소비해야 합니다. EOS 블록체인의 경우 이러한 제한은 블록체인 구성에서 설정됩니다. 다음 명령을 실행하여 이러한 제한을 확인하고 다음을 참조하십시오. `min_transaction_cpu_usage` 그리고 `max_transaction_cpu_usage` 마이크로초로 표현됩니다.

```shell
dune -- cleos get consensus_parameters
```

트랜잭션을 실행하는 계정의 경우 블록체인은 각 트랜잭션이 실행되기 전에 각 블록으로 남은 리소스를 계산하고 업데이트합니다. 거래가 실행될 준비가 되면 블록체인은 지급인 계정에 거래 실행을 처리하기에 충분한 CPU가 있는지 여부를 결정합니다. 필요한 CPU를 계산하기 위해 현재 블록을 능동적으로 구축하는 노드는 트랜잭션을 실행하는 시간을 측정합니다. 계정에 CPU가 충분하면 트랜잭션이 실행됩니다. 그렇지 않으면 거부됩니다. 기술적인 세부 사항은 다음 링크를 참조하십시오.

* [CPU 구성 변수](https://github.com/AntelopeIO/leap/blob/a4c29608472dd195d36d732052784aadc3a779cb/libraries/chain/include/eosio/chain/config.hpp#L66)
* [트랜잭션 초기화](https://github.com/AntelopeIO/leap/blob/e55669c42dfe4ac112e3072186f3a449936c0c61/libraries/chain/controller.cpp#L1559)
* [트랜잭션 CPU 청구](https://github.com/AntelopeIO/leap/blob/e55669c42dfe4ac112e3072186f3a449936c0c61/libraries/chain/controller.cpp#L1577)
* [트랜잭션에 대한 CPU 사용량 확인](https://github.com/AntelopeIO/leap/blob/a4c29608472dd195d36d732052784aadc3a779cb/libraries/chain/transaction_context.cpp#L381)

### 주관적인 CPU 청구

주관적 청구는 EOS 블록체인의 선택적 기능입니다. 이를 통해 노드는 나머지 네트워크와 청구를 공유하지 않고 자체 노드에서 로컬로 계정 리소스를 청구할 수 있습니다. 도입 이후 주관적 청구는 노드 CPU 사용량을 거의 90%까지 줄였기 때문에 이를 채택한 노드에 이점이 있었습니다. 그러나 이로 인해 트랜잭션이 실패하거나 트랜잭션이 손실될 수 있습니다. 주관적인 청구는 스마트 계약 코드가 다음과 같은 "확인" 기능을 사용할 때 거래 실패를 유발할 수 있습니다. `assert()` 또는 `check()` 데이터를 확인하는 명령입니다. 이러한 상황이 발생하면 시스템 계약 실행 초기에 주장하거나 확인하여 적용된 청구를 줄이십시오. 오류 메시지가 없어도 사용자 경험에 영향을 미치지 않는 경우 시스템 계약은 일부 주장 및 확인을 반환 문으로 대체하여 이점을 얻을 수 있습니다. 이 교체는 거래가 성공하고 온체인에서 객관적으로 청구되도록 보장합니다.

주관적 청구에 대한 자세한 내용은 [주관적 청구 및 거래 손실 소개](https://eosnetwork.com/blog/api-plus-an-introduction-to-subjective-billing-and-lost-transactions/) 기사.

### CPU 대여 방법

CPU 리소스를 임대하는 방법에 대한 자세한 내용은 [계정 강화](#account-power-up) 부분.

## NET 리소스

CPU 및 RAM으로서 NET 리소스는 EOS 블록체인에서 중요한 시스템 리소스입니다. 블록체인이 트랜잭션을 실행할 때 CPU와 NET을 소비합니다. 트랜잭션이 완료되려면 지불인 계정에 충분한 NET이 할당되어야 합니다. NET이라고 합니다. `net bandwidth` 에 `dune -- cleos get account` 명령 출력.

### NET 계산 방법

각 트랜잭션은 미리 정의된 최대 트랜잭션 NET 사용량 값을 초과할 수 없는 NET 양을 소비해야 합니다. EOS 블록체인의 경우 이 제한은 블록체인 구성에서 설정됩니다. 다음 명령을 실행하여 이 한도를 확인하고 `max_transaction_net_usage` 바이트로 표현됩니다.

```shell
dune -- cleos get consensus_parameters
```

트랜잭션을 실행하는 계정의 경우 블록체인은 각 트랜잭션이 실행되기 전에 각 블록의 나머지 리소스를 계산하고 업데이트합니다. 거래가 실행될 준비가 되면 블록체인은 지급인 계정에 거래 실행을 처리하기에 충분한 NET가 있는지 여부를 결정합니다. 필요한 NET은 블록체인에 저장될 때 압축된 트랜잭션의 크기인 트랜잭션 크기를 기반으로 계산됩니다. 계정에 NET 리소스가 충분하면 트랜잭션을 실행할 수 있습니다. 그렇지 않으면 거부됩니다. 기술적인 세부 사항은 다음 출처를 참조하십시오.

* [NET 구성 변수](https://github.com/AntelopeIO/leap/blob/a4c29608472dd195d36d732052784aadc3a779cb/libraries/chain/include/eosio/chain/config.hpp#L57)
* [트랜잭션 초기화](https://github.com/AntelopeIO/leap/blob/e55669c42dfe4ac112e3072186f3a449936c0c61/libraries/chain/controller.cpp#L1559)
* [트랜잭션 NET 청구](https://github.com/AntelopeIO/leap/blob/e55669c42dfe4ac112e3072186f3a449936c0c61/libraries/chain/controller.cpp#L1577)
* [트랜잭션에 대한 NET 사용량 확인](https://github.com/AntelopeIO/leap/blob/a4c29608472dd195d36d732052784aadc3a779cb/libraries/chain/transaction_context.cpp#L376)

### NET 대여 방법

NET 리소스를 대여하는 방법에 대한 자세한 내용은 [계정 강화](#account-power-up) 부분.

## 리소스 비용 추정

개발자로서 트랜잭션 실행에 필요한 CPU 및 NET의 양을 추정하려는 경우 다음 방법 중 하나를 사용할 수 있습니다.

* 사용 `--dry-run` 에 대한 옵션 `dune -- cleos push transaction` 명령.
* 트랜잭션을 압축하여 블록체인으로 보낼 수 있는 모든 도구를 사용하고 `--dry-run` 옵션.
* 체인 API 엔드포인트 사용 [`compute_transaction`](https://github.com/AntelopeIO/leap/blob/51c11175e54831474a89a449beea1fb067e3d1e9/plugins/chain_plugin/include/eosio/chain_plugin/chain_plugin.hpp#L489).

모든 경우에 트랜잭션이 처리될 때 블록체인 노드는 트랜잭션 실행을 시뮬레이션하고 결과적으로 블록체인의 상태가 예측적으로 변경되어 CPU 및 NET 측정이 수행될 수 있습니다. 그러나 트랜잭션은 블록체인으로 전송되지 않으며 호출자는 예상 CPU 및 NET 비용을 대가로 받습니다.

## 계정 강화

계정 전원을 켜는 것은 PowerUp 리소스 모델에서 CPU 및 NET 리소스를 임대하는 기술입니다. 스마트 계약은 블록체인에서 이 모델을 구현하고 이러한 리소스를 선택한 계정에 할당합니다. 계정을 강화하는 작업은 `powerup`. 다음을 매개변수로 사용합니다.

* `payer` 유효한 EOS 계정이어야 합니다.
* `receiver` 자원 중 유효한 EOS 계정이어야 합니다.
* `days` 항상 일치해야 하는 `state.powerup_days` 에 지정된 [파워업 구성 설정](https://github.com/eosnetworkfoundation/eos-system-contracts/blob/7cec470b17bd53b8c78465d4cbd889dbaf1baffb/contracts/eosio.system/include/eosio.system/eosio.system.hpp#L588).
* `net_frac`, 그리고 `cpu_frac` 필요한 리소스의 백분율입니다. 백분율을 계산하는 가장 쉬운 방법은 10^15(100%)에 원하는 백분율을 곱하는 것입니다. 예: 10^15 * 0.01 = 10^13.
* `max_payment`, EOS로 표현해야 하며 최대 금액입니다. `payer` 지불할 용의가 있습니다.

```sh
dune -- cleos push action eosio powerup '[user, user, 1, 10000000000000, 10000000000000, "1000.0000 EOS"]' -p user
```

수신한 NET 및 CPU 가중치와 수수료 금액을 확인하려면 `eosio.reserv::powupresult` 액션에 의해 반환되며 아래와 유사해야 합니다.

```console
executed transaction: 82b7124601612b371b812e3bf65cf63bb44616802d3cd33a2c0422b58399f54f  144 bytes  521 us
#         eosio <= eosio::powerup               {"payer":"user","receiver":"user","days":1,"net_frac":"10000000000000","cpu_frac":"10000000000000","...
#   eosio.token <= eosio.token::transfer        {"from":"user","to":"eosio.rex","quantity":"999.9901 EOS","memo":"transfer from user to eosio.rex"}
#  eosio.reserv <= eosio.reserv::powupresult    {"fee":"999.9901 EOS","powup_net_weight":"16354","powup_cpu_weight":"65416"}
#          user <= eosio.token::transfer        {"from":"user","to":"eosio.rex","quantity":"999.9901 EOS","memo":"transfer from user to eosio.rex"}
#     eosio.rex <= eosio.token::transfer        {"from":"user","to":"eosio.rex","quantity":"999.9901 EOS","memo":"transfer from user to eosio.rex"}
```

EOS 블록체인의 PowerUp 자원 모델은 다음과 같이 초기화됩니다. `"powerup_days": 1,`. 이 설정은 24시간 동안 CPU와 NET을 임대할 수 있는 최대 기간을 허용합니다. 24시간 이내에 리소스를 사용하지 않으면 임대한 CPU와 NET이 만료됩니다.

### 만료된 주문 처리

만료된 대출 리소스는 시스템에서 자동으로 회수되지 않습니다. 만료된 대출은 처리해야 하는 대기열에 남아 있습니다.

다음에 대한 모든 호출 `powerup` 작업은 이 대기열도 처리합니다(한 번에 두 개의 만료된 대출로 제한됨). 따라서 만료된 대출은 적시에 자동으로 처리됩니다. 경우에 따라 대기열에서 만료된 대출을 수동으로 처리하여 리소스를 시스템으로 다시 릴리스하여 가격을 낮춰야 할 수도 있습니다. 따라서 모든 계정은 `powerupexec` 행동.

주문 테이블을 보려면 `powup.order` 다음 명령을 실행합니다.

```sh
dune -- cleos get table eosio 0 powup.order
```

```json
{
  "rows": [{
      "version": 0,
      "id": 0,
      "owner": "user",
      "net_weight": 16354,
      "cpu_weight": 65416,
      "expires": "2020-11-18T13:04:33"
    }
  ],
  "more": false,
  "next_key": ""
}
```

예 `powerupexec` 부르다:

```sh
dune -- cleos push action eosio powerupexec '[user, 2]' -p user
```

```console
executed transaction: 93ab4ac900a7902e4e59e5e925e8b54622715328965150db10774aa09855dc98  104 bytes  363 us
#         eosio <= eosio::powerupexec           {"user":"user","max":2}
warning: transaction executed locally, but may not be confirmed by the network yet         ]
```
