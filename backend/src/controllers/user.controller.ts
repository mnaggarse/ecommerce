import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Request, Response } from "express";
import { usersTable } from "../db/schema.js";

const db = drizzle(process.env.DATABASE_URL!);

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await db.select().from(usersTable);

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, parseInt(id)));

    if (user.length == 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, parseInt(id)));

    if (user.length == 0) {
      return res.status(404).json({ message: "User not found" });
    }

    await db.delete(usersTable).where(eq(usersTable.id, parseInt(id)));

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
