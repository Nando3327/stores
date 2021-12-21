module.exports = class AddressResponse {
    constructor(locationId, categorie, value, type) {
        this.locationId = locationId;
        this.categorie = categorie;
        this.value = value;
        this.type = type;
    }
};
