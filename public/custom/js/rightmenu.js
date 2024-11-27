let kk = {};

kk.showRightMenu = function(isTrue, x=0, y=0){
    let $rightMenu = $('#rightMenu');
    $rightMenu.css('top',x+'px').css('left',y+'px');
    if(isTrue){
        $rightMenu.show();
        // $('#rightmenu-mask').attr('style','display: block');
    }else{
        $rightMenu.hide();
    }
}

let rmWidth = $('#rightMenu').width();
let rmHeight = $('#rightMenu').height();
window.oncontextmenu = function(event){
    let pageX = event.clientX + 10;	//加10是为了防止显示时鼠标遮在菜单上
    let pageY = event.clientY;

    // 鼠标默认显示在鼠标右下方，当鼠标靠右或考下时，将菜单显示在鼠标左方\上方
    if(pageX + rmWidth > window.innerWidth){
        pageX -= rmWidth;
    }
    if(pageY + rmHeight > window.innerHeight){
        pageY -= rmHeight;
    }

    kk.showRightMenu(true, pageY, pageX);
    // $('#rightmenu-mask').attr('style','display: flex');
    return false;
};

function RemoveRightMenu(){
    kk.showRightMenu(false);
    // $('#rightmenu-mask').attr('style','display: none');
}

$('html').on('click',function () {
    RemoveRightMenu()
})

$('#menu-backward').on('click',function(){window.history.back();});
$('#menu-forward').on('click',function(){window.history.forward();});
$('#menu-refresh').on('click',function(){window.location.reload();});

kk.switchDarkMode = function(){
    RemoveRightMenu();
    const nowMode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
    if (nowMode === 'light') {
        saveData("theme","dark")
        GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night)
    } else {
        saveData("theme","light")
        GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.night_to_day)
    }
    // handle some cases
    typeof utterancesTheme === 'function' && utterancesTheme()
    typeof FB === 'object' && window.loadFBComment()
    window.DISQUS && document.getElementById('disqus_thread').children.length && setTimeout(() => window.disqusReset(), 200)
};

$('#menu-darkmode').on('click',kk.switchDarkMode);

$('#menu-home').on('click',function(){window.location.href = window.location.origin;});


function copy() {
    let selectedText = loadData("selection",1)
    navigator.clipboard.writeText(selectedText);
}


function presaveData(){
    let selectedText = '';
    if (document.getSelection) {
        selectedText = document.getSelection().toString();
    } else if (document.selection && document.selection.type !== 'Control') {
        selectedText = document.selection.createRange().text;
    }
    saveData("selection",selectedText)
}


function saveData(name, data) {
    localStorage.setItem(name, JSON.stringify({'time': Date.now(), 'data': data}))
};

function loadData(name, time) {
    let d = JSON.parse(localStorage.getItem(name));
    // 过期或有错误返回 0 否则返回数据
    if (d) {
        let t = Date.now() - d.time
        if (-1 < t && t < (time * 60000)) return d.data;
    }
    return null;
};
