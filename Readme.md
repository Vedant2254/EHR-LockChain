# EHR data management system

## Modules

### Files related

These help getting file from user, converting file to textual form, making it encryption compatible, finally storing it to IPFS.

1. `Blob` - converts object to array buffer, not quite used, but mentioned here.

2. `File` - object of this type is returned from `<input type="file" />`

3. `FileReader` - it is used to read file as binary string, array buffer, etc.

   Using `FileReader` we can convert the `File` object recieved from `input` tag to desired format, like `data url`, `array buffer`. This data can be then passed to encryption algorithm to encrypt and decrypt the data.

4. `Buffer` - created from ArrayBuffer from `FileReader.readAsArrayBuffer()`. It can be converted to `base64` using `buf.toString('base64')` where `buf` is object of `Buffer`.

### Cryptography

1. `crypto` - use for symmetric encryption of data

2. `@metamask/eth-sig-util` - used for asymmetric encryption using public keys of users, decrypting using user's private key, signing data using user's private keys, verifying data integrity using user's public key.

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

1. Or the ouput can be split using a ',', donig this will give us an array with second element as `base64` format of data. This can then be encrypted using `base64` to `hex`/`base64` and decrypted vice versa.

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
    details: {
        name: ----
        address: ---
        phoneno: ---
        .
        .
        .
    },
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
by addresses present in keys of [Patient General Details](#patient-general-details). `data` is encrypted. `signatures` are not encrypted.

```
{
    previousVersion: {
        hash: ---,
        key: ---
    },
    data: [
        {
            title: ---
            description: ---
            media (image, pdf, docx, video, etc.): ---
            quality: ---
        }
        {
            title: ---
            description: ---
            media (image, pdf, docx, video, etc.): ---
            quality: ---
        }
        .
        .
        .
    ]
    metadata: {
        version: ---
        lastUpdateDateTime: ---
        lastUpdateByAddress: ---
    }
    digitalSignatureOfDoctor: ---
    digitalSignatureOfPatient: ---
}
```

#### Doctor general details

```
{
    details: {
        name: ----
        address: ---
        phoneno: ---
        .
        .
        .
    },
    certificates: {
        certificate1: ---
        certificate2: ---
        .
        .
        .
    }
}
```

## Further updates in 🧠 but not in 💻 yet

We can store [w3name](https://github.com/web3-storage/w3name) instead of hash. Updates doesn't change this name, so reduces gas consumption of chaning hash each time data gets changed.
