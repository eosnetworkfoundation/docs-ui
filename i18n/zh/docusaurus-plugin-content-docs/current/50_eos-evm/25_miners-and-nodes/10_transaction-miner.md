---
title: 交易矿工
--- 

EOS EVM 交易矿工是一个简单的交易中继，允许您进行以太坊格式的交易和
将它们推送到 EOS Native 节点上的 EOS EVM 合约。


## 你的矿工账户

您将需要一个 EOS 网络帐户，该帐户将用作您的**矿工帐户**。

EOS EVM Miner 软件将收到的 EVM 交易转换为 EOS 交易，然后发送
到 `eosio.evm` 原生 EOS 网络上的合约。

作为这些交易的中继者，您有机会为您提供的服务赚取奖励。

### 矿工和资源

当您的矿工账户中继交易时，它会慢慢耗尽其 CPU 和 NET 资源。您将需要管理这些
资源以确保您的矿机可以继续运行。

像 PowerUp 这样的服务应该是自动化的，以确保你的矿工账户有足够的资源继续运行
没有中断。

> ❔ **不需要 RAM**
>
> 您的矿工账户在中继交易时不会耗尽 RAM 资源。它只消耗 CPU 和 NET 资源。
> 的 `eosio.evm` 合约通过从 EVM 交易中收取的费用来支付 EOS EVM 使用的 RAM。

### 注册你的矿工

拥有矿工帐户后，您需要在 `eosio.evm` 合同。

```bash
cleos -u https://eos.greymass.com/ push action eosio.evm open '["<your-miner-account>"]' -p <your-miner-account>
```

如果您想使用网络界面注册，您可以访问 [块.io](https://bloks.io/account/eosio.evm?loadContract=true&tab=Actions&account=eosio.evm&scope=eosio.evm&limit=100&action=open)
并使用像这样的钱包签署交易 [锚](https://www.greymass.com/anchor).

### 查看你的挖矿奖励

这 `eosio.evm` contract 会将你从挖矿中获得的奖励存储在一个表中。您可以随时通过以下方式查看这些奖励
从合同中获取表行 `balances` 上限和下限设置为您的矿工帐户的表格：

```bash
cleos -u https://eos.greymass.com/ get table eosio.evm eosio.evm balances -U <your-miner-account> -L <your-miner-account>
```

您还可以查看相同的数据 [块.io](https://bloks.io/account/eosio.evm?loadContract=true&tab=Tables&account=eosio.evm&scope=eosio.evm&limit=100&table=balances)


### 提取你的挖矿奖励

这 `eosio.evm` contract 会将你从挖矿中获得的奖励存储在一个表中。您可以随时提取这些奖励
通过向 `eosio.evm` 与以下行为签订合同：

```bash
cleos -u https://eos.greymass.com/ push action eosio.evm withdraw '["<your-miner-account>", "1.0000 EOS"]' -p <your-miner-account>
```

如果您想使用网络界面声明，您可以访问 [块.io](https://bloks.io/account/eosio.evm?loadContract=true&tab=Actions&account=eosio.evm&scope=eosio.evm&limit=100&table=balances&action=withdraw)
并使用像这样的钱包签署交易 [锚](https://www.greymass.com/anchor).


## 设置矿工

＃＃＃ 安装

确保你有 `node` 安装在你的机器上。

推荐的版本是 [`18.16.0`](https://nodejs.org/en/download)，最低版本为 `16.16.0`.

#### 从 GitHub 获取矿工并安装所有依赖项

```bash
git clone https://github.com/eosnetworkfoundation/eos-evm-miner.git
cd eos-evm-miner
yarn
```

#### 你还需要设置你的环境变量
复制 `.env.example` 归档到 `.env` 并填写环境变量。

|名称 |说明 |默认 |
| --- | --- | --- |
| `PRIVATE_KEY` |矿工账户私钥 | |
| `MINER_ACCOUNT` | EOS 网络上的矿工账户名称 | |
| `RPC_ENDPOINTS` |要连接的 EOS RPC 端点列表，以逗号分隔 | |
| `PORT` |监听传入以太坊交易的端口 | `50305` |
| `LOCK_GAS_PRICE` |如果设置为 `true`，一旦设置了 gas 价格，该矿工将不会再次访问 EOS API 节点以获取新的 gas 价格 | `true`  |




### 开始挖矿

```bash
yarn mine
```

> 📄 **日志**：
>
> 一个 `logs` 目录在项目根目录中创建，包含两个日志文件：
> - **error.log**：只有错误日志
> - **combined.log**：其他一切





