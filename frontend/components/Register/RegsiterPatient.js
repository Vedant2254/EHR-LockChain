import useRegisterPatient from "@/hooks/useRegisterPatient";
import RegistrationForm from "@/components/Forms/RegistrationForm";
import BlurLoader from "../Utils/BlurLoader";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import useIsPatient from "@/hooks/useIsPatient";

export default function RegisterPatient() {
  const { address } = useAccount();
  const { runIsPatient } = useIsPatient(address);
  const { status, handleOnSumbit } = useRegisterPatient();

  useEffect(() => {
    status === "success" && runIsPatient();
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
