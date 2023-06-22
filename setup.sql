-- Create a new user with access to the database
CREATE USER 'user'@'localhost' IDENTIFIED BY 'password';
CREATE DATABASE nextline;
SHOW DATABASE;
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE ON nextline.* TO 'user'@'localhost';
FLUSH PRIVILEGES;


-- Create the table of users
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(64) NOT NULL,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(64) NOT NULL,
    isAdmin BOOLEAN NOT NULL
);
-- Add a functional admin and some non admin users to the table
INSERT INTO users (username, email, name, isAdmin) VALUES ('user1', 'user1@example.com', 'Kevin A', true);
INSERT INTO users (username, email, name, isAdmin) VALUES ('user2', 'user2@example.com', 'Aylin R', false);
INSERT INTO users (username, email, name, isAdmin) VALUES ('user3', 'user2@example.com', 'Another Person', false);

-- Create the table for tags used tags
CREATE TABLE tag (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL
);

-- Add some default tags
INSERT INTO tag (name, description) VALUES ('Important', 'This homework is very important');
INSERT INTO tag (name, description) VALUES ('Unimportant', 'This homework does not count toward the final grade');


-- Create the table for homework 
-- Instead of sharedWith, we have a secondary table called homework_shared_users
-- that we can use to filter by homework id and see which users have been shared that 
-- homework
-- Comments is also filtered based on homework.id with comments.homeworkId
CREATE TABLE homework (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(64) NOT NULL,
    description VARCHAR(255) NOT NULL,
    completionStatus ENUM('Pending', 'In Progress', 'Completed') NOT NULL,
    dueDate DATE NOT NULL,
    visibility ENUM('Public', 'Private', 'Shared') NOT NULL,
    createdBy INT NOT NULL,
    responsible INT,
    file LONGBLOB,
    fileType ENUM('pdf', 'png', 'jpg'), 

    FOREIGN KEY (createdBy) REFERENCES users(id),
    FOREIGN KEY (responsible) REFERENCES users(id)
);

-- Add some default homeworks
INSERT INTO homework(title, description, completionStatus, dueDate, visibility, createdBy) VALUES ('Biology Test', 'This is the first test for biology', 'Pending', '2023-06-18', 'Private', 1);
INSERT INTO homework(title, description, completionStatus, dueDate, visibility, createdBy, responsible) VALUES ('Chem Test', 'This is the second test for chemistry', 'Pending', '2023-06-18', 'Shared', 1, 3);
INSERT INTO homework(title, description, completionStatus, dueDate, visibility, createdBy) VALUES ('Math Questions', 'P.1 Ex.15 Solve', 'Completed', '2023-06-15', 'Private', 2);
INSERT INTO homework(title, description, completionStatus, dueDate, visibility, createdBy) VALUES ('Biology Test', 'This is the first test for biology', 'Pending', '2023-06-19', 'Private', 3);

-- Create the table to establish an N-N relation between users and homeworks for sharedwith field
CREATE TABLE homework_shared_users (
    homeworkId INT NOT NULL,
    userId INT NOT NULL,
    FOREIGN KEY (homeworkId) REFERENCES homework(id),
    FOREIGN KEY (userId) REFERENCES users(id),
    PRIMARY KEY (homeworkId, userId)
);

-- Add some shared users to chem test hw
INSERT INTO homework_shared_users (homeworkId, userId) VALUES (2, 2);
INSERT INTO homework_shared_users (homeworkId, userId) VALUES (2, 3);

-- Create the table to establish an N-N relation between tags and homeworks for used tags
CREATE TABLE homework_tags (
  homeworkId INT,
  tagId INT,
  FOREIGN KEY (homeworkId) REFERENCES homework(id),
  FOREIGN KEY (tagId) REFERENCES tag(id)
);

-- Add some tags to biology test for user 3
INSERT INTO homework_tags (homeworkId, tagId) VALUES (4, 1);
INSERT INTO homework_tags (homeworkId, tagId) VALUES (4, 2);

-- Create the table for comments that links a comment to a user and to a post
CREATE TABLE comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  content VARCHAR(255) NOT NULL,
  createdAt DATE NOT NULL,
  createdBy INT NOT NULL,
  homeworkId INT NOT NULL,

  FOREIGN KEY (createdBy) REFERENCES users(id),
  FOREIGN KEY (homeworkId) REFERENCES homework(id)
);

-- Add a couple of default comments
INSERT INTO comments (content, createdAt, createdBy, homeworkId) VALUES ('First here!', '2023-06-12', 1, 1);
INSERT INTO comments (content, createdAt, createdBy, homeworkId) VALUES ('Second also', '2023-06-15', 1, 2);
INSERT INTO comments (content, createdAt, createdBy, homeworkId) VALUES ('They beat me!', '2023-06-15', 2, 4);
