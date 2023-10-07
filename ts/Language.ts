namespace OResults.Language {
    export abstract class Language {
        public abstract readonly live_results: string;
        public abstract readonly title: string;
        public abstract readonly select_class: string;
        public abstract readonly about_link: string;
        public abstract readonly about_html: string;
        public abstract readonly back: string;
        public abstract readonly runner_name: string;
        public abstract readonly runner_club: string;
        public abstract readonly runner_cat: string;
        public abstract readonly runner_start: string;
        public abstract readonly runner_result: string;
        public abstract readonly runner_plus: string;
        public abstract readonly loading: string;
        public abstract readonly states: string[];
        public abstract readonly font: string;
        public abstract readonly watchDogAlert: string;
        public abstract readonly follow: string;
    }

    export class Czech implements Language {
        public readonly live_results = "Živé výsledky";
        public readonly title = "OB výsledky";
        public readonly select_class = "Vyber kategorii";
        public readonly about_link = "O webu";
        public readonly about_html = `Data jsou z <a href="https://liveresultat.orientering.se">Liveresultat</a><br>Tento web je založený na <a href="https://github.com/jacobczsk/oresults">OResults</a>.`;
        public readonly back = "Zpět";
        public readonly runner_name = "Jméno";
        public readonly runner_club = "Klub";
        public readonly runner_cat = "Kategorie";
        public readonly loading = "Načítání";
        public readonly runner_start = "Start";
        public readonly runner_result = "Cíl";
        public readonly runner_plus = "Ztráta";
        public readonly states = ["OK", "DNS", "DNF", "DISK (MP)", "DISK", "PL", "Nestartoval", "Nestartoval", "", "Na trati"];
        public readonly font = "Použité písmo: ";
        public readonly watchDogAlert = "Povolte, prosím, oznámení.";
        public readonly follow = "Sledovat";
    }

    export class English implements Language {
        public readonly live_results = "Live results";
        public readonly title = "O results";
        public readonly select_class = "Select a class";
        public readonly about_link = "About";
        public readonly about_html = `Data is from <a href="https://liveresultat.orientering.se">Liveresultat</a><br>This web is based on <a href="https://github.com/jacobczsk/oresults">OResults</a>.`;
        public readonly back = "Back";
        public readonly runner_name = "Name";
        public readonly runner_club = "Club";
        public readonly runner_cat = "Class";
        public readonly loading = "Loading";
        public readonly runner_start = "Start";
        public readonly runner_result = "Finish";
        public readonly runner_plus = "Lost";
        public readonly states = ["OK", "DNS", "DNF", "MP", "DSQ", "OVT", "Not started yet", "Not started yet", "", "Running"];
        public readonly font = "Used font: ";
        public readonly watchDogAlert = "Please enable notifications.";
        public readonly follow = "Follow";
    }
}