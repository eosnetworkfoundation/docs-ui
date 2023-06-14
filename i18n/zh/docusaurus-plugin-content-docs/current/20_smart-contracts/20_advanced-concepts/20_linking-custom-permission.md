---
title: “创建和链接自定义权限”
---

＃＃ 介绍

在 EOS 区块链上，您可以为账户创建各种自定义权限。自定义权限稍后可以链接到合同的操作。该权限系统使智能合约具有灵活的授权方案。

本教程说明了自定义权限的创建，以及随后如何将权限链接到操作。完成这些步骤后，除非提供新链接权限的授权，否则合约的动作将被禁止执行。这使您可以更精细地控制帐户及其各种操作。

拥有权利的同时也被赋予了重大的责任。此功能对您的合约及其用户的安全性提出了一些挑战。确保您在使用之前了解概念和步骤。

[[信息|家长许可]]
|当您创建自定义权限时，该权限将始终在父权限下创建。

如果您拥有在其下创建自定义权限的父权限的权限，则您始终可以执行需要该自定义权限的操作。

## 步骤 1. 创建自定义权限

首先，让我们在 `alice` 帐户：

```shell
dune -- cleos set account permission alice upsert YOUR_PUBLIC_KEY owner -p alice@owner
```

有几点需要注意：

1. 创建了一个名为 **upsert** 的新权限
2.**upsert**权限使用开发公钥作为权限证明
3. 此权限创建于 `alice` 帐户

您还可以为此权限指定公钥以外的权限，例如一组其他帐户。

## 第 2 步。将授权链接到您的自定义权限

链接授权调用 `upsert` 使用新创建的权限执行操作：

```shell
dune -- cleos set action permission alice addressbook upsert upsert
```

在此示例中，我们将授权链接到 `upsert` 先前在地址簿合约中创建的操作。

## 第 3 步。测试它

让我们尝试用 `active` 允许：

```shell
dune -- cleos push action addressbook upsert '["alice", "alice", "liddel", 21, "Herengracht", "land", "dam"]' -p alice@active
```

您应该会看到如下所示的错误：

```text
Error 3090005: Irrelevant authority included
Please remove the unnecessary authority from your action!
Error Details:
action declares irrelevant authority '{"actor":"alice","permission":"active"}'; minimum authority is {"actor":"alice","permission":"upsert"}
```

现在，尝试 **upsert** 权限，这一次，显式声明我们刚刚创建的 **upsert** 权限：（例如 `-p alice@upsert`)

```text
dune -- cleos push action addressbook upsert '["alice", "alice", "liddel", 21, "Herengracht", "land", "dam"]' -p alice@upsert
```

现在它起作用了：

```text
dune -- cleos push action addressbook upsert '["alice", "alice", "liddel", 21, "Herengracht", "land", "dam"] -p alice@upsert
executed transaction:

2fe21b1a86ca2a1a72b48cee6bebce9a2c83d30b6c48b16352c70999e4c20983  144 bytes  9489 us
#   addressbook <= addressbook::upsert          {"user":"alice","first_name":"alice","last_name":"liddel","age":21,"street":"Herengracht","city":"land",...
#   addressbook <= addressbook::notify          {"user":"alice","msg":"alice successfully modified record to addressbook"}
#         eosio <= addressbook::notify          {"user":"alice","msg":"alice successfully modified record to addressbook"}
#     abcounter <= abcounter::count             {"user":"alice","type":"modify"}
```
