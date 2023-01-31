import {NextApiRequest, NextApiResponse} from "next";
import {getServerSession, Session} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

export const secureApiRoute = async (req: NextApiRequest, res: NextApiResponse): Promise<Session> => {
  const session = await getServerSession(req, res, authOptions)

  if(!session) { // @ts-ignore
    return res.status(401).end();
  }
  return session;
}