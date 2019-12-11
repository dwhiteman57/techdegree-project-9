/*  
Instantiating an instance of the Sequelize class and configuring it to use the correct database
*/

'use strict';
const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

console.info('Instantiating and configuring the Sequelize object instance...');

const options = {
  dialect: 'sqlite',
  storage: 'fsjstd-restapi.db',
}

const sequelize = new Sequelize(options);

const models = {};

console.log('Testing the connection to the database...');

(async () => {
  try {
    // Test the connection to the database
    console.log('Connection to the database successful!');
    await sequelize.authenticate();

    // Sync the models
    console.log('Synchronizing the models with the database...');
    await sequelize.sync();

    // Import all of the models.
    fs
        .readdirSync(path.join(__dirname, 'models'))
        .forEach((file) => {
        console.info(`Importing database model from file: ${file}`);
        const model = sequelize.import(path.join(__dirname, 'models', file));
        models[model.name] = model;
    });

        // If available, call method to create associations.
        Object.keys(models).forEach((modelName) => {
        if (models[modelName].associate) {
        console.info(`Configuring the associations for the ${modelName} model...`);
        models[modelName].associate(models);
        }
    });
  } catch(error) {
    console.log('Sorry there was a problem connecting')
  }
})();


module.exports = {
  sequelize,
  Sequelize,
  models,
};