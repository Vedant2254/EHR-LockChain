import useGetPatientData from "@/hooks/useGetPatientData";
import ConnectButton from "@/components/Utils/ConnectButton";
import { useAccount, useContractWrite } from "wagmi";
import useValidTxnData from "@/hooks/useValidTxnData";
import useGetDoctorOfPatient from "@/hooks/useGetDoctorOfPatient";
import useChangeEditorAccess from "@/hooks/useChangeEditorAccess";
import useGetPatientsOfDoctor from "@/hooks/useGetPatientsOfDoctor";
import useRegisterPatient from "@/hooks/useRegisterPatient";
import useAddPatientData from "@/hooks/useAddPatientData";
import useGetPatientHash from "@/hooks/useGetPatientHash";

export default function TestPage() {
  const alldata = useGetPatientData("0x90F79bf6EB2c4f870365E785982E1f101E93b906", false);
  const hashData = useGetPatientHash("0x90F79bf6EB2c4f870365E785982E1f101E93b906");

  return (
    <>
      <ConnectButton />
      <button
        onClick={async () => {
          await alldata.getData();
          console.log(alldata);
        }}
        disabled={alldata.isLoading}
      >
        Get data
      </button>
    </>
  );
}
