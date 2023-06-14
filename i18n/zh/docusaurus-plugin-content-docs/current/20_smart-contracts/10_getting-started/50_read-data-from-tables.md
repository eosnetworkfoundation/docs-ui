---
title: 从表中读取数据
---

##先决条件

要遵循本指南，您需要：

- 了解 EOS 区块链及其运作方式。
- 运行 curl 命令的命令行界面。
- 访问 EOS 节点或 EOS API 服务。

## EOS 表

EOS 将数据存储在表中，类似于数据库表。每个表都有一个名称和一组字段。表被组织成范围，这些范围由创建表的智能合约定义。

要从表中检索数据，您需要知道其名称、范围以及创建它的智能合约的名称。您还可以指定下限和上限以限制返回的数据量。

## 从 EOS 表中检索数据的方法

### 使用get_table_rows 函数

这 `get_table_rows` 函数从表中检索行。它采用以下 JSON 格式的参数：

- `"code"`：eos 帐户名称，它是创建该表的智能合约的所有者。
- `"scope"`: 表的范围，它是一个eos账户名。
- `"table"`：表示表名的字符串。
- `"json"`：（可选）一个布尔值，指定是否以JSON格式或二进制格式返回行结果，默认为二进制。
- `"lower_bound"`：（可选）表示表键下限的字符串，默认为所用索引的第一个值。
- `"upper_bound"`：（可选）表示表键上限的字符串，默认为所用索引的最后一个值。
- `"index_position"`：（可选）如果表有多个索引，则使用索引的位置，可接受的值为 `primary`, `secondary`, `tertiary`, `fourth`, `fifth`, `sixth`, `seventh`, `eighth`, `ninth` , `tenth`, 默认为 `primary`.
- `"key_type"`：（可选）表示表键类型的字符串，支持的值 `i64`, `i128`, `i256`, `float64`, `float128`, `sha256`, `ripemd160`, `name`.
- `"encode_type"`：（可选）表示 key_type 参数的编码类型的字符串，或者 `dec` 或者 `hex`, 默认为 `dec`.
- `"limit"`：限制返回的结果数，默认为10。
- `"time_limit_ms"`：（可选）检索结果应花费的最长时间，默认为 10 毫秒。
- `"reverse"`: (选项) 如果 `true` 结果以相反的顺序检索，从 lower_bound 向上到 upper_bound，默认为 `false`.

下面是一个从中检索行的示例 `abihash` 表，由 `eosio` 帐户并作为 `scope` 这 `eosio` 姓名。

```shell
curl --request POST \
--url https://eos.greymass.com/v1/chain/get_table_rows \
--header 'content-type: application/json' \
--data '{
"json": true,
"code": "eosio",
"scope": "eosio",
"table": "abihash",
"lower_bound": "eosio",
"limit": 3,
"reverse": false
}'
```

在上面的例子中：

- 行值以 JSON 形式返回，由 `json` 范围。
- 该表归该帐户所有 `eosio`, 由 `code` 范围。
- 表范围是 `eosio`, 由 `scope` 范围。
- 表名是 `abihash.`, 由 `table` 范围。
- 查询使用主索引来搜索行并从 `eosio` 下界指标值，由 `lower_bound` 范围。
- 该函数将获取最多 3 行，由 `limit` 范围。
- 检索到的行将按升序排列，由 `reverse` 范围。

或者，您可以使用以下命令执行相同的命令 `cleos` 实用工具，并具有相同的结果：

```shell
dune -- cleos -u https://eos.greymass.com get table eosio eosio abihash --lower eosio --limit 3
```

#### get_table_rows 结果

返回的 JSON `get_table_rows` 具有以下结构：

```json
{
  "rows": [
    { },
    ...
    { }
  ],
  "more": true,
  "next_key": ""
}
```

这 `"rows"` 字段是 JSON 表示形式的表行对象数组。
这 `"more"` 字段表示除了返回的行之外还有其他行。
这 `"next_key"` 字段包含在下一次检索下一组行的请求中用作下限的键。

例如，上一节命令的结果包含三行，看起来与下面的类似：

```json
{
  "rows": [
    {
      "owner": "eosio",
      "hash": "00e166885b16bcce50fea9ea48b6bd79434cb845e8bc93cf356ff787e445088c"
    },
    {
      "owner": "eosio.assert",
      "hash": "aad0ac9f3f3d8f71841d82c52080f99479e869cbde5794208c9cd08e94b7eb0f"
    },
    {
      "owner": "eosio.evm",
      "hash": "9f238b42f5a4be3b7f97861f90d00bbfdae03e707e5209a4c22d70dfbe3bcef7"
    }
  ],
  "more": true,
  "next_key": "6138663584080503808"
}
```

#### get_table_rows 分页

请注意，上一个命令具有 `"more"` 字段设置为 `true`.这意味着表中有更多行与所使用的过滤器匹配，但未随第一个发出的命令返回。

这 `"next_key"`, `"lower_bound"` 和 `"upper_bound"` 字段，可用于从 EOS 区块链中的任何表中实现数据的分页或迭代检索。

要获取下一组行，您可以发出另一个 `get_table_rows` 请求，将下限修改为 `"next_key"` 场地：

```shell
curl --request POST \
--url https://eos.greymass.com/v1/chain/get_table_rows \
--header 'content-type: application/json' \
--data '{
"json": true,
"code": "eosio",
"scope": "eosio",
"table": "abihash",
"lower_bound": "6138663584080503808",
"limit": 3,
"reverse": false
}'
```

或者，您可以使用以下命令执行相同的命令 `cleos` 实用工具，并具有相同的结果：

```shell
dune -- cleos -u https://eos.greymass.com get table eosio eosio abihash --lower 6138663584080503808 --limit 3
```

上面的命令返回后续的 3 行 `abihash` 生产者名称值大于的表 `"6138663584080503808"`.通过迭代此过程，您可以检索表中的所有行。

如果第二个请求的响应包括 `"more": false`，这意味着您已经获取了所有与过滤器匹配的可用行，并且不需要进一步的请求。

### 使用get_table_by_scope 函数

的目的 `get_table_by_scope` 是扫描给定的表名 `code` 帐户，使用 `scope` 作为主键。如果您已经知道表名，例如 `mytable`, 没有必要使用 `get_table_by_scope` 除非你想知道定义的范围是什么 `mytable` 桌子。

这些是支持的输入参数 `get_table_by_scope`:

- `"code"`：eos 帐户名称，它是创建该表的智能合约的所有者。
- `"table"`：表示表名的字符串。
- `"lower_bound"` （可选）：该字段指定查询表行时的范围下限。它根据范围值确定获取行的起点。默认为范围的第一个值。
- `"upper_bound"` （可选）：该字段指定查询表行时的范围上限。它根据范围值确定获取行的终点。默认为范围的最后一个值。
- `"limit"` （可选）：此字段指示函数中要返回的最大行数。它允许您控制在单个请求中检索的行数。
- `"reverse"` （可选）：如果 `true` 结果以相反的顺序检索，从 lower_bound 向上到 upper_bound，默认为 `false`.
- `"time_limit_ms"`：（可选）检索结果应花费的最长时间，默认为 10 毫秒。

下面是 get_table_by_scope 函数的示例 JSON 负载：

```json
{
  "code": "accountname1",
  "table": "tablename",
  "lower_bound": "accountname2",
  "limit": 10,
  "reverse": false,
}
```

在上面的例子中：

- 该表归该帐户所有 `accountname1`, 由 `code` 范围。
- 表名是 `tablename.`, 由 `table` 范围。
- 查询从 `accountname2` 范围值，由 `lower_bound` 范围。
- 该函数将获取最多 10 行，由 `limit` 范围。
- 检索到的行将按升序排列，由 `reverse` 范围。

#### get_table_by_scope 结果

这 `get_table_by_scope` 返回一个 JSON 对象，其中包含有关指定范围内的表的信息。返回的 JSON 包含以下字段：

- `"rows"`：该字段包含一组表。
- `"more"`：此字段表示是否有更多可用结果。如果它设置为 true，则意味着可以使用分页获取额外的行。有关如何检索其他行的更多详细信息，请参阅上一节。

每个表行都由一个包含以下字段的 JSON 对象表示：

- `"code"`：拥有该表的合约的帐户名。
- `"scope"`：在其中找到表的合同范围。它代表合同中的特定实例或类别。
- `"table"`：由合约 ABI 指定的表的名称。
- `"payer"`: 支付存储行的 RAM 成本的付款人的帐户名称。
- `"count"`：表中的行数乘以表定义的索引数（包括主索引）。例如，如果表只定义了主索引，那么 `count` 表示表中的行数；对于为表定义的每个附加二级索引，计数表示行数乘以 N，其中 N = 1 + 二级索引数。

##### 空结果

返回的 JSON 可能如下所示：

```json
{
    "rows":[],
    "more": "accountname"
}
```

以上结果表示您的请求由于区块链配置的交易时间限制而未完成执行。结果告诉你它没有找到任何表（`rows` 字段为空）来自指定的 `lower_bound` 到 `"accountname"` 边界。在这种情况下，您必须再次执行请求 `lower_bound` 设置为由提供的值 `"more"` 领域，在这种情况下 `accountname`.

#### 真实例子

对于一个真实的例子，您可以列出前三个名为 `accounts` 拥有的 `eosio.token` 从下限范围开始的帐户 `eosromania`:

```shell
curl --request POST \
--url https://eos.greymass.com/v1/chain/get_table_by_scope \
--header 'content-type: application/json' \
--data '{
"json": true,
"code": "eosio.token",
"table": "accounts",
"lower_bound": "eosromania",
"upper_bound": "",
"reverse": false,
"limit": "3"
}'
```

结果类似于下面的结果：

```json
{
  "rows": [
    {
      "code": "eosio.token",
      "scope": "eosromania22",
      "table": "accounts",
      "payer": "tigerchainio",
      "count": 1
    },
    {
      "code": "eosio.token",
      "scope": "eosromaniaro",
      "table": "accounts",
      "payer": "gm3tqmrxhage",
      "count": 1
    },
    {
      "code": "eosio.token",
      "scope": "eosromansev1",
      "table": "accounts",
      "payer": "gateiowallet",
      "count": 1
    }
  ],
  "more": "eosromario11"
}
```
