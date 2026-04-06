import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAvatarUrl } from "@/lib/actions";

export const metadata: Metadata = { title: "Meu Perfil" };
import { ProfileClient } from "@/components/ProfileClient";

export default async function PerfilPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const avatarUrl = await getAvatarUrl(session.id);

  return <ProfileClient session={{ ...session, avatarUrl }} />;
}
