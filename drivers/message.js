const { loadEvents,clearEvents } = require('./events');

const eventTypeMessages = {
    page_create: "Created pages",
    page_update: "Updated pages",
    page_delete: "Deleted pages",
    page_restore: "Restored pages",
    page_move: "Moved pages",
    chapter_create: "Created chapters",
    chapter_update: "Updated chapters",
    chapter_delete: "Deleted chapters",
    chapter_move: "Moved chapters",
    book_create: "Created books",
    book_create_from_chapter: "Created books from chapter",
    book_update: "Updated books",
    book_delete: "Deleted books",
    book_sort: "Sorted books",
    bookshelf_create: "Created bookshelves",
    bookshelf_create_from_book: "Created bookshelves from books",
    bookshelf_update: "Updated bookshelves",
    bookshelf_delete: "Deleted bookshelves",
    comment_create: "Created comments",
    comment_update: "Updated comments",
    comment_delete: "Deleted comments",
    permissions_update: "Updated permissions",
    revision_restore: "Restored revisions",
    revision_delete: "Deleted revisions",
    settings_update: "Updated settings",
    maintenance_action_run: "Ran maintenance actions",
    recycle_bin_empty: "Emptied recycle bin",
    recycle_bin_restore: "Restored recycle bin",
    recycle_bin_destroy: "Destroyed recycle bin",
    user_create: "Created users",
    user_update: "Updated users",
    user_delete: "Deleted users",
    api_token_create: "Created API tokens",
    api_token_update: "Updated API tokens",
    api_token_delete: "Deleted API tokens",
    role_create: "Created roles",
    role_update: "Updated roles",
    role_delete: "Deleted roles",
    auth_password_reset_request: "Requested password reset",
    auth_password_reset_update: "Updated password reset",
    auth_login: "User logged in",
    auth_register: "Registered users",
    mfa_setup_method: "Set up MFA methods",
    mfa_remove_method: "Removed MFA methods",
    webhook_create: "Created webhooks",
    webhook_update: "Updated webhooks",
    webhook_delete: "Deleted webhooks"
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

function groupEventsByUsers(events) {

    events.forEach(log => {
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

}

function get(hrs,clear=false) {

    let byUsers = groupEventsByUsers(loadEvents(new Date((Date.now() - 1000*60*60*hrs))))
    
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