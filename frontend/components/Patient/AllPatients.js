import useGetAllPatients from "@/hooks/useGetAllPatients";
import PatientList from "./PatientList";

export default function AllPatients() {
  const { allPatients } = useGetAllPatients();

  return <PatientList allPatients={allPatients} setActiveTab={() => {}} />;
}
