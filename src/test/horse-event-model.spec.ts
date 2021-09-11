process.env.NODE_ENV = 'test'
import {connectDB, closeDatabase} from './db-handler'
import {HorseEventModel} from "../models/horse-event.model"

describe("Horse Events Model Test", () => {
    beforeAll(async ()=> {
        await connectDB()
        // remove all records
        await HorseEventModel.deleteMany({}) 
    })
    afterAll(async () => {
        process.env.NODE_ENV = 'development'
        // drop the database and close the mongodb connection
        await closeDatabase()
    })
    it('has a module', () => {
        expect(HorseEventModel).toBeDefined
    })

    it('Save horse events', async ()=> {
        const horseEventsInstance = new HorseEventModel({
            event: 'start',
            horse:{ id: 1, name: 'Horse-A' },
            time: 12000
        })
        const savedData = await horseEventsInstance.save()
        const expected = 'start'
        expect(savedData.event).toEqual(expected)
    })
})
