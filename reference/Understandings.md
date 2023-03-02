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

## Deployment

### IPFS (Interplanetary file system)

**IPFS (Interplanetary file system) is not a blockchain.** The Interplanetary File System (IPFS) is a distributed file storage protocol that allows computers all over the globe to store and serve files as part of a giant peer-to-peer network. Any computer, anywhere in the world, can download the IPFS software and start hosting and serving files.

**Normal Internet: Location based addressing** - You request for some data by providing the IP address of the server.

**IPFS Internet: Content based addressing** - Here you just provide **what** you want, and the network figures out the location of required data, and send it to you. You provide **what** by providing the hash of the required file, the file you recieve can be checked against hash to verify the integrity of file.

**No server down issue:** As file is distributed over a network, more than one node can have the same file, so if one node goes down, file can still be accessed from another node in the network. This increases the availability of data.

**IPFS object:** Contains two fields, **Data** and **Links**.

- **Data** field stores the data
- **Links** stores the links of that file, if file is broken down in multiple objects.

Each object can store atmost 256KB of data, if data size is larger it is broken down into pieces, stored in seperate objects and linked with each other.

**Versioning:** IPFS network is immutable, once a file is uploaded it cannot be updated. Hence, it provides versioning of data, using a **Commit object**. Commit object has two fields-

- **Parent** stores the link to Commit object of previous version of file.
- **Object** stores link to actual IPFS object that contains the new version of file.

This linking goes endlessly. Each version of the file remain available on the IPFS network to all the nodes.

**Pinning a file:** A node has to pin a data to become provider of that data. When you run your own IPFS node, your become the provider of the data that you host on IPFS. This data will be available on IPFS network only until your node is up and running, to make your data available all the time, it needs to pinned by other nodes.

### FileCoin

FileCoin is built by the same group of people who built IPFS. FileCoin is a blockchain on top of IPFS, that pins your data on the IPFS network

### IPFS ❤️ Filecoin

**IPFS** for fast, flexible retrival

**Filecoin** for persistence and verifiability

### Fleek hosting

Uses **Filecoin** and **IPFS** under the hood to create a decentralized hosting service. Static frontends are hosted on IPFS and made persistent (available all the time) using Filecoin.
