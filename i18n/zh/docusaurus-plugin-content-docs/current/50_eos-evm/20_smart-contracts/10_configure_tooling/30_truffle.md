---
title: 松露
---

修改你的 `truffle-config.js` 将 EOS EVM 添加到 [松露](https://www.trufflesuite.com/):

```javascript
require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
    networks: {
        eosevm: {
            provider: new HDWalletProvider([process.env.PRIVATE_KEY], "https://api.evm.eosnetwork.com"),
            network_id: 17777,
        },
        eosevm_testnet: {
            provider: new HDWalletProvider([process.env.PRIVATE_KEY], "https://api.testnet.evm.eosnetwork.com"),
            network_id: 15557,
        },
        // ... other networks
    },
    // ... other config
```

### 安装依赖

您可能需要安装 `@truffle/hdwallet-provider` 和 `dotenv`:

```bash
npm install @truffle/hdwallet-provider dotenv
// or
yarn add @truffle/hdwallet-provider dotenv
```

