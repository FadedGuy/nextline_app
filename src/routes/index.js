var express = require('express');
var router = express.Router();

const Homework = require('../models/Homework')
const User = require('../models/User')
const Comment = require('../models/Comment')
const pool = require('../db');

/**
 * For all the endpoints I've decided I would include the pertaining information as
 * a query parameter instead of sending it in the request body for simplicity
 * */ 


/* GET home page. */
router.get('/', function(req, res, next) {
  // dueDate = new Date(1995, 1, 15);
  // user = new User(0, 0, "test", "test@test.com", "My Name")
  // comment = new Comment(0, "Title", "This is a comment", dueDate, user);

  // const hw = new Homework(0, "Title", "Description", "Pending", dueDate, "Public", 
  //                   user, [user, user, user], [comment]);

  // console.log(hw.toJson());

  // pool.query('SELECT * FROM comments', (error, results) =>  {
  //   if(error) throw error;

  //   const jsonResult = JSON.stringify(results);
  //   console.log(jsonResult);
  // })
  res.render('index', { title: 'Express' });
});

/**
 * GET
 * Brief information of homeworks
 * If username is provided, includes the ones owned by user and shared with
 * If no username is provided, shows only public homeworks
 */
router.get('/getBriefInformation', (req, res) => {
  let username = req.query.username;
  let query = '';

  if(username === ''){
    query = `
      SELECT hw.title, hw.description, hw.visibility, hw.id
      FROM homework hw
      WHERE hw.visibility = 'Public';
    `;
  }
  else{
    // Can reduce the amount of left join's done
    query = `
      SELECT DISTINCT hw.title, hw.description, hw.visibility, hw.id 
      FROM homework hw
      LEFT JOIN homework_shared_users ON homework_shared_users.homeworkId = hw.id
      LEFT JOIN users ON users.id = hw.createdBy
      WHERE (hw.visibility = 'Public'
        OR (hw.visibility = 'Shared'
          AND EXISTS (SELECT 1 FROM homework_shared_users WHERE homework_shared_users.homeworkId = hw.id AND users.username = '${username}'))
        OR (hw.visibility = 'Private'
          AND hw.createdBy = (SELECT id FROM users WHERE username = '${username}'))
      );
    `;
  }
  
  pool.query(query, (error, results) => {
    if(error){
      console.error("Unable to run query: ", error);
      res.status(400).send('Unable to execute query');
    }
    else{
      const jsonResult = JSON.stringify(results);
      console.log(jsonResult);
      res.send(jsonResult);
    }
  })
});


/**
 * GET
 * All information about a homework given an id
 */
router.get('/getAllInformation', (req, res) => {
  let hwId = req.query.id;
  if(!hwId){
    res.status(400).send('Unable to run query');
  }
  
  query = `
    SELECT
      hw.*,
      hsu.userId,
      GROUP_CONCAT(c.content SEPARATOR '\n') AS comments
    FROM
      homework hw
    LEFT JOIN
      homework_shared_users hsu ON hsu.homeworkId = hw.id
    LEFT JOIN
      homework_tags ht ON ht.homeworkId = hw.id
    LEFT JOIN
      tag t ON t.id = ht.tagId
    LEFT JOIN
      comments c ON c.homeworkId = hw.id
    WHERE
      hw.id = ${parseInt(hwId)}
      AND (hw.visibility <> 'Shared' OR (hw.visibility = 'Shared' AND hsu.userId IS NOT NULL))
    GROUP BY
      hw.id, hsu.userId;
  `;

  pool.query(query, (error, results) => {
    if(error){
      console.error("Unable to run query: ", error);
      res.status(400).send('Unable to execute query');
    }
    else{
      const jsonResult = JSON.stringify(results);
      console.log(jsonResult);
      res.send(jsonResult);
    }
  });
});

/**
 * POST
 * Posts a new homework with the given information
 */
router.post('/postHw', (req, res) => {
  const { title, description, completionStatus, dueDate, visibility, sharedWith, createdBy, responsible, file } = req.body;
  console.log(req.body);
  
  const columnValuePairs = [];
  if (title) columnValuePairs.push(`title = '${title}'`);
  if (description) columnValuePairs.push(`description = '${description}'`);
  if (completionStatus) columnValuePairs.push(`completionStatus = '${completionStatus}'`);
  if (dueDate) columnValuePairs.push(`dueDate = '${dueDate}'`);
  if (visibility) columnValuePairs.push(`visibility = '${visibility}'`);
  if (createdBy) columnValuePairs.push(`createdBy = '${createdBy}'`);
  if (responsible) columnValuePairs.push(`responsible = '${responsible}'`);
  if (file) columnValuePairs.push(`file = '${file}'`);

  const query = `INSERT INTO homework SET ${columnValuePairs.join(', ')}`;

  // pool.query(query, (error, results) => {
  //   if (error) {
  //     console.error('Unable to run homework query:', error);
  //     res.status(400).send("Unable to process query");
  //     return;
  //   }
    
  //   // If visibility is 'Shared', insert sharedWith if existent
  //   if (visibility === 'Shared' && sharedWith) {
  //     const userIds = sharedWith.split(',').map(userId => userId.trim());
      
  //     const sharedUsersValues = userIds.map(userId => `(${results.insertId}, ${userId})`);
      
  //     const sharedWithQuery = `INSERT INTO homework_shared_users (homeworkId, userId) VALUES ${sharedUsersValues.join(', ')}`;
      
  //     pool.query(sharedWithQuery, (error, results) => {
  //       if (error) {
  //         console.error('Unable to run shared users query:', error);
  //       } else {
  //         console.log('Form submitted successfully');
  //         res.send("Nice");
  //       }
  //     });
  //   } else {
  //     console.log('Form submitted successfully');
  //     res.send("Nice");
  //   }
  // });
  res.send("Buce");
});

/**
 * DELETE
 * Deletes a homework given its id
 */
router.delete('/deleteHw', (req, res) => {
  let hwId = req.query.id;
  if (!hwId) {
    res.status(400).send('Unable to run query');
  }

  query = `
    DELETE FROM homework WHERE id=${parseInt(hwId)};
  `;

  pool.query(query, (error, results) => {
    if (error) {
      console.error("Unable to run query: ", error);
      res.status(400).send('Unable to execute query');
    } else {
      console.log(results);
      res.send(results);
    }
  });
});

module.exports = router;
