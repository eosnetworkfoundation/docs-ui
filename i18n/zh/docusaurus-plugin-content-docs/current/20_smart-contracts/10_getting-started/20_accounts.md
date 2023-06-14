---
title: 帐户
---

EOS 网络上的账户是一个数字容器，其中包含各种信息，例如账户拥有的 EOS 代币、可支配的资源、账户控制权限结构以及我们将在本指南后面介绍的各种其他信息。账户也可以持有智能合约。

账户是使您能够访问和控制区块链数据以及执行交易的关键组件。


## 账户名

EOS 网络上的每个帐户都有一个人类可读的名称。这使得识别交易接收者和智能合约变得更加容易。为了保持账户名称在区块链上的有效性，一些限制适用于所有名称：



* 所有字符必须小写
* 每个名称的长度必须为 12 个字符（或更少的后缀/高级名称）
* 只有字母 `a-z`, 数字 `1-5`, 和期间 (`.`) 是受支持的字符。
* 名称不能以数字或句点开头。
* 名称不能以句号结尾。

句点对 EOS 账户有特殊意义。他们指定帐户具有 **后缀**（类似于 .com 等顶级域），也称为 **高级名称**。带后缀的帐户只能由**后缀所有者**创建。

例如，如果某人拥有后缀 `.bar` 那么只有那个人可以创造 `foo.bar`.

在本指南的最后，我们将讨论名称竞价系统，该系统允许 EOS 网络上的用户购买高级名称。


## 公钥/私钥

每个 EOS 账户最终都由一对公钥/私钥控制。私钥用于签署交易，必须保密，而公钥用于识别区块链上的账户，可以公开。

保护您的私钥非常重要，因为它可以完全控制您帐户的数字资产。您的私钥应存储在安全的软件或硬件钱包中，因为拥有它的任何人都可以完全访问与您的帐户关联的资产。

EOS 帐户使用称为*权限系统*的东西提供开箱即用的额外安全机制。

私钥和公钥的示例：
```Private: 5KSdyAiFzYQAtBKDBKCCF28KMMhZ4EmXUxSg8B3nSkHKutT15rY
Public: PUB_K1_5d7eRKgCCiEdsbBdxxnZdFWnGYS64uWZPZgTcTU1xnB2aESxqR
Legacy Public Format: EOS5d7eRKgCCiEdsbBdxxnZdFWnGYS64uWZPZgTcTU1xnB2cq4JMD
```


##权限系统

每个帐户都有一组分层权限来控制该帐户可以执行的操作，并且默认情况下具有两个基本权限。这两个权限不能删除，因为它们是您帐户正常运行所必需的。

强制性权限是 `owner` 和 `active`.

权限只能更改控制它的对象（密钥或帐户）或控制其子对象的对象。它永远无法改变控制其父级的内容。

！[谁可以更改权限？](../../images/accts_who_can_change_permissions.png)


控制权限的是公钥（在链上注册，并由关联的私钥控制）或另一个 `account@permission`.这允许创建复杂的账户控制结构，其中多方控制单个账户，同时仍然对自己账户的安全拥有完全自主权。

以下图为例，其中account `alice` 由两者控制 `bob` 和 `charlie`， 尽管 `charlie` 也被控制 `tom`.最终，所有帐户都由密钥控制。


！[委托帐户所有权](../../images/accts_delegated_account_ownership.png)


您可以在下面添加自定义权限 `active` 这允许您将该权限的访问限制为仅特定合约的操作（可调用函数）。然后，该权限将只能与您指定的合同操作进行交互。

这意味着您可以跨帐户创建精细的访问权限，并拥有对它们的分层所有权和使用权。


！[自定义权限](../../images/accts_custom_permissions.png)


最重要的是，权限系统内置了对多重签名交易（需要多方签名的交易）的支持。与权限关联的每个链接帐户或密钥都分配有一个**权重**，并且权限本身有一个**阈值**。

正如您在下面的示例中所看到的， `bob` 单独没有足够的权力使用 `active` 允许。他需要 `charlie` 或者 `jenny` 与他共同签署任何交易 `alice@active` 使。另一方面， `charlie` 和 `jenny` 不能单独签署交易，他们需要 `bob`. 


![权重和阈值](../../images/accts_weights_and_thresholds.png)


## 智能合约

智能合约只是运行在区块链上的程序。它允许您向帐户添加功能，从简单的待办事项应用程序到完全在区块链上运行的成熟 RPG 游戏。

每个帐户都可以部署一个智能合约，但是可以随意更新和替换该智能合约。

有关将智能合约部署到您的帐户的更多信息，请参阅我们的 [沙丘指南](./10_dune-guide.md).


## 使用 DUNE 创建帐户

**DUNE** 设置完成后，您可以使用一个命令开始在本地开发环境中创建帐户。

```shell
dune --create-account <ACCOUNT_NAME>
```

如果你想查看你刚刚创建的账户的相关信息，你可以使用下面的命令。

```shell
dune -- cleos get account <ACCOUNT_NAME>
```


## 数字资产的所有权

可以由账户拥有并存储在区块链上的数据通常被称为“数字资产”。这些数字资产的**所有权**仅仅意味着去中心化数据库（区块链）中的一行表示资产属于特定账户，并且只有该账户才有能力操纵、转移或以其他方式控制该数字资产.

请记住，智能合约还与帐户共同拥有该数字资产，并且可能能够在未经用户明确同意的情况下操纵存储在其表内的所有资产。

智能合约开发人员也可以随意更新智能合约，因此具有安全或财务影响的合约可能会放弃更新智能合约的能力，以换取可升级性以增加用户信任度。


## 放弃帐户所有权

可升级性对智能合约开发有显着好处，但并不总是需要的。

为了放弃智能合约的可升级性，您有两种选择。


### 空账户

您可以设置合约账户的所有者和活跃权限 `eosio.null@active`.这是一个 `NULL` 专门为这些目的设计的帐户。它没有私钥或所有者。

如果您想**永远**放弃对该帐户的控制，这是一个不错的选择。


```dune -- cleos set account permission <ACCOUNT> active '{"threshold":1,"keys":[],"accounts":[{"permission":{"actor":"eosio.null","permission":"active"},"weight":1},{"permission":{"actor":"<ACCOUNT>","permission":"eosio.code"},"weight":1}],"waits":[]}' owner -p <ACCOUNT>
dune -- cleos set account permission <ACCOUNT> owner '{"threshold": 1, "keys":[], "accounts":[{"permission":{"actor":"eosio.null","permission":"active"},"weight":1}], "waits":[] }' -p <ACCOUNT>@owner
```

（注意 `eosio.code` 添加为 `active` 许可，如果该帐户是智能合约，您可能需要！）

### 产品账户

或者，您可以设置合约账户的 `owner` 和 `active` 三种不同类型的生产者控制（网络共识控制）帐户的权限，因此如果此合约出现问题，您可以请求生产者帮助升级合约。

如果您正在处理可能存在可能对用户产生负面影响的错误的错综复杂的合同，那么这是一个不错的选择。

#### eosio.prods

这 `eosio.prods` 帐户由网络上 ⅔+1 的活跃生产者控制。这意味着如果有 21 个活跃的生产者，那么您将需要其中 15 个来签署所有升级。

```dune -- cleos set account permission <ACCOUNT> active '{"threshold":1,"keys":[],"accounts":[{"permission":{"actor":"eosio.prods","permission":"active"},"weight":1},{"permission":{"actor":"<ACCOUNT>","permission":"eosio.code"},"weight":1}],"waits":[]}' owner -p <ACCOUNT>
dune -- cleos set account permission <ACCOUNT> owner '{"threshold": 1, "keys":[], "accounts":[{"permission":{"actor":"eosio.prods","permission":"active"},"weight":1}], "waits":[] }' -p <ACCOUNT>@owner
```


#### 主要产品

这 `prod.major` 帐户由 ½+1 控制，这意味着如果有 30 个活跃的生产者，那么您需要其中 16 个才能签署所有升级。


```dune -- cleos set account permission <ACCOUNT> active '{"threshold":1,"keys":[],"accounts":[{"permission":{"actor":"prod.major","permission":"active"},"weight":1},{"permission":{"actor":"<ACCOUNT>","permission":"eosio.code"},"weight":1}],"waits":[]}' owner -p <ACCOUNT>
dune -- cleos set account permission <ACCOUNT> owner '{"threshold": 1, "keys":[], "accounts":[{"permission":{"actor":"prod.major","permission":"active"},"weight":1}], "waits":[] }' -p <ACCOUNT>@owner
```

#### prod.minor

这 `prod.minor` 帐户由 ⅓+1 控制，这意味着如果有 30 个活跃的生产者，那么您需要其中 11 个才能签署所有升级。


```dune -- cleos set account permission <ACCOUNT> active '{"threshold":1,"keys":[],"accounts":[{"permission":{"actor":"prod.minor","permission":"active"},"weight":1},{"permission":{"actor":"<ACCOUNT>","permission":"eosio.code"},"weight":1}],"waits":[]}' owner -p <ACCOUNT>
dune -- cleos set account permission <ACCOUNT> owner '{"threshold": 1, "keys":[], "accounts":[{"permission":{"actor":"prod.minor","permission":"active"},"weight":1}], "waits":[] }' -p <ACCOUNT>@owner
```

## 账户创建成本

因为 EOS 账户注册了很多东西，比如他们的权限，以及他们持有的资源（CPU、NET、RAM），所以在网络上创建它们时会产生成本。这也意味着已有帐户的人需要为您创建一个帐户。有许多为 EOS 网络执行此操作的服务，对于您的本地开发环境，您可以使用系统帐户创建帐户（`eosio`).

然而，这确实会潜在地影响您的应用程序设计，因为您的用户尚未连接到网络时将需要为他们创建帐户。在规划用户获取费用时，您应该考虑到这一成本。

开户费用取决于开户所需的 RAM，截至撰写本文档时（20/02/2023）为 `2996 bytes`.

去我们的 [资源指南](./30_resources.md) 了解如何计算从 RAM 市场购买 RAM 的成本。

## 竞标高级名称（后缀）

为了拥有一个高级名称（例如： `foo[.bar]`) 您必须对其出价，然后在拍卖中赢得它。

您还必须：

* 在当时出价的**所有**名称中出价最高——这意味着如果有多个人对多个不同的名称出价，则总出价最高的名称将首先赢得，下一个名称最高出价者将在 24 小时后获胜。
* 在 24 小时内作为您竞标的名称的最高出价者，如果其他人竞标您试图赢得的名称，计时器将重置并开始另一个 24 小时的时间段。
* 出价比上次出价高 10% – 如果您对某个名称的出价高出您的出价，您将收回您的出价。如果一个名字从未被出价超过或获奖，**您的资金将不会退还给您**。

为了在 EOS 网络上竞标一个名字，您可以前往 [EOS 权限](https://eosauthority.com/bidname) 您可以在其中看到链上的所有实时出价，包括对当前队列中的名称进行过出价的每个人的历史记录。

如果你想创建一个高级命名帐户并且**没有**提升你的本地 DUNE 节点，你可以这样做：
```dune --create-account test.acc
```

否则，您还必须在本地完成名称竞标过程：
```dune -- cleos system bidname <BIDDER> <NAME> <BID>
```

要查看有关您的本地出价的信息：
```dune -- cleos system bidnameinfo <NAME>
```

