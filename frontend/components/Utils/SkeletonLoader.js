import messages from "@/utils/messages";
import { Notification } from "@mantine/core";

export default function SkeletonLoader({
  status,
  SkeletonComponent,
  RetryComponent,
  DataComponent,
}) {
  return status == "success" ? (
    <DataComponent />
  ) : status == "failure" ? (
    <RetryComponent />
  ) : (
    <>
      <SkeletonComponent />
      <Notification
        loading
        title={messages[status]}
        withCloseButton={false}
        sx={{ border: "none", backgroundColor: "transparent", boxShadow: "none" }}
      >
        Please wait, check for metamask popups
      </Notification>
    </>
  );
}
