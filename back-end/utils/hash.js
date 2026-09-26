import bcrypt from 'bcrypt';
export const hashPassword = async (pwd) => await bcrypt.hash(pwd, 10);
export const comparePassword = async (pwd, hash) => await bcrypt.compare(pwd, hash);