import { getSession } from "@/lib/auth";
import SettingsClient from "./SettingsClient";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await getSession();
  
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 font-serif">Account Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your profile, security, and active sessions.</p>
      </div>
      
      <SettingsClient initialUser={{ name: session.name, email: session.email }} />
    </div>
  );
}
