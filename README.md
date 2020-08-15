# IMG

An API that transforms and proxies images using Nodejs.

A work in progress  🚧, with the objective to create a query string map to the features in the [Sharp](https://github.com/lovell/sharp) library. Essentially being a dead-simple way to deploy your own [Cloudinary](https://cloudinary.com/) or [CloudImage](https://www.cloudimage.io/)

I think those services are amazing! But some times you just need a simple and free solution you can host on your Vercel account. So this is my proposal for that.

This works very well in the fast and easy deploy process from [Vercel](https://vercel.com).

## Deploy with Vercel

This requires a free account on https://vercel.com/

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/git?s=https%3A%2F%2Fgithub.com%2Fjuanpujol%2Fipw&project-name=ipw&repository-name=ipw)

> _*No environment variables required you can add them optionally as settings later._

## How to Use

Once you deploy your own instance of IMG, now you can start using the API. Let's see what is supported first:

- Resize
- Rotation
- File Format
- Quality

> _The Sharp lib has A LOT of operations to do on an image, I mean just look at this [list](https://sharp.pixelplumbing.com/api-operation), so mapping all of that to query params will take a while unless you want to help 😉._

### Resize
> TODO 🚧

### Rotate
This one's very easy, just use the param `r={degress}`, you can also change the background color, by default it's transparent.

### File Format
> TODO 🚧

### Quality
> TODO 🚧

Try it
https://img.qtal.pro/api?img=https://images.unsplash.com/photo-1542665174-31db64d7e0e4&w=882&q=80&r=30&bg=FFFF00FF

### Optional Settings

These are enabled through environment variables and are very useful.

- `ALLOWED_ORIGINS` - A comma-separated list of domains you want to allow to use the API. You DO NOT want to let this open for any origin domain.
- `CONTROL_CACHE_HEADER` - A custom Cache Control Header, if you want to change the default that's `max-age=2592000, s-maxage=21600, stale-while-revalidate=86400, public`

These env vars are always encrypted in the Vercel platform, so you may want to take note of what you have there in case you forget.