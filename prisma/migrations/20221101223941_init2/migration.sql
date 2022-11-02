/*
  Warnings:

  - A unique constraint covering the columns `[project_id,username]` on the table `USER` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[project_id,email]` on the table `USER` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "USER_project_id_username_key" ON "USER"("project_id", "username");

-- CreateIndex
CREATE UNIQUE INDEX "USER_project_id_email_key" ON "USER"("project_id", "email");
