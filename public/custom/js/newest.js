// const keyName = 'twikoo-newest-comments'
// const { changeContent, generateHtml, run } = window.newestComments
function getNewestCommentList() {
    // console.log(window.location.href)
    if(window.location.href!=="https://www.hudi.space/"){
        return
    }
      let flag = false
       let newest_comment=loadData("newest_comment",10)
       if (newest_comment!==null && newest_comment.length>0){
         toRender(newest_comment)
         flag = true
       }else {
           const runTwikoo = () => {
               twikoo.getRecentComments({
                   envId: 'https://twikoo.suxichuan.icu',
                   region: '',
                   pageSize: 6,
                   includeReply: true
               }).then(res => {
                   const twikooArray = res.map(e => {
                       return {
                           'content': e.comment,
                           'avatar': e.avatar,
                           'nick': e.nick,
                           'url': e.url + '#' + e.id,
                           'date': new Date(e.created).toISOString()
                       }
                   })
                   saveData("newest_comment",twikooArray)
                   toRender(twikooArray)
                   flag = true
               }).catch(err => {
                   console.error(err)
               })
           }

           if (typeof twikoo === 'object') {
               runTwikoo()
           } else {
               btf.getScript('https://npm.elemecdn.com/twikoo/dist/twikoo.all.min.js').then(runTwikoo)
           }
       }

       return flag

}

function toRender(twikooArray) {
    twikooArray.forEach(item=>{
        let newest_comment=document.querySelector(".newest_comment")
        let li=document.createElement("li")
        let a=document.createElement("a")
        a.setAttribute("href",item.url)
        let nikename=document.createElement("span")
        nikename.innerHTML = item.nick
        let content=document.createElement("p")
        content.innerHTML = removeHTMLTags(item.content)
        s = nikename.innerHTML+" : "+content.innerHTML
        a.innerHTML = s
        li.append(a)
        li.classList.add("newest_comment_item")
        newest_comment.append(li)
    })

}

function removeHTMLTags(str) {
    return str.replace(/<[^>]*>/g, ' ');
}

function setAnimationItem() {
    let currInex = 1
    let itemHeight = 60
    let commendList = document.querySelector(".newest_comment")
    if (commendList.children.length>0){
        let firstChild=commendList.children[1].cloneNode(true)
        commendList.append(firstChild)
        let duration = 3000
        setInterval(()=>{
            if (currInex === commendList.children.length){
                currInex = 1
            }
            moveNext(currInex,itemHeight,commendList)
            currInex++
        },duration)
    }
}

function moveNext(currInex,itemHeight,commendList) {
    let from = currInex * itemHeight
    let to = from + itemHeight
    commendList.scrollTop = to
}

function saveData(name, data) {
    localStorage.setItem(name, JSON.stringify({'time': Date.now(), 'data': data}))
};

// 取数据
function loadData(name, time) {
    let d = JSON.parse(localStorage.getItem(name));
    // 过期或有错误返回 0 否则返回数据
    if (d) {
        let t = Date.now() - d.time
        if (-1 < t && t < (time * 60000)) return d.data;
    }
    return null;
};


window.onload = function () {
   let flag = getNewestCommentList()
    if (flag){
        setAnimationItem()
    }else {
        let timeid=setInterval(()=>{
            let flag = getNewestCommentList()
            if (flag){
                clearInterval(timeid)
                setAnimationItem()
            }
        },2000)

    }
}
