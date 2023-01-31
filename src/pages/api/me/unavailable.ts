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

  return res.status(200).json(
    await prisma?.user.update({
      data: { isAvailable: false },
      where: { id: session?.id as string },
    })
  );
};

export default handler;
