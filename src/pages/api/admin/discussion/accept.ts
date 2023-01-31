import { NextApiHandler } from "next";
import { secureApiRoute } from "@/lib/secureApiRoute";

const handler: NextApiHandler = async (req, res) => {
  const session = await secureApiRoute(req, res, ["ADMIN"]);
  if (!session) {
    res.status(401).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  console.log(req.body.id);

  const discussionRequest = await prisma?.adminDiscussionRequest.update({
    data: {
      status: "ACCEPTED",
    },
    where: {
      userId: req.body.id,
    },
  });

  res.status(200).json(discussionRequest);
};
export default handler;
