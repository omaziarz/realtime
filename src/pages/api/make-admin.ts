import { NextApiHandler } from "next";
import { secureApiRoute } from "@/lib/secureApiRoute";
import { PrismaClient } from "@prisma/client";

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

  await prisma?.user.update({
    data: { role: "ADMIN" },
    // @ts-ignore
    where: { id: session?.id as string },
  });

  res.status(200).json({ message: "Success" });
};

export default handler;
