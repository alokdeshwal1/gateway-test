// Open source modules
import { Schema, model } from "mongoose"
// Private modules
import {IHorseEvents} from "../interfaces/horse-event.interface"

// Sub-document schema
const _horseSchema: Schema =  new Schema({
    _id : {id:false},
    id: Number,
    name: String
})
// Main Schema
const horseEventSchema: Schema = new Schema({
    event: String,
    horse: _horseSchema,
    time: Number,
}, {
    timestamps: true
})
// finally export the model
export const HorseEventModel = model<IHorseEvents>('HorseEvent', horseEventSchema)