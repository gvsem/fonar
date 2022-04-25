// import { Navbar, Dropdown } from '@vizuaalog/bulmajs';

import sha512 from 'js-sha512';

import $ from 'jquery';

function validateNotEmpty(a) {
  return a !== undefined && a !== null && a !== '';
}

function validateEmail(email) {
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailReg.test(email);
}

function validateLogin(login) {
  var reg = /^[A-Za-z0-9]{6,18}$/;
  return validateNotEmpty(login) && reg.test(login);
}

function validatePassword(password) {
  var reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,30}$/;
  return reg.test(password);
}

function validateName(name) {
  return validateNotEmpty(name) && name.length >= 2 && name.length <= 20;
}

function resetBlames(element) {
  element.find('.help.is-danger').addClass('is-hidden');
  element.find('input').removeClass('is-danger');
}

function blame(element, message) {
  var name = element.attr('name');
  var value = element.val();
  var blame_element = $('#' + element.attr('blame'));

  element.addClass('is-danger');

  if (message !== null) {
    if (blame_element.length != 0) {
      $(blame_element).removeClass('is-hidden');
    }
  }

  if (message !== null) {
    if (message !== undefined) {
      $(blame_element).html(message);
    }
  }
}

function blameWithCase(element, blame_id, message) {
  var name = element.attr('name');
  var value = element.val();
  var blame_element = $('#' + blame_id);

  element.addClass('is-danger');

  if (message !== null) {
    console.log(message);
    if (blame_element.length !== 0) {
      console.log(blame_element);
      blame_element.removeClass('is-hidden');
    }
  }

  if (message !== null) {
    if (message !== undefined) {
      blame_element.html(message);
    }
  }
}

var request;

async function checkLoginAvailable(element) {
  resetBlames($('#login-field'));
  var element = element;
  var value = element.val();
  if (validateLogin(value)) {
    var response = await $.ajax({
      url: '/api/auth/checkLogin/' + value,
      type: 'get',
    });

    return response === 'true';
  }
  return false;
}

async function checkEmailAvailable(element) {
  resetBlames($('#email-field'));
  var element = element;
  var value = element.val();
  if (validateEmail(value)) {
    var response = await $.ajax({
      url: '/api/auth/checkEmail/' + value,
      type: 'get',
    });

    return response === 'true';
  }
  return false;
}

async function validate(form) {
  resetBlames(form);
  var begin = 0;
  var finish = 0;

  for (var i of form.find('input')) {
    var element = $(i);
    begin += 1;
    var name = element.attr('name');
    var value = element.val();
    if (element.attr('required') !== undefined) {
      if (!validateNotEmpty(value)) {
        blame(element, null);
        continue;
      }
    }
    if (name === 'firstname' || name === 'lastname') {
      if (!validateName(value)) {
        blame(element);
        continue;
      }
    }
    if (name === 'password') {
      if (!validatePassword(value)) {
        blame(element);
        continue;
      }
    }
    if (name === 'login') {
      if (!validateLogin(value)) {
        blameWithCase(element, 'blame-login-format');
        continue;
      }
      var av = await checkLoginAvailable(element);
      if (av === false) {
        blameWithCase(element, 'blame-login-occupied');
        continue;
      }
    }
    if (name === 'email') {
      if (!validateEmail(value)) {
        blameWithCase(element, 'blame-email-format');
        continue;
      }
      var av = await checkEmailAvailable(element);
      if (av === false) {
        blameWithCase(element, 'blame-email-occupied');
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

  for (var i of form.find('input')) {
    var element = $(i);
    begin += 1;
    var name = element.attr('name');
    var value = element.val();
    if (element.attr('required') !== undefined) {
      if (!validateNotEmpty(value)) {
        blame(element, null);
        continue;
      }
    }
    finish += 1;
  }

  console.log(begin + ' / ' + finish);
  return begin === finish;
}

var form = $('#signup-form');

form.find('input[name=login]').on('input', async function (e) {
  if (validateLogin($(this).val())) {
    var av = await checkLoginAvailable($(this));
    if (av === false) {
      return blameWithCase($(this), 'blame-login-occupied');
    }
  }
});

form.find('input[name=email]').on('input', async function (e) {
  if (validateEmail($(this).val())) {
    var av = await checkEmailAvailable($(this));
    if (av === false) {
      return blameWithCase($(this), 'blame-email-occupied');
    }
  }
});

form.find('input[name=agree]').on('input', function (e) {
  if (!$(this).prop('checked')) {
    form.find('button[type=submit]').prop('disabled', true);
  } else {
    form.find('button[type=submit]').removeAttr('disabled');
  }
});

function formProcessed(flag) {
  if (flag) {
    form.find('button[type=submit]').prop('disabled', true);
    form.find('button[type=submit]').addClass('is-loading');
  } else {
    form.find('button[type=submit]').removeAttr('disabled');
    form.find('button[type=submit]').removeClass('is-loading');
  }
}

form.submit(async function (e) {
  e.preventDefault();

  if (await validate(form)) {
    form.find('button[type=submit]').prop('disabled', true);

    if (request) {
      request.abort();
    }

    var data = form.serializeArray().reduce(function (a, x) {
      a[x.name] = x.value;
      return a;
    }, {});
    data.firstName = data.firstname;
    delete data.firstname;
    data.lastName = data.lastname;
    delete data.lastname;
    data.password = sha512(data.password);

    request = $.ajax({
      url: '/api/auth/signup',
      type: 'post',
      data: data,
    });

    request
      .done(function (response, textStatus, jqXHR) {
        window.location.replace('/me');
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error(
          'The following error occurred: ' + textStatus,
          errorThrown,
        );
      });
  }

  return false;
});

form.find('input[name=firstname]').val('Николай');
form.find('input[name=lastname]').val('Гумилев');
form.find('input[name=login]').val('gumilev');
form.find('input[name=email]').val('kolya@akmeist.ru');
form.find('input[name=password]').val('abcABC123');
form.find('input[name=agree]').prop('checked', 'true');

var loginForm = $('#login-form');

loginForm.submit(async function (e) {
  e.preventDefault();

  if (await validateLoginForm(loginForm)) {
    loginForm.find('button[type=submit]').prop('disabled', true);

    if (request) {
      request.abort();
    }

    var data = {
      formFields: [
        {
          id: 'email',
          value: loginForm.find('input[name=email]').val(),
        },
        {
          id: 'password',
          value: sha512(loginForm.find('input[name=password]').val()),
        },
      ],
    };

    request = $.ajax({
      url: '/auth/signin',
      type: 'post',
      data: data,
    });

    request
      .done(function (response, textStatus, jqXHR) {
        window.location.replace('/me');
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error(
          'The following error occurred: ' + textStatus,
          errorThrown,
        );
      });
  }

  return false;
});

loginForm.find('input[name=email]').val('kolya@akmeist.ru');
loginForm.find('input[name=password]').val('abcABC123');
