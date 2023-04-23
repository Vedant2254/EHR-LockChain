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
import useUpdateDoctor from "@/hooks/useUpdateDoctor";
import { useRouter } from "next/router";
import { Button } from "@mantine/core";

export default function TestPage() {
  const router = useRouter();

  return <Button onClick={() => router.reload(window.location.pathname)}>reload</Button>;
}
