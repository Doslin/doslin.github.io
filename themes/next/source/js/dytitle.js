var OriginTitile = document.title;
var titleTime;
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        $('[rel="shortcut icon"]').attr('href', "/uploads/TEP.png");
        document.title = 'Doude Blog';
        clearTimeout(titleTime);
    }
    else {
        //$('[rel="shortcut icon"]').attr('href', "/favicon.png");
        document.title = '♪(^∇^*)' + OriginTitile;
        titleTime = setTimeout(function () {
            document.title = OriginTitile;
        }, 2000);
    }
});