browser.runtime.sendMessage({ greeting: "hello" }).then((response) => {
    // 1 second wait
    setTimeout(function(){
        calculateAFT();
    }, 2000);
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received request: ", request);
});

function calculateAFT() {
    if (window.location.hostname === 'xxx.yyy') {
        // get current value from html
        const hourPerDay = 8;
        const items = document.querySelectorAll('.summary-item');
        
        let workedHour = null;
        items.forEach(item => {
          if (item.textContent.includes('Your total hours worked are')) {
              workedHour = timeToDecimal(item.querySelector('span')?.textContent.trim());
          }
        });
        
        let workedDay = null;
        items.forEach(item => {
          if (item.textContent.includes('Your total days worked are')) {
              workedDay = timeToDecimal(item.querySelector('span')?.textContent.trim());
          }
        });
        
        let monthWorkingHour = null;
        items.forEach(item => {
          if (item.textContent.includes('The total hours needed are')) {
              monthWorkingHour = timeToDecimal(item.querySelector('span')?.textContent.trim());
          }
        });
        
        // calculate value
        const requiredHour = workedDay * hourPerDay
        const differentHour = (workedHour - requiredHour).toFixed(2);
        const differentHourWithMinute = convertHoursToText(differentHour);
        let displayText = '';
        if (differentHour > 0) {
            displayText = 'Dư cmnr: ' + differentHour + differentHourWithMinute;
        } else if (differentHour < 0) {
            displayText = 'Thiếu cmnr: ' + differentHour + differentHourWithMinute;
        } else {
            displayText = 'Vãi nồi vừa đủ giờ!!!';
        }
        
        // calculate worked time for current day
        let displayWorkedTime = handleCurrentDay();
        
        // display value
        displayMessage(displayWorkedTime, displayText);
    }
}

function handleCurrentDay() {
    // 1. get first row (current day) (tbody > first tr)
    const firstRow = document.querySelector('tbody tr');
    
    // If "Worked Hours" has value, mean already checkout
    const workedHoursCell = firstRow.querySelectorAll('td')[4].textContent.trim();
    let workedHourToday = null;
    
    if (workedHoursCell == "N/A") {
        // 2. get column "In Time" (column 3, index = 2)
        const inTimeCell = firstRow.querySelectorAll('td')[2];

        // 3. get text and trim
        const inTime = inTimeCell.textContent.trim();
        
        // 4. calculated worked time
        workedHourToday = hoursFromDecimalToNow(timeToDecimal(inTime));
    } else {
        workedHourToday = timeToDecimal(workedHoursCell);
    }
    return convertHoursToDailyText(workedHourToday);
}

function hoursFromDecimalToNow(startHourDecimal) {
  if (!Number.isFinite(startHourDecimal)) return NaN;

  const now = new Date();

  const nowDecimal =
    now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;

  const diff = nowDecimal - startHourDecimal;

  return diff > 0 ? +diff.toFixed(4) : 0;
}

function timeToDecimal(input) {
    if (typeof input !== 'string' && typeof input !== 'number') return NaN;

      const s = input.toString().trim();
      if (s === '') return NaN;

      // Case 1: HH:mm
      if (s.includes(':')) {
        const idx = s.indexOf(':');
        const h = Number(s.slice(0, idx));
        const m = Number(s.slice(idx + 1));

        if (!Number.isFinite(h) || !Number.isFinite(m)) return NaN;

        return +(h + m / 60).toFixed(4);
      }

      // Case 2: decimal hours
      const n = Number(s);
      return Number.isFinite(n) ? n : NaN;
}

function convertHoursToText(hours) {
    const wholeHours = Math.trunc(hours);
    const minutes = Math.round(Math.abs(hours - wholeHours) * 60);

    return `h (${wholeHours} giờ ${minutes} phút)`;
}

function convertHoursToDailyText(hours) {
    const wholeHours = Math.trunc(hours);
    const minutes = Math.round(Math.abs(hours - wholeHours) * 60);

    return `Today: ${wholeHours} giờ ${minutes} phút`;
}

function displayMessage(dayValue, monthValue) {
    // monthday AFT
    const newElement = document.createElement('div');
    newElement.style.position = 'fixed';
    newElement.style.bottom = '50px';
    newElement.style.left = '10px';
    newElement.style.backgroundColor = '#427BB1';
    newElement.style.padding = '10px';
    newElement.style.zIndex = '1000';
    newElement.style.color = 'white';
    
    const dayElement = document.createElement('p');
    dayElement.innerText = dayValue;
    const monthElement = document.createElement('p');
    monthElement.innerText = monthValue;
    
    newElement.appendChild(dayElement);
    newElement.appendChild(monthElement);
    document.body.appendChild(newElement);
}
