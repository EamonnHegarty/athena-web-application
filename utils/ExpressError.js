//our own express error handler which will extend the error class
class ExpressError extends Error {
    constructor(message, statusCode){
        //call super constructor
        super();
        //update message
        this.message = message;
        //update status code
        this.statusCode = statusCode; 
    }
}

//export
module.exports = ExpressError;