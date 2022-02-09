
document.querySelector(".app-load-time").innerText = window.performance.timing.domContentLoadedEventEnd- window.performance.timing.navigationStart;

document.addEventListener('DOMContentLoaded', function(){
    //console.log("Time until DOMready: ", Date.now()-timerStart);
    document.querySelector(".app-load-time").innerText = (Date.now()-timerStart) / 1000;
});

// $(document).ready(function() {
//     console.log("Time until DOMready: ", Date.now()-timerStart);
// });
// $(window).load(function() {
//     console.log("Time until everything loaded: ", Date.now()-timerStart);
// });