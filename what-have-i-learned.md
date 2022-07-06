JUNE 24 2022

i have learned all about how to build a create form for a genre combining with the express-validator to validate and sanitize the data it gathered from the form the maintain a secured server.

to use the express-validator in the code,
var {body, validationResult}

however, i did not use the validationResult. instead, i implemented the error handling in front end to filter out the new genre if it has already been declared.

JULY 1,2022
the name attribute is the one that the request.body posted
to rerender the form when the error occurs, i must have first to find again the instance of the model and return all the data that the request body has.

JULY 5, 2022
to validate if the checkbox is checked in the iteration of the genre, i have to pass in the genre.checked that contains "true" value into the data-checked to manipulate in dom to add checked attr.

JULY 6, 2022
when i try to uopdate the records, i encountered an error "Performing an update on the path '\_id' would modify the immutable field '\_id'" and i discovered that this error occur when the \_id of the records is trying to modify. because the \_id is a default id provided by the mongodb and it shall not be modified. this problem occurs when we define a new schema that gathers the data from the req.body. when form is submitted. therefore, by removing the new schema and only create an object, the findByIdAndUpdate method doesnt try to modify the \_id.

the date from the database mustbe need to convert into iso format first to be able to extract the value. so i needed to have to convert it in the frontend
