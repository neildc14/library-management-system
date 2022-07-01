JUNE 24 2022

i have learned all about how to build a create form for a genre combining with the express-validator to validate and sanitize the data it gathered from the form the maintain a secured server.

to use the express-validator in the code,
var {body, validationResult}

however, i did not use the validationResult. instead, i implemented the error handling in front end to filter out the new genre if it has already been declared.

JULY 1,2022
the name attribute is the one that the request.body posted
to rerender the form when the error occurs, i must have first to find again the instance of the model and return all the data that the request body has.
