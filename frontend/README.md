# NextJS

## Routing

### Defining routes

`pages` folder helps routing

`nested routes` can be achieved by creating folders and files

`dynamic routes / nested dynamic routes` can be created by surrounding folder and file names with `[name]`

`catch all` route is created by surrounding folder or file names with `[...name]`

`useRouter()` hook from `next/router` helps getting parameters passed in dynamic routes

```js
import { useRouter } from "next/router";
const router = useRouter();
const { id } = router.query;
```

### Navigating routes

**Navigating through link:** `<Link>` tag us used to navigate through pages without reloading website, `href` and `replace` props are mostly used, `replace` tag replaces the last value in history stack of browser with this path. It must contain an `<a>here</a>` tag with no value for `href`.

**Navigating programatically:** `router.push('path')` is used to navigate through functions or code. `router.replace('path')`. It replaces the last value in history stack with this path.

### Handling `page not found`

By default nextjs has a default behaviour for unknown routes

`404.js` file in `pages` folder creates a custom page for unknown routes

## Pre-rendering

`reactjs` sends empty `html` and a `javascript` file to populate the `html`, while `nextjs` directly sends a pre-built `html` page to the browser. This is called **Pre-rendering**

1. This helps in improving performance
2. This helps in improving SEO

### Static generation

`next build` will generate the static pages during build, the same pages are reused for each user. When the pages need to request some data from api we use `getStaticProps()`

#### getStaticProps()

Along with component, we can also export certain functions like an `async funcition getStaticProps()` from a component file. This function is intended to fetch the required data from an api and `return { props: { fetchedData } }`. Value for props can be anything, here it is the data fetched from an api. During `next build` the data is fetched and passed as `props` to the component which is returning `getStaticProps()` function. Here the data can be used as required.

This function should `return an object` and `object` should contain `props` key. Value of `props` can be anything.

This functions always runs on server side, it is not event included in the javascript bundle sent to the browser.

We can also directly write `server-side` code in this function, we can use `fs` like modules to access the file system.

As this function is not sent to the browser, you don't need to worry about using `API keys` in this function.

**What if we need parameters passed to dynamic page? In component we get it through useRounter(), but we cant use it in `getStaticProps()`.**
In `getStaticProps()` an object `context` is passed, which contains key `params` containing the parameters passed with the page. We also need to use a `getStaticPaths()` function to let `getStaticProps()` / `nextjs` know the possible values of `context.params.<parameter>`.

#### getStaticPaths()

This function is also exported just like `getStaticProps()`, it let's `nextjs` konw the possible values of parameters passed to page. It must return

```js
// paths array should be dynamically generated if required
return {
  paths: [
    {
      params: { postId: "1" },
    },
    {
      params: { postId: "2" },
    },
    {
      params: { postId: "3" },
    },
    .
    .
    .
    .
    .
  ],
  fallback: false,
};
```

- `fallback: false` - HTML pages for `paths` returned from `getStaticPaths()` are built at build time. `404 page` is rendered for any other path.

- `fallback: true`

  - HTML pages for specified paths are built at build time, just like `fallback: false`.
  - Visiting other paths will result into rendering of `fallback` page, specified inside component using `useRouter`.
    ```js
    if (router.isFallback) {
      return <h1>Loading...</h1>;
    }
    ```
  - Nextjs will generate HTML and JSON for requested path.
  - When that's done, the browser receives the JSON for the generated path. This will automatically render the page with required props. From user's perspective it will be swapped from fallback page to full page.
  - At the same time, Nextjs will keep track of new list of pre-rendered pages and subsequent requests will directly generate the HTML and JSON, witout rendering the fallback page.

- `fallback: 'blocking'` - Same as `fallback: true`, only difference is that the fallback page is not rendered instead UI is blocked until the required HTML and JSON is generated. This shows a spinning circle in title, until the page is rendered on the server, after rendering on server is done it is sent to the browser.

#### Incremental Static Rengeneration

It simply refers to the concept for regenerating the `html` pages after some duration to reflect the changes in fetched data. It can be done by specifying `revalidate: <seconds>` key-value in `object` returned by `getStaticProps()`. Return value of `getStaticProps()` looks like this -

```js
return {
  props: { fetchedData },
  revalidate: 30, // 30 seconds
};
```

Whenever request is received, if `revalidate` time has elapsed, page is regenerated. But the request that triggers revalidation still receives the old html. Subsequent requests receives the updated html page.

#### Understanding output of `npm build`

[Video1](https://youtu.be/AWbYJgsXHQ4)
[Video2](https://youtu.be/QcUU89xKu70)

## Styling in NextJS

## Miscellaneous
