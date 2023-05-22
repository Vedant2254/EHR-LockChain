import useRegisterDoctor from "@/hooks/useRegisterDoctor";
import RegistrationForm from "@/components/Forms/RegistrationForm";
import BlurLoader from "../Utils/BlurLoader";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { useRouter } from "next/router";
import useIsDoctorRegistered from "@/hooks/useIsDoctorRegistered";
import useIsDoctor from "@/hooks/useIsDoctor";

export default function RegisterDoctor() {
  const { address } = useAccount();
  const { runIsDoctorRegistered } = useIsDoctorRegistered(address);
  const { status, handleOnSubmit } = useRegisterDoctor();

  useEffect(() => {
    status === "success" && runIsDoctorRegistered();
  }, [status]);

  return (
    <>
      <BlurLoader visible={status} status={status} />
      <RegistrationForm
        user="doctor"
        initialValues={{}}
        submitIsDisabled={status}
        handleOnSubmit={handleOnSubmit}
      />
    </>
  );
}
