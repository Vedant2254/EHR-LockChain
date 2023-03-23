import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useSigner } from "wagmi";
import useValidTxnData from "./useValidTxnData";

export default function useGetPatientsOfDoctor() {
  const { contractAddress, abi, enabled } = useValidTxnData();
  const { data: signer } = useSigner();

  const [patients, setPatients] = useState([]);

  async function getPatientsOfDoctor() {
    try {
      const contract = new ethers.Contract(contractAddress, abi, signer);
      setPatients(await contract.getPtsOfDr());
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    enabled && signer && getPatientsOfDoctor();
  }, [enabled, signer]);

  return { patients };
}
