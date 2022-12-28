const https = require('https');
const util = require('util');

exports.TelegramLogger = class TelegramLogger {
  /** @private @type {string} */
  _ctx = this.constructor.name;

  /** @private @type {string} */
  _apiUrl = 'https://api.telegram.org/bot';

  /** @private @type {number | null} */
  _chatId = null;

  /**
   * @class TelegramLogger
   * @param {string} token should get from https://t.me/BotFather
   * @param {number} chatId should get using https://t.me/MyIdBot
   */
  constructor(token, chatId) {
    this._init(token, chatId);
  }

  /**
   * Sends `debug` message to chat
   * @param {any} data
   */
  debug(...data) {
    return this._sendMessage(this.debug.name, data);
  }

  /**
   * Sends `error` message to chat
   * @param {any} data
   */
  error(...data) {
    return this._sendMessage(this.error.name, data);
  }

  /**
   * Sends `log` message to chat
   * @param {any} data
   */
  log(...data) {
    return this._sendMessage(this.log.name, data);
  }

  /**
   * Sends `plain` message to chat
   * @param {any} data
   */ 
  plain(...data) {
    return this._sendMessage('', data, false);
  }

  /**
   * @description Initial validation of bot `token` and `chatId`
   * @param {string} token
   * @param {number} chatId
   */
  async _init(token, chatId) {
    // Check token and chat
    try {
      this._apiUrl += token;
      this._chatId = chatId;
      await this._get(`${this._apiUrl}/getMe`);
      await this._post(`${this._apiUrl}/getChat`, { chat_id: chatId });
    } catch (error) {
      throw new Error(`${this._ctx}, _init input token:${token} chatId:${chatId} err:`, err);
    }
  }

  /**
   * @private
   * @description Sends log to chat
   * @param {String} type log message type
   * @param {any[]} data
   */
  async _sendMessage(type, data, format = true) {
    try {
      await this._post(`${this._apiUrl}/sendMessage`, {
        chat_id: this._chatId,
        text: format ? this._fmt(type, data) : data,
        parse_mode: 'HTML',
      });
    } catch (err) {
      throw new Error(
        `${this._ctx}, _sendMessage input type:${type} data:${util.inspect(data, { depth: null })} err:`,
        err
      );
    }
  }

  /**
   * @private
   * @description Formats message `body` of given `type`
   * @param {String} type message type
   * @param {any[]} body
   * @returns {String} formatted text
   */
  _fmt(type, body) {
    let head = '';
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

    const mentions = [];
    const tags = [];

    let text = '';
    body.forEach(arg => {
      if (Array.isArray(arg)) {
        text += `\n${util.inspect(arg, { depth: null })}`;
      } else if (typeof arg === 'object') {
        text += `\n${util.inspect(arg, { depth: null, compact: false })}`;
      } else if (typeof arg === 'string') {
        if (arg.startsWith('@')) {
          mentions.push(arg);
        } else if (arg.startsWith('#')) {
          tags.push(arg);
        } else {
          text += `${arg}`;
        }
      } else {
        text += `${arg}`;
      }
    });
    return `<b>${head}</b>` + `${tags.join(' ')}\n\n` + `<pre>${text}</pre>\n\n` + mentions.join(' ');
  }

  /**
   * @private
   * @description Http send get requset
   * @param {string} url
   */
  async _get(url) {
    return new Promise((resolve, reject) => {
      let data = '';
      https.get(url, res => {
        res.on('data', chunk => (data += chunk));
        res.on('end', () => resolve(JSON.parse(data)));
        res.on('error', () => reject(data));
      });
    });
  }

  /**
   * @private
   * @description Http send post requset url params
   * @param {string} url
   * @param {Record<string, any>} params
   */
  async _post(url, params) {
    return new Promise((resolve, reject) => {
      let data = '';
      const req = https.request(url + '?' + new URLSearchParams(params), res => {
        res.on('data', chunk => (data += chunk));
        res.on('end', () => resolve(JSON.parse(data)));
        res.on('error', () => reject(data));
      });
      req.end();
    });
  }
};
