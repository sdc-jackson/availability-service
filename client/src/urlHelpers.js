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
  lookFor = (lookFor === 'checkIn' ) ? 'check_in' : 'check_out'
  if (searchParams[lookFor] === undefined) {
    return null;
  } else {

    var cidStr = searchParams[lookFor];
    var cidArr = cidStr.split('-');
    var cid = new Date();
    cid.setFullYear(cidArr[0]);
    cid.setDate(cidArr[2]); //HAVE TO SET DATE FIRST! In case the month doesn't have today's date. Cough cough February :(
    cid.setMonth(parseInt(cidArr[1]) - 1);
    cid.setHours(0, 0, 0);
    return cid;
  }
}

var getNumGuestsFromUrl = (searchPath) => {
  var searchParams = urlParser(searchPath);
  return {
    numAdults: searchParams.adults === undefined ? parseInt(1) : parseInt(searchParams.adults),
    numChildren: searchParams.children === undefined ? parseInt(0) : parseInt(searchParams.children),
    numInfants: searchParams.infants === undefined ? parseInt(0) : parseInt(searchParams.infants)
  }
}

var makeUrlStyleDate = (dateString) => {
  var date = new Date(dateString);
  return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
}

var makeQueryString = (curSearchStr, params) => {
  var curSearchParams = urlParser(curSearchStr);
  if (params['check_in'] === undefined ) {
    //if no check-in/check-out dates were sent, check if they're already in the URL
    if (curSearchParams['check_in'] !== undefined) {
      params['check_in'] = curSearchParams['check_in'];
      if(curSearchParams['check_out'] !== undefined) {
        params['check_out'] = curSearchParams['check_out'];
      }
    }
  } else {
    //we were sent a check-in/check-out date, so format them for the URL
    if (params['check_in'] !== undefined) {
      params['check_in'] = makeUrlStyleDate(params['check_in']);
      if (params['check_out'] !== undefined) {
        params['check_out'] = makeUrlStyleDate(params['check_out']);
      }
    }
  }
  if (params['guests'] === undefined) {
    //there was no guest count sent in the params. which means,
    //  this was from the secondary calendar,
    //  and we need to either keep the existing guest query,
    //  or set adults = 1 and guests = 1 (default when dates are selected)
    params['guests'] = {};
    if(curSearchParams['adults'] === undefined) {
      params['guests'].numAdults = 1;
    } else {
      params['guests'].numAdults = curSearchParams['adults'];
      params['guests'].numChildren = curSearchParams['children'];
      params['guests'].numInfants = curSearchParams['infants'];

    }
  }
  var queryStr = '?';
  for (var param in params) {
    if (param === 'check_in' || param === 'check_out') {
      queryStr += `${(param==='check_out' || queryStr.length > 3) ? '&' : ''}${param}=${params[param]}`;
    } else {
      if (param === 'guests') {
        var adults = params[param].numAdults;
        var children = params[param].numChildren === undefined ? 0 : params[param].numChildren;
        var infants = params[param].numInfants === undefined ? 0 : params[param].numInfants;

        var totalGuests = parseInt(adults) + parseInt(children) + parseInt(infants);
        if (queryStr.length < 3) {queryStr += `guests=${totalGuests}&adults=${adults}`}
        else {queryStr += `&guests=${totalGuests}&adults=${adults}`};
        if (children !== undefined && children !== 0) {
          queryStr += `&children=${children}`;
        }
        if (infants !== undefined && infants !== 0) {
          queryStr += `&infants=${infants}`;
        }
      }
    }
  }
  return queryStr;
}

var removeDatesFromQueryString = (curSearchStr) => {
  var curSearchParams = urlParser(curSearchStr);
  curSearchParams['check_in'] = undefined;
  curSearchParams['check_out'] = undefined;
  var queryStr = '?';
  for (var param in curSearchParams) {
    if (curSearchParams[param] !== undefined) {
      queryStr += `${param}=${curSearchParams[param]}&`
    }
  }
  queryStr = queryStr.slice(0, queryStr.length - 1); //remove the last '&' automatically included from the loop above
  return queryStr;
}

var checkCalendarHash = (hash) => {
  if (hash === '#availability-calendar') return true;
  else return false;
}

module.exports = {
  checkCalendarHash,
  getCheckInOrOutDateFromUrl,
  makeUrlStyleDate,
  makeQueryString,
  getNumGuestsFromUrl,
  removeDatesFromQueryString
}