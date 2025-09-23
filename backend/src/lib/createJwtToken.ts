import jwt from "jsonwebtoken";

const createJwtToken = (id: number) => {
  const token = jwt.sign({ userId: id }, process.env.JWT_SECRET_KEY!, {
    expiresIn: "1h",
  });
  return token;
};

export default createJwtToken;
