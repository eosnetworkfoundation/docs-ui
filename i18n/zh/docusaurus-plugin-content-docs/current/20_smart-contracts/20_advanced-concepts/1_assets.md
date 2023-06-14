---
title: 资产
---

一个 `asset` 是专门为区块链令牌制作的特殊类型。

资产的两个主要组成部分是 `symbol` 和 `amount`.

这 `symbol` 是字符串和数字的组合。字符串是
令牌的名称和数字是小数位数。

这 `amount` 是一个 64 位有符号整数。

## 定义资产

如果你想在你的合同中使用资产，你需要包括 `asset.hpp`:

```cpp
#include <eosio/asset.hpp>
```

然后你可以在你的合同中使用资产类型。让我们先设置一个符号：

```cpp
symbol TOKEN_SYMBOL = symbol("COOL", 8);
// or
symbol TOKEN_SYMBOL("COOL", 8);
```

这将创建一个名称为 `COOL` 和 8 位小数。

现在我们可以创建资产：

```cpp
asset my_asset = asset(1'00000000, TOKEN_SYMBOL);
// or
asset my_asset(1'00000000, TOKEN_SYMBOL);
```

上面的声明意味着资产的字符串表示形式如下所示： `1.00000000 COOL`.

## 资产运营商

资产类型有一些操作符可以用来操作资产。

### 数学运算

您可以将两个资产加在一起：

```cpp
asset a = asset(1'00000000, TOKEN_SYMBOL);
asset b = asset(2'00000000, TOKEN_SYMBOL);
asset c = a + b;
```

这将导致 `c` 等于 `3.00000000 COOL`.你也可以选择
直接将两项资产的金额相加：

```cpp
uint64_t c = a.amount + b.amount;
```

> ⚠ 两种资产必须具有相同的符号。
>
> 用不同的符号进行数学运算会导致执行时出错。
> 在处理智能合约中的资产时，您应该始终确保符号匹配。

其他数学运算也可用：

```cpp
asset a = asset(1'00000000, TOKEN_SYMBOL);
asset b = asset(2'00000000, TOKEN_SYMBOL);
asset c = a - b; 
asset d = a * 2;
asset e = a / 2; 
e += a; 
e -= a; 
e *= 2; 
e /= 2;
```

## 比较运算符

您可以将两种资产相互比较：

```cpp
asset a = asset(1'00000000, TOKEN_SYMBOL);
asset b = asset(2'00000000, TOKEN_SYMBOL);
bool c = a > b;
bool d = a < b; 
bool e = a == b; 
bool f = a != b;
```

## 打印资产

如果您想在错误消息或控制台日志中打印资产，您可以使用 `to_string()` 方法。

```cpp
asset a = asset(1'00000000, TOKEN_SYMBOL);
check(false, "You have " + a.to_string() + " tokens.");
```

## 检查有效性

在使用资产之前，您应该始终检查资产是否有效。这是通过 `is_valid()` 方法。
这将检查资产是否在有效值范围内以及符号是否有效。

```cpp
asset a = asset(1'00000000, TOKEN_SYMBOL);
check(a.is_valid(), "Asset is not valid.");
```



## 溢出注意事项

资产类型带有内置的溢出/下溢保护。

这意味着如果您尝试将两个资产相加并且结果大于 64 位整数的最大值，则会抛出错误。

它不允许您创建金额不在带符号 64 位整数范围内的资产。






