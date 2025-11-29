import Groq from 'groq-sdk';
import { WeatherType } from 'src/types/weather';

import * as dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function main(weatherData: WeatherType) {
  const weatherSummarization = await getWeatherSummarization(weatherData);
  return weatherSummarization.choices[0]?.message?.content || '';
}

export async function getWeatherSummarization(weatherData: WeatherType) {
  return groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful AI model that returns a summarization (in a text paragraph) of a weather data json that has the current weather, the weather for the next 8 day and the given location.',
      },

      {
        role: 'user',
        // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
        content: `Return a paragraph based on this data: ${weatherData}. What I want you to do in the first sentence in the paragraph is to look at the 'current' property, explaining how the current weather is, with the 'temp' prop being the current temperature and the 'feels like' property being the thermic sensation. They are in celsius degrees, and you can also talk birefly about current description status. For the daily prop, which is an array, I want you to evaluate all the elements of the array, and max temperature mean and the min temperature main, to tell the user which is the mean max tem and the mean min temp for the next 8 days. Use the summary of each array item to evaluate the weather status for the week and judge accordingly, returning your evaluation about tht property in the paragraph as well. You don't need to return the temp, means and feels like values in decimal number, please return them as integers. Also, you don't need to start the phrase with "Here is a paragraph...", just go straight to the point, please.`,
      },
    ],
    model: 'llama-3.1-8b-instant',
  });
}
