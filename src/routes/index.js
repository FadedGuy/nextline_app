var express = require('express');
var router = express.Router();

const Homework = require('../models/Homework')
const User = require('../models/User')
const Comment = require('../models/Comment')
const pool = require('../db');


/* GET home page. */
router.get('/', function(req, res, next) {
  dueDate = new Date(1995, 1, 15);
  user = new User(0, 0, "test", "test@test.com", "My Name")
  comment = new Comment(0, "Title", "This is a comment", dueDate, user);

  const hw = new Homework(0, "Title", "Description", "Pending", dueDate, "Public", 
                    user, [user, user, user], [comment]);

  console.log(hw.toJson());

  pool.query('SELECT * FROM comments', (error, results) =>  {
    if(error) throw error;

    const jsonResult = JSON.stringify(results);
    console.log(jsonResult);
  })
  res.render('index', { title: 'Express' });
});

module.exports = router;
