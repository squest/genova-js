import jwt from "jsonwebtoken";

export function authenticateToken(req, reply, done) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null || token == undefined) {
    reply.code(401).send({ status: "error", message: "Unauthorized" }); // if there isn't any token
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      reply.code(403).send({ status: "error", message: "Forbidden" });
      return;
    }
    req.userId = user.sub;
    done(); // pass the execution off to whatever request the client intended
  });
}
