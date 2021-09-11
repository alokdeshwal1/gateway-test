class App { 
    constructor(private mongoDriver: any) {
        this.mongoDriver = mongoDriver;
        this.connectToMongoDB();
    }

     /**
     * @method connectToMongoDB
     * @author Alok Deshwal
     * @description Connect to mongodb server
     * @returns {void}
     */
    private async connectToMongoDB() {
        await this.mongoDriver.connectDB()
        console.log('Node.js Server is running');
    }
}
export default App;