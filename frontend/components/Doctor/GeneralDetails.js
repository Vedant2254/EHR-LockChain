import { isDataURL } from "@/utils/isDataURL";
import {
  createStyles,
  Grid,
  Image,
  Table,
  Text,
  Title,
  Card,
  Group,
  NavLink,
  ActionIcon,
  Container,
} from "@mantine/core";
import {
  IconBrandFacebook,
  IconBrandFacebookFilled,
  IconBrandInstagram,
  IconBrandTwitterFilled,
} from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
  image: {
    border: `1px solid ${theme.colors.dark[0]}`,
    // borderRadius: 100,
    // boxShadow: theme.shadows.sm,
  },
  socialcard: {
    border: `1px solid ${theme.colors.dark[0]}`,
    borderRadius: theme.radius.md,
  },
}));

export default function GeneralDetails({ data }) {
  const { classes } = useStyles();

  return (
    <>
      <Title order={3}>Dr. {data.name}'s profile</Title>
      <Grid mt="md">
        <Grid.Col span={3}>
          <Image
            src={data.photo}
            height={200}
            width={200}
            radius={100}
            classNames={{ image: "mantine-Image-image" }}
            styles={{ image: classes.image }}
            caption={
              <>
                <Text fw={500}>{data.name}</Text>
                {data.title || "No title provided"}
              </>
            }
          />
        </Grid.Col>
        <Grid.Col span={5}>
          <Table verticalSpacing="sm">
            <tbody>
              {Object.keys(data).map((key) => {
                if (key == "photo") return;
                return (
                  <tr>
                    <td>
                      <Text tt="capitalize">{key}</Text>
                    </td>
                    <td>
                      <Text c="dimmed" tt="capitalize" span>
                        {data[key]}
                      </Text>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Grid.Col>
        <Grid.Col span={1}></Grid.Col>
        <Grid.Col span={3}>
          <Container className={classes.socialcard} p="md">
            <Text fw="bold">Social</Text>
            <Group mt="lg">
              <ActionIcon
                component="a"
                href={data.instagram}
                target="_blank"
                variant="gradient"
                gradient={{ from: "yellow", to: "purple", deg: 45 }}
              >
                <IconBrandInstagram />
              </ActionIcon>
              <ActionIcon component="a" href={data.facebook} target="_blank" color="indigo">
                <IconBrandFacebookFilled />
              </ActionIcon>
              <ActionIcon component="a" href={data.twitter} target="_blank" color="blue">
                <IconBrandTwitterFilled />
              </ActionIcon>
            </Group>
          </Container>
        </Grid.Col>
      </Grid>
    </>
  );
}
