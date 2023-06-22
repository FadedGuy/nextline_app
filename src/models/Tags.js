// Not sure if a tag should be modifiable
/**
 * Class that defines a Tag object, provides a constructor, getters, setters and other
 * helpful methods
 */
class Tags{
    #id;
    #name;
    #description;

    constructor(id, name, description){
        this.setId(id);
        this.setName(name);
        this.setDescription(description);
    }

    getId(){
        return this.#id;
    }

    setId(id) {
        this.#id = id;
    }

    getName(){
        return this.#name;
    }

    setName(name) {
        this.#name = name;
    }

    getDescription(){
        return this.#description;
    }

    setDescription(description) {
        this.#description = description;
    }

    // Jsonifies the fields of the class
    toJson(){
        return {
            name: this.#name,
            description: this.#description,
        };
    }
}

module.exports = Tags