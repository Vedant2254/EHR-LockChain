import { useState } from "react";
import AllDoctors from "./AllDoctors";
import Doctor from "./Doctor";

export default function DoctorWindow() {
  const [currDrAddress, setCurrDrAddress] = useState(null);

  function handleViewDoctor(drAddress) {
    setCurrDrAddress(drAddress);
  }

  function clearCurrDoctor() {
    setCurrDrAddress(null);
  }

  return (
    <div>
      {currDrAddress ? (
        <Doctor drAddress={currDrAddress} clearCurrDoctor={clearCurrDoctor} />
      ) : (
        <AllDoctors handleViewDoctor={handleViewDoctor} />
      )}
    </div>
  );
}
