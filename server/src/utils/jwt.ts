import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET!;
export type JWTPayload = { id: number; role: string; name: string; email: string };

export const sign = (p: JWTPayload) => jwt.sign(p, secret, { expiresIn: "7d" });
export const verify = (token: string) => jwt.verify(token, secret) as JWTPayload;
