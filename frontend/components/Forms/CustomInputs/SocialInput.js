import { ActionIcon, TextInput } from "@mantine/core";
import { IconBrandFacebook, IconBrandInstagram, IconBrandTwitter } from "@tabler/icons-react";

export default function SocialInput({ form }) {
  return (
    <>
      <TextInput
        icon={
          <ActionIcon
            variant="gradient"
            gradient={{ from: "yellow", to: "purple", deg: 45 }}
            size="sm"
          >
            <IconBrandInstagram />
          </ActionIcon>
        }
        placeholder="Instagram account link"
        {...form.getInputProps("instagram")}
      />
      <TextInput
        icon={
          <ActionIcon color="indigo" size="sm">
            <IconBrandFacebook />
          </ActionIcon>
        }
        placeholder="Facebook account link"
        {...form.getInputProps("facebook")}
      />
      <TextInput
        icon={
          <ActionIcon color="blue" size="sm">
            <IconBrandTwitter />
          </ActionIcon>
        }
        placeholder="Twitter account link"
        {...form.getInputProps("twitter")}
      />
    </>
  );
}
