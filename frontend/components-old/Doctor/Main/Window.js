import { useState } from "react";
import DoctorData from "./DoctorData";
import EditData from "./EditData";

export default function MainWindow() {
  const [currTab, setCurrTab] = useState("display-data");

  return (
    <>
      {currTab == "display-data" ? (
        <button onClick={() => setCurrTab("edit-data")}>Edit</button>
      ) : (
        <button onClick={() => setCurrTab("display-data")}>Go back</button>
      )}
      <br />
      <br />
      {currTab == "display-data" ? <DoctorData /> : <EditData />}
    </>
  );
}
