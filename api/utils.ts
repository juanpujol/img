import { NowRequest, NowResponse } from '@vercel/node'

const { ALLOWED_ORIGINS, CONTROL_CACHE_HEADER } = process.env;

/**
 * Default response in case the /api/utils url is requested.
 */
export default async (_: NowRequest, res: NowResponse) => res.status(404).json({ code: 404, error: 'Not Found' })

/**
 * @param url Request origin URL
 * @param res Response object
 * Return error if the img url param is not preset.
 */
export const validateImgUrl = (url, res) => {
  if (!url) return res.status(400).json({ code: 400, error: 'The `img` query param with the url is missing.' })
}

/**
 * @param url Request origin URL
 * @param res Response object
 * If allowed origins array, verify if the request is valid.
 */
export const validateOrigins = (url, res) => {
  const allowedOrigins = ALLOWED_ORIGINS && ALLOWED_ORIGINS.split(',').map((i) => i.replace(/\s/g,''))

  let originAllowed = allowedOrigins ? false : true;

  if (!originAllowed) {
    allowedOrigins.forEach((allowedOrigin) => {
      if (url.includes(allowedOrigin)) originAllowed = true;
    })

    if (!originAllowed) return res.status(400).json({ code: 400, error: 'Origin url not allowed.' })
  }
}

/**
 * Extract control cache header from settings or set default.
 */
export const controlCacheHeader = CONTROL_CACHE_HEADER || 'max-age=2592000, s-maxage=21600, stale-while-revalidate=86400, public';