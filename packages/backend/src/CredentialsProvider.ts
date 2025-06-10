import { Collection, MongoClient } from "mongodb";
import bcrypt from "bcrypt";

interface ICredentialsDocument {
    username: string;
    password: string;
}

export class CredentialsProvider {
    private readonly collection: Collection<ICredentialsDocument>;

    constructor(mongoClient: MongoClient) {
        const COLLECTION_NAME = process.env.CREDS_COLLECTION_NAME;
        if (!COLLECTION_NAME) {
            throw new Error("Missing CREDS_COLLECTION_NAME from env file");
        }
        this.collection = mongoClient.db().collection<ICredentialsDocument>(COLLECTION_NAME);
    }

    async registerUser(username: string, plaintextPassword: string) {
        const existing = await this.collection.findOne({ username });
        if(existing){
            return false;
        }
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(plaintextPassword, salt);

        const newUser: ICredentialsDocument = {
            username,
            password: hashed,
        };
        await this.collection.insertOne(newUser);
        return true;
    }

    async verifyPassword(username: string, plaintextPassword: string) {
        const userDB = await this.collection.findOne({ username: username })

        if (userDB) {
            const hashedDBpass = userDB.password

            console.log(plaintextPassword)
            const verified = await bcrypt.compare(plaintextPassword, hashedDBpass);
            console.log(verified)
            return verified

        } else return false
    }
}
