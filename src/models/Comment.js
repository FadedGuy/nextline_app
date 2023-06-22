// If a comment is modifiable it should also have:
// edited? and lastEdited?
const User = require('./User');

/**
 * Class that defines a Comment object, provides a constructor, getters, setters and other
 * helpful methods
 */
class Comment{
    #title;
    #content;
    #createdAt;
    #createdBy;

    constructor(title, content, createdAt, createdBy){
        this.setTitle(title);
        this.setContent(content);
        this.setCreatedAt(createdAt);
        this.setCreatedBy(createdBy);
    }

    getTitle(){
        return this.#title;
    }

    setTitle(title){
        this.#title = title;
    }

    getContent(){
        return this.#content;
    }

    setContent(content){
        this.#content = content;
    }

    getCreatedAt(){
        return this.#createdAt;
    }

    setCreatedAt(createdAt){
        if(!(createdAt instanceof Date) || isNaN(createdAt)){
            console.error('Invalid createdAt value. Expected instance of Date');
        }

        this.#createdAt = createdAt;
    }

    getCreatedBy(){
        return this.#createdBy;
    }

    setCreatedBy(createdBy){
        if(!(createdBy instanceof User)){
            console.error('Invalid createdBy value. Expected instance of User');
        }

        this.#createdBy = createdBy;
    }
}

module.exports = Comment;