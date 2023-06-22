/**
 * Class that defines a User object, provides a constructor, getters and other
 * helpful methods
 */
class User{
    #id;
    #username;
    #email;
    #name;
    #isAdmin;

    constructor(id, username, email, name, isAdmin=false){
        this.#id = id;
        this.#username = username;
        this.#email = email;
        this.#name = name;
        this.#isAdmin = isAdmin;
    }

    getId(){
        return this.#id;
    }

    getUsername(){
        return this.#username;
    }

    getEmail(){
        return this.#email;
    }

    getName(){
        return this.#name;
    }

    getAdmin(){
        return this.#isAdmin;
    }
}

module.exports = User