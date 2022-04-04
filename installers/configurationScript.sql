create schema Stores collate utf8mb4_0900_ai_ci;
use Stores;

    create table businesstypes
    (
        Id      int auto_increment,
        Type    varchar(30)   null,
        Visible int default 1 null,
        constraint businessTypes_Id_uindex
            unique (Id)
    );

    alter table businesstypes
        add primary key (Id);

    grant delete, insert, select, update on table businesstypes to sa@localhost;

    INSERT INTO Stores.businesstypes (Id, Type) VALUES (1, 'Mini Marker');
    INSERT INTO Stores.businesstypes (Id, Type) VALUES (2, 'Tienda');
    INSERT INTO Stores.businesstypes (Id, Type) VALUES (3, 'Mini tienda');
    INSERT INTO Stores.businesstypes (Id, Type) VALUES (4, 'Fruteria');
    INSERT INTO Stores.businesstypes (Id, Type) VALUES (5, 'Restaurante');
    INSERT INTO Stores.businesstypes (Id, Type) VALUES (6, 'Otro');
    INSERT INTO Stores.businesstypes (Id, Type) VALUES (7, 'Licorería');
    INSERT INTO Stores.businesstypes (Id, Type) VALUES (8, 'Panadería');

    create table hangertypes
    (
        Id      int auto_increment,
        Type    varchar(30)   null,
        Visible int default 1 null,
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
       Id             int auto_increment,
       Status         varchar(300)  null,
       Marker         varchar(300)  null,
       ClassStyle     varchar(30)   null,
       ShowDateField  int default 0 null,
       ShowHistorical int default 1 null,
       constraint Status_StatusId_uindex
           unique (Id)
   );

   alter table status
       add primary key (Id);

   grant delete, insert, select, update on table status to sa@localhost;


    INSERT INTO Stores.status (Id, Status, Marker, ClassStyle, ShowDateField, ShowHistorical) VALUES (2, 'Punto por visitar', './assets/icon/blue-pointer.ico', 'blueTag', 0, 0);
    INSERT INTO Stores.status (Id, Status, Marker, ClassStyle, ShowDateField, ShowHistorical) VALUES (3, 'Punto visitado sin venta', './assets/icon/red-pointer.ico', 'redTag', 0, 1);
    INSERT INTO Stores.status (Id, Status, Marker, ClassStyle, ShowDateField, ShowHistorical) VALUES (4, 'Pedido', './assets/icon/yellow-pointer.ico', 'yellowTag', 0, 1);
    INSERT INTO Stores.status (Id, Status, Marker, ClassStyle, ShowDateField, ShowHistorical) VALUES (5, 'Regreso', './assets/icon/orange-pointer.ico', 'orangeTag', 1, 0);
    INSERT INTO Stores.status (Id, Status, Marker, ClassStyle, ShowDateField, ShowHistorical) VALUES (6, 'Cancelado', './assets/icon/red-pointer.ico', 'redTag', 0, 1);
    INSERT INTO Stores.status (Id, Status, Marker, ClassStyle, ShowDateField, ShowHistorical) VALUES (7, 'Cliente nuevo sin compras', './assets/icon/white-pointer.ico', 'whiteTag', 0, 0);
    INSERT INTO Stores.status (Id, Status, Marker, ClassStyle, ShowDateField, ShowHistorical) VALUES (8, 'No cliente', './assets/icon/black-pointer.ico', 'blackTag', 0, 0);

    create table stores
    (
        Location       int auto_increment,
        Lat            float         null,
        Lon            float         null,
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
        constraint stores_hangertypes_Id_fk
            foreign key (HangerTypeId) references hangertypes (Id),
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
        Id         int auto_increment,
        Categorie  varchar(5)   not null,
        Value      varchar(300) not null,
        LocationId int          not null,
        Type       varchar(5)   null,
        constraint address_Id_uindex
            unique (Id),
        constraint address_users_UserKey_fk
            foreign key (LocationId) references stores (Location)
                on delete cascade
    );

    alter table address
        add primary key (Id);

    grant delete, insert, select, update on table address to sa@localhost;

    create table storehistorical
    (
        Id          int auto_increment,
        LocationId  int           null,
        StatusId    int           null,
        Date        datetime      null,
        UserKey     varchar(20)   null,
        SellValue   float         null,
        DateToShow  datetime      null,
        Description varchar(1000) null,
        constraint storehistorical_Id_uindex
            unique (Id),
        constraint StoreHistorical_status_Id_fk
            foreign key (StatusId) references status (Id),
        constraint StoreHistorical_stores_Location_fk
            foreign key (LocationId) references stores (Location),
        constraint StoreHistorical_users_UserKey_fk
            foreign key (UserKey) references security.users (UserKey)
    );

    alter table storehistorical
        add primary key (Id);

    grant delete, insert, select, update on table storehistorical to sa@localhost;



