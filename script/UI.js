"use strict";
var OResults;
(function (OResults) {
    var UI;
    (function (UI) {
        const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
        UI.language = new OResults.Language.Czech();
        let defaultState;
        function saveDefaultState() {
            defaultState = document.body.innerHTML;
        }
        UI.saveDefaultState = saveDefaultState;
        async function setupUI(showClassSelect = false) {
            document.body.innerHTML = defaultState;
            let comp = await OResults.LiveresultatAPI.Competition.initialize(OResults.Config.COMP_ID);
            $("#runner_name").text(UI.language.runner_name);
            $("#runner_start").text(UI.language.runner_start);
            $("#runner_result").text(UI.language.runner_result);
            $("#runner_plus").text(UI.language.runner_plus);
            $("#comp_name").text(comp.name);
            $("#live_results").text(UI.language.live_results);
            if (window.location.hash !== "#auto") {
                $("#auto_time").hide();
                $("title").text(UI.language.title);
                $("#select_class").text(`${UI.language.select_class}:`);
                $("#about_link").html(`<a href="javascript:LLIResults.UI.showSection('about')">${UI.language.about_link}</a>`);
                $("#about_html").html(UI.language.about_html);
                $("#font").html(UI.language.font);
                $(".back").html(`<i class="bi bi-arrow-left"></i> ${UI.language.back}`).on('click', () => renderClassList(comp));
                renderClassList(comp);
                $("#logo").hide().attr("height", $("header").height() ?? 150).attr("src", OResults.Config.LOGO_PATH).show();
                if (showClassSelect)
                    showSection("class_select");
            }
            else {
                $("#lang_select, #about_link, .back").hide();
                $("#logo").hide().attr("height", $("header").height() ?? 150).attr("src", OResults.Config.LOGO_PATH).show();
                showSection('results');
                await comp.updateClasses();
                await comp.classes[0].updateResults();
                autoMode(comp, 0);
            }
        }
        UI.setupUI = setupUI;
        async function autoMode(comp, i) {
            if (i === 0) {
                await comp.updateClasses();
            }
            renderClassResults(comp.classes[i], false);
            let bHeight = $("#results_table").height() ?? 0;
            let hHeight = $("header").height() ?? 0;
            let cHeight = $("#class_name").height() ?? 0;
            let wHeight = $(window).height() ?? 0;
            let next = (i + 1) % comp.classes.length;
            if (bHeight > (wHeight - cHeight - hHeight)) {
                $("#res_wrap")[0].scrollTo(0, 0);
                let time = comp.classes[i].runners.length * 100;
                $("#auto_time").attr("value", 0).animate({ value: 100 }, time * 5 + 1500, "linear");
                await sleep(1500);
                $("#res_wrap").stop().animate({
                    scrollTop: $("#res_wrap")[0].scrollHeight
                }, time * 3, "linear", async () => {
                    $("#res_wrap").stop().animate({
                        scrollTop: 0
                    }, time * 2, "linear", async () => {
                        await sleep(1000);
                        await comp.classes[next].updateResults();
                        autoMode(comp, next);
                    });
                });
            }
            else {
                let time = Math.max(comp.classes[i].runners.length * 500, 3000);
                $("#auto_time").attr("value", 0).animate({ value: 100 }, time, "linear");
                await sleep(time);
                await comp.classes[next].updateResults();
                autoMode(comp, next);
            }
        }
        async function renderClassList(comp) {
            await comp.updateClasses();
            let classList = $("#class_list").html("");
            for (const oClass of comp.classes) {
                let color;
                if (oClass.name.match(/P[0-9]*/) || oClass.name.match(/T[0-9]*/) || oClass.name.match(/.*open.*/i) || oClass.name == "HDR") {
                    color = "open";
                }
                else if (oClass.name.startsWith("D") || oClass.name.startsWith("W")) {
                    color = "women";
                }
                else if (oClass.name.startsWith("H") || oClass.name.startsWith("M")) {
                    color = "men";
                }
                else {
                    color = "";
                }
                classList.append(`<button class='${color}' onclick="LLIResults.UI.showClassResults('${oClass.name}');">${oClass.name}</button>`);
            }
            showSection('class_select');
        }
        UI.renderClassList = renderClassList;
        async function showClassResults(className) {
            showSection('results');
            OResults.Cache.currentResultsMode = "Class";
            let oClass = OResults.Cache.competition.classes.find(c => c.name === className);
            if (!oClass)
                return;
            OResults.Cache.currentClass = oClass;
            $("#crt_body").html(`<tr><td colspan="100%" style="text-align:center">${UI.language.loading}...</td></tr>`);
            await renderClassResults(oClass);
            OResults.Cache.currentResultsInterval = setInterval(() => renderClassResults(OResults.Cache.currentClass), 15000);
        }
        UI.showClassResults = showClassResults;
        async function renderClassResults(oClass, update = true) {
            $("#runner_club").text(UI.language.runner_club);
            clearInterval(OResults.Cache.currentRunningInterval);
            $("#page_name").text(oClass.name);
            let tbody = $("#crt_body");
            if (update) {
                await oClass.updateResults();
            }
            tbody.html("");
            for (const runner of oClass.runners) {
                tbody.append(`<tr><td>${runner.place}</td><td>${runner.name}</td><td><a href="javascript:LLIResults.UI.showClubResults('${runner.club}');">${runner.club}</a></td><td>${runner.start.toLocaleTimeString()}</td><td class="result">${getResult(runner)}</td><td>${getLost(runner)}</td></tr>`);
            }
            last_now = new Date().getTime();
            OResults.Cache.currentRunningInterval = setInterval(updateTimes, 1000);
        }
        UI.renderClassResults = renderClassResults;
        async function showClubResults(clubName) {
            showSection('results');
            OResults.Cache.currentResultsMode = "Club";
            let club = new OResults.LiveresultatAPI.Club(clubName, OResults.Cache.competition.id);
            OResults.Cache.currentClub = club;
            $("#crt_body").html(`<tr><td colspan="100%" style="text-align:center">${UI.language.loading}...</td></tr>`);
            await renderClubResults(club);
            OResults.Cache.currentResultsInterval = setInterval(() => renderClubResults(OResults.Cache.currentClub), 15000);
        }
        UI.showClubResults = showClubResults;
        async function renderClubResults(club, update = true) {
            $("#runner_club").text(UI.language.runner_cat);
            clearInterval(OResults.Cache.currentRunningInterval);
            $("#page_name").text(club.name);
            let tbody = $("#crt_body");
            if (update) {
                await club.updateResults();
            }
            tbody.html("");
            for (const runner of club.runners) {
                tbody.append(`<tr><td>${runner.place}</td><td>${runner.name}</td><td><a href="javascript:LLIResults.UI.showClassResults('${runner.oClass}');">${runner.oClass}</a></td><td>${runner.start.toLocaleTimeString()}</td><td class="result">${getResult(runner)}</td><td>${getLost(runner)}</td></tr>`);
            }
            last_now = new Date().getTime();
            OResults.Cache.currentRunningInterval = setInterval(updateTimes, 1000);
        }
        UI.renderClubResults = renderClubResults;
        function getMsSinceMidnight(d) {
            var e = new Date(d);
            return d - e.setHours(0, 0, 0, 0);
        }
        function getResult(runner) {
            if (runner.status === 9) {
                if (runner.start.getTime() > new Date().getTime())
                    return "";
                return `<i class="running">${formatTimeMinSec(new Date(new Date().getTime() - getMsSinceMidnight(runner.start.getTime())))}</i>`;
            }
            else if (runner.status !== 0)
                return "";
            else {
                if (isNaN(runner.result.getTime()))
                    return "";
                return `${formatTimeMinSec(runner.result)}`;
            }
        }
        let last_now;
        function getLost(runner) {
            if (runner.status === 9) {
                if (runner.start.getTime() < new Date().getTime())
                    return `<span class="update">${UI.language.states[9]}</span>`;
                else
                    return "";
            }
            else if (runner.status !== 0)
                return UI.language.states[runner.status];
            else {
                if (isNaN(runner.timeplus.getTime()))
                    return "";
                return `+${formatTimeMinSec(runner.timeplus)}`;
            }
        }
        function updateTimes() {
            for (const running of $(".running")) {
                let times = running.innerText.split(":").map((val) => parseInt(val));
                running.innerText = formatTimeMinSec(new Date(new Date().setHours(0, times[0], times[1]) + (new Date().getTime() - last_now)));
            }
            last_now = new Date().getTime();
        }
        function showSection(name) {
            clearInterval(OResults.Cache.currentResultsInterval);
            OResults.Cache.currentResultsInterval = undefined;
            $("#crt_body").html("");
            $(".section").hide();
            OResults.Cache.currentSection = name;
            $("#" + name).show();
        }
        UI.showSection = showSection;
        async function setLanguage(newLanguage) {
            UI.language = newLanguage;
            await setupUI();
            showSection(OResults.Cache.currentSection);
            if (OResults.Cache.currentSection === "results") {
                if (OResults.Cache.currentResultsMode === "Class") {
                    await renderClassResults(OResults.Cache.currentClass);
                }
                else {
                    await renderClubResults(OResults.Cache.currentClub);
                }
            }
        }
        UI.setLanguage = setLanguage;
        function formatTimeMinSec(time) {
            return `${time.getHours() * 60 + time.getMinutes()}:${time.getSeconds().toString().padStart(2, "0")}`;
        }
    })(UI = OResults.UI || (OResults.UI = {}));
})(OResults || (OResults = {}));
