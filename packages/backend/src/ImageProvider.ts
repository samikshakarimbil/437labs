import { MongoClient, Collection, ObjectId } from "mongodb";
import type { IAuthTokenPayload } from "routes/authRoutes";

interface IImageDocument {
  _id?: ObjectId;
  src: string;
  name: string;
  authorId: string;
}

interface IUserDocument {
  _id: string;
  username: string;
}

export class ImageProvider {
  private imageCollection: Collection<IImageDocument>;

  constructor(private readonly mongoClient: MongoClient) {
    const imagesName = process.env.IMAGES_COLLECTION_NAME;
    const usersName = process.env.USERS_COLLECTION_NAME;

    if (!imagesName || !usersName) {
      throw new Error("Missing collection name(s) in .env");
    }

    this.imageCollection = this.mongoClient
      .db()
      .collection<IImageDocument>(imagesName);
  }

  async getAllImages(search?: string) {
    const query: any = {};
    if (search && search.trim().length > 0) {
      query.name = { $regex: search, $options: "i" };
    }

    const images = await this.imageCollection.find(query).toArray();

    const result = images.map((img, index) => ({
      ...img,
      key: img._id?.toString() ?? `${img.name}-${index}`,
      author: {
        username: img.authorId,
        email: "fake@fake.com",
      },
    }));

    return result;
  }

  async updateImageName(imageId: string, newName: string): Promise<number> {
    const result = await this.imageCollection.updateOne(
      { _id: new ObjectId(imageId) },
      { $set: { name: newName } }
    );
    return result.matchedCount;
  }

  async checkOwner(user: IAuthTokenPayload, imageId: string) {
    console.log(user.username);

    const result = await this.imageCollection.findOne({
      _id: new ObjectId(imageId),
    });
    if (result) {
      if (result.authorId === user.username) {
        return true;
      }
    } else return false;
  }

  async createImage(
    srcEnd: string,
    userFileName: string,
    reqUser: IAuthTokenPayload
  ) {
    const username = reqUser.username;
    const srcFull = `/uploads/${srcEnd}`;
    const result = await this.imageCollection.insertOne({
      src: srcFull,
      name: userFileName,
      authorId: username,
    });
    if (result) {
      return true;
    } else return false;
  }
}
