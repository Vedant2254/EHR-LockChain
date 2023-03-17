import { Paper } from "@mantine/core";
import AdminController from "@/components/AppShell/Controllers/AdminController";
import EHRAppShell from "@/components/AppShell/EHRAppShell";

export default function MainScreen() {
  const navlinks = [
    { label: "Dashboard", location: "dashboard" },
    { label: "All doctors", location: "all-doctors" },
    { label: "All patients", location: "all-patients" },
  ];

  return <EHRAppShell navlinks={navlinks} Controller={AdminController} />;
}
