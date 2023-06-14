---
title: 이적 관전
---

EOS 네트워크 내에서 발생하는 모든 전송을 보고 싶을 수 있습니다. 이는 **교환** 및
들어오는/나가는 자금을 추적해야 하는 **지갑**.

EOS에서는 전송이 발생할 수 있는 여러 가지 방법이 있습니다. 가장 일반적인 방법은 `transfer` 트랜잭션에 대한 조치
직접, 그러나 전송은 비전송 작업에 의해 트리거된 인라인 작업으로도 발생할 수 있습니다. 너만 있다면
블록을 보고 있으면 인라인 액션 전송을 놓치게 됩니다. 이것은 사용자 경험에 영향을 미칠 수 있습니다.

> ❔ **인라인 액션이란?**
>
> 인라인 작업은 다른 작업에 의해 트리거되는 작업입니다. 예를 들어, 분산형에서 인출할 때
> 교환, 교환은 토큰을 사용자에게 보내는 전송 작업을 트리거합니다. 이 전송 작업은 인라인
> 동작, `exchange::withdraw` 행동. 루트 수준이 아닌 작업이었습니다.

이 튜토리얼은 전송 감시에 중점을 두지만 동일한 방법을 사용하여 다음과 같은 작업을 감시할 수 있습니다.
모든 계약에서 EOS 네트워크에서 발생합니다.

## 토큰 ABI 다운로드

전송을 감시하려면 토큰 계약에 대한 ABI를 다운로드해야 합니다. 다음 중 하나를 컴파일할 수 있습니다.
직접 계약하거나 ABI를 직접 다운로드할 수 있습니다.

### 컬 사용

당신이 사용할 수있는 `curl` EOS 메인넷에서 직접 ABI를 가져옵니다.

```shell
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{ "account_name":"eosio.token" }' \
  https://eos.greymass.com/v1/chain/get_abi | jq -r '.abi' > ./eosio.token.abi
```

위의 명령은 다음에 대한 ABI를 가져옵니다. `eosio.token` 컨트랙트의 ABI를 불러와서 라는 파일에 저장합니다. `eosio.token.abi`.

### 문서에서 ABI 복사

다음은 ABI입니다. `eosio.token` 계약. 이것을 응용 프로그램에 직접 복사할 수 있습니다.
이것은 메인넷에서 직접 가져온 것이지만, 다음과 같을 것이라는 보장은 없습니다.
이것을 읽으십시오.

<상세>
    <summary>JSON ABI 참조</summary>

```json
{
  "version": "eosio::abi/1.1",
  "types": [],
  "structs": [
    {
      "name": "account",
      "base": "",
      "fields": [
        {
          "name": "balance",
          "type": "asset"
        }
      ]
    },
    {
      "name": "close",
      "base": "",
      "fields": [
        {
          "name": "owner",
          "type": "name"
        },
        {
          "name": "symbol",
          "type": "symbol"
        }
      ]
    },
    {
      "name": "create",
      "base": "",
      "fields": [
        {
          "name": "issuer",
          "type": "name"
        },
        {
          "name": "maximum_supply",
          "type": "asset"
        }
      ]
    },
    {
      "name": "currency_stats",
      "base": "",
      "fields": [
        {
          "name": "supply",
          "type": "asset"
        },
        {
          "name": "max_supply",
          "type": "asset"
        },
        {
          "name": "issuer",
          "type": "name"
        }
      ]
    },
    {
      "name": "issue",
      "base": "",
      "fields": [
        {
          "name": "to",
          "type": "name"
        },
        {
          "name": "quantity",
          "type": "asset"
        },
        {
          "name": "memo",
          "type": "string"
        }
      ]
    },
    {
      "name": "open",
      "base": "",
      "fields": [
        {
          "name": "owner",
          "type": "name"
        },
        {
          "name": "symbol",
          "type": "symbol"
        },
        {
          "name": "ram_payer",
          "type": "name"
        }
      ]
    },
    {
      "name": "retire",
      "base": "",
      "fields": [
        {
          "name": "quantity",
          "type": "asset"
        },
        {
          "name": "memo",
          "type": "string"
        }
      ]
    },
    {
      "name": "transfer",
      "base": "",
      "fields": [
        {
          "name": "from",
          "type": "name"
        },
        {
          "name": "to",
          "type": "name"
        },
        {
          "name": "quantity",
          "type": "asset"
        },
        {
          "name": "memo",
          "type": "string"
        }
      ]
    }
  ],
  "actions": [
    {
      "name": "close",
      "type": "close",
      "ricardian_contract": "---\nspec_version: \"0.2.0\"\ntitle: Close Token Balance\nsummary: 'Close {{nowrap owner}}’s zero quantity balance'\nicon: https://raw.githubusercontent.com/cryptokylin/eosio.contracts/v1.7.0/contracts/icons/token.png#207ff68b0406eaa56618b08bda81d6a0954543f36adc328ab3065f31a5c5d654\n---\n\n{{owner}} agrees to close their zero quantity balance for the {{symbol_to_symbol_code symbol}} token.\n\nRAM will be refunded to the RAM payer of the {{symbol_to_symbol_code symbol}} token balance for {{owner}}."
    },
    {
      "name": "create",
      "type": "create",
      "ricardian_contract": "---\nspec_version: \"0.2.0\"\ntitle: Create New Token\nsummary: 'Create a new token'\nicon: https://raw.githubusercontent.com/cryptokylin/eosio.contracts/v1.7.0/contracts/icons/token.png#207ff68b0406eaa56618b08bda81d6a0954543f36adc328ab3065f31a5c5d654\n---\n\n{{$action.account}} agrees to create a new token with symbol {{asset_to_symbol_code maximum_supply}} to be managed by {{issuer}}.\n\nThis action will not result any any tokens being issued into circulation.\n\n{{issuer}} will be allowed to issue tokens into circulation, up to a maximum supply of {{maximum_supply}}.\n\nRAM will deducted from {{$action.account}}’s resources to create the necessary records."
    },
    {
      "name": "issue",
      "type": "issue",
      "ricardian_contract": "---\nspec_version: \"0.2.0\"\ntitle: Issue Tokens into Circulation\nsummary: 'Issue {{nowrap quantity}} into circulation and transfer into {{nowrap to}}’s account'\nicon: https://raw.githubusercontent.com/cryptokylin/eosio.contracts/v1.7.0/contracts/icons/token.png#207ff68b0406eaa56618b08bda81d6a0954543f36adc328ab3065f31a5c5d654\n---\n\nThe token manager agrees to issue {{quantity}} into circulation, and transfer it into {{to}}’s account.\n\n{{#if memo}}There is a memo attached to the transfer stating:\n{{memo}}\n{{/if}}\n\nIf {{to}} does not have a balance for {{asset_to_symbol_code quantity}}, or the token manager does not have a balance for {{asset_to_symbol_code quantity}}, the token manager will be designated as the RAM payer of the {{asset_to_symbol_code quantity}} token balance for {{to}}. As a result, RAM will be deducted from the token manager’s resources to create the necessary records.\n\nThis action does not allow the total quantity to exceed the max allowed supply of the token."
    },
    {
      "name": "open",
      "type": "open",
      "ricardian_contract": "---\nspec_version: \"0.2.0\"\ntitle: Open Token Balance\nsummary: 'Open a zero quantity balance for {{nowrap owner}}'\nicon: https://raw.githubusercontent.com/cryptokylin/eosio.contracts/v1.7.0/contracts/icons/token.png#207ff68b0406eaa56618b08bda81d6a0954543f36adc328ab3065f31a5c5d654\n---\n\n{{ram_payer}} agrees to establish a zero quantity balance for {{owner}} for the {{symbol_to_symbol_code symbol}} token.\n\nIf {{owner}} does not have a balance for {{symbol_to_symbol_code symbol}}, {{ram_payer}} will be designated as the RAM payer of the {{symbol_to_symbol_code symbol}} token balance for {{owner}}. As a result, RAM will be deducted from {{ram_payer}}’s resources to create the necessary records."
    },
    {
      "name": "retire",
      "type": "retire",
      "ricardian_contract": "---\nspec_version: \"0.2.0\"\ntitle: Remove Tokens from Circulation\nsummary: 'Remove {{nowrap quantity}} from circulation'\nicon: https://raw.githubusercontent.com/cryptokylin/eosio.contracts/v1.7.0/contracts/icons/token.png#207ff68b0406eaa56618b08bda81d6a0954543f36adc328ab3065f31a5c5d654\n---\n\nThe token manager agrees to remove {{quantity}} from circulation, taken from their own account.\n\n{{#if memo}} There is a memo attached to the action stating:\n{{memo}}\n{{/if}}"
    },
    {
      "name": "transfer",
      "type": "transfer",
      "ricardian_contract": "---\nspec_version: \"0.2.0\"\ntitle: Transfer Tokens\nsummary: 'Send {{nowrap quantity}} from {{nowrap from}} to {{nowrap to}}'\nicon: https://raw.githubusercontent.com/cryptokylin/eosio.contracts/v1.7.0/contracts/icons/transfer.png#5dfad0df72772ee1ccc155e670c1d124f5c5122f1d5027565df38b418042d1dd\n---\n\n{{from}} agrees to send {{quantity}} to {{to}}.\n\n{{#if memo}}There is a memo attached to the transfer stating:\n{{memo}}\n{{/if}}\n\nIf {{from}} is not already the RAM payer of their {{asset_to_symbol_code quantity}} token balance, {{from}} will be designated as such. As a result, RAM will be deducted from {{from}}’s resources to refund the original RAM payer.\n\nIf {{to}} does not have a balance for {{asset_to_symbol_code quantity}}, {{from}} will be designated as the RAM payer of the {{asset_to_symbol_code quantity}} token balance for {{to}}. As a result, RAM will be deducted from {{from}}’s resources to create the necessary records."
    }
  ],
  "tables": [
    {
      "name": "accounts",
      "index_type": "i64",
      "key_names": [],
      "key_types": [],
      "type": "account"
    },
    {
      "name": "stat",
      "index_type": "i64",
      "key_names": [],
      "key_types": [],
      "type": "currency_stats"
    }
  ],
  "ricardian_clauses": [],
  "error_messages": [],
  "abi_extensions": [],
  "variants": [],
  "action_results": []
}
```

</세부 사항>

### 계약서 직접 작성하기

다음을 복제할 수 있습니다. [EOS 시스템 계약](https://github.com/eosnetworkfoundation/eos-system-contracts/) 저장소,
그런 다음 다음을 사용하여 계약을 컴파일합니다. `build.sh` 스크립트.

그러면 `build/contracts` 컴파일된 계약이 포함된 디렉터리입니다.

## 구성 파일 업데이트

업데이트해야 합니다. `config.ini` 다음 옵션을 포함하는 파일:

```shell
# Plugins required for the Trace API
plugin = eosio::chain_plugin
plugin = eosio::http_plugin
plugin = eosio::trace_api_plugin

# Tell the Trace API where ABIs are for the contracts you care about 
trace-rpc-abi=eosio.token=<YOUR_PATH_to_eosio.token.abi>

# You may also manually specify a traces directory
trace-dir=/path/to/traces
```

## 다시 재생해야 하나요?

Trace API를 활성화하면 플러그인을 활성화한 후에 생성된 블록에 대한 추적만 얻을 수 있습니다.
플러그인을 활성화하기 전에 생성된 블록에 대한 추적을 얻으려면 체인을 재생해야 합니다.
그 블록에서.

> 🕔 **EOS EVM 런칭 후 다시보기를 원하시나요?**
>
> 목표가 EOS EVM에서 발생하는 전송에 대한 추적을 얻는 것이라면, 또는 이전에 찍은 스냅샷을 사용할 수 있습니다.
> 2023-04-05T02:18:09 UTC. 그렇게 하면 EOS EVM에서 발생한 전송에 대한 추적을 얻을 수 있지만 그렇지는 않습니다.
> EOS EVM 출시 전에 생성된 블록을 재생하는 데 시간을 낭비합니다.

## SSD 고려 사항

Trace API의 지속 데이터는 `blocks.log`. 저장하려면 더 많은 SSD 스토리지가 필요합니다.
거래의 완전한 기록을 가질 수 있게 해주는 추적.

오래된 추적을 제거하고 로그 파일을 압축하여 디스크 사용을 최적화할 수 있습니다.

이것들을 당신의 `config.ini` 파일:
```shell
# Remove old traces
trace-minimum-irreversible-history-blocks=<number of blocks to keep>

# Compress log files
trace-minimum-uncompressed-history-blocks=<number of blocks to keep uncompressed>
```

## Trace API를 사용하여 블록 보기

일반적으로 `/v1/chain/get_block` 모든 블록에 대해 요청한 다음 `actions` 각각의 배열
거래 `transactions` 전송을 검색할 배열입니다.

<상세>
    <summary>체인 블록을 가져오려면 curl 명령을 참조하세요.</summary>

```shell
curl -X POST \
   -H "Content-Type: application/json" \
   -d '{ "block_num_or_id": 2 }' \
   http://127.0.0.1:8888/v1/chain/get_block | jq
```

</세부 사항>

Trace API를 사용하도록 설정하면 이제 `/v1/trace_api/get_block` 대신 거의 동일한 결과 형식을 제공합니다.
제외하고 `actions` 배열에는 루트 작업뿐만 아니라 실행된 인라인 작업도 포함됩니다.
이는 체인으로 전송된 루트 작업만이 아니라 트랜잭션 실행 중에 발생한 일에 대한 완전한 그림을 그립니다.

<상세>
    <summary>추적 블록을 가져오려면 curl 명령 참조</summary>

```shell
curl -X POST \
   -H "Content-Type: application/json" \
   -d '{ "block_num": 2 }' \
   http://127.0.0.1:8888/v1/trace_api/get_block | jq
```

</세부 사항>

Trace API에 대해 주의해야 할 몇 가지 다른 중요한 사항이 있습니다. `get_block` 끝점:
- 행동의 `name` 이제 속성이 호출됩니다. `action`
- 행동의 `data` 이제 속성이 호출됩니다. `params`
- `block_num_or_id` POST 데이터 매개변수는 이제 `block_num`

> 📄 **API 참조**
>
> Trace API에 대한 자세한 내용은 [API 참조](https://docs.eosnetwork.com/apis/leap/latest/trace_api.api).


### 두 형식의 예

<상세>
    <summary>chain/get_block 참조</summary>

```json
{
  "timestamp": "2023-06-02T15:10:56.500",
  "producer": "eosio",
  "confirmed": 0,
  "previous": "000000140022c6320e45d8d390e686b6ce6148db4d602884be01776ad8d18c46",
  "transaction_mroot": "430716daff9428cf0327dd9fd08478295a4422bf303b13a74d88379a5e89ff5f",
  "action_mroot": "3ee0e97056c1c592ee755d9d26e178d810dba8c0af57410632fc0e7c4ac9f9a0",
  "schedule_version": 0,
  "new_producers": null,
  "producer_signature": "SIG_K1_KiSmFVmh498vHRj5rzWvFKo1zJDV2vUv5hfQVwpyj1GtYF1wSedAkJ2zihMWMjFWxqZmWVJZtW3wCFLBtAEDTSxjK7deQV",
  "transactions": [
    {
      "status": "executed",
      "cpu_usage_us": 192,
      "net_usage_words": 17,
      "trx": {
        "id": "1c073fe57292a253ea18cd7075c5420301038197806eeda51e94a33ce63be935",
        "signatures": [
          "SIG_K1_KVPDUxX5DbokbpYj9VgNZw3AZHu9HCLcH2CJbMhJuY2MfcufaLcaRz3KAwLJd12JkoR6r1EUN2XeTVjrDtorKFMiMwnd4f"
        ],
        "compression": "none",
        "packed_context_free_data": "",
        "context_free_data": [],
        "packed_trx": "9e067a641300ba187bdd00000000010000e82a01ea3055000000dcdcd4b2e3010000000000000e3d00000000a8ed3232270000000000000e3da08601000000000004454f5300000000a0d8340d75a524c50631323334353600",
        "transaction": {
          "expiration": "2023-06-02T15:11:26",
          "ref_block_num": 19,
          "ref_block_prefix": 3715831994,
          "max_net_usage_words": 0,
          "max_cpu_usage_ms": 0,
          "delay_sec": 0,
          "context_free_actions": [],
          "actions": [
            {
              "account": "eosio.dex",
              "name": "withdraw",
              "authorization": [
                {
                  "actor": "bob",
                  "permission": "active"
                }
              ],
              "data": {
                "account": "bob",
                "quantity": "10.0000 EOS",
                "to": "someexchange",
                "memo": "123456"
              },
              "hex_data": "0000000000000e3da08601000000000004454f5300000000a0d8340d75a524c506313233343536"
            }
          ]
        }
      }
    }
  ],
  "id": "000000157b7f9e05cf80f8861df6e6bda357230ed7c8a29409d5c5d823fc0a1f",
  "block_num": 21,
  "ref_block_prefix": 2264432847
}
```
</세부 사항>

<상세>
    <summary>trace_api/get_block 참조</summary>

```json
{
  "id": "000000157b7f9e05cf80f8861df6e6bda357230ed7c8a29409d5c5d823fc0a1f",
  "number": 21,
  "previous_id": "000000140022c6320e45d8d390e686b6ce6148db4d602884be01776ad8d18c46",
  "status": "irreversible",
  "timestamp": "2023-06-02T15:10:56.500Z",
  "producer": "eosio",
  "transaction_mroot": "430716daff9428cf0327dd9fd08478295a4422bf303b13a74d88379a5e89ff5f",
  "action_mroot": "3ee0e97056c1c592ee755d9d26e178d810dba8c0af57410632fc0e7c4ac9f9a0",
  "schedule_version": 0,
  "transactions": [
    {
      "id": "2529fa879b6a4d7a75f892ab2ee9ace8c322355c2700c713b38c5b4aba023c2b",
      "block_num": 21,
      "block_time": "2023-06-02T15:10:56.500",
      "producer_block_id": null,
      "actions": [
        {
          "global_sequence": 50,
          "receiver": "eosio",
          "account": "eosio",
          "action": "onblock",
          "authorization": [
            {
              "account": "eosio",
              "permission": "active"
            }
          ],
          "data": "008619580000000000ea3055000000000013ce0c73faba187bdd5bce9432d8a5505b8da7a0a88a89d4c063d27b770000000000000000000000000000000000000000000000000000000000000000ceb2eeb65028c5680dfc06486faad42bfd7ff4c6e3b211058eff625d0d1f212f000000000000",
          "return_value": ""
        }
      ],
      "status": "executed",
      "cpu_usage_us": 100,
      "net_usage_words": 0,
      "signatures": [],
      "transaction_header": {
        "expiration": "2023-06-02T15:10:57",
        "ref_block_num": 20,
        "ref_block_prefix": 3554166030,
        "max_net_usage_words": 0,
        "max_cpu_usage_ms": 0,
        "delay_sec": 0
      }
    },
    {
      "id": "1c073fe57292a253ea18cd7075c5420301038197806eeda51e94a33ce63be935",
      "block_num": 21,
      "block_time": "2023-06-02T15:10:56.500",
      "producer_block_id": null,
      "actions": [
        {
          "global_sequence": 51,
          "receiver": "eosio.dex",
          "account": "eosio.dex",
          "action": "withdraw",
          "authorization": [
            {
              "account": "bob",
              "permission": "active"
            }
          ],
          "data": "0000000000000e3da08601000000000004454f5300000000a0d8340d75a524c506313233343536",
          "return_value": ""
        },
        {
          "global_sequence": 52,
          "receiver": "eosio.token",
          "account": "eosio.token",
          "action": "transfer",
          "authorization": [
            {
              "account": "eosio.dex",
              "permission": "active"
            }
          ],
          "data": "0000e82a01ea3055a0d8340d75a524c5a08601000000000004454f530000000006313233343536",
          "return_value": "",
          "params": {
            "from": "eosio.dex",
            "to": "someexchange",
            "quantity": "10.0000 EOS",
            "memo": "123456"
          }
        },
        {
          "global_sequence": 53,
          "receiver": "eosio.dex",
          "account": "eosio.token",
          "action": "transfer",
          "authorization": [
            {
              "account": "eosio.dex",
              "permission": "active"
            }
          ],
          "data": "0000e82a01ea3055a0d8340d75a524c5a08601000000000004454f530000000006313233343536",
          "return_value": "",
          "params": {
            "from": "eosio.dex",
            "to": "someexchange",
            "quantity": "10.0000 EOS",
            "memo": "123456"
          }
        },
        {
          "global_sequence": 54,
          "receiver": "someexchange",
          "account": "eosio.token",
          "action": "transfer",
          "authorization": [
            {
              "account": "eosio.dex",
              "permission": "active"
            }
          ],
          "data": "0000e82a01ea3055a0d8340d75a524c5a08601000000000004454f530000000006313233343536",
          "return_value": "",
          "params": {
            "from": "eosio.dex",
            "to": "someexchange",
            "quantity": "10.0000 EOS",
            "memo": "123456"
          }
        }
      ],
      "status": "executed",
      "cpu_usage_us": 192,
      "net_usage_words": 17,
      "signatures": [
        "SIG_K1_KVPDUxX5DbokbpYj9VgNZw3AZHu9HCLcH2CJbMhJuY2MfcufaLcaRz3KAwLJd12JkoR6r1EUN2XeTVjrDtorKFMiMwnd4f"
      ],
      "transaction_header": {
        "expiration": "2023-06-02T15:11:26",
        "ref_block_num": 19,
        "ref_block_prefix": 3715831994,
        "max_net_usage_words": 0,
        "max_cpu_usage_ms": 0,
        "delay_sec": 0
      }
    }
  ]
}
```
</세부 사항>

보시다시피, `chain/get_block` 들어오는 전송을 스캔하는 끝점, 당신은 놓쳤을 것입니다
트랜잭션에서 실행되고 잠재적으로 사용자의 자금을 손실한 토큰 전송 작업.

### 특정 작업 듣기

작업을 수신할 때 찾고자 하는 세 가지 기본 필드가 있습니다.

- **계정** - 실행 중인 계약을 알려줍니다.
- **action** - 계약에서 실행된 작업을 알려줍니다.
- **params** - 작업에 전달된 매개변수를 포함합니다.
- **receiver** - 어떤 컨트랙트가 액션을 받고 있는지 알려줍니다.

**EOS**의 토큰 전송을 듣고 있다면
**계정** 필드는 `eosio.token` **action** 필드는 `transfer`.

그런 다음 내부의 정보를 확인하고 싶을 것입니다. `params` 물체.

예를 들어, 당신이 `someexchange` 계정에서 `to` 입력란이 귀하의 계정과 일치합니다.
이름 및 메모 필드가 예상하는 일부 식별자와 일치할 수 있습니다.

> ⚠ **경고**
>
> 더 `receiver` 필드가 항상 같은 것은 아닙니다. `account` 필드. 만약 `receiver` 필드는 와 다릅니다.
> `account` 필드, 이것은 다른 계약이 부작용을 유발하도록 허용하는 알림이며 조치가 아닙니다.
> 처리해야 합니다.

<상세>
    <summary>전송 확인을 위한 JavaScript 예제</summary>

```javascript
const CONTRACT = "eosio.token";
const ACTION = "transfer";
const YOUR_ACCOUNT = "someexchange";

const result = await fetch('https://your.node/v1/trace_api/get_block', {
    method: 'POST',
    body: JSON.stringify({
        block_num: NEXT_BLOCK_NUM
    })
}).then(res => res.json())

for(let transaction of result.transactions) {
    for(let action of transaction.actions) {
        if(
            // This is the smart contract that is being executed
            action.account === CONTRACT
            // This is the action that is being executed
            && action.action === ACTION
            // This is the receiver of this action, if it is not the same as 
            // the contract account, then this is just a notification (DO NOT PROCESS)
            && action.receiver === action.account 
        ) {
            // We now know that this is a transfer action, and it is not 
            // a notification, so we can check the params
            if(action.params.to === YOUR_ACCOUNT) {
                
                // This transfer is for us, so we can do something with it
                const { quantity, memo } = action.params;
                const [amount, symbol] = quantity.split(' ');
                // You should also check that the symbol matches
                // the symbol that you're expecting as well
                if(symbol !== 'EOS') {
                    // This is not the token that we're expecting
                    continue;
                }
                
                
                // ... 
            }
        }
    }
}
```

</세부 사항>

## 블록을 감시하는 대신 트랜잭션 ID 사용

트랜잭션 ID가 있는 경우 대신 Trace API에서 직접 트랜잭션을 가져올 수 있습니다.

```shell
curl -X POST -H "Content-Type: application/json" \
   -d '{ "id": "YOUR_TRANSACTION_ID" }' \
   http://127.0.0.1:8888/v1/trace_api/get_transaction_trace | jq
```

이렇게 하면 다음과 정확히 동일한 형식의 단일 트랜잭션 추적이 제공됩니다. `get_block` 끝점.

> ⚠ **경고**
>
> 더 `v1/trace_api/get_transaction_trace` API는 트랜잭션이 발견될 때까지 추적 로그 파일의 각 블록을 스캔합니다.
> 이러한 이유로 이 API는 비효율적이며 테스트 목적으로만 사용해야 합니다.

<상세>
    <summary>예제 결과 보기</summary>

```json
{
  "id": "d11dc29013e40c5f132b1ae507622eaba6ab01e1e3ac1ecc875b7a80fdc72233",
  "block_num": 21,
  "block_time": "2023-06-02T15:15:33.500",
  "producer_block_id": null,
  "actions": [
    {
      "global_sequence": 51,
      "receiver": "eosio.dex",
      "account": "eosio.dex",
      "action": "withdraw",
      "authorization": [
        {
          "account": "bob",
          "permission": "active"
        }
      ],
      "data": "0000000000000e3da08601000000000004454f530000000000a6823403ea305506313233343536",
      "return_value": ""
    },
    {
      "global_sequence": 52,
      "receiver": "eosio.token",
      "account": "eosio.token",
      "action": "transfer",
      "authorization": [
        {
          "account": "eosio.dex",
          "permission": "active"
        }
      ],
      "data": "0000e82a01ea305500a6823403ea3055a08601000000000004454f530000000006313233343536",
      "return_value": "",
      "params": {
        "from": "eosio.dex",
        "to": "eosio.token",
        "quantity": "10.0000 EOS",
        "memo": "123456"
      }
    },
    {
      "global_sequence": 53,
      "receiver": "eosio.dex",
      "account": "eosio.token",
      "action": "transfer",
      "authorization": [
        {
          "account": "eosio.dex",
          "permission": "active"
        }
      ],
      "data": "0000e82a01ea305500a6823403ea3055a08601000000000004454f530000000006313233343536",
      "return_value": "",
      "params": {
        "from": "eosio.dex",
        "to": "eosio.token",
        "quantity": "10.0000 EOS",
        "memo": "123456"
      }
    }
  ],
  "status": "executed",
  "cpu_usage_us": 187,
  "net_usage_words": 17,
  "signatures": [
    "SIG_K1_JwowShN9caNF4PeX3oMN3PCwKqbfLKz3f1noURuftDSvEd9RiMdY4HGk2kbVJjN47QKcFJSFMh1Yf6uZAfYRxay8iWprzF"
  ],
  "transaction_header": {
    "expiration": "2023-06-02T15:16:03",
    "ref_block_num": 19,
    "ref_block_prefix": 3497594715,
    "max_net_usage_words": 0,
    "max_cpu_usage_ms": 0,
    "delay_sec": 0
  }
}
```
</세부 사항>

> 📄 **API 참조**
>
> Trace API에 대한 자세한 내용은 [API 참조](https://docs.eosnetwork.com/apis/leap/latest/trace_api.api).

