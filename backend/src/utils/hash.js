// Password hashing and comparison using bcrypt with 12 salt rounds

import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};
