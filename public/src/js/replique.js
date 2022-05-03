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

const editorId = "editorjs";


var initialData = [];
try {
  initialData = JSON.parse(document.getElementById("replique-initial-content").textContent);
} catch (e) {
  console.log("json is corrupted. starting from the []");
}

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
      code: CodeTool,
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

    editor.save().then((outputData) => {
      console.log("Article data: ", outputData);

      var abstractText = $('#abstractText').val();

      var data = { abstractText: abstractText,
          content: JSON.stringify(outputData),
        };

      var request = $.ajax({
        url: "/api/replique/" + $("#" + editorId).attr("replique-id"),
        type: "put",
        data: data
      });

      request
        .done(function(response, textStatus, jqXHR) {
          window.location.href = '../' + $("#" + editorId).attr("replique-id");
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
          $('#updateErrorNotification').removeClass('is-hidden');
        });


    }).catch((error) => {
      console.log("Saving failed: ", error);
    });

  });

}

