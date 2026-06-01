-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'OPERATOR_ONBOARDING', 'OPERATOR_HR', 'OPERATOR_IT', 'TEAMLEAD', 'AANMELDER', 'KANDIDAAT');

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('INTAKE_STARTED', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "StepType" AS ENUM ('INTRO_MEETING_PLANNED', 'INTRO_MEETING_COMPLETED', 'GENERAL_INFO_SHARED', 'VOG_REQUESTED', 'VOG_VALIDATED', 'CONTRACT_SIGNED', 'GOOGLE_ACCOUNT_CREATED', 'GOOGLE_ACCOUNT_ACTIVATED', 'SLACK_INVITED', 'SLACK_ACTIVATED', 'MENTOR_ASSIGNED', 'LEARNING_PATH_CHOSEN', 'MEETING_PLANNED', 'PROJECT_ASSIGNED', 'STANDUP_PLANNED');

-- CreateEnum
CREATE TYPE "StepStatus" AS ENUM ('PENDING', 'COMPLETED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "GoogleAccountStatus" AS ENUM ('NOT_STARTED', 'PROVISIONED', 'ACTIVATED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "SlackAccountStatus" AS ENUM ('NOT_STARTED', 'INVITED', 'ACTIVATED', 'DEACTIVATED');

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "googleId" TEXT,
    "role" "UserRole" NOT NULL,
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnboardingCase" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "submittedById" TEXT,
    "mentorId" TEXT,
    "status" "CaseStatus" NOT NULL DEFAULT 'INTAKE_STARTED',
    "trajectType" TEXT NOT NULL,
    "team" TEXT,
    "project" TEXT,
    "startDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnboardingCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowStep" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "ownerId" TEXT,
    "stepType" "StepType" NOT NULL,
    "status" "StepStatus" NOT NULL DEFAULT 'PENDING',
    "evidenceUrl" TEXT,
    "completedAt" TIMESTAMP(3),
    "deadline" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkflowStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IamAccount" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "googleUserId" TEXT,
    "googleEmail" TEXT,
    "slackUserId" TEXT,
    "googleStatus" "GoogleAccountStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "slackStatus" "SlackAccountStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "googleProvisionedAt" TIMESTAMP(3),
    "googleActivatedAt" TIMESTAMP(3),
    "slackInvitedAt" TIMESTAMP(3),
    "slackActivatedAt" TIMESTAMP(3),

    CONSTRAINT "IamAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MappingRule" (
    "id" TEXT NOT NULL,
    "trajectType" TEXT NOT NULL,
    "team" TEXT,
    "project" TEXT,
    "googleGroup" TEXT NOT NULL,
    "slackChannel" TEXT NOT NULL,
    "slackUsergroup" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MappingRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "caseId" TEXT,
    "actorId" TEXT,
    "eventType" TEXT NOT NULL,
    "targetPersonId" TEXT,
    "externalId" TEXT,
    "result" TEXT NOT NULL,
    "correlationId" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_email_key" ON "Person"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_personId_key" ON "User"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowStep_caseId_stepType_key" ON "WorkflowStep"("caseId", "stepType");

-- CreateIndex
CREATE UNIQUE INDEX "IamAccount_caseId_key" ON "IamAccount"("caseId");

-- CreateIndex
CREATE UNIQUE INDEX "MappingRule_trajectType_team_project_googleGroup_key" ON "MappingRule"("trajectType", "team", "project", "googleGroup");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnboardingCase" ADD CONSTRAINT "OnboardingCase_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnboardingCase" ADD CONSTRAINT "OnboardingCase_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnboardingCase" ADD CONSTRAINT "OnboardingCase_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowStep" ADD CONSTRAINT "WorkflowStep_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "OnboardingCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowStep" ADD CONSTRAINT "WorkflowStep_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IamAccount" ADD CONSTRAINT "IamAccount_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "OnboardingCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "OnboardingCase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "OnboardingCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
