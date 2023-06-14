---
title: 连动动作模式
---

有时你想确保与你的合约交互的用户使用了另一个
在他们可以使用你的之前签订合同。例如，您可能想确保他们有
在他们可以使用您的合约之前将代币转移到您合约的帐户。

当与代币相关时，这通常被称为“存款模式”，但存入代币
这不是您可能想要使用此模式的唯一时间，因此术语“链接操作模式”。

以存款模式为例，让我们看看这个交易可能是什么样的：
```- Transaction
    1. eosio.token::transfer (Token Transfer) 
        -[inline] mycontract::on_transfer (Notifiable Action Receiver) 
    2. mycontract::record (Regular Action)
```

上表显示了交易中动作的执行顺序。

交易里面只有代币转账和“记录”动作，但是有
还有一个事件接收器函数，由您的令牌传输触发
合约将在代币转移和记录操作之间进行捕获和放置。

此模式解决的常见问题是您要确保
在您允许记录操作发生之前，令牌转移已经发生。

让我们看一下没有模式的一些代码：


#### 代币转移动作
```cpp
ACTION transfer(name from, name to, asset quantity, string memo){
    // ...
    require_recipient( from );
    require_recipient( to );
    // ...
}
```

#### 事件接收者和记录动作
```cpp
#include <eosio/asset.hpp>

[[eosio::on_notify("eosio.token::transfer")]]
void on_transfer(name from, name to, asset quantity, string memo){
    // ...
}

ACTION record(name from, uint64_t internal_id, uint8_t status){
    // ...
}
```

你可以在上面看到我们想要添加一些关于用户转账的额外信息
到我们的合同，但我们不能在令牌转移操作中这样做，因为我们可用的是
这 `memo` 字段，它是一个字符串。

> ⚠ **性能考虑**
>
> 你可能已经猜到你可以做一些字符串操作和转换来获取数据
> 你需要进入 `memo` 字段，但不推荐这样做。这 `memo` 字段不仅限于256
> 大多数代币合约上的字符，但智能合约中的字符串操作是其中之一
> 你能做的最昂贵的操作。

相反，我们可以使用链接操作模式来确保代币转移已经发生
在我们允许之前 `record` 动作发生，我们也可以传递我们需要的额外信息
到 `record` 行动。

让我们更新 `on_transfer` 事件接收器和 `record` 在它们之间建立联系的行动
使用链接动作模式。


首先我们要添加一个 `multi_index` 我们合约的表格，用于存储我们需要传递的信息
在两个动作之间。

```cpp
TABLE transfer_info {
    name from;
    asset quantity;
    
    uint64_t primary_key() const { return from.value; }
};

using _transfers = multi_index<"transfers"_n, transfer_info>;

[[eosio::on_notify("eosio.token::transfer")]]
void on_transfer(name from, name to, asset quantity, string memo){
    _transfers transfers( get_self(), get_self().value );
    transfers.emplace( get_self(), [&]( auto& row ) {
        row.from = from;
        row.quantity = quantity;
    });
}
```

> ⚠ **警告**
>
> 你应该对 `on_transfer` 比我们在这个例子中的要多。本指南不
> 关于安全性，因此为了清晰起见，我们省略了这些检查，但您不应该部署令牌事件接收器
> 这种方式在生产中。

然后，在我们的 `record` action 我们可以检查转账是否存在，如果存在，我们可以
从表中删除它以释放 RAM 并执行我们的逻辑。

如果没有，我们可以简单地出错并告诉用户他们需要转移代币
在他们可以使用之前签署合同。


```cpp

ACTION record(name from, uint64_t internal_id, uint8_t status){
    // ...
    _transfers transfers( get_self(), get_self().value );
    auto transfer = transfers.find( from.value );
    check( transfer != transfers.end(), "Must transfer tokens to contract before using it" );
    transfers.erase( transfer );
    
    // Do your logic here
}
```

## RAM 滥用问题

上面的模式运行良好，但它确实有问题。如果用户将代币转移到您的合约
但从不打电话给 `record` 操作，用于存储传输信息的 RAM 将永远不会
被释放。

由于您的合同是为 RAM 付费的合同，这意味着账户可以发送少量代币
您的合同会消耗您的 RAM 并使您的合同过于昂贵。

我们可以通过添加一个 `check` 到 `on_transfer` 事件接收器以确保数量
在我们存储传输信息之前超过了某个阈值。

```cpp
[[eosio::on_notify("eosio.token::transfer")]]
void on_transfer(name from, name to, asset quantity, string memo){
    check(quantity.amount > 100, "Must transfer more than 100 tokens");
    
    ...    
}
```

或者，我们可以消耗这些成本并定期清理表以释放 RAM
不再需要了。

```cpp
ACTION cleanup(){
    _transfers transfers( get_self(), get_self().value );
    auto transfer = transfers.begin();
    
    uint8_t count = 0;
    while( transfer != transfers.end() && count < 100 ) {
        transfer = transfers.erase( transfer );
        count++;
    }
}
```

请注意，您必须定期自己调用此操作以降低 RAM 使用率，
然而，对于与货币价值无关的联动模式，这是一个很好的选择
降低 RAM 使用率的方法。

＃＃ 挑战

您如何更改上面的代码以捕获 NFT 传输并链接操作，以便
只有所有者和正确的 NFT 才能触发 `record` 行动？


