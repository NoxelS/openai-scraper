import { Configuration, OpenAIApi } from 'openai';


/** Openai */
export const openaiConfiguration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
export const openai = new OpenAIApi(openaiConfiguration);

