// Open source modules
import {stub} from 'sinon'

// Private modules
import {connectDB, closeDatabase} from './db-handler'
import {HorseEventService} from "../services/horse-event.service"
import {HorseEventModel} from "../models/horse-event.model"
import {IHorseEvents} from "../interfaces/horse-event.interface"

describe("Horse Events Service Test", () => {

    beforeAll(async () => {
        await connectDB()
        await HorseEventModel.deleteMany({})
    })
    afterAll(async () => {
        await closeDatabase()
    })
    it('has a module', () => {
        expect(HorseEventService).toBeDefined
    })

    it('Get And Update horse events', async () => {
        const horseEventService = new HorseEventService(HorseEventModel)
        const horseEvents: IHorseEvents = {
            event: "finish",
            horse: {
                id: 17,
                name: "Aspen"
            },
            time: 10116
        }
        // overriding the behaviour of __getHorseEvents method using sinon.stub method
        const horseEventStub = stub(horseEventService, "_getHorseEvents").returns(Promise.resolve(horseEvents))
        await horseEventService.getHorseEvents()
        expect(horseEventStub.calledOnce).toBeTruthy
    })
})