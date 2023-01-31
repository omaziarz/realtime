/*
  Warnings:

  - You are about to drop the `UserChat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserChatMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_userChats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserChatMessage" DROP CONSTRAINT "UserChatMessage_chatId_fkey";

-- DropForeignKey
ALTER TABLE "UserChatMessage" DROP CONSTRAINT "UserChatMessage_senderId_fkey";

-- DropForeignKey
ALTER TABLE "_userChats" DROP CONSTRAINT "_userChats_A_fkey";

-- DropForeignKey
ALTER TABLE "_userChats" DROP CONSTRAINT "_userChats_B_fkey";

-- DropTable
DROP TABLE "UserChat";

-- DropTable
DROP TABLE "UserChatMessage";

-- DropTable
DROP TABLE "_userChats";

-- CreateTable
CREATE TABLE "UserMessage" (
    "messageId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserMessage_pkey" PRIMARY KEY ("messageId")
);

-- AddForeignKey
ALTER TABLE "UserMessage" ADD CONSTRAINT "UserMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMessage" ADD CONSTRAINT "UserMessage_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
