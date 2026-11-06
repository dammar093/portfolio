import { auth, signIn } from "@/auth";
import { error, success } from "@/lib/api-response";
import { DEFAULT_REDIRECT_ADMIN_ROUTE } from "@/routes";
import {  } from "next-auth";
import { NextRequest } from "next/server";
export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  const session = await auth()
  try {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: true,
      redirectTo: DEFAULT_REDIRECT_ADMIN_ROUTE
    })

    if (!res) {
      return error({ status: 401, message: "Invalid credentials" })
    }

    const token = session?.user.token
    return success({
      message: "Login successful", data: {
        token: token?.jti
      }
    })
  } catch (err: any) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return error({
            message: "Invalid credentials",
            status: 401
          })
        default: return error({
          message: "Something went wrong",
          status: 500
        })
      }
    }
    throw err
  }
}
