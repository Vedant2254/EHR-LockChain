import { Paper } from "@mantine/core";
import PatientController from "@/components/AppShell/Controllers/PatientController";
import EHRAppShell from "@/components/AppShell/EHRAppShell";

export default function MainScreen() {
  const navlinks = [
    { label: "Dashboard", location: "dashboard" },
    { label: "My doctor", location: "my-doctor" },
    { label: "All doctors", location: "all-doctors" },
  ];

  return <EHRAppShell navlinks={navlinks} Controller={PatientController} />;
}
