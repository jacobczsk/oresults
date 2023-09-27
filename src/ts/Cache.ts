namespace LLIResults.Cache {
    export let competition: LiveresultatAPI.Competition = new LiveresultatAPI.Competition();
    export let currentClass: LiveresultatAPI.Class = new LiveresultatAPI.Class("", 0);
    export let currentClub: LiveresultatAPI.Club = new LiveresultatAPI.Club("", 0);
    export let currentResultsInterval: number | undefined;
    export let currentSection: string = "class_select";
    export let currentRunningInterval: number | undefined;
    export let currentResultsMode: "Class" | "Club" = "Class";
}