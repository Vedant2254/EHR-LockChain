import { useNetwork, useSignTypedData } from "wagmi";

export default function useSignCertificates() {
  const { chain } = useNetwork();

  const domain = {
    name: "MedicalRecord signature",
    chainId: chain && chain.id,
    version: "1",
  };

  const types = {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "version", type: "string" },
    ],

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

  return async (value) => await signTypedDataAsync({ value });
}
