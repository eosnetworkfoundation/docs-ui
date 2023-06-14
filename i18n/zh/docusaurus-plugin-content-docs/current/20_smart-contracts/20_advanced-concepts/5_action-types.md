---
title: 动作类型
---

动作是智能合约的入口点。这是一个可以通过帐户调用的功能
与区块链的 API 交互，或通过内联操作由另一个智能合约进行交互。

发送到 EOS 网络的交易包括其中的一项或多项操作。

在 EOS 中，有几种不同的方法可以声明一个动作，它们用于不同的目的。


## 可调用操作

可调用操作是最常见的操作类型。
他们为合约设置了一个自定义入口点，可以被任何账户调用。

您可以通过两种不同的方式定义可调用操作：


＃＃＃ 使用 `[[eosio::action]]` 属性

```cpp
[[eosio::action]] void youraction(){}
```

这是定义动作的最通用的方法。它允许您指定
操作的返回类型，以便您可以让您的操作返回一个值。

> ⚠ **返回值和可组合性**
>
> 返回值只能从区块链外部使用，目前不能使用
> 在 EOS 中实现智能合约的可组合性。

＃＃＃ 使用 `ACTION` 宏观

```cpp
ACTION youraction(){}
```

这是 `[[eosio::action]]` 属性。然而，
它不允许您指定操作的返回类型，因为它包括 `void`
默认返回类型。


## 事件接收者

事件接收器不是动作，而是当另一个动作标记您的合约时将调用的函数
作为收件人。这对于跟踪其他智能合约很有用，例如令牌传输。

下面是两个合约，一个发送事件，一个捕捉事件。

### 发件人合同

```cpp
[[eosio::action]] 
void transfer(name from, name to, asset quantity, std::string memo) {
    require_recipient(to);
}
```

这 `require_recipient` 函数将发送一个事件到 `to` 帐户。如果 `to` 账户有
它上面的智能合约可以侦听事件，然后它将能够对事件采取行动。

> ❔ **谁可以收到活动？**
>
> 任何账户都可以接收事件，但仅限于指定的账户 `require_recipient` 功能
> 会收到通知。您无法收听不需要您作为收件人的合同上的事件。


### 接收方合约

```cpp
[[eosio::on_notify("*::transfer")]] 
void catchevent(name from, name to, asset quantity, std::string memo) {
    print("Received ", quantity, " from ", from);
}
```

### 了解 on_notify 语法

这 `on_notify` attribute 接受一个字符串作为参数。该字符串是一个过滤器，将用于确定
哪些动作会触发 `catchevent` 行动。过滤器的形式为 `contract::action`， 在哪里 `contract`
是发送事件的合约的名称，并且 `action` 是该合约中的动作名称
触发事件。

这 `*` character 是一个通配符，可以匹配任何合约或动作。所以在上面的例子中， `catchevent` 行动
每当任何合约发送一个 `transfer` 行动到 `receiver` 合同。

通配符在过滤器的合同和操作端均受支持，因此您可以使用它来匹配任何合同、任何操作或两者。

例子：
- `*::*` - 匹配任何合同和任何行动
- `yourcontract::*` - 匹配任何动作 `yourcontract`
- `*::transfer` - 匹配任何 `transfer` 对任何合同采取行动
- `yourcontract::transfer` - 匹配 `transfer` 采取行动 `yourcontract`

## 内联动作

内联动作是一种从一个动作中调用另一个动作的方法。让我们演示一下
下面有两个简单的合同。


### 来电合约

```cpp
// This contract is deployed to the account `contract1`
[[eosio::action]]
void callme(name user) {
    action(
        permission_level{get_self(), name("active")},
        name("contract2"),
        name("inlined"),
        std::make_tuple(user)
    ).send();
}
```

### 被调用者合约

```cpp
// This contract is deployed to the account `contract2`
[[eosio::action]]
void inlined(name user) {
    print("I was called by ", user);
}
```

如果你打电话给 `callme` 采取行动 `contract1`，它会发送一个内联动作到 `contract2`， 这将
然后调用 `inlined` action 并打印出作为参数传入的用户的名称。

让我们看看它的结构 `action` 函数调用：

```cpp
action(permission_level, code, action, data).send();
```

这 `action` 函数有四个参数：

#### 权限级别

这 `permission_level` 参数用于指定将调用操作的权限级别。
合约**必须**有调用action的权限，否则内联action调用会失败。

构建一个 `permission_level`:
```cpp
permission_level{name account, name permission}
```

＃＃＃＃ 代码

这 `code` 参数用于指定将调用操作的帐户。

＃＃＃＃ 行动

这 `action` 参数用于指定将调用的操作的名称。

＃＃＃＃ 数据

这 `data` 参数用于指定将传递给操作的数据。
你应该使用 `std::make_tuple` 函数来创建将传递给操作的参数的元组。

这 `tuple` 只是将传递给操作的参数的逗号分隔列表。

> ⚠ **合约是新的发送者**
>
> 当你调用一个内联动作时，调用该动作的合约成为新的发送者。
> 因此，如果您从 `someaccount`， 然后 `contract2` 会看到 `contract1` 作为发件人
> 内联动作的，不是 `someaccount`.
>
> 这一点很重要，因为这意味着 `require_auth` 以类似代币合约的方式运作
> 将不允许您代表另一个帐户发送代币。

### 代码权限

这 `eosio.code` 权限是一种特殊的帐户权限，允许合约调用内联操作。
没有此许可，您的合约将无法调用其他合约的操作。

此权限位于 `active` 许可级别，以便其他合约使用 `require_auth`
功能将能够验证您的合同是否有权调用该操作。

要添加代码权限，您需要更新您帐户的活动权限以由其控制
`<YOURACCOUNT>@eosio.code` **连同您当前的有效许可**。

> ⚠ **不要删除您当前的活动权限控制器**
>
> 的 `eosio.code` 权限旨在添加到您现有的活动权限中，而不是替换它。
> 如果您删除当前活动的权限控制器，那么您将无法访问您的帐户/合约。

具有帐户代码权限的示例权限结构 `yourcontract` 看起来像：
- **所有者**： `YOUR_PUBLIC_KEY`
  - **积极的**：
      - `YOUR_PUBLIC_KEY`
      - `yourcontract@eosio.code`

