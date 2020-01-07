'use strict';

const express = require('express');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const db = require('./db').models;
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
      const user = await db.User.findOne({
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



/* 
USER ROUTES
*/

// GET route that returns the currently authenticated user
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const user = await req.currentUser;
    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
      id: user.id
    }).end();
  }));


// POST route that creates a new user
router.post('/users', asyncHandler(async (req, res) => {
  const user = req.body;

  // Hash the new user's password.
  if (user.password) {
    user.password = await bcryptjs.hashSync(user.password);
  }

  // Add the user to the db
   db.User.create(user)
    .then(() => {
      // if validation passes, it will be saved to model
      res.status(201).location('/').json().end()
    })
    .catch(Sequelize.ValidationError, (error) => {
      // responds with Sequelize custom validation errors
      let errorMessage = error.errors.map(error => error.message);
      res.status(400).json({ error:errorMessage });
    });
}));



/* 
COURSE ROUTES
*/

// GET route that returns a list of courses
router.get('/courses', asyncHandler(async (req, res) => {
  const courses = await db.Course.findAll();
  res.status(200).json(courses).end();
}));




// GET route that returns a course for the provided id
router.get('/courses/:id', asyncHandler(async (req, res) => {
  const course = await db.Course.findByPk(req.params.id);
  if (course) {
    res.status(200).json(course).end();
  } else {
    res.status(400).json({message: 'Sorry, a course with this title is unavailable'}).end();
  }
  
}));



// // POST route that creates a course, sets the location header to the URI for the course, and returns no content
// router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
//   const course = req.body;
  

//   db.Course.create(course)
//     .then(() => {
//       // if validation passes, it will be saved to model
//       res.status(201).location('/courses/').json().end();
//       console.log(course.id);
//     })
//     .catch(Sequelize.ValidationError, (error) => {
//       // responds with Sequelize custom validation errors
//       let errorMessage = error.errors.map(error => error.message);
//       res.status(400).json({ error:errorMessage });
//     });
// }));




// Create a course
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
  await db.Course.create(req.body)
  .then(course => {
    res.status(201).location('/courses/' + course.id).end();
  })
  .catch(Sequelize.ValidationError, (error) => {
    // responds with Sequelize custom validation errors
    let errorMessage = error.errors.map(error => error.message);
    res.status(400).json({ error:errorMessage });
  });
  
}));






// PUT route that updates a course and returns no content
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const course = await db.Course.findByPk(req.params.id);

  if (req.body.title && req.body.description) {
    course.update(req.body)
    .then(() => {
      // if validation passes, it will update model
      res.status(204).json(course).end();
    })
    .catch(Sequelize.ValidationError, (error) => {
      // responds with Sequelize custom validation errors
      let errorMessage = error.errors.map(error => error.message);
      res.status(400).json({ error:errorMessage });
    });
  } else {
    res.status(400).json({ message: "Please fill out both the title and description fields" });
  }
}));



// DELETE route that deletes a course
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const course = await db.Course.findByPk(req.params.id);

  if (course) {
    course.destroy()
    .then(() => {
      // if validation passes, it will be saved to model
      res.status(204).json(course).end();
    })
    .catch(Sequelize.ValidationError, (error) => {
      // responds with Sequelize custom validation errors
      let errorMessage = error.errors.map(error => error.message);
      res.status(400).json({ error:errorMessage });
    });
  } else {
    res.status(404).json();
  }
}));





module.exports = router;