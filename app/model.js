// Pulls Mongoose dependency for creating schemas
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// Create a Project Schema. This is the basis for most important data model in the app
var ProjectSchema = new Schema({
    name: {type: String, required: true},
    developer: {type: String},
    city: {type: String, required: true},
    location: {type: [Number], required: true}, // [Long, Lat],
    status: {type: String},
    image: {type: String}
});

// Index the schema in 2dsphere format (for proximity searches)
//ProjectSchema.index({location: '2dsphere'});

// Export the ProjectSchema for use elsewhere. Sets the MongoDB collection as "db-projects"
module.exports = mongoose.model('projects', ProjectSchema);