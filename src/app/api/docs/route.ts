import { ApiReference } from "@scalar/nextjs-api-reference";
import { auth } from "@/auth";

const reference = ApiReference({
  url: "/api/openapi",
  title: "Page CMS API",
});

export async function GET(request: Request) {
  const session = await auth();

  if (!session) {
    const signInUrl = new URL("/api/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", request.url);
    return Response.redirect(signInUrl);
  }

  return reference();
}
