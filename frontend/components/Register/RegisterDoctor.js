import useRegisterDoctor from "@/hooks/useRegisterDoctor";
import { Center, Loader, LoadingOverlay, Text } from "@mantine/core";
import RegistrationForm from "@/components/Forms/RegistrationForm";
import messages from "@/utils/messages";
import BlurLoader from "../Utils/BlurLoader";

export default function RegisterDoctor() {
  const { status, handleOnSubmit } = useRegisterDoctor();

  return (
    <>
      {/* <LoadingOverlay
        visible={status}
        overlayBlur={4}
        loader={
          <>
            <Center>
              <Loader />
            </Center>
            <Text>{messages[status]}</Text>
          </>
        }
      /> */}
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
