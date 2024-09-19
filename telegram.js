const TelegramBot = require('node-telegram-bot-api');
const { loadEvents } = require('./drivers/events');
require('dotenv').config()

const token = process.env.TELEGRAM_API_KEY;

const bot = new TelegramBot(token, {polling: true});

async function sendMessage() {
    let message = "*Wiki Ereignisse von Heute:*";
    loadEvents(new Date((Date.now() - 1000*60*60*24))).forEach(element => {
        message = message + "\n" + (element.text)
    });
    console.log("Generated message for telegram")
    await bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message);
    console.log("sent message")

    process.exit()
}
sendMessage()