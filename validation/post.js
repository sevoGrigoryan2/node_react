const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validatePostInput(data) {
    let errors = {};

    data.text = !isEmpty(data.text) ? data.text : '';

    if (Validator.isEmpty(data.text)) {
        errors.text = 'Text field is required';
    }
    if(!Validator.isLength(data.text,{min:10,max:400})){
        errors.text = "Post must be between 10 and 300 charackters";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
