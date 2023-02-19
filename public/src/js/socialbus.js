import io from 'socket.io-client';
import toastr from 'toastr';

// toastr.options = {
//   debug: false,
//   positionClass: 'toast-bottom-right',
//   onclick: null,
//   fadeIn: 300,
//   fadeOut: 1000,
//   timeOut: 10000,
//   extendedTimeOut: 1000,
// };

var socket = io().connect(
  'http://' + location.host,
  {
    transports: ['websocket'],
  },
);

socket.on('notifyAboutNewReplique', function (r) {
  console.log(r);

  toastr.options = {
    debug: false,
    positionClass: 'toast-bottom-right',
    onClick: function (e) {
      document.href = '/u/' + r.creator.pageURL + '/' + r.id;
    },
    // onHidden: function (e) {
    //   document.href = '/u/' + r.creator.pageURL + '/' + r.id;
    // },
    fadeIn: 300,
    fadeOut: 1000,
    timeOut: 10000,
    extendedTimeOut: 1000,
    tapToDismiss: false,
  };

  toastr.info('Новая реплика от ' + r.creator.authorAlias, r.title);
});
