---
title: 테이블에서 데이터 읽기
---

## 전제 조건

이 가이드를 따르려면 다음이 필요합니다.

- EOS 블록체인과 작동 방식에 대한 이해.
- curl 명령을 실행하기 위한 명령줄 인터페이스입니다.
- EOS 노드 또는 EOS API 서비스에 대한 액세스.

## EOS 테이블

EOS는 데이터베이스 테이블과 유사한 테이블에 데이터를 저장합니다. 각 테이블에는 이름과 필드 집합이 있습니다. 테이블은 테이블을 생성한 스마트 계약에 의해 정의된 범위로 구성됩니다.

테이블에서 데이터를 검색하려면 해당 이름, 범위 및 이를 생성한 스마트 계약의 이름을 알아야 합니다. 반환되는 데이터의 양을 제한하기 위해 하한 및 상한을 지정할 수도 있습니다.

## EOS 테이블에서 데이터를 검색하는 방법

### get_table_rows 함수 사용

그만큼 `get_table_rows` 함수는 테이블에서 행을 검색합니다. JSON 형식의 다음 매개변수를 사용합니다.

- `"code"`: 테이블을 생성한 스마트 컨트랙트의 소유자인 eos 계정 이름.
- `"scope"`: 테이블의 범위, eos 계정 이름입니다.
- `"table"`: 테이블의 이름을 나타내는 문자열.
- `"json"`: (선택 사항) 행 결과를 JSON 형식 또는 이진 형식으로 반환할지 여부를 지정하는 부울 값이며 기본값은 이진입니다.
- `"lower_bound"`: (선택 사항) 테이블 키의 하한을 나타내는 문자열로, 기본값은 사용된 인덱스의 첫 번째 값입니다.
- `"upper_bound"`: (선택 사항) 테이블 키의 상한을 나타내는 문자열로, 기본값은 사용된 인덱스의 마지막 값입니다.
- `"index_position"`: (선택 사항) 테이블에 여러 인덱스가 있는 경우 사용할 인덱스 위치, 허용되는 값은 `primary`, `secondary`, `tertiary`, `fourth`, `fifth`, `sixth`, `seventh`, `eighth`, `ninth` , `tenth`, 기본값은 `primary`.
- `"key_type"`: (선택) 테이블 키의 유형을 나타내는 문자열, 지원되는 값 `i64`, `i128`, `i256`, `float64`, `float128`, `sha256`, `ripemd160`, `name`.
- `"encode_type"`: (선택 사항) key_type 매개변수의 인코딩된 유형을 나타내는 문자열입니다. `dec` 또는 `hex`, 기본값은 `dec`.
- `"limit"`: 반환되는 결과 수를 제한합니다. 기본값은 10입니다.
- `"time_limit_ms"`: (선택 사항) 결과를 검색하는 데 소요되는 최대 시간, 기본값은 10ms입니다.
- `"reverse"`: (옵션) if `true` 결과는 lower_bound에서 upper_bound를 향해 역순으로 검색되며 기본값은 다음과 같습니다. `false`.

다음은 다음에서 행을 검색하는 예입니다. `abihash` 가 소유한 테이블 `eosio` 계정과 `scope` 그만큼 `eosio` 이름.

```shell
curl --request POST \
--url https://eos.greymass.com/v1/chain/get_table_rows \
--header 'content-type: application/json' \
--data '{
"json": true,
"code": "eosio",
"scope": "eosio",
"table": "abihash",
"lower_bound": "eosio",
"limit": 3,
"reverse": false
}'
```

위의 예에서:

- 행 값은 다음에서 설정한 JSON으로 반환됩니다. `json` 매개변수.
- 테이블은 계정이 소유합니다. `eosio`, 에 의해 설정 `code` 매개변수.
- 테이블 범위는 `eosio`, 에 의해 설정 `scope` 매개변수.
- 테이블 이름은 `abihash.`, 에 의해 설정 `table` 매개변수.
- 쿼리는 기본 인덱스를 사용하여 행을 검색하고 `eosio` 하한 지수 값, `lower_bound` 매개변수.
- 함수는 최대 3개의 행을 가져옵니다. `limit` 매개변수.
- 검색된 행은 오름차순으로 설정되며 `reverse` 매개변수.

또는 다음을 사용하여 동일한 명령을 실행할 수 있습니다. `cleos` 유틸리티 도구이며 결과는 동일합니다.

```shell
dune -- cleos -u https://eos.greymass.com get table eosio eosio abihash --lower eosio --limit 3
```

#### get_table_rows 결과

반환된 JSON `get_table_rows` 다음과 같은 구조를 가집니다.

```json
{
  "rows": [
    { },
    ...
    { }
  ],
  "more": true,
  "next_key": ""
}
```

그만큼 `"rows"` field는 JSON 표현의 테이블 행 개체 배열입니다.
그만큼 `"more"` 필드는 반환된 행 외에 추가 행이 있음을 나타냅니다.
그만큼 `"next_key"` 필드에는 다음 행 집합을 검색하기 위한 다음 요청에서 하한값으로 사용할 키가 포함됩니다.

예를 들어 이전 섹션 명령의 결과에는 세 개의 행이 포함되어 있으며 아래와 유사합니다.

```json
{
  "rows": [
    {
      "owner": "eosio",
      "hash": "00e166885b16bcce50fea9ea48b6bd79434cb845e8bc93cf356ff787e445088c"
    },
    {
      "owner": "eosio.assert",
      "hash": "aad0ac9f3f3d8f71841d82c52080f99479e869cbde5794208c9cd08e94b7eb0f"
    },
    {
      "owner": "eosio.evm",
      "hash": "9f238b42f5a4be3b7f97861f90d00bbfdae03e707e5209a4c22d70dfbe3bcef7"
    }
  ],
  "more": true,
  "next_key": "6138663584080503808"
}
```

#### get_table_rows 페이지 매김

이전 명령에는 `"more"` 로 설정된 필드 `true`. 즉, 첫 번째 실행된 명령으로 반환되지 않은 사용된 필터와 일치하는 더 많은 행이 테이블에 있음을 의미합니다.

그만큼 `"next_key"`, `"lower_bound"` 그리고 `"upper_bound"` 필드는 EOS 블록체인의 모든 테이블에서 데이터의 페이지 매김 또는 반복 검색을 구현하는 데 사용할 수 있습니다.

다음 행 세트를 가져오려면 다른 행을 발행할 수 있습니다. `get_table_rows` 요청, 하한값을 `"next_key"` 필드:

```shell
curl --request POST \
--url https://eos.greymass.com/v1/chain/get_table_rows \
--header 'content-type: application/json' \
--data '{
"json": true,
"code": "eosio",
"scope": "eosio",
"table": "abihash",
"lower_bound": "6138663584080503808",
"limit": 3,
"reverse": false
}'
```

또는 다음을 사용하여 동일한 명령을 실행할 수 있습니다. `cleos` 유틸리티 도구이며 결과는 동일합니다.

```shell
dune -- cleos -u https://eos.greymass.com get table eosio eosio abihash --lower 6138663584080503808 --limit 3
```

위의 명령은 다음에서 후속 3개 행을 반환합니다. `abihash` 생산자 이름 값이 다음보다 큰 테이블 `"6138663584080503808"`. 이 프로세스를 반복하면 테이블의 모든 행을 검색할 수 있습니다.

두 번째 요청의 응답에 다음이 포함된 경우 `"more": false`, 필터와 일치하는 사용 가능한 모든 행을 가져왔으며 추가 요청이 필요하지 않음을 의미합니다.

### get_table_by_scope 함수 사용

목적 `get_table_by_scope` 주어진 아래의 테이블 이름을 스캔하는 것입니다 `code` 계정, 사용 `scope` 기본 키로. 예를 들어 테이블 이름을 이미 알고 있는 경우. `mytable`, 사용할 필요가 없습니다. `get_table_by_scope` 정의한 범위가 무엇인지 알고 싶지 않다면 `mytable` 테이블.

다음은 에서 지원하는 입력 매개변수입니다. `get_table_by_scope`:

- `"code"`: 테이블을 생성한 스마트 컨트랙트의 소유자인 eos 계정 이름.
- `"table"`: 테이블의 이름을 나타내는 문자열.
- `"lower_bound"` (선택 사항): 이 필드는 테이블 행을 쿼리할 때 범위의 하한을 지정합니다. 범위 값을 기준으로 행을 가져오기 위한 시작점을 결정합니다. 범위의 첫 번째 값이 기본값입니다.
- `"upper_bound"` (선택 사항): 이 필드는 테이블 행을 쿼리할 때 범위의 상한을 지정합니다. 범위 값을 기반으로 행을 가져오는 끝점을 결정합니다. 범위의 마지막 값이 기본값입니다.
- `"limit"` (선택 사항): 이 필드는 함수에서 반환할 최대 행 수를 나타냅니다. 단일 요청에서 검색된 행 수를 제어할 수 있습니다.
- `"reverse"` (선택사항): 만약 `true` 결과는 lower_bound에서 upper_bound를 향해 역순으로 검색되며 기본값은 다음과 같습니다. `false`.
- `"time_limit_ms"`: (선택 사항) 결과를 검색하는 데 소요되는 최대 시간, 기본값은 10ms입니다.

다음은 get_table_by_scope 함수에 대한 JSON 페이로드의 예입니다.

```json
{
  "code": "accountname1",
  "table": "tablename",
  "lower_bound": "accountname2",
  "limit": 10,
  "reverse": false,
}
```

위의 예에서:

- 테이블은 계정이 소유합니다. `accountname1`, 에 의해 설정 `code` 매개변수.
- 테이블 이름은 `tablename.`, 에 의해 설정 `table` 매개변수.
- 쿼리는 다음에서 시작합니다. `accountname2` 다음에 의해 설정된 범위 값 `lower_bound` 매개변수.
- 함수는 최대 10개의 행을 가져옵니다. `limit` 매개변수.
- 검색된 행은 오름차순으로 설정되며 `reverse` 매개변수.

#### get_table_by_scope 결과

그만큼 `get_table_by_scope` 지정된 범위 내의 테이블에 대한 정보가 포함된 JSON 객체를 반환합니다. 반환 JSON에는 다음 필드가 있습니다.

- `"rows"`: 이 필드에는 테이블 배열이 포함됩니다.
- `"more"`: 이 필드는 사용 가능한 결과가 더 있는지 여부를 나타냅니다. true로 설정하면 페이지 매김을 사용하여 가져올 수 있는 추가 행이 있음을 의미합니다. 추가 행을 검색하는 방법에 대한 자세한 내용은 이전 섹션을 참조하십시오.

각 테이블 행은 다음 필드를 포함하는 JSON 개체로 표시됩니다.

- `"code"`: 테이블을 소유한 계약의 계정 이름입니다.
- `"scope"`: 테이블이 있는 계약 내의 범위입니다. 계약 내의 특정 인스턴스 또는 범주를 나타냅니다.
- `"table"`: 계약 ABI에서 지정한 테이블의 이름입니다.
- `"payer"`: 행을 저장하기 위한 RAM 비용을 부담하는 지불인의 계정 이름입니다.
- `"count"`: 테이블의 행 수에 테이블이 정의한 인덱스 수(주 인덱스 포함)를 곱한 값입니다. 예를 들어 테이블에 정의된 기본 인덱스만 있는 경우 `count` 테이블의 행 수를 나타냅니다. 테이블에 대해 정의된 각 추가 보조 인덱스에 대해 개수는 N을 곱한 행 수를 나타냅니다. 여기서 N = 1 + 보조 인덱스 수입니다.

##### 빈 결과

반환된 JSON이 아래와 같을 수 있습니다.

```json
{
    "rows":[],
    "more": "accountname"
}
```

위의 결과는 블록체인 구성에 의해 부과된 트랜잭션 시간 제한으로 인해 요청이 실행을 완료하지 않았음을 의미합니다. 결과는 테이블을 찾지 못했다는 것을 알려줍니다(`rows` 필드가 비어 있음) 지정된 `lower_bound` ~로 `"accountname"` 경계. 이 경우 다음을 사용하여 요청을 다시 실행해야 합니다. `lower_bound` 에서 제공하는 값으로 설정 `"more"` 필드, 이 경우 `accountname`.

#### 실제 예

실제 예를 들어 이름이 지정된 처음 세 테이블을 나열할 수 있습니다. `accounts` 가 소유한 `eosio.token` 하한 범위로 시작하는 계정 `eosromania`:

```shell
curl --request POST \
--url https://eos.greymass.com/v1/chain/get_table_by_scope \
--header 'content-type: application/json' \
--data '{
"json": true,
"code": "eosio.token",
"table": "accounts",
"lower_bound": "eosromania",
"upper_bound": "",
"reverse": false,
"limit": "3"
}'
```

결과는 아래와 비슷합니다.

```json
{
  "rows": [
    {
      "code": "eosio.token",
      "scope": "eosromania22",
      "table": "accounts",
      "payer": "tigerchainio",
      "count": 1
    },
    {
      "code": "eosio.token",
      "scope": "eosromaniaro",
      "table": "accounts",
      "payer": "gm3tqmrxhage",
      "count": 1
    },
    {
      "code": "eosio.token",
      "scope": "eosromansev1",
      "table": "accounts",
      "payer": "gateiowallet",
      "count": 1
    }
  ],
  "more": "eosromario11"
}
```
