const TelegramApi = require('node-telegram-bot-api')

const token = '5621091804:AAEjBxMDNp84rhh65KSOBcC6Oe5WtjNai6s'

const bot = new TelegramApi(token, { polling: true })
const {gameOptions, againOptions} = require('./options')

const chats = {}

const startGame = async (chatId) => {
  await bot.sendMessage(
        chatId,
        'Зараз я загадаю цифру від 0 до 9, а ти повинен її вгадати'
  );
  
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber
  await bot.sendMessage(chatId, 'Відгадуй!', gameOptions)
}

const start = () => {
  bot.setMyCommands([
    {
      command: "/start",
      description: "Стартове привітання",
    },
    {
      command: "/info",
      description:
        "Отримати інформацію про себе",
    },
    {
      command: "/game",
      description:
        "Тестова гра - вгадай цифру",
    },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://s3.amazonaws.com/stickers.wiki/Whoniverse/888046.160.webp"
      );
      return bot.sendMessage(
        chatId,
        "Ласкаво просимо до телеграм боту найкращого доктора в світі Філіпчик Наталії Василівни, вона ж @dr_filipchyk"
      );
    }
    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Тебе звати ${msg.from.first_name} ${msg.from.last_name}`
      );
    }
    if (text === "/game") {
      return startGame(chatId)
    }
    return bot.sendMessage(
      chatId,
      `${msg.from.first_name} ${msg.from.last_name} я тебе не розумію, обери потрібний запит набравши '/'`
    );
  });

  bot.on('callback_query', msg => {
    const data = msg.data
    const chatId = msg.message.chat.id

    if (data === '/again') {
      return startGame(chatId)
    }
    if (data === chats[chatId]) {
      return bot.sendMessage(chatId, `Вітаю, ти вгадав цифру ${data}`, againOptions)
    } else {
      bot.sendMessage(chatId, `Нажаль ти не вгадав, бот загадав цифру ${chats[chatId]}`, againOptions)
    }

  })
}

start()