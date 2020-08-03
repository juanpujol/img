import { NowRequest, NowResponse } from '@vercel/node'
import sharp from 'sharp';
import * as fetch from 'node-fetch';

export default async (req: NowRequest, res: NowResponse) => {
  const {img, r} = req.query;

  try {
    const fetchResponse = await fetch(img);
    const buffer = await fetchResponse.buffer();

    const sharpResponse = await sharp(buffer)
      .rotate(Number(r) || 0, {background: '#00000000'})
      .png()
      .toBuffer()

    res.setHeader('Content-Type', 'image/png')
    res.send(sharpResponse)
  } catch (error) {
    throw new Error(error);
  }
}