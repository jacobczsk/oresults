"use strict";
var LLIResults;
(function (LLIResults) {
    var Language;
    (function (Language_1) {
        class Language {
        }
        Language_1.Language = Language;
        class Czech {
            live_results = "Živé výsledky";
            title = "OB výsledky";
            select_class = "Vyber kategorii";
            about_link = "O webu";
            about_html = `Data jsou z <a href="https://liveresultat.orientering.se">Liveresultat</a><br>Tento web je založený na <a href="https://github.com/jacobczsk/oresults">OResults</a>.`;
            back = "Zpět";
            runner_name = "Jméno";
            runner_club = "Klub";
            runner_cat = "Kategorie";
            loading = "Načítání";
            runner_start = "Start";
            runner_result = "Cíl";
            runner_plus = "Ztráta";
            states = ["OK", "DNS", "DNF", "DISK (MP)", "DISK", "PL", "Nestartoval", "Nestartoval", "", "Na trati"];
            font = "Použité písmo: ";
        }
        Language_1.Czech = Czech;
        class English {
            live_results = "Live results";
            title = "O results";
            select_class = "Select a class";
            about_link = "About";
            about_html = `Data is from <a href="https://liveresultat.orientering.se">Liveresultat</a><br>This web is based on <a href="https://github.com/jacobczsk/oresults">OResults</a>.`;
            back = "Back";
            runner_name = "Name";
            runner_club = "Club";
            runner_cat = "Class";
            loading = "Loading";
            runner_start = "Start";
            runner_result = "Finish";
            runner_plus = "Lost";
            states = ["OK", "DNS", "DNF", "MP", "DSQ", "OVT", "Not started yet", "Not started yet", "", "Running"];
            font = "Used font: ";
        }
        Language_1.English = English;
    })(Language = LLIResults.Language || (LLIResults.Language = {}));
})(LLIResults || (LLIResults = {}));
