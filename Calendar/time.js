const prompt = require("prompt-sync")();

function dateMath(testDate) {
  const total = Date.parse(testDate) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    days,
    hours,
    minutes,
    seconds,
  };
}
function getTime() {
  const userYear = prompt("What year is the assignment due? ");
  const userMonth = prompt("What Month is the assignment due? ");
  const userDay = prompt("What Day is the assignment due? ");
  const userHour = prompt("What Hour is the assignment due? ");
  const userMinute = prompt("What Minute is the assignment due? ");
  var testDate = new Date(
    userYear,
    userMonth - 1,
    userDay,
    userHour,
    userMinute,
    0,
    0
  );
  let result = dateMath(testDate);
  if (Date.parse(testDate) - Date.parse(new Date()) < 0) {
    console.log("Date in the past");
    return;
  }
  if (Date.parse(testDate) - Date.parse(new Date()) < 3600000 * 72) {
    console.log("This is Urgent!");
  }
  console.log("Time until due:");
  console.log(result);
}
getTime();
