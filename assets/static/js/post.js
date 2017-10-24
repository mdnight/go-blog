var commonjson = {};
var postjson = {};

$(function(){
    var pathname = window.location.pathname.split('/')[1];
    var postname = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
    $.getJSON("/json/common/common.json", function(result){
        $.each(result, function(key, val) {
            commonjson[key] = val;
        });
    })
        .done(function(){
            $("#photo").attr("src", commonjson["img"]);
            $("#name").empty().append(commonjson["name"]);
            $("#prof").empty().append(commonjson["prof"]);
            $("#copyright").append("Copyright © " + (new Date()).getFullYear() + " - "+ commonjson["name"]);
            $("#github-page").attr("href", commonjson["github"]);
        });


    if (pathname === "post") {
        $.getJSON("/json/post/" + postname + ".json", function(result){
            $.each(result, function(key, val){
                postjson[key] = val;
            });
        })
            .done(function(){
                $(document).attr("title", commonjson["maintitle"]);
                document.title = commonjson["maintitle"];
                $("#postdate").empty().append(postjson["date"]);
                $("#subtitle").empty().append(postjson["name"]);
                $("#posttext").empty().append(postjson["text"]);
            });
    }
});
