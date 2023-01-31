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

  const allUsers = await prisma?.user.findMany({
    where: {
      role: "USER",
      id: {
        not: session.id,
      },
    },
  });

  res.status(200).json(allUsers);
};
export default handler;
