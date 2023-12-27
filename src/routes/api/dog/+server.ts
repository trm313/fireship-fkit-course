import { error, json } from "@sveltejs/kit";
import type { RequestEvent, RequestHandler } from "./$types";

export const POST: RequestHandler = async (e: RequestEvent) => {
  let user = { admin: true };
  if (!user.admin) {
    throw error(401, "Unauthorized");
  }

  return json({ name: "dog" });
};
