# nuxt-isomorphic-fetch

Isomorphic access to server-side API in Nuxt.js `asyncData`, working uniformly in client-side and server-side environment.

Currently supported backends:

- client-side: `window.fetch`
- server-side: Koa middleware
- simple API to plug implementations for any other technology (Express, axios, etc.)

Current limitations:

* Supports JSON only (for both request and response data).

## Rationale

Each Nuxt.js page accepts [`asyncData`](https://nuxtjs.org/guide/async-data) callback, which is used to pull page data.

### Without nuxt-isomorphic-fetch

Normally, pulling server-side data in Nuxt.js pages will look more or less like this:

```vue
<template>
  <section>
    <div v-for="post in posts" :key="post.id">
      {{ post.title }}
    </div>
  </section>
</template>

<script>
import serverSideApi from '../server/api'

export default {
  async asyncData (context) {
    let posts
    if (context.isClient) {
      const res = window.fetch("/api/v1/posts")
      posts = await res.json()
    } else {
      posts = await serverSideApi.getPosts()
    }
    return {posts}
  }
}
```

Each API method will be put into its own function:

```js
export async function getPosts() {
  return await db.fetch('posts')
}
```

Then each API method will be called from the router:

```js
import api from './api'

router.get('/api/v1/posts', async ctx => {
  ctx.body = await api.getPosts()
})
```

### With nuxt-isomorphic-fetch

nuxt-isomorphic-fetch allows to reduce the boilerplate.

There is no more `if/else` for each API call in Vue components:

```vue
<template>
  <section>
    <div v-for="post in posts" :key="post.id">
      {{ post.title }}
    </div>
  </section>
</template>

<script>
import fetch from '../utils/fetch'

export default {
  async asyncData (context) {
    return {
      posts: await fetch.isomorphic(context, "posts")
    }
  }
}
```

There's no duplication of API methods and router rules:

```js
router.get('/posts', async ctx => {
  ctx.body = await db.fetch('posts')
})
```

## Installation

```bash
npm install nuxt-isomorphic-fetch
```

## Usage

Configure `fetch` once in your app (e.g. in `utils/fetch.js`):

```js
import * as fetchers from 'nuxt-isomorphic-fetch'

// use any Koa middleware
import routerMiddleware from '../server/router'

// provide polyfill for window.fetch
import 'whatwg-fetch'

const prefix = '/api/v1/'

export default fetchers.nuxt({
  client: fetchers.fetch({
    prefix,
    opts: {
      credentials: 'same-origin', // Send cookies
    },
  }),
  server: fetchers.koa({
    middleware: router.middleware(),
    prefix,
  })
})
```

Use `fetch.isomorphic` in `asyncData` component callbacks:

```js
export default {
  async asyncData (context) {
    return {
      posts: await fetch.isomorphic(context, "posts")
    }
  }
}
```

In pure-client cases (e.g. in submit handlers, store actions), just call `fetch`:

```js
const res = await fetch("login", {username, password})
```
