# Telegram Logger

Simple [Telegram](https://telegram.org) logger for node.js.

## Install

```bash
$ npm install node-telegram-logger
```

## Prerequisites

1. [Create telegram bot](https://core.telegram.org/bots#3-how-do-i-create-a-bot) and get it's `token`:

2. Add bot to group or go to bot's page and `/start`

3. Get `chat_id` where bot will send messages. Feel free to use [IDBot](https://t.me/myidbot) to get `chat_id`

## Usage

```js
const { TelegramLogger } = require("node-telegram-log");

const logger = new TelegramLogger(BOT_TOKEN_ID, CHAT_ID);

// Log some message
logger.log("Yuhuu! It's work");
// Formatted message
/**
 * ℹ️ LOG
 *
 * Yuhuu! It's work
 */

// Or debug
logger.debug("Just debugging it", { canILogObjects: true });

// Formatted message
/**
 * ⚙️ DEBUG
 *
 * Just debugging it
 * {
 *   "canILogObjects": true
 * }
 */

// Even errors are formatted
logger.error("Something went wrong: ", [1, { formatted: true }, "wow"]);
// Formatted message
/**
 * 🆘 ERROR
 *
 * Something went wrong:
 * [1,{"formatted":true},"wow"]
 */
```

## Author

**Joe Beretta**

- [Github](https://github.com/joeberetta)
- [Twitter](https://twitter.com/joe_beretta)
- [Telegram](https://t.me/joeberetta)

## License

Copyright © 2020, [Joe Beretta](https://t.me/joeberetta). Released under the [MIT License](https://github.com/joeberetta/node-telegram-logger/blob/master/LICENSE).
