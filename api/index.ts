import { NowRequest, NowResponse } from '@vercel/node'
import sharp from 'sharp';
import * as fetch from 'node-fetch';

export default async (req: NowRequest, res: NowResponse) => {
  const {img, r, w} = req.query;

  if (!img) return res.status(400).json({error: 'img url missing'})

  try {
    const fetchResponse = await fetch(img)
    const buffer = await fetchResponse.buffer()

    let sharpResponse = sharp(buffer)

    if (r) sharpResponse = sharpResponse.rotate(Number(r) || 0, {background: '#00000000'})
    if (w) sharpResponse = sharpResponse.resize({width: Number(w)});

    sharpResponse = await sharpResponse.png().toBuffer()

    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')

    res.send(sharpResponse)
  } catch (error) {
    throw new Error(error);
  }
}