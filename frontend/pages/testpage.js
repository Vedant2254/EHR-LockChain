import useGetPatientData from "@/hooks/useGetPatientData";
import ConnectButton from "@/components/AppShell/ConnectButton";
import { AddChainError, useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import useValidTxnData from "@/hooks/useValidTxnData";
import useGetDoctorOfPatient from "@/hooks/useGetDoctorOfPatient";
import useChangeEditorAccess from "@/hooks/useChangeEditorAccess";
import useGetPatientsOfDoctor from "@/hooks/useGetPatientsOfDoctor";
import useRegisterPatient from "@/hooks/useRegisterPatient";
import useAddPatientData from "@/hooks/useAddPatientData";
import useGetPatientHash from "@/hooks/useGetPatientHash";
import { decryptData } from "@/utils/metamask";
import { symmetricDecrypt } from "@/utils/cryptography";
import { useEffect } from "react";

export default function TestPage() {
  const { address, contractAddress, abi, enabled } = useValidTxnData();
  const { keyData } = useGetPatientData(address);
  const { CIDs, setupCIDs } = useAddPatientData(address);

  const { writeAsync: setPtGeneralHash } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "setPtGeneralHash",
    args: [CIDs.generalDataCID],
  });

  const { writeAsync: setPtRecordHash } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "setPtRecordHash",
    args: [address, CIDs.keyDataCID],
  });

  useEffect(() => {
    CIDs.generalDataCID && setPtGeneralHash();
    console.log("Done step 2");
  }, [CIDs.generalDataCID]);

  useEffect(() => {
    CIDs.keyDataCID && setPtRecordHash();
    console.log("Done step 2");
  }, [CIDs.keyDataCID]);

  return (
    <>
      <button
        onClick={async () => {
          await setupCIDs(
            { name: "vedant", age: "since long ago", jaudhar: "ha udhar" },
            null,
            keyData
          );
          console.log("Done step 1");
        }}
      >
        Set General hash
      </button>
      <button
        onClick={async () => {
          await setupCIDs(
            null,
            [
              { media: "", title: "hello title", description: "hello description" },
              { media: "", title: "hello title 1", description: "hello description 1" },
              { media: "", title: "hello title 2", description: "hello description 2" },
            ],
            keyData
          );
          console.log("Done step 1");
        }}
      >
        Set Certificates hash
      </button>
    </>
  );
}
