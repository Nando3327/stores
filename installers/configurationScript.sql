use security;
        create table users
        (
            UserKey        varchar(20)          not null,
            Name           varchar(30)          not null,
            LastName       varchar(30)          not null,
            Alias          varchar(30)          null,
            ChangePassword tinyint(1) default 1 null,
            Password       varchar(200)         null,
            constraint users_UserKey_uindex
            unique (UserKey)
        );

        alter table users
            add primary key (UserKey);

        grant delete, insert, select, update on table users to sa@localhost;

        create table profiles
        (
            id             int auto_increment,
            active         int default 1 not null,
            name           varchar(30)   null,
            defaultProfile int default 0 null,
            type           varchar(2)    null,
            constraint profiles_id_uindex
                unique (id)
        );

        alter table profiles
            add primary key (id);

        grant delete, insert, select, update on table profiles to sa@localhost;

        INSERT INTO security.profiles (id, active, name, defaultProfile, type) VALUES (1, 1, 'PROF_DEFAULT', 1, 'P');

        create table address
        (
            Categorie varchar(5)   not null,
            value     varchar(100) not null,
            UserKey   varchar(20)  not null,
            Type      varchar(5)   null,
            constraint address_value_uindex
            unique (value),
            constraint address_users_UserKey_fk
            foreign key (UserKey) references users (UserKey)
            on delete cascade
        );

        alter table address
            add primary key (value);

        grant delete, insert, select, update on table address to sa@localhost;

        create table user_profile
        (
            user      varchar(20)   null,
            profile   int           null,
            principal int default 1 null,
            constraint user_profile_profiles_id_fk
            foreign key (profile) references profiles (id)
            on delete cascade,
            constraint user_profile_users_UserKey_fk
            foreign key (user) references users (UserKey)
            on delete cascade
        );

         grant delete, insert, select, update on table user_profile to sa@localhost;

        create table aplications
        (
            code   varchar(10)   not null
            primary key,
            name   varchar(30)   not null,
            icon   varchar(20)   null,
            active int default 1 not null
        );

        grant delete, insert, select, update on table aplications to sa@localhost;

        INSERT INTO security.aplications (code, name, icon, active) VALUES ('1', 'DEFAULT', null, 1);

        create table modules
        (
            code       varchar(10)   not null
            primary key,
            aplication varchar(10)   not null,
            name       varchar(30)   not null,
            icon       varchar(30)   null,
            active     int default 1 null,
            constraint modules_aplications_code_fk
            foreign key (aplication) references aplications (code)
            on delete cascade
        );

        grant delete, insert, select, update on table modules to sa@localhost;

        INSERT INTO security.modules (code, aplication, name, icon, active) VALUES ('1', '1', 'DEFAULT', null, 1);

        create table transactions
        (
            code    varchar(10)   not null
                primary key,
            name    varchar(30)   not null,
            icon    varchar(30)   null,
            link    varchar(200)  null,
            modules varchar(10)   null,
            active  int default 1 null,
            constraint transactions_modules_code_fk
                foreign key (modules) references modules (code)
                    on delete cascade
        );

        grant delete, insert, select, update on table transactions to sa@localhost;

        INSERT INTO security.transactions (code, name, icon, link, modules, active) VALUES ('1', 'DEFAULT', null, null, '1', 1);

        create table profile_transaction
        (
            transaction varchar(10)   null,
            profile     int           null,
            active      int default 1 not null,
            constraint profile_transaction_profiles_id_fk
            foreign key (profile) references profiles (id),
            constraint profile_transaction_transactions_code_fk
            foreign key (transaction) references transactions (code)
        );

        grant delete, insert, select, update on table profile_transaction to sa@localhost;

        INSERT INTO security.profile_transaction (transaction, profile, active) VALUES ('1', 1, 1);
