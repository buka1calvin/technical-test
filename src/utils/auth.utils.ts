import Jwt from "jsonwebtoken";

export const generateToken = (data: any, options?: any) => {
  const token = Jwt.sign({ data }, process.env.JWT_SECRET as string, options);
  return token;
};

export const verifyToken = (token: any) => {
  try {
    const obj = Jwt.verify(token, process.env.JWT_SECRET as string);
    return obj;
  } catch (error) {
    return null;
  }
};
