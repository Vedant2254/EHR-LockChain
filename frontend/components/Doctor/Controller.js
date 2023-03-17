import { useState, useEffect } from "react";
import useValidTxnData from "@/hooks/useValidTxnData";
import { useContractRead, useContractWrite } from "wagmi";
import { getPublicKey } from "../../utils/metamask";
import PatientWindow from "./Patients/Window";
import MainWindow from "./Main/Window";

export default function DoctorController() {
  const [currTab, setCurrTab] = useState("Main");

  return (
    <>
      <div>
        <button onClick={() => setCurrTab("Main")}>Main</button>
        <button onClick={() => setCurrTab("Patients")}>Patients</button>
        <br />
        <br />
        {currTab == "Main" && <MainWindow />}
        {currTab == "Doctors" && <PatientWindow />}
      </div>
    </>
  );
}
