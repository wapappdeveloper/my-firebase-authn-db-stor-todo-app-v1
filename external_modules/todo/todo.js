//alert('hai');
var nextCountForListSeries = 0;
var todoListArray = [];
var duplicateOfSelectedToDoItem = null;
var currentTodoItem = null;
var todoListItemCoordinates = {};
var currentOverTakedElmId = null;
var currentOverTakedElm = null;
/**
 * Represents the update of local storage
 * @param {*} idemId 
 * @param {*} data 
 */
function updateLocalStorage(idemId, data) {
    window.localStorage.setItem(idemId, JSON.stringify(data));
}
/**
 * Represents the indetification of object index in array
 * @param {*} todoListArray 
 * @param {*} id 
 */
function getObjectIndexById(todoListArray, id) {
    for (var i = 0; i < todoListArray.length; i++) {
        if (todoListArray[i].id === Number(id)) {
            return i;
        }
    }
}
/**
 * Represents the update of all todolist item position to todoArray
 */
function updatePositionsInTodoArray() {
    var elements, elemenetCoordinates;
    elements = document.querySelectorAll('.todo-list-holder');
    /*elements.forEach(function (elm, index) {
        elemenetCoordinates = elm.getBoundingClientRect();
        todoListArray[index].x = Math.round(elemenetCoordinates.left);
        todoListArray[index].y = Math.round(elemenetCoordinates.top);
    });*/
    for(var i=0;i<elements.length;i++){
        var elm = elements[i];
        var index = i;
        elemenetCoordinates = elm.getBoundingClientRect();
        todoListArray[index].x = Math.round(elemenetCoordinates.left);
        todoListArray[index].y = Math.round(elemenetCoordinates.top);
    }
}
/**
 * Represents feed the title and content into template
 * @param {*} title 
 * @param {*} content 
 */
function feedInnerHTMLInTemplate(title, content) {
    var todoListTemplate = '<div class="btn-holder no-selection" >\n\
                        <div class="btn-align-right" >\n\
                            <div class="btn move-btn no-selection"></div>\n\
                            <div class="btn delete-btn no-selection"></div>\n\
                            <div class="btn edit-btn no-selection"></div>\n\
                            <div class="clear"></div>\n\
                        </div>\n\
                        </div>\n\
                        <div class="title-label" >Title:</div>\n\
                        <div class="todo-input-title">'+ title + '</div>\n\
                        <div class="todo-input-content listed">'+ content + '</div>\n\
                        <div class="clear"></div>';
    return todoListTemplate;
}
/**
 * Represents mousemove action
 * @param {*} event 
 */
function mousemove(event) {
    //console.log('mousemove');
    var newMouseX, newMouseY, elementAll;
    //console.log(event.pageX, event.pageY, todoListItemCoordinates.mouseX, todoListItemCoordinates.mouseY);
    newMouseX = Math.round(event.pageX - todoListItemCoordinates.mouseX);
    newMouseY = Math.round(event.pageY - todoListItemCoordinates.mouseY);
    duplicateOfSelectedToDoItem.style.display = 'block';
    duplicateOfSelectedToDoItem.style.left = newMouseX + 'px';
    duplicateOfSelectedToDoItem.style.top = newMouseY + 'px';
    //console.log(newMouseX, newMouseY);
    elements = document.querySelectorAll('.todo-list-holder');
    //console.log(elements, elements.length);
    /*elements.forEach(function (elm, index) {
        var index;
        if (Number(elm.id) !== -1) {
            index = getObjectIndexById(todoListArray, elm.id);
            if (newMouseY === todoListArray[index].y || (newMouseY < todoListArray[index].y + 35 && newMouseY > todoListArray[index].y - 30)) {
                if (currentOverTakedElmId !== elm.id) {
                    currentOverTakedElmId = elm.id;
                    currentOverTakedElm = elm;
                    elementReposition(currentOverTakedElm, currentTodoItem);
                }
            }
        }
    });*/
    for(var i=0;i<elements.length;i++){
        var index = i;
        var elm = elements[i];
        if (Number(elm.id) !== -1) {
            index = getObjectIndexById(todoListArray, elm.id);
            if (newMouseY === todoListArray[index].y || (newMouseY < todoListArray[index].y + 35 && newMouseY > todoListArray[index].y - 30)) {
                if (currentOverTakedElmId !== elm.id) {
                    currentOverTakedElmId = elm.id;
                    currentOverTakedElm = elm;
                    elementReposition(currentOverTakedElm, currentTodoItem);
                }
            }
        }
    }
}
/**
 * Represents mousedown action
 * @param {*} event 
 */
function mousedown(event) {
    var id, elementClientRect, index, feedValue, body, element;
    //console.log(event.target.classList);
    if (event.target.classList.contains('move-btn')) {
        //console.log('A');
        id = event.currentTarget.id;
        currentTodoItem = document.getElementById(String(id));
        elementClientRect = currentTodoItem.getBoundingClientRect();
        //console.log(elementClientRect);
        todoListItemCoordinates.mouseX = Math.round(event.pageX - elementClientRect.left);
        todoListItemCoordinates.mouseY = Math.round(event.pageY - elementClientRect.top);
        todoListItemCoordinates.id = id;
        index = getObjectIndexById(todoListArray, id);
        feedValue = todoListArray[index];
        body = document.getElementsByTagName('body')[0];
        duplicateOfSelectedToDoItem = addTodoListItem(feedValue.title, feedValue.content, -1);
        duplicateOfSelectedToDoItem.setAttribute('style', 'position:absolute;top:' + todoListItemCoordinates.mouseY + 'px;left:' + todoListItemCoordinates.mouseX + 'px;max-width:370px;background-color:lightgrey;opacity:0.6;display:none');
        body.appendChild(duplicateOfSelectedToDoItem);
        currentTodoItem.style.backgroundColor = '#FF0';
        document.addEventListener('mousemove', mousemove);
    } else if (event.target.classList.contains('delete-btn')) {
        //console.log('B');
        id = event.currentTarget.id;
        remove(id);
        updatePositionsInTodoArray();
    } else if (event.target.classList.contains('edit-btn') || event.target.classList.contains('add-btn')) {
        //console.log('C');
        id = event.currentTarget.id;
        element = event.target;
        edit(element, id);
    }
}
/**
 * Represets the reposition of elements
 * @param {*} dropPlaceElement 
 * @param {*} dragElement 
 */
function elementReposition(dropPlaceElement, dragElement) {
    var dropIndex, dragIndex, x, y, id, tempObj, tempId;
    dropIndex = Number(getObjectIndexById(todoListArray, dropPlaceElement.id));
    dragIndex = Number(getObjectIndexById(todoListArray, dragElement.id));
    if (dragIndex > dropIndex) {
        dropPlaceElement.parentNode.insertBefore(dragElement, (dropPlaceElement.previousSibling).nextSibling);
    } else if (dragIndex < dropIndex) {
        dropPlaceElement.parentNode.insertBefore(dragElement, dropPlaceElement.nextSibling);
    }
    x = todoListArray[dropIndex].x;
    y = todoListArray[dropIndex].y;
    id = todoListArray[dropIndex].id;
    todoListArray[dropIndex].x = todoListArray[dragIndex].x;
    todoListArray[dropIndex].y = todoListArray[dragIndex].y;
    todoListArray[dropIndex].id = todoListArray[dragIndex].id;
    todoListArray[dragIndex].x = x;
    todoListArray[dragIndex].y = y;
    todoListArray[dragIndex].id = id;
    tempObj = todoListArray[dropIndex];
    todoListArray[dropIndex] = todoListArray[dragIndex];
    todoListArray[dragIndex] = tempObj;
    tempId = dropPlaceElement.id;
    dropPlaceElement.id = dragElement.id;
    dragElement.id = tempId;
    updateLocalStorage('todo-list', todoListArray);
}
/**
 * Represents the mouseup of the todoItem
 */
function mouseup() {
    if (duplicateOfSelectedToDoItem === null) {
        return;
    }
    duplicateOfSelectedToDoItem.style.position = 'relative';
    duplicateOfSelectedToDoItem.style.top = 'inherit';
    duplicateOfSelectedToDoItem.style.left = 'inherit';
    document.removeEventListener('mousemove', mousemove);
    duplicateOfSelectedToDoItem.parentNode.removeChild(duplicateOfSelectedToDoItem);
    currentTodoItem.style.opacity = '1';
    currentTodoItem.style.backgroundColor = '#FFF';
    duplicateOfSelectedToDoItem = null;
    currentOverTakedElmId = null;
    currentOverTakedElm = null;
    currentTodoItem = null;
}
/**
 * Represets edit mode
 * @param {*} elm 
 * @param {*} id 
 */
function edit(elm, id) {
    var elements, title, content, index;
    elements = document.getElementById(id).childNodes;
    if (elm.classList.contains('edit-btn')) {
        elm.classList.remove('edit-btn');
        elm.classList.add('add-btn');
        /*elements.forEach(function (elm, index) {
            if (elm && elm.classList && elm.classList.contains && elm.classList.contains('todo-input-title')) {
                elm.setAttribute('contentEditable', 'true');
            }
            if (elm && elm.classList && elm.classList.contains && elm.classList.contains('todo-input-content')) {
                elm.setAttribute('contentEditable', 'true');
            }
        });*/
        //console.log(elements);
        for(var i=0;i<elements.length;i++){
            var elm = elements[i];
            var index = i;
            //console.log(elm);
            if (elm && elm.classList && elm.classList.contains && elm.classList.contains('todo-input-title')) {
                //console.log('AA');
                elm.setAttribute('contentEditable', 'true');
            }
            if (elm && elm.classList && elm.classList.contains && elm.classList.contains('todo-input-content')) {
                //console.log('BB');
                elm.setAttribute('contentEditable', 'true');
            }
        }
    } else {
        elm.classList.remove('add-btn');
        elm.classList.add('edit-btn');
        title = null;
        content = null;
        /*elements.forEach(function (elm, index) {
            if (elm && elm.classList && elm.classList.contains && elm.classList.contains('todo-input-title')) {
                elm.setAttribute('contentEditable', 'false');
                title = elm.innerHTML;
            }
            if (elm && elm.classList && elm.classList.contains && elm.classList.contains('todo-input-content')) {
                elm.setAttribute('contentEditable', 'false');
                content = elm.innerHTML;
            }
        });*/
        for(var i=0;i<elements.length;i++){
            var elm = elements[i];
            var index = i;
            if (elm && elm.classList && elm.classList.contains && elm.classList.contains('todo-input-title')) {
                elm.setAttribute('contentEditable', 'false');
                title = elm.innerHTML;
            }
            if (elm && elm.classList && elm.classList.contains && elm.classList.contains('todo-input-content')) {
                elm.setAttribute('contentEditable', 'false');
                content = elm.innerHTML;
            }
        }
        if (title !== null && content !== null) {
            index = getObjectIndexById(todoListArray, id);
            todoListArray[index].title = title;
            todoListArray[index].content = content;
            updateLocalStorage('todo-list', todoListArray);
        }
    }
    updatePositionsInTodoArray();
}
/**
 * Represents Show and closing of model
 */
function showCloseToDoModel() {
    var todoInput, todoModel, todoButton, plusIcon;
    todoInput = document.getElementById('add-todo-holder');
    todoModel = document.getElementById('todo-model');
    todoButton = document.getElementById('add-todo-btn');
    plusIcon = document.getElementById('plus-icon');
    if (plusIcon.classList.contains('rotate45')) {
        plusIcon.classList.remove("rotate45");
        plusIcon.classList.add("rotate0");

        todoInput.classList.remove("show-me");
        todoInput.classList.add("hide-me");

        todoModel.classList.remove("show-me");
        todoModel.classList.add("hide-me");
    } else {
        plusIcon.classList.remove("rotate0");
        plusIcon.classList.add("rotate45");

        todoInput.classList.remove("hidden");
        todoInput.classList.remove("hide-me");
        todoInput.classList.add("show-me");

        todoModel.classList.remove("hidden");
        todoModel.classList.remove("hide-me");
        todoModel.classList.add("show-me");
    }
}
/**
 * Represents the adding of the new todoList
 * @param {*} title 
 * @param {*} content 
 * @param {*} id 
 */
function addTodoListItem(title, content, id) {
    var elm = document.createElement('div');
    if (id != -1) {
        elm.addEventListener('mousedown', mousedown);
    }
    elm.classList.add('todo-list-holder');
    elm.setAttribute('id', String(id));
    elm.innerHTML = feedInnerHTMLInTemplate(title, content);
    return elm;
}
/**
 * Represents the adding of todo task
 */
function addToDoTask() {
    var todoTitle, todoContent, todoTitleText, todoContentText, todoListContainer, createElm, createElmClientRect, x, y;
    todoTitle = document.getElementById('todo-title');
    todoContent = document.getElementById('todo-content');
    todoTitleText = todoTitle.innerHTML;
    todoContentText = todoContent.innerHTML;
    if (todoTitleText.trim() === '' || todoContentText.trim() === '') {
        alert('some fields or empty');
        return;
    }
    nextCountForListSeries++;
    todoListContainer = document.getElementById('todo-list-container');
    createElm = addTodoListItem(todoTitleText, todoContentText, nextCountForListSeries);
    todoListContainer.appendChild(createElm);
    showCloseToDoModel();
    todoTitle.innerHTML = '';
    todoContent.innerHTML = '';
    createElmClientRect = createElm.getBoundingClientRect();
    x = Math.round(createElmClientRect.left);
    y = Math.round(createElmClientRect.top);
    todoListArray.push({ title: todoTitleText, content: todoContentText, id: nextCountForListSeries, x: x, y: y });
    updateLocalStorage('todo-list', todoListArray);
}
/**
 * Represents the remove of the todo item
 * @param {*} id 
 */
function remove(id) {
    var index, element;
    element = document.getElementById(String(id));
    element.parentNode.removeChild(element);
    index = getObjectIndexById(todoListArray, id);
    todoListArray.splice(index, 1);
    updateLocalStorage('todo-list', todoListArray);
}
/**
 * Represents the clear of inputs
 */
function clearFocussedInput() {
    var todoTitle, todoContent;
    todoTitle = document.getElementById('todo-title');
    todoContent = document.getElementById('todo-content');
    todoTitle.innerHTML = '';
    todoContent.innerHTML = '';
}
/**
 * Represents the DOM Ready state
 */
window.onload = function () {
    console.log('DOM Ready');
    var todoListContainer;
    nextCountForListSeries = document.querySelectorAll('.todo-list-holder').length;
    if (window.localStorage !== undefined && window.localStorage.getItem('todo-list') !== undefined && window.localStorage.getItem('todo-list') !== null) {
        todoListArray = JSON.parse(window.localStorage.getItem('todo-list'));
        //console.log(todoListArray);
        if (todoListArray.length > 0) {
            todoListContainer = document.getElementById('todo-list-container');
            /*todoListArray.forEach(function (elm, index) {
                todoListContainer.appendChild(addTodoListItem(elm.title, elm.content, elm.id));
                if (elm.id > nextCountForListSeries) {
                    nextCountForListSeries = elm.id;
                }
            });*/
            for(var i=0;i<todoListArray.length;i++){
                var elm = todoListArray[i];
                var index = i;
                todoListContainer.appendChild(addTodoListItem(elm.title, elm.content, elm.id));
                if (elm.id > nextCountForListSeries) {
                    nextCountForListSeries = elm.id;
                }
            }
            updatePositionsInTodoArray();
        }
    } else {
        todoListArray = [];
    }
    document.addEventListener('mouseup', mouseup);
}