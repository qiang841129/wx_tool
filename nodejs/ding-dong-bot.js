require('babel-register');
require('babel-polyfill');
import {
    Contact,
    FileBox,
    Message,
    ScanStatus,
    Wechaty,
} from 'wechaty'

import {generate} from 'qrcode-terminal'

/**
 * 1. Declare your Bot!
 */
const bot = new Wechaty({
    name:'ding-dong-bot'
})

/**
 * 2. Register event handlers for Bot
 */
bot.on('logout', onLogout)
    .on('login', onLogin)
    .on('scan', onScan)
    .on('error', onError)
    .on('message', onMessage)

/**
 * 3. Start the bot!
 */
bot.start()
    .catch(async e => {
        console.error('Bot start() fail:', e)
        await bot.stop()
        process.exit(-1)
    })

/**
 * 4. You are all set. ;-]
 */

 /**
  * 5. Define Event handler functions for:
  *  `scan`, `login`, `logout`, `error`, and `message`
  */
function onScan(qrcode, status) {
    if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
        generate(qrcode)

        // Generate a QR code online via
        // http://goqr.me/api/doc/create-qr-code/
        const qrcodeImageUrl = [
            'https://api.qrserver.com/v1/create-qr-code/?data=',
            encodeURIComponent(qrcode),
        ].join('')

        console.info('onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)
    } else {
        console.info('onScan: %s(%s)', ScanStatus[status], status)
    }

    // console.info(`[${ScanStatus[status]}(${status})] ${qrcodeImageUrl}\nScan QR Code above to log in:`)
}

function onLogin(user) {
    console.info(`${user.name()} login`)
    bot.say('Wechaty login').catch(console.error)
}

function onLogout(user) {
    console.info(`${user.name()} logouted`)
}

function onError(e) {
    console.error('Bot error:', e)
    /*
    if (bot.logonoff()) {
        bot.say('Wechaty error: ' + e.message).catch(console.error)
    }
    */
}

/**
 * 6. The most important handler is for:
 *    dealing with Message.
 */
async function onMessage(msg) {
    console.info(msg.toString())

    if (msg.self()) {
        console.info('Message discarded because its outgoing')
        return
    }

    if (msg.age() > 2 * 60) {
        console.info('Message discarded because its TOO OLD(than 2 minutes)')
        return
    }

    if (msg.type() !== bot.Message.Type.Text || !/^(ding|ping|bing|code)$/i.test(msg.text())) {
        console.info('Message discarded because it does not match ding/ping/bing/code')
        return
    }

    /**
     * 1. reply 'dong'
     */
    await msg.say('dong')
    console.info('REPLY: dong')

    /**
     * 2. reply image(qrcode image)
     */
    const fileBox = FileBox.fromUrl('https://wechaty.github.io/wechaty/images/bot-qr-code.png')

    await msg.say(fileBox)
    console.info('REPLY: %s', fileBox.toString())

    /**
     * 3. reply 'scan now!'
     */
    await msg.say([
        'Join Wechaty Developers Community\n\n',
        'Scan now, because other Wechaty developers want to talk with you too!\n\n',
        '(secret code: wechaty)',
    ].join(''))
}

/**
 * 7. Output the Welcome Message
 * 
 */
const welcome = `
| __        __        _           _
| \\ \\      / /__  ___| |__   __ _| |_ _   _
|  \\ \\ /\\ / / _ \\/ __| '_ \\ / _\` | __| | | |
|   \\ V  V /  __/ (__| | | | (_| | |_| |_| |
|    \\_/\\_/ \\___|\\___|_| |_|\\__,_|\\__|\\__, |
|                                     |___/
=============== Powered by Wechaty ===============
-------- https://github.com/wechaty/wechaty --------
          Version: ${bot.version(true)}
I'm a bot, my superpower is talk in Wechat.
If you send me a 'ding', I will reply you a 'dong'!
__________________________________________________
Hope you like it, and you are very welcome to
upgrade me to more superpowers!
Please wait... I'm trying to login in...

`

console.info(welcome)