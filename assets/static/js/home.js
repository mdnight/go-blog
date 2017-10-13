var commonjson = {};
var aboutjson = {};
var previews = [];

$(function(){
    $.getJSON("/json/common/common.json", function(result){
        $.each(result, function(key, val) {
            commonjson[key] = val;
        });
    })
        .done(function(){
            $("#name").empty().append(commonjson["name"]);
            $("#prof").empty().append(commonjson["prof"]);
            $("#subtitle").append(commonjson["subtitle"]);
            $("#copyright").append("Copyright © " + (new Date()).getFullYear() + " - "+ commonjson["name"]);
            $("#github-page").attr("href", commonjson["github"]);
        });


    $.getJSON("/json/about/about.json", function(result) {
        $.each(result, function(key, val) {
            aboutjson[key] = val;
        });
    })
        .done(function(){
            $("#aboutdiv").append(aboutjson["text"]).hide();
        });
    $.getJSON("/json/postspreview/1", function(result){
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
        });
});

$(document).ready(function(){
    $("#about").click(function(){
        $("#subtitle").empty().append(aboutjson["subtitle"]);
        $("#aboutdiv").show();
        $("#maindiv").hide();
    });
});

$(document).ready(function(){
    $("#home").click(function(){
        $("#subtitle").empty().append(commonjson["subtitle"]);
        $("#maindiv").show();
        $("#aboutdiv").hide();
    });
});

function genPreview(item) {
    var html = "<a href='" + item["url"] + "'><li>" + item["name"]
        + "</li></a><p id=date>" + item['date'] + "</p>" + item["text"] + "<hr>";
    $("#previews-list").append(html);
}
