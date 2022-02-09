const input = document.querySelector('#app-todo-input');
const inputBtn = document.querySelector('#app-todo-input-button');
const list = document.querySelector('#app-todo-list');

function getAppStorage() {
    var appStorage = localStorage.getItem('app-todo');
    if (appStorage == null) {
        localStorage.setItem('app-todo', JSON.stringify({}));
    }
    appStorage = JSON.parse(localStorage.getItem('app-todo'));
    return appStorage;
}

function addToAppStorage(id, data) {
    var s = getAppStorage();
    s[id] = data;
    localStorage.setItem('app-todo', JSON.stringify(s));
}

function removeFromAppStorage(id) {
    var s = getAppStorage();
    delete s[id];
    localStorage.setItem('app-todo', JSON.stringify(s));
}


function newListItem(id, content) {
    var v = document.createElement('div');
    v.classList.add('list__item');
    v.setAttribute('todo-id', id);
    var c = document.createElement('span');
    c.innerText = content;
    v.appendChild(c);
    v.innerHTML +=  "<a class=\"button button-small bRed app-todo-delete\">\n" +
        "   <div class=\"fa fa-times\"></div>\n" +
        "</a>";
    //v.querySelector('.app-todo-delete').setAttribute('todo-id', id);
    v.querySelector('.app-todo-delete').onclick = function(event) {
        var h = document.querySelector('[todo-id="' + id + '"]');
        h.parentElement.removeChild(h);
        removeFromAppStorage(id);
    };

    return v;
}

function addNewItem(event) {
    if (input.value != "") {
        list.appendChild(newListItem(+ new Date(), input.value))
        addToAppStorage(+ new Date(), input.value);
        input.value = "";
    }
}


document.querySelector("#app-todo").addEventListener('submit', event => {
    event.preventDefault();
    addNewItem(event);
    return false;
});

inputBtn.onclick = addNewItem;

input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        document.getElementById("app-todo").submit();
    }
});

var appStorage = getAppStorage();
for (var i in appStorage) {
    list.appendChild(newListItem(i, appStorage[i]))
}