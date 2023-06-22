const User = require('./User')
const Comment = require('./Comment')
const Tags = require('./Tags');
const { use } = require('../routes');

// Using E at the start denotes an enumaration
/**
 * Enumeration that defines the possible completion status of a homework
 */
const ECompletionStatus = Object.freeze({
    PENDING: 'Pending',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed'
});

/**
 * Enumeration that defines the possible visibility options for a homework
 */
const EVisibility = Object.freeze({
    PUBLIC: 'Public',
    PRIVATE: 'Private',
    SHARED: 'Shared'
})


/**
 * Class that defines the fields of what is a homework, provides setters, getters,
 * a constructor and some other helpful methods
 * 
 * The setters come with typechecking and log the error to console
 * 
 * Note: The createdBy field can only be set once
 */
class Homework{
    #title;
    #description;
    #completionStatus;
    #dueDate;
    #visibility;
    #sharedWith;
    #comments;
    #createdBy;
    #responsible;
    #tags;
    #file;

    constructor(title, description, completionStatus, dueDate, visibility, 
                createdBy, sharedWith = [], comments = [], responsible = null, 
                tags = [], file = null) {

        this.setTitle(title);
        this.setDescription(description);
        this.setCompletionStatus(completionStatus);
        this.setDueDate(dueDate);
        this.setVisibility(visibility);
        this.setSharedWith(sharedWith);
        this.setComments(comments);
        this.setCreatedBy(createdBy);
        this.setResponsible(responsible);
        this.setTags(tags);
        this.setFile(file);
    }


    getTitle() {
        return this.#title;
    }

    setTitle(title) {
        this.#title = title;
    }

    getDescription() {
        return this.#description;
    }

    setDescription(description) {
        this.#description = description;
    }

    getCompletionStatus() {
        return this.#completionStatus;
    }

    setCompletionStatus(completionStatus) {
        if(!Object.values(ECompletionStatus).includes(completionStatus)){
            console.error('Invalid completionStatus value. Expected instance of ECompletionStatus')
        }
        this.#completionStatus = completionStatus;
    }

    getDueDate() {
        return this.#dueDate;
    }

    setDueDate(dueDate) {
        if(!(dueDate instanceof Date) || isNaN(dueDate)){
            console.error('Invalid dueDate value. Expected instance of Date');
        }

        this.#dueDate = dueDate;
    }

    getVisibility() {
        return this.#visibility;
    }

    setVisibility(visibility) {
        if(!Object.values(EVisibility).includes(visibility)){
            console.error('Invalid visibility value. Expected instance of EVisibility')
        }
        this.#visibility = visibility;
    }

    getSharedWith() {
        return this.#sharedWith;
    }

    setSharedWith(sharedWith) {
        if(this.#sharedWith == undefined){
            this.#sharedWith = [];
        }

        sharedWith.forEach((user, index) => {
            if(!(user instanceof User)){
                console.error('Invalid user value at index ' + index + '. Expected instance of User')
            }
            
            this.#sharedWith.push(user)
        })
    }

    getComments() {
        return this.#comments;
    }

    setComments(comments) {
        if(this.#comments == undefined){
            this.#comments = [];
        }

        comments.forEach((comment, index) => {
            if(!(comment instanceof Comment)){
                console.error('Invalid comment value at index ' + index + '. Expected instance of Comment')
            }

            this.#comments.push(comment);
        })
    }

    getCreatedBy() {
        return this.#createdBy;
    }

    setCreatedBy(createdBy){
        if(this.#createdBy != undefined){
            console.error('Changing the author of the Homework is not allowed');
        }

        if(!(createdBy instanceof User)){
            console.error('Invalid user value in createdBy. Expected instance of User')
        }
        this.#createdBy = createdBy;
    }

    getResponsible() {
        return this.#responsible;
    }

    setResponsible(responsible) {
        this.#responsible = responsible;
    }

    getTags() {
        return this.#tags;
    }

    setTags(tags) {
        if(this.#tags == undefined){
            this.#tags = [];
        }

        tags.forEach((tags, index) => {
            if(!(tags instanceof Tags)){
                console.error('Invalid tag value at index ' + index + '. Expected instance of Tag')
            }

            this.#tags.push(tags);
        })
    }

    getFile() {
        return this.#file;
    }

    setFile(file) {
        this.#file = file;
    }

    // Jsonifies the fields of the class
    toJson(){
        return {
            title: this.#title,
            description: this.#description,
            completionStatus: this.#completionStatus,
            dueDate: this.#dueDate,
            visibility: this.#visibility,
            sharedWith: this.#sharedWith.map(user => user.toJson()),
            comments: this.#comments.map(comment => comment.toJson()),
            createdBy: this.#createdBy.toJson(),
            responsible: this.#responsible,
            tags: this.#tags.map(tag => tag.toJson()),
            file: this.#file
        };
    }
}

module.exports = Homework