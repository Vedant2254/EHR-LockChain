import { useState } from "react";
import DoctorWindow from "./Doctors/Window";
import PatientWindow from "./Patients/Window";

export default function AdminController() {
  const [currTab, setCurrTab] = useState("Main");

  return (
    <>
      <button onClick={() => setCurrTab("Main")}>Main</button>
      <button onClick={() => setCurrTab("Doctors")}>Doctors</button>
      <button onClick={() => setCurrTab("Patients")}>Patients</button>
      <br />
      <br />
      {currTab == "Main" && "Main"}
      {currTab == "Doctors" && <DoctorWindow />}
      {currTab == "Patients" && <PatientWindow />}
    </>
  );
}
