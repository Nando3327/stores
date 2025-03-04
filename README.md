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
        getZones (user) Zones by user
            user: userkey from user table

        getBusinessType ()

        addBusinessType(type)
            type: business type

        updateBusinessType(id, type)
            id: business id
            type: business type

        deleteBusinessType(id)
           id: business id

        getHangerTypes ()

        addHangerType(type)
            type: Hanger type

        updateHangerType(id, type)
            id: Hanger id
            type: Hanger type

        deleteHangerType(id)
           id: Hanger id

        getAllStores (user, zone)
            user: userkey from user table
            zone: zone id to search stores

        getStore (user, zone)
            user: userkey from user table
            storeId: store id to search stores

        getStoresByZones (zones)
            zones: ZoneId from store table

        saveStore(zoneId, statusId, name, lat, lon, description,
                image, businessTypeId, hangerTypeId, ruc, address, mode, user)
            zoneId: Id from table zones
            statusId: Id from table status
            name: Store name
            lat: store latitude
            lon: store longitude
            description: store description
            image: store image string URL on server
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

        getStatus ()
        
        resetStatus(oldStatus, newStatus, user, date, sellValue)
            oldStatus: Status to change
            newStatus: New status for stores
            user: UserKey of table SECURITY.usersUserKey of table SECURITY.users
            date: date Event
            sellValue: value of a receipt done
        
        updateBusinessType(id, type)
            id: Business Id
            type: New Business type

        addBusinessType(type)
            type: New Business type

        deleteBusinessType(id)
            id: Business Id

        updateHangerType(id, type)
            id: Hanger Id
            type: New Hanger type

        addHangerType(type)
            type: New Hanger type

        deleteHangerType(id)
            id: Hanger Id

        getUserZonesStore(user, zone): Stores by user and zone
            user: UserKey of table SECURITY.usersUserKey of table SECURITY.users
            zone: Zone Id

        getZonesStore(zone): Stores by zone
            zone: Zone Id

        getAllZones()

        addUserZones(user, zones)
            user: UserKey of table SECURITY.usersUserKey of table SECURITY.users
            zones: Zones Ids
        
        addUserZonesStore(user, zone, stores)
            user: UserKey of table SECURITY.usersUserKey of table SECURITY.users
            zones: Zone Id
            stores: Stores Ids

        addZone(name)
            name: Zone name

        updateZone(id, name)
            id: Zone id
            name: Zone name

        manageOrdersOutOfDate() Update store status based on orders out of date with visible 1