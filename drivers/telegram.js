const TelegramBot = require('node-telegram-bot-api');
const { get } = require('./message');
require('dotenv').config()

const token = process.env.TELEGRAM_API_KEY || null;

const newBot = () => {
    if(token == null)
        throw new Error("Required TELEGRAM_API_KEY in .env");

    return new TelegramBot(token, {polling: true});
}

async function sendMessage(hrs) {
    
    let chat = process.env.TELEGRAM_CHAT_ID || null;

    if(chat == null)
        throw new Error("Required TELEGRAM_CHAT_ID in .env");

    let bot = newBot()

    let message = get(hrs)

    
    await bot.sendMessage(chat, message,{parse_mode:"html"});
    console.log("Message sent to telegram")

    process.exit()
}


function getChannelId () {

    let bot = newBot()

    bot.on('channel_post', (msg) => {
        const chatId = msg.chat.id;
    
        // send a message to the chat acknowledging receipt of their message
        bot.sendMessage(chatId, 'Received your channel_post check console for ChatId',{parse_mode:"MarkdownV2"});
        console.log(`Received channel_post ${chatId}`)
        process.exit()

    });

}

module.exports = {getChannelId,sendMessage};