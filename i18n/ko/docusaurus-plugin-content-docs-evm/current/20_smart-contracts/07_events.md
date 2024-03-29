---
title: 이벤트
---

솔리디티에서의 이벤트는 블록체인에서 어떤 일이 발생했다는 사실을 컨트랙트가 앱에 전달하는 방법입니다.
프런트 엔드는 특정 이벤트를 수신하고 이벤트가 발생하면 조치를 취할 수 있습니다.

## 이벤트 선언

이벤트는 다음과 같이 선언됩니다. `event` 키워드를 입력하고 이벤트 이름, 매개변수 목록을 차례로 입력합니다.

```solidity
event MyEvent(bool _myParam);
```

## 이벤트 방출

이벤트는 다음과 함께 발생합니다. `emit` 키워드를 입력하고 이벤트 이름, 인수 목록을 차례로 입력합니다.

```solidity
emit MyEvent(true);
```

## 인덱싱 이벤트

이벤트를 인덱싱하여 인덱싱된 파라미터를 기준으로 이벤트를 필터링할 수 있습니다.

```solidity
event MyEvent(uint256 indexed _myParam);
```

> 💰 **인덱싱 비용**
>
> 인덱싱 이벤트는 인덱싱되지 않은 이벤트보다 가스 비용이 더 많이 듭니다.필터링하려는 이벤트만 인덱싱해야 합니다.
> 그렇지 않으면 계약 사용자에 대한 비용이 불필요하게 증가합니다.

