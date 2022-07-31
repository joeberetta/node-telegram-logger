import { TelegramLogger } from "node-telegram-log";

const BOT_TOKEN: string = ""; // Put your Telegram Bot token here
const CHAT_ID: number = 0; // Put chat id here. If it's not a group chat, first /start chat with bot manually

const logger = new TelegramLogger(BOT_TOKEN, CHAT_ID);

// Send log message
logger.log("Just log it!");

// Send debug message with object
logger.debug("Debug some module: ", {
  formatObject: true,
  meta: {
    name: "Bob",
    age: 21,
  },
});

// Mention user, who must to pay attention to this message
// Note: @mentions work only if part of message starts with @username
logger.error("@joeberetta", "#uwu", "Something went wrong:", [
  1,
  { formatted: true },
  "wow",
]);
