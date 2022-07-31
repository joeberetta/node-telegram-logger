import { inspect } from "node:util";
import { get, request } from "node:https";

export class TelegramLogger {
  private readonly ctx: string = this.constructor.name;
  private apiUrl: string = "https://api.telegram.org/bot";

  /**
   * @param {string} token See telegram bot [docs](https://core.telegram.org/bots#6-botfather)
   * @param {number} chatId Сhat in which the bot will write, should get using https://t.me/MyIdBot
   */
  public constructor(private token: string, private chatId: number) {
    this.init(token, chatId);
  }

  /**
   * Sends `debug` message to chat
   * @param {unknown[]} data
   */
  public debug(...data: unknown[]): Promise<void> {
    return this.sendMessage(this.debug.name, data);
  }

  /**
   * Sends `log` message to chat
   * @param {unknown[]} data
   */
  public log(...data: unknown[]): Promise<void> {
    return this.sendMessage(this.log.name, data);
  }
  /**
   * Sends `warn` message to chat
   * @param {unknown[]} data
   */
  public warn(...data: unknown[]): Promise<void> {
    return this.sendMessage(this.warn.name, data);
  }

  /**
   * Sends `error` message to chat
   * @param {unknown[]} data
   */
  public error(...data: unknown[]): Promise<void> {
    return this.sendMessage(this.error.name, data);
  }

  /**
   * @description Sends log to chat
   * @param {String} type log message type
   * @param {unknown[]} data
   */
  private async sendMessage(type: string, data: unknown[]): Promise<void> {
    try {
      await this.post(`${this.apiUrl}/sendMessage`, {
        chat_id: this.chatId,
        text: this.fmt(type, data),
        parse_mode: "HTML",
      });
    } catch (e) {
      throw new Error(
        `${this.ctx}, _sendMessage input type:${type} data:${inspect(data, {
          depth: null,
        })} err: ${inspect(e, { depth: null, compact: false })}`
      );
    }
  }

  /**
   * @description Formats message `body` of given `type`
   * @param {string} type message type
   * @param {unknown[]} body
   */
  private fmt(type: string, body: unknown[]): String {
    let head = "";
    switch (type) {
      case this.debug.name:
        head = `⚙️ ${type.toUpperCase()}\n`;
        break;
      case this.error.name:
        head = `🆘 ${type.toUpperCase()}\n`;
        break;
      case this.warn.name:
        head = `⚠️ ${type.toUpperCase()}\n`;
        break;
      default:
        head = `ℹ️ ${this.log.name.toUpperCase()}\n`;
        break;
    }

    const mentions: string[] = [];
    const tags: string[] = [];

    let text = "";
    body.forEach((arg) => {
      if (Array.isArray(arg)) {
        text += `\n${inspect(arg, { depth: null })}`;
      } else if (typeof arg === "object") {
        text += `\n${inspect(arg, { depth: null, compact: false })}`;
      } else if (typeof arg === "string") {
        if (arg.startsWith("@")) {
          mentions.push(arg);
        } else if (arg.startsWith("#")) {
          tags.push(arg);
        } else {
          text += `${arg}`;
        }
      } else {
        text += `${arg}`;
      }
    });
    return (
      `<b>${head}</b>` +
      `${tags.join(" ")}\n\n` +
      `<pre>${text}</pre>\n\n` +
      mentions.join(" ")
    );
  }

  /**
   * @description Initial validation of bot `token` and `chatId`
   */
  private async init(token: string, chatId: number): Promise<void> {
    try {
      this.apiUrl += token;
      this.chatId = chatId;
      await this.get(`${this.apiUrl}/getMe`);
      await this.post(`${this.apiUrl}/getChat`, { chat_id: chatId });
    } catch (e) {
      throw new Error(
        `${this.ctx}, init input token:${token} chatId:${chatId} err: ${inspect(
          e,
          { depth: null, compact: false }
        )}`
      );
    }
  }

  /**
   * @description Http send get requset
   */
  private async get(url: string) {
    return new Promise((resolve, reject) => {
      let data: string = "";
      get(url, (res) => {
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(JSON.parse(data)));
        res.on("error", () => reject(data));
      });
    });
  }

  /**
   * @description Http send post requset url params
   */
  private async post(url: string, params: Record<string, any>) {
    return new Promise((resolve, reject) => {
      let data: string = "";
      const req = request(url + "?" + new URLSearchParams(params), (res) => {
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(JSON.parse(data)));
        res.on("error", () => reject(data));
      });
      req.end();
    });
  }
}
