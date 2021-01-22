var urlParser = (searchPath) => {
  var searchParams = {};
  var searches = searchPath.split(/[=?&]/);
  for (var i = 1; i < searches.length; i = i + 2) {
    searchParams[searches[i]] = searches[i + 1];
  }
  return searchParams;
}

var getCheckInOrOutDateFromUrl = (searchPath, lookFor) => {
  //lookFor should either be 'checkIn' or 'checkOut' depending on which date you want
  var searchParams = urlParser(searchPath);
  if (searchParams[lookFor === 'checkIn' ? 'check_in' : 'check_out'] === undefined) {
    return null;
  } else {
    var cidStr = searchParams['check_in'];
    var cidArr = cidStr.split('-');
    var cid = new Date();
    cid.setFullYear(cidArr[0]);
    cid.setMonth(cidArr[1] - 1);
    cid.setDate(cidArr[2]);
    cid.setHours(0, 0, 0);
    return cid;
  }
}

var makeUrlStyleDate = (dateString) => {
  var date = new Date(dateString);
  return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
}

var makeQueryString = (checkInDateString, checkOutDateString) => {
  if(checkOutDateString === undefined) {
    return `?check_in=${makeUrlStyleDate(checkInDateString)}`;
  } else {
    return `?check_in=${makeUrlStyleDate(checkInDateString)}&check_out=${makeUrlStyleDate(checkOutDateString)}`;
  }
}

var checkCalendarHash = (hash) => {
  if (hash === '#availability-calendar') return true;
  else return false;
}

module.exports.checkCalendarHash = checkCalendarHash;
module.exports.getCheckInOrOutDateFromUrl = getCheckInOrOutDateFromUrl;
module.exports.makeUrlStyleDate = makeUrlStyleDate;
module.exports.makeQueryString = makeQueryString;