import useGetAllPatients from "@/hooks/useGetAllPatients";
import PatientsList from "./PatientsList";
import { Title } from "@mantine/core";

export default function AllPatients() {
  const { allPatients } = useGetAllPatients();

  return allPatients && allPatients.length > 0 ? (
    <PatientsList patients={allPatients} setActiveTab={() => {}} />
  ) : (
    <Title order={4}>No patient registered yet</Title>
  );
}
