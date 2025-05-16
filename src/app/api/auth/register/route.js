import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, username, email, password } = body;

    // Basic validation
    if (!fullName || !username || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user exists - be explicit about the return format
    const checkQuery = await neon(process.env.DATABASE_URL)`
      SELECT email, username FROM users 
      WHERE email = ${email} OR username = ${username}
    `;

    // Debug the response - you can remove this in production
    console.log("Check user query result:", JSON.stringify(checkQuery));

    // Safely check if there are any results
    if (checkQuery && Array.isArray(checkQuery) && checkQuery.length > 0) {
      // User exists - determine which field is duplicated
      const duplicateField =
        checkQuery[0].email === email ? "email" : "username";
      return NextResponse.json(
        { error: `This ${duplicateField} is already registered` },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user - be explicit about timestamp fields
    const insertQuery = await neon(process.env.DATABASE_URL)`
      INSERT INTO users (
        full_name, 
        username, 
        email, 
        password, 
        created_at, 
        updated_at
      )
      VALUES (
        ${fullName}, 
        ${username}, 
        ${email}, 
        ${hashedPassword}, 
        CURRENT_TIMESTAMP, 
        CURRENT_TIMESTAMP
      )
      RETURNING id, full_name, username, email
    `;

    // Debug the insert result - you can remove this in production
    console.log("Insert user result:", JSON.stringify(insertQuery));

    // Safely access the result
    if (insertQuery && Array.isArray(insertQuery) && insertQuery.length > 0) {
      return NextResponse.json(insertQuery[0], { status: 201 });
    } else {
      // If we get here, something went wrong with the insert
      throw new Error("Failed to create user - no rows returned");
    }
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { error: `Registration failed: ${error.message}` },
      { status: 500 }
    );
  }
}
