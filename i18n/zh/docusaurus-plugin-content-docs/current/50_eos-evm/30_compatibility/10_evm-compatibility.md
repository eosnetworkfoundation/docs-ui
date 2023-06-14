---
title: EVM 兼容性
---

EOS EVM 完全兼容以太坊 EVM 规范，包括所有预编译和操作码。但是，EOS EVM 存在一些关键差异：

## 嵌套调用限制

由于 EOS EVM 合约的限制，EOS EVM 目前最多支持五 (5) 个嵌套调用。 EOS EVM 团队将不断优化设计以增加这个数字。

## 保留地址

以十二开头的 EVM 地址 `0xbb` 字节，例如 `0xbbbbbbbbbbbbbbbbbbbbbbbb5530ea015b900000`, 保留用于在 EVM 内的原生 EOS 和 EOS 之间桥接 EOS。向这些地址发送带有值的消息可能会启动桥交易或中止交易，具体取决于各种桥规则。

此外，虽然不太可能，但任何导致保留地址的合约创建也会中止交易。

## 预编译

EOS EVM 支持以太坊支持的所有预编译，具有以下规定：

### `modexp (0x05)`

这 `exponent` 位大小不能超过 `base` 位大小或 `modulus` 位大小。

> ℹ️ 未满足的限制
如果不满足上述限制，预编译将抛出异常并停止事务。

## 操作码

### `BLOCKHASH (0x40)`

该操作码目前不返回指定区块内容的哈希值，而是返回指定区块高度的哈希值和链ID：

`block_hash = sha256( msg(block_height, chain_id) )`

在哪里：
* `block_height`: 指定的 64 位区块高度
* `chain_id`: 用作 64 位盐值
* `msg`：前导零字节 (0x00) 常量的串联， `block_height`, 和 `chain_id`, 大端格式。

> ℹ️ 版本字节
哈希中的前导零字节是一个版本字节，如果将来引入新的块哈希方案，它可能会发生变化。

### `COINBASE (0x41)`

该操作码返回 EOS EVM 合约账户的地址， `eosio.evm`.现在的地址是 `0xbbbbbbbbbbbbbbbbbbbbbbbb5530ea015b900000`.

### `DIFFICULTY (0x44)`

该操作码目前默认返回 1（一），因为底层 EOS 共识协议没有散列难度。

### `GASLIMIT (0x45)`

该操作码当前返回 `0x7FFFFFFFFFF` (2^43-1) 作为 EOS EVM 中的最大气体限制。
