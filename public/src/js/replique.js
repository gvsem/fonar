import EditorJS from "@editorjs/editorjs";
import $ from "jquery";

import Header from "@editorjs/header";
import List from "@editorjs/list";
import CodeTool from "@editorjs/code";
import LinkTool from "@editorjs/link";
import Table from "@editorjs/table";
import Paragraph from "@editorjs/paragraph";
import Quote from "@editorjs/quote";

import edjsHTML from "editorjs-html";
import toastr from "toastr";

const editorId = "editorjs";


var initialData = [];
try {
  initialData = JSON.parse(document.getElementById("replique-initial-content").textContent);
} catch (e) {
  console.log("json is corrupted. starting from the []");
}


$("#replique-publish").click(async function(e) {

  var rid = $(this).attr("rid");

  var request = $.ajax({
    url: "/api/replique/" + rid + "/publish",
    type: "put"
  });

  request
    .done(function(response, textStatus, jqXHR) {
      window.location.href = "./" + rid;
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      $("#updateErrorNotification").text("Публикация не удалась.");
      $("#updateErrorNotification").removeClass("is-hidden");
    });

});

$("#replique-delete").click(async function(e) {

  var rid = $(this).attr("rid");
  var request = $.ajax({
    url: "/api/replique/" + rid,
    type: "delete"
  });

  request
    .done(function(response, textStatus, jqXHR) {
      window.location.href = "./";
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      $("#updateErrorNotification").text("Удаление реплики не удалось. Значит — это кому-нибудь нужно?");
      $("#updateErrorNotification").removeClass("is-hidden");
    });

});


$("#reponse-submit").click(async function(e) {

  var rid = parseInt($("#reponse-field").attr("rid"));
  // var text = $('#reponse-field').val();

  var data = {
    repliqueId: rid,
    text: $("#reponse-field").val()
  };

  var request = $.ajax({
    url: "/api/reponse",
    type: "post",
    data : JSON.stringify(data),
    contentType : 'application/json',
  });

  request
    .done(function(response, textStatus, jqXHR) {
      $("#reponse-field").val('')

      $("#reponses").prepend("<article class=\"media\">\n" +
        "                  <figure class=\"media-left\">\n" +
        "                  </figure>\n" +
        "                  <div class=\"media-content\">\n" +
        "                    <div class=\"content\">\n" +
        "                      <p>\n" +
        "                        <strong>" + response.creator.authorAlias + "</strong> <a\n" +
        "                        href=\"/u/" + response.creator.pageURL + "\"><small>" + response.creator.pageURL + "</small></a> <small>\n" +
        "                          <time unixstamp=\"" + response.publicationDateTimestamp + "\">" + new Date(parseInt(response.publicationDateTimestamp)).toLocaleDateString("ru-RU") + "</time>\n" +
        "\n" +
        "                      </small>\n" +
        "                        <br>\n" +
        response.text +
        "                      </p>\n" +
        "                    </div>\n" +
        "\n" +
        "                  </div>\n" +
        "                  <div class=\"media-right\">\n" +
        "\n" +
        "                  </div>\n" +
        "                </article>");
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      toastr.error("Не удалось опубликовать отклик.");
      console.log(errorThrown);
    });

});

if ($("#" + editorId).length > 0) {


  const editor = new EditorJS({
    /**
     * Tools list
     */
    holder: editorId,
    data: initialData,
    tools: {
      header: Header,
      paragraph: Paragraph,
      list: List,
      quote: Quote,
      code: CodeTool
      // linkTool: LinkTool,
      // table: Table
    },

    /**
     * Internationalzation config
     */
    i18n: {
      /**
       * @type {I18nDictionary}
       */
      messages: {
        /**
         * Other below: translation of different UI components of the editor.js core
         */
        ui: {
          "blockTunes": {
            "toggler": {
              "Click to tune": "Нажмите, чтобы настроить",
              "or drag to move": "или перетащите"
            }
          },
          "inlineToolbar": {
            "converter": {
              "Convert to": "Конвертировать в"
            }
          },
          "toolbar": {
            "toolbox": {
              "Add": "Добавить"
            }
          }
        },

        /**
         * Section for translation Tool Names: both block and inline tools
         */
        toolNames: {
          "Text": "Параграф",
          "Heading": "Заголовок",
          "List": "Список",
          "Warning": "Примечание",
          "Checklist": "Чеклист",
          "Quote": "Цитата",
          "Code": "Код",
          "Delimiter": "Разделитель",
          "Raw HTML": "HTML-фрагмент",
          "Table": "Таблица",
          "Link": "Ссылка",
          "Marker": "Маркер",
          "Bold": "Полужирный",
          "Italic": "Курсив",
          "InlineCode": "Моноширинный"
        },

        /**
         * Section for passing translations to the external tools classes
         */
        tools: {
          /**
           * Each subsection is the i18n dictionary that will be passed to the corresponded plugin
           * The name of a plugin should be equal the name you specify in the 'tool' section for that plugin
           */
          "warning": { // <-- 'Warning' tool will accept this dictionary section
            "Title": "Название",
            "Message": "Сообщение"
          },

          /**
           * Link is the internal Inline Tool
           */
          "link": {
            "Add a link": "Вставьте ссылку"
          },
          /**
           * The "stub" is an internal block tool, used to fit blocks that does not have the corresponded plugin
           */
          "stub": {
            "The block can not be displayed correctly.": "Блок не может быть отображен"
          }
        },

        /**
         * Section allows to translate Block Tunes
         */
        blockTunes: {
          /**
           * Each subsection is the i18n dictionary that will be passed to the corresponded Block Tune plugin
           * The name of a plugin should be equal the name you specify in the 'tunes' section for that plugin
           *
           * Also, there are few internal block tunes: "delete", "moveUp" and "moveDown"
           */
          "delete": {
            "Delete": "Удалить"
          },
          "moveUp": {
            "Move up": "Переместить вверх"
          },
          "moveDown": {
            "Move down": "Переместить вниз"
          }
        }
      }
    }
  });


  $("#replique-save").click(async function(e) {

    var rid = $("#" + editorId).attr("replique-id");

    editor.save().then((outputData) => {
      console.log("Article data: ", outputData);

      var title = $("#replique-title").val();
      var abstractText = $("#abstractText").val();

      var data = {
        title: title,
        abstractText: abstractText,
        content: JSON.stringify(outputData)
      };

      var request = $.ajax({
        url: "/api/replique/" + $("#" + editorId).attr("replique-id"),
        type: "put",
        data: data
      });

      request
        .done(function(response, textStatus, jqXHR) {
          window.location.href = "../" + $("#" + editorId).attr("replique-id");
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
          $("#updateErrorNotification").removeClass("is-hidden");
        });


    }).catch((error) => {
      console.log("Saving failed: ", error);
    });

  });




  // var origins = [];
  // for (var x in $('.origin-entry')) {
  //   origins.push(x.attr('oid'));
  // }

  $("#origin-delete").click(async function(e) {

    var oid = $(this).attr("oid");

    // if (!(oid in origins)) {
    //   return;
    // }
    // origins.pop(oid);

    var request = $.ajax({
      url: "/api/replique/" + $("#" + editorId).attr("replique-id") + "/originates/" + oid,
      type: "delete"
    });

    request
      .done(function(response, textStatus, jqXHR) {
        $("#origin-" + oid).remove();
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        $("#updateErrorNotification").text("Удаление посвящений к реплике не удалось. Значит — кто-то хочет, чтобы они были?");
        $("#updateErrorNotification").removeClass("is-hidden");
      });

  });


  var inputTimeoutFlag = false;

  $("#origin-search").on("input", async function(e) {

    if (inputTimeoutFlag) {
      return;
    }

    inputTimeoutFlag = true;
    await new Promise(resolve => setTimeout(resolve, 1000));
    inputTimeoutFlag = false;

    var v = $(this).val();

    if (v !== "") {
      var request = $.ajax({
        url: "/api/replique/" + $("#" + editorId).attr("replique-id") + "/origins/search/" + v,
        type: "get"
      });

      request
        .done(function(response, textStatus, jqXHR) {
          $("#origin-search-contents").html("");
          for (const r of response.data) {
            $("#origin-search-contents").append(" <span class=\"panel-block origin-entry " + (r.isOrigin ? "is-active" : "") + "\" oid=\"" + r.id + "\">\n" +
              "                  <span class=\"panel-icon\"><i class=\"fas fa-book\" aria-hidden=\"true\"></i></span>" + r.title + "&nbsp;<small>" + r.creator.authorAlias + "</small>&nbsp;" + ""
              // "                 <a href=\"/u/" + r.creator.pageURL + "/" + r.id + "\"><i class=\"fas fa-link\" style=\"font-size: 9pt;\" aria-hidden=\"true\"></i></a>  </span>"
            );
          }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
          $("#updateErrorNotification").text("Добавление/удаление реплики-источника не удалось.");
          $("#updateErrorNotification").removeClass("is-hidden");
        });

    } else {
      var request = $.ajax({
        url: "/api/replique/" + $("#" + editorId).attr("replique-id") + "/origins",
        type: "get"
      });

      request
        .done(function(response, textStatus, jqXHR) {
          $("#origin-search-contents").html("");
          for (const r of response) {
            $("#origin-search-contents").append(" <span class=\"panel-block origin-entry " + ("is-active") + "\" oid=\"" + r.id + "\">\n" +
              "                  <span class=\"panel-icon\"><i class=\"fas fa-book\" aria-hidden=\"true\"></i></span>" + r.title + "&nbsp;<small>" + r.creator.authorAlias + "</small>&nbsp;" + ""
              // "                 <a href=\"/u/" + r.creator.pageURL + "/" + r.id + "\"><i class=\"fas fa-link\" style=\"font-size: 9pt;\" aria-hidden=\"true\"></i></a>  </span>"
            );
          }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
          $("#updateErrorNotification").text("Добавление/удаление реплики-источника не удалось.");
          $("#updateErrorNotification").removeClass("is-hidden");
        });
    }

  });

  $("#origin-search").trigger("input");


  $("#origin-search-contents").on("click", ".origin-entry", async function(e) {

    var oid = $(this).attr("oid");
    var elem = $(this);

    // if (oid in origins) {
    //   return;
    // }
    // origins.push(oid);

    var request = $.ajax({
      url: "/api/replique/" + $("#" + editorId).attr("replique-id") + "/originates/" + oid,
      type: !(elem.hasClass("is-active")) ? "post" : "delete"
    });

    request
      .done(function(response, textStatus, jqXHR) {
        if (elem.hasClass("is-active")) {
          elem.removeClass("is-active");
        } else {
          elem.addClass("is-active");
        }
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        $("#updateErrorNotification").text("Добавление/удаление реплики-источника не удалось.");
        $("#updateErrorNotification").removeClass("is-hidden");
      });

  });


}

