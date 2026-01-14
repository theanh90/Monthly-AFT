browser.runtime.sendMessage({ greeting: "hello" }).then((response) => {
    // 1 second wait
    setTimeout(function(){
        calculateAFT();
    }, 1000);
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received request: ", request);
});

function calculateAFT() {
    if (window.location.hostname === 'xxx.yyy') {
        // get current value from html
        const hourPerDay = 8;
        const valueElements = document.getElementsByClassName("text-danger total-working-hours");
        const workedHour = valueElements[0].innerText.split(':')[1];
        const workedDay = valueElements[1].innerText.split(':')[1];
        const monthWorkingHour = valueElements[2].innerText.split(':')[1];
        
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
        const startWorkingElements = document.getElementById("total-working-hours").innerText;
        const workedTime = startWorkingElements.split(': ')[1];
        const displayWorkedTime = convertHoursToDailyText(workedTime)
        
        // display value
        displayMessage(displayWorkedTime, displayText);
    }
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
