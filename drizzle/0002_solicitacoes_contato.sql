CREATE TABLE "solicitacoes_contato" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"empresa" text NOT NULL,
	"contato" text NOT NULL,
	"mensagem" text NOT NULL,
	"consentimento_versao" text NOT NULL,
	"ip_hash" text,
	"user_agent" text,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atendido_em" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX "solicitacoes_contato_ip_hash_criado_idx" ON "solicitacoes_contato" USING btree ("ip_hash","criado_em" DESC NULLS LAST);