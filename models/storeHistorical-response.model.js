module.exports = class StoreHistoricalResponse {
    constructor(locationId, statusId, date, sellValue) {
        this.locationMarker = locationId;
        this.statusId = statusId;
        this.date = date;
        this.sellValue = sellValue;
    }
};
