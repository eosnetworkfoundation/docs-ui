--- 
title: 智能合约基础
---

智能合约是运行在区块链上的程序。它允许您向帐户添加功能，从简单的待办事项应用程序到完全在区块链上运行的成熟 RPG 游戏。

本指南将向您展示如何使用 **DUNE** 和 C++ 编程语言开发基本的 EOS 智能合约。

##准备步骤

### 创建合约账户

要部署智能合约，您需要一个帐户来部署它。创建一个帐户 `hello` 使用以下命令：

```shell
dune --create-account hello
```

### 创建测试账号

创建第二个帐户， `ama`, 用于测试目的。

```shell
dune --create-account ama
```

###沙丘

要开发智能合约，您将使用 Docker Utilities for Node Execution (DUNE)，该工具允许您执行节点管理功能、编译智能合约以及在 EOS 区块链上开发智能合约所需的其他几个常见任务。

确保你已经安装了 DUNE。否则遵循 [DUNE 开发设置](../10_getting-started/10_dune-guide.md#installation) 文档。

## 创建智能合约

要创建智能合约，您需要：

1.创建一个DUNE基础应用。
2. 扩展应用程序以执行您想要的自定义操作。
3. 构建输出智能合约的 DUNE 应用程序。
4.部署构建应用程序产生的智能合约。

### 创建 DUNE 应用程序

```shell
dune --create-cmake-app hello .
cd hello
ls
```

该命令的结果是 `hello` 具有以下结构的目录：

- CMakeLists.txt，cmake 配置文件。
- README.txt，一个文本文件，其中包含有关如何使用 cmake 构建此应用程序的信息。
- build，输出build文件夹，一开始是空的。
- include，C++ include 文件夹，一开始它只包含 hello.hpp 文件。
- 李嘉图，该文件夹包含智能合约李嘉图定义，hello.contracts.md 文件。
- src，C++ 实现文件文件夹，开始时它只包含 hello.cpp 文件。

### 构建 DUNE 应用程序

要构建 DUNE cmake 应用程序，请运行以下命令：

```shell
dune --cmake-build <PATH_TO_CMakeLists.txt_PARENT_DIR>
ls <PATH_TO_CMakeLists.txt_PARENT_DIR>/build/hello
```

上述构建命令的结果是两个文件位于 `./build/hello/` 文件夹：

- hello.wasm，智能合约的 WebAssembly 二进制文件。
- hello.abi，智能合约的应用程序二进制接口 (ABI) 文件。

### 部署智能合约

执行以下命令部署 `hello` 智能合约到 `hello` 帐户：

```shell
dune --deploy <PATH_TO_CMakeLists.txt_PARENT_DIR>/build/hello
```

## 智能合约源文件

智能合约C++源文件为：

- 你好.hpp
- 你好.cpp

### hpp 文件

在 C++ 编程中，一个 `.hpp` 文件是一个头文件，其中包含类、函数、变量和其他实体的声明，这些实体旨在用于程序的其他部分。这 `.hpp` 文件通常包含在源代码文件中（`.cpp`) 使用 #include 预处理器指令。

这 `hello.hpp` 包含 `hello` 智能合约 C++ 类声明。

```cpp
#include <eosio/eosio.hpp>
using namespace eosio;

CONTRACT hello : public contract {
   public:
      using contract::contract;

      ACTION hi( name nm );
};
```

智能合约类声明必须：

- 由 [[eosio::contract]] 属性注释，告诉编译器它是一个智能合约类；在里面 `hello.hpp` 生成代码 `CONTRACT` `macro` 被使用，它扩展到 `class [[eosio::contract]]` 编译时的 C++ 代码。
- 源自 `contract` 提供基本智能合约功能的类。
- 至少定义一个公共行为函数。

> ℹ️ **C++ 宏**
在 C++ 中，一个 `macro` 是一种为一段代码或一个值定义速记的方法。当。。。的时候 `macro` 在代码中使用时，预处理器会在编译代码之前自动将其替换为相应的定义。这可以通过减少重复和增加抽象来帮助使代码更具可读性和可维护性。

稍后您将了解有关操作的更多信息。

### .cpp 文件

在 C++ 编程中，一个 `.cpp` 文件是包含 C++ 代码的源代码文件。这 `.cpp` 文件是 C++ 项目中最重要的文件之一，因为它包含执行所需功能的代码的实际实现。

这 `hello.cpp` 文件包含 `hello` 类的每个成员函数的智能合约 C++ 类实现。

## 动作

动作是一种方法，由智能合约类定义和实现。动作可以有参数和返回值，它们的职责是执行合约的业务逻辑。它们可以被其他合约或外部账户使用 EOS Chain API 调用。每个操作可能需要特定级别的授权，这可以在操作的代码中指定。

这 `hello` 智能合约类只有一个动作由其实现 `hi` 公共成员函数。

```cpp
#include <hello.hpp>

ACTION hello::hi( name nm ) {
   /* fill in action body */
   print_f("Name : %\n",nm);
}
```

实现智能合约动作的函数必须由 `[[eosio::action("action.name")]]` 属性。这 `action.name` 是可选的，如果未指定，则操作由实现它的函数名称命名。
在里面 `hello.cpp` 生成代码 `ACTION` 使用宏扩展为 `[[eosio::action]] void` 编译时的 C++ 代码。

操作名称必须：

- 不超过 13 个字符。
- 仅包含 `.`, `a`-`z`， 或者 `1`-`5` 人物。
- 不结束 `.`.

请注意，当您使用 `ACTION` 宏动作名称与实现它的函数名称相同。因为动作名称也继承了 C++ 函数名称的限制，这意味着它不能有 `.` 在里面。
如果您使用 `[[eosio::action("action.name")]]` 属性，您可以为操作命名，而不是实现它的函数名称。

### 发送操作

发送 `hi` 对本地节点的操作并将其设置为输入参数 `ama` 测试帐号名称：

```shell
dune --send-action hello hi '[ama]' hello@active
```

上面命令的输出显示在一行中 `hello::hi` 使用输入参数执行操作 `{"nm":"ama"}` 在第二行是动作本身的输出 `Name: ama`.

```txt
#         hello <= hello::hi   {"nm":"ama"}
>> Name : ama
```

## 内联动作

内联动作由智能合约动作发起，并在与父动作相同的事务中执行。在智能合约操作需要与另一个智能合约交互的情况下，内联操作很有用。无需对其他合约进行外部调用（这可能会导致新交易），该操作可以在同一交易中内联执行。如果事务的任何部分失败，内联操作将与事务的其余部分一起展开。

执行内联操作的最简单方法是使用 `SEND_INLINE_ACTION` 宏。

### 发送内联操作

让我们将 hello 智能合约扩展为：

- 实施一项名为 `inlineaction` 在控制台打印一条消息。
- 修改 `hi` 发送内联的动作 `inlineaction` 对区块链的行动。

```hpp
#include <eosio/eosio.hpp>
using namespace eosio;

CONTRACT hello : public contract {
   public:
      using contract::contract;

      ACTION hi( name nm );
      ACTION inlineaction();
};
```

```cpp
#include <hello.hpp>

ACTION hello::hi( name nm ) {
   print_f("Name : %\n",nm);

   SEND_INLINE_ACTION(*this, inlineaction, {get_self(), "active"_n}, {});
}

ACTION hello::inlineaction() {
   printf("Inline action message.\n");
}
```

这 `SEND_INLINE_ACTION` 宏的第三个参数使用 `_n()` 要转换的字符串运算符 `"active"` 串成一个 `name` 目的。 `"active"_n` 是一个捷径 `name("active")`.和 `name` 是 EOS 内置类型。您将在本指南的后面部分了解有关内置类型的更多信息。

> ℹ️ **C++ 运算符**
在 C++ 编程中，运算符是用于对变量或值执行操作的符号或关键字。 C++ 中的运算符示例包括算术运算符（+、-、*、/）、赋值运算符（=、+=、-=、*=、/=）、比较运算符（==、!=、<、>、< =、>=）、逻辑运算符（&&、||、!）和许多其他运算符。

再次构建智能合约并像之前一样将其部署到本地节点。

寄一个 `hi` 对本地节点采取行动并观察两者 `hi` 和 `inlineactions` 动作被执行。

```shell
dune --send-action hello hi '[ama]' hello@active
```

```txt
#         hello <= hello::hi                    {"nm":"ama"}
>> Name : ama
#         hello <= hello::inlineaction          ""
>> Inline action message.
```

## 内置类型

EOS 支持多种用于开发智能合约的 C++ 数据类型。开发人员可以使用这些类型来定义数据结构并编写与 EOS 区块链和智能合约系统交互的函数。

这是内置类型的完整列表：

|积分类型 |说明 |
| --- | --- |
|要包含的头文件 | `<eosio/eosio.hpp>` |
| `bool` |布尔值（真/假） |
| `int8_t` |有符号 8 位整数 |
| `uint8_t` |无符号 8 位整数 |
| `int16_t` |有符号 16 位整数 |
| `uint16_t` |无符号 16 位整数 |
| `int32_t` |有符号 32 位整数 |
| `uint32_t` |无符号 32 位整数 |
| `int64_t` |有符号 64 位整数 |
| `uint64_t` |无符号 64 位整数 |
| `int128_t` |有符号 128 位整数 |
| `uint128_t` |无符号 128 位整数 |
|要包含的头文件 | `<eosio/varint.hpp>` |
| `signed_int` |可变长度有符号 32 位整数 |
| `unsigned_int` |可变长度无符号 32 位整数 |

|浮动类型 |说明 |
| --- | --- |
|要包含的头文件 | `<eosio/eosio.hpp>` |
| `float` | 32 位浮点数 |
| `double` | 64 位浮点数 |

|时间类型 |说明 |
| --- | --- |
|要包含的头文件 | `<eosio/eosio.hpp>` |
| `time_point` |时间点 |
| `time_point_sec` |秒级精度的时间点 |
| `block_timestamp_type` |区块时间戳 |

|姓名类型 |说明 |
| --- | --- |
|要包含的头文件 | `<eosio/eosio.hpp>` |
| `name` |账户名 |

|斑点类型 |说明 |
| --- | --- |
|要包含的头文件 | `<eosio/eosio.hpp>` |
| `bytes` |原始字节序列 |
| `string` |字符串 |

|校验和类型 |说明 |
| --- | --- |
|要包含的头文件 | `<eosio/eosio.hpp>` |
| `checksum160` | 160 位校验和 |
| `checksum256` | 256 位校验和 |
| `checksum512` | 512 位校验和 |

|密码学类型 |说明 |
| --- | --- |
|要包含的头文件 | `<eosio/crypto.hpp>` |
| `public_key` |公钥 |
| `signature` |签名 |

|资产类型 |说明 |
| --- | --- |
|要包含的头文件 | `<eosio/asset.hpp>` |
| `symbol` |资产符号 |
| `symbol_code` |资产代码 |
| `asset` |资产 |
| `extended_asset` |具有扩展精度的资产 |

## 多索引表

多索引表是一种类似于数据库的数据结构，允许开发人员以持久有效的方式存储和管理数据。多索引表是使用 `TABLE` 宏，并且可以存储任意数量的行，每行包含一组相关的数据元素。

延长 `hello` 合同：

- 添加 `userdata` 表声明。
- 添加 `createrow` 创建新的非管理员用户的操作。
- 添加 `readrow` 读取用户数据的操作。
- 添加 `updaterow` 更新现有用户数据的操作。
- 添加 `deleterow` 删除现有用户数据的操作。

hello.hpp 文件可能如下所示：

```cpp
#include <eosio/eosio.hpp>
using namespace eosio;

CONTRACT hello : public contract {
   public:
      using contract::contract;

      ACTION hi(name nm);

      ACTION inlineaction();

      // Table actions
      ACTION createrow(name nm);
      ACTION readrow(name nm);
      ACTION updaterow(name nm, bool is_admin);
      ACTION deleterow(name nm);

   private:

   TABLE user_data {
      name user;
      bool is_admin;

      uint64_t primary_key() const { return user.value; }
   };
   using user_data_table = eosio::multi_index<"userdata"_n, user_data>;
};
```

上面的代码定义了一个 `user_data_table` 类型，这是一种具有名称的表 `userdata`，它存储由定义的行 `user_data` 结构。该结构包含两个字段：帐户 `name`和一个布尔值，表示用户是否是管理员。这 `primary_key()` inline 方法定义表的主键，在本例中是用 64 位无符号整数值表示的用户帐户名。

多索引表的名称与动作的名称具有相同的限制。

### 多索引：使用代码和范围实例化

开发人员可以使用 `user_data_table` 类型以在表中实例化引用**并对该表执行各种操作，例如：

- 查询特定数据的表，
- 插入新行，
- 修改现有行，
- 删除现有行。

这就是您在表中定义引用的方式 `userdata`:

```cpp
user_data_table users(get_self(), get_self().value);
```

第一个参数是 `code` 参数，第二个是 `scope`.

- 这 `code` (`name`) 是拥有智能合约（和表）的帐户。

- 这 `scope` (`integer`) 用于对多索引表中的相关数据进行分组。为了将所有相关数据分组在同一个合约中，范围通常设置为合约账户本身。

在上面的代码中， `code`, 初始化为 `get_self()`，它返回部署合约的帐户。这 `scope`, 初始化为 `get_self().value`，它返回帐户名称的数字表示。

请注意，这两个参数允许您访问不同的表 `instances` 同桌的 `type`.例如，对于同一个 `code` parameter 您可以通过为第二个参数使用不同的值来访问相同类型的不同表 `scope`.所有这些表都属于同一帐户集 `code` 范围。

另一种看待它的方式是 `users` 对象是具有名称的表中的引用 `userdata` （这是类型 `user_data_table`).这个引用是RAM存储空间中的一个地址，分配给这个表，表行保存在这里 `code` 和 `scope` 定义（的 `get_self()` 和 `get_self().value`).内的表数 `userdata` 表等于（`code`, `scope`) 对用于实例化表引用。

接下来执行在 `hello.hpp` 文件。打开 `hello.cpp` 文件并复制并粘贴以下功能实现。

### 多索引：创建行

这是如何在 `user_data_table`:

```cpp
ACTION hello::createrow(name nm) {
   user_data_table users(get_self(), get_self().value);

   auto itr = users.find(name.value);

   if ( itr == users.end() ) {
      users.emplace(get_self(), [&](auto& row) {
         row.user = nm;
         row.is_admin = false;
      });
      printf("User % added as non-admin.\n", nm);
   }
   else {
      printf("User % already exists.\n", nm);
   }
}
```

上面的代码使用了 `emplace` 向表中插入新用户的方法。

### 多索引：读取行

这是查询的方法 `user_data_table` 基于其主键：

```cpp
ACTION hello::readrow(name nm) {
   user_data_table users(get_self(), get_self().value);

   auto itr = users.find(nm.value);
   if ( itr != users.end() ) {
      if (itr->is_admin) {
         print_f("User admin % found.\n", itr->user);
      }
      else {
         print_f("User non-admin % found.\n", itr->user);
      }
   }
   else {
      printf("User % not found.\n", nm);
   }
}
```

### 多索引：修改行

这是修改现有行的方法 `user_data_table`:

```cpp
ACTION hello::updaterow(name nm, bool is_admin) {
   user_data_table users(get_self(), get_self().value);

   auto itr = users.find(nm.value);
   if ( itr != users.end() ) {
      users.modify(itr, get_self(), [&](auto& row) {
         row.is_admin = is_admin;
      });
      print_f("User % is_admin was set to %.\n", itr->user, itr->is_admin);
   }
   else{
      printf("User % not found.\n", nm);
   } 
}
```

### 多索引：删除行

这是从中删除实体的方法 `user_data_table`:

```cpp
ACTION hello::deleterow(name nm) {
   user_data_table users(get_self(), get_self().value);

   auto itr = users.find(nm.value);
   if ( itr != users.end() ) {
      users.erase(itr);
      printf("User % erased.\n", nm);
   }
   else{
      printf("User % not found.\n", nm);
   }
}
```

### 多指标：测试

再次构建并部署智能合约，发送 `createrow` 操作几次并观察结果：

```shell
dune --send-action hello createrow '[ama]' hello@active
```

```txt
#         hello <= hello::createrow             {"nm":"ama"}
>> User added as non-admin.
```

```shell
dune --send-action hello createrow '[ama]' hello@active
```

```txt
#         hello <= hello::createrow             {"nm":"ama"}
>> User already exists.
```

请注意第一个操作是如何创建非管理员用户的 `ama` 第二个没有，因为用户已经存在。

阅读 `ama` 用户数据：

```shell
dune --send-action hello readrow '[ama]' hello@active
```

```txt
#         hello <= hello::readrow               {"nm":"ama"}
>> User non-admin ama found.
```

让用户 `ama` 行政：

```shell
dune --send-action hello updaterow '[ama, 1]' hello@active
```

```txt
#         hello <= hello::updaterow             {"nm":"ama","is_admin":1}
>> User ama is_admin was set to true.
```

删除用户 `ama`:

```shell
dune --send-action hello deleterow '[ama]' hello@active
```

```txt
#         hello <= hello::deleterow             {"nm":"ama"}
>> User erased.
```

## 单例

单例是一种特殊的多索引表，旨在为单例类型的每个实例存储一行数据。单例通常用于在合约中存储全局状态变量或配置参数。

记住代码和范围的解释很重要。当你实例化一个单例时，你可以保持 code 参数固定，改变 scope 参数。通过这种方式，您可以为每个范围保存一个项目，因此，例如，您可以存储每个帐户的配置。

这是单例声明的示例：

```cpp
TABLE statsdata {
    int count;
};
using stats_singleton = eosio::singleton<"stats"_n, statsdata>;
```

上面的代码定义了一个单例类型 `stats_singleton`.这个单例存储由定义的统计数据 `statsdata` 结构。该结构包含 `count` 可以保存任意整数值的数据成员。

开发人员可以使用 `stats_singleton` 模板类型，实例化单例表的引用并执行各种操作，例如：

- 读取单例数据，
- 修改现有的单例数据，
- 删除现有的单例数据。

### 单例：使用代码和范围实例化

代码和范围与 [多索引表](#multi-index-code-and-scope).
这就是您在具有名称的单例中实例化引用的方式 `stats`.这 `code` 和 `scope` 被设置为合约所有者帐户：

```cpp
   stats_singleton stats(get_self(), get_self().value);
```

延长 `hello` 承包给：

- 添加单例 `stats`.
- 添加 `updatestats` 使用给定值更新统计信息的操作。
- 添加 `readstats` 读取存储在单例中的统计信息的操作。
- 添加 `deletestats` 删除存储在单例中的统计信息的操作。

在顶部添加以下行 `hello.hpp` 文件：

```cpp
#include <eosio/singleton.hpp>
```

添加单例相关动作：

```cpp
   ACTION updatestats(int value);
   ACTION readstats();
   ACTION deletestats();
```

添加单例定义：

```cpp
   TABLE statsdata {
      int count;
   };
   using stats_singleton = eosio::singleton<"stats"_n, statsdata>;
```

### 单例：修改数据

这是修改单例数据的方式：

```cpp
ACTION hello::updatestats(int value) {
   stats_singleton stats(get_self(), get_self().value);

   auto current_stats = stats.get_or_create(get_self(), {0});
   current_stats.count = value;
   stats.set(current_stats, get_self());

   print_f("Stats updated with value %.\n", value);
}
```

### 单例：读取数据

这就是您获取单例数据的方式：

```cpp
ACTION hello::readstats() {
   stats_singleton stats(get_self(), get_self().value);
   
   if (stats.exists()) {
      auto current_stats = stats.get();   
      print_f("Stats value: %\n", current_stats.count);
   }
   else {
      print_f("Stats not initialized.");
   }
}
```

### 单例：删除数据

这是删除单例数据的方式：

```cpp
ACTION hello::deletestats() {
   stats_singleton stats(get_self(), get_self().value);
   
   if (stats.exists()) {
      stats.remove();
      print_f("Stats have been removed.");
   }
   else {
      print_f("Stats not initialized.");
   }
}
```

### 单例：测试

再次构建并部署智能合约，并发送您刚刚添加的三个新操作：

```shell
dune --send-action hello readstats '[]' hello@active
```

```txt
#         hello <= hello::readstats             ""
>> Stats not initialized.
```

```shell
dune --send-action hello updatestats '[999]' hello@active
```

```txt
#         hello <= hello::updatestats           {"value":999}
>> Stats updated with value 999.
```

```shell
dune --send-action hello readstats '[]' hello@active
```

```txt
#         hello <= hello::readstats             ""
>> Stats value: 999
```

```shell
dune --send-action hello deletestats '[]' hello@active
```

```txt
#         hello <= hello::deletestats           ""
>> Stats have been removed.
```

```shell
dune --send-action hello readstats '[]' hello@active
```

请注意，现在统计信息不再初始化：

```txt
#         hello <= hello::getstats              ""
>> Stats not initialized.
```

## 索引

索引提供了对存储在多索引表中的数据的高效和灵活的访问。索引是一种专门的数据结构，允许您根据某个字段或字段组合在表中查找数据。索引可用于优化从表中检索数据的查询的性能，还可以对数据实施唯一性约束（仅限主索引）。

EOS 支持两种类型的索引：

- 主要指标
- 二级索引

### 主索引

主索引是多索引表中每一行的唯一标识符。它是使用明确定义的 `primary_key()` 成员函数。该函数必须在 `struct` 表示表，并且必须返回唯一标识每一行的值。在里面 `hello` 智能合约我们已经为 `user_balance` 表结构定义。

```cpp
uint64_t primary_key() const { return user.value; }
```

### 二级索引

二级索引是表结构中的任何附加字段，可用于有效地搜索和过滤数据。
二级索引可以定义在不唯一以及唯一的数据成员上。最多可以有 16 个二级索引。二级索引支持以下类型：

- `uint64_t`
- `uint128_t`
- `uint256_t`
- `double`
- `long double`

如果您将新的二级索引添加到现有的多索引表，将会产生不可预知的结果，因为索引是在行插入或更新时应用的。

### 添加二级索引

您现在知道什么是二级索引以及如何定义它们了。
延长 `hello` 具有两个新操作的智能合约：

- `addmsg`，它允许一个帐户发送一条消息，该消息保存在一个表中并由消息内容索引。
- `searchmsg`，它可以使用定义的二级索引查找消息。

#### 添加数据结构

在顶部 `hello.hpp` 文件添加以下行：

```cpp
#include <eosio/crypto.hpp>
```

然后，在前面的表定义之后，添加底层的数据结构 `user_messages` 桌子：

```cpp
TABLE user_messages {
    name user;
    std::string message;
    checksum256 messagecks;
    uint64_t time;

    uint64_t primary_key() const { return time; }
    checksum256 message_idx() const { return messagecks; }
};
```

上面代码中注意：

- 这 `primary_key()` 方法返回 `time` 数据成员。主索引是唯一的，因此必须在保存唯一值的数据成员上定义。
- 这 `message_idx()` 方法返回 `messagecks` 保存数据的 SHA-256 散列的数据成员 `message` 数据。

#### 用二级索引定义表

在里面 `hello.hpp` 文件定义 `messages_table` 具有二级索引的表类型：

```cpp
using messages_table = eosio::multi_index<
    "messages"_n,
    user_messages,
    indexed_by<"messageidx"_n, const_mem_fun<user_messages, checksum256, &user_messages::message_idx>>
    >;
```

在上面的代码中注意 `messages_table` 的定义几乎与您之前定义的相同 `user_data_table`.这次的不同之处在于 `"messageidx"` 二级索引，它是用 `indexed_by` 和 `const_mem_fun` 模板。这 `const_mem_fun` 接收三个参数：

- `user_messages`：多索引表结构名，
- `checksum256`：索引定义的数据类型，
- `&user_messages::message_idx`：对结构中定义的二级索引函数的引用。

二级索引的名称与操作的名称具有相同的限制。

#### 定义和实施操作

在里面 `hello.hpp` 文件定义将使用的两个动作 `messages_table` 及其 `messageidx` 二级指标。

```cpp
ACTION searchmsg(std::string message);
ACTION addmsg(name nm, std::string message);
```

在里面 `hello.cpp` 通过添加以下代码来实现这两个操作：

```cpp
ACTION hello::addmsg(name nm, std::string message) {
   messages_table messages(get_self(), get_self().value);

   messages.emplace(get_self(), [&](auto& row) {
      row.user = nm;
      row.message = message;
      row.messagecks = eosio::sha256(message.data(), message.size());
      row.time = current_time_point().time_since_epoch().count();
   });
}

ACTION hello::searchmsg(std::string message) {
   messages_table messages(get_self(), get_self().value);
   auto message_idx = messages.get_index<"messageidx"_n>();

   auto messagecks = eosio::sha256(message.data(), message.size());
   auto itr = message_idx.find(messagecks);
   if (itr != message_idx.end()) {
      print_f("First message found. User: %, Message: %\n", itr->user, itr->message);
      for ( auto itr_idx = ++itr; itr_idx->messagecks == messagecks; itr_idx++ ){
         print_f("Other message: User: %, Message: %\n", itr_idx->user, itr_idx->message);
      }
   } else {
      print_f("Message not found.");
   }
}
```

在上面的代码中注意 `eosio::sha256` 函数返回一个固定长度的 256 位（32 字节）散列值作为 checksum256 对象。哈希值是使用 SHA-256 算法计算的，该算法是一种广泛使用的加密哈希函数。 checksum256 类型是 32 字节固定长度数组的类型定义，在整个 EOS 代码库中用于表示哈希值。

第二个操作利用二级索引通过哈希来搜索消息。请注意，因为它不是唯一索引，所以会找到与搜索匹配的第一个值，但是在它之后可以存在具有相同搜索值的多行。这就是为什么 `searchmsg` 函数打印找到的第一条消息和所有后续消息。

### 索引：测试

再次构建并部署智能合约，发送 `addmsg` 使用两个不同的帐户作为第一个参数和与第二个参数相同的消息执行几次操作，然后搜索添加的消息以查看是否找到：

```shell
dune --send-action hello addmsg '[ama, "good morning sunshine"]' hello@active
dune --send-action hello addmsg '[hello, "good morning sunshine"]' hello@active
```

找出 `good morning sunshine` 消息：

```shell
dune --send-action hello searchmsg '["good morning sunshine"]' hello@active
```

```txt
#         hello <= hello::searchmsg             {"message":"good morning sunshine"}
>> First message found. User: ama, Message: good morning sunshine
>> Other message: User: hello, Message: good morning sunshine
```

## 断言

断言是一种在合约执行期间检查某个条件是否为真的机制。如果条件不为真，断言将导致合约终止并显示一条错误消息。

### 使用断言()

使用标准错误消息实现断言检查，如下所示：

```cpp
assert(message.size() <= 10);
```

### 使用检查（）

使用如下自定义错误消息实施断言检查：

```cpp
check(message.size() <= 10, "Message can not be bigger than 10 characters.");
```

### 使用断言扩展智能合约

将上述检查添加到 `addmsg` 执行，每次重新编译和部署合约，然后执行命令签署并发送动作到区块链：

```shell
dune --send-action hello addmsg '[ama, "01234567891"]' ama@active
```

这是您在使用 `assert()` 功能：

```txt
failed transaction: 50c7566e784a34509e02e4775e6b63b5978d3ddf5ab02618bee8c8a68ff5ce8d  <unknown> bytes  <unknown> us
error 2023-03-01T16:49:50.792 cleos     main.cpp:700                  print_result         ] soft_except->to_detail_string(): 3050008 abort_called: Abort Called
abort() called
    {}
    nodeos  cf_system.cpp:7 abort
pending console output: Assertion failed: message.size() <= 10 (hello.cpp: addmsg: 94)

    {"console":"Assertion failed: message.size() <= 10 (hello.cpp: addmsg: 94)\n"}
    nodeos  apply_context.cpp:124 exec_one
```

这是您在使用 `check()` 功能：

```txt
failed transaction: 6d18bc090aa65880b28a4f697e8bf08999e68d209c2a1367f16d596e11bbed02  <unknown> bytes  <unknown> us
error 2023-03-01T16:54:04.555 cleos     main.cpp:700                  print_result         ] soft_except->to_detail_string(): 3050003 eosio_assert_message_exception: eosio_assert_message assertion failure
assertion failure with message: Message can not be bigger than 10 characters.
    {"s":"Message can not be bigger than 10 characters."}
    nodeos  cf_system.cpp:14 eosio_assert
pending console output: 
    {"console":""}
    nodeos  apply_context.cpp:124 exec_one
```

＃＃ 授权

当用户或合约尝试发送动作时，EOS 区块链软件可以验证该动作。此验证过程包括检查用户或合同是否有权执行该操作。

这 `hello` 合约不执行任何授权检查。任何账户都可以将任何“你好”合约的动作发送到区块链，然后它们就会被执行。

发送 `hi` 行动并签署 `hello@active` 私钥成功：

```shell
dune --send-action hello addmsg '[ama, "hi again"]' hello@active
```

```txt
#         hello <= hello::addmsg                {"nm":"ama","message":"hi again"}
```

发送 `hi` 行动并签署 `ama@active` 私钥也成功：

```shell
dune --send-action hello addmsg '[ama, "hi again"]' ama@active
```

```txt
#         hello <= hello::addmsg                {"nm":"ama","message":"hi again"}
```

您可以实施授权检查以仅允许某些帐户或仅允许一个帐户执行 `hello` 合约的动作。

### 使用 check() 和 has_auth()

要执行授权检查，请使用 `check()` 结合功能 `has_auth` 功能。此组合强制执行操作 `addmsg` 仅由作为第一个参数发送的帐户执行，无论帐户使用什么权限来签署交易（例如所有者、活动、代码）。如果检查失败，它会通过自定义消息引发错误。

```cpp
ACTION hello::addmsg(name nm, std::string message) {

    check(has_auth(user), "User is not authorized to perform this action.");

    messages_table messages(get_self(), get_self().value);

    messages.emplace(get_self(), [&](auto& row) {
        row.user = nm;
        row.message = message;
        row.messagecks = eosio::sha256(message.data(), message.size());
        row.time = current_time_point().time_since_epoch().count();
    });
}
```

编译部署智能合约，发送 `addmsg` 第一个参数的动作 `ama` 并用它签名 `hello@active` 键，然后观察它如何失败并显示自定义错误消息：

```cpp
dune --send-action hello addmsg '[ama, "hi again"]' hello@active
```

```txt
failed transaction: 6d2e11e24d9adc066136f94bc66c13df2dfce952f1a5a0fa7a0286043a67f0c6  <unknown> bytes  <unknown> us
error 2023-03-01T15:44:02.588 cleos     main.cpp:700                  print_result         ] soft_except->to_detail_string(): 3050003 eosio_assert_message_exception: eosio_assert_message assertion failure
assertion failure with message: User is not authorized to perform this action.
    {"s":"User is not authorized to perform this action."}
    nodeos  cf_system.cpp:14 eosio_assert
pending console output: 
    {"console":""}
    nodeos  apply_context.cpp:124 exec_one
```

### 使用 require_auth()

它与前面的组合做同样的事情，只是您不能自定义失败时引发的错误消息。

```cpp
ACTION hello::addmsg(name nm, std::string message) {

    require_auth( nm );

    messages_table messages(get_self(), get_self().value);

    messages.emplace(get_self(), [&](auto& row) {
        row.user = nm;
        row.message = message;
        row.messagecks = eosio::sha256(message.data(), message.size());
        row.time = current_time_point().time_since_epoch().count();
    });
}
```

编译部署智能合约，发送 `addmsg` 第一个参数的动作 `ama` 并用它签名 `hello@active` 键，然后观察它是如何失败并显示标准错误消息的：

```cpp
dune --send-action hello addmsg '[ama, "hi again"]' hello@active
```

```txt
failed transaction: 8887cca7fababeb883aa6806c220eece3d5f3c618824b2378ac25a67c09a063a  <unknown> bytes  <unknown> us
error 2023-03-01T15:53:35.033 cleos     main.cpp:700                  print_result         ] soft_except->to_detail_string(): 3090004 missing_auth_exception: Missing required authority
missing authority of ama
    {"account":"ama"}
    nodeos  apply_context.cpp:256 require_authorization
pending console output: 
    {"console":""}
    nodeos  apply_context.cpp:124 exec_one
```

### 使用 require_auth2()

这 `require_auth2()` 仅由设置为第一个参数的帐户强制执行，并且仅当用于签署交易的权限是指定为第二个参数的权限时。如果检查失败，则会引发无法自定义的标准错误消息。

```cpp
ACTION hello::addmsg(name nm, std::string message) {

   require_auth2(nm.value, "active"_n.value);

   messages_table messages(get_self(), get_self().value);

   messages.emplace(get_self(), [&](auto& row) {
      row.user = nm;
      row.message = message;
      row.messagecks = eosio::sha256(message.data(), message.size());
      row.time = current_time_point().time_since_epoch().count();
   });
}
```

编译部署智能合约，发送 `addmsg` 第一个参数的动作 `ama`, 签名 `ama@owner` 私钥，然后观察它如何失败并显示标准错误消息：

```shell
dune --send-action hello addmsg '[ama, "hi again"]' ama@owner
```

即使 `ama@owner` 私钥用于签署上述交易，执行失败，因为所需的签名是 `ama@active`.

```txt
failed transaction: 7dcb10621e4102ec933cdbaf544f0204446cc96bc20b76242391b17286f1408e  <unknown> bytes  <unknown> us
error 2023-03-01T16:00:02.853 cleos     main.cpp:700                  print_result         ] soft_except->to_detail_string(): 3090004 missing_auth_exception: Missing required authority
missing authority of ama/active
    {"account":"ama","permission":"active"}
    nodeos  apply_context.cpp:275 require_authorization
pending console output: 
    {"console":""}
    nodeos  apply_context.cpp:124 exec_one
```

## 活动

EOS 智能合约开发人员可以使用事件机制，允许他们实施智能合约，监听另一个智能合约动作发送的通知。 EOS 事件机制由两个参与者定义：

- 从其操作之一引发事件的智能合约。
- 侦听第一个智能合约操作引发的事件的智能合约。

### require_recipient()

要从智能合约操作中引发事件，请使用 `require_recipient()` 将指定的收件人帐户添加到要通知的帐户集的函数。执行当前操作后，系统会向列表中的每个收件人帐户发送通知。如果这些账户部署了一个智能合约来实现 `on_notify()` 发送合同帐户和操作注册的方法，然后他们将能够收到通知并采取相应的行动。

### on_notify（）

收听智能合约操作引发的事件，实施 `on_notify()` 功能并为该特定智能合约及其操作注册它。

实施第二个监听的智能合约 `hello::addmsg` 动作通知。

```shell
dune --create-cmake-app hellolisten ./
```

打开 `hellolisten.hpp` 并实施 `on_notify()` 方法如下图：

```cpp
#include <eosio/eosio.hpp>

using namespace eosio;

CONTRACT hellolisten : public contract {
   public:
      using contract::contract;

      ACTION hi( name nm );

      [[eosio::on_notify("hello::addmsg")]]
      void handle_addmsg(name nm, std::string message) {
         // take action based on this notification
         print_f("Notification received. From: %, message: %\n", nm, message);
      }

   private:
};
```

改变 `hello::addmsg` 引发事件的行动 `hellolisten` 每当添加新消息时，合约帐户。

```cpp
ACTION hello::addmsg(name nm, std::string message) {

   check(has_auth(nm), "User is not authorized to perform this action.");
   check(message.size() <= 10, "Message can not be bigger than 10 characters.");

   require_recipient("hellolisten"_n);

   messages_table messages(get_self(), get_self().value);

   messages.emplace(get_self(), [&](auto& row) {
      row.user = nm;
      row.message = message;
      row.messagecks = eosio::sha256(message.data(), message.size());
      row.time = current_time_point().time_since_epoch().count();
   });
}
```

创建一个帐户 `hellolisten`，然后构建新的智能合约并将其部署到新创建的帐户。

```shell
dune --create-account hellolisten
dune --cmake-build ./hellolisten/
dune --deploy ./hellolisten/build/hellolisten hellolisten
```

发送一个 `addmsg` 到 `hello` 收缩并观察其输出：

```shell
dune --send-action hello addmsg '[ama, "hi notify"]' ama@active
```

```txt
#         hello <= hello::addmsg                {"nm":"ama","message":"hi notify"}
#   hellolisten <= hello::addmsg                {"nm":"ama","message":"hi notify"}
>> Notification received. From: ama, message: hi notify
```

注意在输出中，最后两行显示：

- 这 `hello::addmsg` 带有参数的动作被发送到 `hellolisten` 帐户和
- 这 `hellolisten::on_notify` 方法被执行；结果，两个输入参数被打印在控制台上。
