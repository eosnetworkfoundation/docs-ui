---
title: “了解 ABI 文件”
---

一个 `ABI` 文件（或应用程序二进制接口）是一个 JSON 文件，描述了如何将智能的集成商或用户
合同可以与他们互动。它描述了你的智能合约的动作和数据结构，以及如何转换它们
往返于 JSON。

ABI 文件是从智能合约源代码生成的，但也可以手动编写它们（尽管不推荐）。

了解它们将使您能够编写更好的智能合约，并更轻松地调试它们。


## 示例 ABI

```cpp
CONTRACT mycontract : public contract {
   public:
      using contract::contract;
      TABLE user {
         name     eos_account;
         uint8_t  is_admin;

         uint64_t primary_key() const { 
            return eos_account.value; 
         }
      };

      using user_table = eosio::multi_index<"users"_n, user>;

      ACTION newuser( name eos_account ){}
};
```

上面的代码将生成以下 JSON ABI：

```json
{
    "version": "eosio::abi/1.2",
    "types": [],
    "structs": [
        {
            "name": "newuser",
            "base": "",
            "fields": [
                {
                    "name": "eos_account",
                    "type": "name"
                }
            ]
        },
        {
            "name": "user",
            "base": "",
            "fields": [
                {
                    "name": "eos_account",
                    "type": "name"
                },
                {
                    "name": "is_admin",
                    "type": "uint8"
                }
            ]
        }
    ],
    "actions": [
        {
            "name": "newuser",
            "type": "newuser",
            "ricardian_contract": ""
        }
    ],
    "tables": [
        {
            "name": "users",
            "type": "user",
            "index_type": "i64",
            "key_names": [],
            "key_types": []
        }
    ],
    "ricardian_clauses": [],
    "variants": [],
    "action_results": []
}
```

## ABI 元素

＃＃＃ 版本

ABI 的版本用于确保兼容性。它是格式中的字符串 `eosio::abi/X.Y`， 在哪里 `X` 和 `Y` 是整数。

```json
"version": "eosio::abi/1.2",
```

### 类型

类型是合同中定义的自定义类型。它们通常用于使合约开发更具可读性和可维护性。

```json
"types": [{
 "new_type_name": "name",
 "type": "name"
}],
```

### 结构

结构是合约中定义的自定义数据结构。它们通常用作存储在数据库表中的模型。


#### 基本结构

```json
{
  "name": "issue",     // The name
  "base": "",          // Inheritance, parent struct
  "fields": []         // Array of field structures
}
```

#### 字段结构

```json
{
  "name":"",  // The field's name
  "type":""   // The field's type
}
```

#### 示例结构
```json
{
  "name": "newuser",
  "base": "",
  "fields": [
    {
      "name": "eos_account",
       "type": "name"
    }
  ]
}
```

### 动作

动作是合约的可调用函数。它们是合约用户与之交互的对象
当他们想在区块链上执行操作时。

```json
{
  "name": "newuser",           // The name of the action as defined in the contract
  "type": "newuser",           // The name of the implicit parameter struct as described in the action interface
  "ricardian_contract": ""     // An optional ricardian clause to associate to this action describing its intended functionality.
}
```

### 表

表是合约的持久数据结构。它们是存储在区块链中的数据的位置。

```json
{
  "name": "",       // The name of the table, determined during instantiation.
  "type": "",       // The table's corresponding struct
  "index_type": "", // The type of primary index of this table
  "key_names" : [], // An array of key names, length must equal length of key_types member
  "key_types" : []  // An array of key types that correspond to key names array member, length of array must equal length of key names array.
}
```

填写表格的示例：

```json
{
  "name": "accounts",
  "type": "account", // Corresponds to previously defined struct
  "index_type": "i64",
  "key_names" : ["primary_key"],
  "key_types" : ["uint64"]
}
```

＃＃＃ 评论

您可以在 ABI 文件中添加注释，工具会忽略该注释。

```json
"___comment" : "Your comment here"
```
