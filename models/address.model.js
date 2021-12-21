module.exports = class Address {
    constructor(locationId, categorie, value, type) {
        this.LocationId = locationId;
        this.Categorie = categorie;
        this.Value = value;
        this.Type = type;
    }

    setLocationId(locationId) {
        this.LocationId = locationId;
    }
};
