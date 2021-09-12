// Private modules
import mongoDriver from "./src/db/mongo-driver"
import {HorseEventModel} from "./src/models/horse-event.model"
import App from './app'
import { HorseEventService } from './src/services/horse-event.service'
import {AppErrorHandlerUtilities as AppError, ConfigUtilities} from "./src/utilities"

const horseEventService = new HorseEventService(HorseEventModel)
const API_FREQUENCY_IN_MS: number | undefined = ConfigUtilities.API_FREQUENCY_IN_MS as number | undefined
// bootstrap the app
(async () => {
    try {
        await new App(mongoDriver).connectToMongoDB()
        console.log('Node.js Server is running');
        // Login into server through REST API
        await horseEventService.login()
        await new Promise((resolve:any, reject:any) => {
            const id = setInterval(async () => {
                try {
                    console.log('***************************Log Separator*****************************')
                    // Start receiving horse events data through REST API
                    await horseEventService.getHorseEvents()
                }
                catch(err:any) {
                    // Stop setInterval
                    clearInterval(id)
                    const errMsg = 'Error while executing getHorseEvents'
                    reject(new AppError(errMsg, err.httpCode, err.message))
                }
            },  API_FREQUENCY_IN_MS || 60000) // default to 60000 milliseconds
        })
       
    } catch (err:any) {
        console.log('Login Failed')
        console.error(JSON.stringify(err))
        if(Number(ConfigUtilities.DEBUG_MODE))
            console.debug(err.stack)
        console.log("Process exited")
        process.exit()
    }
})()
process.on('uncaughtException', (error:any, origin:any) => {
    console.log('----- Uncaught exception -----')
    console.error(error)  
    console.log('----- Exception origin -----')
    console.log(origin)
})

process.on('unhandledRejection', (reason:any, promise:any) => {
    console.log('----- Unhandled Rejection at -----')
    console.log(promise)
    console.log('----- Reason -----')
    console.log(reason)
})