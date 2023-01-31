/*
  Warnings:

  - Made the column `handlingAdminId` on table `AdminDiscussionChat` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AdminDiscussionChat" ALTER COLUMN "handlingAdminId" SET NOT NULL;
