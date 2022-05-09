module.exports = class StoreResponse {
    constructor(location, zoneId, statusId, name, lat, lon, description, image, businessTypeId, hangerTypeId, ruc, status, businessType, hangerType, marker, classStyle, showDate, historicalDate) {
        this.location = location;
        this.zoneId = zoneId;
        this.statusId = statusId;
        this.status = status;
        this.marker = marker;
        this.classStyle = classStyle;
        this.name = name;
        this.lat = lat;
        this.lon = lon;
        this.description = description;
        this.image = image;
        this.businessTypeId = businessTypeId;
        this.businessType = businessType;
        this.hangerTypeId = hangerTypeId;
        this.hangerType = hangerType;
        this.ruc = ruc;
        this.showDate = showDate;
        this.historicalDate = historicalDate;
        this.canOpenCard = false;
    }

    setAddresses(addresses) {
        this.addresses = addresses;
    }

    setHistorical(historical) {
        this.historical = historical;
    }

    setCanOpenCard(value) {
        this.canOpenCard = value;
    }
};
