import { config } from 'dotenv';
import { encode } from 'gpt-3-encoder';
import { Configuration, OpenAIApi } from 'openai';


/** Only use .env files when running in dev mode */
if (!process.env.produtction) config();

/** Openai */
export const openaiConfiguration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
export const openai = new OpenAIApi(openaiConfiguration);

/** Utility to manage tokens */
export const countTokens = (text: string | string[]) => {
    if (Array.isArray(text)) return encode(text.join(' ')).length;
    return encode(text).length;
};
