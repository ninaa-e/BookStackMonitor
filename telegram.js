const TelegramBot = require('node-telegram-bot-api');
const { loadEvents } = require('./drivers/events');
require('dotenv').config()

const token = process.env.TELEGRAM_API_KEY;

const bot = new TelegramBot(token, {polling: true});

const eventTypeEmojis = {
    page_create: "📃",
    page_update: "📝",
    page_delete: "🗑️📃",
    page_restore: "♻️📃",
    page_move: "📂📃",
    chapter_create: "📖",
    chapter_update: "📖🖋️",
    chapter_delete: "🗑️📖",
    chapter_move: "📂📖",
    book_create: "📚",
    book_create_from_chapter: "📚➡️📖",
    book_update: "📚🖋️",
    book_delete: "🗑️📚",
    book_sort: "📚🔄",
    bookshelf_create: "🗂️📚",
    bookshelf_create_from_book: "📚➡️🗂️",
    bookshelf_update: "🗂️🖋️",
    bookshelf_delete: "🗑️🗂️",
    comment_create: "💬",
    comment_update: "💬🖋️",
    comment_delete: "🗑️💬",
    permissions_update: "🔐🛠️",
    revision_restore: "♻️📝",
    revision_delete: "🗑️📝",
    settings_update: "⚙️🛠️",
    maintenance_action_run: "🛠️🧰",
    recycle_bin_empty: "🗑️🚮",
    recycle_bin_restore: "♻️🗑️",
    recycle_bin_destroy: "💥🗑️",
    user_create: "👤➕",
    user_update: "👤🖋️",
    user_delete: "👤🗑️",
    api_token_create: "🔑➕",
    api_token_update: "🔑🖋️",
    api_token_delete: "🔑🗑️",
    role_create: "🛡️➕",
    role_update: "🛡️🖋️",
    role_delete: "🛡️🗑️",
    auth_password_reset_request: "🔒🔄",
    auth_password_reset_update: "🔒🖋️",
    auth_login: "🔑",
    auth_register: "📝👤",
    mfa_setup_method: "🔐➕",
    mfa_remove_method: "🔐🗑️",
    webhook_create: "🌐➕",
    webhook_update: "🌐🖋️",
    webhook_delete: "🌐🗑️"
}



async function sendMessage() {

    let std = 24;

    let log = []
    loadEvents(new Date((Date.now() - 1000*60*60*std))).forEach(element => {
        let emoji;
        if(emoji = eventTypeEmojis[element.event])
            log.push(emoji +""+ element.text)
        else
            log.push(element.text)
    });

    let message = `*Wiki Ereignisse von den letzten ${std} Stunden*\n${log.join("\n")}`;


    console.log("Generated message for telegram")
    await bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message,{parse_mode:"Markdown"});
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
