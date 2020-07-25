const { TelegramLogger } = require("node-telegram-logger");

const BOT_TOKEN = "1141564935:AAEq_UFZsZTE0nLS50qkbSwVcmz7UtSq4ck";
const CHAT_ID = 44923701;

const logger = new TelegramLogger(BOT_TOKEN, CHAT_ID);

// Log some message
logger.log("Yuhuu! It's work");
// Result
/**
 * ℹ️ LOG
 *
 * Yuhuu! It's work
 */

// Or debug
logger.debug("Just debugging it", { canILogObjects: true });
// Result
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
// Result
/**
 * 🆘 ERROR
 *
 * Something went wrong:
 * [1,{"formatted":true},"wow"]
 */
