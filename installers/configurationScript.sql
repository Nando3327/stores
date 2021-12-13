use places;
    create table countries
    (
        Id   int auto_increment,
        Name varchar(30) not null,
        constraint countries_Id_uindex
            unique (Id)
    );

    alter table countries
        add primary key (Id);

    grant delete, insert, select, update on table countries to sa@localhost;

    create table countries_user
    (
        Id       int auto_increment,
        Country  int           not null,
        UserKey  varchar(20)   null,
        Favorite int default 0 not null,
        Visited  int default 0 null,
        constraint countries_user_id_uindex
            unique (Id),
        constraint countries_user_countries_Id_fk
            foreign key (Country) references countries (Id),
        constraint countries_user_users_UserKey_fk
            foreign key (UserKey) references security.users (UserKey)
    );

    alter table countries_user
        add primary key (Id);

    grant delete, insert, select, update on table countries_user to sa@localhost;

    create table location
    (
        Id          int auto_increment,
        Latitude    float                    not null,
        Longitude   float                    not null,
        Name        varchar(30) charset utf8 not null,
        Description text                     not null,
        Image       text                     not null,
        Country     int                      null,
        Altimetry   int                      not null,
        constraint location_key_uindex
            unique (Id),
        constraint location_countries_Id_fk
            foreign key (Country) references countries (Id)
    );

    alter table location
        add primary key (Id);

    grant delete, insert, select, update on table location to sa@localhost;

    create table location_user
    (
        id          int auto_increment,
        UserKey     varchar(20)   null,
        LocationKey int           null,
        Visited     int default 0 null,
        Weather     varchar(300)  null,
        date        date          null,
        constraint location_user_id_uindex
            unique (id),
        constraint location_user_location_Key_fk
            foreign key (LocationKey) references location (Id),
        constraint location_user_users_UserKey_fk
            foreign key (UserKey) references security.users (UserKey)
    );

    alter table location_user
        add primary key (id);

    grant delete, insert, select, update on table location_user to sa@localhost;


