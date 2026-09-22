import { Suspense } from "react";
import { Marca } from "@/components/marca";
import { SwRegister } from "@/components/sw-register";
import { Cupom } from "./cupom";

export const dynamic = "force-dynamic";

// Deliberately no database access: this screen must render even when the
// lead is still sitting in the offline queue.
export default async function SucessoPage({ params }: PageProps<"/f/[slug]/sucesso">) {
  const { slug } = await params;
  return (
    <main className="captura flex flex-1 flex-col items-center justify-center bg-white px-6 py-10 text-center">
      <Marca className="mb-8" />
      <Suspense>
        <Cupom slug={slug} />
      </Suspense>
      {/* Keeps replaying the offline queue while the coupon is on screen. */}
      <SwRegister slug={slug} />
    </main>
  );
}
