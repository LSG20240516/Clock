const CANVAS_WIDTH = 820;
const CANVAS_HEIGHT = 820;
const RADIUS = CANVAS_HEIGHT / 2;

let canvas, ctx;
let clockInterval;
let secondsDegrees, minutesDegrees, hoursDegrees;
let currentTime, seconds, minutes, hours, millisec;
let alarm_minute, alarm_hour;
let bool_realtime = true;
let bool_hourvalueview = true;
let bool_minvalueview = true;
let bool_secvalueview = true;
let bool_hourhandview = true;
let bool_minhandview = true;
let bool_sechandview = true;
let bool_hourhandview_bojo = true;
let bool_minhandview_bojo = true;
let bool_sechandview_bojo = true;
let bool_darkmode = true;
let bool_sunmoonmode = true;
let bool_continuemode = true;
let bool_randommode = false;
let bool_alarmmode = false;

const realtimecheck = document.getElementById("realtimecheck");
const hourvalueview = document.getElementById("hourvalueview");
const minvalueview = document.getElementById("minvalueview");
const secvalueview = document.getElementById("secvalueview");
const hourhandview = document.getElementById("hourhandview");
const minhandview = document.getElementById("minhandview");
const sechandview = document.getElementById("sechandview");
const hourhandview_bojo = document.getElementById("hourhandview_bojo");
const minhandview_bojo = document.getElementById("minhandview_bojo");
const sechandview_bojo = document.getElementById("sechandview_bojo");
const darkmode = document.getElementById("darkmode");
const sunmoonmode = document.getElementById("sunmoonmode");
const continuemode = document.getElementById("continuemode");
const hidedigital = document.getElementById("hidedigital");

const alarmcheck = document.getElementById("alarmcheck");
const ampm_alarm = document.getElementById("ampm_alarm");
const h_alarm = document.getElementById("h_alarm");
const m_alarm = document.getElementById("m_alarm");
const btn_alarm = document.getElementById("btn_alarm");
const btn_alarm_stop = document.getElementById("btn_alarm_stop");
const optiontimenames = Array.from(
  document.getElementsByClassName("optiontimename1")
);

const digitalclock = document.getElementsByClassName("digitalclock");
const digitalclock2 = document.getElementsByClassName("digitalclock2");

optiontimenames.forEach((optiontimename) =>
  optiontimename.addEventListener("change", onOptiontimeName)
);
const randombutton = document.getElementById("randombutton");
let randomoption = "1";
let urlParams_new = new URLSearchParams();
var divstudys = document.getElementsByClassName("divstudy"); 

const set_hours = Array.from(document.getElementsByClassName("hour"));
set_hours.forEach((set_hour) => set_hour.addEventListener("click", onSet_hour));
function onSet_hour(event) {
  //console.log(event.target.dataset.hour);
  hours = parseInt(event.target.dataset.hour);
  minutes = 0;
  seconds = 0;

  anal_digi_viewClock();
}

const set_minutes = Array.from(document.getElementsByClassName("minute"));
set_minutes.forEach((set_minute) =>
  set_minute.addEventListener("click", onSet_minute)
);
function onSet_minute(event) {
  //console.log(event.target.dataset.min);
  minutes = parseInt(event.target.dataset.min);
  seconds = 0;

  anal_digi_viewClock();
}

const set_updowns = Array.from(document.getElementsByClassName("updown"));
set_updowns.forEach((set_updown) =>
  set_updown.addEventListener("click", onSet_updown)
);
function onSet_updown(event) {
  //console.log("55:" + event.target.dataset.type + "-" + event.target.dataset.updown + "-" + event.target.dataset.interval);

  switch (event.target.dataset.type) {
    case "hour":
      if (event.target.dataset.updown === "up")
        hours += parseInt(event.target.dataset.interval);
      else hours -= parseInt(event.target.dataset.interval);
      break;
    case "min":
      if (event.target.dataset.updown === "up")
        minutes += parseInt(event.target.dataset.interval);
      else minutes -= parseInt(event.target.dataset.interval);
      break;
    case "sec":
      if (event.target.dataset.updown === "up")
        seconds += parseInt(event.target.dataset.interval);
      else seconds -= parseInt(event.target.dataset.interval);
      break;
  }

  anal_digi_viewClock();
}



function init() {
  canvas = document.getElementById("clock");
  ctx = canvas.getContext("2d");
  ctx.lineCap = "round";

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  ctx.font = `${RADIUS * 0.12}px arial`;
  //ctx.font = RADIUS * 0.15 + "px arial";  //위 아래 내용은 동일한 내용임.
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  clockInterval = setInterval(function () {
    anal_digi_viewClock();
  }, 10);

  bool_randommode = false;
  divstudys_view("hidden");
  
  setTimeout(function () {
    params_check();

    //ampm_alarm.innerHTML = "";//ampm;
    alarm_minute = minutes+1;
    alarm_hour = hours;
    h_alarm.innerHTML = zeroPadding(alarm_hour);
    m_alarm.innerHTML = zeroPadding(alarm_minute);

  }, 10);
  link_create("blank",true);
  alarm_div[0].style.display = "none";
}

const alarm_updowns = Array.from(document.getElementsByClassName("alarm_updown"));
alarm_updowns.forEach((alarm_updown) => alarm_updown.addEventListener("mousedown", onAlarm_updown));
function onAlarm_updown(event) {
  //console.log(event.target.dataset.type);
  //console.log(event.target.dataset.updown);
  switch (event.target.dataset.type) {
    case "hour":
      if (event.target.dataset.updown === "up") {
        if (alarm_hour < 23) alarm_hour += 1;
      }
      else {
        if (alarm_hour > 0) alarm_hour -= 1;
      } 
      break;
    case "minute":
      if (event.target.dataset.updown === "up") {
        if (alarm_minute < 59) {
          alarm_minute += 1;
        }
        else
        {
          alarm_hour += 1;
          alarm_minute = 0;
        }
      }
      else {
        if (alarm_minute > 0) {
          alarm_minute -= 1;
        }
        else {
          alarm_hour -= 1;
          alarm_minute = 59;
        }
      } 
      break;
  }
  h_alarm.innerHTML = zeroPadding(alarm_hour);
  m_alarm.innerHTML = zeroPadding(alarm_minute);
}



function anal_digi_viewClock() {
  viewClock();
  digitalTime();
}

function viewClock() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  nowtime();
  backColorSet();

  drawFrame();
  if (bool_sunmoonmode) {
    backImageSet();
  }

  if (bool_hourvalueview) drawNumbers2();
  if (bool_minvalueview) drawNumbers_min();
  if (bool_secvalueview) drawNumbers_sec();
  //console.log(bool_secvalueview);
  drawClock();

  //requestAnimationFrame(drawClock);
}

function nowtime() {
  if (bool_realtime) {
    currentTime = new Date();
    seconds = currentTime.getSeconds();
    minutes = currentTime.getMinutes();
    hours = currentTime.getHours();
    millisec = currentTime.getMilliseconds();
    //초바늘 연속을 위해
    if (bool_continuemode) {
      let time2 = (function () {
        let midnight = new Date();
        midnight.setHours(0);
        midnight.setMinutes(0);
        midnight.setSeconds(0);
        midnight.setMilliseconds(0);
        return Date.now() - midnight.getTime();
      })();
      hours2 = time2 / (60 * 60 * 1000);
      minutes2 = (hours2 * 60) % 60;
      seconds2 = (minutes2 * 60) % 60;
    } else {
      seconds2 = seconds;
    }
  } else {
    if (seconds >= 60) {
      seconds -= 60;
      minutes += 1;
    } else if (seconds < 0) {
      seconds += 60;
      minutes -= 1;
    }

    if (minutes >= 60) {
      minutes -= 60;
      hours += 1;
    } else if (minutes < 0) {
      minutes += 60;
      hours -= 1;
    }

    if (hours >= 24) hours -= 24;
    else if (hours < 0) hours += 24;

    seconds2 = seconds;
  }
}

function drawClock() {
  // determine the degree of angle in which each clock hand is there

  secondsDegrees = (seconds - 15) * 6;
  secondsDegrees2 = (seconds2 - 15) * 6;

  minutesDegrees = (minutes - 15) * 6;
  hoursDegrees = (hours - 3 + minutes / 60) * 30;

  if (alarmcheck.checked) alarmhand();
  
  if (bool_hourhandview) hourhand();
  if (bool_minhandview) minhand();
  if (bool_sechandview) sechand();

  // fill center with dark black color
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, 2 * Math.PI, false);
  ctx.fill();
  ctx.closePath();
  ctx.translate(-RADIUS, -RADIUS);
}

function alarmhand() {
  minutesDegrees2 = (alarm_minute - 15) * 6;
  hoursDegrees2 = (alarm_hour - 3 + alarm_minute / 60) * 30;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "yellow";
  drawHand(ctx, hoursDegrees2, RADIUS * 0.4); // hour hand is 0.6 times of radius
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.strokeStyle = "yellow";
  ctx.lineWidth = 4;
  drawHand(ctx, minutesDegrees2, RADIUS * 0.6); // minute hand is 0.85 times of radius
  ctx.stroke();
  ctx.closePath();  
}

function hourhand() {
  // hour hand
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineWidth = 10;
  ctx.strokeStyle = "green";
  drawHand(ctx, hoursDegrees, RADIUS * 0.67); // hour hand is 0.6 times of radius
  ctx.stroke();
  ctx.closePath();

  if (bool_hourhandview_bojo) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "green";
    drawHand(ctx, hoursDegrees, RADIUS * 0.9); // hour hand is 0.6 times of radius
    ctx.stroke();
    ctx.closePath();
  }
}

function minhand() {
  //분침 보정
  let addminutesDegrees = (secondsDegrees + 90) / 60;
  minutesDegrees = minutesDegrees + addminutesDegrees;
  // minute hand
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 7;
  drawHand(ctx, minutesDegrees, RADIUS * 0.73); // minute hand is 0.85 times of radius
  ctx.stroke();
  ctx.closePath();

  if (bool_minhandview_bojo) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    drawHand(ctx, minutesDegrees, RADIUS * 0.9); // minute hand is 0.85 times of radius
    ctx.stroke();
    ctx.closePath();
  }
}

function sechand() {
  // second hand
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.strokeStyle = "red";
  ctx.lineWidth = 4;
  drawHand(ctx, secondsDegrees2, RADIUS * 0.8); // second hand is 0.75 times of radius
  ctx.stroke();
  ctx.closePath();

  if (bool_sechandview_bojo) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    drawHand(ctx, secondsDegrees2, RADIUS * 0.9); // second hand is 0.75 times of radius
    ctx.stroke();
    ctx.closePath();
  }
}

function drawHand(ctx, angleInDegrees, r) {
  let a = r * Math.cos((angleInDegrees * Math.PI) / 180);
  let b = r * Math.sin((angleInDegrees * Math.PI) / 180);
  ctx.lineTo(a, b);
}

// function drawNumbers() {
//   var ang;
//   var num;
//   ctx.font = radius * 0.9 * 0.15 + "px arial";
//   ctx.textBaseline = "middle";
//   ctx.textAlign = "center";
//   ctx.fillStyle = "#333";
//   for (num = 1; num < 13; num++) {
//     ang = (num * Math.PI) / 6;
//     ctx.rotate(ang);
//     ctx.translate(0, -radius * 0.9 * 0.85);
//     ctx.rotate(-ang);
//     ctx.fillText(num.toString(), 0, 0);
//     ctx.rotate(ang);
//     ctx.translate(0, radius * 0.9 * 0.85);
//     ctx.rotate(-ang);
//   }
// }

function drawNumbers2() {
  ctx.beginPath();
  ctx.font = `${RADIUS * 0.12}px arial`;
  //ctx.fillStyle = "#000000";
  ctx.fillStyle = changecolor;
  for (let num = 1; num <= 12; num++) {
    let x = RADIUS * 0.9 * 0.84 * Math.cos(((num * 30 - 90) * Math.PI) / 180);
    let y = RADIUS * 0.9 * 0.84 * Math.sin(((num * 30 - 90) * Math.PI) / 180);
    ctx.fillText(num, x, y);
  }
}

function drawNumbers_min() {
  ctx.beginPath();
  ctx.fillStyle = "blue";
  ctx.font = `${RADIUS * 0.08}px arial`;
  for (let num = 1; num <= 12; num++) {
    let x = RADIUS * 0.9 * 0.7 * Math.cos(((num * 30 - 90) * Math.PI) / 180);
    let y = RADIUS * 0.9 * 0.7 * Math.sin(((num * 30 - 90) * Math.PI) / 180);
    ctx.fillText(num * 5, x, y);
  }
}

function drawNumbers_sec() {
  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.font = `${RADIUS * 0.05}px arial`;
  for (let num = 1; num <= 60; num++) {
    let x =
      RADIUS * 0.9 * 1.08 * Math.cos(((num * 30 - 90) * Math.PI) / (180 * 5));
    let y =
      RADIUS * 0.9 * 1.08 * Math.sin(((num * 30 - 90) * Math.PI) / (180 * 5));
    let num2;
    if (num + 12 > 60) num2 = num + 12 - 60;
    else num2 = num + 12;
    ctx.fillText(num2, x, y);
  }
}

function drawFrame() {
  ctx.translate(RADIUS, RADIUS);

  ctx.beginPath();
  ctx.arc(0, 0, RADIUS * 0.9, 0, 2 * Math.PI);
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 0, RADIUS * 0.9, 0, 2 * Math.PI);
  ctx.fillStyle = "#444444" + backalphavalue.toString(16);
  ctx.fill();

  var grad = ctx.createRadialGradient(
    0,
    0,
    RADIUS * 0.9 * 0.97,
    0,
    0,
    RADIUS * 0.9 * 1.03
  );
  grad.addColorStop(0, "#aa0");
  grad.addColorStop(0.5, "white");
  grad.addColorStop(1, "#333");
  ctx.strokeStyle = grad;
  ctx.lineWidth = RADIUS * 0.07;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, RADIUS * 0.03, 0, 2 * Math.PI);
  ctx.fillStyle = "#333";
  ctx.fill();

  for (let num = 1; num <= 60; num++) {
    let linesize;
    if (num % 5 === 0) {
      ctx.beginPath();
      ctx.lineCap = "round";
      //ctx.strokeStyle = "black";
      ctx.strokeStyle = changecolor;
      ctx.lineWidth = 5;
      linesize = 0.83;
    } else {
      ctx.beginPath();
      ctx.lineCap = "round";
      //ctx.strokeStyle = "black";
      ctx.strokeStyle = changecolor;
      ctx.lineWidth = 3;
      linesize = 0.85;
    }

    let x1 = RADIUS * linesize * Math.cos(((num * 6 - 90) * Math.PI) / 180);
    let y1 = RADIUS * linesize * Math.sin(((num * 6 - 90) * Math.PI) / 180);
    let x2 = RADIUS * 0.87 * Math.cos(((num * 6 - 90) * Math.PI) / 180);
    let y2 = RADIUS * 0.87 * Math.sin(((num * 6 - 90) * Math.PI) / 180);
    //ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    //ctx.closePath();
  }
}
var audio = new Audio('alarm.mp3');

function alarm_check() {
  //console.log("alarm=>" + alarm_hour+":" +alarm_minute);
  //console.log("real =>" + hours+":" +minutes);
  if ((alarm_hour==hours) && (alarm_minute==minutes)) {
    audio.pause();
    audio.currentTime = 0;
    audio.play();
    bool_alarmmode = false;
    alarmmode_change(bool_alarmmode);
    btn_alarm_stop.style.visibility = "";
  }
}

function digitalTime() {
  if (bool_alarmmode) alarm_check();

  if (hours == 0) {
    hr = 12;
  } else if (hours > 12) {
    hr = hours - 12;
  } else {
    hr = hours;
  }
  _min = minutes;
  sec = seconds;
  ampm = hours >= 12 ? "오후" : "오전";

  document.getElementsByClassName("ampm")[0].style.color = changecolor;
  document.getElementsByClassName("millisec")[0].style.color = changecolor;
  dotcolor = changecolor;

  digitalclock[0].style.background =
    "#121212" + backalphavalue.toString(16);

  var currentTime =
    "<font color=green>" +
    zeroPadding(hr) +
    "</font><font color=" +
    dotcolor +
    ">:</font><font color=blue>" +
    zeroPadding(_min) +
    "</font><font color=" +
    dotcolor +
    ">:</font><font color=red>" +
    zeroPadding(sec) +
    "</font>";
  document.getElementsByClassName("hms")[0].innerHTML = currentTime;

  if (bool_randommode)
    document.getElementsByClassName("ampm")[0].innerHTML = "";
  else document.getElementsByClassName("ampm")[0].innerHTML = ampm;

  if (bool_continuemode) {
    document.getElementsByClassName("millisec")[0].style.visibility = "";
    document.getElementsByClassName("millisec")[0].innerHTML = parseInt(
      millisec / 100
    );
  } else {
    document.getElementsByClassName("millisec")[0].style.visibility = "hidden";
  }
}

var backalphavalue, changecolor, dotcolor;

function backColorSet() {
  if (bool_darkmode) {
    if (hours >= 20 || hours < 5) {
      //밤
      backalphavalue = 14 * 16 + 14;
      changecolor = "#ffffff";
      //ctx.drawImage(imgElement,-0,-0);
    } else if (hours >= 8 && hours < 17) {
      //낮
      backalphavalue = 2 * 16 + 2;
      changecolor = "#000000";
    } else if (hours >= 5 && hours < 8) {
      // 밤->낮
      backalphavalue =
        (14 - (hours - 5) * 4) * 16 + (14 - (hours - 5) * 4) - minutes;
      changecolor = "#ffffff";
    } else {
      // 낮->밤
      backalphavalue =
        ((hours - 17) * 4 + 2) * 16 + ((hours - 17) * 4 + 2) + minutes;
      changecolor = "#000000";
    }
  } else {
    backalphavalue = 2 * 16 + 2;
    changecolor = "#000000";
  }
}

const imgElement = new Image();
imgElement.src = "./mon.gif";
const imgElement2 = new Image();
imgElement2.src = "./sun.gif";

function backImageSet() {
  if (hours >= 20 || hours < 5) {
    //밤
    ctx.drawImage(imgElement, -100, -160);
  } else if (hours >= 8 && hours < 17) {
    //낮
    ctx.drawImage(imgElement2, -140, -150);
  } else if (hours >= 5 && hours < 8) {
    // 밤->낮
    if (hours === 5)
      ctx.drawImage(imgElement, -100, -160 + ((hours - 5) * 20 + minutes)); //밤
    if (hours === 7)
      ctx.drawImage(imgElement2, -140, -90 - ((hours - 7) * 20 + minutes)); //낮
  } else {
    // 낮->밤
    if (hours === 19)
      ctx.drawImage(imgElement, -100, -100 - ((hours - 19) * 20 + minutes)); //밤
    if (hours === 17)
      ctx.drawImage(imgElement2, -140, -150 + ((hours - 17) * 20 + minutes)); //낮
  }
}

function zeroPadding(num) {
  var zero = "";
  if (num < 10) zero += "0";
  return zero + num;
}

realtimecheck.addEventListener("change", function () {
  if (this.checked) {
    clockInterval = setInterval(function () {
      viewClock();
      digitalTime();
    }, 10);
    bool_realtime = true;
    divstudys_view("hidden");    //아래 버튼들 숨기기
    if (alarmcheck.checked) alarm_div[0].style.display = ""; //알람 보이기

  } else {
    clearInterval(clockInterval);
    bool_realtime = false;
    divstudys_view("");  //아래 버튼들 보이기
    alarm_div[0].style.display = "none"; //알람 숨기기
  }
  bool_randommode = false;
  link_create("realtimecheck",this.checked);
});

hourvalueview.addEventListener("change", function () {
  if (this.checked) bool_hourvalueview = true;
  else bool_hourvalueview = false;

  anal_digi_viewClock();
  link_create("hourvalueview",this.checked);
});

minvalueview.addEventListener("change", function () {
  if (this.checked) bool_minvalueview = true;
  else bool_minvalueview = false;

  anal_digi_viewClock();
  link_create("minvalueview",this.checked);
});

secvalueview.addEventListener("change", function () {
  if (this.checked) bool_secvalueview = true;
  else bool_secvalueview = false;

  anal_digi_viewClock();
  link_create("secvalueview",this.checked);
});

hourhandview.addEventListener("change", function () {
  if (this.checked) bool_hourhandview = true;
  else bool_hourhandview = false;

  anal_digi_viewClock();
  link_create("hourhandview",this.checked);
});

minhandview.addEventListener("change", function () {
  if (this.checked) bool_minhandview = true;
  else bool_minhandview = false;

  anal_digi_viewClock();
  link_create("minhandview",this.checked);
});

sechandview.addEventListener("change", function () {
  if (this.checked) bool_sechandview = true;
  else bool_sechandview = false;

  anal_digi_viewClock();
  link_create("sechandview",this.checked);
});

hourhandview_bojo.addEventListener("change", function () {
  if (this.checked) bool_hourhandview_bojo = true;
  else bool_hourhandview_bojo = false;

  anal_digi_viewClock();
  link_create("hourhandview_bojo",this.checked);
});

minhandview_bojo.addEventListener("change", function () {
  if (this.checked) bool_minhandview_bojo = true;
  else bool_minhandview_bojo = false;

  anal_digi_viewClock();
  link_create("minhandview_bojo",this.checked);
});

// sechandview_bojo.addEventListener("change", function () {
//   if (this.checked) bool_sechandview_bojo = true;
//   else bool_sechandview_bojo = false;

//   anal_digi_viewClock();
//   link_create("sechandview_bojo",this.checked);
// });

sechandview_bojo.addEventListener("change", function () {
  if (this.checked) bool_sechandview_bojo = true;
  else bool_sechandview_bojo = false;

  anal_digi_viewClock();
  link_create("sechandview_bojo",this.checked);
});


sunmoonmode.addEventListener("change", function () {
  if (this.checked) bool_sunmoonmode = true;
  else bool_sunmoonmode = false;

  anal_digi_viewClock();
  link_create("sunmoonmode",this.checked);
});

darkmode.addEventListener("change", function () {
  if (this.checked) bool_darkmode = true;
  else bool_darkmode = false;

  anal_digi_viewClock();
  link_create("darkmode",this.checked);
});

continuemode.addEventListener("change", function () {
  if (this.checked) bool_continuemode = true;
  else bool_continuemode = false;

  anal_digi_viewClock();
  link_create("continuemode",this.checked);
});

hidedigital.addEventListener("change", function () {
  if (this.checked)
  digitalclock[0].style.visibility = "";
  else
  digitalclock[0].style.visibility = "hidden";
  
  link_create("hidedigital",this.checked);
});


function onOptiontimeName(event) {
  //랜덤 모드값 지정
  randomoption = event.target.dataset.option;
  //console.log(event.target.dataset.option);
  //순회 체크
  //optiontimenames.forEach((optiontimename) => {
  //     if(optiontimename.checked)  {
  //       console.log(optiontimename.id);
  //     }
  //});
}



randombutton.addEventListener("click", function () {
  bool_randommode = true;
  anal_digi_viewClock2();
});

function anal_digi_viewClock2() {
  bool_realtime = false;
  realtimecheck.checked = false;
  //realtimecheck.click();
  bool_continuemode = false;
  continuemode.checked = false;
  //continuemode.click();
  bool_darkmode = false;
  darkmode.checked = false;
  //darkmode.click();
  bool_sunmoonmode = false;
  sunmoonmode.checked = false;
  //sunmoonmode.click();
  hidedigital.checked = false;
  digitalclock[0].style.visibility = "hidden";
  //hidedigital.click();
  bool_hourvalueview = false;
  hourvalueview.checked = false;
  //hourvalueview.click();
  bool_hourhandview_bojo = false;
  hourhandview_bojo.checked = false;
  //hourhandview_bojo.click();
  bool_minvalueview = false;
  minvalueview.checked = false;
  //minvalueview.click();
  bool_minhandview_bojo = false;
  minhandview_bojo.checked = false;
  //minhandview_bojo.click();
  bool_secvalueview = false;
  secvalueview.checked = false;
  //secvalueview.click();
  bool_sechandview_bojo = false;
  sechandview_bojo.checked = false;
  //sechandview_bojo.click();
  bool_sechandview = false;
  sechandview.checked = false;
  //sechandview.click();

  bool_hourhandview = true;
  bool_minhandview = true;

  viewClock2();
  digitalTime();
}

function viewClock2() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  randomtime();
  backColorSet();

  drawFrame();
  if (bool_sunmoonmode) {
    backImageSet();
  }

  if (bool_hourvalueview) drawNumbers2();
  if (bool_minvalueview) drawNumbers_min();
  if (bool_secvalueview) drawNumbers_sec();
  drawClock();
}



function randomtime() {
  //console.log(randomoption);
  seconds = millisec = seconds2 = 0;
  hours = Math.floor(Math.random() * 12 + 1);
  switch (randomoption) {
    case "1": //시간만
      minutes = 0;
      break;
    case "2": //30분 간격
      minutes = Math.floor(Math.random() * 2) * 30; //0~1
      break;
    case "3": //15분 간격
      minutes = Math.floor(Math.random() * 4) * 15; //0~3
      break;
    case "4": //10분 간격
      minutes = Math.floor(Math.random() * 6) * 10; //0~5
      break;
    case "5": //5분 간격
      minutes = Math.floor(Math.random() * 12) * 5; //0~11
      break;
    case "6": //1분 간격
      minutes = Math.floor(Math.random() * 60); //0~59
      break;
  }
}

function divstudys_view(hiddenview) {
  
  for (var i = 0; i < divstudys.length; i++) { 
    divstudys[i].style.visibility = hiddenview; 
  } 
}

var linkurl = document.getElementsByClassName("linkurl")[0];
var urltext = window.location.origin+window.location.pathname;

function link_create(name,checkvalue) {
  urlParams_new.delete(name);
  if (checkvalue == false) {
    urlParams_new.append(name, "0");
  }
  // linkurl.innerText = urltext + "?" + urlParams_new;
}

function params_check() {
  const urlParams = new URLSearchParams(window.location.search);
  const entries = urlParams.entries();
  for(entry of entries)  {
    //console.log(entry[0]+"-"+entry[1]);
    new Function('return ' + entry[0] + '.click()')();  
    //realtimecheck.click();  위에 줄과 동일한 결과
  }
//  if (urlParams.has('p')) console.log("p 있음");
}

const copybutton = document.getElementById("copybutton");
copybutton.addEventListener("click", function () {
  const valOfDIV = linkurl.innerText;
	const textArea = document.createElement('textarea');
	document.body.appendChild(textArea);
	textArea.value = valOfDIV;
	textArea.select(); 
	document.execCommand('copy');
  //execCommand는 deprecated... 
  //대신 아래처럼 사용할 수 있으나, http는 안되고 https만 된다함.
  //navigator.clipboard.writeText(`${valOfDIV}`);

	document.body.removeChild(textArea); 
  alert("복사되었습니다.");
});

var alarm_div = document.getElementsByClassName("alarm_div"); 

alarmcheck.addEventListener("click", function () {
  if (bool_realtime) {
    if (this.checked) {
      alarm_div[0].style.display = "";
    }
    else {
      alarm_div[0].style.display = "none";
      bool_alarmmode = false;
      alarmmode_change(bool_alarmmode);
    }
  } else {
    alert("실시간 모드에서만 사용 가능합니다.");
    this.checked = false;
  }
  //console.log(this.checked );
  //if (this.checked) link_create("alarmcheck",this.checked);
});

function alarmmode_change(b) {
  if (b) {
    alarm_updowns.forEach(alarm_updown => alarm_updown.style.visibility = "hidden");
    btn_alarm.textContent  = "알람 취소";
    digitalclock2[0].style.backgroundColor = "#999999";
  } else {
    alarm_updowns.forEach(alarm_updown => alarm_updown.style.visibility = "");
    btn_alarm.textContent  = "알람 예약";
    digitalclock2[0].style.backgroundColor = "#ffffff";
  }
}

btn_alarm.addEventListener("click", function () {
  //console.log(alarm_hour+":");
  //console.log(alarm_minute);
  if (bool_alarmmode) {
    bool_alarmmode = false;
  } else {
    bool_alarmmode = true;
  }
  alarmmode_change(bool_alarmmode);
});

btn_alarm_stop.addEventListener("click", function () {
  audio.pause();
  audio.currentTime = 0;
  btn_alarm_stop.style.visibility = "hidden";
});

init();