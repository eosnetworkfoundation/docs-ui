---
title: 资源
---

EOS 区块链使用三种系统资源：CPU、NET 和 RAM。 EOS 账户需要足够的系统资源来与部署在区块链上的智能合约进行交互。

* [内存资源](#ram-resource)
* [CPU资源](#cpu-resource)
* [网络资源](#net-resource)

要为帐户分配 RAM 资源，您必须 [购买内存](#how-to-purchase-ram).
要将 CPU 和 NET 资源分配给您必须的帐户 [启动帐户](#account-power-up).

## 内存资源

RAM资源就是内存，存储空间，区块链存储数据的地方。如果你的合约需要在区块链上存储数据，它可以将其存储在区块链的 RAM 中作为 `multi-index table` 或 `singleton`.

### 内存高性能

存储在 EOS 区块链上的数据使用 RAM 作为其存储介质。因此，对区块链数据的访问是高性能和快速的。它的性能基准可以达到其他区块链很少达到的水平。这种能力将 EOS 区块链提升为全球最快区块链的竞争者。

### 内存重要性

RAM 是重要的系统资源，原因如下：

* Ram 是一种有限的资源。公共 EOS 区块链以 64GB 的总 RAM 开始。短暂的一段时间后，区块生产者决定将内存增加到每个区块 1KB。通过这种方式，RAM 的供应不断增加，但其价格却以较慢的速度上涨。

* 区块链执行许多动作都使用 RAM。例如，当您创建一个新账户时，新账户信息存储在区块链的 RAM 中。此外，当一个账户接受一个它之前没有持有的代币时，必须创建一个新记录，其中包含新接受的代币的余额。区块链内存必须由转移代币的账户或接受新代币类型的账户购买。

* 如果智能合约消耗了所有分配给它的 RAM，它就不能存储任何额外的信息。要在区块链数据库中继续保存数据，必须满足以下一个或两个条件：

  * 一部分占用的 RAM 由智能合约释放。
  * 更多RAM通过RAM购买过程分配给智能合约账户。

### 如何购买内存

RAM 资源必须与 `EOS` 系统令牌。 RAM 的价格是根据系统合约中实现的独特的 Bancor 流动性算法计算的。

计算RAM价格的最快方法：

1. 运行以下 dune 命令：（**注意：** 确保针对您选择的主网或测试网运行它。）

    ```shell
    dune -- cleos get table eosio eosio rammarket
```

2. 观察应类似于以下示例的输出：

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

3.记下 `base balance`，在本例中为 35044821247。
4.记下 `quote balance`，在本例中为 3158350.8754。
5. 计算 1Kib RAM 的价格为 `quote balance` * 1024 / `base balance` = 0.0922 EOS。

#### 使用命令行界面购买 RAM

您可以通过 dune 命令行界面工具购买 RAM。您可以购买以字节表示的明确数量的 RAM，也可以购买价值明确数量的 EOS 的 RAM。

#### 在 EOS 中购买 RAM

例如，下面的命令为帐户购买 `bob` 以当前 RAM 市场价格计算的 0.1 EOS 价值的 RAM。 RAM 的成本和此交易的执行由 `alice` 帐户和交易是由 `active` 的关键 `alice` 帐户。

```shell
dune -- cleos system buyram alice bob "0.1 EOS" -p alice@active
```

#### 以字节为单位购买 RAM

例如，下面的命令为帐户购买 `bob` 以当前 RAM 市场价格计算的 1000 RAM 字节。 RAM 的成本和此交易的执行由 `alice` 帐户和交易是由 `active` 的关键 `alice` 帐户。

```shell
dune -- cleos system buyrambytes alice bob "1000" -p alice@active
```

### RAM是如何计算的

智能合约存储其数据所需的必要 RAM 是根据使用的区块链状态计算得出的。

作为开发人员，要了解您的智能合约需要的 RAM 量，请注意您的智能合约实例化和使用的多索引表底层的数据结构。一个多索引表的数据结构定义了表中的一行。数据结构的每个数据成员对应于表的一个行单元格。
要估计一个多索引行需要存储在区块链上的 RAM 量，您必须添加每个数据成员类型的大小和每个已定义索引的内存开销（如果有）。在下面找到 EOS 代码为多索引表、索引和数据类型定义的开销：

* [多索引 RAM 字节开销](https://github.com/AntelopeIO/leap/blob/f6643e434e8dc304bba742422dd036a6fbc1f039/libraries/chain/include/eosio/chain/contract_table_objects.hpp#L240)
* [每行每索引 RAM 字节的开销](https://github.com/AntelopeIO/leap/blob/a4c29608472dd195d36d732052784aadc3a779cb/libraries/chain/include/eosio/chain/config.hpp#L109)
* [固定开销共享向量 RAM 字节](https://github.com/AntelopeIO/leap/blob/a4c29608472dd195d36d732052784aadc3a779cb/libraries/chain/include/eosio/chain/config.hpp#L108)
* [每个账户 RAM 字节的开销](https://github.com/AntelopeIO/leap/blob/a4c29608472dd195d36d732052784aadc3a779cb/libraries/chain/include/eosio/chain/config.hpp#L110)
* [Setcode RAM 字节乘数](https://github.com/AntelopeIO/leap/blob/a4c29608472dd195d36d732052784aadc3a779cb/libraries/chain/include/eosio/chain/config.hpp#L111)
* [RAM使用更新功能](https://github.com/AntelopeIO/leap/blob/9f0679bd0a42d6c24a966bb79de6d8c0591872a5/libraries/chain/apply_context.cpp#L725)

## CPU 资源

与 NET 和 RAM 一样，CPU 资源是 EOS 区块链中非常重要的系统资源。 CPU 系统资源为区块链账户提供处理能力。当区块链执行交易时，它会消耗 CPU 和 NET。为了完成交易，必须为付款账户分配足够的 CPU。帐户拥有的 CPU 数量以微秒为单位，称为 `cpu bandwidth` 在 `dune -- cleos get account` 命令输出。

### CPU是怎么计算的

区块链执行的交易包含一个或多个动作。每个事务都必须在事务 CPU 使用率的最小值和最大值预定义的限制范围内消耗一定数量的 CPU。对于 EOS 区块链，这些限制是在区块链的配置中设置的。您可以通过运行以下命令找出这些限制并查阅 `min_transaction_cpu_usage` 和 `max_transaction_cpu_usage` 以微秒表示：

```shell
dune -- cleos get consensus_parameters
```

对于执行交易的账户，区块链在执行每笔交易之前计算并更新每个区块的剩余资源。当交易准备执行时，区块链会确定付款人账户是否有足够的 CPU 来执行交易。为了计算必要的 CPU，主动构建当前块的节点测量执行事务的时间。如果账户有足够的 CPU，则执行交易；否则被拒绝。技术细节请参考以下链接：

* [CPU配置变量](https://github.com/AntelopeIO/leap/blob/a4c29608472dd195d36d732052784aadc3a779cb/libraries/chain/include/eosio/chain/config.hpp#L66)
* [事务初始化](https://github.com/AntelopeIO/leap/blob/e55669c42dfe4ac112e3072186f3a449936c0c61/libraries/chain/controller.cpp#L1559)
* [交易CPU计费](https://github.com/AntelopeIO/leap/blob/e55669c42dfe4ac112e3072186f3a449936c0c61/libraries/chain/controller.cpp#L1577)
* [检查事务的 CPU 使用率](https://github.com/AntelopeIO/leap/blob/a4c29608472dd195d36d732052784aadc3a779cb/libraries/chain/transaction_context.cpp#L381)

### 主观 CPU 计费

主观计费是 EOS 区块链的一个可选功能。它允许节点在自己的节点中本地对帐户资源进行计费，而无需与网络的其余部分共享计费。自推出以来，主观计费使采用它的节点受益，因为它将节点 CPU 使用率降低了近 90%。但它可能导致交易失败或交易丢失。当智能合约代码使用“检查”功能时，主观计费会触发交易失败，例如 `assert()` 或者 `check()` 命令来验证数据。当这种情况发生时，在系统合约执行的早期断言或检查以减少应用的计费。如果缺少错误消息不会影响用户体验，系统合约可能会通过用返回语句替换一些断言和检查而受益。这种替换可确保他们的交易成功并在链上进行客观计费。

在中查找有关主观计费的更多详细信息 [主观计费和丢失交易介绍](https://eosnetwork.com/blog/api-plus-an-introduction-to-subjective-billing-and-lost-transactions/) 文章。

### 如何租用 CPU

有关如何租用 CPU 资源的详细信息，请参阅 [帐户启动](#account-power-up) 部分。

## 网络资源

NET 资源与 CPU 和 RAM 一样，是 EOS 区块链中重要的系统资源。当区块链执行交易时，它会消耗 CPU 和 NET。必须向付款人账户分配足够的 NET 才能完成交易。 NET 被称为 `net bandwidth` 在 `dune -- cleos get account` 命令输出。

### NET 是如何计算的

每笔交易必须消耗一定数量的 NET，不能超过预定义的最大交易 NET 使用值。对于 EOS 区块链，这个限制是在区块链的配置中设置的。您可以通过运行以下命令找出此限制并查阅 `max_transaction_net_usage` 以字节表示。

```shell
dune -- cleos get consensus_parameters
```

对于执行交易的账户，区块链在每笔交易执行前计算并更新每个区块的剩余资源。当交易准备执行时，区块链确定付款账户是否有足够的 NET 来支付交易执行。必要的 NET 是根据交易大小计算的，这是存储在区块链中的打包交易的大小。如果账户有足够的NET资源，则可以执行交易；否则被拒绝。有关技术细节，请参阅以下来源：

* [NET 配置变量](https://github.com/AntelopeIO/leap/blob/a4c29608472dd195d36d732052784aadc3a779cb/libraries/chain/include/eosio/chain/config.hpp#L57)
* [事务初始化](https://github.com/AntelopeIO/leap/blob/e55669c42dfe4ac112e3072186f3a449936c0c61/libraries/chain/controller.cpp#L1559)
* [交易净计费](https://github.com/AntelopeIO/leap/blob/e55669c42dfe4ac112e3072186f3a449936c0c61/libraries/chain/controller.cpp#L1577)
* [检查事务的 NET 使用情况](https://github.com/AntelopeIO/leap/blob/a4c29608472dd195d36d732052784aadc3a779cb/libraries/chain/transaction_context.cpp#L376)

### 如何租用 NET

有关如何租用 NET 资源的详细信息，请参阅 [帐户启动](#account-power-up) 部分。

## 资源成本估算

作为开发人员，如果你想估计一个交易执行需要多少 CPU 和 NET，你可以采用以下方法之一：

* 使用 `--dry-run` 的选项 `dune -- cleos push transaction` 命令。
* 使用任何可以打包交易并将其发送到区块链的工具并指定 `--dry-run` 选项。
* 使用链 API 端点 [`compute_transaction`]（https://github.com/AntelopeIO/leap/blob/51c11175e54831474a89a449beea1fb067e3d1e9/plugins/chain_plugin/include/eosio/chain_plugin/chain_plugin.hpp#L489）。

在所有情况下，当交易被处理时，区块链节点模拟交易的执行，因此，区块链的状态被推测性地改变，这允许进行 CPU 和 NET 测量。但是，交易不会发送到区块链，调用者会收到估计的 CPU 和 NET 成本作为回报。

## 帐户启动

启动帐户是一种从 PowerUp 资源模型租用 CPU 和 NET 资源的技术。智能合约在区块链上实现此模型，并将这些资源分配给您选择的帐户。启动帐户的操作是 `powerup`.它需要作为参数：

* 这 `payer` 的费用，必须是一个有效的 EOS 帐户。
* 这 `receiver` 的资源，必须是一个有效的 EOS 帐户。
* 这 `days` 必须始终匹配 `state.powerup_days` 在指定的 [上电配置设置](https://github.com/eosnetworkfoundation/eos-system-contracts/blob/7cec470b17bd53b8c78465d4cbd889dbaf1baffb/contracts/eosio.system/include/eosio.system/eosio.system.hpp#L588).
* 这 `net_frac`, 和 `cpu_frac` 是您需要的资源的百分比。计算百分比的最简单方法是将 10^15 (100%) 乘以所需百分比。例如：10^15 * 0.01 = 10^13。
* 这 `max_payment`, 必须以 EOS 表示并且是最大金额 `payer` 愿意付出。

```sh
dune -- cleos push action eosio powerup '[user, user, 1, 10000000000000, 10000000000000, "1000.0000 EOS"]' -p user
```

查看收到的NET和CPU权重以及手续费金额，查看 `eosio.reserv::powupresult` 由操作返回，应该类似于下面的：

```console
executed transaction: 82b7124601612b371b812e3bf65cf63bb44616802d3cd33a2c0422b58399f54f  144 bytes  521 us
#         eosio <= eosio::powerup               {"payer":"user","receiver":"user","days":1,"net_frac":"10000000000000","cpu_frac":"10000000000000","...
#   eosio.token <= eosio.token::transfer        {"from":"user","to":"eosio.rex","quantity":"999.9901 EOS","memo":"transfer from user to eosio.rex"}
#  eosio.reserv <= eosio.reserv::powupresult    {"fee":"999.9901 EOS","powup_net_weight":"16354","powup_cpu_weight":"65416"}
#          user <= eosio.token::transfer        {"from":"user","to":"eosio.rex","quantity":"999.9901 EOS","memo":"transfer from user to eosio.rex"}
#     eosio.rex <= eosio.token::transfer        {"from":"user","to":"eosio.rex","quantity":"999.9901 EOS","memo":"transfer from user to eosio.rex"}
```

EOS 区块链上的 PowerUp 资源模型初始化为 `"powerup_days": 1,`.此设置允许租用 CPU 和 NET 的最长期限为 24 小时。如果您在 24 小时间隔内未使用资源，则租用的 CPU 和 NET 将过期。

### 处理过期订单

过期的外借资源不会被系统自动回收。过期的外借留在必须处理的队列中。

任何呼叫 `powerup` action 也处理这个队列（一次限制为两个过期的贷款）。因此，过期贷款会自动及时处理。有时，可能需要手动处理队列中的过期贷款，以将资源释放回系统，从而降低价格。因此，如果调用 `powerupexec` 行动。

查看订单表 `powup.order` 执行以下命令：

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

例子 `powerupexec` 称呼：

```sh
dune -- cleos push action eosio powerupexec '[user, 2]' -p user
```

```console
executed transaction: 93ab4ac900a7902e4e59e5e925e8b54622715328965150db10774aa09855dc98  104 bytes  363 us
#         eosio <= eosio::powerupexec           {"user":"user","max":2}
warning: transaction executed locally, but may not be confirmed by the network yet         ]
```
