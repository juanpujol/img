import { NowRequest, NowResponse } from '@vercel/node'
import sharp from 'sharp';
import * as fetch from 'node-fetch';

export default async (req: NowRequest, res: NowResponse) => {
  const {img, r, w, h, fit, pos, bg, withoutEnlargement, format, q} = req.query

  if (!img) return res.status(400).json({code: 400, error: 'img param with url missing.'})

  /**
   * Normalize params
   */
  const background = bg ? `#${bg}` : '#00000000'
  const position = pos ? String(pos).replace(',', ' ') : 'center'

  try {
    const fetchResponse = await fetch(img)
    const buffer = await fetchResponse.buffer()

    let sharpResponse = sharp(buffer)

    if (w || h) sharpResponse = sharpResponse.resize(
      Number(w) || undefined,
      Number(h) || undefined,
      {
        fit: fit || 'cover',
        position,
        background,
        withoutEnlargement: Boolean(withoutEnlargement),
      }
    );

    if (r) sharpResponse = sharpResponse.rotate(Number(r) || 0, { background })

    if (format) {
      sharpResponse = await sharpResponse
        .toFormat(format, {quality: Number(q) || 80})
        .toBuffer({resolveWithObject: true});
    } else {
      sharpResponse = await sharpResponse.toBuffer({resolveWithObject: true});
    }

    const {data, info} = sharpResponse;

    res.setHeader('Content-Type', `image/${info.format}`)
    res.setHeader('Cache-Control', 'max-age=2592000, s-maxage=21600, stale-while-revalidate=86400, public')

    res.send(data)
  } catch (error) {
    throw new Error(error);
  }
}