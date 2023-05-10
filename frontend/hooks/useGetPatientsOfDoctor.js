import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useSigner } from "wagmi";
import useValidTxnData from "./useValidTxnData";

export default function useGetPatientsOfDoctor(runnow = true) {
  const { contractAddress, contractAbi, enabled } = useValidTxnData();
  const { data: signer } = useSigner();

  const [patients, setPatients] = useState([]);

  async function getPatientsOfDoctor() {
    try {
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);
      setPatients(await contract.getPtsOfDr());
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    runnow && enabled && signer && getPatientsOfDoctor();
  }, [enabled, signer, runnow]);

  return { patients };
}
