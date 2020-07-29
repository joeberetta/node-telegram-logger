const https = require('superagent');

exports.TelegramLogger = class TelegramLogger {
	_baseUrl = 'https://api.telegram.org/bot';
	_chatId = null;

	/**
	 * @class TelegramLogger
	 * @param {String} token should get from https://t.me/BotFather
	 * @param {Number} chatId should get using https://t.me/MyIdBot
	 */
	constructor(token, chatId) {
		this.init(token, chatId);
		this._chatId = chatId;
	}
	/**
	 * @private
	 * @description Initial validation of bot `token` and `chatId`
	 * @param {String} token
	 * @param {Number} chatId
	 */
	async init(token, chatId) {
		// Check token and chat
		try {
			this._baseUrl += token;
			await https.get(`${this._baseUrl}/getMe`);
			await https.post(`${this._baseUrl}/getChat`).send({
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
	_sendMessage = async (type, data) => {
		try {
			await https.post(`${this._baseUrl}/sendMessage`).send({
				chat_id: this._chatId,
				text: this._fmt(type, data),
				parse_mode: 'HTML',
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
	_fmt = (type, body) => {
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
		return (
			`<b>${head}</b>\n` +
			`<pre>${body.reduce((message, current, i, body) => {
				if (typeof current === 'object') {
					message += `\n${JSON.stringify(
						current,
						null,
						!Array.isArray(current) ? 2 : 0
					)}${i < body.length - 1 ? '\n' : ''}`;
				} else {
					// send notification to user if log message has one
					if (/^@[\w\d_]+/i.test(current)) {
						// collect @mentions separate
						const mentionList = current
							.split(' ')
							.filter((msg) => /^@[\w\d_]+/i.test(msg))
							.flat(Infinity)
							.join(' ');
						mentions.push(mentionList);

						const partsOfLog = current
							.split(' ')
							.filter((msg) => !/^@[\w\d_]+/i.test(msg))
							.join(' ');

						message += partsOfLog ? `${partsOfLog} ` : '';
					} else {
						message += `${current} `;
					}
				}
				return message;
			}, '')}</pre>\n\n` +
			mentions.join(' ')
		);
	};

	/**
	 * Sends `debug` message to chat
	 */
	debug(...data) {
		return this._sendMessage(this.debug.name, data);
	}

	/**
	 * Sends `error` message to chat
	 */
	error(...data) {
		return this._sendMessage(this.error.name, data);
	}

	/**
	 * Sends `log` message to chat
	 */
	log(...data) {
		return this._sendMessage(this.log.name, data);
	}
};
