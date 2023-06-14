---
title: 创建 NFT
---

NFT 是一种**不可替代的代币**。这意味着它是一个独特的令牌，不能
与另一个令牌互换。

以收藏品为例（名人拥有的钢笔、比赛获胜的球等）。这些中的每一个
物品是独一无二的，不能与其他物品互换，因为它们的价值是
在他们的独特性。

> 👀 **只想创建一个 NFT？**
>
> 在本教程中，我们将讨论创建遵循以太坊 ERC721 的 NFT
> 标准，以便我们可以使用明确的标准深入研究一些 EOS 开发。
>
> **但是**，如果你想创建一个遵循 [**原子资产**](https://github.com/pinknetworkx/atomicassets-contract) 标准哪个
> 在 EOS Network 上比较常见，可以访问 [原子资产 NFT 创造者](https://eos.atomichub.io/creator)
> 您可以在其中轻松创建 NFT，无需部署任何代码即可立即在 AtomicHub 市场上列出。

## 什么是 NFT 标准？

NFT 标准是所有 NFT 必须遵循的一组规则。这允许 NFT 成为
可与其他 NFT 互操作，并适用于市场和钱包等应用程序
了解如何与他们互动。

## ERC721 标准是什么？

这 [ERC721标准](https://eips.ethereum.org/EIPS/eip-721) 是由以太坊社区创建的 NFT 标准。它
是最常见的 NFT 标准，被以太坊网络上的许多 NFT 使用。如果你有
见过 Bored Ape，它们是 ERC721 NFT。

！[无聊猿俱乐部的例子](./images/boredapeclub.jpg)

## 你的开发环境

确保你有 [沙丘](../../20_smart-contracts/10_getting-started/10_dune-guide.md) 安装
并了解如何建立合同。

在每一步之后，你应该尝试编译你的合约并检查是否有任何错误。

## 创建一个新合约

创建一个新的 `nft.cpp` 文件并添加以下代码：

```cpp
#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include <eosio/singleton.hpp>
using namespace eosio;

CONTRACT nft : public contract {

    public:
    using contract::contract;
    
    // TODO: Add actions
};
```

## 创建动作

如果我们看一下 [ERC721标准](https://eips.ethereum.org/EIPS/eip-721), 我们可以看到
我们需要采取一些行动。总的来说，标准很简单，但是
有些概念不一定是 EOS 原生的。比如没有概念
的 `approvals` 在 EOS 上，因为您可以将代币直接发送到另一个帐户（通过 `on_notify` 事件），不像以太坊。

为了使标准尽可能接近原始标准，我们将实施
本教程中的那些非本地概念。

我们将实施的行动是：

```cpp
    ACTION mint(name to, uint64_t token_id){
    
    }
    
    ACTION transfer(name from, name to, uint64_t token_id, std::string memo){
    
    }
    
    [[eosio::action]] uint64_t balanceof(name owner){
    
    }
    
    [[eosio::action]] name ownerof(uint64_t token_id){
    
    }
    
    ACTION approve(name to, uint64_t token_id){
    
    }
    
    ACTION approveall(name from, name to, bool approved){
    
    }
    
    [[eosio::action]] name getapproved(uint64_t token_id){
    
    }
    
    [[eosio::action]] bool approved4all(name owner, name approved_account){
    
    }
    
    [[eosio::action]] std::string gettokenuri(uint64_t token_id){
    
    }
    
    ACTION setbaseuri(std::string base_uri){
    
    }
```

将它们添加到您的合同中，然后让我们深入研究每个操作并查看它们的作用以及它们采用的参数。

您会注意到带有返回值的操作标有 `[[eosio::action]]` 反而
的 `ACTION`.

> ❔ **动作宏**
>
> `ACTION` 是一种叫做 `MACRO`，这是一种编写将被替换的代码的方法
> 在编译时与其他代码。在这种情况下， `ACTION` 宏替换为：
> ```cpp
> [[eosio::action]] void
>
```
> 我们不能使用的原因 `ACTION` 用于返回值的操作的宏是因为
> 它添加了 `void` 函数的关键字，这意味着它不会返回任何东西。

## 深入研究动作参数

如果你想要更深入的解释参数和简单的解释
每个动作，展开下面的部分。

<详情>
    <summary>点此查看</summary>

＃＃＃ 薄荷

这 `mint` action 用于创建一个新的 NFT。

它需要两个参数：
- **to** - 将拥有 NFT 的账户
- **token_id** - NFT 的 ID

＃＃＃ 转移

这 `transfer` action 用于将 NFT 从一个帐户转移到另一个帐户。

它需要四个参数：
- **from** - 当前拥有 NFT 的账户
- **to** - 将拥有 NFT 的账户
- **token_id** - NFT 的 ID
- **备忘录** - 将包含在交易中的备忘录

### 余额

这 `balanceof` action 用于获取帐户余额。

它需要一个参数：
- **owner** - 您想要获取余额的帐户

它返回一个 `uint64_t` 这是帐户的余额。

＃＃＃ 的主人

这 `ownerof` action 用于获取 NFT 的所有者。

它需要一个参数：
- **token_id** - NFT 的 ID

它返回一个 `name` 这是拥有 NFT 的帐户。

＃＃＃ 批准

这 `approve` action 用于批准一个账户代表你转账 NFT。

它需要两个参数：
- **to** - 将被批准转移 NFT 的账户
- **token_id** - NFT 的 ID

### 全部批准

这 `approveall` action 用于批准一个账户代表你转移你所有的 NFT。

它需要三个参数：
- **from** - 当前拥有 NFT 的账户
- **to** - 将被批准转移 NFT 的账户
- **已批准** - 一个布尔值，用于确定帐户是否已获批准

### 获得批准

这 `getapproved` action 用于获取获准代为转账 NFT 的账户。

它需要一个参数：
- **token_id** - NFT 的 ID

它返回一个 `name` 这是被批准转移 NFT 的帐户。

### IsApprovedForAll

这 `approved4all` action 用于获取一个帐户是否被批准代表你转移所有 NFT。

它需要两个参数：
- **owner** - 当前拥有 NFT 的账户
- **approved_account** - 您要检查是否已批准转移 NFT 的帐户

它返回一个 `bool` 这是 `true` 如果该帐户被批准转移 NFT，以及 `false` 如果不是。

### 令牌URI

这 `gettokenuri` action 用于获取 NFT 元数据的 URI。

它需要一个参数：
- **token_id** - NFT 的 ID

它返回一个 `std::string` 这是 NFT 元数据的 URI。

### 设置BaseURI

这 `setbaseuri` action 用于设置 NFT 元数据的基础 URI。

它需要一个参数：
- **base_uri** - NFT 元数据的基本 URI
    
</详情>


## 添加数据结构

现在我们有了我们的动作，我们需要添加一些数据结构来存储 NFT。

我们将使用 `singleton` 存储 NFT。

> ❔ **单身人士**
>
> 一个 `singleton` 是一个表，每个范围只能有一行，不像 `multi_index` 哪个
> 每个范围可以有多行并使用 `primary_key` 来识别每一行。
> 单例更接近以太坊的存储模型。

将以下代码添加到您的合同中的操作上方：

```cpp
    using _owners = singleton<"owners"_n, name>;
    using _balances = singleton<"balances"_n, uint64_t>;
    using _approvals = singleton<"approvals"_n, name>;
    using _approvealls = singleton<"approvealls"_n, name>;
    using _base_uris = singleton<"baseuris"_n, std::string>;
    
    ACTION mint...
```

我们为以下内容创建了单例表：
- **_owners** - 从令牌 ID 到 NFT 所有者的映射
- **_balances** - 从所有者到他们拥有的 NFT 数量的映射
- **_approvals** - 从令牌 ID 到批准转移该 NFT 的帐户的映射
- **_approvealls** - 从所有者到批准转移其所有 NFT 的帐户的映射
- **_base_uris** - 存储 NFT 元数据的基本 URI 的配置表

> ❔ **表命名**
>
> `singleton<"<TABLE NAME>"_n, <ROW TYPE>>`
>
> 如果我们查看单例定义，在双引号内我们有表名。
> EOS 表中的名称也必须遵循帐户名称规则，这意味着它们必须是
> 12 个字符或更少且只能包含字符 `a-z`, `1-5`， 和 `.`.

现在我们已经创建了存储 NFT 数据的表和结构，
我们可以开始为每个动作填充逻辑。


## 添加一些辅助函数

我们需要一些辅助函数来使我们的代码更具可读性和更容易
使用。在表格定义下方的合同中添加以下代码：

```cpp
    using _base_uris = singleton<"baseuris"_n, std::string>;
    
    // Helper function to get the owner of an NFT
    name get_owner(uint64_t token_id){
        
        // Note that we are using the "token_id" as the "scope" of this table.
        // This lets us use singleton tables like key-value stores, which is similar
        // to how Ethereum contracts store data.
        
        _owners owners(get_self(), token_id);
        return owners.get_or_default(name(""));
    }
    
    // Helper function to get the balance of an account
    uint64_t get_balance(name owner){
        _balances balances(get_self(), owner.value);
        return balances.get_or_default(0);
    }
    
    // Helper function to get the account that is approved to transfer an NFT on your behalf
    name get_approved(uint64_t token_id){
        _approvals approvals(get_self(), token_id);
        return approvals.get_or_default(name(""));
    }
    
    // Helper function to get the account that is approved to transfer all of your NFTs on your behalf
    name get_approved_all(name owner){
      _approvealls approvals(get_self(), owner.value);
      return approvals.get_or_default(name(""));
   }
    
    // Helper function to get the URI of the NFT's metadata
    std::string get_token_uri(uint64_t token_id){
        _base_uris base_uris(get_self(), get_self().value);
        return base_uris.get_or_default("") + "/" + std::to_string(token_id);
    }
```

辅助函数将使从我们之前创建的表中获取数据变得更加容易。
我们将在接下来要实现的操作中使用这些函数。

特别是，某些功能在多个地方使用，因此有必要
为他们创建一个辅助函数。例如， `get_owner` 使用函数
在里面 `mint`, `transfer`， 和 `approve` 动作。如果我们没有创建辅助函数
为此，我们必须在每个操作中编写相同的代码。

## 填写动作

我们将完成每个操作并为其实现逻辑。密切关注
注释，因为它们将解释每一行代码的作用。

＃＃＃ 薄荷

这 `mint` action 用于创建一个新的 NFT。

```cpp
    ACTION mint(name to, uint64_t token_id){
        // We only want to mint NFTs if the action is called by the contract owner
        check(has_auth(get_self()), "only contract can mint");
        
        // The account we are minting to must exist
        check(is_account(to), "to account does not exist");
        
        // Get the owner singleton
        _owners owners(get_self(), token_id);
        
        // Check if the NFT already exists
        check(owners.get_or_default().value == 0, "NFT already exists");
        
        // Set the owner of the NFT to the account that called the action
        owners.set(to, get_self());
        
        // Get the balances table
        _balances balances(get_self(), to.value);
        
        // Set the new balances of the account
        balances.set(balances.get_or_default(0) + 1, get_self());
    }
```


＃＃＃ 转移

这 `transfer` action 用于将 NFT 从一个帐户转移到另一个帐户。

```cpp
    ACTION transfer(name from, name to, uint64_t token_id, std::string memo){
        // The account we are transferring from must authorize this action
        check(has_auth(from), "from account has not authorized the transfer");
        
        // The account we are transferring to must exist
        check(is_account(to), "to account does not exist");
        
        // The account we are transferring from must be the owner of the NFT
        // or allowed to transfer it through an approval
        bool ownerIsFrom = get_owner(token_id) == from;
        bool fromIsApproved = get_approved(token_id) == from;
        check(ownerIsFrom || fromIsApproved, "from account is not the owner of the NFT or approved to transfer the NFT");       
        
        // Get the owner singleton
        _owners owners(get_self(), token_id);
        
        // Set the owner of the NFT to the "to" account
        owners.set(to, get_self());
        
        // Set the new balance for the "from" account
        _balances balances(get_self(), from.value);
        balances.set(balances.get_or_default(0) - 1, get_self());
        
        // Set the new balance for the "to" account
        _balances balances2(get_self(), to.value);
        balances2.set(balances2.get_or_default(0) + 1, get_self());
        
        // Remove the approval for the "from" account
        _approvals approvals(get_self(), token_id);
        approvals.remove();
        
        // Send the transfer notification
        require_recipient(from);
        require_recipient(to);
    }
```

### 余额

这 `balanceof` action 用于获取帐户余额。

```cpp
    [[eosio::action]] uint64_t balanceof(name owner){
        return get_balance(owner);
    }
```

> ⚠ **返回值和可组合性**
>
> 返回值只能从区块链外部使用，目前不能使用
> 在 EOS 中实现智能合约的可组合性。 EOS支持 [**内联动作**](../10_getting-started/40_smart-contract-basics.md#inline-actions) 哪个可以用
> 调用其他智能合约，但它们不能返回值。

＃＃＃ 的主人

这 `ownerof` action 用于获取 NFT 的所有者。

```cpp
    [[eosio::action]] name ownerof(uint64_t token_id){
        return get_owner(token_id);
    }
```

＃＃＃ 批准

这 `approve` action 用于批准一个账户代表你转账 NFT。

```cpp
    ACTION approve(name to, uint64_t token_id){
        // get the token owner
        name owner = get_owner(token_id);
        
        // The owner of the NFT must authorize this action
        check(has_auth(owner), "owner has not authorized the approval");
    
        // The account we are approving must exist
        check(is_account(to), "to account does not exist");
        
        // Get the approvals table
        _approvals approvals(get_self(), token_id);
        
        // Set the approval for the NFT
        approvals.set(to, get_self());
    }
```

### 全部批准

这 `approveall` 操作用于批准一个帐户转移您的所有
代表你的 NFT。

```cpp
    ACTION approveall(name from, name to, bool approved){
        // The owner of the NFTs must authorize this action
        check(has_auth(from), "owner has not authorized the approval");
        
        // The account we are approving must exist
        check(is_account(to), "to account does not exist");
        
        // Get the approvals table
        _approvealls approvals(get_self(), from.value);
        
        if(approved){
            // Set the approval for the NFT
            approvals.set(to, get_self());
        } else {
            // Remove the approval for the NFT
            approvals.remove();
        }
    }
```

### 获得批准

这 `getapproved` action 用于获取获准转账的账户
代表你的 NFT。

```cpp
    [[eosio::action]] name getapproved(uint64_t token_id){
        return get_approved(token_id);
    }
```

### 批准4全部

这 `approved4all` action 用于检查帐户是否被批准转移
代表你所有的 NFT。

```cpp
    [[eosio::action]] bool approved4all(name owner, name approved_account){
      return get_approved_all(owner) == approved_account;
   }
```

> ⚠ **动作名称限制**
>
> 账户名也有和表名一样的限制，只能包含
> 人物 `a-z`, `1-5`， 和 `.`.因此，我们不能使用标准 `isApprovedForAll`
> 动作名称，所以我们使用 `approved4all` 反而。

### 令牌URI

这 `tokenuri` action 用于获取 NFT 的 URI。

```cpp
    [[eosio::action]] std::string tokenuri(uint64_t token_id){
        return get_token_uri(token_id);
    }
```

### 设置BaseURI

这 `setbaseuri` action 用于设置 NFT 的基础 URI。

```cpp
    ACTION setbaseuri(std::string base_uri){
        // The account calling this action must be the contract owner
        require_auth(get_self());
        
        // Get the base URI table
        _base_uris base_uris(get_self(), get_self().value);
        
        // Set the base URI
        base_uris.set(base_uri, get_self());
    }
```



## 把它们放在一起

现在我们已经列出了所有的动作，我们可以把它们放在一起 `nft.cpp` 文件。

在查看下面的完整合约之前，您应该尝试自己构建、部署合约并与之交互。
首先你需要铸造一些 NFT 到你控制的账户，然后你可以尝试将它们转移到另一个账户。

您还可以通过批准另一个帐户代表您转移您的 NFT 来测试批准机制，
然后使用批准的帐户将它们转移到另一个帐户。

<详情>
    <summary>点击此处查看完整合同</summary>

```cpp
#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include <eosio/singleton.hpp>
using namespace eosio;

CONTRACT nft : public contract {

   public:
   using contract::contract;

   // Mapping from token ID to owner
   using _owners = singleton<"owners"_n, name>;
   
   // Mapping owner address to token count
   using _balances = singleton<"balances"_n, uint64_t>;
   
   // Mapping from token ID to approved address
   using _approvals = singleton<"approvals"_n, name>;
   
   // Mapping from owner to operator approvals
   using _approvealls = singleton<"approvealls"_n, name>;
   
   // Registering the token URI
   using _base_uris = singleton<"baseuris"_n, std::string>;

   // Helper function to get the owner of an NFT
   name get_owner(uint64_t token_id){
      _owners owners(get_self(), token_id);
      return owners.get_or_default(name(""));
   }
   
   // Helper function to get the balance of an account
   uint64_t get_balance(name owner){
      _balances balances(get_self(), owner.value);
      return balances.get_or_default(0);
   }
   
   // Helper function to get the account that is approved to transfer an NFT on your behalf
   name get_approved(uint64_t token_id){
      _approvals approvals(get_self(), token_id);
      return approvals.get_or_default(name(""));
   }
   
   // Helper function to get the account that is approved to transfer all of your NFTs on your behalf
   name get_approved_all(name owner){
      _approvealls approvals(get_self(), owner.value);
      return approvals.get_or_default(name(""));
   }
   
   // Helper function to get the URI of the NFT's metadata
   std::string get_token_uri(uint64_t token_id){
      _base_uris base_uris(get_self(), get_self().value);
      return base_uris.get_or_default("") + "/" + std::to_string(token_id);
   }
   
   ACTION mint(name to, uint64_t token_id){
      // We only want to mint NFTs if the action is called by the contract owner
      check(has_auth(get_self()), "only contract can mint");

      // The account we are minting to must exist
      check(is_account(to), "to account does not exist");

      // Get the owner singleton
      _owners owners(get_self(), token_id);

      // Check if the NFT already exists
      check(owners.get_or_default().value == 0, "NFT already exists");

      // Set the owner of the NFT to the account that called the action
      owners.set(to, get_self());

      // Get the balances table
      _balances balances(get_self(), to.value);

      // Set the new balances of the account
      balances.set(balances.get_or_default(0) + 1, get_self());
   }
   
   ACTION transfer(name from, name to, uint64_t token_id, std::string memo){
      // The account we are transferring from must authorize this action
      check(has_auth(from), "from account has not authorized the transfer");

      // The account we are transferring to must exist
      check(is_account(to), "to account does not exist");

      // The account we are transferring from must be the owner of the NFT
      // or allowed to transfer it through an approval
      bool ownerIsFrom = get_owner(token_id) == from;
      bool fromIsApproved = get_approved(token_id) == from;
      check(ownerIsFrom || fromIsApproved, "from account is not the owner of the NFT or approved to transfer the NFT");       

      // Get the owner singleton
      _owners owners(get_self(), token_id);

      // Set the owner of the NFT to the "to" account
      owners.set(to, get_self());

      // Set the new balance for the "from" account
      _balances balances(get_self(), from.value);
      balances.set(balances.get_or_default(0) - 1, get_self());

      // Set the new balance for the "to" account
      _balances balances2(get_self(), to.value);
      balances2.set(balances2.get_or_default(0) + 1, get_self());

      // Remove the approval for the "from" account
      _approvals approvals(get_self(), token_id);
      approvals.remove();

      // Send the transfer notification
      require_recipient(from);
      require_recipient(to);
   }
   
   [[eosio::action]] uint64_t balanceof(name owner){
      return get_balance(owner);
   }
   
   [[eosio::action]] name ownerof(uint64_t token_id){
      return get_owner(token_id);
   }
   
   ACTION approve(name to, uint64_t token_id){
      // get the token owner
      name owner = get_owner(token_id);
      
      // The owner of the NFT must authorize this action
      check(has_auth(owner), "owner has not authorized the approval");
   
      // The account we are approving must exist
      check(is_account(to), "to account does not exist");
      
      // Get the approvals table
      _approvals approvals(get_self(), token_id);
      
      // Set the approval for the NFT
      approvals.set(to, get_self());
   }
   
   ACTION approveall(name from, name to, bool approved){
      // The owner of the NFTs must authorize this action
      check(has_auth(from), "owner has not authorized the approval");
      
      // The account we are approving must exist
      check(is_account(to), "to account does not exist");
      
      // Get the approvals table
      _approvealls approvals(get_self(), from.value);
      
      if(approved){
         // Set the approval for the NFT
         approvals.set(to, get_self());
      } else {
         // Remove the approval for the NFT
         approvals.remove();
      }
   }
   
   [[eosio::action]] name getapproved(uint64_t token_id){
      return get_approved(token_id);
   }
   
   [[eosio::action]] bool approved4all(name owner, name approved_account){
      return get_approved_all(owner) == approved_account;
   }
   
   [[eosio::action]] std::string gettokenuri(uint64_t token_id){
      return get_token_uri(token_id);
   }
   
   ACTION setbaseuri(std::string base_uri){
      // The account calling this action must be the contract owner
      require_auth(get_self());
      
      // Get the base URI table
      _base_uris base_uris(get_self(), get_self().value);
      
      // Set the base URI
      base_uris.set(base_uri, get_self());
   }
};
```
</详情>

## 这是出于教育目的

请记住，如果您在 EOS 网络上部署此合约并铸造代币，则
将没有支持的市场来出售它们（在撰写本指南时）。这仅用于教育目的。

＃＃ 挑战

这个 NFT 合约是没有办法销毁 NFT 的。添加一个 `burn` 允许令牌所有者销毁自己的 NFT 的操作。
