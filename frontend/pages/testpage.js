import useGetPatientData from "@/hooks/useGetPatientData";
import ConnectButton from "@/components/Utils/ConnectButton";
import { useContractWrite } from "wagmi";
import useValidTxnData from "@/hooks/useValidTxnData";
import useGetDoctorOfPatient from "@/hooks/useGetDoctorOfPatient";
import useChangeEditorAccess from "@/hooks/useChangeEditorAccess";

export default function TestPage() {
  const { address, contractAddress, abi, enabled } = useValidTxnData();
  const { hashData, generalData, certificates: certificatesData } = useGetPatientData(address);
  const { changeEditorAccess } = useChangeEditorAccess(
    "0x3c9CbcAf6dbd63e853DBC59cD2C8a5Ca9344C63C"
  );

  const { writeAsync: runRegisterPt } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "registerPt",
    args: ["abc", "def"],
    enabled,
  });

  // const { writeAsync: changeEditorAccess } = useContractWrite({
  //   address: contractAddress,
  //   abi,
  //   functionName: "changeEditorAccess",
  //   args: ["0xf3C98985E985DFe627453925A75A9BE88a348996"],
  //   enabled,
  // });

  return (
    <>
      <ConnectButton />
      <button
        onClick={async () => {
          console.log(await runRegisterPt());
          // console.log(await getPtGeneralHash());
        }}
      >
        Register
      </button>
      <button
        onClick={() => {
          console.log(hashData);
          console.log(generalData);
          console.log(certificatesData);
        }}
      >
        Print now
      </button>
      <button onClick={changeEditorAccess}>Change Access</button>
    </>
  );
}
