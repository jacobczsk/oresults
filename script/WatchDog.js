"use strict";
var OResults;
(function (OResults) {
    var WatchDog;
    (function (WatchDog_1) {
        class WatchDog {
            _interval;
            _watchedClasses = [];
            _watchedClubs = [];
            _watchedRunners = [];
            async start() {
                if (await Notification.requestPermission() === "granted") {
                }
                else {
                    OResults.UI.showAlert(OResults.UI.language.watchDogAlert);
                }
            }
            get watchedClasses() {
                return this._watchedClasses;
            }
            get watchedClubs() {
                return this._watchedClubs;
            }
            get watchedRunners() {
                return this._watchedRunners;
            }
            addWatchedClass(oClass) {
                this._watchedClasses.push(oClass);
            }
            addWatchedClub(club) {
                this._watchedClubs.push(club);
            }
            addWatchedRunner(runner) {
                this._watchedRunners.push(runner);
            }
            get started() {
                return this._interval !== undefined;
            }
        }
        WatchDog_1.WatchDog = WatchDog;
    })(WatchDog = OResults.WatchDog || (OResults.WatchDog = {}));
})(OResults || (OResults = {}));
