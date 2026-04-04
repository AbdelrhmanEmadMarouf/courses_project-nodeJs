const {body} = require('express-validator');

const validationSchema = () =>{
    return [
            body('title')
            .notEmpty()
            .withMessage('the title is empty')
            .isLength({min : 4})
            .withMessage('the title must be greater than four digits'),

            body('price')
            .notEmpty()
            .withMessage('price can not be empty')
            .isLength({min : 3})
            .withMessage('the price must be greater than three digits'),
    ]
}

module.exports = {
    validationSchema
}