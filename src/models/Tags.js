// Not sure if a tag should be modifiable
/**
 * Class that defines a Tag object, provides a constructor, getters, setters and other
 * helpful methods
 */
class Tags{
    #name;
    #description;

    constructor(name, description){
        this.setName(name);
        this.setDescription(description);
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