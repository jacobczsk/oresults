"use strict";
var OResults;
(function (OResults) {
    var LiveresultatAPI;
    (function (LiveresultatAPI) {
        const BASE_URL = "https://liveresultat.orientering.se/api.php";
        class Competition {
            _lastClassesHash = "";
            _name = "";
            _organizer = "";
            _date = new Date();
            _public = false;
            _id = 0;
            _classes = [];
            static async initialize(comp_id) {
                let comp;
                if (OResults.Cache.competition.id !== comp_id) {
                    let compData = await getJSON(`${BASE_URL}?method=getcompetitioninfo&comp=${comp_id}`);
                    if (compData.id === undefined || compData.name === undefined || compData.organizer === undefined || compData.date === undefined || compData.isPublic === undefined) {
                        throw new CompetitionNotFoundError("Competition with this ID not found!");
                    }
                    comp = new Competition();
                    comp._id = compData.id;
                    comp._name = compData.name;
                    comp._organizer = compData.organizer;
                    comp._date = new Date(Date.parse(compData.date));
                    comp._public = compData.isPublic;
                    OResults.Cache.competition = comp;
                }
                else {
                    comp = OResults.Cache.competition;
                }
                return comp;
            }
            async updateClasses() {
                let classData = await getJSON(`${BASE_URL}?method=getclasses&comp=${this._id}&last_hash=${this._lastClassesHash}`);
                if (classData.status === "OK") {
                    this._lastClassesHash = classData.hash;
                    this._classes = classData.classes.map((obj) => new Class(obj.className, this._id));
                }
            }
            get name() { return this._name; }
            ;
            get organizer() { return this._organizer; }
            ;
            get date() { return this._date; }
            ;
            get public() { return this._public; }
            ;
            get id() { return this._id; }
            ;
            get classes() { return this._classes; }
            ;
        }
        LiveresultatAPI.Competition = Competition;
        class Class {
            _name;
            _compID;
            _runners = [];
            _lastResultsHash = "";
            constructor(name, compID) {
                this._name = name;
                this._compID = compID;
            }
            async updateResults() {
                let results = await getJSON(`${BASE_URL}?method=getclassresults&unformattedTimes=true&comp=${this._compID}&last_hash=${this._lastResultsHash}&class=${this._name}`);
                if (results.status === "OK") {
                    this._lastResultsHash = results.hash;
                    let idx = 0;
                    this._runners = results.results.map(runner => {
                        idx++;
                        return new Runner(runner.place, idx, this._name, runner.name, runner.club, parseInt(runner.result), runner.status, parseInt(runner.timeplus), runner.progress, runner.start);
                    });
                }
            }
            get name() { return this._name; }
            get compID() { return this._compID; }
            get runners() { return this._runners; }
        }
        LiveresultatAPI.Class = Class;
        class Club {
            _name;
            _compID;
            _runners = [];
            _lastResultsHash = "";
            constructor(name, compID) {
                this._name = name;
                this._compID = compID;
            }
            async updateResults() {
                let results = await getJSON(`${BASE_URL}?method=getclubresults&unformattedTimes=true&comp=${this._compID}&last_hash=${this._lastResultsHash}&club=${this._name}`);
                if (results.status === "OK") {
                    this._lastResultsHash = results.hash;
                    let idx = 0;
                    this._runners = results.results.map(runner => {
                        idx++;
                        return new Runner(runner.place, idx, runner.class, runner.name, this._name, parseInt(runner.result), runner.status, parseInt(runner.timeplus), runner.progress, runner.start);
                    });
                }
            }
            get name() { return this._name; }
            get compID() { return this._compID; }
            get runners() { return this._runners; }
        }
        LiveresultatAPI.Club = Club;
        class Runner {
            _place;
            _placeNum;
            _class;
            _name;
            _club;
            _result;
            _status;
            _timeplus;
            _progress;
            _start;
            constructor(place, index, oClass, name, club, result, status, timeplus, progress, start) {
                this._place = place;
                this._placeNum = index;
                this._class = oClass;
                this._name = name;
                this._club = club;
                this._result = convertTime(result);
                this._status = status;
                this._timeplus = convertTime(timeplus);
                this._progress = progress;
                this._start = convertTime(start);
            }
            get place() { return this._place; }
            get placeNum() { return this._placeNum; }
            get oClass() { return this._class; }
            get name() { return this._name; }
            get club() { return this._club; }
            get result() { return this._result; }
            get status() { return this._status; }
            get timeplus() { return this._timeplus; }
            get progress() { return this._progress; }
            get start() { return this._start; }
        }
        LiveresultatAPI.Runner = Runner;
        class CompetitionNotFoundError extends Error {
        }
        async function getJSON(url) {
            return await (await fetch(url, {
                headers: {
                    'Accept': 'application/json, text/javascript, */*; q=0.01',
                    'Accept-Language': 'cs,sk;q=0.8,en-US;q=0.5,en;q=0.3',
                }
            })).json();
        }
        function convertTime(time) {
            return new Date(new Date().setHours(0, 0, time / 100));
        }
        LiveresultatAPI.convertTime = convertTime;
    })(LiveresultatAPI = OResults.LiveresultatAPI || (OResults.LiveresultatAPI = {}));
})(OResults || (OResults = {}));
