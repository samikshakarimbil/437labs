import express from "express";
import { ImageProvider } from "../ImageProvider";
import { ObjectId } from "mongodb";

export function registerImageRoutes(
  app: express.Application,
  imageProvider: ImageProvider
) {
  app.get("/api/images", async (req, res) => {
    function waitDuration(numMs: number): Promise<void> {
      return new Promise((resolve) => setTimeout(resolve, numMs));
    }

    const data = await imageProvider.getAllImages();
    await waitDuration(1500);
    res.send(data);
  });

  app.get("/api/images/search", async (req, res) => {
    const query = req.query.query?.toString();
    imageProvider.getAllImages(query).then((result) => {
      res.json(result);
    });
  });
  
  app.put("/api/images/:id", express.json(), (req, res) => {
    const imageId = req.params.id;
    const newName = req.body.name;

    if (!ObjectId.isValid(imageId)) {
      res.status(404).send({
          error: "Not Found",
          message: "Image does not exist"
      });
      return;
  }

  if (typeof newName !== "string") {
    res.status(400).send({
      error: "Bad Request",
      message: "Invalid 'name' in request body"
    });
    return;
  }

  if (newName.length > 100) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: `Image name exceeds 100 characters`
    });
    return;
  }
    
    imageProvider
      .updateImageName(imageId, newName)
      .then((count) => {
        if (count === 0) {
          return res.status(404).send({
            error: "Not Found",
            message: "Image does not exist"
        });
        }
        return res.status(204).send(); 
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Server error");
      });
  });
  
  
}
