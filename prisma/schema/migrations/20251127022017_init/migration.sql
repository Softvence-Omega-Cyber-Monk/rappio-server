-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPEND');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'PATIENT', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'LAB_TECHNICIAN', 'MODERATOR', 'USER');

-- CreateTable
CREATE TABLE "daily_sequence" (
    "date" TEXT NOT NULL,
    "currentCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "daily_sequence_pkey" PRIMARY KEY ("date")
);

-- CreateTable
CREATE TABLE "staff_sequence" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "currentCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "staff_sequence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "phone" TEXT,
    "profileImage" TEXT,
    "signature" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "staff_sequence_key_key" ON "staff_sequence"("key");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
