# LOGIN

TO USE MYSQL INSTALLER REVIEW LINKER DOC

## RUN

1. Download project
2. execute `npm install` on terminal
3. execute `node server.js` on terminal

## TEST

1. execute `npm test`

##ERRORS

###CONNECTION

    Execute the following query in MYSQL Workbench
    
    ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
    
    Where root as your user localhost as your URL and password as your password
    
    Then run this query to refresh privileges:
    
    flush privileges;
    
    Try connecting using node after you do so.

### PERMISSION TO DB

    Change DB and tables to grant permissions
    use security;
    grant delete, insert, select, update on table transactions to sa@localhost;

## Api documentation

    DB model scripts
        Execute installers/configurationScript.sql

-API

    -POST
        login (name,password)
            name: alias, email, uerkey(id)
        
        
        

