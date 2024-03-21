const addTask = $('#addTask');
const taskTitleInput = $('#taskTitle');
const taskDueDateInput = $('#taskDueDate');
const taskDescriptionInput = $('#taskDescription');
const swimLanes = $('.swim-lanes');
// const modalAddTaskSubmit = $('#submit');
const modalCloseButton = $('.btn-close');
const clickEvent = new Event('click');
// modalCloseButton.dispatchEvent(clickEvent);

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    let uniqueId = Date.now();
    return uniqueId;
};

// Todo: create a function to create a task card
function createTaskCard(task) {

    const taskCard = $('<div>')
        .addClass('card project-card draggable my-3')
        .attr('data-task-id', task.id);
    const cardHeader = $('<div>').addClass('card-header h4').text('task.title');
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(task.description);
    const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
    const cardDeleteBtn = $('<button>')
        .addClass('btn btn-danger delete')
        .text('Delete')
        .attr('data-task-id', task.id);
    cardDeleteBtn.on('click', handleDeleteTask);


    if (task.dueDate && task.status !== 'done') {
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');


        if (now.isSame(taskDueDate, 'day')) {
            taskCard.addClass('bg-warning text-white');
        } else if (now.isAfter(taskDueDate)) {
            taskCard.addClass('bg-danger text-white');
            cardDeleteBtn.addClass('border-light');
        }
    }

    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);

    return taskCard;
};

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

    let tasks = taskList;

    // if (!tasks) {
    //     tasks = [];
    // };

    const todoList = $('#todo-cards');
    todoList.empty();

    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();

    const doneList = $('#done-cards');
    doneList.empty();

    for (let task of tasks) {
        if (task.status === 'to-do') {
            todoList.append(createTaskCard(task));
        } else if (task.status === 'in-progress') {
            inProgressList.append(createTaskCard(task));
        } else if (task.status === 'done') {
            doneList.append(createTaskCard(task));
        }
    }

    $('.draggable').draggable({
        opacity: 0.5,
        zIndex: 2,
        containment: '.swim-lanes',
        revert: 'invalid'
    });
};

// Todo: create a function to handle adding a new task ***adding to local storage***
function handleAddTask(event) {
    event.preventDefault();

    const taskTitle = taskTitleInput.val().trim();
    const taskDueDate = taskDueDateInput.val();
    const taskDescription = taskDescriptionInput.val().trim();
    const taskId = generateTaskId();

    const newTask = {
        title: taskTitle,
        dueDate: taskDueDate,
        description: taskDescription,
        id: taskId,
        status: 'to-do',
    };

    let updateTasks = taskList;

    if (!updateTasks) {
        updateTasks = [];
    };

    updateTasks.push(newTask);

    localStorage.setItem('tasks', JSON.stringify(updateTasks));

    taskTitleInput.val('');
    taskDueDateInput.val('');
    taskDescriptionInput.val('');

    // const modalCloseButton = $('.btn-close');
    // const clickEvent = new Event('click');
    // const btnClose = document.querySelector('.btn-close');
    // const clickEvent = new Event('click');
    // modalCloseButton.dispatchEvent(clickEvent);

    renderTaskList();
};

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    const taskId = $(this).attr('data-task-id');
    const tasks = taskList;

    tasks.forEach((task) => {
        if (task.id == taskId) {
            tasks.splice(tasks.indexOf(task), 1);
        }
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = $(ui.draggable).attr('data-task-id');
    // const taskId = (ui.draggable.attr('data-task-id'));

    const tasks = taskList;

    const newStatus = event.target.id;

    // tasks.forEach((task) => {
    //     if (task.id == taskId) {
    //         task.status = newStatus;
    //     }
    // });

    for (let task of tasks) {
        if (task.id == taskId) {
            task.status = newStatus;
        }

    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
// jQuery.noConflict();
// jQuery(document).ready(function($) {
$(document).ready(function () {

    let tasks = taskList;

    if (!tasks) {
        tasks = [];
    };
    // if (taskList === !tasks) {
    //    const task3 = [];
    //    const tasks2 = [];
    // console.log(taskList == task3);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    // };
    // Todo: render task list
    renderTaskList();



    // Todo: add event listeners
    addTask.on('submit', handleAddTask); // half works!!!!!
    // addTask.on('submit', function() {
    //     handleAddTask();
    // }); // other half works
    // addTask.on('submit', 'btn-close', handleAddTask);
    // modalAddTaskSubmit.on('click', console.log('click'));
    // modalAddTaskSubmit.on('submit', console.log('submit')); 

    // delete
    swimLanes.on('click', '.btn-delete-project', handleDeleteTask);


    // Todo: make lanes droppable
    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });

    // Todo: add datepicker to form input
    $('#taskDueDate').datepicker({
        changeMonth: true,
        changeYear: true,
    });
});

// $(function () {
// $("#btnClosePopup").click(function () {
// $("#MyPopup").modal("hide");
// });
// });