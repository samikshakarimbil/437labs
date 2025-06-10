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

  async getAllImages(search?: string) {
    const filter = search
      ? { name: { $regex: search, $options: "i" } } 
      : {};
    const images = await this.imageCollection.find(filter).toArray();

    const userIds = images.map(img => img.authorId); 
    const users = await this.userCollection
      .find({ _id: { $in: userIds } })
      .toArray();

      const userMap = Object.fromEntries(
        users.map((user) => [user._id.toString(), user])
      );

    // assemble final image objects with author info
    return images.map(img => ({
      id: img._id.toString(),
      src: img.src,
      name: img.name,
      author: {
        username: userMap[img.authorId]?.username || "Unknown"
      }
    }));
  }

  async updateImageName(imageId: string, newName: string): Promise<number> {
    const result = await this.imageCollection.updateOne(
        { _id: new ObjectId(imageId) },
        { $set: { name: newName } }
    );
    return result.matchedCount;
}

}
