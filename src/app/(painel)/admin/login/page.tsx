import Link from "next/link";
import { redirect } from "next/navigation";
import { A } from "@/lib/texts/admin";
import { configAdminOuAviso } from "@/lib/admin/config";
import { destinoSeguro, sessaoAtual } from "@/lib/admin/session";
import { USAR_MOCKS } from "@/lib/mock/config";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const { next } = await searchParams;
  const destino = destinoSeguro(typeof next === "string" ? next : undefined);
  if (await sessaoAtual()) redirect(destino);

  // The page only learns *whether* the login is usable; names and reasons go to the server log.
  const validacao = configAdminOuAviso();

  return (
    <main id="conteudo" className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-8 px-5 py-10">
      <LoginForm next={destino} configurado={validacao.ok} modoTeste={USAR_MOCKS} />
      <Link
        href="/"
        className="flex min-h-11 items-center justify-center text-sm font-medium text-muted-foreground underline underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {A.login.voltar}
      </Link>
    </main>
  );
}
