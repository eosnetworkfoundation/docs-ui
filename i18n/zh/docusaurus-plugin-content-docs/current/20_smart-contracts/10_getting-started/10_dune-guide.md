---
title: 沙丘
---

[用于节点执行的 Docker 实用程序 (DUNE)](https://github.com/AntelopeIO/DUNE) 是一种客户端工具，允许区块链开发人员和节点运营商执行与智能合约开发和节点管理功能相关的样板任务。

在开始智能合约开发之前，您需要了解 DUNE 以及如何在您的平台上安装它。

＃＃＃ 安装

DUNE 可以在以下平台上安装和运行：
* Linux
* 窗户
* 苹果系统

每个受支持平台的安装说明可在 [DUNE的github项目](https://github.com/AntelopeIO/DUNE) 页。

完成后，您可以运行 `dune --help` 查看所有支持命令的列表。

## 钱包

DUNE 为您处理钱包管理，因此您不必这样做。

如果您需要将新密钥导入您的钱包：

```shell
dune --import-dev-key <PRIVATE_KEY>
```

## 节点管理

使用 DUNE 可以轻松创建新的本地 EOS 区块链。

```shell
dune --start <NODE_NAME>
```

上面的命令创建了一个名为 `NODE_NAME` 并以默认设置启动它。
该节点被配置为充当 API/生产者节点，您可以将智能合约部署到该节点并对其执行测试。

> ❔ **错误**
>
> 您可能会在节点设置过程结束时看到错误。
> 如果您这样做，您可以参考本指南来解决常见错误，或通过我们的
> [电报频道](https://t.me/antelopedevs) 求助。

您可以在系统上看到 EOS 节点列表：

```shell
dune --list
```

您还可以检查您的活动节点的 RPC API 是否有效：

```shell
dune -- cleos get info
```

要关闭您的节点：

```shell
dune --stop <NODE_NAME>
```

要完全删除一个节点：

```shell
dune --remove <NODE_NAME>
```


### 引导你的环境

您的开发环境可能需要依赖一些系统契约，例如：
- `eosio.token` 用于 **EOS** 代币转账
- `eosio.msig` 用于多重签名交易
- `eosio.system` 用于系统级操作，例如资源管理

引导您的本地节点很容易，一旦您有一个活动节点正在运行，您就可以通过以下方式引导它：

```shell
dune --bootstrap-system-full
```


＃＃ 帐户管理

您在账户之上部署合约，并使用它们与您的智能合约进行交互。

要创建一个新帐户：

```shell
dune --create-account <ACCOUNT_NAME>
```

获取账户信息：

```shell
dune -- cleos get account <ACCOUNT_NAME>
```

## 智能合约开发

让我们创建一个示例项目，以便我们可以学习如何使用 DUNE 编译、部署和与智能合约交互。

导航到要在其中创建项目的目录，然后运行以下命令：

```shell
dune --create-cmake-app hello .
```

这将创建一个 `hello` 带有 cmake 风格 EOS 智能合约项目的目录。

替换内容 `src/hello.cpp` 使用以下代码：

```cpp
#include <eosio/eosio.hpp>
using namespace eosio;

CONTRACT hello : public contract {
   public:
      using contract::contract;

      TABLE user_record {
         name user;
         uint64_t primary_key() const { return user.value; }
      };
      typedef eosio::multi_index< name("users"), user_record> user_index;

      ACTION test( name user ) {
         print_f("Hello World from %!\n", user);
         user_index users( get_self(), get_self().value );
         users.emplace( get_self(), [&]( auto& new_record ) {
            new_record.user = user;
         });
      }
};
```

### 编译合约

从项目的根目录运行以下命令来编译合约：

```shell
dune --cmake-build .
```
你会看到你的合约正在编译中。如果有任何错误，您将在输出中看到它们。

### 部署你的合约

我们需要为您的合约创建一个帐户，然后我们才能部署它。

```shell
dune --create-account hello
dune --deploy ./build/hello hello
```

> 👀 **代码权限**
>
> 默认情况下，DUNE 添加 `eosio.code` 当您向其部署合同时对帐户的权限。这允许
> 合约能够触发其他智能合约的内联操作。

### 与你的合约互动

要与您的合约交互，您将在本地 EOS 节点上发送交易。 EOS 上的交易由
`actions`，因此我们将向您的合约发送一个动作。

我们还将创建一个测试帐户来发送操作。

```shell
dune --create-account testaccount

# format: dune --send-action <CONTRACT> <ACTION> <PARAMETERS> <SENDER>
dune --send-action hello test '[bob]' testaccount
```

你应该看到一个事务在第一次成功执行，如果你尝试重复这个命令它会
失败，因为该行已经存在于合同的数据库中。

### 从你的合约中获取数据

您刚刚在合约的数据库中添加了一行，让我们从链中获取该数据：

```shell
# format: dune --get-table <CONTRACT> <SCOPE> <TABLE>
dune --get-table hello hello users
```

您应该得到一个包含一行或多行的表结果。如果您不确定上面的交互是否成功。

## 在 DUNE 中使用原始程序

如果你想利用原始 EOS 堆栈，你可以使用 `DUNE -- <COMMAND>` 格式以访问容器内的任何内容。

例子：
    
```shell
dune -- cleos get info
dune -- nodeos --help
```
