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
        getZones (user?)
            user: userkey from user table(OPTIONAL not used now)

        getBusinessType ()

        getHangerTypes ()

        getAllStores (mode)
            TODO MODE

        saveStore(zoneId, statusId, name, lat, lon, description,
                image, businessTypeId, hangerTypeId, ruc, address, mode, user)
            zoneId: Id from table zones
            statusId: Id from table status
            name: Store name
            lat: store latitude
            lon: store longitude
            description: store description
            image: store image BASE64
            businessTypeId: Id from table businessType
            hangerTypeId: Id from table HangerType
            ruc: Store ruc
            address: Array of addresses based on structure of table Address
                categorie: PR principal
                value: address value
                type: CEL:celular | ADD:address | TEL:phone | EM:email | HN:housenumber
            mode: edit|new,
            user: UserKey of table SECURITY.users

        changeStoreStatus(locationId, statusId, user, sellValue, date)
            locationId: Id from table store
            statusId: Id from table status
            user: UserKey of table SECURITY.users
            sellValue: value of a receipt done
            date: date to do a return in a receive action
