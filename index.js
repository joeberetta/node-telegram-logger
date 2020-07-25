const https = require("superagent");

exports.TelegramLogger = class TelegramLogger {
  /**
   * @class TelegramLogger
   * @param {String} token should get from https://t.me/BotFather
   * @param {Number} chatId should get using https://t.me/MyIdBot
   */
  constructor(token, chatId) {
    this.init(token, chatId);
    this.#chatId = chatId;
  }

  #baseUrl = "https://api.telegram.org/bot";
  #chatId = null;

  /**
   * @private
   * @description Initial validation of bot `token` and `chatId`
   * @param {String} token
   * @param {Number} chatId
   */
  async init(token, chatId) {
    // Check token and chat
    try {
      this.#baseUrl += token;
      await https.get(`${this.#baseUrl}/getMe`);
      await https.post(`${this.#baseUrl}/getChat`).send({
        chat_id: chatId,
      });
    } catch (error) {
      throw new Error(JSON.stringify(error.response.body || error, null, 2));
    }
    return this;
  }

  /**
   * @private
   * @description Sends log to chat
   * @param {String} type log message type
   * @param {any[]} data
   */
  #sendMessage = async (type, data) => {
    // console.log(this.#fmt(type, data));
    try {
      await https.post(`${this.#baseUrl}/sendMessage`).send({
        chat_id: this.#chatId,
        text: this.#fmt(type, data),
        parse_mode: "HTML",
      });
    } catch (error) {
      throw new Error(JSON.stringify(error.response.body, null, 2));
    }
  };

  /**
   * @private
   * @description Formats message `body` of given `type`
   * @param {String} type message type
   * @param {any[]} body
   * @returns {String} formatted text
   */
  #fmt = (type, body) => {
    let head = "";
    switch (type) {
      case this.debug.name:
        head = `⚙️ ${type.toUpperCase()}\n`;
        break;

      case this.error.name:
        head = `🆘 ${type.toUpperCase()}\n`;
        break;

      default:
        head = `ℹ️ ${this.log.name.toUpperCase()}\n`;
        break;
    }

    return (
      `<b>${head}</b>\n` +
      `<pre>${body.reduce((message, current) => {
        if (typeof current === "object") {
          message +=
            "\n" +
            JSON.stringify(current, null, !Array.isArray(current) ? 2 : 0) +
            "\n";
        } else {
          message += `${current} `;
        }
        return message;
      }, "")}</pre>`
    );
  };

  /**
   * Sends `debug` message to chat
   */
  debug(...data) {
    return this.#sendMessage(this.debug.name, data);
  }

  /**
   * Sends `error` message to chat
   */
  error(...data) {
    return this.#sendMessage(this.error.name, data);
  }

  /**
   * Sends `log` message to chat
   */
  log(...data) {
    return this.#sendMessage(this.log.name, data);
  }
};
