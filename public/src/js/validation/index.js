import sha512 from 'js-sha512';
export { sha512 } from 'js-sha512';

import $ from 'jquery';

export function validateNotEmpty(a) {
  return a !== undefined && a !== null && a !== '';
}

export function validateRegex(ex, value) {
  return ex.test(value);
}

export function validateEmail(email) {
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailReg.test(email);
}

export function validateLogin(login) {
  var reg = /^[A-Za-z0-9]{6,18}$/;
  return validateNotEmpty(login) && reg.test(login);
}

export function validatePassword(password) {
  var reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,30}$/;
  return reg.test(password);
}

export function validateName(name) {
  return validateNotEmpty(name) && name.length >= 2 && name.length <= 20;
}

export function resetBlames(element) {
  element.find('.help.is-danger').addClass('is-hidden');
  element.find('input').removeClass('is-danger');
}

export function blame(element, message) {
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

export function blameWithCase(element, blame_id, message) {
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

export async function checkLoginAvailable(element) {
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

export async function checkEmailAvailable(element) {
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
