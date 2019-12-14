'use strict';

const express = require('express');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const data = require('./db').models;
let Sequelize = require('sequelize');


// Construct a router instance
const router = express.Router();


// ASYNC Handler
function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (err) {
            next(err);
        }
    };
}


// Authentication as learned in API instruction
const authenticateUser = asyncHandler( async (req, res, next) => {
    let message = null;
  
    // Get the user's credentials from the Authorization header.
    const credentials = auth(req);
  
    if (credentials) {
      // Look for a user whose `email address` matches the credentials `name` property.
      const user = await data.User.findOne({
        where: {
          emailAddress: credentials.name,
        }
      });
  
      if (user) {
        const authenticated = bcryptjs
          .compareSync(credentials.pass, user.password);
        if (authenticated) {
          console.log(`Authentication successful for username: ${user.emailAddress}`);
  
          // Store the user on the Request object.
          req.currentUser = user;
        } else {
          message = `Authentication failure for username: ${user.emailAddress}`;
        }
      } else {
        message = `User not found for username: ${credentials.name}`;
      }
    } else {
      message = 'Auth header not found';
    }
  
    if (message) {
      console.warn(message);
      res.status(401).json({ message: 'Access Denied' });
    } else {
      next();
    }
});



// Get route that returns the currently authenticated user
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
      res.status(200).json({
        emailAddress: user.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName
      }).end();
  }));




// Route that creates a new user
router.post('/users', asyncHandler(async (req, res) => {
  const user = req.body;

  // Hash the new user's password.
  if (user.password) {
    user.password = await bcryptjs.hashSync(user.password);
  }

  // Add the user to the db
   data.User.create(user)
    .then(() => {
      // if validation passes you will get saved model
      res.status(201).json().end()
    })
    .catch(Sequelize.ValidationError, (error) => {
      // responds with validation errors
      let errorMessage = error.errors.map(error => error.message);
      res.status(400).json({ error:errorMessage });
    });
}));




module.exports = router;