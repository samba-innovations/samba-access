import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getUsers, getRoles } from "@/lib/actions";

export const metadata: Metadata = { title: "Usuários" };
import { UsersClient } from "@/components/UsersClient";

export default async function UsuariosPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/");

  const [users, roles] = await Promise.all([getUsers(), getRoles()]);

  return <UsersClient users={users as any} roles={roles as any} />;
}
