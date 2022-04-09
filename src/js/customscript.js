/*!
 * CAREERCRAFT CUSTOM SCRIPT
 * 
 *   WRITTEN ON:9 APRIL 2022
 *   VERSION : 1.0

*/
$(function () {
  // Scroll to Top
  $(window).scroll(function () {
    if ($(this).scrollTop() >= 50) {
      $("#return-to-top").fadeIn(200);
    } else {
      $("#return-to-top").fadeOut(200);
    }
  });
  $("#return-to-top").click(function () {
    $("body,html").animate(
      {
        scrollTop: 0,
      },
      100
    );
  });
});

//Hamburger click
function myFunction(x) {
  x.classList.toggle("change");
}

//Wow js
new WOW().init();
