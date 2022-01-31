module.exports = class StoreHistoricalResponse {
    constructor(locationId, statusId, date, sellValue, classStyle, showDateField, showHistorical) {
        this.locationMarker = locationId;
        this.statusId = statusId;
        this.date = date;
        this.sellValue = sellValue;
        this.classStyle = classStyle;
        this.showDateField = showDateField;
        this.showHistorical = showHistorical;
    }
};
