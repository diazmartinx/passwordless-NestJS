-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastEmailSentAt" TIMESTAMP(3),
ALTER COLUMN "updatedAt" DROP DEFAULT;
