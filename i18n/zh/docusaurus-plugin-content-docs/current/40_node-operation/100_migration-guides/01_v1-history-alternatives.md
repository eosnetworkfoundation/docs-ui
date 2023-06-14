---
title: “V1历史选择”
sidebar_position: 1
---

最新的 EOS v3.1 版本正式结束了对旧版 V1 历史记录插件的支持。因此，依赖 V1 History 进行集成的区块生产者和节点运营者必须寻求替代解决方案。

## 生产就绪替代品

提供以下经过实战检验且符合 V1 标准的历史记录解决方案：
- Hyperion 历史解决方案
- Roborovski 历史 API

# Roborovski 历史 API

＃＃ 概述

Roborovski History API 旨在替代 V1 历史 API。它依靠 Trace API Plugin 提取历史数据，然后将其打包为 V1 格式，然后再返回给客户端请求。

## 谁运行 Roborovski History API

Roborovski History API 由 [格雷玛斯公司](https://greymass.com/)

## 是什么让 Roborovski History API 安全

Roborovski History API 具有高度的安全性，因为它是由 [格雷玛斯公司](https://greymass.com/) 它一直是 EOS、WAX、TELOS、PROTON、FIO 和其他基于 EOS 的链的可靠和稳定的区块生产者和钱包开发商（Anchor）公司。

## 了解与托管解决方案相关的风险

如果您依赖托管解决方案，那么您依赖于您无法控制的数据和流程的正确性。因此，如果您的应用严重依赖链上数据，强烈建议您托管自己的历史记录解决方案。然而，由于 Roborovsky 目前是闭源的，如果你想运行你自己的节点，你将需要查看下面的 Hyperion。

## Roborovski 历史 API 和 V1 历史标准

Roborovski History API 符合 V1 历史 API 标准。它还在标准功能之上增加了两个功能。

现有的 V1 历史插件集成商可以简单地将他们当前的 API url 替换为 Greymass 的 url，它将完美地工作。

## API 参考

### 如何连接

Roborovski History API 连接端点是 `https://eos.greymass.com`

### 函数列表

- 获取操作（兼容 V1）
    - 邮政 `https://eos.greymass.com/v1/history/get_actions`
- 获取交易（V1 兼容）
    - 邮政 `https://eos.greymass.com/v1/history/get_transaction`
- 获取交易（新方法，不在 V1 中）
    - 得到 `https://eos.greymass.com/v1/history/get_transaction?id=<TXID>`
- 获取操作（新方法，不在 V1 中）
    - 得到 `https://eos.greymass.com/v1/history/get_actions?account_name=<NAME>`

### 性能数据

正如目前观察和测量的那样，Roborovski History API 支持每秒至少 50 个请求；此限制被定义为低负载，该解决方案能够处理更多，但目前尚无更高的具体限制。


Hyperion 历史解决方案
# Hyperion 历史解决方案

＃＃ 概述

Hyperion History 是一个完整的历史解决方案，用于索引、存储和检索基于 EOS 的区块链历史数据。它可以由节点运营商部署，为存储在区块链上的动作、交易和区块提供数据查询支持。

Hyperion History API 提供 V2 和 V1（遗留历史插件）端点。因此，它完全符合 V1 历史。

## 是什么让 Hyperion 安全

Hyperion 由 EOS Rio 开发和维护：https://eosrio.io/hyperion/ 并且已经在每个 Antelope 公共网络（EOS、WAX、TELOS、PROTON、FIO 等）上进行了实战测试。

* Github：https://github.com/eosrio/Hyperion-History-API
* 文档：https://hyperion.docs.eosrio.io/

＃＃ 安装

前往 [Hyperion 文档](https://hyperion.docs.eosrio.io/) 安装说明。
