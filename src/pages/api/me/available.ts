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

  const data = await prisma?.user.update({
    data: { isAvailable: true },
    where: { id: session?.id as string },
  });

  return res.status(200).json(data);
};

export default handler;
