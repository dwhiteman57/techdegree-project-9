
# Full Stack JavaScript Techdegree v2 - REST API Project

This is part one of a two part application. This codebase handles the backend of the API. The database uses two models; a course model and user model. Routes utlize authentication to verify the user and revoke access if the user cannot be authenticated. Password hashing is also used when new users are created. Links to resources that were used in the creation of this application are listed below. Instructions on how to use this part of the API are also included in the overview and getting started sections.

Resources:
- Sequelize Doc's: https://sequelize.readthedocs.io/en/2.0/docs/models-definition/#getters-setters
- Sequelize Manual: https://sequelize.org/master/manual/instances.html
- Treehouse Courses: Data Relationships, REST API Validation and REST API Authentication. Some of the code was used in the validation process of this application.

## Overview of the Provided Project Files

We've supplied the following files for you to use: 

* The `seed` folder contains a starting set of data for your database in the form of a JSON file (`data.json`) and a collection of files (`context.js`, `database.js`, and `index.js`) that can be used to create your app's database and populate it with data (we'll explain how to do that below).
* We've included a `.gitignore` file to ensure that the `node_modules` folder doesn't get pushed to your GitHub repo.
* The `app.js` file configures Express to serve a simple REST API. We've also configured the `morgan` npm package to log HTTP requests/responses to the console. You'll update this file with the routes for the API. You'll update this file with the routes for the API.
* The `nodemon.js` file configures the nodemon Node.js module, which we are using to run your REST API.
* The `package.json` file (and the associated `package-lock.json` file) contain the project's npm configuration, which includes the project's dependencies.
* The `RESTAPI.postman_collection.json` file is a collection of Postman requests that you can use to test and explore your REST API.

## Getting Started

To get up and running with this project, run the following commands from the root of the folder that contains this README file.

First, install the project's dependencies using `npm`.

```
npm install

```

Second, seed the SQLite database.

```
npm run seed

```

And lastly, start the application.

```
npm start

```

To test the Express server, browse to the URL [http://localhost:5000/](http://localhost:5000/).
