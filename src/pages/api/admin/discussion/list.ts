import { NextApiHandler } from "next";
import { secureApiRoute } from "@/lib/secureApiRoute";

const handler: NextApiHandler = async (req, res) => {
  const session = await secureApiRoute(req, res, ["ADMIN"]);
  if (!session) {
    res.status(401).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).end();
    return;
  }

  const discussionRequest = await prisma?.adminDiscussionRequest.findMany({
    include: { user: true },
  });

  res.status(200).json(discussionRequest);
};
export default handler;
