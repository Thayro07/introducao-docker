-- CreateEnum
CREATE TYPE "public"."categoriaLivro" AS ENUM ('ROMANCE', 'SUSPENCE', 'ACAO', 'FANTASIA', 'INFANTIL', 'CORDEL');

-- CreateTable
CREATE TABLE "public"."book" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "DataPublicacao" TEXT,
    "categoria" "public"."categoriaLivro",

    CONSTRAINT "book_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "book_titulo_key" ON "public"."book"("titulo");
