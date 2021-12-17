use Stores;

    create table businesstypes
    (
        Id   int auto_increment,
        Type varchar(30) null,
        constraint businessTypes_Id_uindex
            unique (Id)
    );

    alter table businesstypes
        add primary key (Id);

    grant delete, insert, select, update on table businesstypes to sa@localhost;


    create table hangertypes
    (
        Id   int auto_increment,
        Type varchar(30) null,
        constraint HangerTypes_Id_uindex
            unique (Id)
    );

    alter table hangertypes
        add primary key (Id);

    grant delete, insert, select, update on table hangertypes to sa@localhost;

    create table zones
    (
        Id   int auto_increment,
        Name varchar(50) null,
        constraint Zones_Id_uindex
            unique (Id)
    );

    alter table zones
        add primary key (Id);

    grant delete, insert, select, update on table zones to sa@localhost;


   create table status
   (
       Id            int auto_increment,
       Status        int           null,
       Marker        varchar(30)   null,
       ClassStyle    varchar(30)   null,
       ShowDateField int default 0 null,
       constraint Status_StatusId_uindex
           unique (Id)
   );

   alter table status
       add primary key (Id);

   grant delete, insert, select, update on table status to sa@localhost;


    create table stores
    (
        Location       int auto_increment,
        Lat            int           null,
        Lon            int           null,
        Name           varchar(100)  null,
        StatusId       int           null,
        ZoneId         int           null,
        Description    varchar(5000) null,
        Image          varchar(6500) null,
        BusinessTypeId int           null,
        HangerTypeId   int           null,
        Ruc            varchar(20)   null,
        constraint stores_Location_uindex
            unique (Location),
        constraint stores_businesstypes_Id_fk
            foreign key (BusinessTypeId) references businesstypes (Id),
        constraint stores_status_StatusId_fk
            foreign key (StatusId) references status (Id),
        constraint stores_zones_Id_fk
            foreign key (ZoneId) references zones (Id)
    );

    alter table stores
        add primary key (Location);

    grant delete, insert, select, update on table stores to sa@localhost;



    create table address
        (
            Categorie  varchar(5)   not null,
            Value      varchar(100) not null,
            LocationId int          not null,
            Type       varchar(5)   null,
            constraint address_value_uindex
                unique (Value),
            constraint address_users_UserKey_fk
                foreign key (LocationId) references stores (Location)
                    on delete cascade
        );

        alter table address
            add primary key (Value);

        grant delete, insert, select, update on table address to sa@localhost;


        create table storehistorical
        (
            LocationId int         null,
            StatusId   int         null,
            Date       date        null,
            UserKey    varchar(20) null,
            SellValue  float       null,
            DateToShow date        null,
            constraint StoreHistorical_status_Id_fk
                foreign key (StatusId) references status (Id),
            constraint StoreHistorical_stores_Location_fk
                foreign key (LocationId) references stores (Location),
            constraint StoreHistorical_users_UserKey_fk
                foreign key (UserKey) references security.users (UserKey)
        );

        grant delete, insert, select, update on table storehistorical to sa@localhost;
