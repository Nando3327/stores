module.exports = class User {
    constructor(name, lastname, password) {
        this.name = name;
        this.lastname = lastname;
        this.password = password;
        this.userKey = '';
        this.alias = '';
    }

    setUserKey(userKey) {
        this.userKey = userKey;
    }

    setAlias(alias) {
        this.alias = alias;
    }
};
