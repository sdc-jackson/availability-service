var getMaxSelectableDate = (checkIn, dates) => {
  var checkInDate = new Date(checkIn);
  checkInDate.setHours(0, 0, 0);
  var hitCheckInDate = false;
  for (var i = 0; i < dates.length; i++) {
    var curDate = new Date(dates[i].date);
    curDate.setHours(0, 0, 0);
    if (!hitCheckInDate) {
      if (curDate.toString() === checkInDate.toString()) {
        hitCheckInDate = true;
      }
    } else {
      if (dates[i].isAvailable === false) {
        return dates[i].date;
      }
    }
  }
}

var getDateObjFromStr = (dateStr) => {
  var result = new Date(dateStr);
  result.setHours(0, 0, 0);
  return result;
}

module.exports = {
  getMaxSelectableDate,
  getDateObjFromStr

}