const SUdb = require("./src/SUCRUD_functions")
const db = require("./src/CRUD_functions")

function main()
{
    /*
        check for user
        create user
        check for user
        mod user
        check for user
        retireve user obj
        del user
        check for user
        get slide
        add slide
        get slide
        mod slide
        get slide
        del slide 
        get slide
    */
}

function userTest(_UN,_PS,_newUN, _newPS)
{
    console.log(db.checkForUser(_UN, _PS));
    console.log(SUdb.newUser(_UN, _PS));
    console.log(SUdb.getUser(_UN, _PS));
    console.log(SUdb.modUser(_UN, undefined,undefined, _newPS));
    console.log(SUdb.getUser(_UN, _newPS));

    

    
}