# EHR data management system

## What is blockchain

Blockchain is a decentralized database that stores a record of transactions happening on blockchain in the form of blocks linked through their hashes.

Eheterum blockchain can not only store transactions but also allows to execute the smart contract code deployed on blockchain. Contracts are simply accounts on blockchain that store the logic the defines how the contract will react to an incoming transaction.

## What is IPFS

IPFS stands for Interplanetary Filesystem. It is a distributed database where data is not stored on a single server, instead it is broken down into parts and is stored on multiple nodes in the network.

### Storage and retrieval on IPFS

1. IPFS generates a unique hash for the data that is stored on IPFS. This hash is also called as CID (Content Identifier) which can be used to retrieve data from IPFS.
1. To retrieve data we can either directly use the IPFS protocol by typing `ipfs://<cid>`, or we can use a gateway like `https://ipfs.io/ipfs/<cid>`.

## Project Folder Structure

`/` root folder

`/backend` smart contract built using solidity. [Hardhat](https://hardhat.org/) is used as development environment, provides easy testing and deploying functionalities, javascript can be used for writing testing and deployment scripts.

`/frontend` nextjs application

`/frontend/utils` all pure functions, takes some parameters -> does some computation -> returns the result, depends on pre-built modules like `crypto`, `web3.storage`, `@metamask/eth-sig-util`.

`/frontend/hooks` all communication functions (custom react hooks), establishes communications between frontend, backend and IPFS, depends on functions in `/frontend/utils` to fulfill their functionalities.

`/frontend/components` all UI components, handles UI and user interaction. Built using [Mantine.dev](https://mantine.dev/) UI library, and is highly dependent on custom react hooks in `/frontend/hooks`.

`/frontend/pages` contains routes of application that users can visit. Depends on `/frontend/components`.

## Modules

### Files related

These help getting file from user, converting file to textual form, making it encryption compatible, finally storing it to IPFS.

1. `Blob` - converts object to array buffer, not quite used, but mentioned.

2. `File` - object of this type is returned from `<input type="file" />`

3. `FileReader` - it is used to read file as binary string, array buffer, etc.

   Using `FileReader` we can convert the `File` object recieved from `input` tag to desired format, like `data url`, `array buffer`. This data can be then passed to encryption algorithm to encrypt and decrypt the data.

4. `Buffer` - created from ArrayBuffer from `FileReader.readAsArrayBuffer()`. It can be converted to `base64` using `buf.toString('base64')` where `buf` is object of `Buffer`.

### Cryptography

1. `crypto` - use for symmetric encryption of data.

2. `@metamask/eth-sig-util` - used for asymmetric encryption using public keys of users, decrypting using user's private key, signing data using user's private keys, verifying data integrity using user's public key.

### File storage

1. `web3.storage` - is used to programmatically upload and retrieve data from IPFS network.

### Contract interaction

1. `wagmi` - is used to interact with contract, read and write data to contract using contract functions.

## Files and file formats in textual format

Some formats in used in this project -

- `utf-8` string format
- `ArrayBuffer` array of uint8
- `base64` binary format
- `data url` base64 encoded with data url append at start
- `hex` Hexadecimal

## Encryption

Encryption can be done using `crypto` module.

1. File can be converted to data url using `FileReader().readAsDataURL()`, which directly gives a data url that can be put in `<iframe />` tag to view the data.

1. The output from `FileReader().readAsDataURL()` can be either be directly encrypted using `utf-8` to `hex`/`base64` encryption, then it can be decrypted using `hex`/`base64` to `utf-8` encryption. (This method seems better as output can directly be give to iframe to display the data)

1. Or the ouput can be split using a ',', this will give us an array with second element as `base64` format of data. This can then be encrypted using `base64` to `hex`/`base64` and decrypted vice versa.

## Mechanisms

### Cryptography mechanism

1. Let's say we have patient X, and doctors A, B, C, D and patient X wants to give access to doctors A, B, C only.

2. Asymmetric cryptography uses recievers public key to encrypt data and recievers private key to decrypt data, but using this way only one person at a time can access the data, i.e. either patient can access his own data or a doctor can access patients data, which is not at all feasible.

3. So, here we are using **hybrid encryption**, it works like this -

   - We have a symmetric key S using which we encrypt the data.
   - Then, we encrypt key S using A's public key and send it to A
   - We encrypt key S using B's public key and send it to B
   - We encrypt key S using C's public key and send it to C
   - Now A, B, C can decrypt encrypted key S using their private keys, and decrypt data using decrypted key S
   - While, D can't use any of the encrypted key S sent to A, B, C to decrypt key S

   ```
   encrypt(data, S)

   encrypt(S, A_pubkey) send to A
   encrypt(S, B_pubkey) send to B
   encrypt(S, C_pubkey) send to C

   decrypt(S, A_privkey) A gets key S
   decrypt(S, B_privkey) B gets key S
   decrypt(S, C_privkey) C gets key S

   decrypt(data, S)
   ```

### Where is hash stored?

**Patient and Doctor general data hash** is stored inside [Roles library](/backend/contracts/Roles.sol), Roles.Role stores address to hash mapping.

**Patient medical records** are stored in a mapping of patient address to MedicalRecord where MedicalRecord is a struct

### How data is structured?

#### Patient general details

This data is encrypted

```
{
    name: ----
    address: ---
    phoneno: ---
    .
    .
    .
}
```

#### Patient key data

This data has encrypted keys, only individual keys are encrypted

```
{
    keys: {
        address1: encKeySForAddress1
        address2: encKeySForAddress2
        address3: encKeySForAddress3
        .
        .
        .
    },
    medicalRecordCID: ---
}
```

#### Patient medical records

This data is stored in encrypted format, only accessible (read / read-write permission decided by smart contract)
by addresses present in keys of [Patient key data](#patient-key-data). Data is encrypted.

```
{
    previousVersion: {
        hash: "",
        key: ""
    },
    data: {
        certificates: [
            {
                title: ---
                description: ---
                media (image, pdf, docx, video, etc.): ---
            }
            {
                title: ---
                description: ---
                media (image, pdf, docx, video, etc.): ---
            }
            .
            .
            .
        ],
        metadata: {
            lastUpdatedBy: ""
            lastUpdatedDate: ""
        }
    },
    digitalSignatureOfLastUpdater: ""
}
```

#### Doctor general details

```
{
    name: ----
    address: ---
    phoneno: ---
    .
    .
    .
    certificates: [
        {
            title: ---
            description: ---
            media (image, pdf, docx, video, etc.): ---
        }
        {
            title: ---
            description: ---
            media (image, pdf, docx, video, etc.): ---
        }
        .
        .
        .
    ]
}
```

### Pages

### Frontend NextJS component structure

```
> Admin
> Doctor
> Patient
```

### Issues that occured during development

#### Metamask default account for contract read

1. Metamask sends transactions that needs to be signed through the account that is currently selected
2. But, when calling a view function on contract it sends it may be sent through any account that is connected, not necessarily through the selected account
3. It was realised when patients data was returned instead call reverted with message "Not Allowed" as contract used to compare allowed addresses with msg.sender, when I returned msg.sender from contract I realised that the account call was being sent was not the account currectly selected in metamask, it was being sent from the account that was first connected to website.
4. In this application specifically for functions that are view functions and rely on msg.sender, I have used ethersjs direclty instead of wagmi hooks.
   ```js
   async function getPatientDataManually() {
     try {
       const provider = new ethers.providers.Web3Provider(window.ethereum);
       const signer = provider.getSigner();
       // useSigner() from wagmi can also be used to get current signer
       // const signer = useSigner();
       const contract = new ethers.Contract(contractAddress, abi, signer);
       console.log(await contract.getPtRecordHash(address));
     } catch (err) {
       console.log(err);
     }
   }
   ```

## Further updates in 🧠 but not in 💻 yet

We can store [w3name](https://github.com/web3-storage/w3name) instead of hash. Updates doesn't change this name, so reduces gas consumption of chaning hash each time data gets changed.
