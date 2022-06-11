//wrapper function which will wrap around our routes
//this code will return a function that accepts a function
//it then executes the function and catches error
//this saves the duplication of try catch on all routes
module.exports = func => {
    return(req, res, next) => {
        func(req, res, next).catch(next); //pass error to next
    }
}