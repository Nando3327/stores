module.exports = class StoreHistorical {
    constructor(locationId, statusId, date, userKey, sellValue, dateToShow, description) {
        this.LocationId = locationId;
        this.StatusId = statusId;
        this.Date = date;
        this.UserKey = userKey;
        this.SellValue = sellValue;
        this.DateToShow = dateToShow;
        this.Description = description
    }

    setLocationId(locationId) {
        this.LocationId = locationId;
    }

    getLocationId() {
        return this.LocationId
    }

    getStatusId() {
        return this.StatusId
    }

    setDescription(description) {
        this.Description = description;
    }

    setStatusId(statusId) {
        this.StatusId = statusId;
    }

    setSellValue(sellValue) {
        this.SellValue = sellValue;
    }

    setDateToShow(dateToShow) {
        this.DateToShow = dateToShow;
    }
};
