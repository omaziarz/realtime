import { NextApiHandler } from "next";
import { secureApiRoute } from "@/lib/secureApiRoute";

const handler: NextApiHandler = async (req, res) => {
  const session = await secureApiRoute(req, res, ["ADMIN", "USER"]);
  if (!session) {
    res.status(401).end();
    return;
  }

  const data = await prisma?.user.count({
    where: {
      role: "ADMIN",
      isAvailable: true,
    },
  });

  res.status(200).json({ count: data });
};

export default handler;
