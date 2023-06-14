---
title: EVM 호환성
---

EOS EVM은 모든 사전 컴파일 및 opcode를 포함하여 Ethereum EVM 사양과 완벽하게 호환됩니다. 그러나 몇 가지 주요 EOS EVM 차이점이 있습니다.

## 중첩 호출 제한

EOS EVM 계약의 제한으로 인해 EOS EVM은 현재 최대 5개의 중첩 호출을 지원합니다. EOS EVM 팀은 이 숫자를 늘리기 위해 디자인을 계속 최적화할 것입니다.

## 예약된 주소

12로 시작하는 EVM 주소 `0xbb` 바이트, 예: `0xbbbbbbbbbbbbbbbbbbbbbbbb5530ea015b900000`, EVM 내에서 네이티브 EOS와 EOS 사이를 연결하기 위해 예약되어 있습니다. 값과 함께 이러한 주소로 메시지를 보내면 다양한 브리지 규칙에 따라 브리지 트랜잭션이 시작되거나 트랜잭션이 중단될 수 있습니다.

또한 가능성은 낮지만 예약된 주소를 생성하는 컨트랙트 생성도 트랜잭션을 중단합니다.

## 프리컴파일

EOS EVM은 이더리움이 지원하는 모든 프리컴파일을 지원하며 다음과 같은 조항이 있습니다.

### `modexp (0x05)`

그만큼 `exponent` 비트 크기는 다음 중 하나를 초과할 수 없습니다. `base` 비트 크기 또는 `modulus` 비트 크기.

> ℹ️ 충족되지 않은 한도
위의 제한이 충족되지 않으면 사전 컴파일에서 예외가 발생하고 트랜잭션이 중지됩니다.

## 연산 코드

### `BLOCKHASH (0x40)`

이 opcode는 현재 지정된 블록 내용의 해시를 반환하지 않고 대신 지정된 블록 높이의 해시와 체인 ID를 반환합니다.

`block_hash = sha256( msg(block_height, chain_id) )`

어디:
* `block_height`: 지정된 64비트 블록 높이
* `chain_id`: 64비트 솔트 값으로 사용
* `msg`: 선행 0바이트(0x00) 상수의 연결, `block_height`, 그리고 `chain_id`, 빅 엔디안 형식입니다.

> ℹ️ 버전 바이트
해시의 선행 0바이트는 향후 새로운 블록해시 체계가 도입되면 변경될 수 있는 버전 바이트입니다.

### `COINBASE (0x41)`

이 opcode는 EOS EVM 계약 계정의 주소를 반환합니다. `eosio.evm`. 현재 주소는 `0xbbbbbbbbbbbbbbbbbbbbbbbb5530ea015b900000`.

### `DIFFICULTY (0x44)`

기본 EOS 합의 프로토콜에는 해시 난이도가 없기 때문에 이 opcode는 현재 기본적으로 1(일)을 반환합니다.

### `GASLIMIT (0x45)`

이 opcode는 현재 반환합니다. `0x7FFFFFFFFFF` (2^43-1)은 EOS EVM의 최대 가스 한도입니다.
