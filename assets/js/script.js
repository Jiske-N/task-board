// I structured everything to only use the global variables and functions provided in the starter code.
// Things are not necessarily the structure I would otherwise have used as a result.
// I also left the starter code comments in but denoted them with a ---SC at the beginning and end.

// ---SC Retrieve tasks and nextId from localStorage SC---
let taskList = JSON.parse(localStorage.getItem("tasks"));
// I don't know the intended use for the line below, I didn't reference it at all so can be safely deleted.
let nextId = JSON.parse(localStorage.getItem("nextId"));

// ---SC Todo: create a function to generate a unique task id SC---
function generateTaskId() {
    // decided that in this instance date.now on it's own would suffice as unique as multiple instances can't trigger simultaneously
    let uniqueId = Date.now();
    return uniqueId;
};

// ---SC Todo: create a function to create a task card SC---
function createTaskCard(task) {

    // bootstrap classes for card styling and attributes for manipulation
    const taskCard = $('<div>').addClass('card project-card draggable my-3').attr('data-task-id', task.id);
    const cardHeader = $('<div>').addClass('card-header h4').text(task.title);
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(task.description);
    const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
    const cardDeleteBtn = $('<button>').addClass('btn btn-danger delete').text('Delete').attr('data-task-id', task.id);
    cardDeleteBtn.on('click', handleDeleteTask);

    // assign colour scheme to task cards
    if (task.dueDate && task.status !== 'done') {
        const timeNow = dayjs();
        const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

        if (timeNow.isSame(taskDueDate, 'day')) {
            taskCard.addClass('bg-warning text-white');
        } else if (timeNow.isAfter(taskDueDate)) {
            taskCard.addClass('bg-danger text-white');
            cardDeleteBtn.addClass('border-light');
        }
    }

    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);

    return taskCard;
};

// ---SC Todo: create a function to render the task list and make cards draggable SC---
function renderTaskList() {

    // throws error
    let tasks = taskList;
    // // removes error but makes tasks overwrite prior to refresh
    // let tasks = JSON.parse(localStorage.getItem("tasks"));

    // probably not needed but just in case for issue above
    // if (!tasks) {
    //     tasks = [];
    // };

    // empty all swim lanes
    const toDoList = $('#todo-cards');
    const inProgressList = $('#in-progress-cards');
    const doneList = $('#done-cards');

    toDoList.empty();
    inProgressList.empty();
    doneList.empty();

    // refill swim lanes with updated statuses
    for (let task of tasks) {
        if (task.status === 'to-do') {
            toDoList.append(createTaskCard(task));
        } else if (task.status === 'in-progress') {
            inProgressList.append(createTaskCard(task));
        } else if (task.status === 'done') {
            doneList.append(createTaskCard(task));
        }
    }

    $('.draggable').draggable({
        opacity: 0.5,
        // so they appear in front of new lanes
        zIndex: 2,
        containment: '.swim-lanes',
        revert: 'invalid'
    });
};

// ---SC Todo: create a function to handle adding a new task SC---
function handleAddTask(event) {
    event.preventDefault();

    const taskTitleInput = $('#taskTitle');
    const taskDueDateInput = $('#taskDueDate');
    const taskDescriptionInput = $('#taskDescription');

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
    // __________________________________________________________________________________________________________________
    let updateTasks = taskList;

    if (!updateTasks) {
        updateTasks = [];
    };

    updateTasks.push(newTask);

    localStorage.setItem('tasks', JSON.stringify(updateTasks));

    taskTitleInput.val('');
    taskDueDateInput.val('');
    taskDescriptionInput.val('');

    // makes the modal window close automatically after entering a task
    // comment in or out depending on desired functionality
    const modalCloseButton = $('.btn-close');
    modalCloseButton.click();

    renderTaskList();
};

// ---SC Todo: create a function to handle deleting a task SC---
// event paramater isn't referenced, lift it in as it was part of the starter code.
function handleDeleteTask(event) {
    const taskId = $(this).attr('data-task-id');
    const tasks = taskList;

    // tasks.forEach((task) => {
    //     if (task.id == taskId) {
    //         tasks.splice(tasks.indexOf(task), 1);
    //     }
    // });

    for (let task of tasks) {
        if (task.id == taskId) {
            tasks.splice(tasks.indexOf(task), 1);
        }

    };

    localStorage.setItem('tasks', JSON.stringify(tasks));

    renderTaskList();
};

// ---SC Todo: create a function to handle dropping a task into a new status lane SC---
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

// ---SC Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker SC---

// potential resolution to the refresh errors
// jQuery.noConflict();
// jQuery(document).ready(function($) {

// note items below are in the order listed by the starter code not the order I would choose
$(document).ready(function () {

    // create blank item to set to local storage, prevents later error
    let tasks = taskList;

    if (!tasks) {
        tasks = [];
    };
  
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // display data from local storage
    renderTaskList();

    // event listeners
    const addTask = $('#addTask');
    addTask.on('submit', handleAddTask);

    const swimLanes = $('.swim-lanes');
    swimLanes.on('click', '.btn-delete-project', handleDeleteTask);

    // droppable lanes for cards
    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });

    // date picker for modal
    $('#taskDueDate').datepicker({
        changeMonth: true,
        changeYear: true,
    });
});