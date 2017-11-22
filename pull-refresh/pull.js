const pull = function(data = {}) {
    const _this = this
    const target = window.document.querySelector(data.id)
    const root = window.document.querySelector('html')
    const tem = data.loading || `<div id="pull-loading" style="background:orange;width:100%;"></div>`
    const pullHeight = data.pullHeight || 200
    target.insertAdjacentHTML('beforeBegin', tem)
    const loading = window.document.querySelector('#pull-loading')
    this.pullStartY = 0
    this.delatY = 0
    target.addEventListener('touchstart', (e) => {
        loading.style.transition = 'none'
        const finger = e.targetTouches[0]
        _this.pullStartY = finger.pageY
        console.log('test', _this.pullStartY)
    })
    target.addEventListener('touchmove', (e) => {
        // loading.style.transition = 'none'
        const finger = e.targetTouches[0]
        _this.delatY = finger.pageY - _this.pullStartY
        if (root.scrollTop === 0 && _this.delatY >= 0 && _this.delatY <= pullHeight) {
            console.log('+ing', root.scrollTop)
            loading.style.height = `${_this.delatY}px`
        }
        // _this.pullStartY = finger.pageY
        console.log('moving', _this.delatY)
    })
    target.addEventListener('touchend', (e) => {
        loading.style.transition = '0.8s all ease'
        loading.style.height = '0px'
        const finger = e.changedTouches[0]
        const endOfpullHeight = finger.pageY - _this.pullStartY
        if (endOfpullHeight >= pullHeight) {
            data.callback()
        }
        console.log('end', e)
    })
}
export {
    pull
}