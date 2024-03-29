---
title: 对等
---

# 对等互连

EOS区块链可能由一个或多个节点组成。尽管单个节点仍然可以运行功能齐全的区块链，但它无法扩展或增长。要充分利用EOS区块链技术的优势，需要更多的节点。在本节中，您将学习 “对等互连”，这是一种使之成为可能的网络功能。这就是允许从单个节点逐步发展到真正去中心化、地理分布式的多节点EOS区块链的原因。

## 什么是对等互连？

Peering 允许 EOS 节点通过接收区块和/或交易并将其中继到其他节点来传播和同步分布式区块链状态。任何配置为以点对点方式发送和接收数据的节点都被视为 “对等节点”。这增加了冗余，并加快了对客户端查询和节点请求的响应时间。因此，对等互连是EOS区块链去中心化运营和增量增长的关键。

> ℹ️ EOS 网络协议 
对等互连是通过EOS点对点（p2p）网络协议启用的，它允许区块链的去中心化运行。欲了解更多信息，请查看 [EOS 网络协议](../../60_advanced-topics/03_network-peer-protocol.md)。

## 为什么你需要节点/对等体？

在EOS区块链中，可以将节点配置为以不同的方式运行。正是这种让节点扮演不同角色的灵活性为最终用户提供了更加分布的负载和更流畅的区块链体验。EOS中的一些节点类型包括但不限于：

* **生成节点**：生成要添加到链中的方块
* **中继节点**：验证/中继区块和/或交易
* **API 节点**：通过 HTTP 响应来自客户端的 API 查询
* **历史节点**：存储 L2 历史解决方案的链数据
* 等等

因此，当设置为对等节点时，EOS节点会验证他们收到的区块和交易，并在默认情况下（如果有效）将其中继给其他节点。还可以设置节点来响应来自客户端的API请求，提供有关区块和交易的历史数据等。这种关注点分离使区块链更加高效。

## 如何设置对等体

> ℹ️ 对等设置 
对等连接过程必须在每个对等体的本地环境中执行。因此，对等互连涉及一些将在EOS网络中充当对等节点的节点之间的规划和协议。

可以通过配置来设置对等互连 `net_plugin` 每个 `nodeos` 其节点将充当对等体的实例。最重要的选项是：

* `p2p-listen-endpoint arg`: 本地 `host:port` 用于传入的 p2p 连接
* `p2p-server-address arg`: 公开 `host:port` 用于传入的 p2p 连接
* `p2p-peer-address arg`: 本地或远程对等体 `host:port` 要连接到

的 `p2p-listen-endpoint` arguments 包含本地 IP 地址或主机名以及本地节点实例的监听套接字的端口号，以接受来自其他对等方的传入连接。的 `p2p-server-address` 参数包含面向公众的 IP 地址或主机名以及其他对等方将要连接的端口号。如果未指定， `p2p-server-address` 默认为指定的 `p2p-listen-endpoint`。的 `p2p-server-address` 在您的代理或防火墙提供的外部地址与节点内部使用的地址不同的情况下，选项可能很有用。

还有其他选项可用于限制最大连接数、通过公钥将特定对等体列入白名单、接受/中继交易等。请查看 `net_plugin` 中的选项 `nodeos` 了解更多信息。

### 使用对等设备设置 `config.ini`

要将您的本地节点与其他节点对等，请在节点中指定以下内容 `config.ini` *在*启动你的 `nodeos` 实例：

```ini
# your listening host:port
p2p-listen-endpoint = <myhost>:<myport>   # e.g. 0.0.0.0:9876
# your public host:port
p2p-server-address = <mypubhost>:<myport> # e.g. p2p.eos99.io:9876

# peers host:port (for each peer to connect to)
p2p-peer-address = <host1>:<port1>  # e.g. peer.leap.sg:9876
p2p-peer-address = <host2>:<port2>  # e.g. p2p.eosphere.io:3571
# etc.
```

### 使用命令行进行对等设置 (CLI)

要将你的本地节点与其他节点对等，请在你的 nodeos 命令行参数*当*启动你的节点时*指定以下内容 `nodeos` 实例：

```shell
nodeos ... \
  p2p-listen-endpoint = <myhost>:<myport> \
  p2p-server-address = <mypubhost>:<myport> \
  p2p-peer-address = <host1>:<port1> \
  p2p-peer-address = <host2>:<port2> \
  ...
```

查看上一节 [使用 “config.ini” 进行对等设置](#peer-setup-using-configini) 有关潜在值的示例 `p2p-listen-endpoint`, `p2p-server-address`，以及 `p2p-peer-address`。

## 如何找到同龄人

对于EOS主网和各种测试网，一些网站会发布和维护P2P、API和其他端点列表，供您的节点连接。

> ℹ️ 端点和 bp.json 
端点列表通常根据标准生成、验证和组合 `bp.json` 区块生产者提供的文件，包括备用生产者。

对于维护EOS主网和各种EOS测试网的*所有*活动端点（P2P、API、历史记录等）的最新状态的中央门户，您可以访问EOS Nation Validate Portal并选择特定网络的**端点报告**：

* EOS 主网端点：https://validate.eosnation.io/eos/reports/endpoints.html
* Jungle Testnet 端点：https://validate.eosnation.io/jungle4/reports/endpoints.html
* Kylin Testnet：https://validate.eosnation.io/kylin/reports/endpoints.html

访问上述任何**端点报告**后，您可以向下滚动到感兴趣的特定端点： `api_http` 要么 `api_https2` 对于 API 端点， `p2p` 用于 P2P 端点等

### 适用于 EOS 主网

除了上面父部分中列出的**端点报告**网址外 [如何找到同龄人](#how-to-locate-peers)，以下终端节点可直接添加到您的 `config.ini`:

* P2P 端点：https://validate.eosnation.io/eos/reports/config.txt

上面的 P2P 端点列表应显示类似以下内容：

```ini
# Endpoints config.ini
# Network: EOS
# Validator last update: 2023-06-12 19:32 UTC
# For details on how this is generated see https://validate.eosnation.io/about/
# ==== p2p ====
# alohaeosprod: GB, London
p2p-peer-address = peer.main.alohaeos.com:9876
# argentinaeos: AR, argentina
p2p-peer-address = p2p.eosargentina.io:9876
...
# ivote4eosusa: US, Greenville,SC,USA
p2p-peer-address = eos.p2p.eosusa.io:9882
```

* API 端点：https://validate.eosnation.io/eos/reports/api_versions.txt

上面的 API 端点列表应显示类似以下内容：

```ini
# API Versions Report
# Network: EOS
# Validator last update: 2023-06-12 20:06 UTC
# For details on how this is generated see https://validate.eosnation.io/about/
==== 4.0.1 (leap) ====
aus1genereos api_https2, v4.0.1, https://eos.genereos.io, ...
eosnationftw  api_http, v4.0.1, http://eos.api.eosnation.io, ...
...
==== 3.1.0 (leap) ====
eosamsterdam api_http, v3.1.0, http://mainnet.eosamsterdam.net, ...
eosamsterdam api_https2, v3.1.0, https://mainnet.eosamsterdam.net, ...
...
teamgreymass api_http, v3.1.0, http://eos.greymass.com, ...
teamgreymass api_https2, v3.1.0, https://eos.greymass.com, ...
```

### 适用于 EOS 测试网

除了父部分中列出的**端点报告**网址 [如何找到同龄人](#how-to-locate-peers)，以下终端节点可直接添加到您的 `config.ini` 用于以下 EOS 测试网：

#### EOS 丛林测试网

* P2P 端点：https://validate.eosnation.io/jungle4/reports/config.txt
* API 端点：https://validate.eosnation.io/jungle4/reports/api_versions.txt

#### EOS Kylin 测试网

* P2P 端点：https://validate.eosnation.io/kylin/reports/config.txt
* API 端点：https://validate.eosnation.io/kylin/reports/api_versions.txt

## 如何检查同伴的生命值

一些门户网站提供定期报告和/或实时监控，以检查公共 P2P 和 API 端点的运行状况。此外，一些实时工具还允许估计 P2P 或 API 端点的距离和/或响应时间。

### EOS Nation 报告

EOS Nation为EOS主网和各种EOS测试网提供了有关各种端点状态的广泛报告，包括区块生成节点的运行状况：

* EOS 主网报道：https://validate.eosnation.io/eos/reports/
* Jungle Testnet 报道：https://validate.eosnation.io/jungle4/reports/
* Kylin Testnet 报道：https://validate.eosnation.io/kylin/reports/

由于上述报告中列出的端点每隔 30 分钟进行一次验证和刷新，因此仅在给定报告中存在一个端点就表明状态为*响应*。对于在此期间检测到的其他错误 `bp.json` 验证，请检查以下资源：

* EOS 主网错误报告：https://validate.eosnation.io/eos/reports/errors.html
* Jungle Testnet 错误报告：https://validate.eosnation.io/jungle4/reports/errors.html
* Kylin Testnet 错误报告：https://validate.eosnation.io/kylin/reports/errors.html

### 第三方工具

有一些工具可用于衡量 P2P 和/或 API 端点列表的响应能力或缺乏响应能力：

* [靠近一点](https://medium.com/hackernoon/find-the-best-api-endpoint-for-your-eos-dapp-7b7489cb6449)  
  接收 API 端点列表并返回 HTTP 请求响应时间。如果端点没有响应，它最终会超时并且不会显示在列表中。

## 摘要

对等互连对于任何EOS区块链网络的去中心化运营都至关重要。它允许在所有节点和节点之间同步和分配区块链状态，从而获得更流畅、更快的区块链体验。任何EOS区块链要实现有机增长、达成共识、实现自治，并利用区块链技术的许多好处，都需要对等互联。
