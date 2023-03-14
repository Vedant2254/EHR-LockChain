import { useState, useEffect } from "react";
import useValidTxnData from "@/utils/hooks/useValidTxnData";
import { useContractRead, useContractWrite } from "wagmi";
import { getPublicKey } from "../../utils/metamask";
import PatientWindow from "./Patients/Window";
import UserData from "./Main/UserData";

export default function DoctorController() {
  const { address, contractAddress, abi, enabled } = useValidTxnData();
  const [currTab, setCurrTab] = useState("Main");
  const [publicKey, setPublicKey] = useState(null);

  const { data: isDoctor, refetch: runIsDoctor } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "isDoctor",
    args: [address],
    enabled: false,
  });

  const { writeAsync: runConfirmAddDr } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "confirmAddDr",
    args: [publicKey],
    enabled,
  });

  async function confirmAddDr() {
    if (publicKey) {
      try {
        await runConfirmAddDr();
        await runIsDoctor();
      } catch (e) {
        console.log(e);
      }
      setPublicKey(null);
    }
  }

  useEffect(() => {
    (async () => {
      await confirmAddDr();
    })();
  }, [publicKey]);

  return (
    <>
      {!isDoctor && (
        <button
          onClick={async () => {
            setPublicKey(await getPublicKey(address));
          }}
        >
          Confirm Registration
        </button>
      )}
      <div>
        <button onClick={() => setCurrTab("Main")}>Main</button>
        <button onClick={() => setCurrTab("Patients")}>Patients</button>
        <br />
        <br />
        {currTab == "Main" && <UserData />}
        {currTab == "Doctors" && <PatientWindow />}
      </div>
    </>
  );
}
