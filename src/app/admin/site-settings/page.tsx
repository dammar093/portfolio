
import { Breadcrumbs } from "@/components/admin/shared/bedcumbs";
import SettingForm from "./_components/form";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs />

      <SettingForm />
    </div>
  );
}
