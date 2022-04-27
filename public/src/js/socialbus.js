
function getCookie(name) {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  } catch (e) {
    return '';
  }
}

var socketOptions = {
  transportOptions: {
    polling: {
      extraHeaders: {
        Authorization: 'Bearer ' + getCookie('sAccessToken'),
      }
    }
  }
};

import $ from "jquery";
//import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import toastr from "toastr";

var socket = io().connect('ws://' + location.host, socketOptions);
// socket.on('newReponse', function(msg){
//   console.log(msg);
//   toastr.success('Вот радость! Вот счастье!', msg + ' заглянул к Вам на страничку.');
// });
socket.on('notifyNewVisitor', function(user){
  console.log(user);
  toastr.success('Вот радость! Вот счастье!', user + ' заглянул к Вам на страничку.');
});