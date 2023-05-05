module.exports = class Store {
    constructor(zoneId, statusId, name, lat, lon, description, image, businessTypeId, hangerTypeId, ruc) {
        this.Location = null;
        this.ZoneId = zoneId;
        this.StatusId = statusId;
        this.Name = name;
        this.Lat = lat;
        this.Lon = lon;
        this.Description = description;
        this.Image = image;
        this.BusinessTypeId = businessTypeId;
        this.HangerTypeId = hangerTypeId;
        this.Ruc = ruc;
    }

    setLocation(location) {
        this.Location = location;
    }

    setStatusId(statusId) {
        this.StatusId = statusId;
    }
};
