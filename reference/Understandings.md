# Understandings that I may forget later on

## IPFS

### What

IPFS is a peer-to-peer, decentralized, distributed filesystem that stores file in a decentralized manner. IPFS is a protocol like HTTPS.

- **HTTPS** uses a client-server architecture
- **IPFS** uses a distributed architecture

### Why

Storing files on blockchain is expensive as we need to pay the gas fees. Storing on a centralized server is a tight slap on decentralization of application. So we use IPFS that stores data on a distributed network of nodes.

### How

Smart contract don't interact with IPFS, there is no way they can do that. Process goes like this -

1. User uploads some data through frontend
2. Frontend itself encrypts the data, and stores it on IPFS
3. Frontend takes the hash of data from IPFS and gives it to the smart contract for storing
4. Smart contract stores this hash
5. When data needs to be retrieved frontend requests for the hash from smart contract
6. Frontend retrieves the data from the IPFS using that hash
7. Frontend decrypts the data and shows it to the user

##
