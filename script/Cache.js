"use strict";
var OResults;
(function (OResults) {
    var Cache;
    (function (Cache) {
        Cache.competition = new OResults.LiveresultatAPI.Competition();
        Cache.currentClass = new OResults.LiveresultatAPI.Class("", 0);
        Cache.currentClub = new OResults.LiveresultatAPI.Club("", 0);
        Cache.currentSection = "class_select";
        Cache.currentResultsMode = "Class";
    })(Cache = OResults.Cache || (OResults.Cache = {}));
})(OResults || (OResults = {}));
