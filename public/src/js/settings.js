// import { Navbar, Dropdown } from '@vizuaalog/bulmajs';
import $ from "jquery";

var form = $("#settings-profile");

var options = {
  firstName: RegExp.prototype.test.bind(/^[A-Za-z0-9]{0,18}$/),
  lastName: RegExp.prototype.test.bind(/^[A-Za-z0-9]{0,18}$/),
  bio: RegExp.prototype.test.bind(/^[A-Za-z0-9]{0,80}$/),
  authorAlias: RegExp.prototype.test.bind(/^[A-Za-z0-9]{0,30}$/),
};

var inputTimeoutFlag = false;

form.find("input").on("input", async function(e) {

  if (inputTimeoutFlag) {
    return;
  }

  var element = $(this);
  element.removeClass("is-success-animated");

  inputTimeoutFlag = true;
  await new Promise(resolve => setTimeout(resolve, 1000));
  inputTimeoutFlag = false;

  var n = $(this).attr("name");
  var v = $(this).val();

  if ((options[n] === undefined) || (options[n].call(v))) {

    var request = $.ajax({
      url: "/api/user",
      type: "put",
      data: { [n]: v }
    });


    element.removeClass("is-danger-animated");

    request
      .done(function(response, textStatus, jqXHR) {
        console.log("done");
        element.addClass("is-success-animated");
        setTimeout(function() {
          //element.removeClass("is-success-animated");
        }, 5000);
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        console.error(
          "The following error occurred: " + textStatus,
          errorThrown
        );
        element.addClass("is-danger-animated");
      });

  } else {
    element.addClass("is-danger-animated");
  }

});
