---
title: 硬件要求
---

每种类型的EOS节点的硬件要求可能会有所不同，具体取决于网络规模、交易量和并发用户数量等因素。但是，以下是针对不同 EOS 节点类型的硬件要求的一些一般准则：

## 没有区块的 API 节点日志

> ℹ️ 区块日志是区块链中所有区块及其相关交易的记录。区块日志提供了EOS网络上发生的交易和变更的全面历史记录。

在不维护区块日志的情况下，API 节点的最低起点如下：

-中央处理器：2 个内核 >= 3.7 Ghz
-内存：16 GB 内存和 16 GB 交换空间
-硬盘：1024 GB
-互联网网络链接：100Mb/s

> ⚠ 请注意，如果网络上的 RAM 使用量突然增加到 32GB 以上，上述配置将面临问题。另外，此设置为 50/50 RAM/Swap，偶尔会因为交换而对某些请求的响应速度很慢。

在撰写本文档时（2023 年 6 月 12 日），对于没有区块日志的 API 节点，最佳配置是：

-CPU：4 个内核 >= 3.8 Ghz
-内存：64 GB
-硬盘：1024 GB
-互联网网络链接：>= 100Mb/s

>ℹ️ 对于 API 节点，一般来说，你不想让 CPU 速度过高（>= 5 Ghz），因为它会降低主观计费，并遇到一些边缘情况，即 API 认为交易没问题，接受，告诉用户成功，然后交易最终被上游速度较慢的 CPU 拒绝。

## 带有区块日志的 API 节点

-CPU：4 个内核 >= 3.8 Ghz
-内存：64 GB
-硬盘：4096 GB
-互联网网络链接：>= 100Mb/s

## 状态历史节点

对于状态历史节点，你需要比带有区块日志的 API 节点更多的硬盘空间：

-CPU：4 个内核 >= 3.8 Ghz
-内存：64 GB
-硬盘：5120 GB
-互联网网络链接：>= 100Mb/s

## 使用 `tmpfs` 文件系统

适用于所有节点的一种常见且最有效的策略是使用 `tmpfs` 文件系统。此策略建议将节点状态文件夹挂载到 `tmpfs` 分区。除了至少 32GB 的 RAM 之外，这通常还需要一个较大的交换分区。

> ℹ️ 那个 `tmpfs` 文件系统将其所有文件保存在虚拟内存中。所有东西都在里面 `tmpfs` 从某种意义上说，是暂时的，因为不会在硬盘上创建任何文件。如果你卸载 `tmpfs` 例如，其中存储的所有内容都将丢失。
