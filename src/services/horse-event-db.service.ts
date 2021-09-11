// Private Modules
import {IHorseEvents} from "../interfaces/horse-event.interface"
import { AppErrorHandlerUtilities as AppError} from "../utilities/app-error-handler.utilities"

// Horse Events Mapper
class MapHorseEventData {
    private event: string
    private horse: {id: number, name: string}
    private time: number

    constructor(eventsData: IHorseEvents) {
        this.event = eventsData.event
        this.horse = { id: eventsData.horse.id, name: eventsData.horse.name }
        this.time = eventsData.time
    } 
}

class HorseEventDBService {
    private model: any
    // initialize default properties
    constructor(HorseEventModel: any) {
       this.model = HorseEventModel
    }

     /**
     * @method insertEvents
     * @author Alok Deshwal
     * @param {IHorseEvents} eventsData
     * @description Instantiate the Model and create an entry in DB with the given data
     */
    async insertEvents(eventsData: IHorseEvents): Promise<void> {
        console.debug('Following data will be inserted into MongoDB ', eventsData)
        try {
            // Create event data through Mapper
            const mappedEventsData = new MapHorseEventData(eventsData)
            // Instantiate the model
            const horseEventInstance = new this.model(mappedEventsData)
            // save the data
            const response = await horseEventInstance.save()
            console.debug('Horse event successfully added to MongoDB', response)
        }
        catch(err: any) {
            console.error('Data insertion failed, got Error', err.message)
            throw new AppError(err.message, err.status, err)
        }
    }
}
export default HorseEventDBService