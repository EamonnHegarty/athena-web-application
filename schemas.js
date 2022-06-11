const Joi = require("joi");

//joi schema validator
module.exports.expenseSchema = Joi.object({
    expenses: Joi.object({ 
        totalCost: Joi.number().required().min(0),  
        location: Joi.string().required(),
        expenseType: Joi.string().required(), 
        expenseDate: Joi.date().required(), 
        currentDate: Joi.date().required(), 
        expenseDescription: Joi.string().required()
    }).required()
})