import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {
                    type: "email",
                    label: "Admin email:",
                    placeholder: "Enter email..."
                },
                password: {
                    type: "password",
                    label: "Admin password:",
                    placeholder: "Enter password..."
                }
            },
            authorize: async (credentials) => {
                const email = credentials?.email as string | undefined
                const password = credentials?.password as string | undefined

                if (!email || !password) {
                    throw new Error("Please enter both email and password")
                }

                const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env

                if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
                    throw new Error("Invalid credentials")
                }

                // Return a user object, NOT boolean true
                return {
                    name: "Admin User",
                    email: ADMIN_EMAIL,
                }
            }
        })
    ],
    secret: process.env.AUTH_SECRET // NextAuth standard secret
})