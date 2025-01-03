-- CreateEnum
CREATE TYPE "genere" AS ENUM ('UOMO', 'DONNA', 'NS');

-- CreateEnum
CREATE TYPE "ruolo" AS ENUM ('CLIENTE', 'PROPRIETARIO', 'PULIZIE');

-- CreateEnum
CREATE TYPE "stato_prenotazione" AS ENUM ('PRENOTATA', 'CONFERMATA', 'ANNULLATA_UTENTE', 'ANNULLATA_HOST');

-- CreateEnum
CREATE TYPE "tipo_documento" AS ENUM ('CARTAIDENTITA', 'PATENTE', 'PASSAPORTO');

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
    "metodo" TEXT,
    "importo" REAL NOT NULL,
    "dataSaldo" TIMESTAMP(6),
    "codPrenotazione" UUID,

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
    "codPulizie" TEXT NOT NULL,
    "stato" "stato_prenotazione" NOT NULL DEFAULT 'PRENOTATA',

    CONSTRAINT "Prenotazioni_pkey" PRIMARY KEY ("idPrenotazione")
);

-- CreateTable
CREATE TABLE "Profili" (
    "idProfilo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cognome" TEXT NOT NULL,
    "telefono" TEXT,
    "cf" TEXT,
    "piva" TEXT,
    "dataNascita" DATE NOT NULL,
    "genere" "genere" NOT NULL,
    "indirizzo" TEXT,
    "ruolo" "ruolo" NOT NULL,

    CONSTRAINT "Profili_pkey" PRIMARY KEY ("idProfilo")
);

-- CreateTable
CREATE TABLE "Stanze" (
    "idStanza" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome" TEXT,
    "capienza" SMALLINT,
    "descrizione" TEXT,
    "foto" TEXT[],

    CONSTRAINT "Stanze_pkey" PRIMARY KEY ("idStanza")
);

-- CreateTable
CREATE TABLE "Tariffe" (
    "codStanza" UUID NOT NULL,
    "dataInizio" DATE NOT NULL,
    "dataFine" DATE,
    "costoProcapite" REAL NOT NULL,

    CONSTRAINT "Tariffe_pkey" PRIMARY KEY ("codStanza","dataInizio")
);

-- AddForeignKey
ALTER TABLE "Ospiti" ADD CONSTRAINT "Ospiti_codPrenotazione_fkey" FOREIGN KEY ("codPrenotazione") REFERENCES "Prenotazioni"("idPrenotazione") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagamenti" ADD CONSTRAINT "Pagamenti_codPrenotazione_fkey" FOREIGN KEY ("codPrenotazione") REFERENCES "Prenotazioni"("idPrenotazione") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prenotazioni" ADD CONSTRAINT "Prenotazioni_codProfilo_fkey" FOREIGN KEY ("codProfilo") REFERENCES "Profili"("idProfilo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prenotazioni" ADD CONSTRAINT "Prenotazioni_codPulizie_fkey" FOREIGN KEY ("codPulizie") REFERENCES "Profili"("idProfilo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prenotazioni" ADD CONSTRAINT "Prenotazioni_codStanza_fkey" FOREIGN KEY ("codStanza") REFERENCES "Stanze"("idStanza") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tariffe" ADD CONSTRAINT "Tariffe_codStanza_fkey" FOREIGN KEY ("codStanza") REFERENCES "Stanze"("idStanza") ON DELETE CASCADE ON UPDATE CASCADE;
