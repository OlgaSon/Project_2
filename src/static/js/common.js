"use strict";

const addTaskBtn = document.getElementById('addTaskBtn');
const modal = document.querySelector('.modal');
const inputTask = document.getElementById('inputTask');
const saveBtn = document.getElementById('saveBtn');
const taskList = document.getElementById('taskList');
const cancelBtn = document.getElementById('cancelBtn');
const checkBtn = document.querySelector('checkBtn');
const addBtn = document.getElementById('addBtn');

const zeroTask = [
    { text: "Ipsum dolor sit amet.", check: false }, 
    { text: "Consectetur adipisicing elit.", check: false }, 
    { text: "Modi consectetur, inventore delectus corporis quam rem.", check: true }, 
    { text: "Rem quis repudiandae maxime libero ratione.", check: false }, 
    { text: "A ipsum quo, aspernatur nisi veritatis nam consequuntur necessitatibus!", check: false }, 
    { text: "Ratione impedit quisquam soluta nobis similique.", check: false }, 
    { text: "Optio consequatur voluptate suscipit dolores natus ipsam quasi, reiciendis, adipisci autem.", check: false },
    { text: "Beatae molestias vitae, iure atque itaque recusandae eveniet expedita assumenda rerum.", check: false }
];

let tasks;
!localStorage.taskLoc ? tasks = zeroTask : tasks = JSON.parse(localStorage.getItem('taskLoc'));

const fillList = () => {
    taskList.innerHTML = '';
    if (tasks.length > 0)
        tasks.forEach(element => {
            createTaskItem(element.text, element.check)
        });
};

const updateLocal = () => {
    localStorage.setItem('taskLoc', JSON.stringify(tasks))
};

const displayModal = () => {
    modal.classList.toggle('display-none');
    inputTask.value = '';
};

class Task {
    constructor(text) {
        this.text = text;
        this.check = false;
    };
};

class CheckTask extends Task {
    constructor(text, checkItemIndexMark) {
        super(text);
        this.check = checkItemIndexMark;
    };
};

const createTaskItem = (inputText, checkDef) => {
    let taskItem = document.createElement('li');
    taskItem.classList = 'taskItem';

    let taskItemText = document.createElement('div');
    taskItemText.classList = 'taskItemText';
    taskItemText.innerText = inputText;

    let taskItemBtn = document.createElement('div');
    taskItemBtn.classList = 'taskItemBtn';

    let checkBtn = document.createElement('input');
    checkBtn.type = 'checkbox';
    checkBtn.classList = 'checkBtn';
    if (checkDef) {
        checkBtn.value = true;
        checkBtn.checked = "checked";
        taskItem.classList.add('done');
    } else {
        checkBtn.value = false;
    };

    let editBtn = document.createElement('button');
    editBtn.classList = 'editBtn';
    let editBtnImg = "<img src='img/pencil.svg'></img>";
    editBtn.innerHTML = editBtnImg;

    let deleteBtn = document.createElement('button');
    deleteBtn.classList = 'deleteBtn';
    let deleteBtnImg = "<img src='img/trashcan.svg'></img>";
    deleteBtn.innerHTML = deleteBtnImg;

    taskItem.appendChild(taskItemText);
    taskItemBtn.appendChild(checkBtn);
    taskItemBtn.appendChild(editBtn);
    taskItemBtn.appendChild(deleteBtn);
    taskItem.appendChild(taskItemBtn);
    taskList.appendChild(taskItem);
    updateLocal();

    const modifyTaskElem = () => {

        checkBtn.addEventListener('click', (e) => {

            taskItem.classList.toggle('done');
            let checkItem = e.target.parentNode.parentNode.childNodes[0].innerText;
            let checkItemIndex = tasks.findIndex(item => item.text == checkItem);
            let checkItemIndexMark = tasks[checkItemIndex].check;
            checkItemIndexMark ? checkItemIndexMark = false : checkItemIndexMark = true;
            tasks.splice(checkItemIndex, 1, new CheckTask(checkItem, checkItemIndexMark));
            updateLocal();
        });

        editBtn.addEventListener('click', (e) => {

            let checkItem = e.target.parentNode.parentNode.parentNode.childNodes[0].innerText;
            let checkItemIndex = tasks.findIndex(item => item.text == checkItem);
            displayModal();
            inputTask.value = taskItemText.textContent;
            addBtn.classList.toggle('display-none');
            saveBtn.classList.toggle('display-none');

            saveBtn.addEventListener('click', (e) => {

                let saveItemIndex = checkItemIndex;
                e.preventDefault();

                let checkItemIndexMark = tasks[checkItemIndex].check;

                let inputTextNew = e.target.parentNode.elements["inputTask"].value;
                if (inputTextNew === '') return;
                taskItemText.innerText = inputTextNew;

                tasks[saveItemIndex] = new CheckTask(inputTextNew, checkItemIndexMark);
                addBtn.classList.remove('display-none');
                saveBtn.classList.add('display-none');
                displayModal();
                updateLocal();
                checkItem = e.target.parentNode.parentNode.childNodes[0].innerText;
            });
        });

        deleteBtn.addEventListener('click', (e) => {
            let deleteItemD = e.target.parentNode.parentNode.parentNode.childNodes[0]
            let deleteItem = deleteItemD.innerText;
            let deleteItemIndex = tasks.findIndex(item => item.text == deleteItem);

            setInterval(() => {
                if (deleteItem) {
                    deleteItemD.style.opacity = 1 - (deleteItemD.style.opacity || 1);
                    deleteItemD.style.transition = "0.6s opacity"
                }
            }, 300);

            setTimeout(() => {
                tasks.splice(deleteItemIndex, 1);
                taskList.removeChild(taskItem);
                updateLocal();
            }, 2100);
        });
    };
    modifyTaskElem();
};

fillList();

const addTask = (e) => {
    e.preventDefault();
    let inputText = inputTask.value;
    if (inputText === '') return
    createTaskItem(inputText);
    tasks.push(new Task(inputText));
    updateLocal();
    displayModal();
};

const onCancelBtn = (e) => {
    addBtn.classList.remove('display-none');
    saveBtn.classList.add('display-none');
    e.preventDefault();
    displayModal();
};

addTaskBtn.addEventListener('click', displayModal);
addBtn.addEventListener('click', addTask);
cancelBtn.addEventListener('click', onCancelBtn);

/*async function getTask() {
    await fetch(url)
        .then(response => response.json())
        .then((body) => {
            let tasks = Object.entries(body).map(element => {
                return new CheckTask((element[1].taskItemText), JSON.parse(element[1].checkItemIndexMark));
            });
            taskList.innerHTML = '';
            tasks.forEach((task) => createTaskItem(task.text, task.check));
        })
        .catch(e => console.log(e))
};
getTask(); */

/* function postTask() {
    tasks.forEach(task => {
        let text = task.text;
        let check = task.check;
        fetch('http://localhost:5001/FE', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    "taskItemText": text,
                    "checkItemIndexMark": check
                })
            })
            .catch(e => console.log(e))
    });
};
postTask(); */