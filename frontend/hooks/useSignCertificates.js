import { useNetwork, useSignTypedData } from "wagmi";
import { SignTypedDataVersion, recoverTypedSignature } from "@metamask/eth-sig-util";

export default function useSignCertificates() {
  const { chain } = useNetwork();

  const domain = {
    name: "MedicalRecord signature",
    // chainId: chain && chain.id,
    // version: "1",
  };

  const types = {
    EIP712Domain: [{ name: "name", type: "string" }],

    Certificate: [
      { name: "title", type: "string" },
      { name: "description", type: "string" },
      { name: "media", type: "string" },
    ],

    MetaData: [
      { name: "lastUpdatedDate", type: "string" },
      { name: "lastUpdatedBy", type: "address" },
      { name: "version", type: "int256" },
    ],

    Data: [
      { name: "certificates", type: "Certificate[]" },
      { name: "metadata", type: "MetaData" },
    ],
  };

  const { signTypedDataAsync } = useSignTypedData({ domain, types });
  const recoverSigner = (data, signature) =>
    recoverTypedSignature({
      data: { domain, message: data, primaryType: "Data", types },
      signature,
      version: SignTypedDataVersion.V4,
    });
  return { signCertificates: async (value) => await signTypedDataAsync({ value }), recoverSigner };
}
