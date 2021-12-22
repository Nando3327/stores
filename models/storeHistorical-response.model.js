module.exports = class StoreHistoricalResponse {
    constructor(locationId, statusId, date, sellValue, classStyle) {
        this.locationMarker = locationId;
        this.statusId = statusId;
        this.date = date;
        this.sellValue = sellValue;
        this.classStyle = classStyle;
    }
};
