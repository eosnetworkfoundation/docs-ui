---
title: 안전모
---

[안전모](https://hardhat.org/) Ethereum 스마트 계약에 가장 널리 사용되는 개발 환경입니다.

안전모를 사용하여 스마트 계약을 EOS EVM에 배포하려면 `hardhat.config.js` 파일
다음 네트워크 구성:

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

이제 다음을 사용하여 메인넷 또는 테스트넷에 계약을 배포할 수 있습니다.

```bash
npx hardhat run scripts/deploy.js --network eosevm

// or for testnet
npx hardhat run scripts/deploy.js --network eosevm_testnet
```
