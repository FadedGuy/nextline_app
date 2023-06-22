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
 * Brief information of all homeworks, public and those of the user
 */
router.get('/getBriefInformation', (req, res) => {
  console.log("Yes");
  let username = req.query.username;
  let query;
  if(username === ''){
    // const query = `
    //   SELECT homework.*
    //   FROM homework
    //   LEFT JOIN homework_shared_users ON homework_shared_users.homeworkId = homework.id
    //   LEFT JOIN users ON users.id = homework_shared_users.userId
    //   WHERE (homework.visibility = 'Public' OR (homework.visibility = 'Shared' AND users.username = ?) OR (homework.visibility = 'Private' AND homework.createdBy = (SELECT id FROM users WHERE username = ?)));
    // `;
    query = `
      SELECT *
      FROM homework;
    `;
  }
  else{
    query = `
      SELECT homework.*
      FROM homework
      LEFT JOIN homework_shared_users ON homework_shared_users.homeworkId = homework.id
      LEFT JOIN users ON users.id = homework.createdBy
      WHERE (homework.visibility = 'Public'
        OR (homework.visibility = 'Shared'
          AND EXISTS (SELECT 1 FROM homework_shared_users WHERE homework_shared_users.homeworkId = homework.id AND users.username = '${username}'))
        OR (homework.visibility = 'Private'
          AND homework.createdBy = (SELECT id FROM users WHERE username = '${username}'))
      );
    `;
  }

  pool.query(query, (error, results) => {
    if(error){
      console.error("Unable to run query: ", error);
      res.send('Unable to execute query');
    }
    else{
      const jsonResult = JSON.stringify(results);
      console.log(jsonResult);
      res.send(jsonResult);
    }
  })
  
});

module.exports = router;
