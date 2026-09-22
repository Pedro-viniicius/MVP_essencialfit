import { ImageResponse } from "next/og";
import { HERO, SITE } from "@/lib/site/conteudo";

export const alt = `${SITE.nome} — ${SITE.slogan}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagem de compartilhamento: fundo escuro, título do hero, um acento. */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#123d32",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, fontWeight: 600 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#123d32" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 18c0-7 4.8-12 12.8-12H20c0 7-4.8 12-12.8 12H5Z" fill="#a7c81a" stroke="none" />
              <path d="M6.5 17.5c3.2-3.4 6.4-5.7 10.3-7.4" />
              <path d="M12.8 13.3h4v-4" />
            </svg>
          </div>
          {SITE.nome}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 58, fontWeight: 600, lineHeight: 1.12, letterSpacing: -1.5, maxWidth: 1000 }}>{HERO.titulo}</div>
          <div style={{ fontSize: 28, color: "#b8d2c8" }}>{SITE.slogan}</div>
        </div>
        <div style={{ display: "flex", gap: 12, fontSize: 22, color: "#b8d2c8" }}>
          <span style={{ color: "#a7c81a" }}>NFC + QR Code</span>
          <span>·</span>
          <span>Respostas</span>
          <span>·</span>
          <span>Decisões melhores</span>
        </div>
      </div>
    ),
    size,
  );
}
