var audio = new Audio('notification.wav');
let workTittle = document.getElementById('work');
let breakTittle = document.getElementById('break');

const workTime = 25;
const breakTime = 5;

let seconds = "00"
let minutes = workTime.toString().padStart(2, "0");

let intervalId;
let started = false;

window.onload = () => {
    document.getElementById('minutes').innerHTML = minutes;
    document.getElementById('seconds').innerHTML = seconds;

    workTittle.classList.add('active');
}

function start() {
    if (started) {
        return;
    }

    document.getElementById('start').style.display = "none";
    document.getElementById('reset').style.display = "block";

    seconds = 59;
    minutes = (workTime - 1).toString().padStart(2, "0");

    breakCount = 0;

    let timerFunction = () => {

        document.getElementById('minutes').innerHTML = minutes;
        document.getElementById('seconds').innerHTML = seconds.toString().padStart(2, "0");

        seconds = seconds - 1;

        if (seconds === -1) {
            minutes = (parseInt(minutes) - 1).toString().padStart(2, "0");
            seconds = 59;

            if (minutes === "-1") {
                if (breakCount % 2 === 0) {
                    minutes = (workTime - 1).toString().padStart(2, "0");
                    breakCount++
                    audio.play();
                    workTittle.classList.remove('active');
                    breakTittle.classList.add('active');
                } else {
                    minutes = (breakTime - 1).toString().padStart(2, "0");
                    breakCount++
                    audio.play();
                    breakTittle.classList.remove('active');
                    workTittle.classList.add('active');
                }
            }
        }
    }

    intervalId = setInterval(timerFunction, 1000);
    started = true;
}

function reset() {
    clearInterval(intervalId);
    started = false;
    document.getElementById('start').style.display = "block";
    document.getElementById('reset').style.display = "none";
    seconds = "00";
    minutes = workTime.toString().padStart(2, "0");
    document.getElementById('minutes').innerHTML = minutes;
    document.getElementById('seconds').innerHTML = seconds;
    breakTittle.classList.remove('active');
    workTittle.classList.add('active');
}


const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

document.addEventListener("DOMContentLoaded", getLocalTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("change", filterTodo);

function addTodo(event) {
    event.preventDefault();
    const todoText = todoInput.value.trim();
    if (todoText === "") {
        alert("You cannot add an empty to-do or one with only blank spaces");
        return;
    }
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    const newTodo = document.createElement("li");
    newTodo.innerText = todoText;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    saveLocalTodos(todoText);

    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check-circle"></li>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></li>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    todoList.appendChild(todoDiv);
    todoInput.value = "";
}


function deleteCheck(e) {
    const item = e.target;

    if (item.classList[0] === "trash-btn") {
        const todo = item.parentElement;
        todo.classList.add("slide");

        removeLocalTodos(todo);
        todo.addEventListener("transitionend", function () {
            todo.remove();
        });
    }

    if (item.classList[0] === "complete-btn") {
        const todo = item.parentElement;
        todo.classList.toggle("completed");
    }
}


function filterTodo(e) {
    const todos = todoList.childNodes;
    todos.forEach(function (todo) {
        switch (e.target.value) {
            case "all":
                todo.style.display = "flex";
                break;
            case "completed":
                if (todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "incomplete":
                if (!todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
        }
    });
}

function saveLocalTodos(todo) {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getLocalTodos() {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.forEach(function (todo) {
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");
        const newTodo = document.createElement("li");
        newTodo.innerText = todo;
        newTodo.classList.add("todo-item");
        todoDiv.appendChild(newTodo);

        const completedButton = document.createElement("button");
        completedButton.innerHTML = '<i class="fas fa-check-circle"></li>';
        completedButton.classList.add("complete-btn");
        todoDiv.appendChild(completedButton);

        const trashButton = document.createElement("button");
        trashButton.innerHTML = '<i class="fas fa-trash"></li>';
        trashButton.classList.add("trash-btn");
        todoDiv.appendChild(trashButton);

        todoList.appendChild(todoDiv);
    });
}

function removeLocalTodos(todo) {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    const todoIndex = todo.children[0].innerText;
    todos.splice(todos.indexOf(todoIndex), 1);
    localStorage.setItem("todos", JSON.stringify(todos));
}


function clearList() {
    localStorage.removeItem('todos');
    while (todoList.firstChild) {
        todoList.removeChild(todoList.firstChild);
    }
    updateList();
}


function clearNotepad() {
    localStorage.removeItem('notepad');
    document.getElementById('editor').innerHTML = '';
}


(function () {
    var editorKey = 'notepad';
    var editor = document.getElementById('editor');
    var cache = localStorage.getItem(editorKey);

    if (cache) {
        editor.innerHTML = cache;
    }

    function autosave() {
        var newValue = editor.innerHTML;
        if (cache != newValue) {
            cache = newValue;
            localStorage.setItem(editorKey, cache);
        }
    }

    editor.addEventListener('input', autosave);

})();



function cleanPaste(e) {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
}
const editor = document.getElementById('editor');
editor.addEventListener('paste', cleanPaste);


let totalSeconds = 0;
let weekSeconds = 0;
let lastVisit = new Date(localStorage.getItem("lastVisit"));
let oneWeekAgo = Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7) + 1;

let savedTotalTime = JSON.parse(localStorage.getItem('totalTime'));
let savedWeekTime = JSON.parse(localStorage.getItem('weekTime'));

if (savedTotalTime) {
    totalSeconds = savedTotalTime;
}

if (savedWeekTime) {
    weekSeconds = savedWeekTime;
}

setInterval(function () {
    totalSeconds++;
    if (lastVisit.getTime() > oneWeekAgo) {
        weekSeconds++;
    }

    localStorage.setItem('totalTime', JSON.stringify(totalSeconds));
    localStorage.setItem('weekTime', JSON.stringify(weekSeconds));

    updateTime();
}, 1000);

function updateTime() {
    let totalP = document.getElementById("totalTime");
    let weekP = document.getElementById("weekTime");

    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;
}

updateTime();
localStorage.setItem("lastVisit", new Date());
