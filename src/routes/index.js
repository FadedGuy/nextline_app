var express = require('express');
var router = express.Router();

const Homework = require('../models/Homework')
const User = require('../models/User')
const Comment = require('../models/Comment')


/* GET home page. */
router.get('/', function(req, res, next) {
  dueDate = new Date(1995, 1, 15);
  user = new User(0, "test", "test@test.com", "My Name")
  comment = new Comment("Title", "This is a comment", dueDate, user);

  const hw = new Homework("Title", "Description", "Pending", dueDate, "Public", 
                    user, [user], [comment]);

  console.log(hw.getComments());
  res.render('index', { title: 'Express' });
});

module.exports = router;
