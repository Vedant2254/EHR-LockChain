import {
  createStyles,
  Grid,
  Image,
  Table,
  Text,
  Title,
  Group,
  ActionIcon,
  Container,
  Flex,
} from "@mantine/core";
import {
  IconBrandFacebookFilled,
  IconBrandInstagram,
  IconBrandTwitterFilled,
} from "@tabler/icons-react";
import EditGeneralDataForm from "../Forms/EditGeneralDataForm";

const useStyles = createStyles((theme) => ({
  image: {
    border: `1px solid ${theme.colors.dark[0]}`,
    // borderRadius: 100,
    // boxShadow: theme.shadows.sm,
  },
  socialcard: {
    border: `1px solid ${theme.colors.dark[0]}`,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  },
}));

export default function GeneralDetails({ address, access, data, setEditedGeneralData }) {
  const { classes } = useStyles();

  return (
    data && (
      <>
        {access == 2 && (
          <EditGeneralDataForm initialValues={data} setEditedGeneralData={setEditedGeneralData} />
        )}
        <Title order={3}>Dr. {data.name}'s profile </Title>
        <Grid mt="xs">
          <Grid.Col span={3} bor>
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
                  {address &&
                    `${address.slice(0, 6)}...${address.slice(address.length - 6, address.length)}`}
                </>
              }
            />
          </Grid.Col>
          <Grid.Col span={5}>
            <Table verticalSpacing="sm">
              <tbody>
                <tr>
                  <td>
                    <Text tt="capitalize">Chain Address</Text>
                  </td>
                  <td>
                    <Text c="dimmed" tt="capitalize" span>
                      {address}
                    </Text>
                  </td>
                </tr>
                {Object.keys(data).map((key, index) => {
                  if (["photo", "instagram", "facebook", "twitter"].indexOf(key) != -1) return;
                  return (
                    <tr key={index}>
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
            <Container className={classes.socialcard}>
              <Text fw="bold">Social</Text>
              <Group mt="lg">
                <ActionIcon
                  component="a"
                  href={`https://instagram.com/${data.instagram}`}
                  target="_blank"
                  variant="gradient"
                  gradient={{ from: "yellow", to: "purple", deg: 45 }}
                >
                  <IconBrandInstagram />
                </ActionIcon>
                <ActionIcon
                  component="a"
                  href={`https://facebook.com/${data.facebook}`}
                  target="_blank"
                  color="indigo"
                >
                  <IconBrandFacebookFilled />
                </ActionIcon>
                <ActionIcon
                  component="a"
                  href={`https://twitter.com/${data.twitter}`}
                  target="_blank"
                  color="blue"
                >
                  <IconBrandTwitterFilled />
                </ActionIcon>
              </Group>
            </Container>
          </Grid.Col>
        </Grid>
      </>
    )
  );
}
