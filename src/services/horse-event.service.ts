// Open source modules
import request from 'requestretry'
import http from 'http'
// Private modules
import horseEventDBService from "./horse-event-db.service"
import {IHorseEvents} from "../interfaces/horse-event.interface"
import { AppErrorHandlerUtilities as AppError, HTTP_METHODS, HTTP_STATUS_CODES, ERROR_CODES, ConfigUtilities, SecretUtilites } from '../utilities'

// Override Error class with extra properties
interface IResponseError extends Error {
    code ? : string
    statusCode ? : number
}

// Override http.IncomingMessage with extra properties
interface IRetryResponse extends http.IncomingMessage {
    attempts : number
}

interface IRetryStrategyType {
    mustRetry: boolean,
    options: any
}

export class HorseEventService {
    private request: any
    private headers: {
        Authorization: string
    }
    private horseEventDBService: horseEventDBService

    constructor(HorseEventModel: any) {
        this.request = request
        this.headers = {
            Authorization: `Bearer xxxxxx`
        }
        // Create instance of horseEventDBService
        this.horseEventDBService = new horseEventDBService(HorseEventModel)
    }

    /**
     * @method login
     * @author Alok Deshwal
     * @description Login into the server to get the token for further APIs
     * @returns {void}
     */
    async login(): Promise <string> {
        console.info('Logging into the server with')
        let token = undefined
        // create body data
        const body = {
            email: SecretUtilites.AUTH_EMAIL,
            password: SecretUtilites.AUTH_PWD
        }
        try {
            console.log('email and pwd', body)
            const url = `${ConfigUtilities.API_BASE_URL}${ConfigUtilities.AUTH_API}`
            const loginResponse = await this.request({
                url,
                method: HTTP_METHODS.POST,
                body,
                json: true,
                fullResponse: true // (default) To resolve the promise with the full response or just the body
            })
            // Get JSON response
            const jsonResponse = loginResponse.toJSON()
            // status code === 401, throw error
            if (jsonResponse.statusCode === HTTP_STATUS_CODES.UNAUTH_401)
                throw new AppError("Invalid Credentials", HTTP_STATUS_CODES.UNAUTH_401)
    
            console.debug('Login API Response ', jsonResponse)
            // parse the token
            token = jsonResponse.body.token
            // set authorization headers
            this.headers.Authorization = `Bearer ${token}`
            console.info('Login into the server successful')
        } catch (err: any) {
            const statusCode: number = err.status || err.statusCode || 500
            if(err instanceof AppError)
                throw err
            else
                throw new AppError(err, statusCode)
        }
        return token
    }

    /**
     * @method _getHorseEvents
     * @author Alok Deshwal
     * @description call /results API with token to get the events
     * @returns {object}
     */
    async _getHorseEvents(): Promise<IHorseEvents> {
        console.info('Fetching the events from /results API')
        let eventAPIResponse: any = undefined
        try {
            const url = `${ConfigUtilities.API_BASE_URL}${ConfigUtilities.GET_EVENTS_API}`
            eventAPIResponse = await this.request({
                url,
                method: HTTP_METHODS.GET,
                json: true,
                headers: this.headers,
                retryDelay: ConfigUtilities.API_RETRY_DELAY_IN_MS,
                maxAttempts: ConfigUtilities.API_MAX_ATTEMPTS,
                retryStrategy: this.retryStrategy.bind(this),
                fullResponse: true // (default) To resolve the promise with the full response or just the body
            })

            // converting to JSON
            eventAPIResponse = eventAPIResponse.toJSON()

            if (eventAPIResponse.statusCode === HTTP_STATUS_CODES.UNAUTH_401)
                throw new AppError('Access Denied', HTTP_STATUS_CODES.UNAUTH_401)

            // if status code === 204, throw error
            if (eventAPIResponse.statusCode === HTTP_STATUS_CODES.NO_CONTENT_204)
                throw new AppError('All attempts exhausted', HTTP_STATUS_CODES.NO_CONTENT_204)
            
            console.info('Horse events fetched successfully')
            console.debug(eventAPIResponse.body)
        } catch (err: any) {
            console.error('Error while fetching horse events')
            const statusCode: number = err.status || err.statusCode || 500
            if(err instanceof AppError)
                throw err
            else
                throw new AppError(err.message, statusCode)
        }
        const horseEventResponse:IHorseEvents = eventAPIResponse.body || undefined
        return horseEventResponse
    }
    /**
     * @method retryStrategy
     * @author Alok Deshwal
     * @description Retry strategy
     * @param  {Null | Object} err
     * @param  {Object} response
     * @param  {Object} body
     * @param  {Object} options copy 
     * @return {Boolean} true if the request should be retried
     */

    async retryStrategy(err: IResponseError, response: IRetryResponse, body: any, options: any): Promise <IRetryStrategyType> {
        let flag = false
        const localOptions: IRetryStrategyType  = {
            mustRetry: false,
            options
        }

        // if /results API response is 401, attempt to login again
        if (response && response.statusCode === HTTP_STATUS_CODES.UNAUTH_401) { // request is un-authorize
            console.error('Token Expired, self re-authenticating')
            try {
                const token = await this.login()
                options.headers = {
                    Authorization: `Bearer ${token}`
                }
            } catch (err: any) {
                if (err.statusCode === HTTP_STATUS_CODES.UNAUTH_401)
                    return localOptions
            }
            flag = true
        }
        // is there a timeout error
        const errorCodeCheck: boolean = err && (err.code === ERROR_CODES.ESOCKETTIMEDOUT || err.code === ERROR_CODES.ETIMEDOUT)
        // retry the request if we had an error OR if the response was a 'Server is busy/Service Unavailable' OR timeout
        const isTrue: boolean = !!err || errorCodeCheck || response.statusCode === HTTP_STATUS_CODES.SERVICE_UNAVAILABLE_503 || response.statusCode === HTTP_STATUS_CODES.NO_CONTENT_204

        if (isTrue || flag) {
            if (response)
                console.warn(`Retrying Attempt No: ${response.attempts}`)
            localOptions.mustRetry = true
        }
        return localOptions
    }

    /**
     * @method getHorseEvents
     * @author Alok Deshwal
     * @description Call _getHorseEvents, get the response, insert the horse event data into DB
     */
    async getHorseEvents(): Promise < void > {
        try {
            console.log('getHorseEvents called')
            const response = await this._getHorseEvents()
            await this.horseEventDBService.insertEvents(response)
        }
        catch(err:any) {
            console.error('getHorseEvents execution failed, reason is: ', err.message)
            throw err;
        }
    }
}