-- CreateTable
CREATE TABLE "USER" (
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
    "reset_code_created_at" TIMESTAMP(3),

    CONSTRAINT "USER_pkey" PRIMARY KEY ("id","project_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "USER_id_key" ON "USER"("id");
