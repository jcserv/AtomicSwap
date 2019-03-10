# Atomic Swap between AION and Ethereum

## 2-way Party Atomic Swap Protocol

The atomic swap protocol allows two parties to exchange assets on two different blockchain in a securely manner such that either the ownership of assets are both changed or both would remain the same.

The protocol is detailed below:

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

If either party does not confirm, then funds are returned.

## How we built it

The project consists of 3 main parts:
1. The smart contract on Ethereum
2. The smart contract on Aion
3. An interface that connects to both blockchain.

For users to have a better experience, 
all transaction and queries to the blockchains, including deploying smart contracts during the protocol, will go through the two Wallets and would thus minimize users' hassle of managing keys.

We built the interface such that the users will not need to know how to deploy the contract to run the protocol.

## Challenges we ran into

The main issues we ran into were with integrating the two systems of the two separate blockchains and realizing that things that work for one may not work for the other. For example, we were stuck for a while on how to generate ABI from our AVM code, however there is no ABI generator currently.

Secondly, we failed to deploy contracts programmatically with the latest version of web3.js. We later found out that this seems to be a known issue on the 1.0.0 pre-release, and decided to roll back to older version of web3.js.

Lastly, a few hours before the deadline, the aion testnet went down.

## Accomplishments that we're proud of

We are proud to have completed a set of smart contracts that would work exactly as our specification, along with an user interface that hides the contract deployment process from the user within the timeframe of the hackathon and despite the obstacles we have faced.

Team members: Martinet Lee, Dmitriy Strizhkov, Jarrod Servilla

 
