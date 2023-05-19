import useRegisterPatient from "@/hooks/useRegisterPatient";
import RegistrationForm from "@/components/Forms/RegistrationForm";
import BlurLoader from "../Utils/BlurLoader";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function RegisterPatient() {
  const { address } = useAccount();
  const { status, handleOnSumbit } = useRegisterPatient();
  const router = useRouter();

  useEffect(() => {
    status === "success" && router.reload("/patient/dashboard");
  }, [status]);

  return (
    <>
      <BlurLoader visible={status} status={status} />
      <RegistrationForm
        user="patient"
        initialValues={{}}
        handleOnSubmit={handleOnSumbit}
        submitIsDisabled={status}
      />
    </>
  );
}
