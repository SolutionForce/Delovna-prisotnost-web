import { auth } from "../../firebase";

export const getIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (user) {
    console.log(user.getIdToken())
    return await user.getIdToken();
  }
  return null;
};