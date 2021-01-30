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

var monthsMap = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

var daysMap = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat'
];

var getStartOfNextOrPrevMonth = (inputDate, dir) => {
  //dir = 1 means increment month; dir = -1 means decrement month
  var date = getDateObjFromStr(inputDate.toString());
  date.setDate(15);
  date.setHours(0, 0, 0);
  date.setMonth(date.getMonth() + dir);
  date.setDate(1);
  return date;
}


module.exports = {
  getMaxSelectableDate,
  getDateObjFromStr,
  getStartOfNextOrPrevMonth,
  monthsMap,
  daysMap
}
