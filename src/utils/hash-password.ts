import bcrypt from "bcryptjs";

export function hashedPassword(password: string) {
  return bcrypt.hash(password, 12);
}
