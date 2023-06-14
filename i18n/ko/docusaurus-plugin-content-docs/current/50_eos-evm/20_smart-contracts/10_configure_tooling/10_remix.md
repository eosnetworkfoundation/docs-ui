---
title: 리믹스 IDE
---


그만큼 [리믹스 IDE](https://remix.ethereum.org/) 스마트 계약을 위한 대중적인 통합 개발 환경입니다.
Solidity 프로그래밍 언어로 작성된 개발. Remix는 모든 수준의 경험을 가진 모든 개발자가 사용할 수 있습니다.
 
Remix에 대해 자세히 알아보려면 [공식 문서.](https://remix-ide.readthedocs.io/en/latest/)

## 전제 조건

아직 하지 않았다면 다음을 수행해야 합니다. [메타마스크 지갑 연결](../../10_basic-setup/10_connect-metamask.md) ~로
EOS EVM 메인넷 또는 테스트넷.

또한 해당 네트워크에 EOS 토큰이 필요합니다. 테스트넷에 있는 경우 다음으로 이동할 수 있습니다. [수도꼭지](https://faucet.testnet.evm.eosnetwork.com)
일부를 얻으려면 메인넷에 있는 경우 다음을 사용할 수 있습니다. [EOS EVM 브리지](https://bridge.evm.eosnetwork.com/) 옮기다
네이티브 체인에서 EVM으로의 EOS 토큰.

### Remix IDE를 EOS EVM에 연결

Remix IDE를 EOS EVM 네트워크에 연결하려면:

1. 클릭 `Deploy & run transactions` 왼쪽 세로 메뉴의 버튼을 눌러 `Deploy & run transactions` 패널.
2. 클릭 `ENVIRONMENT` 드롭 다운 목록.
3. 에서 선택 `Injected Provider - MetaMask` 옵션.


![리믹스 배포 및 trx 실행](./images/remix_deploy_run_trx_panel.png)

성공적으로 선택한 직후 `Injected Provider - MetaMask` 드롭다운 목록의 옵션, `ACCOUNT` 필드
지갑 주소로 채워집니다. 그것을 기록하고 실제로 귀하의 주소와 동일한 주소인지 확인하십시오.
메타마스크 지갑.
