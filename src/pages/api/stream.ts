import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { prompt } = req.body;
    const payload = {
      model: 'text-davinci-003',
      prompt,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 1,
      stream: true,
      n: 1,
    };

    return res.json({ payload });
  } catch (err) {
    console.log(err);
  }
}
