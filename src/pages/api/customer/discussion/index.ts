import { NextApiHandler } from "next";
import { secureApiRoute } from "@/lib/secureApiRoute";

const handler: NextApiHandler = async (req, res) => {
  const session = await secureApiRoute(req, res, ["USER"]);
  if (!session) {
    res.status(401).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).end();
    return;
  }

  const discussionRequest = await prisma?.adminDiscussionRequest?.findUnique({
    where: {
      userId: session.id,
    },
    include: {
      adminDiscussionChat: true,
    },
  });

  res.status(200).json(discussionRequest || null);
};

export default handler;
