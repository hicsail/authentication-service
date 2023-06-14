-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "verifyEmail" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" BOOLEAN DEFAULT false;
