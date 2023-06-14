---
title: 스냅샷
---

스냅샷은 특정 시점의 블록체인 상태를 캡처한 것입니다. 여기에는 모든 변경 사항의 합계가 포함됩니다.
트랜잭션 실행에서 해당 시점까지 발생했습니다. 즉, 생성된 모든 계정, 컨트랙트 코드,
계약 데이터 및 블록체인에서 생성되거나 수정된 ​​기타 모든 것.

그러나 블록체인 기록은 포함되지 않습니다. 즉, 트랜잭션 자체는 포함되지 않습니다. 이것들
에 저장됩니다 `blocks.log` 파일.

## 새로운 노드 동기화

동기화 프로세스의 속도를 높이려면 스냅샷을 다운로드하여 노드로 가져올 수 있습니다. 이렇게 하면 건너뛸 수 있습니다.
그렇지 않으면 더 오래 걸릴 프로세스의 일부.

### 필수 구성

다음 플러그인이 활성화되어 있어야 합니다. `config.ini` 파일:

```ini
plugin = eosio::chain_plugin
plugin = eosio::chain_api_plugin
plugin = eosio::net_plugin
plugin = eosio::net_api_plugin
plugin = eosio::producer_plugin
plugin = eosio::producer_api_plugin
plugin = eosio::state_history_plugin
```

### 스냅샷 가져오기

다음은 최근 스냅샷을 다운로드할 수 있는 사이트입니다.

- [이오스네이션](https://snapshots.eosnation.io/)
- [EOS 스웨덴](https://snapshots-main.eossweden.org/)

### 시작하기 전에

노드의 `data/state` 예배 규칙서.

### 스냅샷 가져오기

이제 스냅샷을 노드로 가져올 수 있습니다.

```shell
nodeos --snapshot /path/to/snapshot.bin
```

> ⚠ **경고**
>
> 네트워크에서 최소 1개의 블록을 수신할 때까지 노드를 중지하지 마십시오. 그렇지 않으면 다시 시작할 수 없습니다.

### 노드가 블록 수신에 실패한 경우

nodeos가 네트워크에서 블록 수신에 실패하면 다음을 사용해 보십시오. `cleos net disconnect` 
그리고 `cleos net connect` 시간 초과된 노드를 다시 연결합니다.

> ⚠ **경고**
>
> 사용시 주의사항 `net_api_plugin`. 방화벽을 사용하여 액세스를 차단하거나 `http-server-address`, 또는 변경
> 그것을 `localhost:8888` 원격 액세스를 비활성화합니다.

### 데이터베이스 필러 사용

데이터베이스 필러를 사용하는 경우 다음을 찾아야 합니다. `Placing initial state in block <block_num>` 로그에.

그런 다음 다음 인수를 사용하여 필러를 시작할 수 있습니다.
```shell
... --fpg-create --fill-skip-to <block_num> --fill-trim
```

**이후 실행 시에는 `--fpg-create` 그리고 `--fill-skip-to` 인수.**


## 전체 상태 기록이 포함된 스냅샷 생성

스냅샷을 생성하면 노드 상태의 백업을 생성할 수 있습니다. 주기적으로 생성하려는 경우에 유용할 수 있습니다.
노드의 백업 또는 다른 사람과 공유할 스냅샷을 생성하려는 경우.

### 스냅샷 만들기

```shell
curl http://127.0.0.1:8888/v1/producer/create_snapshot
```

위의 명령은 `producer_api_plugin` 스냅샷을 생성합니다. 스냅샷은 다음 위치에 저장됩니다.
`data/snapshots` 예배 규칙서.

기다립니다 `nodeos` 스냅샷이 완료된 후 여러 블록을 처리합니다. 목표는 상태 기록 파일이
휴대용 스냅샷보다 최소 1개 더 많은 블록을 포함하고 `blocks.log` 다음에 블록을 포함할 파일
돌이킬 수 없게 되었습니다.

> ⚠ **경고**
>
> 휴대용 스냅샷에 포함된 블록이 분기되면 스냅샷은 무효가 됩니다. 이 경우 이 과정을 반복하십시오.

### 다른 파일 수집

위에서 만든 스냅샷에는 캡처 당시의 상태만 포함됩니다. 블록체인 기록은 포함되지 않습니다.

노드를 빠르게 동기화하는 데 사용할 수 있는 전체 패키지를 생성하려면 다음 파일을 수집해야 합니다.
- 내용 `data/state-history`
  - `chain_state_history.log`
  - `trace_history.log`
  - `chain_state_history.index` - 선택 사항: 이 파일이 없으면 복원하는 데 더 오래 걸립니다.
  - `trace_history.index` - 선택 사항: 이 파일이 없으면 복원하는 데 더 오래 걸립니다.
- 선택 사항: `data/blocks`, 그러나 제외 `data/blocks/reversible`


## 전체 상태 기록으로 스냅샷 복원

프로세스는 새 노드를 동기화하는 프로세스와 거의 동일합니다. 유일한 차이점은 복사해야 한다는 것입니다.
이전 섹션의 파일을 `data` 노드를 시작하기 전에 디렉토리.

포함하는 **선택 사항** 파일이 많을수록 노드가 더 빨리 동기화됩니다.

## 전체 상태 기록으로 재생/재동기화

노드를 재생하거나 다시 동기화하면 노드가 네트워크와 동기화됩니다. 하려는 경우에 유용합니다.
충돌 후 노드를 다시 동기화하십시오.

다음을 삭제할 수 있습니다. `data/state` 디렉토리를 사용하거나 `--replay-blockchain` 논쟁.

```shell
nodeos --replay-blockchain --snapshot /path/to/snapshot.bin
```
