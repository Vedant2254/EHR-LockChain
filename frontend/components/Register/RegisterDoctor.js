import useRegisterDoctor from "@/hooks/useRegisterDoctor";
import RegistrationForm from "@/components/Forms/RegistrationForm";
import BlurLoader from "../Utils/BlurLoader";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function RegisterDoctor() {
  const { status, handleOnSubmit } = useRegisterDoctor();
  const router = useRouter();

  useEffect(() => {
    status === "success" && router.reload(window.location.pathname);
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
