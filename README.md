# nextline_app
Ejercicio de practica para posicion de Desarrollador Backend

To see how to setup mysql see setup.sql and run the script.
To run the script access the database as root or with the right privileges.

TODO:
add file support in frontend
Change console.error in type verification for throw error and handle
Can a comment be eliminated?
Add trigger to also set filetype along with file if it is the case in mysql
Optimize queries
Implement server-side verification for char length and parsing for form data
Verification for being able to change the visibility
Also update tag table and comment table for put and post

ISSUES:
Comment createdBy user is shown as Object and not at User.toJson()
When the query is successful but is empty it should handle that error
