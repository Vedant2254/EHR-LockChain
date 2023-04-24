import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useSigner } from "wagmi";
import useValidTxnData from "./useValidTxnData";
import useStatus from "./useStatus";

export default function useGetDoctorOfPatient() {
  const { contractAddress, abi, enabled } = useValidTxnData();
  const { data: signer } = useSigner();

  const [doctor, setDoctor] = useState("");
  const [txnLoading, setTxnLoading] = useState(false);
  const [success, setSuccess] = useState();
  const status = useStatus({ txnLoading, success });

  async function getDoctorOfPatient() {
    const contract = new ethers.Contract(contractAddress, abi, signer);
    return await contract.getDrOfPt();
  }

  useEffect(() => {
    (async () => {
      try {
        if (enabled && signer) {
          setTxnLoading(true);
          const drAddress = await getDoctorOfPatient();
          setDoctor(drAddress);
          setTxnLoading(false);
          setSuccess(true);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [enabled, signer]);

  return { status, doctor, getDoctorOfPatient };
}
