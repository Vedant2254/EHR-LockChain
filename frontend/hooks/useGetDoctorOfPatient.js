import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useSigner } from "wagmi";
import useValidTxnData from "./useValidTxnData";

export default function useGetDoctorOfPatient() {
  const { contractAddress, abi, enabled } = useValidTxnData();
  const { data: signer } = useSigner();

  const [doctor, setDoctor] = useState("");

  async function getDoctorOfPatient() {
    const contract = new ethers.Contract(contractAddress, abi, signer);
    return await contract.getDrOfPt();
  }

  useEffect(() => {
    (async () => {
      try {
        enabled && signer && setDoctor(await getDoctorOfPatient());
      } catch (err) {
        console.log(err);
      }
    })();
  }, [enabled, signer]);

  return { doctor };
}
