import express from "express";
import { CredentialsProvider } from "../CredentialsProvider";
import jwt from "jsonwebtoken";

export interface IAuthTokenPayload {
  username: string;
}

function generateAuthToken(
  username: string,
  jwtSecret: string
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const payload: IAuthTokenPayload = {
      username,
    };
    jwt.sign(payload, jwtSecret, { expiresIn: "1d" }, (error, token) => {
      if (error) reject(error);
      else resolve(token as string);
    });
  });
}

export function registerAuthRoutes(
  app: express.Application,
  credentialsProvider: CredentialsProvider
) {
  app.post("/auth/register", async (req, res) => {
    const { username, password } = req.body;

    if (typeof username !== "string" || typeof password !== "string") {
      res.status(400).send({
        error: "Bad request",
        message: "Missing username or password",
      });
      return;
    }

    const success = await credentialsProvider.registerUser(username, password);

    if (!success) {
      res.status(409).send({
        error: "Conflict",
        message: "Username already taken",
      });
      return;
    }

    const token = await generateAuthToken(username, req.app.locals.JWT_SECRET);
    res.send(token);
  });

  app.post("/auth/login", async (req, res) => {
    const data = req.body;
    if (data.username === "" || data.password === "") {
      res.status(400).send("Please enter username and password");
      return;
    }

    const verified = await credentialsProvider.verifyPassword(
      data.username,
      data.password
    );
    if (verified) {
      const token = await generateAuthToken(
        data.username,
        req.app.locals.JWT_SECRET
      );
      res.send(token);
    } else res.status(401).send("Incorrect Username or password");
  });
}
