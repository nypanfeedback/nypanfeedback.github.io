// load the texts from config.json
$.getJSON('/config.json',
  (config) => {
    ['magyar','deutsch'].forEach((language) => {
      $($(`#question > .${language}`)[0]).text(config.question[language]);
      $($(`#hints > .worst.${language}`)[0]).text(config.hints.worst[language]);
      $($(`#hints > .best.${language}`)[0]).text(config.hints.best[language]);
      $($(`#notification > .${language}`)[0]).text(config.notification[language]);
    });
  }
);

// Google Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-111488678-1', 'auto');

// toggle between notification and feedback view
var notification = $('#notification');
var feedback = $('#feedback');
var selected = false;
// because we do not change visibility but set display to none we better make sure it keeps the height
let height = Math.max(notification.css('height').replace("px",""),feedback.css('height').replace("px",""));
notification.css('height',`${height}px`);
feedback.css('height',`${height}px`);
notification.hide();

function reset(delay_in_ms) {
  setTimeout(() => {
    ['star-1','star-2','star-3','star-4','star-5'].forEach(
      (target) => {
        let elem = $(`#${target}`);
        elem.prop("checked", false);
      });
    selected = false;
  }, delay_in_ms);
}
function toggleNotification(delay_in_ms) {
  setTimeout(() => {
    if (feedback.is(':visible')) {
      feedback.fadeToggle({
        duration: 200,
        complete: () => notification.fadeToggle(200)
      });
    } else {
      notification.fadeToggle({
        duration: 200,
        complete: () => feedback.fadeToggle(200)
      });
    }
  }, delay_in_ms);
}
['star-1','star-2','star-3','star-4','star-5'].forEach(
  (target) => {
    let elem = document.getElementById(target);
    if (elem) {
      elem.addEventListener('click',
        () => {
          if (!selected) {
            selected = true;
            delay_in_ms = 1500;
            toggleNotification(delay_in_ms);
            setTimeout(() => {
              ga('send', {
              hitType: 'event',
              eventCategory: 'Satisfaction',
              eventAction: target
              });
            }, delay_in_ms+500);
            reset(delay_in_ms+1000);
            toggleNotification(delay_in_ms+2500);
          }
        },false);
    }
  }
);

// change languages
$('.deutsch').toggle();
$('img.flag').click(() => {
  $('img.flag').toggleClass('blackAndWhite');
  $('img.flag').toggleClass('framed');
  $('.deutsch').toggle();
  $('.magyar').toggle();
});
