---
title: JSON RPC 호환성
---

모든 JSON-RPC 호출은 Silkworm 노드를 기반으로 구축된 전체 기능 EOS EVM 노드 덕분에 본질적으로 지원됩니다. 그러나 일부 메서드는 다음과 같은 이유로 현재 단계에서 차단됩니다.

* 일부 메서드는 더 이상 사용되지 않거나 중단되었습니다.
* 일부 방법은 로컬 노드 시나리오를 위해 설계되었습니다. 공개 API에 노출되지 않지만 자체 EOS EVM 노드를 배포할 때 액세스할 수 있습니다.
* 일부 메서드에는 복잡한 논리가 포함되어 있으므로 노출되기 전에 더 많은 테스트를 수행해야 합니다.

## RPC 목록

노트:
* 아래 나열된 JSON-RPC 호출에는 현재 단계에서 차단된 메서드가 포함되지 않습니다.
* "EOS EVM Node-SlowQuery"는 느리거나 무거운 쿼리를 처리하는 전용 노드로 지정됩니다. 이는 느린 쿼리가 다른 메서드 요청을 제공하는 일반 노드의 성능을 중지하거나 저하시키지 않도록 수행됩니다.

| RPC 방식 | 목적지 |
| ------------------------------------------- | ------------ |
| net\_version | EOS EVM 노드 |
| eth\_blockNumber | EOS EVM 노드 |
| eth\_chainId | EOS EVM 노드 |
| eth\_protocolVersion | EOS EVM 노드 |
| eth\_gas가격 | Tx 래퍼 |
| eth\_getBlockByHash | EOS EVM 노드 |
| eth\_getBlockByNumber | EOS EVM 노드 |
| eth\_getBlockTransactionCountByHash | EOS EVM 노드 |
| eth\_getBlockTransactionCountByNumber | EOS EVM 노드 |
| eth\_getUncleByBlockHashAndIndex | EOS EVM 노드 |
| eth\_getUncleByBlockNumberAndIndex | EOS EVM 노드 |
| eth\_getUncleCountByBlockHash | EOS EVM 노드 |
| eth\_getUncleCountByBlockNumber | EOS EVM 노드 |
| eth\_getTransactionByHash | EOS EVM 노드 |
| eth\_getRawTransactionByHash | EOS EVM 노드 |
| eth\_getTransactionByBlockHashAndIndex | EOS EVM 노드 |
| eth\_getRawTransactionByBlockHashAndIndex | EOS EVM 노드 |
| eth\_getTransactionByBlockNumberAndIndex | EOS EVM 노드 |
| eth\_getRawTransactionByBlockNumberAndIndex | EOS EVM 노드 |
| eth\_getTransactionReceipt | EOS EVM 노드 |
| eth\_getBlockReceipts | EOS EVM 노드 |
| eth\_estimateGas | EOS EVM 노드 |
| eth\_getBalance | EOS EVM 노드 |
| eth\_getCode | EOS EVM 노드 |
| eth\_getTransactionCount | EOS EVM 노드 |
| eth\_getStorageAt | EOS EVM 노드 |
| eth\_call | EOS EVM 노드 |
| eth\_callBundle | EOS EVM 노드 |
| eth\_createAccessList | EOS EVM 노드 |
| eth\_getLogs | EOS EVM 노드-SlowQuery |
| eth\_sendRaw트랜잭션 | Tx 래퍼 |
| debug\_traceBlockByHash | EOS EVM 노드-SlowQuery |
| debug\_traceBlockByNumber | EOS EVM 노드-SlowQuery |
| debug\_trace트랜잭션 | EOS EVM 노드-SlowQuery |
| debug\_traceCall | EOS EVM 노드-SlowQuery |
| 추적\_호출 | EOS EVM 노드-SlowQuery |
| trace\_callMany | EOS EVM 노드-SlowQuery |
| trace\_raw트랜잭션 | EOS EVM 노드-SlowQuery |
| trace\_replayBlockTransactions | EOS EVM 노드-SlowQuery |
| trace\_replay트랜잭션 | EOS EVM 노드-SlowQuery |
| 추적\_블록 | EOS EVM 노드-SlowQuery |
| 추적\_필터 | EOS EVM 노드-SlowQuery |
| 추적\_get | EOS EVM 노드-SlowQuery |
| trace\_transaction | EOS EVM 노드-SlowQuery |

## 일괄 요청

JSON-RPC API에 요청 객체 배열을 본문으로 보내는 것은 현재 지원되지 않습니다. 이 경우 서버는 400 오류를 반환합니다. 이것이 영향을 미치는 경우 이것이 지원될 때까지 해결 방법을 시도하십시오.

실패한 요청 본문의 예:
```json
[{"method":"eth_chainId","params":[],"id":1,"jsonrpc":"2.0"},{"method":"eth_blockNumber","params":[],"id":2,"jsonrpc":"2.0"}]
```
