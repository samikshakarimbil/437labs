import { MongoClient, Collection, ObjectId } from "mongodb";

interface IImageDocument {
  _id: ObjectId;
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
  private userCollection: Collection<IUserDocument>;

  constructor(private readonly mongoClient: MongoClient) {
    const imagesName = process.env.IMAGES_COLLECTION_NAME;
    const usersName = process.env.USERS_COLLECTION_NAME;

    if (!imagesName || !usersName) {
      throw new Error("Missing collection name(s) in .env");
    }

    this.imageCollection = this.mongoClient.db().collection<IImageDocument>(imagesName);
    this.userCollection = this.mongoClient.db().collection<IUserDocument>(usersName);
  }

  async getAllImages() {
    const images = await this.imageCollection.find().toArray();

    // Step 1: get all unique authorIds from images
    const authorIds = [...new Set(images.map(img => img.authorId))];

    // Step 2: fetch users by those IDs
    const users = await this.userCollection
      .find({ _id: { $in: authorIds } })
      .toArray();

    // Step 3: create lookup table
    const userMap: Record<string, IUserDocument> = {};
    for (const user of users) {
      userMap[user._id] = user;
    }

    // Step 4: assemble final image objects with author info
    return images.map(img => ({
      id: img._id.toString(),
      src: img.src,
      name: img.name,
      author: {
        username: userMap[img.authorId]?.username || "Unknown"
      }
    }));
  }
}
