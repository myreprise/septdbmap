// Dependencies
var mongoose        = require('mongoose');
var Project         = require('./model.js');

// Opens App Routes
module.exports = function(app) {

    // GET Routes
    // --------------------------------------------------------
    // Retrieve records for all projects in the db
    app.get('/projects', function(req, res){

        // Uses Mongoose schema to run the search (empty conditions)
        var query = Project.find({});
        query.exec(function(err, projects){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of all projects
            res.json(projects);
        });
    });

    // POST Routes
    // --------------------------------------------------------
    // Provides method for saving new projects in the db
    app.post('/projects', function(req, res){

        // Creates a new Project based on the Mongoose schema and the post body
        var newproject = new Project(req.body);

        // New Project is saved in the db.
        newproject.save(function(err){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of the new project
            res.json(req.body);
        });
    });

    // Retrieve JSON records for all projects that meet criteria
    app.post('/query', function(req, res){

        // Grab all query parameters from the body.
        //----------------------------------------------
        //NEED TO UPDATE AND HASH OUT THIS SEARCH FORM & PARAMETERS
        var developer = req.body.developer;

        //Open a generic Mongoose Query
        var query = Project.find({});

        //..such as filter by developer
        if(developer){
            query.where('developer').equals(developer);
        }

        // Execute Query and Return the Query Results
        //If no errors, respond with a JSON of all projects that meet criteria
        query.exec(function(err, projects){
            if(err){
                res.send(err);
            } else {
                res.json(projects)                
            }
        });
    });
};