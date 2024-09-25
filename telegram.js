const TelegramBot = require('node-telegram-bot-api');
const { get } = require('./drivers/message');
require('dotenv').config()

const token = process.env.TELEGRAM_API_KEY;

const bot = new TelegramBot(token, {polling: true});





async function sendMessage() {

    let message = get(24)

    await bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message,{parse_mode:"html"});
    console.log("sent message")

    process.exit()
}


if(process.argv[2] == "echo-id")
{

    bot.on('channel_post', (msg) => {
        const chatId = msg.chat.id;
    
        // send a message to the chat acknowledging receipt of their message
        bot.sendMessage(chatId, 'Received your channel_post check console for ChatId',{parse_mode:"MarkdownV2"});
        console.log(`Received channel_post ${chatId}`)
        process.exit()

    });

}
else 
{
   sendMessage()
}
