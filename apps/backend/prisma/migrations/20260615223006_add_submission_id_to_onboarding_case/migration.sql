/*
  Warnings:

  - A unique constraint covering the columns `[submissionId]` on the table `OnboardingCase` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "OnboardingCase" ADD COLUMN     "submissionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingCase_submissionId_key" ON "OnboardingCase"("submissionId");
