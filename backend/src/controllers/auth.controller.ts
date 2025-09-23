import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { usersTable } from "../db/schema.js";
import createJwtToken from "../lib/createJwtToken.js";

const db = drizzle(process.env.DATABASE_URL!);

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    // Checks for user input data
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (user.length !== 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Encrypt password before saving into databse
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: typeof usersTable.$inferInsert = {
      name,
      email,
      password: hashedPassword,
    };

    // Get new user id after adding it to database
    const newUserId = await db
      .insert(usersTable)
      .values(newUser)
      .returning({ newUserId: usersTable.id });

    // Create JWT token and assign it to a cookie
    const token = jwt.sign({ userId: newUserId }, process.env.JWT_SECRET_KEY!, {
      expiresIn: "1h",
    });
    res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 });

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Checks for user input data
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (user.length == 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user[0].password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token and assign it to a cookie
    const token = createJwtToken(user[0].id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 });

    res.status(201).json({ message: "User loggedin successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
