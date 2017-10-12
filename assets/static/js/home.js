var commonjson = {};
var aboutjson = {};

$(function(){
    var json = {};
    $.getJSON("/json/common/common.json", function(result){
        $.each(result, function(key, val) {
            commonjson[key] = val;
        });
        $.getJSON("/json/about/about.json", function(result){
            $.each(result, function(key, val) {
                aboutjson[key] = val;
            });
            $("#name").empty().append(commonjson["name"]);
            $("#prof").empty().append(commonjson["prof"]);
            $("#subtitle").append(commonjson["subtitle"]);
            $("#copyright").append("Copyright © " + (new Date()).getFullYear() + " - "+ commonjson["name"]);
            $("#aboutdiv").append(aboutjson["text"]).hide();
            $("#github-page").attr("href", commonjson["github"]);
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
