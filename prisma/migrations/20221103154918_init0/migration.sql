/*
  Warnings:

  - You are about to drop the column `reset_code_created_at` on the `USER` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[project_id,username]` on the table `USER` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[project_id,email]` on the table `USER` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "USER" DROP COLUMN "reset_code_created_at",
ADD COLUMN     "reset_code_expires_at" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "USER_project_id_username_key" ON "USER"("project_id", "username");

-- CreateIndex
CREATE UNIQUE INDEX "USER_project_id_email_key" ON "USER"("project_id", "email");
