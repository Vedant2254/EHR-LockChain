import useGetAllPatients from "@/hooks/useGetAllPatients";
import PatientsList from "./PatientsList";

export default function AllPatients() {
  const { allPatients } = useGetAllPatients();

  return <PatientsList patients={allPatients} setActiveTab={() => {}} />;
}
