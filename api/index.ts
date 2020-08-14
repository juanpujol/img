import { NowRequest, NowResponse } from '@vercel/node'
import sharp from 'sharp';
import * as fetch from 'node-fetch';
import { validateImgUrl, validateOrigins, controlCacheHeader } from './utils';

export default async (req: NowRequest, res: NowResponse) => {
  const { img, r, w, h, fit, pos, bg, withoutEnlargement, format, q } = req.query

  /**
   * Return error if the `img` param is not preset.
   */
  validateImgUrl(img, res);

  /**
   * Return error if invalid origins are used on the request.
   */
  validateOrigins(img, res);

  /**
   * Normalize background. Used in resize and rotate.
   */
  const background = bg ? `#${ bg }` : '#00000000'

  try {
    const fetchResponse = await fetch(img)
    const buffer = await fetchResponse.buffer()

    /**
     * This instance of sharp will change based on the
     * available params coming with the request.
     */
    let sharpResponse = sharp(buffer)

    /**
     * If `w` or `h` params are present, then run the resize
     * operation using other optional parameters.
     */
    if (w || h) sharpResponse = sharpResponse.resize(
      Number(w) || undefined,
      Number(h) || undefined,
      {
        fit: fit || 'cover',
        position: pos ? String(pos).replace(',', ' ') : 'center',
        background,
        withoutEnlargement: Boolean(withoutEnlargement),
      }
    );

    /**
     * If `r` param is present, then run the rotate operations.
     */
    if (r) sharpResponse = sharpResponse.rotate(Number(r) || 0, { background })

    /**
     * If `format` param is present, then convert to format
     * before Buffer. Also, apply `q` as quality if available.
     */
    if (format) {
      sharpResponse = await sharpResponse
        .toFormat(format, { quality: Number(q) || 80 })
        .toBuffer({resolveWithObject: true});
    } else {
      sharpResponse = await sharpResponse.toBuffer({ resolveWithObject: true });
    }

    const {data, info} = sharpResponse;

    res.setHeader('Content-Type', `image/${ info.format }`)
    res.setHeader('Cache-Control', controlCacheHeader)

    res.send(data)
  } catch (error) {
    throw new Error(error);
  }
}