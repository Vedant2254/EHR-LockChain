import { useEffect } from "react";
import { useRouter } from "next/router";
import { LoadingOverlay } from "@mantine/core";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`${router.pathname}/all-doctors`);
  }, []);

  return <LoadingOverlay visible={true} overlayBlur={4} />;
}
