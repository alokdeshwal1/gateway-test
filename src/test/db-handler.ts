// Open source modules
import {connection, connect} from "mongoose"
// Private modules
import mongoDriver from "../db/mongo-driver"
import {ConfigUtilities} from "../utilities/config.utilities"

// Dynamically creating Mongo test database
const mongoDBURLString =  mongoDriver.getMongoURI(ConfigUtilities.MONGO_TEST_DB)

/**
 * Connect to the mongo db 
*/

export const connectDB = async (): Promise<void> => {
    const mongooseOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
    try {
        await connect(mongoDBURLString, mongooseOpts)
    }
    catch(err) {
        console.error("########################################### ", err)
    }
}

/**
 * Drop database, close the connection and stop mongod.
 */
export const closeDatabase = async (): Promise<void> => {
    await connection.dropDatabase()
    await connection.close()
}