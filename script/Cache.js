"use strict";
var LLIResults;
(function (LLIResults) {
    var Cache;
    (function (Cache) {
        Cache.competition = new LLIResults.LiveresultatAPI.Competition();
        Cache.currentClass = new LLIResults.LiveresultatAPI.Class("", 0);
        Cache.currentClub = new LLIResults.LiveresultatAPI.Club("", 0);
        Cache.currentSection = "class_select";
        Cache.currentResultsMode = "Class";
    })(Cache = LLIResults.Cache || (LLIResults.Cache = {}));
})(LLIResults || (LLIResults = {}));
