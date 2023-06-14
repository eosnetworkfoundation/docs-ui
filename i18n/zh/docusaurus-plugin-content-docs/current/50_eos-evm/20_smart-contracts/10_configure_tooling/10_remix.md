---
title: 混音IDE
---


这 [混音IDE](https://remix.ethereum.org/) 是一个流行的智能合约集成开发环境
用 Solidity 编程语言编写的开发。具有任何经验水平的任何开发人员都可以使用 Remix。
 
如果您想了解有关 Remix 的更多信息，可以访问他们的 [官方文档。](https://remix-ide.readthedocs.io/en/latest/)

##先决条件

如果你还没有，你需要 [连接你的 metamask 钱包](../../10_basic-setup/10_connect-metamask.md) 到
EOS EVM 主网或测试网。

您还需要在该网络上使用 EOS 令牌。如果你在测试网上，你可以前往 [龙头](https://faucet.testnet.evm.eosnetwork.com)
得到一些，如果你在主网上，你可以使用 [EOS EVM 桥](https://bridge.evm.eosnetwork.com/) 转移
EOS 代币从原生链到 EVM。

### 将 Remix IDE 连接到 EOS EVM

将 Remix IDE 连接到 EOS EVM 网络：

1. 点击 `Deploy & run transactions` 左侧垂直菜单上的按钮切换到 `Deploy & run transactions` 控制板。
2. 单击 `ENVIRONMENT` 下拉列表。
3. 从中选择 `Injected Provider - MetaMask` 选项。


！[重新混合部署并运行 trx](./images/remix_deploy_run_trx_panel.png)

成功选择后 `Injected Provider - MetaMask` 下拉列表中的选项， `ACCOUNT` 场地
填充您的钱包地址。记下它并确保它确实与您的地址相同
MetaMask 钱包。
