# Atomic Swap between AION and Ethereum

## 2-way Party Atomic Swap Protocol

Party A, Party B, Note that contract `cA` and contract `cB` may be on separate blockchain.

1. Party A, Locally, generate secret `s` and its hash `h` = hash(s).
2. Party A, talk to blockchain, create conrtract `cA` with `h`, `sender A`, `recipient B`.
3. Party A, talk to blockchain, send funds to the contract.
4. Party A, through internet, tell Party B: `h` and address of the created Contract `cA`
---
5. Party B, talk to blockchain, make sure the contract `cA` is created with `h`, `recipient B` and if the fund is enough.
6. Party B, talk to blockchain, create contract `cB` with `h`, `sender B`, `recipient A`.
7. Party B, talk to blockchain, sends funds to the contract.
8. Party B, through internet, tell Party A the address of the created Contract `cB`.
---
9. Party A, talk to blockchain, make sure the contract `cB` is created with `h`, `recipient A` and if the fund is enough.
10. Party A, claims fund by submitting secret `s` to contract `cB`.
11. Party B, claims fund by submitting secret `s` to contract `cA`.



 
