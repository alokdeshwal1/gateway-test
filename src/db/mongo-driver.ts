// Open source modules
import {connect} from 'mongoose'
// Private modules
import { ConfigUtilities, SecretUtilites } from '../utilities'

/**
 * The MongoDriver class defines the `getInstance` method that lets clients access
 * the unique MongoDriver instance.
 */
 class MongoDriver {
  private static instance: MongoDriver | undefined;

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() { 
    MongoDriver.instance = undefined
  }

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): MongoDriver {
      if (!MongoDriver.instance)
        MongoDriver.instance = new MongoDriver();
      
      return MongoDriver.instance;
  }

  /**
   * @method getMongoURI
   * @author Alok Deshwal
   * @description Prepare the MongoDB URI
   * @param {String} db database name
   * @returns {void}
   */
  getMongoURI(db = ConfigUtilities.MONGO_DEFAULT_DB): string {
    // MongoDB settings
    const server = ConfigUtilities.MONGO_SERVER
    const port = ConfigUtilities.MONGO_PORT
    const username = SecretUtilites.MONGO_USERNAME
    const password = SecretUtilites.MONGO_PASSWORD
    const authSource = ConfigUtilities.MONGO_AUTH_SOURCE

    const mongoDBURLString = `mongodb://${username}:${password}@${server}:${port}/${db}?authSource=${authSource}`;

    return mongoDBURLString
  }
  /**
   * @method connect
   * @author Alok Deshwal
   * @description Connect to mongodb via mongoose
   * @returns {void}
   */
  async connectDB(): Promise<void> {
    // let mongoDBURLString = `mongodb://root:scraper123@localhost:27018/horse?authSource=admin`;
    await (async () => {
      try {
        const mongoDBURLString = this.getMongoURI()
        console.log(`MongoDB Connection string: ${mongoDBURLString}`);
        await connect(mongoDBURLString, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        console.log('Database connection successful')
      } catch (err) {
        console.error("Database connection error", err)
        process.exit();
      }
    })()
  }
}

export default MongoDriver.getInstance()