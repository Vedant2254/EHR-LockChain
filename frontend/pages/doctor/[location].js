import { Paper } from "@mantine/core";
import DoctorController from "@/components/AppShell/Controllers/DoctorController";
import EHRAppShell from "@/components/AppShell/EHRAppShell";

export default function MainScreen() {
  console.log("rerendering");
  const navlinks = [
    { label: "Dashboard", location: "dashboard" },
    { label: "My patients", location: "my-patients" },
  ];

  return <EHRAppShell navlinks={navlinks} Controller={DoctorController} />;
}
