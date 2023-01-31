/*
  Warnings:

  - The primary key for the `AdminDiscussionChatMessage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `chatId` was added to the `AdminDiscussionChatMessage` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "AdminDiscussionChatMessage" DROP CONSTRAINT "AdminDiscussionChatMessage_pkey",
ADD COLUMN     "chatId" TEXT NOT NULL,
ADD CONSTRAINT "AdminDiscussionChatMessage_pkey" PRIMARY KEY ("chatId");
