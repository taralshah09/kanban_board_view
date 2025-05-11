import jwt from "jsonwebtoken";

export const createAndSaveToken = async (userId, res) => {
  const token = await jwt.sign({userId}, process.env.JWT_TOKEN, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    httpOnly: "true",
    sameSite: "strict",
    secure: false,
  });
  return token;
};
