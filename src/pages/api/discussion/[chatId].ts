import { NextApiHandler } from "next";
import { secureApiRoute } from "@/lib/secureApiRoute";

const handler: NextApiHandler = async (req, res) => {
  const session = await secureApiRoute(req, res, ["ADMIN", "USER"]);
  if (!session) {
    res.status(401).end();
    return;
  }

  const { chatId } = req.query;

  if (req.method === "GET") {
    const messages = await prisma?.adminDiscussionChatMessage.findMany({
      where: {
        adminDiscussionChatId: chatId as string,
      },
      orderBy: {
        sentAt: "asc",
      },
    });

    res.status(200).json(messages);
    return;
  }

  if (req.method === "POST") {
    const message = await prisma?.adminDiscussionChatMessage.create({
      data: {
        content: req.body.content,
        adminDiscussionChatId: chatId as string,
        senderId: session.id,
      },
    });

    res.status(200).json(message);
    return;
  }
};
export default handler;
