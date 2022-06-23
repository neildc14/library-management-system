// Define schema
var Schema = mongoose.Schema;

var SomeModelSchema = new Schema({
a_string: String,
a_date: Date
});

// Compile model from schema
var SomeModel = mongoose.model('SomeModel', SomeModelSchema );
-->The first argument is the singular name of the collection that will be created for your model (Mongoose will create the database collection for the above model SomeModel above), and the second argument is the schema you want to use in creating the model.

Router functions are Express middleware, which means that they must either complete (respond to) the request or call the next function in the chain. In the case above we complete the request using send(), so the next argument is not used (and we choose not to specify it).

populate()
Population is the process of automatically replacing the specified paths in the document with document(s) from other collection(s). We may populate a single document, multiple documents, a plain object, multiple plain objects, or all objects returned from a query. Let's look at some examples.

luxon is for date formatting used with the help of virtual in models
return this.date_of_birth ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) : '';
ternary operator to use when there is no data/field found in the db

ASYNC
async.parallel({functions: to be run}, function(err, result){res.render})
