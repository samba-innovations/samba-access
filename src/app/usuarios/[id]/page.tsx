import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getUserById, getRoles } from "@/lib/actions";
import { UserEditClient } from "@/components/UserEditClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarUsuarioPage({ params }: Props) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/");

  const { id } = await params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) notFound();

  const [user, roles] = await Promise.all([getUserById(userId), getRoles()]);
  if (!user) notFound();

  return <UserEditClient user={user as any} roles={roles as any} />;
}
