var commonjson = {};
var aboutjson = {};
var previews = [];
var pagesInfo = {};

$(function(){
    var path = window.location.pathname;
    $.getJSON("/json/common/common.json", function(result){
        $.each(result, function(key, val) {
            commonjson[key] = val;
        });
    })
        .done(function(){
            $("#photo").attr("src", commonjson["img"]);
            $("#name").empty().append(commonjson["name"]);
            $("#prof").empty().append(commonjson["prof"]);
            $("#subtitle").append(commonjson["subtitle"]);
            $("#copyright").append("Copyright © " + (new Date()).getFullYear() + " - "+ commonjson["name"]);
            $("#github-page").attr("href", commonjson["github"]);
        });


    if (path === "/") {
        $.getJSON("/json/postspreview/1", function(result){
            pagesInfo["currentPage"] = result["currentpage"];
            pagesInfo["pagesAmount"] = result["pagesamount"];
            $.each(result["posts"], function(i, item){
                var tmp = {};
                $.each(item, function(key, val) {
                    tmp[key] = val;
                });
                previews.push(tmp);
            });
        })
            .done(function(){
                $(document).attr("title", commonjson["maintitle"]);
                document.title = commonjson["maintitle"];
                $.each(previews, function(i, item){
                    genPreview(item);
                });
                $("#subtitle").empty().append(commonjson["subtitle"]);
                $("#maindiv").show();
                $("#aboutdiv").hide();
                $("#pagenum").show();
                setPagenumDiv(pagesInfo["pagesAmount"]);
            });
    }
    else if (path === "/about/") {
        $.getJSON("/json/about/about.json", function(result) {
            $.each(result, function(key, val) {
                aboutjson[key] = val;
            });
        })
            .done(function(){
                $(document).attr("title", "About – " + commonjson["maintitle"]);
                $("#maindiv").hide();
                $("#aboutdiv").append(aboutjson["text"]);
                $("#subtitle").empty().append(aboutjson["subtitle"]);
                $("#aboutdiv").show();
                $("#pagenum").hide();
            });
    }
    else if (path.split('/')[1] === 'blog' && path.split('/')[2] !== '') {
        $.getJSON("/json/postspreview/" + path.split('/')[2], function(result){
            pagesInfo["currentPage"] = result["currentpage"];
            pagesInfo["pagesAmount"] = result["pagesamount"];
            $.each(result["posts"], function(i, item){
                var tmp = {};
                $.each(item, function(key, val) {
                    tmp[key] = val;
                });
                previews.push(tmp);
            });
        })
            .done(function(){
                $.each(previews, function(i, item){
                    genPreview(item);
                });
                $("#subtitle").empty().append(commonjson["subtitle"]);
                $("#maindiv").show();
                $("#aboutdiv").hide();
                $("#pagenum").show();
                console.log(pagesInfo["currentPage"], pagesInfo["pagesAmount"]);
                setPagenumDiv(pagesInfo["pagesAmount"]);
            });
    }
});


function genPreview(item) {
    var html = "<a href='" + item["url"] + "'><li>" + item["name"]
        + "</li></a><p id=date>" + item['date'] + "</p>" + item["text"] + "<hr>";
    $("#previews-list").append(html);
}

function setPagenumDiv(pagesAmount) {
    $("#pagenum").empty();
    for (i = 1; i <= pagesAmount; i++) {
        $("#pagenum").append("<a id='pagehref' href='/blog/" + parseInt(i) + "'>"+i+"</a> ");
    }
}
