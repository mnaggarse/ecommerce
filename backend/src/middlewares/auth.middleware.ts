import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.jwt;

  try {
    if (!token) return res.status(401).json({ message: "Access denied" });

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as JwtPayload;
    req.userId = decoded.userId as string;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Internal server error" });
  }
};

export const authorize = (req: Request, res: Response, next: NextFunction) => {
  2
}