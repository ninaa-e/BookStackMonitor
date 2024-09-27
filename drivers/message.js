const { loadEvents,clearEvents } = require('./events');

const eventTypeMessages = {
    page_create: "created pages",
    page_update: "updated pages",
    page_delete: "deleted pages",
    page_restore: "restored pages",
    page_move: "moved pages",
    chapter_create: "created chapters",
    chapter_update: "updated chapters",
    chapter_delete: "deleted chapters",
    chapter_move: "moved chapters",
    book_create: "created books",
    book_create_from_chapter: "created books from chapter",
    book_update: "updated books",
    book_delete: "deleted books",
    book_sort: "sorted books",
    bookshelf_create: "created bookshelves",
    bookshelf_create_from_book: "created bookshelves from books",
    bookshelf_update: "updated bookshelves",
    bookshelf_delete: "deleted bookshelves",
    comment_create: "created comments",
    comment_update: "updated comments",
    comment_delete: "deleted comments",
    permissions_update: "updated permissions",
    revision_restore: "restored revisions",
    revision_delete: "deleted revisions",
    settings_update: "updated settings",
    maintenance_action_run: "ran maintenance actions",
    recycle_bin_empty: "emptied recycle bin",
    recycle_bin_restore: "restored recycle bin",
    recycle_bin_destroy: "destroyed recycle bin",
    user_create: "created users",
    user_update: "updated users",
    user_delete: "deleted users",
    api_token_create: "created API tokens",
    api_token_update: "updated API tokens",
    api_token_delete: "deleted API tokens",
    role_create: "created roles",
    role_update: "updated roles",
    role_delete: "deleted roles",
    auth_password_reset_request: "requested password reset",
    auth_password_reset_update: "updated password reset",
    auth_login: "User logged in",
    auth_register: "registered users",
    mfa_setup_method: "set up MFA methods",
    mfa_remove_method: "removed MFA methods",
    webhook_create: "created webhooks",
    webhook_update: "updated webhooks",
    webhook_delete: "deleted webhooks: "
};

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

function get(hrs,clear=false) {

    let byUsers = {};
    loadEvents(new Date((Date.now() - 1000*60*60*hrs))).forEach(log => {
        switch (log.event) {
            case "user_create":
                byUsers[log.related_item.id] = {actions:{},user:log.related_item,isNew:true,createdBy:log.triggered_by.id};
                break;
            case "auth_register":
                byUsers[log.related_item.id] = {actions:{},user:log.related_item,isNew:true};
                break;
            case "auth_login":
                if(!byUsers[log.triggered_by.id])
                    byUsers[log.triggered_by.id] = {actions:{},user:log.triggered_by,isNew:false};
                break;
            default:
                if(log.triggered_by) {
                    if(!byUsers[log.triggered_by.id])
                        byUsers[log.triggered_by.id] = {actions:{},user:log.triggered_by,isNew:false};
                
                    if(!byUsers[log.triggered_by.id].actions[log.event])
                        byUsers[log.triggered_by.id].actions[log.event] = []

                    if(log.related_item)
                        byUsers[log.triggered_by.id].actions[log.event].push(log.related_item)
                }
                break;
        }


    });
    if(clear)
        clearEvents()

    let events = []

    for (const [key, value] of Object.entries(byUsers)) {


        let actions = []
        for (const [key1, value1] of Object.entries(value.actions)) {
            var items = []
            var tracker = {}
            value1.forEach(element => {
                if(!tracker[element.name])
                    items.push(`"${element.name}"`)
                tracker[element.name] = true
            });
            var emoji = eventTypeEmojis[key1] || "⚠️"
            var info = eventTypeMessages[key1] || "Event occurred: ";
            actions.push(`${emoji} ${info}: ${items.join(", ")}`)
        }

        let str = (
            value.isNew ? 
            (value.createdBy ? 
                `New user <b>${value.user.name}</b> created by <b>${value.createdBy.name}</b>`
                : `New user <b>${value.user.name}</b> registered`)
            : `<b>${value.user.name}</b> logged in`)
            + (actions.length == 0 ? " and did nothing." : ` and:\n${actions.join("\n")}`)


        events.push(str)
    }

    let message = events.length == 0 ?
     `<b>No Wiki Events in the last ${hrs} hours.</b>` :
     `<b>Wiki Events in the last ${hrs} hours:</b>\n\n${events.join("\n\n")}`
    
    return message;
}

module.exports = {get};