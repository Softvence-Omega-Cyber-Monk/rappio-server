/*
  Warnings:

  - The values [PATIENT,DOCTOR,NURSE,RECEPTIONIST,LAB_TECHNICIAN,MODERATOR] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `signature` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `daily_sequence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `staff_sequence` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('ADMIN', 'USER');
ALTER TABLE "public"."users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "signature",
ADD COLUMN     "is2FAEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passwordResetExpires" TIMESTAMP(3),
ADD COLUMN     "passwordResetToken" TEXT,
ADD COLUMN     "subscription_status" TEXT,
ADD COLUMN     "twoFactorSecret" TEXT;

-- DropTable
DROP TABLE "public"."daily_sequence";

-- DropTable
DROP TABLE "public"."staff_sequence";
