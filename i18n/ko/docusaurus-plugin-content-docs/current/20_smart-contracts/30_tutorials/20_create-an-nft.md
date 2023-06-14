---
title: NFT 생성
---

NFT는 **대체 불가능한 토큰**입니다. 이는 고유한 토큰을 의미합니다.
다른 토큰으로 교환됩니다.

수집 가능한 항목(유명인이 소유한 펜, 게임 우승 공 등)을 예로 들어 보겠습니다. 이들 각각
항목은 고유하며 값이 다르기 때문에 다른 항목과 교환할 수 없습니다.
그들의 독창성.

> 👀 **NFT를 생성하고 싶으신가요?**
>
> 이 튜토리얼에서는 Ethereum의 ERC721을 따르는 NFT 생성에 대해 논의할 것입니다.
> 표준을 사용하여 명확한 표준을 사용하여 일부 EOS 개발을 파헤칠 수 있습니다.
>
> **단**, NFT를 생성하려는 경우 [**원자 자산**](https://github.com/pinknetworkx/atomicassets-contract) 표준
> EOS 네트워크에서 더 일반적입니다. [아토믹 자산 NFT 생성기](https://eos.atomichub.io/creator)
> 코드를 배포하지 않고 AtomicHub 시장에 즉시 나열되는 NFT를 쉽게 만들 수 있습니다.

## NFT 표준이란 무엇입니까?

NFT 표준은 모든 NFT가 따라야 하는 일련의 규칙입니다. 이를 통해 NFT는
다른 NFT와 상호 운용 가능하며 마켓플레이스 및 지갑과 같은 애플리케이션에서
그들과 상호 작용하는 방법을 이해하십시오.

## ERC721 표준이 무엇인가요?

그만큼 [ERC721 표준](https://eips.ethereum.org/EIPS/eip-721) Ethereum 커뮤니티에서 만든 NFT 표준입니다. 그것
가장 일반적인 NFT 표준이며 Ethereum 네트워크의 많은 NFT에서 사용됩니다. 만약 당신이
Bored Ape를 본 적이 있다면 ERC721 NFT입니다.

![지루한 유인원 클럽 예](./images/boredapeclub.jpg)

## 개발 환경

당신이 가지고 있는지 확인 [모래 언덕](../../20_smart-contracts/10_getting-started/10_dune-guide.md) 설치된
계약을 체결하는 방법을 이해합니다.

각 단계가 끝나면 계약을 컴파일하고 오류가 있는지 확인해야 합니다.

## 새 계약 만들기

새로 만들기 `nft.cpp` 파일을 만들고 다음 코드를 추가합니다.

```cpp
#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include <eosio/singleton.hpp>
using namespace eosio;

CONTRACT nft : public contract {

    public:
    using contract::contract;
    
    // TODO: Add actions
};
```

## 액션 만들기

우리가 보면 [ERC721 표준](https://eips.ethereum.org/EIPS/eip-721), 우리는 그것을 볼 수 있습니다
구현해야 할 몇 가지 작업이 있습니다. 전반적으로 표준은 매우 간단하지만
일부 개념은 반드시 EOS 네이티브가 아닙니다. 예를 들어, 개념이 없습니다.
~의 `approvals` 다른 계정으로 직접 토큰을 보낼 수 있기 때문에 EOS에서(통해 `on_notify` 이벤트), 이더리움과는 다릅니다.

가능한 한 원본에 가까운 표준을 유지하기 위해 우리는 구현할 것입니다.
이 자습서의 기본이 아닌 개념.

우리가 시행할 조치는 다음과 같습니다.

```cpp
    ACTION mint(name to, uint64_t token_id){
    
    }
    
    ACTION transfer(name from, name to, uint64_t token_id, std::string memo){
    
    }
    
    [[eosio::action]] uint64_t balanceof(name owner){
    
    }
    
    [[eosio::action]] name ownerof(uint64_t token_id){
    
    }
    
    ACTION approve(name to, uint64_t token_id){
    
    }
    
    ACTION approveall(name from, name to, bool approved){
    
    }
    
    [[eosio::action]] name getapproved(uint64_t token_id){
    
    }
    
    [[eosio::action]] bool approved4all(name owner, name approved_account){
    
    }
    
    [[eosio::action]] std::string gettokenuri(uint64_t token_id){
    
    }
    
    ACTION setbaseuri(std::string base_uri){
    
    }
```

이를 계약에 추가한 다음 각 작업을 자세히 살펴보고 수행하는 작업과 수행하는 매개변수를 살펴보겠습니다.

반환 값이 있는 작업이 `[[eosio::action]]` 대신에
~의 `ACTION`.

> ❔ **액션 매크로**
>
> `ACTION` 라고 불리는 것입니다 `MACRO`, 대체될 코드를 작성하는 방법입니다.
> 컴파일 타임에 다른 코드와 함께. 이 경우, `ACTION` 매크로는 다음으로 대체됩니다.
> ```cpp
> [[eosio::action]] void
>
```
> 우리가 사용할 수 없는 이유 `ACTION` 값을 반환하는 작업에 대한 매크로는
> 그것은 추가 `void` 아무 것도 반환하지 않음을 의미합니다.

## 액션 파라미터 파헤치기

매개변수에 대한 자세한 설명과 간단한 설명을 원하시면
각 작업을 수행하려면 아래 섹션을 확장하세요.

<상세>
    <summary>보려면 여기를 클릭하십시오</summary>

### 민트

그만큼 `mint` 액션은 새로운 NFT를 생성하는 데 사용됩니다.

다음 두 가지 매개변수를 사용합니다.
- **to** - NFT를 소유할 계정
- **token_id** - NFT의 ID

### 옮기다

그만큼 `transfer` 액션은 한 계정에서 다른 계정으로 NFT를 전송하는 데 사용됩니다.

다음 네 가지 매개변수를 사용합니다.
- **from** - 현재 NFT를 소유하고 있는 계정
- **to** - NFT를 소유할 계정
- **token_id** - NFT의 ID
- **memo** - 트랜잭션에 포함될 메모

### 밸런스오브

그만큼 `balanceof` 작업은 계정의 잔액을 가져오는 데 사용됩니다.

하나의 매개변수를 사용합니다.
- **소유자** - 잔액을 받으려는 계정

그것은 `uint64_t` 계정의 잔액입니다.

### 소유자

그만큼 `ownerof` action은 NFT의 소유자를 얻는 데 사용됩니다.

하나의 매개변수를 사용합니다.
- **token_id** - NFT의 ID

그것은 `name` NFT를 소유한 계정입니다.

### 승인하다

그만큼 `approve` 작업은 귀하를 대신하여 NFT를 전송하기 위해 계정을 승인하는 데 사용됩니다.

다음 두 가지 매개변수를 사용합니다.
- **to** - NFT 전송이 승인될 계정
- **token_id** - NFT의 ID

### 모두 승인

그만큼 `approveall` 작업은 귀하를 대신하여 귀하의 모든 NFT를 전송하기 위해 계정을 승인하는 데 사용됩니다.

다음 세 가지 매개변수를 사용합니다.
- **from** - 현재 NFT를 소유하고 있는 계정
- **to** - NFT 전송이 승인될 계정
- **approved** - 계정 승인 여부를 결정하는 부울

### 승인받기

그만큼 `getapproved` 작업은 귀하를 대신하여 NFT를 전송하도록 승인된 계정을 얻는 데 사용됩니다.

하나의 매개변수를 사용합니다.
- **token_id** - NFT의 ID

그것은 `name` NFT 전송이 승인된 계정입니다.

### IsApprovedForAll

그만큼 `approved4all` 조치는 계정이 귀하를 대신하여 모든 NFT를 전송하도록 승인되었는지 확인하는 데 사용됩니다.

다음 두 가지 매개변수를 사용합니다.
- **소유자** - 현재 NFT를 소유하고 있는 계정
- **approved_account** - NFT 전송 승인 여부를 확인하려는 계정

그것은 `bool` 그것은 `true` 계정이 NFT를 전송하도록 승인된 경우 `false` 그렇지 않은 경우.

### 토큰URI

그만큼 `gettokenuri` action은 NFT 메타데이터의 URI를 가져오는 데 사용됩니다.

하나의 매개변수를 사용합니다.
- **token_id** - NFT의 ID

그것은 `std::string` NFT 메타데이터의 URI입니다.

### SetBaseURI

그만큼 `setbaseuri` action은 NFT 메타데이터의 기본 URI를 설정하는 데 사용됩니다.

하나의 매개변수를 사용합니다.
- **base_uri** - NFT 메타데이터의 기본 URI
    
</세부 사항>


## 데이터 구조 추가

이제 작업을 수행했으므로 NFT를 저장하기 위해 일부 데이터 구조를 추가해야 합니다.

우리는 `singleton` NFT를 저장합니다.

> ❔ **싱글톤**
>
> 에이 `singleton` 테이블과 달리 범위당 하나의 행만 가질 수 있는 테이블입니다. `multi_index` 어느
> 범위당 여러 행을 가질 수 있으며 `primary_key` 각 행을 식별합니다.
> 싱글톤은 이더리움의 스토리지 모델에 조금 더 가깝습니다.

작업 위의 계약에 다음 코드를 추가합니다.

```cpp
    using _owners = singleton<"owners"_n, name>;
    using _balances = singleton<"balances"_n, uint64_t>;
    using _approvals = singleton<"approvals"_n, name>;
    using _approvealls = singleton<"approvealls"_n, name>;
    using _base_uris = singleton<"baseuris"_n, std::string>;
    
    ACTION mint...
```

다음에 대한 싱글톤 테이블을 만들었습니다.
- **_owners** - 토큰 ID에서 NFT 소유자로의 매핑
- **_balances** - 소유주에서 소유한 NFT 금액으로의 매핑
- **_approvals** - 토큰 ID에서 해당 NFT를 전송하도록 승인된 계정으로의 매핑
- **_approvealls** - 소유자에서 모든 NFT를 전송하도록 승인된 계정으로의 매핑
- **_base_uris** - NFT 메타데이터의 기본 URI를 저장하는 구성 테이블

> ❔ **테이블 이름 지정**
>
> `singleton<"<TABLE NAME>"_n, <ROW TYPE>>`
>
> 싱글톤 정의를 보면 큰따옴표 안에 테이블 이름이 있습니다.
> EOS 테이블의 이름도 계정 이름 규칙을 따라야 합니다.
> 12자 이하이며 해당 문자만 포함할 수 있습니다. `a-z`, `1-5`, 그리고 `.`.

이제 NFT에 대한 데이터를 저장할 테이블과 구조를 만들었으므로
각 작업에 대한 논리 채우기를 시작할 수 있습니다.


## 일부 도우미 기능 추가

우리는 코드를 더 읽기 쉽고 쉽게 만들 수 있는 도우미 함수를 원합니다.
사용. 테이블 정의 바로 아래 계약에 다음 코드를 추가합니다.

```cpp
    using _base_uris = singleton<"baseuris"_n, std::string>;
    
    // Helper function to get the owner of an NFT
    name get_owner(uint64_t token_id){
        
        // Note that we are using the "token_id" as the "scope" of this table.
        // This lets us use singleton tables like key-value stores, which is similar
        // to how Ethereum contracts store data.
        
        _owners owners(get_self(), token_id);
        return owners.get_or_default(name(""));
    }
    
    // Helper function to get the balance of an account
    uint64_t get_balance(name owner){
        _balances balances(get_self(), owner.value);
        return balances.get_or_default(0);
    }
    
    // Helper function to get the account that is approved to transfer an NFT on your behalf
    name get_approved(uint64_t token_id){
        _approvals approvals(get_self(), token_id);
        return approvals.get_or_default(name(""));
    }
    
    // Helper function to get the account that is approved to transfer all of your NFTs on your behalf
    name get_approved_all(name owner){
      _approvealls approvals(get_self(), owner.value);
      return approvals.get_or_default(name(""));
   }
    
    // Helper function to get the URI of the NFT's metadata
    std::string get_token_uri(uint64_t token_id){
        _base_uris base_uris(get_self(), get_self().value);
        return base_uris.get_or_default("") + "/" + std::to_string(token_id);
    }
```

도우미 함수를 사용하면 이전에 만든 테이블에서 데이터를 더 쉽게 가져올 수 있습니다.
다음에 구현할 작업에서 이러한 기능을 사용할 것입니다.

특히 일부 기능은 여러 곳에서 사용되므로
그들을 위한 도우미 기능을 만듭니다. 예를 들어, `get_owner` 기능이 사용됩니다
에서 `mint`, `transfer`, 그리고 `approve` 행위. 헬퍼 함수를 ​​만들지 않았다면
이를 위해서는 각 작업에서 동일한 코드를 작성해야 합니다.

## 액션 채우기

각 작업을 살펴보고 이에 대한 논리를 구현합니다. 세심한 주의를 기울이십시오
주석은 각 코드 행의 기능을 설명합니다.

### 민트

그만큼 `mint` 액션은 새로운 NFT를 생성하는 데 사용됩니다.

```cpp
    ACTION mint(name to, uint64_t token_id){
        // We only want to mint NFTs if the action is called by the contract owner
        check(has_auth(get_self()), "only contract can mint");
        
        // The account we are minting to must exist
        check(is_account(to), "to account does not exist");
        
        // Get the owner singleton
        _owners owners(get_self(), token_id);
        
        // Check if the NFT already exists
        check(owners.get_or_default().value == 0, "NFT already exists");
        
        // Set the owner of the NFT to the account that called the action
        owners.set(to, get_self());
        
        // Get the balances table
        _balances balances(get_self(), to.value);
        
        // Set the new balances of the account
        balances.set(balances.get_or_default(0) + 1, get_self());
    }
```


### 옮기다

그만큼 `transfer` 액션은 한 계정에서 다른 계정으로 NFT를 전송하는 데 사용됩니다.

```cpp
    ACTION transfer(name from, name to, uint64_t token_id, std::string memo){
        // The account we are transferring from must authorize this action
        check(has_auth(from), "from account has not authorized the transfer");
        
        // The account we are transferring to must exist
        check(is_account(to), "to account does not exist");
        
        // The account we are transferring from must be the owner of the NFT
        // or allowed to transfer it through an approval
        bool ownerIsFrom = get_owner(token_id) == from;
        bool fromIsApproved = get_approved(token_id) == from;
        check(ownerIsFrom || fromIsApproved, "from account is not the owner of the NFT or approved to transfer the NFT");       
        
        // Get the owner singleton
        _owners owners(get_self(), token_id);
        
        // Set the owner of the NFT to the "to" account
        owners.set(to, get_self());
        
        // Set the new balance for the "from" account
        _balances balances(get_self(), from.value);
        balances.set(balances.get_or_default(0) - 1, get_self());
        
        // Set the new balance for the "to" account
        _balances balances2(get_self(), to.value);
        balances2.set(balances2.get_or_default(0) + 1, get_self());
        
        // Remove the approval for the "from" account
        _approvals approvals(get_self(), token_id);
        approvals.remove();
        
        // Send the transfer notification
        require_recipient(from);
        require_recipient(to);
    }
```

### 밸런스오브

그만큼 `balanceof` 작업은 계정의 잔액을 가져오는 데 사용됩니다.

```cpp
    [[eosio::action]] uint64_t balanceof(name owner){
        return get_balance(owner);
    }
```

> ⚠ **반환 값 및 결합 가능성**
>
> 리턴 값은 블록체인 외부에서만 사용 가능하며, 현재 사용 불가
> 스마트 컨트랙트 결합성을 위해 EOS에서. EOS 지원 [**인라인 작업**](../10_getting-started/40_smart-contract-basics.md#inline-actions) 사용할 수 있는
> 다른 스마트 계약을 호출하지만 값을 반환할 수 없습니다.

### 소유자

그만큼 `ownerof` action은 NFT의 소유자를 얻는 데 사용됩니다.

```cpp
    [[eosio::action]] name ownerof(uint64_t token_id){
        return get_owner(token_id);
    }
```

### 승인하다

그만큼 `approve` 작업은 귀하를 대신하여 NFT를 전송하기 위해 계정을 승인하는 데 사용됩니다.

```cpp
    ACTION approve(name to, uint64_t token_id){
        // get the token owner
        name owner = get_owner(token_id);
        
        // The owner of the NFT must authorize this action
        check(has_auth(owner), "owner has not authorized the approval");
    
        // The account we are approving must exist
        check(is_account(to), "to account does not exist");
        
        // Get the approvals table
        _approvals approvals(get_self(), token_id);
        
        // Set the approval for the NFT
        approvals.set(to, get_self());
    }
```

### 모두 승인

그만큼 `approveall` 조치는 계정을 승인하는 데 사용됩니다.
귀하를 대신하여 NFT.

```cpp
    ACTION approveall(name from, name to, bool approved){
        // The owner of the NFTs must authorize this action
        check(has_auth(from), "owner has not authorized the approval");
        
        // The account we are approving must exist
        check(is_account(to), "to account does not exist");
        
        // Get the approvals table
        _approvealls approvals(get_self(), from.value);
        
        if(approved){
            // Set the approval for the NFT
            approvals.set(to, get_self());
        } else {
            // Remove the approval for the NFT
            approvals.remove();
        }
    }
```

### 승인받기

그만큼 `getapproved` 작업은 전송하도록 승인된 계정을 가져오는 데 사용됩니다.
귀하를 대신하여 NFT.

```cpp
    [[eosio::action]] name getapproved(uint64_t token_id){
        return get_approved(token_id);
    }
```

### 승인됨4모두

그만큼 `approved4all` 작업은 계정이 이전하도록 승인되었는지 확인하는 데 사용됩니다.
귀하를 대신하여 귀하의 모든 NFT.

```cpp
    [[eosio::action]] bool approved4all(name owner, name approved_account){
      return get_approved_all(owner) == approved_account;
   }
```

> ⚠ **ACTION 이름 제한**
>
> 계정 이름도 테이블 이름과 동일한 제한이 있으므로 다음을 포함할 수 있습니다.
> 캐릭터 `a-z`, `1-5`, 그리고 `.`. 이 때문에 표준을 사용할 수 없습니다. `isApprovedForAll`
> 작업의 이름이므로 사용하고 있습니다. `approved4all` 대신에.

### 토큰URI

그만큼 `tokenuri` action은 NFT의 URI를 가져오는 데 사용됩니다.

```cpp
    [[eosio::action]] std::string tokenuri(uint64_t token_id){
        return get_token_uri(token_id);
    }
```

### SetBaseURI

그만큼 `setbaseuri` action은 NFT의 기본 URI를 설정하는 데 사용됩니다.

```cpp
    ACTION setbaseuri(std::string base_uri){
        // The account calling this action must be the contract owner
        require_auth(get_self());
        
        // Get the base URI table
        _base_uris base_uris(get_self(), get_self().value);
        
        // Set the base URI
        base_uris.set(base_uri, get_self());
    }
```



## 함께 모아서

이제 모든 작업을 배치했으므로 모든 작업을 `nft.cpp` 파일.

아래의 전체 계약을 살펴보기 전에 직접 계약을 구축, 배포 및 상호 작용해야 합니다.
먼저 귀하가 관리하는 계정에 일부 NFT를 생성해야 합니다. 그런 다음 다른 계정으로 전송해 볼 수 있습니다.

귀하를 대신하여 NFT를 전송하도록 다른 계정을 승인하여 승인 메커니즘을 테스트할 수도 있습니다.
그런 다음 승인된 계정을 사용하여 다른 계정으로 이체합니다.

<상세>
    <summary>전체 계약을 보려면 여기를 클릭하십시오.</summary>

```cpp
#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include <eosio/singleton.hpp>
using namespace eosio;

CONTRACT nft : public contract {

   public:
   using contract::contract;

   // Mapping from token ID to owner
   using _owners = singleton<"owners"_n, name>;
   
   // Mapping owner address to token count
   using _balances = singleton<"balances"_n, uint64_t>;
   
   // Mapping from token ID to approved address
   using _approvals = singleton<"approvals"_n, name>;
   
   // Mapping from owner to operator approvals
   using _approvealls = singleton<"approvealls"_n, name>;
   
   // Registering the token URI
   using _base_uris = singleton<"baseuris"_n, std::string>;

   // Helper function to get the owner of an NFT
   name get_owner(uint64_t token_id){
      _owners owners(get_self(), token_id);
      return owners.get_or_default(name(""));
   }
   
   // Helper function to get the balance of an account
   uint64_t get_balance(name owner){
      _balances balances(get_self(), owner.value);
      return balances.get_or_default(0);
   }
   
   // Helper function to get the account that is approved to transfer an NFT on your behalf
   name get_approved(uint64_t token_id){
      _approvals approvals(get_self(), token_id);
      return approvals.get_or_default(name(""));
   }
   
   // Helper function to get the account that is approved to transfer all of your NFTs on your behalf
   name get_approved_all(name owner){
      _approvealls approvals(get_self(), owner.value);
      return approvals.get_or_default(name(""));
   }
   
   // Helper function to get the URI of the NFT's metadata
   std::string get_token_uri(uint64_t token_id){
      _base_uris base_uris(get_self(), get_self().value);
      return base_uris.get_or_default("") + "/" + std::to_string(token_id);
   }
   
   ACTION mint(name to, uint64_t token_id){
      // We only want to mint NFTs if the action is called by the contract owner
      check(has_auth(get_self()), "only contract can mint");

      // The account we are minting to must exist
      check(is_account(to), "to account does not exist");

      // Get the owner singleton
      _owners owners(get_self(), token_id);

      // Check if the NFT already exists
      check(owners.get_or_default().value == 0, "NFT already exists");

      // Set the owner of the NFT to the account that called the action
      owners.set(to, get_self());

      // Get the balances table
      _balances balances(get_self(), to.value);

      // Set the new balances of the account
      balances.set(balances.get_or_default(0) + 1, get_self());
   }
   
   ACTION transfer(name from, name to, uint64_t token_id, std::string memo){
      // The account we are transferring from must authorize this action
      check(has_auth(from), "from account has not authorized the transfer");

      // The account we are transferring to must exist
      check(is_account(to), "to account does not exist");

      // The account we are transferring from must be the owner of the NFT
      // or allowed to transfer it through an approval
      bool ownerIsFrom = get_owner(token_id) == from;
      bool fromIsApproved = get_approved(token_id) == from;
      check(ownerIsFrom || fromIsApproved, "from account is not the owner of the NFT or approved to transfer the NFT");       

      // Get the owner singleton
      _owners owners(get_self(), token_id);

      // Set the owner of the NFT to the "to" account
      owners.set(to, get_self());

      // Set the new balance for the "from" account
      _balances balances(get_self(), from.value);
      balances.set(balances.get_or_default(0) - 1, get_self());

      // Set the new balance for the "to" account
      _balances balances2(get_self(), to.value);
      balances2.set(balances2.get_or_default(0) + 1, get_self());

      // Remove the approval for the "from" account
      _approvals approvals(get_self(), token_id);
      approvals.remove();

      // Send the transfer notification
      require_recipient(from);
      require_recipient(to);
   }
   
   [[eosio::action]] uint64_t balanceof(name owner){
      return get_balance(owner);
   }
   
   [[eosio::action]] name ownerof(uint64_t token_id){
      return get_owner(token_id);
   }
   
   ACTION approve(name to, uint64_t token_id){
      // get the token owner
      name owner = get_owner(token_id);
      
      // The owner of the NFT must authorize this action
      check(has_auth(owner), "owner has not authorized the approval");
   
      // The account we are approving must exist
      check(is_account(to), "to account does not exist");
      
      // Get the approvals table
      _approvals approvals(get_self(), token_id);
      
      // Set the approval for the NFT
      approvals.set(to, get_self());
   }
   
   ACTION approveall(name from, name to, bool approved){
      // The owner of the NFTs must authorize this action
      check(has_auth(from), "owner has not authorized the approval");
      
      // The account we are approving must exist
      check(is_account(to), "to account does not exist");
      
      // Get the approvals table
      _approvealls approvals(get_self(), from.value);
      
      if(approved){
         // Set the approval for the NFT
         approvals.set(to, get_self());
      } else {
         // Remove the approval for the NFT
         approvals.remove();
      }
   }
   
   [[eosio::action]] name getapproved(uint64_t token_id){
      return get_approved(token_id);
   }
   
   [[eosio::action]] bool approved4all(name owner, name approved_account){
      return get_approved_all(owner) == approved_account;
   }
   
   [[eosio::action]] std::string gettokenuri(uint64_t token_id){
      return get_token_uri(token_id);
   }
   
   ACTION setbaseuri(std::string base_uri){
      // The account calling this action must be the contract owner
      require_auth(get_self());
      
      // Get the base URI table
      _base_uris base_uris(get_self(), get_self().value);
      
      // Set the base URI
      base_uris.set(base_uri, get_self());
   }
};
```
</세부 사항>

## 교육용입니다.

이 컨트랙트를 EOS 네트워크에 배포하고 토큰을 발행하면
판매할 수 있는 지원되는 마켓플레이스가 없을 것입니다(이 가이드를 작성할 당시). 이는 교육 목적일 뿐입니다.

## 도전

이 NFT 계약에는 NFT를 소각할 방법이 없습니다. 을 추가하다 `burn` 토큰 소유자가 자신의 NFT를 소각할 수 있도록 하는 조치입니다.
