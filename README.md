# PLACES

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
        getUserPlaces (user,mode)
            mode: All, Visited, Next
            user: userkey from user table  

        getUserPlacesCountry (user,country)
            country: id from countries table
            user: userkey from user table
        
        getUserCountries (user)
            user: userkey from user table
        
        getUserLocationDetail (name,location)
            user: userkey from user table
            location: Id from location table

        setCountryStatus (user, country, favorite)
            user: userkey from user table
            country: Id from country table
            favorite: true or false (1,0) OPTIONAL*0 default*

