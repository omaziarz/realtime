import { NextApiHandler } from "next";
import { secureApiRoute } from "@/lib/secureApiRoute";

const handler: NextApiHandler = async (req, res) => {
  const session = await secureApiRoute(req, res, ["ADMIN", "USER"]);
  if (!session) {
    res.status(401).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).end();
    return;
  }

  return res.status(200).json(
    await prisma?.user.findUnique({
      where: {
        // @ts-ignore
        id: session.id,
      },
    })
  );
};

export default handler;
