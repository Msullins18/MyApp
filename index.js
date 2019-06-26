setInterval(() => {
  currentTime();
}, 500);

setInterval(() => {
  startTimeOut();
}, 1000);
setInterval(() => {
  getWeather();
}, 600000);
setTimeout(() => {
  removeLoader();
}, 2000);
var alert = new Audio('./alert_on_call.mp3');
alert.volume = 0.0;
var stop;
function removeLoader()
{
  document.getElementById("loader").classList.add("hideLoader")
}
/*Callable function to add and remove CSS classes in elements class list. 
this function relates to the navbar icons.*/
function animateIcons()
{
    if(document.getElementById('selectImg').classList.contains('rotateIn'))
    {
        document.getElementById('selectImg').classList.remove('rotateIn');
        document.getElementById('selectImg').classList.add('rotateOut');
    }
    else
    {
        document.getElementById('selectImg').classList.remove('rotateOut');
        document.getElementById('selectImg').classList.add('rotateIn');
    }
    if(document.getElementById('alarmIcon').classList.contains('Visible'))
    {
        document.getElementById('alarmIcon').classList.remove('Visible');
        document.getElementById('weatherIcon').classList.remove('Visible');
        document.getElementById('iconContainer').classList.remove('Visible');
        document.getElementById('homeIcon').classList.remove('Visible');
        

        document.getElementById('alarmIcon').classList.add('notVisible');
        document.getElementById('weatherIcon').classList.add('notVisible');
        document.getElementById('iconContainer').classList.add('notVisible');
        document.getElementById('homeIcon').classList.add('notVisible');
    }
    else
    {
        document.getElementById('alarmIcon').classList.add('Visible');
        document.getElementById('weatherIcon').classList.add('Visible');
        document.getElementById('iconContainer').classList.add('Visible');
        document.getElementById('homeIcon').classList.add('Visible');
    
        document.getElementById('alarmIcon').classList.remove('notVisible');
        document.getElementById('weatherIcon').classList.remove('notVisible');
        document.getElementById('iconContainer').classList.remove('notVisible');
        document.getElementById('homeIcon').classList.remove('notVisible');
    }
} 

function currentTime()
{
  var date = new Date();
  var morning = new Date(1965,05,28,04,00,00,00);
  var afternoon = new Date(1965,05,28,12,00,00,00);
  var evening = new Date(1965,05,28,17,00,00,00);
  var night = new Date(1965,05,28,20,00,00,00);
  var stringDate = date.toLocaleDateString();
  var stringTime = date.toLocaleTimeString();
  document.getElementById("time&date").innerHTML = stringDate +"<br>" + stringTime;

  if(date.getHours() >= morning.getHours() &&  date.getHours() < afternoon.getHours());
  {
    document.getElementById("greeting").innerHTML="Good Morning!" + "<br>";

    document.body.classList.add("morning-body");
    document.body.classList.remove("night-body");

  }
  if(date.getHours() >= afternoon.getHours() && date.getHours() < evening.getHours())
  {
    document.getElementById("greeting").innerHTML="Good Afternoon!" + "<br>";

    document.body.classList.add("afternoon-body");
    document.body.classList.remove("morning-body");
  }
  if(date.getHours() >= evening.getHours() && date.getHours() < night.getHours())
  {
    document.getElementById("greeting").innerHTML="Good Evening!" + "<br>";

    document.body.classList.add("night-body");
    document.body.classList.remove("afternoon-body");

  }
  if(date.getHours() >= night.getHours())
  {
    document.getElementById("greeting").innerHTML="Good Night!" + "<br>";
    document.body.classList.add("night-body");

  }
  return date.getTime();
}

function getWeather (pcode)
{
  var countryCode;
  var currentConditions;
  var currentTemp;
  var humidity;
  var feelsLike;
  var maxTemp;
  var wind;
  var id;
  var postalCode = pcode;
  var tempUnit;
  var speedUnit;
  var unitSys;

  var radios = document.getElementsByName('units');
    
  for (var i = 0, length = radios.length; i < length; i++)
  {
    if (radios[i].checked)
    {
      // do whatever you want with the checked radio
      if(radios[i].value === 'metric')
      {
        tempUnit = 'C';
        speedUnit = 'km/h';
        unitSys = 'metric';
      }
      if(radios[i].value === 'imperial')
      {
        tempUnit = 'F';
        speedUnit = 'mph';
        unitSys = 'imperial';
      }

      // only one radio can be logically checked, don't check the rest
      break;
    }
  }

  if(checkCookie('pcode') === true && checkCookie('units') === true)
  {
    if(postalCode === undefined && unitSys === undefined)
    {
      postalCode = getCookie('pcode');
      unitSys = getCookie('units');
      clearWeatherInput();

      if(unitSys != undefined)
      {
        if(unitSys === 'imperial')
        {
          tempUnit = 'F';
          speedUnit = 'mph';
          unitSys = 'imperial';
        }
        else
        {
          tempUnit = 'C';
          speedUnit = 'km/h';
          unitSys = 'metric';
        }
      }
    }
  }

    setTimeout(() => {
  

      var url = "https://api.apixu.com/v1/current.json?key=dd562c2de2ac479bb63201414190206&q=" +postalCode;
      var currentWeather = new XMLHttpRequest();
      currentWeather.open('GET',url,true);
      currentWeather.onload = function () {
        // Begin accessing JSON data here
        var data = JSON.parse(this.response);
        if(tempUnit === 'F')
        {
          currentTemp = data.current.temp_f;
          feelsLike=data.current.feelslike_f;
          wind=data.current.wind_mph;
        }
        else
        {
          currentTemp = data.current.temp_c;
          feelsLike=data.current.feelslike_c;
          wind=data.current.wind_kph;
        }
        currentConditions=data.current.condition.text;
        id=data.current.condition.code;
        document.getElementById('iconImg').src = data.current.condition.icon;
        humidity=data.current.humidity;
        document.getElementById('currentCondText').innerHTML = currentConditions;
        document.getElementById('currentTempText').innerHTML = currentTemp + tempUnit;
        document.getElementById('humidityText').innerHTML = humidity +"%";
        document.getElementById('feelsLikeText').innerHTML = feelsLike + tempUnit;
        document.getElementById('windText').innerHTML = wind + speedUnit;
        if(data.location.country === 'USA' || data.location.country === 'Canada')
        {
          document.getElementById('locationHead').innerHTML = data.location.name + ", " + data.location.region;
        }
        else
        {
          document.getElementById('locationHead').innerHTML = data.location.name + ", " + data.location.country;
 
        }
          setCookie("pcode", postalCode, 365);
          setCookie("units", unitSys, 365);
  
      }
      currentWeather.send();
    }, 1000);
}



function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie(cname) {
  var cookie = getCookie(cname);
  if(cookie != "")
  {
    return true;
  }
  else
  {
    return false;
  }
}
function deleteCookie(cname)
{
  document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
}

function clearWeatherInput()
{
  document.getElementById('pcodeInput').value="";
  document.getElementById('pcodeSpan').classList.add('flyOutWeatherInput');
  document.getElementById('weatherSubmit').classList.add('flyOutWeatherInput');
  document.getElementById('radioSpan').classList.add('flyOutWeatherInput');

  document.getElementById('changeLocation').classList.remove('Hidden');
}

function showWeatherInput()
{
  document.getElementById('changeLocation').classList.add('Hidden');
  document.getElementById('pcodeInput').value="";

  document.getElementById('pcodeSpan').classList.remove('flyOutWeatherInput');
  document.getElementById('weatherSubmit').classList.remove('flyOutWeatherInput');
  document.getElementById('radioSpan').classList.remove('flyOutWeatherInput');


  document.getElementById('pcodeSpan').classList.add('flyInWeatherInput');
  document.getElementById('weatherSubmit').classList.add('flyInWeatherInput');
  document.getElementById('radioSpan').classList.add('flyInWeatherInput');

}

function changeCards(card)
{
  var weatherHidden = false;
  var alarmHidden = false;
  var homeHidden = false;
  
  var cards = document.getElementsByClassName('Hidden');
  for(var i = 0; i<cards.length;i++)
  {
    if(cards[i].id === 'jumbotronWeather')
    {
      weatherHidden = true;
    }
    else if(cards[i].id === 'jumbotronHome')
    {
      homeHidden = true;
    }
    else if(cards[i].id === 'jumbotronAlarm')
    {
      alarmHidden = true;
    }

  }
  if(weatherHidden == false && card != 'weather')
  {
    document.getElementById('jumbotronWeather').classList.add('moveCardOut');
    document.getElementById('jumbotronWeather').classList.add('Hidden');      
    document.getElementById('jumbotronWeather').classList.remove('moveCardIn');
  }
  else if(homeHidden == false && card != 'home')
  {
    document.getElementById('jumbotronHome').classList.add('moveCardOut');
    document.getElementById('jumbotronHome').classList.add('Hidden');      
    document.getElementById('jumbotronHome').classList.remove('moveCardIn');
  }
  else if(alarmHidden == false && card != 'alarm')
  {
    document.getElementById('jumbotronAlarm').classList.add('moveCardOut');
    document.getElementById('jumbotronAlarm').classList.add('Hidden');      
    document.getElementById('jumbotronAlarm').classList.remove('moveCardIn');
  }
  else
  {

  }

  if(card === 'weather' && weatherHidden == true)
  {
    document.getElementById('jumbotronWeather').classList.remove('moveCardOut');
    document.getElementById('jumbotronWeather').classList.remove('Hidden');      
    document.getElementById('jumbotronWeather').classList.add('moveCardIn');
  }
  else if(card === 'home' && homeHidden == true)
  {
    document.getElementById('jumbotronHome').classList.remove('moveCardOut');
    document.getElementById('jumbotronHome').classList.remove('Hidden');      
    document.getElementById('jumbotronHome').classList.add('moveCardIn');
  }
  else if(card === 'alarm' && alarmHidden == true)
  {
    document.getElementById('jumbotronAlarm').classList.remove('moveCardOut');
    document.getElementById('jumbotronAlarm').classList.remove('Hidden');      
    document.getElementById('jumbotronAlarm').classList.add('moveCardIn');
  }
  else
  {

  }
}


var circle = document.querySelector('circle');
var radius = circle.r.baseVal.value;
var circumference = radius * 2 * Math.PI;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = `${circumference}`;

function setProgress(percent) {
  const offset = circumference - percent / 100 * circumference;
  circle.style.strokeDashoffset = offset;
  if(percent >=100)
  {
    timesUp();
  }
}


var increment;
var totalTime;
var percent;
var newDate;
var now;
var time;

function getTimeOut(hh,mm,ss)
{
  stop = false;
  var hourMs = 3600000;
  var minsMs = 60000;
  var secMs = 1000;
  var hours = hh;
  var mins = mm;
  var secs = ss;
  if(hours === 'hh')
  {
    hours=00;
  }
  if(mins === 'mm')
  {
    mins=00;
  }
  if(secs === 'ss')
  {
    secs=00;
  }
  totalTime = ((hours * hourMs) + (mins * minsMs) + (secs * secMs)) / 1000;
  increment = 0;
  percent = 0;
  startTimeOut(totalTime);
  now = currentTime();
  newDate = now + (totalTime * 1000);
  time = totalTime/60;
}


function startTimeOut()
{
  if(stop != true)
  {
    now = currentTime();
    var distance = newDate - now;
    console.log(time);
    if(distance >= 0)
    {
      increment += .0166666666666667;
      percent = (increment/time)*100;
      console.log(percent);
      setProgress(percent);
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      if(hours <= 9)
      {
        document.getElementById('hh').innerHTML = "0" + hours + ":";
      }
      else
      {
        document.getElementById('hh').innerHTML = hours + ":";
      }
      if(minutes <= 9)
      {
        document.getElementById('mm').innerHTML = "0" + minutes + ":";
      }
      else
      {
        document.getElementById('mm').innerHTML = minutes + ":";
      }
      if(seconds <= 9)
      {
        document.getElementById('ss').innerHTML = "0" + seconds;
      }
      else
      {
        document.getElementById('ss').innerHTML = seconds;
      }
  
    }
  }
}

function timesUp()
{
  alert.volume = 0.5;
  document.getElementById('circle').classList.add('timerDone');
  alert.loop=true;
  alert.play();
}

function resetTimer()
{
  setProgress(100);
  document.getElementById('circle').style.stroke = '#7ed6df';
  document.getElementById('circle').classList.remove('timerDone');
  alert.pause();
  document.getElementById('countdownText').classList.add('Hidden');
  document.getElementById('hh').innerHTML = "00:";
  document.getElementById('mm').innerHTML = "00:";
  document.getElementById('ss').innerHTML = "00";
  document.getElementById('hours').selectedIndex=0;
  document.getElementById('mins').selectedIndex=0;
  document.getElementById('secs').selectedIndex=0;
  document.getElementById('inputTimer').classList.remove('Hidden');
  increment = null;
  totalTime = null;
  percent = null;
  newDate = null;
  now = null;
  time = null;

}

function setTimerInput()
{
  for(var i = 0; i < 12; i++)
  {
    document.getElementById('hours').innerHTML += 
      '<option value='+i+'>'+i+'</option>';
  }
  for(var i = 0; i < 60; i++)
  {
    document.getElementById('mins').innerHTML += 
      '<option value='+i+'>'+i+'</option>';
      document.getElementById('secs').innerHTML += 
      '<option value='+i+'>'+i+'</option>';
  }
}

function removeTimerInput()
{
  document.getElementById('inputTimer').classList.add('Hidden');
  document.getElementById('countdownText').classList.remove('Hidden');
}
function stopTimer()
{
  stop = true;
}
var button = document.getElementById('startTimer');
button.addEventListener("click",alert.play())

function event()
{
  alert.volume = 0.0;
  alert.play();
  alert.pause();
}