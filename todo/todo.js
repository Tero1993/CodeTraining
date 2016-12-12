var log = function() {
    console.log.apply(console, arguments)
}

var mytodoList = []

//需要用到的函数
//这是日期时间函数
var currentTime = function() {
    //获取时间日期并赋值给d
    var d = new Date()
    //获取其中的年月日时分秒以自定义排版显示
    var year = d.getFullYear()
    var month = d.getMonth() + 1
    //js中月是0-11,所以+1
    var date = d.getDate()
    var hours = d.getHours()
    var minutes = d.getMinutes()
    var seconds = d.getSeconds()
    var timeArr = [month, date, hours, minutes, seconds]
    var len = timeArr.length
    for (var i = 0; i < len; i++) {
        if (timeArr[i] < 10) {
            timeArr[i] = ('0' + String(timeArr[i]))
        }
    }
    var timeString = `${year}/${timeArr[0]}/${timeArr[1]} ${timeArr[2]}:${timeArr[3]}:${timeArr[4]}`
    return timeString
}

//这是保存todo的函数
var saveTodos = function() {
    if (mytodoList.length !== 0) {
        //先将todo列表用JSON进行处理并赋值给s
        var s = JSON.stringify(mytodoList)
        //然后使用本地存储API存到本地(这个本地存储的容量大概有5M)
        localStorage.mytodoList = s
    }
}

//这是从localStorage中加载mytodoList的函数
var loadTodos = function() {
    var s = localStorage.mytodoList
    return JSON.parse(s)
}

//这是添加html的函数
var insertTodo = function(todo) {
    //先找到要添加的目标位置,这里是container那个div容器
    var todoContainer = document.querySelector('#id-div-container')
    //使用一个templateTodo函数来将todo处理成一段html代码并赋值给t
    var t = templateTodo(todo)
    //使用insertAdjacentHTML来插入处理好的html
    todoContainer.insertAdjacentHTML('beforeend', t)
}

//这是把todo处理成html的函数
var templateTodo = function(todo) {
    if (todo.state == 'done') {
        log('state', todo.state)
        var h = `<div class='todo-cell done'>`
    } else {
        log('st2', todo.state)
        var h = `<div class='todo-cell'>`
    }
    var t = `
        ${h}
            <span class='todo-label' contenteditable='false'>${todo.task}</span>
            <span class="todo-time">${todo.time}</span>
            <div class="menuDiv">
            <button class='viceButton menuButton todo-done'>Done</button>
            <button class='viceButton menuButton todo-delete'>Delete</button>
            <button class='viceButton menuButton todo-edit'>Edit</button>
            </div>
            <button class='viceButton todo-menu'>Menu</button>
        </div>
    `
    log('h', h)
    return t
}

//这是开关class属性的函数(有则删之,无则加之)
var toggleClass = function(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}

//这是返回元素自己在父元素中下标的函数
var indexOfElement = function(element) {
    var parent = element.parentElement
    for (var i = 0; i < parent.children.length; i++) {
        var e = parent.children[i]
        if (e === element) {
            return i
        }
    }
}

var GuaAlert2 = function(title, message, callback) {
    $('.deleteAll-Button').on('click', function(event){
        console.log('click Alert')
        $('style').append(alertCss())
        var button = $(event.target)
        var body = $('body')
        body.append(alertTemplete(title, message))

    })
    $('body').on('click', function(event){
        var button = $(event.target)
        if (button.html() === 'Yes') {
            callback(true)
            // button.closest('.modal-alert').remove()
        } else if (button.html() === 'Cancle') {
            callback(false)
            // button.closest('.modal-alert').remove()
        }
    })
}

GuaAlert2('WARNING', 'Are you sure you whant to delete all TODO?', callback = function(bool) {
    if (bool === true) {
        console.log('Yes')
        localStorage.clear()
        var cells = $($('.todo-cell'))
        cells.each(function(i, cell){
            cells[i].remove()
        })
        $('.modal-alert').remove()
        $('.modal-window').remove()
    } else if (bool === false) {
        console.log('Cancle')
        $('.modal-alert').remove()
        $('.modal-window').remove()
    }
})

var alertTemplete = function(title, message) {
    var t = `
    <div class="modal-alert">
    </div>
    <div class="modal-window">
        <div id="id-div-title">
            <h2 id="id-text-title">${title}</h2>
        </div>
        <p id="id-p-message">${message}</p>
        <button class="ok-button" type="button" name="button">Yes</button>
        <button class="cancle-button" type="button" name="button">Cancle</button>
    </div>
    `
    return t
}

var alertCss = function() {
    var w = $('.todo-main').css('width')
    var h = $('.todo-main').css('height')
    var t = `
    .modal-alert {
        position: absolute;
        display:block;
        width: ${w};
        height: ${h};
        border-radius: 5px;
        background-color: black;
        opacity: 0.5;
    }
    .modal-window {
        position: absolute;
        background: white;
        width: 300px;
        height: 150px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 1;
    }
    #id-div-title {
        position: relative;
        background: crimson;
        height: 20%;
        top: -20px;
    }
    #id-text-title {
        text-align: center;
        font-family: Microsoft YaHei;
        color: white;
    }
    .ok-button {
        position: absolute;
        top: 76%;
        left: 10%;
        width: 20%;
        height: 25px;
        background-color: crimson;
        border-radius: 5px;
        border-width: 0;
        color: white;
        cursor: pointer;
    }
    .cancle-button {
        position: absolute;
        top: 76%;
        left: 70%;
        width: 20%;
        height: 25px;
        background-color: green;
        border-radius: 5px;
        border-width: 0;
        color: white;
        cursor: pointer;
    }
    #id-p-message {
        position: absolute;
        top: 35%;
        left: 3%;
        text-align: center;
        color: blue;
    }
    `
    return t
}

var bindEvents = function() {
    //给add按钮绑定添加todo事件(即点击add就添加输入框中的todo)
    var bindAdd = function() {
        var addButton = document.querySelector('.addButton')
        addButton.addEventListener('click', function(){
            //首先获取输入框的value
            var todoInput = document.querySelector('#id-input-todo')
            var task = todoInput.value
            log('task', task)
            //生成todo对象
            var todo = {
                'task': task,
                //调用一个时间函数
                'time': currentTime(),
                'state': 'to be done'
            }
            log('todo',todo)
            //把todo给push到mytodoList里面
            mytodoList.push(todo)
            log('mytodoList', mytodoList)
            //调用一个保存函数
            saveTodos()
            //这一步调用一个插入的函数实现将todo插入到对应容器里
            insertTodo(todo)
        })
    }
    bindAdd()
    //绑定Cell部分
    var bindCell = function() {
        //接下来实现一个按回车就保存输入框中value的功能
        var todoContainer = document.querySelector('#id-div-container')
        //给todoContainer绑定一个按键事件
        todoContainer.addEventListener('keydown', function(event){
            //首先通过event.target来获取响应事件的元素并赋值给target
            var target = event.target
            if (event.key === 'Enter') {
                //失去焦点
                target.blur()
                //这里失去焦点之后还要阻止默认行为,因为回车默认会插入回车
                event.preventDefault()
                //更新todo,先要获取target在它父元素中的index
                var index = indexOfElement(target.parentElement)
                //更新旧的task
                mytodoList[index].task = target.innerHTML
                saveTodos()
            }
        })

        //实现完成和删除按钮的功能
        todoContainer.addEventListener('click', function(event){
            var target = event.target
            if (target.classList.contains('todo-done')) {
                //获取target的父元素并赋值给todoDiv
                var todoDiv = target.parentElement.parentElement
                toggleClass(todoDiv, 'done')
                log('todoDiv', todoDiv)
                var index = indexOfElement(todoDiv)
                var state = mytodoList[index].state
                log('mytodoList[index]', mytodoList[index])
                log('mytodoList[index].satet', mytodoList[index].state)
                if (state == 'to be done') {
                    mytodoList[index].state = 'done'
                } else {
                    mytodoList[index].state = 'to be done'
                }
                saveTodos()
            } else if (target.classList.contains('todo-delete')) {
                var todoDiv = target.parentElement.parentElement
                var index = indexOfElement(todoDiv)
                log('target', target)
                log('todoDiv', todoDiv)
                log('index', index)
                //页面上移除todoDiv
                todoDiv.remove()
                //mytodoList也要更新
                mytodoList.splice(index, 1)
                log('removed', mytodoList)
                saveTodos()
                log('after-removed', mytodoList)
            }
            //这里实现按编辑按钮将焦点移动到todo以进行编辑
            else if (target.classList.contains('todo-edit')) {
                var cell = target.parentElement.parentElement
                var span = cell.children[0]
                span.setAttribute('contenteditable', 'true')
                span.focus()
                var range = document.createRange()
                range.selectNode(span)
                window.getSelection().addRange(range)

                target.parentElement.classList.remove('menuDiv-active')
            }
            else if (target.classList.contains('todo-menu')) {
                log('target.parentElement.children[2]',target.parentElement.children[2])
                toggleClass(target.parentElement.children[2],'menuDiv-active')
                log('target.parentElement.children[2]ED',target.parentElement.children[2])
            }
        })
        //实现编辑todo后失去焦点自动保存
        todoContainer.addEventListener('blur', function(event){
            log('container blur', event, event.target)
            var target = event.target
            if (target.classList.contains('todo-label')) {
                log('update and save')
                // 让 span 不可编辑
                target.setAttribute('contenteditable', 'false')
                // 更新 todo
                var index = indexOfElement(target.parentElement)
                log('update index',  index)
                // 把元素在 todoList 中更新
                mytodoList[index].task = target.innerHTML
                // todoList.splice(index, 1)
                saveTodos()
            }
        }, true)

        // $('#id-div-container').on('mouseover', function(event){
        //     var target = event.target
        //     if (target.classList.contains('todo-menu')) {
        //         log('event:', event,'target:',target)
        //         target.parentElement.children[2].classList.add('menuDiv-active')
        //     }
        // })
        // $('#id-div-container').on('mouseout', function(event){
        //     var target = event.target
        //     if (target.classList.contains('menuButton')) {
        //         log('event:', event,'target:',target)
        //         target.parentElement.classList.remove('menuDiv-active')
        //     }
        // })
        // $('#id-div-container').on('mouseout', function(event){
        //     var target = event.target
        //     if (target.classList.contains('todo-menu')) {
        //         log('event:', event,'target:',target)
        //         target.parentElement.children[2].classList.remove('menuDiv-active')
        //     }
        // })
    }
    bindCell()

    //输入框点击回车失去焦点add todo
    var bindInput = function() {
        $('.todo-form').on('keydown', function(event){
            var target = event.target
            log('TARGET', target)
            if (event.key === 'Enter') {
                event.preventDefault()
                $('.addButton').click()
                target.select()
            }
        })
    }
    bindInput()
}

// 程序加载后, 加载 mytodoList 并且添加到页面中
var loadAllTodo = function(){
    if (localStorage.mytodoList !== undefined) {
        mytodoList = loadTodos()
        var len = mytodoList.length
        for (var i = 0; i < len; i++) {
            var todo = mytodoList[i]
            insertTodo(todo)
        }
    }
}

var __main = function() {
    bindEvents()
    loadAllTodo()
}
__main()
