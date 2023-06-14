---
title: 概述
---

EOS EVM 实现了一个在 EOS 网络上运行的智能合约，我们将从这一点开始称它为
`EVM Contract`.要将交易发送到 EOS EVM 网络，必须将交易发送到 EVM 合约。
EOS EVM 合约与以太坊 EVM 完全兼容，除了一些可以
在咨询过 [EVM 兼容性](../30_compatibility/10_evm-compatibility.md) 部分。

为了实现完全的 RPC 兼容性，使用了功能齐全的以太坊节点。 EOS EVM 测试网和主网
使用建立在 Silkworm 节点之上的以太坊节点，从现在开始我们将其称为 `EOS EVM Node`.

EOS EVM 客户端发送的所有 RPC 请求、读取和写入，首先由代理组件处理，该代理组件
重定向请求如下：

- 读取 EOS EVM RPC 组件，以及
- 写入 Transaction Wrapper 服务。

### 读取请求

EOS EVM RPC 组件支持 JSON-RPC 读取请求，该组件是
[丝绸RPC](https://github.com/torquem-ch/silkrpc) 并实现为支持几乎所有以太坊的守护进程
由 EOS EVM 合约管理的虚拟 EVM 区块链的 JSON-RPC。两种 RPC 方法， `eth_sendRawTransaction` 
和 `eth_gasPrice` 被有意禁用，因为此守护进程不适合处理它们。而是请求
因为这两种方法被路由到专门为支持这两种 RPC 方法而设计的 Transaction Wrapper 服务。

EOS EVM RPC 组件依赖于（虚拟）EVM 区块链的执行客户端管理的数据库。处决
client 是 EOS EVM 节点组件，它是 [蚕](https://github.com/torquem-ch/silkworm) 修改工作
对支持 EOS EVM 所需的 EVM 运行时进行更改，例如无需信任的桥梁

EOS EVM 节点需要准确地重现 EOS EVM 合约最初完成的 EVM 交易执行。
它需要使用从 EOS EVM 合约中提取的数据重建由 EOS EVM 合约管理的虚拟 EVM 区块链。
EOS区块链。为了促进这一点，EOS EVM 节点连接到 EOS 节点的状态历史插件 (SHiP) 端点，该节点
是 EOS 区块链的一部分。

这种架构使得公开以太坊客户端 Web3 JSON RPC API 和必要时可能公开其他 API 成为可能。

### 写入请求

如前所述，这两个 RPC 方法， `eth_sendRawTransaction` 和 `eth_gasPrice`, 不是由 EOS EVM RPC 实现的。
相反，它们是由 `Transaction Wrapper` （在下图中 `Tx Wrapper`） 成分。因此，所有
*写请求*被转发到事务包装器，它将它们打包成 EOS 操作并将它们发送到 EVM 合约。

Transaction Wrapper 的主要目的是通过 `eth_sendRawTransaction` 并推动
他们到 EOS EVM 合约。
它通过以下步骤完成此操作：

1. 构造一个 EOS 交易，其中包含 `pushtx` EOS EVM 合约的动作，其中包括 rlp 编码的 EVM 交易。
2. 使用作为矿工的 EOS 账户的密钥签署 EOS 交易 `pushtx` 行动并支付 EOS 交易的 CPU/NET 成本。
3. 通过连接到 EOS 网络的 EOS 节点的链 API 将已签名的 EOS 交易发送到 EOS 区块链。

事务包装器还支持 `eth_gasPrice` RPC 方法，尽管它是一个读取方法，因为它
实现还取决于对 EOS 节点的链 API 的访问。特别是，它只是简单地获取最低 gas 价格
从适当的表中在 EOS EVM 合约中配置，并将其返回给调用者。

！[EOS EVM 总体设计](./images/EOS-EVM_design_drawio.svg)

如果认为有必要，该架构允许使用以太坊节点的其他实现
对于一些特定的场景。
