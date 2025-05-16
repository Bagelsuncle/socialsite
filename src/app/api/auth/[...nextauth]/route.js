import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcrypt";

// Configure NextAuth
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Query the database for the user
          const result = await neon(process.env.DATABASE_URL)`
            SELECT * FROM users WHERE email = ${credentials.email}
          `;

          // Debug the result structure
          console.log(
            "Login query result structure:",
            JSON.stringify({
              isArray: Array.isArray(result),
              hasRows: result?.rows !== undefined,
              length: Array.isArray(result)
                ? result.length
                : result?.rows?.length || 0,
            })
          );

          // Adapt to handle both possible return formats
          let user;
          if (Array.isArray(result) && result.length > 0) {
            user = result[0];
          } else if (result?.rows && result.rows.length > 0) {
            user = result.rows[0];
          } else {
            console.log("User not found");
            return null;
          }

          // Check password
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          // If password doesn't match, return null
          if (!passwordMatch) {
            console.log("Password doesn't match");
            return null;
          }

          // Return user object without password
          return {
            id: user.id,
            name: user.full_name,
            email: user.email,
            username: user.username,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
    // Add Google provider - uncomment when ready to implement
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
    // Add GitHub provider - uncomment when ready to implement
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login", // Error code passed in query string as ?error=
  },
  callbacks: {
    async jwt({ token, user }) {
      // If user object exists (from authorize), add custom fields
      if (user) {
        token.username = user.username;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass properties from the token to the session
      if (session?.user) {
        session.user.username = token.username;
        session.user.id = token.userId;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
