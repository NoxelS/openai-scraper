import { config } from 'dotenv';
import { createPool, Pool, PoolConfig } from 'mysql';
import { schedule } from 'node-cron';
import { PuppeteerLaunchOptions } from 'puppeteer';
import Puppeteer from 'puppeteer-extra';

import { query } from './storage';


/** Only use .env files when running in dev mode */
const isProduction = process.env.production?.toString() === 'true' || process.env.NODE_ENV === 'production';
if (!process.env.production) config();

/** Additional Puppeteer options and plugins */
const AnonymizeUAPlugin = require('puppeteer-extra-plugin-anonymize-ua'); // Add anonymize user agent plugin (changes user agent to a random one)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker'); // Add adblocker plugin to block all ads and trackers (saves bandwidth)
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha'); // Add recaptcha plugin (solves recaptchas automagically)
const StealthPlugin = require('puppeteer-extra-plugin-stealth'); // Add stealth plugin and use defaults (all tricks to hide puppeteer usage)

Puppeteer.use(RecaptchaPlugin({provider: {id: '2captcha',token: process.env.TWO_CAPTCHA_API_KEY }, visualFeedback: true }))
Puppeteer.use(AnonymizeUAPlugin({ makeWindows: true, stripHeadless: true }))
Puppeteer.use(AdblockerPlugin({ blockTrackers: true }));
Puppeteer.use(StealthPlugin());

/** Launch options */
const launchOptions: PuppeteerLaunchOptions  = {
    headless: isProduction, // Run headless in production mode
    args: [
        '--disable-gpu', '--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-sandbox',
        '--window-size=1920,1080', /* '--window-position=1920,0' */ // Activate this if you want to have the browser window on a second screen
    ],
    ignoreHTTPSErrors: true, // Ignore HTTPS errors
    devtools: !isProduction, // Open devtools in development mode
    slowMo: 0, // Slow down puppeteer operations by X milliseconds (useful for debugging)
    timeout: 0 // Disable timeouts
}


/** Url to scrape */
export const url = 'https://bot.sannysoft.com/'; // Example url to test the scraper's fingerprint

/** 
 *  @param pool - MySQL connection pool (could also be made global)
 *  @description  This is the main scraping function. It will be called by the scheduler.
 *                Make sure to garabage collect the browser instance if running on some
 *                complicated server structure. The Dockerfile for this project is a good
 *                example of how to do this.
 */ 
async function scrape(pool: Pool) {
    const browser = await Puppeteer.launch(launchOptions);
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
        // Do stuff ...
        throw new Error('Error while scraping...');
    } catch (error) {
        if (error instanceof Error) {
            /** Save a screenshot if possible */
            try { await page.screenshot({ path: `data/err-${new Date().getTime()}.png` }) } catch (error) { }
            console.error(error.message);
        }
    }

    await browser.close();
}

/** Create MySQL connection pool so we can reuse connections */
const pool: Pool = createPool(<PoolConfig>{
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

/* Test connection */
query('SHOW TABLES FROM data;', [], (e, r) => {console.log(e ? e : `You have the following tables: ${r[0]}`);}, pool);

/*
 * Scrape every 15 minutes if production mode is enabled or once
 * if not.
 * (https://crontab.guru is your best friend)
 */
const interval = isProduction ? '*/30 * * * *' : '* * * * *';
console.log(`Scraping ${isProduction ? 'every 30 minutes' : 'once'} in ${isProduction ? 'production' : 'dev'} mode.`);

if (isProduction) schedule(interval, () => scrape(pool));
else scrape(pool);