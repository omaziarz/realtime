-- CreateTable
CREATE TABLE "AdminDiscussionChat" (
    "adminDiscussionRequestId" TEXT NOT NULL,
    "handlingAdminId" TEXT,

    CONSTRAINT "AdminDiscussionChat_pkey" PRIMARY KEY ("adminDiscussionRequestId")
);

-- CreateTable
CREATE TABLE "AdminDiscussionChatMessage" (
    "adminDiscussionChatId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "AdminDiscussionChatMessage_pkey" PRIMARY KEY ("adminDiscussionChatId")
);

-- AddForeignKey
ALTER TABLE "AdminDiscussionChat" ADD CONSTRAINT "AdminDiscussionChat_adminDiscussionRequestId_fkey" FOREIGN KEY ("adminDiscussionRequestId") REFERENCES "AdminDiscussionRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminDiscussionChat" ADD CONSTRAINT "AdminDiscussionChat_handlingAdminId_fkey" FOREIGN KEY ("handlingAdminId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminDiscussionChatMessage" ADD CONSTRAINT "AdminDiscussionChatMessage_adminDiscussionChatId_fkey" FOREIGN KEY ("adminDiscussionChatId") REFERENCES "AdminDiscussionChat"("adminDiscussionRequestId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminDiscussionChatMessage" ADD CONSTRAINT "AdminDiscussionChatMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
