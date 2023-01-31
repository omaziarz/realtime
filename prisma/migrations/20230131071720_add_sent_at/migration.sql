/*
  Warnings:

  - A unique constraint covering the columns `[handlingAdminId]` on the table `AdminDiscussionChat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AdminDiscussionChat_handlingAdminId_key" ON "AdminDiscussionChat"("handlingAdminId");
