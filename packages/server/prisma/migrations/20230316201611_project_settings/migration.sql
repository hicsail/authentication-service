-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "allowSignup" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "displayProjectName" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "googleAuth" BOOLEAN NOT NULL DEFAULT false;
