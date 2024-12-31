const { program } = require('commander');
const events = require('./drivers/events');
const telegram = require('./drivers/telegram');
const message = require('./drivers/message');

program
  .name('bookstack-monitor')
  .version('0.8.0');

const cacheCmd = program.command('cache').description('Options for cache')
cacheCmd.command("clear")
  .description('clear the cache')
    .action(() => {
        events.clearEvents()
  });
cacheCmd.command("size")
  .description('print the cache size')
    .action(() => {
    console.log(events.loadEvents().length)
  });

const telegramCmd = program.command('telegram').description('Options for telegram')
telegramCmd.command("get-channel-id")
    .description('Get the channel id')
      .action(() => {
        telegram.getChannelId()
    });
telegramCmd.command("broadcast")
    .description('broadcast')
    .argument('<hrs>', 'How many hours back')
      .action((hrs) => {
        telegram.sendMessage(hrs)
    });

const testCmd = program.command('test').description('Options for testing')
testCmd.command("broadcast")
    .description('broadcast')
    .argument('<hrs>', 'How many hours back')
      .action((hrs) => {
        console.log(message.get(hrs))
    });

program.parse();