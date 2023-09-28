namespace OResults.LiveresultatAPI {
    const BASE_URL = "https://liveresultat.orientering.se/api.php";
    export class Competition {
        private _lastClassesHash: string = "";
        private _name: string = "";
        private _organizer: string = "";
        private _date: number = Date.now();
        private _public: boolean = false;
        private _id: number = 0;
        private _classes: Class[] = [];
        static async initialize(comp_id: number) {
            let comp: Competition;
            if (Cache.competition.id !== comp_id) {
                let compData = await getJSON(`${BASE_URL}?method=getcompetitioninfo&comp=${comp_id}`) as Responses.IGetCompetitionInfoResponse;
                if (compData.id === undefined || compData.name === undefined || compData.organizer === undefined || compData.date === undefined || compData.isPublic === undefined) {
                    throw new CompetitionNotFoundError("Competition with this ID not found!");
                }
                comp = new Competition();
                comp._id = compData.id;
                comp._name = compData.name;
                comp._organizer = compData.organizer;
                comp._date = Date.parse(compData.date);
                comp._public = compData.isPublic;
                Cache.competition = comp;
            } else {
                comp = Cache.competition;
            }
            return comp;
        }

        async updateClasses() {
            let classData = await getJSON(`${BASE_URL}?method=getclasses&comp=${this._id}&last_hash=${this._lastClassesHash}`) as Responses.IGetClassesResponse;
            if (classData.status === "OK") {
                this._lastClassesHash = classData.hash;
                this._classes = classData.classes.map((obj) => new Class(obj.className, this._id));
            }
        }

        get name() { return this._name };
        get organizer() { return this._organizer };
        get date() { return this._date; };
        get public() { return this._public; };
        get id() { return this._id };
        get classes() { return this._classes; };
    }

    export class Class {
        private _name: string;
        private _compID: number;
        private _runners: Runner[] = [];
        private _lastResultsHash: string = "";

        constructor(name: string, compID: number) {
            this._name = name;
            this._compID = compID;
        }

        async updateResults() {
            let results = await getJSON(`${BASE_URL}?method=getclassresults&unformattedTimes=true&comp=${this._compID}&last_hash=${this._lastResultsHash}&class=${this._name}`) as Responses.IGetClassResultsResponse;
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

    export class Club {
        private _name: string;
        private _compID: number;
        private _runners: Runner[] = [];
        private _lastResultsHash: string = "";

        constructor(name: string, compID: number) {
            this._name = name;
            this._compID = compID;
        }

        async updateResults() {
            let results = await getJSON(`${BASE_URL}?method=getclubresults&unformattedTimes=true&comp=${this._compID}&last_hash=${this._lastResultsHash}&club=${this._name}`) as Responses.IGetClubResultsResponse;
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

    export class Runner {
        private _place: string;
        private _placeNum: number;
        private _class: string;
        private _name: string;
        private _club: string;
        private _result: Date;
        private _status: number;
        private _timeplus: Date;
        private _progress: number;
        private _start: Date;

        constructor(place: string, index: number, oClass: string, name: string, club: string, result: number, status: number, timeplus: number, progress: number, start: number) {
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

    class CompetitionNotFoundError extends Error {

    }

    async function getJSON(url: string) {
        return await (await fetch(url, {
            headers: {
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Accept-Language': 'cs,sk;q=0.8,en-US;q=0.5,en;q=0.3',
            }
        })).json();
    }

    export function convertTime(time: number) {
        return new Date(new Date().setHours(0, 0, time / 100));
    }

    namespace Responses {
        export interface IGetCompetitionInfoResponse {
            id?: number;
            name?: string;
            organizer?: string;
            date?: string;
            isPublic?: boolean;
        }

        export interface IGetClassesResponse {
            status: string;
            classes: { className: string }[];
            hash: string;
        }

        export interface IGetClassResultsResponse {
            status: string;
            className: string;
            splitcontrols: any[];
            results: { place: string, name: string, club: string, result: string, status: number, timeplus: string, progress: number, start: number }[];
            hash: string;
        }

        export interface IGetClubResultsResponse {
            status: string;
            className: string;
            splitcontrols: any[];
            results: { place: string, name: string, class: string, result: string, status: number, timeplus: string, progress: number, start: number }[];
            hash: string;
        }
    }
}