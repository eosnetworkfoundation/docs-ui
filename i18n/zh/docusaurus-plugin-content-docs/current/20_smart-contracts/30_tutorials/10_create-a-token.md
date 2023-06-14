---
title: “创建令牌”
---


代币是一种可拥有的数字资产，例如虚拟收藏品或游戏内货币。无非就是一个数据结构
存储在区块链上。

代币合约定义了构成代币的数据结构，这些结构的存储，
以及可以采取的操作令牌的操作。

有两种广泛使用的区块链代币类型：
- **可替代代币**是可以互换的，每个代币都等同于其他代币，就像游戏中的黄金一样
- **不可替代的代币**是独一无二的，就像一张收藏卡或一块土地

在本教程中，您将创建一种名为 **GOLD** 的游戏内货币，它是一种*可替代代币*。

## 你的开发环境

确保你有 [沙丘](../10_getting-started/10_dune-guide.md) 安装
并了解如何建立合同。

在每一步之后，你应该尝试编译你的合约并检查是否有任何错误。

## 创建一个新合约

首先，让我们建立一个基本的契约脚手架。

创建一个 `token.cpp` 文件并添加以下代码：

```cpp
#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include <eosio/singleton.hpp>
using namespace eosio;

CONTRACT token : public contract {

    public:
    using contract::contract;

    // TODO: Add actions
};
```

## 创建动作

我们的代币合约将执行三个操作：

```cpp
    ACTION issue(name to, asset quantity){
        
    }
    
    ACTION burn(name owner, asset quantity){
        
    }
    
    ACTION transfer(name from, name to, asset quantity, std::string memo){
        
    }
```

将它们添加到您的合同中，然后让我们深入研究每个操作并查看它们的作用以及它们采用的参数。

＃＃＃ 问题

这 `issue` action 创建新代币并将它们添加到帐户余额和总供应量中。

它需要两个参数：
- **to**：代币将被发行到的账户
- **数量**：要发行的代币数量

### 燃烧

这 `burn` action 从账户余额和总供应量中移除代币。

它需要两个参数：
- **所有者**：将销毁代币的账户
- **数量**：要销毁的代币数量

＃＃＃ 转移

这 `transfer` action 将令牌从一个帐户转移到另一个帐户。

它需要四个参数：
- **from**：发送代币的账户
- **to**：接收代币的账户
- **数量**：要转移的代币数量
- **备忘录**：包含在转账中的备忘录

## 设置符号和精度

每个可替代代币都有一个**符号**和一个**精度**。

**symbol** 是令牌的标识符（如 EOS、BTC，或者在我们的例子中是 GOLD），**precision** 是令牌支持的小数位数。
我们将在合约中添加一个常量变量来定义 `symbol` 和 `precision` 我们的代币。

在上面添加这个 `issue` 行动：

```cpp
    const symbol TOKEN_SYMBOL = symbol(symbol_code("GOLD"), 4);
    
    ACTION issue ...
```

上面几行意味着我们将创建一个带有符号的令牌 `GOLD` 和精度 `4`.

它看起来像 `100.0000 GOLD` 或者 `0.0001 GOLD`.

## 添加数据结构

现在您已经定义了操作，让我们添加将用于存储令牌数据的数据结构。

把这个放在下面 `TOKEN_SYMBOL` 你刚刚添加。

```cpp
    const symbol TOKEN_SYMBOL = symbol(symbol_code("GOLD"), 4);

    TABLE balance {
        name     owner;
        asset    balance;

        uint64_t primary_key()const { 
            return owner.value; 
        }
    };
    
    using balances_table = multi_index<"balances"_n, balance>;
```

你刚刚创建了一个 `balance` 定义将存储在中的数据的结构 `balances` 桌子。
然后，您定义了 `balances_table` 类型，它是将存储行的表的定义 `balance` 模型。

稍后您将使用 `balances_table` 类型以实例化对 `balances` 表，并将该引用用于
在区块链中存储和检索数据。

这 `owner` 属性是类型 `name` （EOS 账户名），将用于识别拥有代币的账户。
这 `name` type 是一种有效地将字符串打包为 64 位整数的方法。限于 a-z、1-5 和一个句点，并且可以
最多 12 个字符。

这 `balance` 属性是类型 `asset` 并将用于存储帐户拥有的代币数量。
这 `asset` 类型是一种特殊类型，包括符号、精度和数量。它有 `asset.symbol` 财产
和 `asset.amount` 属性（属于 `int64_t`).

这 `primary_key` 结构中的函数用于唯一标识每一行以用于索引目的。在这种情况下，
我们正在使用 `owner` 字段作为主键，但使用 `uint64_t` 表示而不是为了效率。

接下来，您需要另一个表来存储代币的总供应量。在下面添加这个 `balances_table` 你刚刚添加：

```cpp
    using supply_table = singleton<"supply"_n, asset>;
```

我们在这里使用不同类型的表，a `singleton`. A `singleton` 是每个范围只有一行的表。
这非常适合存储配置之类的东西。我们将使用它来存储代币的总供应量
您的合同中只有一个令牌。

您可以看到我们也没有定义要存储的自定义结构，因为我们只需要 `asset` 类型存储
总供应量。

## 填写动作

现在您已经定义了数据结构，让我们填写操作。

＃＃＃ 问题

首先，我们将从 `issue` 操作，这将创建新的令牌并将它们添加到帐户的余额中。

我们只希望部署合约的帐户能够调用 `issue` 行动，所以我们将添加
一个断言，以确保调用该操作的帐户与部署合约的帐户相同。

```cpp
    ACTION issue(name to, asset quantity){
        check(has_auth(get_self()), "only contract owner can issue new GOLD");
    }
```

接下来，我们要确保我们将发行令牌的帐户存在于区块链上。我们不想要那个
甜蜜的游戏内黄金去浪费！

```cpp
    ...
    check(is_account(to), "the account you are trying to issue GOLD to does not exist");
```

接下来，我们要确保 `quantity` 参数是一个正数，并且有正确的
`symbol` 和 `precision`.

```cpp
    ...
    check(quantity.is_valid(), "invalid quantity");
    check(quantity.amount > 0, "must issue a positive quantity");
    check(quantity.symbol == TOKEN_SYMBOL, "symbol precision and/or ticker mismatch");
```

嘘！这是很多检查，但重要的是要确保我们保护我们的游戏内黄金！

现在让我们开始处理余额表。

```cpp
    ...
    balances_table balances(get_self(), get_self().value);
```

我们采取了 `balances_table` 我们之前定义的类型并实例化了一个新的 `balances_table` 目的。我们通过了
`get_self()` 函数作为第一个参数（ `code` 参数），它返回合约账户的名称。我们通过了 `get_self().value`
作为第二个参数（ `scope` 参数），它返回 `uint64_t` 合约账户名称的表示。

> ❔ **作用域**：作用域是一种将表中的行分组在一起的方法。你可以把它想象成一个文件夹
> 包含表中的所有行。在这种情况下，我们使用合约账户的名称作为范围，所以所有
> 中的行 `balances` 表格将在合约账户名称下组合在一起。如果你愿意
> 想了解更多有关范围的信息，请查看 [智能合约入门指南](../10_getting-started/40_smart-contract-basics.md#multi-index-instantiate-with-code-and-scope).

接下来，我们需要检查是否 `to` 账户已有余额。我们可以通过使用 `find` 上的功能
`balances` 桌子。

```cpp
    ...
    auto to_balance = balances.find(to.value);
```

这 `find` 函数返回一个迭代器到表中与主键匹配的行。如果 `to` 帐户确实
没有平衡，那么 `find` 函数将返回一个指向表末尾的迭代器。记住主键
因为桌子是 `uint64_t`，所以我们需要使用 `to.value` 得到 `uint64_t` 代表的 `to` 帐户。

如果已经有余额，那么我们需要将新代币添加到现有余额中。我们可以通过使用
`modify` 上的功能 `balances` 桌子。我们将检查是否 `to_balance` 迭代器不等于结束
表，如果不是，那么我们将修改该行。

```cpp
    ...
    if(to_balance != balances.end()){
        balances.modify(to_balance, get_self(), [&](auto& row){
            row.balance += quantity;
        });
    }
```

这 `modify` 函数接受三个参数：
- **迭代器**：要修改的行的迭代器
- **payer**: 支付 RAM 以存储修改行的帐户
- **lambda**：提供对要修改的行的引用的 lambda 函数

lambda 函数是您实际修改行的地方。在这种情况下，我们将新令牌添加到现有的
平衡。

如果还没有余额，那么我们需要为 `to` 帐户。我们可以通过使用
这 `emplace` 上的功能 `balances` 桌子。

```cpp
    ...
    else{
        balances.emplace(get_self(), [&](auto& row){
            row.owner = to;
            row.balance = quantity;
        });
    }
```

这 `emplace` 函数有两个参数：
- **payer**: 支付 RAM 以存储新行的帐户
- **lambda**：提供对新行的引用的 lambda 函数

lambda 函数是您实际初始化新行的地方。在这种情况下，我们设置 `owner` 到 `to`
帐户，以及 `balance` 到 `quantity`.

最后，我们需要更新代币的总供应量。我们可以通过获取 `supply` 桌子。

```cpp
    ...
    supply_table supply(get_self(), get_self().value);
    auto current_supply = supply.get_or_default(asset(0, TOKEN_SYMBOL));
``` 

我们采取了 `supply_table` 我们之前定义并实例化了一个新的 `supply_table` 目的。和以前一样，我们过去了
在里面 `get_self()` 第一个和第二个参数的函数（分别是： `code`， 和 `scope`).

接下来，我们使用了 `get_or_default` 在单例上运行以获取令牌的当前供应，或创建一个新的
如果这是本合同中发行的第一个代币。这 `get_or_default` 函数接受一个参数，
如果不存在任何值，则这是要创建的值。在我们的例子中，默认值是一个新的 `asset` 我们
初始化值为 `0` 和 `TOKEN_SYMBOL` 我们之前定义的常量。这看起来像 `0.0000 GOLD`.

现在我们有了当前供应量，我们可以将新代币添加到当前供应量并将价值保存到区块链中。
由于两者 `current_supply` 和 `quantity` 属于类型 `asset`，我们可以使用 `+` 运算符将它们加在一起。

> ✔ **自动溢出保护**
>
> 的 `asset` 类自动处理上溢/下溢。如果有溢出
> 它会抛出错误并自动中止交易。你不必做任何事
> 使用时的特殊检查 `asset`.但是，如果使用 `uint64_t` 或任何其他基本类型。

```cpp
    ...
    auto new_supply = current_supply + quantity;
    supply.set(new_supply, get_self());
```

我们使用了 `set` 在单例上运行以将新供应保存到区块链。

这 `set` 函数有两个参数：
- **value**：保存到区块链的新值
- **payer**：支付 RAM 以存储新值的帐户

### 燃烧

这 `burn` 行动是非常相似的 `issue` 行动。唯一的区别是我们从
这 `owner` 帐户和供应而不是增加它们。

让我们像以前一样从检查开始，然后进入逻辑。

```cpp
    ACTION burn(name owner, asset quantity){
        check(has_auth(owner), "only the owner of these tokens can burn them");
        check(quantity.is_valid(), "invalid quantity");
        check(quantity.amount > 0, "must burn a positive quantity");
        check(quantity.symbol == TOKEN_SYMBOL, "symbol precision and/or ticker mismatch");
    }
```

我们正在做我们在 `issue` 行动，除了 `is_account` 检查，因为我们已经
测试看是否 `owner` 有一个平衡 `balances` 桌子。

```cpp
    ...
    balances_table balances(get_self(), get_self().value);
    auto owner_balance = balances.find(owner.value);
    check(owner_balance != balances.end(), "account does not have any GOLD");
```

现在让我们检查一下 `owner` 帐户有足够的代币可以燃烧。

```cpp
    ...
    check(owner_balance->balance.amount >= quantity.amount, "owner doesn't have enough GOLD to burn");
```

让我们计算一个新的余额 `owner` 帐户。

```cpp
    ...
    auto new_balance = owner_balance->balance - quantity;
```

我们不需要检查是否 `new_balance` 低于零，因为我们已经检查过 `owner` 账户有足够的代币
燃烧。

让我们从中减去标记 `owner` 帐户。如果 `new_balance` 为零，那么我们就可以擦除
行从 `balances` 表来保存 **RAM**。

```cpp
    ...
    if(new_balance.amount == 0){
        balances.erase(owner_balance);
    }
```

如果 `new_balance` 不为零，那么我们需要修改 `balances` 桌子。

```cpp
    ...
    else {
        balances.modify(owner_balance, get_self(), [&](auto& row){
           row.balance -= quantity;
        });
    }
```

我们还需要从总供应量中移除代币。

```cpp
    ...
    supply_table supply(get_self(), get_self().value);
    supply.set(supply.get() - quantity, get_self());
```

瞧，现在我们可以燃烧虚拟黄金了。

＃＃＃ 转移

这 `transfer` 动作比 `issue` 和 `burn` 动作。我们需要从
一个帐户到另一个帐户，并确保 `from` 账户有足够的代币可以转账。

最重要的是，我们想让其他合约可以与我们的代币交互，这样他们就可以
在它之上构建东西。

让我们再次从检查开始，然后进入逻辑。

```cpp
    ACTION transfer(name from, name to, asset quantity, string memo){
        check(has_auth(from), "only the owner of these tokens can transfer them");
        check(is_account(to), "to account does not exist");
        check(quantity.is_valid(), "invalid quantity");
        check(quantity.amount > 0, "must transfer a positive quantity");
        check(quantity.symbol == TOKEN_SYMBOL, "symbol precision and/or ticker mismatch");
    }
```

我们所做的检查与以前基本相同，但这次我们要确保 `from` 帐户（发件人）是一个
授权转移，我们确保 `to` 帐户存在。

接下来，我们需要得到 `balances` 表并检查是否 `from` 账户有余额。

```cpp
    ...
    balances_table balances(get_self(), get_self().value);
    auto from_balance = balances.find(from.value);
    check(from_balance != balances.end(), "account does not have any GOLD");
```

让我们检查一下 `from` 账户有足够的代币可以转账。

```cpp
    ...
    check(from_balance->balance.amount >= quantity.amount, "owner doesn't have enough GOLD to transfer");
```

我们需要检查是否 `to` 帐户中有余额 `balances` 桌子。

```cpp
    ...
    auto to_balance = balances.find(to.value);
```

如果 `to` 帐户没有余额，那么我们需要在 `balances` 桌子。

```cpp
    ...
    if(to_balance == balances.end()){
        balances.emplace(get_self(), [&](auto& row){
            row.owner = to;
            row.balance = quantity;
        });
    }
```

如果 `to` 帐户_确实_有余额，那么我们需要修改 `balances` 桌子。

```cpp
    ...
    else {
        balances.modify(to_balance, get_self(), [&](auto& row){
            row.balance += quantity;
        });
    }
```

现在我们需要检查是否 `from` 账户余额与 `quantity` 我们正在转移。如果
确实如此，那么我们就可以从 `balances` 表，并再次保存 **RAM**。

```cpp
    ...
    if(from_balance->balance.amount == quantity.amount){
        balances.erase(from_balance);
    }
```

如果 `from` 账户余额大于 `quantity` 我们正在转移，那么我们需要
修改行中的 `balances` 桌子。

```cpp
    ...
    else {
        balances.modify(from_balance, get_self(), [&](auto& row){
            row.balance -= quantity;
        });
    }
```

最后，我们需要发出一个其他合约可以监听的事件。我们将发出两个事件，其中一个具有 `from` 
帐户作为收件人，另一个具有 `to` 作为收件人的帐户。这允许任何一方收听
如果他们已将合同部署到该帐户，则可以对事件进行处理。

```cpp
    ...
    require_recipient(from);
    require_recipient(to);
```


## 完整的合同

如果你想复制完整的合同，并将其与你的合同相匹配，你可以在下面找到它。

<详情>
    <summary>点此查看完整代码</summary>

```cpp
#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include <eosio/singleton.hpp>
using namespace eosio;

CONTRACT token : public contract {
   public:
      using contract::contract;

   const symbol TOKEN_SYMBOL = symbol(symbol_code("GOLD"), 4);

   TABLE balance {
      name     owner;
      asset    balance;

      uint64_t primary_key()const { 
         return owner.value; 
      }
   };

   using balances_table = multi_index<"balances"_n, balance>;

   using supply_table = singleton<"supply"_n, asset>;




   ACTION issue(name to, asset quantity){
      check(has_auth(get_self()), "only contract owner can issue new GOLD");
      check(is_account(to), "the account you are trying to issue GOLD to does not exist");
      check(quantity.is_valid(), "invalid quantity");
      check(quantity.amount > 0, "must issue a positive quantity");
      check(quantity.symbol == TOKEN_SYMBOL, "symbol precision and/or ticker mismatch");

      balances_table balances(get_self(), get_self().value);

      auto to_balance = balances.find(to.value);

      if(to_balance != balances.end()){
            balances.modify(to_balance, get_self(), [&](auto& row){
               row.balance += quantity;
            });
      }
      else{
            balances.emplace(get_self(), [&](auto& row){
               row.owner = to;
               row.balance = quantity;
            });
      }

      supply_table supply(get_self(), get_self().value);

      auto current_supply = supply.get_or_default(asset(0, TOKEN_SYMBOL));

      supply.set(current_supply + quantity, get_self());
   }

   ACTION burn(name owner, asset quantity){
      check(has_auth(owner), "only the owner of these tokens can burn them");
      check(quantity.is_valid(), "invalid quantity");
      check(quantity.amount > 0, "must burn a positive quantity");
      check(quantity.symbol == TOKEN_SYMBOL, "symbol precision and/or ticker mismatch");

      balances_table balances(get_self(), get_self().value);
      auto owner_balance = balances.find(owner.value);
      check(owner_balance != balances.end(), "account does not have any GOLD");
      check(owner_balance->balance.amount >= quantity.amount, "owner doesn't have enough GOLD to burn");

      auto new_balance = owner_balance->balance - quantity;
      check(new_balance.amount >= 0, "quantity exceeds available supply");

      if(new_balance.amount == 0){
         balances.erase(owner_balance);
      }
      else {
         balances.modify(owner_balance, get_self(), [&](auto& row){
               row.balance -= quantity;
         });
      }

      supply_table supply(get_self(), get_self().value);
      supply.set(supply.get() - quantity, get_self());
   }

   ACTION transfer(name from, name to, asset quantity, std::string memo){
      check(has_auth(from), "only the owner of these tokens can transfer them");
      check(is_account(to), "to account does not exist");
      check(quantity.is_valid(), "invalid quantity");
      check(quantity.amount > 0, "must transfer a positive quantity");
      check(quantity.symbol == TOKEN_SYMBOL, "symbol precision and/or ticker mismatch");

      balances_table balances(get_self(), get_self().value);
      auto from_balance = balances.find(from.value);
      check(from_balance != balances.end(), "from account does not have any GOLD");
      check(from_balance->balance.amount >= quantity.amount, "from account doesn't have enough GOLD to transfer");

      auto to_balance = balances.find(to.value);
      if(to_balance == balances.end()){
         balances.emplace(get_self(), [&](auto& row){
               row.owner = to;
               row.balance = quantity;
         });
      }
      else {
         balances.modify(to_balance, get_self(), [&](auto& row){
               row.balance += quantity;
         });
      }

      if(from_balance->balance.amount == quantity.amount){
         balances.erase(from_balance);
      }
      else {
         balances.modify(from_balance, get_self(), [&](auto& row){
               row.balance -= quantity;
         });
      }

      require_recipient(from);
      require_recipient(to);
   }
};
```
</详情>


## 抢战测试源码

如果您只想使用 EOS 网络上大多数可替代代币中使用的源代码，您可以前往
[eosio.token](https://github.com/eosnetworkfoundation/eos-system-contracts/tree/4702c8f2d95dd06f0924688560b8457962522216/contracts/eosio.token)
存储库来获取它。此代码战不仅经过测试，而且为底层 EOS 代币提供支持。

请注意，标准 `eosio.token` 合同与本教程有很大不同。这是一个更复杂的
允许更多高级功能的合约，例如允许与合约交互的用户为他们自己的 RAM 付费，
或在单个合约中创建多个代币。

你将需要 `create` 一个新的令牌，然后 `issue` 这些代币在转移之前先存入一个账户。
您还需要 `open` 一个帐户的余额，然后才能将代币转移到该帐户。


＃＃ 挑战

这个令牌没有 `MAXIMUM_SUPPLY`.您如何向合约添加一个常量来定义最大供应量
令牌并确保 `issue` 行动不超过这个最大供应量？
