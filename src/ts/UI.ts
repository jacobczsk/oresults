namespace LLIResults.UI {
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    export let language: Language.Language = new Language.Czech();
    let defaultState: string;

    export function saveDefaultState() {
        defaultState = document.body.innerHTML;
    }

    export async function setupUI(showClassSelect = false) {
        document.body.innerHTML = defaultState;
        let comp = await LLIResults.LiveresultatAPI.Competition.initialize(Config.COMP_ID);

        $("#runner_name").text(language.runner_name);
        $("#runner_start").text(language.runner_start);
        $("#runner_result").text(language.runner_result);
        $("#runner_plus").text(language.runner_plus);

        $("#comp_name").text(comp.name);
        $("#live_results").text(language.live_results);

        if (window.location.hash !== "#auto") {
            $("#auto_time").hide();
            $("title").text(language.title);
            $("#select_class").text(`${language.select_class}:`);
            $("#about_link").html(`<a href="javascript:LLIResults.UI.showSection('about')">${language.about_link}</a>`);
            $("#about_html").html(language.about_html);
            $("#font").html(language.font);
            $(".back").html(`<i class="bi bi-arrow-left"></i> ${language.back}`).on('click', () => renderClassList(comp));
            renderClassList(comp);
            $("#logo").hide().attr("height", $("header").height() ?? 150).attr("src", Config.LOGO_PATH).show();
            if (showClassSelect)
                showSection("class_select");
        } else {
            $("#lang_select, #about_link, .back").hide();
            $("#logo").hide().attr("height", $("header").height() ?? 150).attr("src", Config.LOGO_PATH).show();
            showSection('results');
            await comp.updateClasses();
            await comp.classes[0].updateResults();
            autoMode(comp, 0);
        }
    }

    async function autoMode(comp: LiveresultatAPI.Competition, i: number) {
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
        } else {
            let time = Math.max(comp.classes[i].runners.length * 500, 3000);
            $("#auto_time").attr("value", 0).animate({ value: 100 }, time, "linear");
            await sleep(time);
            await comp.classes[next].updateResults();
            autoMode(comp, next);
        }
    }

    export async function renderClassList(comp: LiveresultatAPI.Competition) {
        await comp.updateClasses();
        let classList = $("#class_list").html("");
        for (const oClass of comp.classes) {
            let color: string;
            if (oClass.name.match(/P[0-9]*/) || oClass.name.match(/T[0-9]*/) || oClass.name.match(/.*open.*/i) || oClass.name == "HDR") {
                color = "open"
            } else if (oClass.name.startsWith("D") || oClass.name.startsWith("W")) {
                color = "women";
            } else if (oClass.name.startsWith("H") || oClass.name.startsWith("M")) {
                color = "men";
            } else {
                color = "";
            }
            classList.append(`<button class='${color}' onclick="LLIResults.UI.showClassResults('${oClass.name}');">${oClass.name}</button>`);
        }
        showSection('class_select');
    }

    export async function showClassResults(className: string) {
        showSection('results');
        Cache.currentResultsMode = "Class";
        let oClass = Cache.competition.classes.find(c => c.name === className);
        if (!oClass) return;
        Cache.currentClass = oClass;
        $("#crt_body").html(`<tr><td colspan="100%" style="text-align:center">${language.loading}...</td></tr>`);
        await renderClassResults(oClass);
        Cache.currentResultsInterval = setInterval(() => renderClassResults(Cache.currentClass), 15000);
    }

    export async function renderClassResults(oClass: LiveresultatAPI.Class, update = true) {
        $("#runner_club").text(language.runner_club);
        clearInterval(Cache.currentRunningInterval);
        $("#page_name").text(oClass.name);
        let tbody = $("#crt_body");
        if (update) {
            await oClass.updateResults();
        }
        tbody.html("");
        for (const runner of oClass.runners) {
            tbody.append(`<tr><td>${runner.place}</td><td>${runner.name}</td><td><a href="javascript:LLIResults.UI.showClubResults('${runner.club}');">${runner.club}</a></td><td>${runner.start.toLocaleTimeString()}</td><td class="result">${getResult(runner)}</td><td>${getLost(runner)
                }</td></tr>`)
        }
        last_now = new Date().getTime();
        Cache.currentRunningInterval = setInterval(updateTimes, 1000);
    }

    export async function showClubResults(clubName: string) {
        showSection('results');
        Cache.currentResultsMode = "Club";
        let club = new LiveresultatAPI.Club(clubName, Cache.competition.id);
        Cache.currentClub = club;
        $("#crt_body").html(`<tr><td colspan="100%" style="text-align:center">${language.loading}...</td></tr>`);
        await renderClubResults(club);
        Cache.currentResultsInterval = setInterval(() => renderClubResults(Cache.currentClub), 15000);
    }

    export async function renderClubResults(club: LiveresultatAPI.Club, update = true) {
        $("#runner_club").text(language.runner_cat);
        clearInterval(Cache.currentRunningInterval);
        $("#page_name").text(club.name);
        let tbody = $("#crt_body");
        if (update) {
            await club.updateResults();
        }
        tbody.html("");
        for (const runner of club.runners) {
            tbody.append(`<tr><td>${runner.place}</td><td>${runner.name}</td><td><a href="javascript:LLIResults.UI.showClassResults('${runner.oClass}');">${runner.oClass}</a></td><td>${runner.start.toLocaleTimeString()}</td><td class="result">${getResult(runner)}</td><td>${getLost(runner)
                }</td></tr>`)
        }
        last_now = new Date().getTime();
        Cache.currentRunningInterval = setInterval(updateTimes, 1000);
    }

    function getMsSinceMidnight(d: number) {
        var e = new Date(d);
        return d - e.setHours(0, 0, 0, 0);
    }

    function getResult(runner: LiveresultatAPI.Runner) {
        if (runner.status === 9) {
            if (runner.start.getTime() > new Date().getTime())
                return "";
            return `<i class="running">${formatTimeMinSec(new Date(new Date().getTime() - getMsSinceMidnight(runner.start.getTime())))}</i>`;
        } else if (runner.status !== 0)
            return "";
        else {
            if (isNaN(runner.result.getTime())) return "";
            return `${formatTimeMinSec(runner.result)}`;
        }
    }
    let last_now: number;

    function getLost(runner: LiveresultatAPI.Runner) {
        if (runner.status === 9) {
            if (runner.start.getTime() < new Date().getTime())
                return `<span class="update">${language.states[9]}</span>`;
            else
                return "";

        } else if (runner.status !== 0)
            return language.states[runner.status];
        else {
            if (isNaN(runner.timeplus.getTime())) return "";
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

    export function showSection(name: string) {
        clearInterval(Cache.currentResultsInterval);
        Cache.currentResultsInterval = undefined;
        $("#crt_body").html("");
        $(".section").hide();
        Cache.currentSection = name;
        $("#" + name).show();
    }

    export async function setLanguage(newLanguage: Language.Language) {
        language = newLanguage;
        await setupUI();
        showSection(Cache.currentSection);
        if (Cache.currentSection === "results") {
            if (Cache.currentResultsMode === "Class") {
                await renderClassResults(Cache.currentClass);
            } else {
                await renderClubResults(Cache.currentClub);
            }
        }
    }

    function formatTimeMinSec(time: Date) {
        return `${time.getHours() * 60 + time.getMinutes()}:${time.getSeconds().toString().padStart(2, "0")}`
    }
}