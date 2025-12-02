/*
  Warnings:

  - The primary key for the `user_notification_preferences` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "user_notification_preferences" DROP CONSTRAINT "user_notification_preferences_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "user_notification_preferences_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "user_notification_preferences_id_seq";
