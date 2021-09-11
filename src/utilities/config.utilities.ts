
export class ConfigUtilities {
    // API env variables
    static readonly API_BASE_URL = process.env.API_BASE_URL
    static readonly AUTH_API = process.env.AUTH_API
    static readonly GET_EVENTS_API = process.env.GET_EVENTS_API
    static readonly API_FREQUENCY_IN_MS = process.env.API_FREQUENCY_IN_MS
    static readonly API_MAX_ATTEMPTS = process.env.API_MAX_ATTEMPTS
    static readonly API_RETRY_DELAY_IN_MS = process.env.API_RETRY_DELAY_IN_MS
    // MongoDB env variables
    static readonly MONGO_SERVER=process.env.MONGO_SERVER
    static readonly MONGO_PORT = process.env.MONGO_PORT
    static readonly MONGO_DEFAULT_DB = process.env.MONGO_DEFAULT_DB
    static readonly MONGO_AUTH_SOURCE = process.env.MONGO_AUTH_SOURCE
    static readonly MONGO_TEST_DB = process.env.MONGO_TEST_DB
    // Debug MODE 0 => OFF, 1 => ON
    static readonly DEBUG_MODE = process.env.DEBUG_MODE 
}