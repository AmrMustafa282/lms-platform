import { auth } from "@clerk/nextjs/server";

export const isAuthorized =  () => {
  const { userId } = auth() ;
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return {userId} ;
};
