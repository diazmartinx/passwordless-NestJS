/*
  Warnings:

  - Made the column `lastEmailSentAt` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "lastEmailSentAt" SET NOT NULL,
ALTER COLUMN "lastEmailSentAt" SET DEFAULT 0;
