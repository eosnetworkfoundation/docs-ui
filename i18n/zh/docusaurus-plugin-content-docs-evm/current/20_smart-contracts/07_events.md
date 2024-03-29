---
title: 活动
---

Solidity 中的事件是合同向你的应用程序传达区块链上发生的事情的一种方式
前端，它可以监听某些事件并在它们发生时采取行动。

## 活动声明

事件使用以下公告 `event` 关键字，然后是事件名称，然后是参数列表。

```solidity
event MyEvent(bool _myParam);
```

## 发射事件

事件是随之发出的 `emit` 关键字，然后是事件名称，然后是参数列表。

```solidity
emit MyEvent(true);
```

## 索引事件

可以对事件进行索引，这允许您根据索引参数筛选事件。

```solidity
event MyEvent(uint256 indexed _myParam);
```

> 💰 **索引成本**
>
> 与非索引事件相比，索引事件的成本更高。您应该只为计划筛选的事件编制索引，
> 否则，您将不必要地增加合同用户的成本。

