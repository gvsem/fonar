// import { Navbar, Dropdown } from '@vizuaalog/bulmajs';

import $ from "jquery";

import * as exports from "./validation";

Object.entries(exports).forEach(([name, exported]) => window[name] = exported);

var request;

async function validate(form) {
  resetBlames(form);
  var begin = 0;
  var finish = 0;

  for (var i of form.find("input")) {
    var element = $(i);
    begin += 1;
    var name = element.attr("name");
    var value = element.val();
    if (element.attr("required") !== undefined) {
      if (!validateNotEmpty(value)) {
        blame(element, null);
        continue;
      }
    }

    if (name === "firstname" || name === "lastname") {
      if (!validateName(value)) {
        blame(element);
        continue;
      }
    }
    if (name === "password") {
      if (!validatePassword(value)) {
        blame(element);
        continue;
      }
    }
    if (name === "login") {
      if (!validateLogin(value)) {
        blameWithCase(element, "blame-login-format");
        continue;
      }
      var av = await checkLoginAvailable(element);
      if (av === false) {
        blameWithCase(element, "blame-login-occupied");
        continue;
      }
    }
    if (name === "email") {
      if (!validateEmail(value)) {
        blameWithCase(element, "blame-email-format");
        continue;
      }
      var av = await checkEmailAvailable(element);
      if (av === false) {
        blameWithCase(element, "blame-email-occupied");
        continue;
      }
    }
    finish += 1;
  }

  return begin === finish;
}

async function validateLoginForm(form) {
  resetBlames(form);
  var begin = 0;
  var finish = 0;

  for (var i of form.find("input")) {
    var element = $(i);
    begin += 1;
    var name = element.attr("name");
    var value = element.val();
    if (element.attr("required") !== undefined) {
      if (!validateNotEmpty(value)) {
        blame(element, null);
        continue;
      }
    }
    finish += 1;
  }

  console.log(begin + " / " + finish);
  return begin === finish;
}

var form = $("#signup-form");

form.find("input[name=login]").on("input", async function(e) {
  if (validateLogin($(this).val())) {
    var av = await checkLoginAvailable($(this));
    if (av === false) {
      return blameWithCase($(this), "blame-login-occupied");
    }
  }
});

form.find("input[name=email]").on("input", async function(e) {
  if (validateEmail($(this).val())) {
    var av = await checkEmailAvailable($(this));
    if (av === false) {
      return blameWithCase($(this), "blame-email-occupied");
    }
  }
});

form.find("input[name=agree]").on("input", function(e) {
  if (!$(this).prop("checked")) {
    form.find("button[type=submit]").prop("disabled", true);
  } else {
    form.find("button[type=submit]").removeAttr("disabled");
  }
});

function formProcessed(flag) {
  if (flag) {
    form.find("button[type=submit]").prop("disabled", true);
    form.find("button[type=submit]").addClass("is-loading");
  } else {
    form.find("button[type=submit]").removeAttr("disabled");
    form.find("button[type=submit]").removeClass("is-loading");
  }
}

form.submit(async function(e) {
  e.preventDefault();

  if (await validate(form)) {
    form.find("button[type=submit]").prop("disabled", true);

    if (request) {
      request.abort();
    }

    var data = form.serializeArray().reduce(function(a, x) {
      a[x.name] = x.value;
      return a;
    }, {});
    data.firstName = data.firstname;
    delete data.firstname;
    data.lastName = data.lastname;
    delete data.lastname;
    data.password = sha512(data.password);

    request = $.ajax({
      url: "/api/auth/signup",
      type: "post",
      data: data
    });

    request
      .done(function(response, textStatus, jqXHR) {
        window.location.href = '/me';
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        console.error(
          "The following error occurred: " + textStatus,
          errorThrown
        );
      });
  }

  return false;
});

form.find("input[name=firstname]").val("Николай");
form.find("input[name=lastname]").val("Гумилев");
form.find("input[name=login]").val("gumilev");
form.find("input[name=email]").val("kolya@akmeist.ru");
form.find("input[name=password]").val("abcABC123");
form.find("input[name=agree]").prop("checked", "true");

var loginForm = $("#login-form");

loginForm.submit(async function(e) {
  e.preventDefault();

  if (await validateLoginForm(loginForm)) {
    loginForm.find("button[type=submit]").prop("disabled", true);

    if (request) {
      request.abort();
    }

    var data = {
      formFields: [
        {
          id: "email",
          value: loginForm.find("input[name=email]").val()
        },
        {
          id: "password",
          value: sha512(loginForm.find("input[name=password]").val())
        }
      ]
    };

    request = $.ajax({
      url: "/auth/signin",
      type: "post",
      data: data
    });

    loginForm.find("button[type=submit]").prop("disabled", true);

    request
      .done(async function(response, textStatus, jqXHR) {
        //await new Promise(resolve => setTimeout(resolve, 500));
        window.location.href = '/me';

        //$("<a href='/me'></a>").click();
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        console.error(
          "The following error occurred: " + textStatus,
          errorThrown
        );
      }).always(function() {
      loginForm.find("button[type=submit]").removeAttr("disabled");
      loginForm.find("button[type=submit]").removeClass("is-loading");
    });
  }

  return false;
});

loginForm.find("input[name=email]").val("kolya@akmeist.ru");
loginForm.find("input[name=password]").val("abcABC123");
