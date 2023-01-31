-- CreateTable
CREATE TABLE "UserChat" (
    "id" TEXT NOT NULL,

    CONSTRAINT "UserChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserChatMessage" (
    "messageId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserChatMessage_pkey" PRIMARY KEY ("messageId")
);

-- CreateTable
CREATE TABLE "_userChats" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_userChats_AB_unique" ON "_userChats"("A", "B");

-- CreateIndex
CREATE INDEX "_userChats_B_index" ON "_userChats"("B");

-- AddForeignKey
ALTER TABLE "UserChatMessage" ADD CONSTRAINT "UserChatMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "UserChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChatMessage" ADD CONSTRAINT "UserChatMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userChats" ADD CONSTRAINT "_userChats_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userChats" ADD CONSTRAINT "_userChats_B_fkey" FOREIGN KEY ("B") REFERENCES "UserChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
