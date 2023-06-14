---
title: "V1 역사 대안"
sidebar_position: 1
---

최신 EOS v3.1 릴리스는 레거시 V1 히스토리 플러그인에 대한 지원을 공식적으로 종료합니다. 따라서 V1 히스토리에 의존하는 통합이 있는 블록 생산자와 노드 운영자는 대안을 찾아야 합니다.

## 생산 준비 대안

다음 전투 테스트 및 V1 준수 기록 솔루션을 사용할 수 있습니다.
- 하이페리온 히스토리 솔루션
- Roborovski 히스토리 API

# 로보로브스키 히스토리 API

## 개요

Roborovski History API는 V1 history API를 즉시 대체하도록 설계되었습니다. 추적 API 플러그인을 사용하여 기록 데이터를 추출한 다음 클라이언트 요청에 다시 제공하기 전에 V1 형식으로 압축합니다.

## Roborovski History API를 실행하는 사람

Roborovski History API는 다음에 의해 구현되고 실행됩니다. [그레이매스 주식회사](https://greymass.com/)

## Roborovski History API가 안전한 이유

Roborovski History API는 [그레이매스 주식회사](https://greymass.com/) EOS, WAX, TELOS, PROTON, FIO 및 기타 EOS 기반 체인의 신뢰할 수 있고 안정적인 블록 생산자 및 지갑 개발자(앵커) 회사입니다.

## 호스팅 솔루션과 관련된 위험 이해

호스팅된 솔루션에 의존하는 경우 제어할 수 없는 데이터 및 프로세스의 정확성에 의존하는 것입니다. 따라서 애플리케이션이 온체인 데이터에 크게 의존하는 경우 자체 히스토리 솔루션을 호스팅하는 것이 좋습니다. 그러나 Roborovsky는 현재 비공개 소스이므로 자체 노드를 실행하려면 아래 Hyperion을 참조해야 합니다.

## Roborovski 히스토리 API 및 V1 히스토리 표준

Roborovski 히스토리 API는 V1 히스토리 API 표준을 준수합니다. 또한 표준 기능 위에 두 가지 기능을 더 추가합니다.

기존 V1 History Plugin 통합자는 현재 API URL을 Greymass의 URL로 교체하기만 하면 완벽하게 작동합니다.

## API 참조

### 연결 방법

Roborovski 기록 API 연결 끝점은 다음과 같습니다. `https://eos.greymass.com`

### 함수 목록

- Get Actions(V1 호환 가능)
    - 우편 `https://eos.greymass.com/v1/history/get_actions`
- 트랜잭션 가져오기(V1 호환)
    - 우편 `https://eos.greymass.com/v1/history/get_transaction`
- 트랜잭션 가져오기(V1이 아닌 새로운 방법)
    - 얻다 `https://eos.greymass.com/v1/history/get_transaction?id=<TXID>`
- Get Actions(V1이 아닌 새로운 방법)
    - 얻다 `https://eos.greymass.com/v1/history/get_actions?account_name=<NAME>`

### 성능 수치

지금까지 관찰되고 측정된 바와 같이 Roborovski History API는 초당 최소 50개의 요청을 지원합니다. 이 제한은 낮은 부하로 정의되며 솔루션은 더 많은 것을 처리할 수 있지만 현재 더 높은 특정 제한은 알려져 있지 않습니다.


Hyperion 히스토리 솔루션
# 하이페리온 히스토리 솔루션

## 개요

Hyperion History는 EOS 기반 블록체인 기록 데이터를 인덱싱, 저장 및 검색하기 위한 전체 기록 솔루션입니다. 블록체인에 저장된 작업, 트랜잭션 및 블록에 대한 데이터 쿼리 지원을 제공하기 위해 노드 운영자가 배포할 수 있습니다.

Hyperion History API는 V2 및 V1(레거시 기록 플러그인) 끝점을 모두 제공합니다. 따라서 V1 기록을 완전히 준수합니다.

## Hyperion을 안전하게 만드는 요소

Hyperion은 EOS Rio(https://eosrio.io/hyperion/)에서 개발 및 유지 관리하며 모든 Antelope 공용 네트워크(EOS, WAX, TELOS, PROTON, FIO 등)에서 전투 테스트를 거쳤습니다.

* 깃허브: https://github.com/eosrio/Hyperion-History-API
* 문서: https://hyperion.docs.eosrio.io/

## 설치

로 이동 [하이페리온 문서](https://hyperion.docs.eosrio.io/) 설치 지침.
