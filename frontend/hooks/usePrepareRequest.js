import { ethers } from "ethers";
import useValidTxnData from "./useValidTxnData";
import { signMetaTxRequest } from "@/utils/signer";
import { useProvider, useSigner } from "wagmi";

export default function usePrepareRequest() {
  const provider = useProvider();
  const { data: signer } = useSigner();
  const { forwarderAddress, forwarderAbi, contractAddress, contractAbi } = useValidTxnData();

  async function prepareRequest(functionName, args) {
    try {
      const contract = new ethers.Contract(contractAddress, contractAbi, provider);
      const forwarder = new ethers.Contract(forwarderAddress, forwarderAbi, provider);
      const data = contract.interface.encodeFunctionData(functionName, args);
      const result = await signMetaTxRequest(signer.provider, forwarder, {
        to: contract.address,
        from: await signer.getAddress(),
        data,
      });

      console.log(JSON.stringify(result));

      return result;
    } catch (err) {
      // if (!provider) return prepareRequest(functionName, args);
      console.log(err);
    }
  }

  return prepareRequest;
}
