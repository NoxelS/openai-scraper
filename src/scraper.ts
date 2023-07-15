import { config } from 'dotenv';
import { createPool, Pool, PoolConfig } from 'mysql';
import { schedule } from 'node-cron';
import Puppeteer, { launch, LaunchOptions } from 'puppeteer';


/** Only use .env files when running in dev mode */
if (!process.env.produtction) config();

export const url = '';

/** 
 *  @param pool - MySQL connection pool (could also be made global)
 *  @description  This is the main scraping function. It will be called by the scheduler.
 *                Make sure to garabage collect the browser instance if running on some
 *                complicated server structure. The Dockerfile for this project is a good
 *                example of how to do this.
 */ 
async function scrape(pool: Pool) {
    const browser = await Puppeteer.launch(<LaunchOptions>{
        headless: true,
        args: ['--no-sandbox', '--disable-gpu'],
        timeout: 0
    });

    const page = await browser.newPage();
    await page.goto(url);

    /** Examples */

    const documentItems: unknown[] = await page.evaluate(() => {
        /** Do stuff with document and retrive some HTMLElements */
        return [];
    });

    /** 
     *  You could take screenshots when facing a document error. 
     *  This is especially usefull if you scrape a lot of pages and 
     *  debugging is hard. 
     */
    try {
        // Do stuff
    } catch (error) {
        if (error instanceof Error) {
            /** Save a screenshot if possible */
            try { await page.screenshot({ path: `log/err-${new Date().getTime()}.png` }) } catch (error) {}
            console.error(error.message);
        }
    }

    await browser.close();
}

const pool: Pool = createPool(<PoolConfig>{
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT
});

// Scrape every 15 minutes if production mode is enabled (https://crontab.guru is your best friend)
const interval = process.env.production ? '*/30 * * * *' : '* * * * *';
console.log(`Scraping every ${process.env.production ? '15 minutes' : 'minute'}.`);

if (!process.env.production) scrape(pool);
schedule(interval, () => scrape(pool));
