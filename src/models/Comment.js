// If a comment is modifiable it should also have:
// edited? and lastEdited?
const User = require('./User');

/**
 * Class that defines a Comment object, provides a constructor, getters, setters and other
 * helpful methods
 */
class Comment{
    #id;
    #title;
    #content;
    #createdAt;
    #createdBy;

    constructor(id, title, content, createdAt, createdBy){
        this.setId(id);
        this.setTitle(title);
        this.setContent(content);
        this.setCreatedAt(createdAt);
        this.setCreatedBy(createdBy);
    }

    getId(){
        return this.#id;
    }

    setId(id){
        this.#id = id;
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

    // Jsonifies the fields of the class
    toJson(){
        return {
            title: this.#title,
            content: this.#content,
            createdAt: this.#createdAt,
            createdBy: this.#createdBy.toJson(),
        };
    }
}

module.exports = Comment;