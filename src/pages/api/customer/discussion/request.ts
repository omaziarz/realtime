import { NextApiHandler } from "next";
import { secureApiRoute } from "@/lib/secureApiRoute";

const handler: NextApiHandler = async (req, res) => {
  const session = await secureApiRoute(req, res, ["USER"]);
  if (!session) {
    res.status(401).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const discussionRequest = await prisma?.adminDiscussionRequest.upsert({
    create: {
      userId: session.id,
      status: "PENDING",
    },
    update: {
      status: "PENDING",
    },
    where: {
      userId: session.id,
    },
  });

  res.status(200).json(discussionRequest);
};
export default handler;
