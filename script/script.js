$(function () {
    loadInfo();

    loadMobile(getViewport());

    // $(window).bind('resize', function(e){
    //     loadMobile(getViewport());
    // });
});

function loadMobile(size) {
    if(size == "sm" || size == "xs"){
        $('.cloud').html('');
    }else{
        $('.cloud').html('<object type="image/svg+xml"data="./assets/cloud.svg"></object>');
    }
}

function loadInfo() {
    $.ajax({
        url:'./data/data.json',
        cache: false
    }).done(function (data) {
        $.ajax({
            url: data.formInfo.resultSheetLink,
            cache: false
        }).done(function (stats) {
            buildRound(data,stats);
        })
    })
}

function buildRound(data,teamStats) {

    var roundInfo = data.roundInfo;

    $("#roundNum").html(roundInfo.roundNumber);
    $("#voting").html('<div class="button col-sm-6 offset-sm-3" onclick="window.location.href='+"'"+data.formInfo.formLink+"'"+'">Vote Here</div>')

    buildTimer(roundInfo.roundTimeEnd);

    buildTeams(data.teamInfo,teamStats);
}

function buildTimer(roundTimeEnd) {
    var endTime = new Date(roundTimeEnd);

    endTime = (Date.parse(endTime) / 1000);

    var now = new Date();
    now = (Date.parse(now) / 1000);

    var timeLeft = endTime - now;

    var days = Math.floor(timeLeft / 86400);
    var hours = Math.floor((timeLeft - (days * 86400)) / 3600);
    var minutes = Math.floor((timeLeft - (days * 86400) - (hours * 3600)) / 60);
    var seconds = Math.floor((timeLeft - (days * 86400) - (hours * 3600) - (minutes * 60)));

    if (hours < "10") {
        hours = "0" + hours;
    }
    if (minutes < "10") {
        minutes = "0" + minutes;
    }
    if (seconds < "10") {
        seconds = "0" + seconds;
    }

    $("#timer").html(days + " Day(s) " + hours + ":" + minutes);

    setInterval(function () {
        buildTimer(roundTimeEnd);
    }, 60000);
}

function buildTeams(teamInfo,teamStats) {
    console.log(teamInfo);

    var keys = Object.keys(teamInfo)
    for (var key of keys) {

        var team = teamInfo[key];
        var component = $("<div><div class='text-center pageSubtitle'>" + team.name + "</div><img class='text-center rounded img-fluid' src='" + team.img + "'></div>");

        if (key == "teamC") {
            component.addClass("col-sm-8 col-md-6 offset-sm-2 offset-md-3");
            $('#teamRosterBottom').append(component);
        } else {
            component.addClass("col-sm-8 col-md-6 offset-sm-2 offset-md-0");
            $('#teamRosterTop').append(component);
        }
    }

    loadStats(teamStats);
}

function loadStats(data){
    var stats = Papa.parse(data);
    var statsDataRow = stats.data[2];
    
    var teamStats = {
        "a": statsDataRow[3],
        "b": statsDataRow[4],
        "c": statsDataRow[5]
    }

    console.log(teamStats);

    $('#results').append('<object id="pond" type="image/svg+xml"data="assets/pond.svg" class="col-sm-8 offset-sm-2"></object>');

    var obj = document.getElementById("pond");
    var svg = obj.contentDocument;
    console.log(obj,svg);
    console.log(700*teamStats.a);


    setTimeout(doneLoading, 5000);
}

function doneLoading() {
    $("#loading").addClass("hidden");
    $("#loaded").removeClass("hidden");
}

function getViewport() {
    // https://stackoverflow.com/a/8876069
    const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
    if (width <= 576) 
        return 'xs'
    if (width <= 768) 
        return 'sm'
    if (width <= 992) 
        return 'md'
    if (width <= 1200) 
        return 'lg'
    return 'xl'
}