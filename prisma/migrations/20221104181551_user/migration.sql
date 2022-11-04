/*
  Warnings:

  - You are about to drop the `USER` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "USER";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "reset_code" TEXT,
    "reset_code_expires_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id","project_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
