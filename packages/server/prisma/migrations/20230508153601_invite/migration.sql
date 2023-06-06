-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "allowSignup" DROP NOT NULL,
ALTER COLUMN "displayProjectName" DROP NOT NULL,
ALTER COLUMN "googleAuth" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Invite" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "invitedById" TEXT NOT NULL,
    "acceptedById" TEXT,
    "email" TEXT NOT NULL,
    "role" INTEGER NOT NULL DEFAULT 0,
    "inviteCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invite_acceptedById_key" ON "Invite"("acceptedById");

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_acceptedById_fkey" FOREIGN KEY ("acceptedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
