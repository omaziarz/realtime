import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export type role = "ADMIN" | "USER";
export const secureApiRoute = async (
  req: NextApiRequest,
  res: NextApiResponse,
  authorizedRoles: role[]
): Promise<Session | null> => {
  const session = await getServerSession(req, res, authOptions);

  // @ts-ignore
  if (!session || !authorizedRoles.includes(session.role)) {
    return null;
  }
  return session;
};
