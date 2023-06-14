---
title: 协议指南
---

＃＃ 核

这 `EOS Core` 提供了基本的构建块 `system` 层。但是，由于它们不是作为智能合约实施的，因此它们不提供相同级别的灵活性。尽管如此， `core` 实现也是开源的，因此可以对其进行修改以满足自定义业务需求。

核心协议是：

1. [共识协议](01_consensus-protocol.md)
2. [交易协议](02_transactions-protocol.md)
3. [网络或点对点协议](03_network-peer-protocol.md)

＃＃ 系统

EOS 区块链的独特之处在于构建在其上的区块链的特性和特性是灵活的，即它们可以改变或完全修改以适应每个业务案例的需求。核心区块链功能，如共识、费用表、账户创建和修改、代币经济学、区块生产者注册、投票、多重签名等，在部署在 EOS 区块链上的区块链上的智能合约中实现。这些智能合约被称为 `system contracts` 层作为 `EOS system` 层，或者只是 `system` 层。

EOS 网络基金会实施和维护这些 `system contracts` 仅作为参考实现，封装了基于 EOS 的区块链的基本功能。这 `system contracts` 如下所列：

* [eosio.bios](https://github.com/eosnetworkfoundation/eos-system-contracts/tree/main/contracts/eosio.bios) - 这 `eosio.bios` contract 是一个特殊的合约，用于初始化区块链
* [eosio.system](https://github.com/eosnetworkfoundation/eos-system-contracts/tree/main/contracts/eosio.system) - 这 `eosio.system` 合约是实现基础 EOS 区块链功能的核心合约
* [eosio.msig](https://github.com/eosnetworkfoundation/eos-system-contracts/tree/main/contracts/eosio.msig) - 这 `eosio.msig` 合约实现多重签名功能
* [eosio.token](https://github.com/eosnetworkfoundation/eos-system-contracts/tree/main/contracts/eosio.token) - 这 `eosio.token` 合约实现系统代币功能
* [eosio.wrap](https://github.com/eosnetworkfoundation/eos-system-contracts/tree/main/contracts/eosio.wrap) - 这 `eosio.wrap` 合约实现治理功能
