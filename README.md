# OResults

Open-source customizable Liveresultat client

## License

In `LICENSE`.

Modified MIT License. You must leave the "About" section on the web. It also must be unchanged.

## Customization

There are two main files, which are used to customize the web.

Data on this website is always up to date with the data on the Liveresultat official client (this web uses the same API, which is public and officially documented).

After customization **always rebuild** as shown in the `Building` section.

### `src/ts/Config.ts`

```typescript
namespace LLIResults.Config {
    export const COMP_ID = 26774; // competition id - get from liveresultat admin page
    export const LOGO_PATH = "img/logo.png" // logo path relative to index.html
}
```

### `src/style/Config.scss`

```scss
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;700&display=swap'); // import the font from Google Fonts (or anywhere else)
$font: "Rubik"; // the font name
$men-class-color: blue; // the men classes color in the class list (starting with "M" or "H")
$women-class-color: red; // the women classes color in the class list (starting with "W" or "D")
$open-class-color: green; // the open classes color in the class list (matching regex "P[0-9]*", "T[0-9]*", ".*open.*" (case insensitive) or is "HDR")
```

## Building

You must have these npm packages:

```plain
typescript (globally)
@types/jquery (in the project root directory)
sass (globally)
```

Then run these commands from the project root directory:

```plain
tsc
sass src/style:src/style --style compressed --no-source-map
```

You have built your customized version of OResults!

The needed files for distribution are:

```plain
src/
    index.html
    favicon.ico
    script/
        Cache.js
        Config.js
        Language.js
        LiveresultatAPI.js
        UI.js
    style/
        main.css
```

And whatever logo path you chose.

If you want your OResults to be public, you need to find a hosting.
