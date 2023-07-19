---
title: 代币经济
---

所有 EVM 都需要原生代币来支付交易费用，也称为汽油费。
EOS EVM 原生代币是 EOS 代币。

## EOS EVM Bridge

互操作性是 EOS EVM 设计的关键部分。因此，EVM 设计允许经济价值自由流动 
在原生层和 EVM 层之间。这就是 EVM 的无信任桥梁发挥作用的地方。

![EOS EVM 可信桥接器](/images/EOS-EVM_trustless_bridge.png)

使用无需信任的桥接器，用户不必依靠第三方预言机将代币从EOS原生转移到EOS EVM。 
取而代之的是，他们只需将代币发送到 EOS EVM 合约 eosio.evm，然后输入他们的 EOS EVM 的地址即可 
备忘录字段中的钱包。这会将资产从原生层移动到 EVM 上的指定地址。当一个 
用户想将资产移回 EOS 原生，该桥允许 EVM 交易触发 EOS 的转移 
从 EOS EVM 合约到用户指定的 EOS 原生账户，并附有可选备忘录。桥接前端做到了 
用户可以轻松构建这些类型的 EVM 交易。

### 过桥费明细

所有EVM交易，包括传出的桥接转账，都要求用户支付汽油费。这些费用包括 
该系统的经常费用，将在下一节中进一步详细介绍，该部分将讨论 
这 [EOS EVM 燃气模型](#eos-evm-gas-model)。

但是，传入的桥接转账以EOS交易开始，然后导致EOS EVM合约在内部 
生成一个 EVM 交易。内部 EVM 交易会产生成本，而且因为它是由 EOS EVM 生成的 
合约，没有机制让用户直接支付该内部交易的汽油费。相反， 
EOS EVM 合约通过从传入的交易中扣除一小笔过桥费来支付该内部 EVM 交易的费用 
转账金额。为了避免用户因可能波动的过桥费而感到困惑，过桥费虽然仍然可以配置， 
与计算出的实际汽油费没有直接关联。相反，它的配置是为了使系统保持盈利 
平均而言。启动时，每传入的桥接传输配置为0.01 EOS 的过桥费。但是静态过桥费和 
盈利目标意味着内部EVM交易的汽油限额被保守地设置为仅支持 
外部拥有的账户作为目的地。

此外，虽然执行传出桥接转账的EVM交易需要收取汽油费， 
汽油费仅涵盖EVM产生的计算成本。通常，传出的桥接传输可以触发 
要在目标账户上执行的任意 EOS 原生智能合约代码，而且这些额外的计算都没有 
成本已计入计算的汽油费。因此，传出的桥接传输最多可以发送到一个 
每笔EVM交易的外部EOS账户。该账户要么没有部署合约，要么必须在 
特殊出口允许列表。

单个 EVM 交易可能会向不同的账户进行多次传出桥接转账。但是， 
这需要在EOS EVM合约中使用更高级的功能，首先是目标账户 
在EOS EVM合约中开立内部余额，稍后提取在该合约中收集的资金 
余额存入其外部 EOS 账户。

### EVM 用户的用户体验

Trustless bridge 还消除了用户从其他基于 EVM 的生态系统中访问 EOS EVM 的明显障碍。 
这就是创建EOS原生账户的必要性。虽然不难，但对于那些使用过的人来说，这个过程并不陌生 
通过 MetaMask 等以太坊钱包与区块链进行交互。此外，还有额外的成本 
与创建 EOS 原生账户有关，这会给最终用户带来额外的摩擦。

为了解决这个问题，如果用户只想与EOS EVM进行交互，他们只需在应用程序中生成一个免费地址即可 
像 MetaMask 一样把它连接到 EVM。然后，他们可以在交易所购买EOS原生代币并将其发送 
通过使用无信任桥接器进出 EOS EVM。这带来了无缝的用户体验，其中 
最终用户根本不需要与 EOS 原生进行交互。

## EOS EVM 气体模型

天然气模型是EOS EVM经济的另一个重要组成部分。所有 EVM 都需要原生代币来支付交易费用 
费用，也称为汽油费。在以太坊网络上，这将是 ETH。EOS 代币充当 Gas 代币 
EVM。这确保了简化的设计，同时为EOS代币带来了额外的实用性。

### 汽油费计算

因为 EOS EVM 合约在 EOS 区块链上运行，无论在 EVM 中发生什么，最终都是 EOS 原生的 
诸如 RAM、CPU 和 NET 之类的资源正在得到利用。EVM 和 EOS 原生的资源模型大不相同 
这使得它们之间的映射变得棘手，尤其是在持久合约存储的成本方面。

EOS native 对 RAM 使用所有权模型，在这种模型中，RAM 代币的所有权代表对相应的 RAM 的权利 
账户和合约的永久存储空间的字节数。这些 RAM 代币可以从以下地址购买和出售 
使用EOS进行链上市场。如果账户/合约不再需要按金额授予的全部存储空间 
在 EOS 账户上持有 RAM 代币，那么空闲空间可以在日后高效地重复用于其他存储。 
或者，多余的 RAM 可以在链上市场上出售 EOS。

EOS 上的其他计算资源是 CPU 和 NET。但是，这些是短暂的资源，是通过以下方式获得的 
定期，例如通过PowerUp，或者使用EOS付款。

另一方面，EVM 使用汽油费来支付存储成本，就像它涵盖其他临时计算费用一样 
交易成本。这简化了用户支付费用的方式。但它提供的机会确实有限 
如果合同不再需要存储那么多的数据，则可以恢复价值。

汽油费与基础资源成本（例如RAM）之间的映射旨在实现最大的兼容性和简单性 
对于最终用户，尤其是在初次启动期间。计算 EVM 交易的 gas 使用量的算法是 
EOS EVM 与其他流行的 EVM 完全相同。然后，用户支付的汽油费是汽油使用量的乘以 
根据交易中设定的汽油价格。这是由 EOS EVM 合约强制执行的，以满足可配置的最低气体 
价格。然后，汽油费被分摊并适当分配，以支付系统的必要费用。

### 汽油费从 EOS EVM 到 EOS Native

处理 EVM 交易有两种相关的计算成本。

#### EOS 原生计算成本

第一个成本是 CPU 和 NET 的 EOS 原生计算成本，必须由 EOS 账户支付，即 
封装 EVM 交易的 EOS 交易的第一个授权者。EVM 交易的汽油费的一部分可以是 
如果他们声称自己是 EOS 账户，则会路由到这个 EOS 账户 `miner` 的 EVM 交易并且已经开启了内部交易 
EOS EVM 合约中的余额。

转入该矿工内部余额的汽油费百分比由可配置的参数确定 
EOS EVM 合约称矿工削减。通过为矿工削减设定适当的值和最低汽油价格 
EOS EVM 合约，预计矿工将获得足够的汽油费部分来支付他们的平均水平 
CPU 和 NET 成本，以及运行有限的 RPC 节点的成本，该节点专注于接受有效 EVM 交易，打包 
它们在 EOS 交易中，然后提交到 EOS 区块链。虽然任何人都可以充当矿工，但在发布时 
网络，ENF 将提供这项服务，以确保像 MetaMask 这样的钱包所期望的可靠的 RPC 端点是 
从发布开始立即可用。

#### 内部 EVM 运营成本

第二个成本是内部EVM运营成本，主要包括EOS EVM合约的RAM消耗。 
这笔费用由未转给矿商的EVM交易的剩余汽油费支付。 
同样，适当调整矿工削减量和最低汽油价格参数可确保收取足够的费用 
保持盈利的系统。这些费用累积在eosio.evm账户的特殊内部余额中，该账户可以 
在获得其有效许可的授权下，随时撤回。

![EOS EVM 代币流量](/images/EOS-EVM_token_flow.png)