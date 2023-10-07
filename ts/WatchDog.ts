namespace OResults.WatchDog {
    export class WatchDog {
        private _interval: number | undefined;
        private _watchedClasses: LiveresultatAPI.Class[] = [];
        private _watchedClubs: LiveresultatAPI.Runner[] = [];
        private _watchedRunners: LiveresultatAPI.Runner[] = [];

        public async start() {
            if (await Notification.requestPermission() === "granted") {

            } else {
                UI.showAlert(UI.language.watchDogAlert);
            }
        }

        public get watchedClasses(): LiveresultatAPI.Class[] {
            return this._watchedClasses;
        }

        public get watchedClubs(): LiveresultatAPI.Runner[] {
            return this._watchedClubs;
        }

        public get watchedRunners(): LiveresultatAPI.Runner[] {
            return this._watchedRunners;
        }

        public addWatchedClass(oClass: LiveresultatAPI.Class): void {
            this._watchedClasses.push(oClass);
        }

        public addWatchedClub(club: LiveresultatAPI.Runner): void {
            this._watchedClubs.push(club);
        }

        public addWatchedRunner(runner: LiveresultatAPI.Runner): void {
            this._watchedRunners.push(runner);
        }

        public get started(): boolean {
            return this._interval !== undefined;
        }
    }
}
