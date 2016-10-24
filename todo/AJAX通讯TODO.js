//构建页面
var style = function() {
    var css = `
    <style>
        /* 完成的样式 */
        .done {
            color: green;
            text-decoration: line-through;
        }
    </style>
    `
    var css1 = `
    <div class="todo-main">
        <!-- todo 输入框 -->
        <div class="todo-form">
            <button id='id-button-deleteAll' type="button">ClearAll</button>
            <input id='id-input-todo' type="text">
            <button id='id-button-add' type="button">Add</button>
        </div>
        <!-- todo 列表 -->
        <div id="id-div-container">

        </div>
    </div>
    `
    var head = document.querySelector('head')
    var body = document.querySelector('body')
    head.insertAdjacentHTML('beforeend', css)
    body.insertAdjacentHTML('beforeend', css1)
}

//log函数
var log = function() {
    console.log.apply(console, arguments)
}

//这是日期时间函数
var currentTime = function() {
    //获取时间日期并赋值给d
    var d = new Date()
        //获取其中的年月日时分秒以自定义排版显示
    var month = d.getMonth() + 1
        //js中月是0-11,所以+1
    var date = d.getDate()
    var hours = d.getHours()
    var minutes = d.getMinutes()
    var seconds = d.getSeconds()
    var timeString = `${month}/${date} ${hours}:${minutes}:${seconds}`
    return timeString

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
    var t = `
        <div class='todo-cell'>
            <button class='todo-done'>完成</button>
            <button class='todo-delete'>删除</button>
            <button class='todo-edit'>编辑</button>
            <span class='todo-label' contenteditable='false'>${todo.task}</span>
            <span>${todo.time}</span>
            <span>第${todo.id}号任务</span>
        </div>
    `
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

//核心,与服务器通讯的AJAX函数
var ajax = function(request) {
    var r = new XMLHttpRequest
    r.open(request.method, request.url, true)
    if (request.contenType !== undefined) {
        r.setRequestHeader('Content-Type', request.contenType)
    }
    r.onreadystatechange = function(event) {
        console.log('state change', r)
        if (r.readyState == 4) {
            request.callback(r.response)
        }
    }
    if (request.method === 'GET') {
        r.send()
    } else {
        r.send(request.data)
    }

}

//给add按钮绑定添加todo事件(即点击add就添加输入框中的todo)
var bindEventAdd = function() {
    var addButton = document.querySelector('#id-button-add')
    addButton.addEventListener('click', function() {
        //首先获取输入框的value
        var todoInput = document.querySelector('#id-input-todo')
        var task = todoInput.value
            //生成todo对象
        var taskObj = {
            'task': task
        }
        var data = JSON.stringify(taskObj)
        log('data', data)
        var r = {
            method: 'POST',
            url: '/todo/649168990/add',
            contenType: 'application/json',
            data: data,
            callback: function(response) {
                var res = JSON.parse(response)
                console.log('响应', res, 'id', res['id'])
                var todo = {
                    'task': task,
                    'time': currentTime(),
                    'id': res['id']
                }
                insertTodo(todo)
            }
        }
        ajax(r)
    })
}

//接下来实现一个按回车就保存输入框中value的功能
var bindEventEnter = function() {
    var todoContainer = document.querySelector('#id-div-container')
        //给todoContainer绑定一个按键事件
    todoContainer.addEventListener('keydown', function(event) {
        //首先通过event.target来获取响应事件的元素并赋值给target
        var target = event.target
        var target = event.target
        var cell = target.parentElement
        var span = cell.children[5]
        var spl = String(span.innerHTML)
        var id = spl.slice(1, spl.length - 3)
        if (event.key === 'Enter') {
            //失去焦点
            target.blur()
                //这里失去焦点之后还要阻止默认行为,因为回车默认会插入回车
            event.preventDefault()
                //更新todo
            var todo = {
                'task': target.innerHTML
            }
            var data = JSON.stringify(todo)
            var rUpdate = {
                method: 'POST',
                url: 'http://vip.cocode.cc:3000/todo/649168990/update/' + id,
                contenType: 'application/json',
                data: data,
                callback: function(response) {
                    console.log('已更新', JSON.parse(response))
                }
            }
            ajax(rUpdate)
        }
    })
}

//一键删除所有todo
var bindEventClear = function() {
    //获取clear按钮
    var clear = document.querySelector('#id-button-deleteAll')
    //绑定click事件
    clear.addEventListener('click', function() {
        //设置获取所有todo的resquest
        var r = {
            method: 'GET',
            url: '/todo/649168990/all',
            contenType: 'application/json',
            callback: function(response) {
                var res = JSON.parse(response)
                console.log('响应', res)
                var resl = res.length
                //在获取所有的callback中使用循环遍历response
                for (var i = 0; i < resl; i++) {
                    var id = res[i].id
                    //使用response中获取的todo的id循环设置删除的request以逐个发送删除
                    var rDelete = {
                        method: 'GET',
                        url: '/todo/649168990/delete/' + id,
                        contenType: 'application/json',
                        callback: function(response) {
                            console.log('删除成功', JSON.parse(response))
                            //服务器端删除成功后还要清空页面
                            var todoCells = document.querySelectorAll('.todo-cell')
                            var tCl = todoCells.length
                            //逐个删除页面的todo
                            for (var i = 0; i < tCl; i++) {
                                todoCells[i].remove()
                            }
                        }
                    }
                    ajax(rDelete)
                }
            }
        }
        ajax(r)
    })
}

//实现完成,删除,编辑按钮的功能
var bindEventButton = function() {
    var todoContainer = document.querySelector('#id-div-container')
    todoContainer.addEventListener('click', function(event) {
        var target = event.target
        var cell = target.parentElement
        var span = cell.children[5]
        log('span', span)
        var spl = String(span.innerHTML)
        var id = spl.slice(1, spl.length - 3)
        log('deid', id)
        if (target.classList.contains('todo-done')) {
            //获取target的父元素并赋值给todoDiv
            var todoDiv = target.parentElement
            toggleClass(todoDiv, 'done')
        } else if (target.classList.contains('todo-delete')) {
            var rDelete = {
                method: 'GET',
                url: '/todo/649168990/delete/' + id,
                contenType: 'application/json',
                callback: function(response) {
                    console.log('删除成功', JSON.parse(response))
                    var todoDiv = target.parentElement
                    todoDiv.remove()
                }
            }
            ajax(rDelete)
        }
        //这里实现按编辑按钮将焦点移动到todo以进行编辑
        else if (target.classList.contains('todo-edit')) {
            var span = cell.children[3]
            span.setAttribute('contenteditable', 'true')
            span.focus()
        }
    })
}

//实现编辑todo后失去焦点自动保存
var bindEventBlur = function() {
    var todoContainer = document.querySelector('#id-div-container')
    todoContainer.addEventListener('blur', function(event) {
        log('container blur', event, event.target)
        var target = event.target
        var cell = target.parentElement
        var span = cell.children[5]
        var spl = String(span.innerHTML)
        var id = spl.slice(1, spl.length - 3)
        log('bmjid', id)
        if (target.classList.contains('todo-label')) {
            log('update and save')
                // 让 span 不可编辑
            target.setAttribute('contenteditable', 'false')
                // 更新 todo
            var todo = {
                'task': target.innerHTML
            }
            var data = JSON.stringify(todo)
            var rUpdate = {
                method: 'POST',
                url: '/todo/649168990/update/' + id,
                contenType: 'application/json',
                data: data,
                callback: function(response) {
                    console.log('编辑成功', JSON.parse(response))
                }
            }
            ajax(rUpdate)
        }
    }, true)
}

//绑定事件集中
var bindEvents = function() {
    // 添加 todo
    bindEventAdd()
        // 文本框输入 todo 按回车保存
    bindEventEnter()
        // 完成按钮和删除按钮
    bindEventButton()
        // 文本框失去焦点后保存 todo
    bindEventBlur()
        //删除所有todo
    bindEventClear()
}

var __main = function() {
    //构建页面
    style()
        //绑定事件
    bindEvents()
}

__main()
