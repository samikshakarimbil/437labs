import express, { Request, Response, NextFunction} from "express";
import path from "path";
import dotenv from "dotenv";
import { ValidRoutes } from "./shared/ValidRoutes.js";
import { connectMongo } from "./connectMongo";
import { ImageProvider } from "./ImageProvider";
import { registerImageRoutes } from "./routes/imageRoutes.js";
import { registerAuthRoutes } from "./routes/authRoutes.js";
import { CredentialsProvider } from "./CredentialsProvider";
import type { IAuthTokenPayload } from "./routes/authRoutes";
import jwt from "jsonwebtoken"

dotenv.config()

const mongoClient = connectMongo();
const ip = new ImageProvider(mongoClient);
const cp = new CredentialsProvider(mongoClient);

const app = express();
const PORT = process.env.PORT || 3000;
const STATIC_DIR = process.env.STATIC_DIR || "public";
const JWT_SECRET = process.env.JWT_SECRET;
const IMAGE_UPLOAD_DIR = process.env.IMAGE_UPLOAD_DIR || "uploads";

app.locals.JWT_SECRET = JWT_SECRET;

app.use(express.static(STATIC_DIR));
app.use("/uploads", express.static(IMAGE_UPLOAD_DIR))
app.use(express.json());

declare module "express-serve-static-core" {
  interface Request {
      user?: IAuthTokenPayload 
  }
}

export function verifyAuthToken(
  req: Request,
  res: Response,
  next: NextFunction 
) {
  const authHeader = req.get("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
      res.status(401).end();
  } else { 
      jwt.verify(token, req.app.locals.JWT_SECRET as string, (error, decoded) => {
          if (decoded) {
              req.user = decoded as IAuthTokenPayload;
              next();
          } else {
              res.status(403).end();
          }
      });
  }
}

app.use("/api/*", verifyAuthToken);

registerImageRoutes(app, ip);
registerAuthRoutes(app, cp);

app.get("/api/hello", (req, res) => {
  res.send("Hello world");
});
  
app.get(Object.values(ValidRoutes), (req, res) => {
  res.sendFile("index.html", { root: STATIC_DIR });
});

app.get("/images/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "..", STATIC_DIR, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
