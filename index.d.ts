export class TelegramLogger {
    /**
     * @class TelegramLogger
     * @param {string} token should get from https://t.me/BotFather
     * @param {number} chatId should get using https://t.me/MyIdBot
     */
    constructor(token: string, chatId: number);
    /** @private @type {string} */
    private _ctx;
    /** @private @type {string} */
    private _apiUrl;
    /** @private @type {number | null} */
    private _chatId;
    /**
     * Sends `debug` message to chat
     * @param {any} data
     */
    debug(...data: any): any;
    /**
     * Sends `error` message to chat
     * @param {any} data
     */
    error(...data: any): any;
    /**
     * Sends `log` message to chat
     * @param {any} data
     */
    log(...data: any): any;
    /**
     * Sends `plain` message to chat
     * @param {any} data
     */
    plain(...data: any): Promise<void>;
    /**
     * @description Initial validation of bot `token` and `chatId`
     * @param {string} token
     * @param {number} chatId
     */
    _init(token: string, chatId: number): Promise<void>;
    /**
     * @private
     * @description Sends log to chat
     * @param {String} type log message type
     * @param {any[]} data
     * @param {Boolean} format message
     */
    private _sendMessage;
    /**
     * @private
     * @description Formats message `body` of given `type`
     * @param {String} type message type
     * @param {any[]} body
     * @returns {String} formatted text
     */
    private _fmt;
    /**
     * @private
     * @description Http send get requset
     * @param {string} url
     */
    private _get;
    /**
     * @private
     * @description Http send post requset url params
     * @param {string} url
     * @param {Record<string, any>} params
     */
    private _post;
}
