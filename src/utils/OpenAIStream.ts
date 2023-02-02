import {
  createParser,
  ParseEvent,
  ReconnectInterval,
} from 'eventsource-parser';

export async function OpenAIStream() {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let counter = 0;

  const res = await fetch('https://api.openai.com/v1/completions', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer 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`,
    },
    method: 'POST',
    body: JSON.stringify({}),
  });

  const stream = new ReadableStream({
    async start(controller) {
      function onParse(event: ParseEvent | ReconnectInterval) {
        if (event.type === 'event') {
          const data = event.data;
          if (data === '[DONE]') {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = '';
            if (counter < 2 && (text.match(/\n/) || []).length) {
              // this is a prefix character (i.e., "\n\n"), do nothing
              return;
            }
            const queue = encoder.encode(text);
            controller.enqueue(queue);
            counter++;
          } catch (err) {
            console.log(err);
          }
        }
      }
      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });
}
