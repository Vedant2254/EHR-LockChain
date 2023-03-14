import { useState } from "react";
import DoctorController from "./Doctors/Controller";
import PatientController from "./Patients/Controller";

export default function AllDoctors({ handleViewDoctor }) {
  const [currTab, setCurrTab] = useState("Main");

  return (
    <>
      <button onClick={() => setCurrTab("Main")}>Main</button>
      <button onClick={() => setCurrTab("Doctors")}>Doctors</button>
      <button onClick={() => setCurrTab("Patients")}>Patients</button>
      <br />
      <br />
      {currTab == "Main" && "Main"}
      {currTab == "Doctors" && <DoctorController />}
      {currTab == "Patients" && <PatientController />}
    </>
  );
}
