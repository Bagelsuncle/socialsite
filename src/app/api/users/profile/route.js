// src/app/api/users/profile/route.js
import { getServerSession } from "next-auth";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get the current session
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Query the database for user details
    const result = await neon(process.env.DATABASE_URL)`
      SELECT id, username, full_name, email, created_at, updated_at
      FROM users
      WHERE email = ${session.user.email}
    `;

    let user;
    if (Array.isArray(result) && result.length > 0) {
      user = result[0];
    } else if (result?.rows && result.rows.length > 0) {
      user = result.rows[0];
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the user data without sensitive information like password
    return NextResponse.json({
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
