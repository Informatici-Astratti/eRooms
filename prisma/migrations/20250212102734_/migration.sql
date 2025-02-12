-- CreateEnum
CREATE TYPE "genere" AS ENUM ('UOMO', 'DONNA', 'NS');

-- CreateEnum
CREATE TYPE "ruolo" AS ENUM ('CLIENTE', 'PROPRIETARIO', 'GOVERNANTE');

-- CreateEnum
CREATE TYPE "stato_prenotazione" AS ENUM ('PRENOTATA', 'CONFERMATA', 'ANNULLATA_UTENTE', 'ANNULLATA_HOST');

-- CreateEnum
CREATE TYPE "tipo_documento" AS ENUM ('CARTAIDENTITA', 'PATENTE', 'PASSAPORTO');

-- CreateEnum
CREATE TYPE "stato_pulizia" AS ENUM ('PULITA', 'DA_PULIRE');

-- CreateEnum
CREATE TYPE "tipo_variazione" AS ENUM ('AUMENTO_PERCENTUALE', 'SCONTO_PERCENTUALE', 'AUMENTO_FISSO', 'SCONTO_FISSO', 'NULLA');

-- CreateEnum
CREATE TYPE "tipo_pagamento" AS ENUM ('ALLOGGIO', 'TASSA', 'ALTRO');

-- CreateTable
CREATE TABLE "Ospiti" (
    "idOspite" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome" TEXT,
    "cognome" TEXT,
    "cf" TEXT,
    "tipoDocumento" "tipo_documento",
    "idDocumento" TEXT,
    "dataRilascio" DATE,
    "dataScadenza" DATE,
    "fotoDocumento" TEXT,
    "codPrenotazione" UUID NOT NULL,

    CONSTRAINT "Ospiti_pkey" PRIMARY KEY ("idOspite")
);

-- CreateTable
CREATE TABLE "Pagamenti" (
    "idPagamento" UUID NOT NULL DEFAULT gen_random_uuid(),
    "importo" REAL NOT NULL,
    "dataSaldo" TIMESTAMP(6),
    "codPrenotazione" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    "stripePaymentId" TEXT NOT NULL DEFAULT '',
    "tipoPagamento" "tipo_pagamento" NOT NULL DEFAULT 'ALTRO',
    "nome" TEXT NOT NULL,
    "descrizione" TEXT NOT NULL,

    CONSTRAINT "Pagamenti_pkey" PRIMARY KEY ("idPagamento")
);

-- CreateTable
CREATE TABLE "Prenotazioni" (
    "idPrenotazione" UUID NOT NULL DEFAULT gen_random_uuid(),
    "dataCreazione" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataInizio" TIMESTAMP(6) NOT NULL,
    "dataFine" TIMESTAMP(6) NOT NULL,
    "codStanza" UUID NOT NULL,
    "codProfilo" TEXT NOT NULL,
    "stato" "stato_prenotazione" NOT NULL DEFAULT 'PRENOTATA',

    CONSTRAINT "Prenotazioni_pkey" PRIMARY KEY ("idPrenotazione")
);

-- CreateTable
CREATE TABLE "Profili" (
    "idProfilo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cognome" TEXT NOT NULL,
    "email" TEXT NOT NULL DEFAULT '',
    "telefono" TEXT,
    "cf" TEXT,
    "piva" TEXT,
    "dataNascita" DATE NOT NULL,
    "genere" "genere" NOT NULL,
    "indirizzo" TEXT,
    "ruolo" "ruolo" NOT NULL,
    "stripeCustomerId" TEXT,

    CONSTRAINT "Profili_pkey" PRIMARY KEY ("idProfilo")
);

-- CreateTable
CREATE TABLE "Stanze" (
    "idStanza" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome" TEXT NOT NULL,
    "capienza" SMALLINT NOT NULL,
    "descrizione" TEXT NOT NULL,
    "costoStandard" REAL NOT NULL,

    CONSTRAINT "Stanze_pkey" PRIMARY KEY ("idStanza")
);

-- CreateTable
CREATE TABLE "Tariffe" (
    "idTariffa" UUID NOT NULL DEFAULT gen_random_uuid(),
    "codStanza" UUID NOT NULL,
    "dataInizio" DATE NOT NULL,
    "dataFine" DATE NOT NULL,
    "tipoVariazione" "tipo_variazione" NOT NULL,
    "variazione" REAL NOT NULL,

    CONSTRAINT "Tariffe_pkey" PRIMARY KEY ("idTariffa")
);

-- CreateTable
CREATE TABLE "Proprieta" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "telefono" TEXT,
    "registrazioneSocieta" TEXT NOT NULL,
    "indirizzo" TEXT NOT NULL,
    "citta" TEXT NOT NULL,
    "CAP" TEXT NOT NULL,
    "paese" TEXT NOT NULL,

    CONSTRAINT "Proprieta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pulizie" (
    "codStanza" UUID NOT NULL,
    "stato" "stato_pulizia" NOT NULL DEFAULT 'PULITA',
    "ultimoAggiornamento" TIMESTAMPTZ(6) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),

    CONSTRAINT "Pulizie_pkey" PRIMARY KEY ("codStanza")
);

-- CreateTable
CREATE TABLE "TurniPulizie" (
    "idTurno" UUID NOT NULL DEFAULT gen_random_uuid(),
    "codStanza" UUID NOT NULL,
    "codGovernante" TEXT NOT NULL,
    "dataInizio" DATE NOT NULL,
    "dataFine" DATE,

    CONSTRAINT "TurniPulizie_pkey" PRIMARY KEY ("idTurno")
);

-- CreateTable
CREATE TABLE "FotoStanze" (
    "idFoto" TEXT NOT NULL,
    "codStanza" UUID,
    "url" TEXT NOT NULL,

    CONSTRAINT "FotoStanze_pkey" PRIMARY KEY ("idFoto")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pagamenti_stripePaymentId_key" ON "Pagamenti"("stripePaymentId");

-- AddForeignKey
ALTER TABLE "Ospiti" ADD CONSTRAINT "Ospiti_codPrenotazione_fkey" FOREIGN KEY ("codPrenotazione") REFERENCES "Prenotazioni"("idPrenotazione") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagamenti" ADD CONSTRAINT "Pagamenti_codPrenotazione_fkey" FOREIGN KEY ("codPrenotazione") REFERENCES "Prenotazioni"("idPrenotazione") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prenotazioni" ADD CONSTRAINT "Prenotazioni_codProfilo_fkey" FOREIGN KEY ("codProfilo") REFERENCES "Profili"("idProfilo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prenotazioni" ADD CONSTRAINT "Prenotazioni_codStanza_fkey" FOREIGN KEY ("codStanza") REFERENCES "Stanze"("idStanza") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tariffe" ADD CONSTRAINT "Tariffe_codStanza_fkey" FOREIGN KEY ("codStanza") REFERENCES "Stanze"("idStanza") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pulizie" ADD CONSTRAINT "Pulizie_codStanza_fkey" FOREIGN KEY ("codStanza") REFERENCES "Stanze"("idStanza") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TurniPulizie" ADD CONSTRAINT "TurniPulizie_codGovernante_fkey" FOREIGN KEY ("codGovernante") REFERENCES "Profili"("idProfilo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TurniPulizie" ADD CONSTRAINT "TurniPulizie_codStanza_fkey" FOREIGN KEY ("codStanza") REFERENCES "Stanze"("idStanza") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FotoStanze" ADD CONSTRAINT "FotoStanze_codStanza_fkey" FOREIGN KEY ("codStanza") REFERENCES "Stanze"("idStanza") ON DELETE CASCADE ON UPDATE CASCADE;
