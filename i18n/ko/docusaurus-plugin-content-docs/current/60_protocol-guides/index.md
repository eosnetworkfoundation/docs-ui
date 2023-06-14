---
title: 프로토콜 가이드
---

## 핵심

그만큼 `EOS Core` 에 대한 기본 빌딩 블록을 제공합니다. `system` 층. 그러나 스마트 계약으로 구현되지 않았기 때문에 동일한 수준의 유연성을 제공하지 않습니다. 그럼에도 불구하고, `core` 구현도 오픈 소스이므로 맞춤형 비즈니스 요구 사항에 맞게 수정할 수 있습니다.

핵심 프로토콜은 다음과 같습니다.

1. [합의 프로토콜](01_consensus-protocol.md)
2. [트랜잭션 프로토콜](02_transactions-protocol.md)
삼. [네트워크 또는 P2P 프로토콜](03_network-peer-protocol.md)

## 시스템

EOS 블록체인은 그 위에 구축된 블록체인의 기능과 특성이 유연하다는 점에서 독특합니다. 즉, 각 비즈니스 사례 요구 사항에 맞게 완전히 변경하거나 수정할 수 있습니다. 합의, 수수료 일정, 계정 생성 및 수정, 토큰 경제, 블록 생산자 등록, 투표, 다중 서명 등과 같은 핵심 블록체인 기능은 EOS 블록체인에 구축된 블록체인에 배포되는 스마트 계약 내에서 구현됩니다. 이러한 스마트 계약을 `system contracts` 그리고 레이어는 `EOS system` 레이어 또는 단순히 `system` 층.

EOS Network Foundation은 다음을 구현하고 유지합니다. `system contracts` 참조 구현으로만 EOS 기반 블록체인의 기본 기능을 캡슐화합니다. 그만큼 `system contracts` 아래에 나열되어 있습니다:

* [eosio.bios](https://github.com/eosnetworkfoundation/eos-system-contracts/tree/main/contracts/eosio.bios) - `eosio.bios` 계약은 블록체인을 초기화하는 데 사용되는 특수 계약입니다.
* [eosio.system](https://github.com/eosnetworkfoundation/eos-system-contracts/tree/main/contracts/eosio.system) - `eosio.system` 계약은 기본 EOS 블록체인 기능을 구현하는 핵심 계약입니다.
* [eosio.msig](https://github.com/eosnetworkfoundation/eos-system-contracts/tree/main/contracts/eosio.msig) - `eosio.msig` 계약은 다중 서명 기능을 구현합니다.
* [eosio.token](https://github.com/eosnetworkfoundation/eos-system-contracts/tree/main/contracts/eosio.token) - `eosio.token` 계약은 시스템 토큰 기능을 구현합니다.
* [eosio.wrap](https://github.com/eosnetworkfoundation/eos-system-contracts/tree/main/contracts/eosio.wrap) - `eosio.wrap` 계약은 거버넌스 기능을 구현합니다.
