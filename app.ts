class App { 
    constructor(private mongoDriver: any) {
        this.mongoDriver = mongoDriver;
    }

     /**
     * @method connectToMongoDB
     * @author Alok Deshwal
     * @description Connect to mongodb server
     * @returns {void}
     */
    async connectToMongoDB() {
        await this.mongoDriver.connectDB()
    }
}
export default App;