# Advanced OpenAi TypeScript Puppeteer Web Scraper with MySQL Integration

This advanced TypeScript Puppeteer web scraper template offers a comprehensive solution for web scraping tasks, integrating Puppeteer with MySQL database and incorporating various Puppeteer plugins for enhanced functionality. Tailored for both development and production environments, this template extends beyond basic web scraping by offering features like automated scheduling, headless browser operation, and advanced error handling. It is perfect for developers seeking a robust and scalable web scraping setup.

## Features

- **Environment-Specific Configuration**: Leverages `.env` files for differentiating between development and production environments.
- **Puppeteer Plugins Integration**: Includes plugins like `puppeteer-extra-plugin-anonymize-ua`, `puppeteer-extra-plugin-adblocker`, `puppeteer-extra-plugin-recaptcha`, and `puppeteer-extra-plugin-stealth` for enhanced scraping capabilities.
- **Automated Scheduling**: Utilizes `node-cron` for scheduling scraping tasks, customizable for different intervals.
- **MySQL Database Integration**: Features integration with MySQL using a connection pool for efficient data handling.
- **Error Handling and Debugging**: Advanced error handling with screenshot capabilities for debugging, along with options to open devtools and slow down Puppeteer operations for detailed inspection.

## Getting Started

### Prerequisites

- Node.js installed on your system
- MySQL database setup
- Yarn or npm for dependency management

### Installation

1. Clone the repository or use the "Use this template" button on GitHub.
2. Install the dependencies:

    ```sh
    yarn install
    # or
    npm install
    ```

### Configuration

1. Create a `.env` file in the root directory.
2. Add the necessary environment variables (as declared in the `.env.example` file) to the `.env` file or environment variables (recommended).

### Usage

- Compile the scraper:

    ```sh
    npm run compile
    # or
    npm run dev-compile # for continuous compilation
    ```

- Run the scraper:

    ```sh
    yarn start
    # or
    npm start
    ```

## TypeScript and Puppeteer Integration

- **TypeScript Support**: Fully supported with TypeScript for type safety and easier code management.
- **Puppeteer**: Control headless Chrome or Chromium for web page navigation, interaction, and data extraction.

## Customizing the Scraper

You can modify the `scrape` function in the `scraper.ts` file to add your custom scraping logic and interact with MySQL database.

## Contributing

Contributions are welcome! If you have suggestions for improvement or encounter any issues, feel free to open an issue or submit a pull request.

---

This template provides a solid foundation for building sophisticated web scrapers with TypeScript and Puppeteer, optimized for both development and production use. Enjoy your scraping journey!