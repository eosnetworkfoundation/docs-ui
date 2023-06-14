---
title: JSON RPC 兼容性
---

得益于基于 Silkworm 节点构建的全功能 EOS EVM 节点，所有 JSON-RPC 调用都得到固有支持。但是，由于以下原因，某些方法在当前阶段被阻止：

* 某些方法已弃用或停用。
* 有些方法是为本地节点场景设计的。它们不会暴露给公共 API，但是您可以在部署自己的 EOS EVM 节点时访问它们。
* 一些方法涉及复杂的逻辑，因此需要进行更多的测试才能暴露。

## RPC 列表

笔记：
* 下面列出的 JSON-RPC 调用不包括在当前阶段被阻止的方法。
* “EOS EVM Node-SlowQuery”专用于处理缓慢或繁重查询的节点。这样做是为了让那些慢速查询不会停止或降低服务于其他方法请求的常规节点的性能。

| RPC 方法 |目的地 |
| ------------------------------------------ | ---------- |
|网络\_版本 | EOS EVM 节点 |
| eth\_blockNumber | EOS EVM 节点 |
| eth\_chainId | EOS EVM 节点 |
| eth\_protocolVersion | EOS EVM 节点 |
| eth\_gas价格 |交易包装器 |
| eth\_getBlockByHash | EOS EVM 节点 |
| eth\_getBlockByNumber | EOS EVM 节点 |
| eth\_getBlockTransactionCountByHash | EOS EVM 节点 |
| eth\_getBlockTransactionCountByNumber | EOS EVM 节点 |
| eth\_getUncleByBlockHashAndIndex | EOS EVM 节点 |
| eth\_getUncleByBlockNumberAndIndex | EOS EVM 节点 |
| eth\_getUncleCountByBlockHash | EOS EVM 节点 |
| eth\_getUncleCountByBlockNumber | EOS EVM 节点 |
| eth\_getTransactionByHash | EOS EVM 节点 |
| eth\_getRawTransactionByHash | EOS EVM 节点 |
| eth\_getTransactionByBlockHashAndIndex | EOS EVM 节点 |
| eth\_getRawTransactionByBlockHashAndIndex | EOS EVM 节点 |
| eth\_getTransactionByBlockNumberAndIndex | EOS EVM 节点 |
| eth\_getRawTransactionByBlockNumberAndIndex | EOS EVM 节点 |
| eth\_getTransactionReceipt | EOS EVM 节点 |
| eth\_getBlockReceipts | EOS EVM 节点 |
| eth\_estimateGas | EOS EVM 节点 |
| eth\_getBalance | EOS EVM 节点 |
| eth\_getCode | EOS EVM 节点 |
| eth\_getTransactionCount | EOS EVM 节点 |
| eth\_getStorageAt | EOS EVM 节点 |
| eth\_call | EOS EVM 节点 |
| eth\_callBundle | EOS EVM 节点 |
| eth\_createAccessList | EOS EVM 节点 |
| eth\_getLogs | EOS EVM Node-SlowQuery |
| eth\_sendRawTransaction |交易包装器 |
|调试\_traceBlockByHash | EOS EVM Node-SlowQuery |
|调试\_traceBlockByNumber | EOS EVM Node-SlowQuery |
|调试\_traceTransaction | EOS EVM Node-SlowQuery |
|调试\_traceCall | EOS EVM Node-SlowQuery |
|跟踪\_call | EOS EVM Node-SlowQuery |
|跟踪\_callMany | EOS EVM Node-SlowQuery |
|跟踪\_rawTransaction | EOS EVM Node-SlowQuery |
|跟踪\_replayBlockTransactions | EOS EVM Node-SlowQuery |
|跟踪\_replayTransaction | EOS EVM Node-SlowQuery |
|跟踪\_块 | EOS EVM Node-SlowQuery |
|跟踪\_过滤器 | EOS EVM Node-SlowQuery |
|跟踪\_get | EOS EVM Node-SlowQuery |
|跟踪\_交易 | EOS EVM Node-SlowQuery |

## 批量请求

目前不支持将请求对象数组作为正文发送到 JSON-RPC API。在这种情况下，服务器将返回 400 错误。如果这对您有影响，请尝试一种解决方法，直到它得到支持。

失败请求正文示例：
```json
[{"method":"eth_chainId","params":[],"id":1,"jsonrpc":"2.0"},{"method":"eth_blockNumber","params":[],"id":2,"jsonrpc":"2.0"}]
```
