//定义log函数
var log = function() {
    console.log.apply(console, arguments)
}

//歌曲名构造数组
var listOfSongs = ['连诗雅 - 水星逆行',
    'Bruno Mars,Royce Da,Eminem - Lighters',
    'Adele - Someone Like You',
    'Narsha,MiRyo - I Love You',
    'Alan Walker - Fade',
    '王菲 - 红豆',
    '徐佳莹,林俊杰 - 不为谁而作的歌',
    'G.E.M.邓紫棋 - 泡沫',
    '李克勤 - 月半小夜曲',
    '薛之谦 - 演员',
    '郑中基 - 答应不爱你',
    '张学友,汤宝如 - 相思风雨中',]

var Music = function(song, number, time, vol) {
    this.song = song
    this.number = number
    this.time = time
    this.volume = vol
    this.play = function() {
        var p = $('.musicPlayer')[0]
        p.src = `audio/${this.song}.mp3`
        p.volume = this.volume
        p.currentTime = this.time
        p.play()
    }
}

var songs = []
$(listOfSongs).each(function(i, song){
    var e = new Music(song, i, 0, 1)
    songs.push(e)
})

//加载歌曲到列表
var loadSongs = function(listOfSongs) {
    $(listOfSongs).each(function(i, e){
        if (i < 1) {
            var t = `<song class="song-active" data-index=${i}>${e}</song>`
            $('.songList').append(t)
        } else {
            var t = `<song data-index=${i}>${e}</song>`
            $('.songList').append(t)
        }
    })
    var p = $('.musicPlayer')[0]
    p.src = `audio/${listOfSongs[0]}.mp3`
}

var playSong = function(offset) {
    var list = $('song')
    var numbers = list.length
    var i = $('.song-active').data('index')
    var ing = (i + offset + numbers) % numbers
    songs[ing].play()
    $('.song-active').removeClass('song-active')
    $($('song')[ing]).addClass('song-active')
}

var playNext = function() {
    playSong(1)
}

var playLast = function() {
    playSong(-1)
}

//格式化时间
var formatTime = function(time) {
    var minutes = Math.floor(time / 60)
    var seconds = Math.floor(time % 60)
    if (seconds < 10) {
        seconds = '0' + String(seconds)
    }
    var t = `${minutes}:${seconds}`
    return t
}

var orderPlay =function() {
    //播放完成之后自动下一曲
    $('.nextSong').click()
}

var singlePlay =function() {
    var i = $('.song-active').data('index')
    songs[i].play()
}

var randomPlay = function() {
    var r = Math.floor(Math.random() * songs.length)
    $('.song-active').removeClass('song-active')
    $($('song')[r]).addClass('song-active')
    songs[r].play()
}

//获取元素的绝对X坐标
var getAbsX = function(e) {
    //获取元素的相对X坐标
    var offset = e.offsetLeft
    if(e.offsetParent !=null ) {
        offset += getAbsX(e.offsetParent)
    }
    return offset
}


var bindEvents = function () {
    //左侧菜单按钮，点击打开/关闭菜单
    $('.buttonImg').on('click', function(){
        log('start')
        if ($('.buttonImg').css('transform') === 'none') {
            log('wtf1')
            $('.buttonImg').css('transform', "translateX(0)")
            $('.menuDiv').css('transform', "translateX(-99.3%)")
            // $('.bgpDiv').css('transform', "translateX(200px)")
        } else {
            log('wtf2')
            $('.menuDiv').css('transform', 'none')
            // $('.bgpDiv').css('transform', 'none')
            $('.buttonImg').css('transform', 'none')
        }
    })

    //点击歌曲播放
    $('.songList').on('click', function(e){
        var target = $(e.target)
        var i = target.data('index')
        $('.bigPlayButton').css('animation-play-state', 'paused')
        $('.smallPlayButton').css('animation-play-state', 'paused')
        //进度条回到初始状态
        $('.handdle').css('left','1%')
        $('.handdle').css('animation', 'none')
        songs[i].play()
        $('.song-active').removeClass('song-active')
        $($('song')[i]).addClass('song-active')
    })

    //通过点击zipper控制进度
    $('.zipper').on('click', function(e){
        var p = $('.musicPlayer')[0]
        var allTime = p.duration
        var x = e.clientX
        var start = getAbsX($('.zipper-start')[0])
        var end = getAbsX($('.zipper-end')[0])
        var len = end - start
        var relX = x - start
        var handdleWidth = $('.handdle').css('width')
        var handdleLen = Number(handdleWidth.slice(0, handdleWidth.length-2))
        var handdleRelX = relX - handdleLen / 2
        if (x > start && x < end) {
                p.currentTime = allTime * (relX / len)
                $('.handdle').css('left', `${handdleRelX}px`)
            }
    })

    $('.handdle').on({
        dragstart:function(){
            log('拉手被拖动了')
            //音乐暂停
            var p = $('.musicPlayer')[0]
            p.pause()
            //动画取消
            $('.handdle').css('animation-play-state', 'paused')
            $('.bigPlayButton').css('animation-play-state', 'paused')
            $('.smallPlayButton').css('animation-play-state', 'paused')
        },
        drag:function(e){
            log('拉手正在拖动中')
            var p = $('.musicPlayer')[0]
            var allTime = p.duration
            var x = e.clientX
            var start = getAbsX($('.zipper-start')[0])
            var end = getAbsX($('.zipper-end')[0])
            var len = end - start
            var relX = x - start
            var handdleWidth = $('.handdle').css('width')
            var handdleLen = Number(handdleWidth.slice(0, handdleWidth.length-2))
            var handdleRelX = relX - handdleLen / 2
            if (x > start && x < end) {
                    if (relX < 50) {
                        p.currentTime = 0
                        $('.handdle').css('left', '1%')
                    } else if (end - x < 50) {
                        p.currentTime = allTime * (relX / len)
                        $('.handdle').css('left', '92%')
                    } else {
                        p.currentTime = allTime * (relX / len)
                        $('.handdle').css('left', `${handdleRelX}px`)
                    }
                }
        },
        dragend:function(){
            log('拖放结束')
            var p = $('.musicPlayer')[0]
            p.play()
            $('.handdle').css('animation-play-state', 'running')
            $('.bigPlayButton').css('animation-play-state', 'running')
            $('.smallPlayButton').css('animation-play-state', 'running')
        },
    })

    $('.zipper').on({
        dragover:function(event){
            event.preventDefault()
            log('在进度条上ing')},
        // dragleave:function(){
        //     log('拖离了进度条')},
        drop:function(event){
            // event.preventDefault()
            log('放在了这')}
    })
    //设置上/下一首按钮的动画
    $('.cutSong').hover(function(e){
        var target = $(e.target)
        target.css('animation', 'rally 0.1s linear')
        target.css('animation-play-state', 'paused')
    }, function(e){
        var target = $(e.target)
        target.css('animation', 'none')
    })

    //绑定按钮播放上一首下一首
    $('.cutSong').on('click', function(e){
        if ($('.playMode').text() == '随机播放') {
            randomPlay()
        } else {
            var p = $('.musicPlayer')[0]
            var time = p.duration
            var target = $(e.target)
            var action = target.data('action')
            var actions = {
                last: playLast,
                next: playNext,
            }
            actions[action]()
            target.css('animation-play-state', 'running')
            //重置动画位置
            $('.bigPlayButton').css('animation-play-state', 'paused')
            $('.smallPlayButton').css('animation-play-state', 'paused')
            //进度条回到初始状态
            $('.handdle').css('left', '1%')
            $('.handdle').css('animation', 'none')
        }
    })

    $('.playMode').on('click', function(){
        var mode = $('.playMode').text()
        if (mode === '顺序播放') {
            $('.musicPlayer').off('ended', orderPlay)
            $('.playMode').text('单曲循环')
            $('.musicPlayer').on('ended', singlePlay)
        } else if (mode === '单曲循环') {
            $('.musicPlayer').off('ended', singlePlay)
            $('.musicPlayer').on('ended', randomPlay)
            $('.playMode').text('随机播放')
        } else if (mode === '随机播放') {
            $('.musicPlayer').off('ended', randomPlay)
            $('.musicPlayer').on('ended', orderPlay)
            $('.playMode').text('顺序播放')
        }
    })

    $('.musicPlayer').on('ended', orderPlay)
    $('.musicPlayer').on('ended', function(){
        //重置动画位置
        $('.bigPlayButton').css('animation-play-state', 'paused')
        $('.smallPlayButton').css('animation-play-state', 'paused')
        //进度条回到初始状态
        $('.handdle').css('left', '1%')
        $('.handdle').css('animation', 'none')
    })

    //canplay时，准备动画
    $('.musicPlayer').on('canplay', function(){
        var p = $('.musicPlayer')[0]
        var time = p.duration
        //设置动画
        $('.bigPlayButton').css('animation', 'rotate 8s linear infinite')
        $('.smallPlayButton').css('animation', 'rotate 2s linear infinite')
        $('.handdle').css('animation', `trans ${time}s linear infinite`)
        //让设置的动画暂停，等到音乐播放时再播放动画
        $('.bigPlayButton').css('animation-play-state', 'paused')
        $('.smallPlayButton').css('animation-play-state', 'paused')
        $('.handdle').css('animation-play-state', 'paused')
        //时间重置
        $('#id-time-current').text('0:00')
        $('#id-time-duration').text(formatTime(time))
        if ($('.song-active')) {

        }
    })

    //播放时开启动画
    $('.musicPlayer').on('playing', function(){
        $('.bigPlayButton').css('animation-play-state', 'running')
        $('.smallPlayButton').css('animation-play-state', 'running')
        $('.handdle').css('animation-play-state', 'running')
    })

    //同步显示已播放时长
    $('.musicPlayer').on('timeupdate', function(e){
        var p = $('.musicPlayer')[0]
        var time = p.currentTime
        $('#id-time-current').text(formatTime(time))
    })

    //点击旋转纽扣播放/暂停
    $('.bigPlayButton, .smallPlayButton').on('click', function(){
        var p = $('.musicPlayer')[0]
        var time = p.duration
        log('time',time)
        if (p.paused === true) {
            p.play()
        } else {
            p.pause()
            //纽扣暂停
            $('.bigPlayButton').css('animation-play-state', 'paused')
            $('.smallPlayButton').css('animation-play-state', 'paused')
            //进度条暂停
            $('.handdle').css('animation-play-state', 'paused')
        }
    })
}

var __main = function() {
    loadSongs(listOfSongs)
    bindEvents()
}
__main()
