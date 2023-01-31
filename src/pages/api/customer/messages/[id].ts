import { NextApiHandler } from "next";
import { secureApiRoute } from "@/lib/secureApiRoute";

const handler: NextApiHandler = async (req, res) => {
  const session = await secureApiRoute(req, res, ["USER"]);
  if (!session) {
    res.status(401).end();
    return;
  }

  if (req.method === "GET") {
    const messages = await prisma?.userMessage.findMany({
      where: {
        OR: [
          {
            senderId: { equals: session.id },
            receiverId: { equals: req.query?.id as string },
          },
          {
            senderId: req.query.id as string,
            receiverId: session.id,
          },
        ],
      },
    });

    res.status(200).json(messages);
    return;
  }

  if (req.method === "POST") {
    const message = await prisma?.userMessage.create({
      data: {
        content: req.body.content,
        senderId: session.id,
        receiverId: req.query.id as string,
      },
    });

    res.status(200).json(message);
    return;
  }
};

export default handler;
