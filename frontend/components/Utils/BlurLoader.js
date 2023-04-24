import messages from "@/utils/messages";
import { LoadingOverlay, Notification } from "@mantine/core";

export default function BlurLoader({ visible, status }) {
  return (
    <LoadingOverlay
      visible={visible}
      overlayBlur={5}
      loader={
        <>
          <Notification
            loading
            title={messages[status]}
            withCloseButton={false}
            sx={{ border: "none", backgroundColor: "transparent", boxShadow: "none" }}
          >
            Please wait, check for wallet popups (if any)
          </Notification>
        </>
      }
    />
  );
}
