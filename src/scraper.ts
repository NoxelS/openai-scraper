import { config } from 'dotenv';
import { createPool, Pool, PoolConfig } from 'mysql';
import { schedule } from 'node-cron';
import Puppeteer, { launch, LaunchOptions } from 'puppeteer';


/** Only use .env files when running in dev mode */
if (!process.env.produtction) config();

export const url = 'https://www.nestoria.de/haus/mieten/stadecken-elsheim?bedrooms=3,4&price_max=1000&price_min=600&radio=10&sort=newest';
export const itemSpacer = '\n\n';

async function scrape(pool: Pool) {
    const browser = await Puppeteer.launch(<LaunchOptions>{
        headless: true,
        args: ['--no-sandbox', '--disable-gpu'],
        timeout: 0
    });

    const page = await browser.newPage();
    await page.goto(url);

    /** Items are text array of the html <article> node inner text. */
    const items = await page.evaluate(() => {
        /** Do stuff with document */
        return [];
    });

    items.forEach(item => {
        // DO stuff with items
    });

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

if (!process.env.production) {
    scrape(pool);
}

schedule(interval, () => scrape(pool));
