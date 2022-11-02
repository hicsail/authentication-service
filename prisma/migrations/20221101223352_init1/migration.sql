/*
  Warnings:

  - You are about to drop the column `reset_code_created_at` on the `USER` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "USER" DROP COLUMN "reset_code_created_at",
ADD COLUMN     "reset_code_expires_at" TIMESTAMP(3),
ALTER COLUMN "role" SET DEFAULT 0;
