import { NextApiHandler } from "next";
import { secureApiRoute } from "@/lib/secureApiRoute";
import { PrismaClient } from "@prisma/client";

const handler: NextApiHandler = async (req, res) => {
  const session = await secureApiRoute(req, res);

  console.log("session", session);

  await prisma?.user.update({
    data: { role: "USER" },
    // @ts-ignore
    where: { id: session?.id as string },
  });

  res.status(200).json({ message: "Success" });
};

export default handler;
