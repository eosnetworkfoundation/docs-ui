---
title: 安全帽
---

[安全帽](https://hardhat.org/) 是以太坊智能合约使用最广泛的开发环境。

如果您想使用 hardhat 将智能合约部署到 EOS EVM，请更新您的 `hardhat.config.js` 文件
使用以下网络配置：

```javascript
// mainnet
const config: HardhatUserConfig = {
    // ...

    networks: {
        eosevm: {
            url: "https://api.evm.eosnetwork.com",
            accounts:[process.env.PRIVATE_KEY],
        },
        eosevm_testnet: {
            url: "https://api.testnet.evm.eosnetwork.com",
            accounts:[process.env.PRIVATE_KEY],
        }
    }
};
```

现在您可以使用以下方法将合约部署到主网或测试网：

```bash
npx hardhat run scripts/deploy.js --network eosevm

// or for testnet
npx hardhat run scripts/deploy.js --network eosevm_testnet
```
