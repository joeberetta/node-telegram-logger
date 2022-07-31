# Telegram Logger

Simple [Telegram](https://telegram.org) logger for node.js.

## Install

```bash
$ npm install node-telegram-log
```

## Prerequisites

1. [Create telegram bot](https://core.telegram.org/bots#3-how-do-i-create-a-bot) and get it's `token`:

2. Add bot to group or go to bot's page and `/start`

3. Get `chat_id` where bot will send messages. Feel free to use [IDBot](https://t.me/myidbot) to get `chat_id`

## Usage

```ts
import { TelegramLogger } from "node-telegram-log";

const BOT_TOKEN: string = ""; // Put your Telegram Bot token here
const CHAT_ID: number = 0; // Put chat id here. If it's not a group chat, first /start chat with bot manually

const logger = new TelegramLogger(BOT_TOKEN_ID, CHAT_ID);

// Log some message
logger.log("Hooray! It works");
// Formatted message
/**
 * ℹ️ LOG
 *
 * Hooray! It works
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

// Mention user, who must to pay attention to this message
// Note: @mentions work only if part of message starts with @username
logger.error("@joeberetta", "#test", "Something went wrong:", [
  1,
  { formatted: true },
  "wow",
]);
// Formatted message
/**
 * 🆘 ERROR
 * #test
 *
 * Something went wrong:
 * [1,{"formatted":true},"wow"]
 *
 * @joeberetta
 */
```

## Author

**Joe Beretta**

- [Github](https://github.com/joeberetta)
- [Twitter](https://twitter.com/joe_beretta)
- [Telegram](https://t.me/joeberetta)

## License

Copyright © 2020, [Joe Beretta](https://t.me/joeberetta). Released under the [MIT License](https://github.com/joeberetta/node-telegram-logger/blob/master/LICENSE).
