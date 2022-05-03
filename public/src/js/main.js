import Bulma from '@vizuaalog/bulmajs';
import $ from 'jquery';

$('#create-replique').on('keyup', function (e) {
  if (e.keyCode == 13) {
    var element = $(this);
    var n = $(this).attr('name');
    var v = $(this).val();

    if (RegExp.prototype.test.bind(/^[A-Za-z0-9]{1,150}$/).call(v)) {
      var request = $.ajax({
        url: '/api/replique',
        type: 'post',
        data: { [n]: v },
      });

      element.removeClass('is-success-animated');
      element.removeClass('is-danger-animated');

      request
        .done(function (response, textStatus, jqXHR) {
          console.log('done');
          element.addClass('is-success-animated');
          window.location.href = (
            '/u/' +
              response.creator.pageURL +
              '/' +
              response.id + '/edit'
          );
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          console.error(
            'The following error occurred: ' + textStatus,
            errorThrown,
          );
          element.addClass('is-danger-animated');
        });
    } else {
      element.addClass('is-danger-animated');
    }
  }
});

import edjsHTML from 'editorjs-html';

const edjsParser = edjsHTML();

$('.replique-content').each(function (index, e) {
  try {
    let html = edjsParser.parse(JSON.parse(e.innerText));
    $(e).html(html);
    $(e).removeClass('is-hidden');
  } catch (e) {
    console.log(e);
  }
});
