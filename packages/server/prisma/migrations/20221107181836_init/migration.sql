-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "role" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "reset_code" TEXT,
    "reset_code_expires_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
