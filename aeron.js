const respon = require('./lib/respon.js');
const {
    downloadContentFromMessage,
    getDevice,
    toBuffer,
    generateWAMessageFromContent,
    proto
} = require('@adiwajshing/baileys');
const colors = require('colors/safe');
const fs = require('fs');
const chalkanim = require('chalk-animation');
const moment = require("moment-timezone");
const {
    exec,
    spawn
} = require('child_process')
const ffmpeg = require('fluent-ffmpeg')
const {
    fetch
} = require('./lib/anu.js');
const session = require('./session.json');
moment.tz.setDefault('Asia/Jakarta').locale("id");

const antilink = JSON.parse(fs.readFileSync('./database/hehe/antilink.json'))

const {
    copyright,
    apikey_xteam,
    list
} = JSON.parse(fs.readFileSync('./config.json'))



module.exports = hehe = async (aeron, msg) => {
    try {
        const type = Object.keys(msg.message)[0];
        const body = (type === 'conversation') ? msg.message.conversation : (type == 'imageMessage') ? msg.message.imageMessage.caption : (type == 'videoMessage') ? msg.message.videoMessage.caption : (type == 'extendedTextMessage') ? msg.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') ? msg.message.buttonsResponseMessage.selectedButtonId : (type == 'listResponseMessage') ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : (type == 'templateButtonReplyMessage') ? msg.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId || msg.text) : ''
        const prefix = /^[./~!#%^&=\,;:()z]/.test(body) ? body.match(/^[./~!#%^&=\,;:()z]/gi) : '#';
        const isCommand = body.startsWith(prefix);
        const cmd = isCommand ? body.slice(1).trim().split(/ +/).shift().toLowerCase() : null;
        const time = moment(new Date()).format("HH:mm");
        const text = body.slice(0).trim().split(/ +/).shift().toLowerCase()
        const isGroup = msg.key.remoteJid.endsWith('@g.us');
        const from = msg.key.remoteJid;
        const content = JSON.stringify(msg.message);
        const args = body.trim().split(/ +/).slice(1);
        const q = args.join(" ");
        const botNumber = aeron.user.id.split(':')[0] + '@s.whatsapp.net';
        const botName = aeron.user.name;
        const pushname = msg.pushName;
        const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid;
        const groupMetadata = isGroup ? await aeron.groupMetadata(from) : '';
        const uwong = isGroup ? await groupMetadata.participants : '';
        const groupAdmins = isGroup ? await uwong.filter(v => v.admin !== null).map(a => a.id) : '';
        const isBotGroupAdmins = groupAdmins.includes(botNumber) || false;
        const isGroupAdmins = groupAdmins.includes(sender) || false;
        const groupName = isGroup ? groupMetadata.subject : "";
        const isAntiLink = isGroup ? antilink.includes(from) : false


        const isMedia = (type === 'imageMessage' || type === 'videoMessage');
        const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage');
        const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage');
        const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage');
        await aeron.sendReadReceipt(from, msg.key.participant, [msg.key.id]);



        if (isGroup && isCommand) {
            console.log(colors.green.bold("[Group]") + " " + colors.brightCyan(time, ) + " " + colors.black.bgYellow(cmd) + " " + colors.green("from") + " " + colors.blue(groupName));
        } else if (!isGroup && isCommand) {
            console.log(colors.green.bold("[Private]") + " " + colors.brightCyan(time, ) + " " + colors.black.bgYellow(cmd) + " " + colors.green("from") + " " + colors.blue(pushname));
        }

        const reply = (teksnya) => {
            aeron.sendMessage(from, {
                text: teksnya
            }, {
                quoted: msg
            });
        };

        if (text.includes('https://chat.whatsapp.com')) {
            if (!isAntiLink) return
            if (isGroupAdmins) return
            await aeron.groupParticipantsUpdate(from, [sender], "remove")
        }


        switch (cmd) {
            case 'menu':
            case 'help':
            case 'allmenu':
                const menu = `
Halo ${pushname}

*⛦ Maker menu*
${list} ${prefix}sticker
${list} ${prefix}sgif
${list} ${prefix}quotemaker
${list} ${prefix}tahta
${list} ${prefix}magernulis
${list} ${prefix}magernulis2
${list} ${prefix}magernulis3
${list} ${prefix}magernulis4
${list} ${prefix}magernulis5
${list} ${prefix}magernulis6

*⛦ Wallpaper menu*
${list} ${prefix}wpml
${list} ${prefix}wallpaper

*⛦ Islami*
${list} ${prefix}jadwalsholat
${list} ${prefix}kisahnabi

*⛦ Informasi/Berita*
${list} ${prefix}infogempa
${list} ${prefix}cuaca
${list} ${prefix}kodepos
${list} ${prefix}kompas
${list} ${prefix}liputan6
${list} ${prefix}detik
${list} ${prefix}merdeka
${list} ${prefix}antara
${list} ${prefix}suara

*⛦ Group menu*
${list} ${prefix}antilink
${list} ${prefix}group
${list} ${prefix}editinfogroup
${list} ${prefix}hidetag
${list} ${prefix}add
${list} ${prefix}kick
${list} ${prefix}promote
${list} ${prefix}demote
${list} ${prefix}resetlink
${list} ${prefix}linkgroup
${list} ${prefix}setname
${list} ${prefix}setdesc

*⛦ ShortLink*
${list} ${prefix}tinyurl
${list} ${prefix}bitly
${list} ${prefix}cuttly

*⛦ Random Image*
${list} ${prefix}ppcouple
${list} ${prefix}blackpink
${list} ${prefix}bts
${list} ${prefix}meme
${list} ${prefix}meme2
${list} ${prefix}dark
${list} ${prefix}darkjoke
`
                const buttons = [{
                        buttonId: '!donasi',
                        buttonText: {
                            displayText: 'Donasi'
                        },
                        type: 1
                    },
                    {
                        buttonId: '!owner',
                        buttonText: {
                            displayText: 'Owner'
                        },
                        type: 1
                    },
                ]

                const buttonMessage = {
                    image: {
                        url: './thumbnail/menu.jpg'
                    },
                    caption: menu,
                    footer: `${copyright}`,
                    buttons: buttons,
                    headerType: 4
                }

                await aeron.sendMessage(from, buttonMessage, {
                    quoted: msg
                })
                break
            case 'kisahnabi':
                result = await fetch('https://api.akuari.my.id/islami/kisahnabi')
                ception = `*Nama:* ${result.hasil.name}\n*Tanggal lahir:* ${result.hasil.thn_kelahiran}\n*Usia:* ${result.hasil.usia}\n*Desc:* ${result.hasil.description}`
                aeron.sendMessage(from, {
                    image: {
                        url: `${result.hasil.image_url}`
                    },
                    caption: ception,
                    mimetype: 'image/jpeg'
                }, {
                    quoted: msg,
                });
                break
            case 'tahta':
            case 'hartatahta':
                if (!q) return reply(respon.notText(prefix, cmd, pushname));
                reply(respon.wait());
                aeron.sendMessage(from, {
                    image: {
                        url: `https://api.xteam.xyz/tahta?text=${q}&APIKEY=${apikey_xteam}`
                    },
                    caption: "Harta tahta " + q,
                    mimetype: 'image/jpeg'
                }, {
                    quoted: msg,
                });
                break
            case 'magernulis2':
            case 'magernulid3':
            case 'magernulis4':
            case 'magernulis5':
            case 'magernulis6':
                if (!q) return reply(respon.notText(prefix, cmd, pushname));
                reply(respon.wait());
                result = `https://api.xteam.xyz/${cmd}?text=${q}&APIKEY=${apikey_xteam}`
                aeron.sendMessage(from, {
                    image: {
                        url: result
                    },
                    caption: "*Success*",
                    mimetype: 'image/jpeg'
                }, {
                    quoted: msg,
                });
                break
            case 'magernulis':
                nama = q.split("|")[0];
                kelas = q.split("|")[1];
                tulisan = q.split("|")[2];
                if (!nama && !kelas && !tulisan) return reply('Ex: !magernulis nama|XI IPA|dia adalah ......')
                reply(respon.wait());
                result = `https://api.xteam.xyz/magernulis?nama=${nama}&kelas=${kelas}&text=${tulisan}&APIKEY=${apikey_xteam}`
                aeron.sendMessage(from, {
                    image: {
                        url: result
                    },
                    caption: "*Success*",
                    mimetype: 'image/jpeg'
                }, {
                    quoted: msg,
                });
                break
            case 'ppcp':
            case 'ppcouple':
                reply(respon.wait());
                result = await fetch(`https://api.xteam.xyz/randomimage/ppcouple?APIKEY=${apikey_xteam}`)
                aeron.sendMessage(from, {
                    image: {
                        url: result.result.male
                    },
                    caption: "*Cowok*",
                    mimetype: 'image/jpeg'
                }, {
                    quoted: msg,
                });
                aeron.sendMessage(from, {
                    image: {
                        url: result.result.female
                    },
                    caption: "*Cewek*",
                    mimetype: 'image/jpeg'
                }, {
                    quoted: msg,
                });
                break
            case 'blackpink':
            case 'bts':
            case 'meme':
            case 'meme2':
            case 'dark':
            case 'darkjoke':
            case 'wallpaper':
                try {
                    reply(respon.wait());
                    result = `https://api.xteam.xyz/randomimage/${cmd}?APIKEY=${apikey_xteam}`
                    aeron.sendMessage(from, {
                        image: {
                            url: result
                        },
                        caption: "*Success*",
                        mimetype: 'image/jpeg'
                    }, {
                        quoted: msg,
                    });
                } catch (e) {
                    reply('error')
                }
                break
            case 'quotemaker':
            case 'qmaker':
                kata = q.split('|')[0]
                watermark = q.split('|')[1]
                if (!kata && !watermark) return reply('Ex: !quotemaker adalah gatau|watermark')
                reply(respon.wait());
                result = `https://api.xteam.xyz/quotemaker?text=${kata}&wm=${watermark}&APIKEY=${apikey_xteam}`
                aeron.sendMessage(from, {
                    image: {
                        url: result
                    },
                    caption: "*Success*",
                    mimetype: 'image/jpeg'
                }, {
                    quoted: msg,
                });
                break
            case 'detik':
            case 'kompas':
            case 'liputan6':
                reply(respon.wait());
                anuuq = await fetch(`https://api.xteam.xyz/news/${cmd}?APIKEY=${apikey_xteam}`)
                tejnya = `*Judul:* ${anuuq.judul}\n\n*Tanggal:* ${anuuq.tanggal}\n\n*Link:* ${anuuq.url}\n\n*Artikel:* ${anuuq.artikel}`
                aeron.sendMessage(from, {
                    image: {
                        url: anuuq.thumb
                    },
                    caption: tejnya,
                    mimetype: 'image/jpeg'
                }, {
                    quoted: msg,
                });
                break

            case 'infogempa':
                reply(respon.wait());
                anuuq = await fetch(`https://api.akuari.my.id/info/gempa`)
                tejnya = `*Tanggal:* ${anuuq.result.tanggal}\n*Jam:* ${anuuq.result.jam}\n*Lintang:* ${anuuq.result.lintang}\n*Bujur:* ${anuuq.result.bujur}\n*Magnitude:* ${anuuq.result.magnitude}\n*Kedalaman:* ${anuuq.result.kedalaman}\n*Potensi:* ${anuuq.result.potensi}\n*Wilayah:* ${anuuq.result.wilayah}`
                aeron.sendMessage(from, {
                    image: {
                        url: anuuq.result.image
                    },
                    caption: tejnya,
                    mimetype: 'image/jpeg'
                }, {
                    quoted: msg,
                });
                break
            case 'tinyurl':
                if (!q) return reply('Masukan link')
                reply(respon.wait());
                anuuq = await fetch(`https://api.xteam.xyz/shorturl/tinyurl?url=${q}&APIKEY=${apikey_xteam}`)
                reply(`${anuuq.result}`)
                break
            case 'cutly':
            case 'cuttly':
                if (!q) return reply('Masukan link')
                reply(respon.wait());
                anuuq = await fetch(`https://api.xteam.xyz/shorturl/cuttly?url=${q}&APIKEY=${apikey_xteam}`)
                reply(`${anuuq.result.shortLink}`)
                break
            case 'bitly':
                if (!q) return reply('Masukan link')
                reply(respon.wait());
                anuuq = await fetch(`https://api.xteam.xyz/shorturl/bitly?url=${q}&APIKEY=${apikey_xteam}`)
                reply(`${anuuq.result.link}`)
                break
            case 'jadwalsholat':
            case 'jadwalsolat':
            case 'jadwalshalat':
            case 'jadwalsalat':
                if (!q) return reply("_*Masukan Kabupaten/Kota contoh: !jadwalsholat Surabaya_")
                reply(respon.wait());
                anuuq = await fetch(`https://api.xteam.xyz/jadwalsholat?kota=${q}&APIKEY=${apikey_xteam}`)
                reply(`*Kota:* ${anuuq.Kota}\n*Tanggal:* ${anuuq.Tanggal}\n*Shubuh:* ${anuuq.Subuh}\n*Dzuhur:* ${anuuq.Dzuhur}\n*Ashar:* ${anuuq.Ashar}\n*Magrib:* ${anuuq.Magrib}\n*Isya:* ${anuuq.Isha}`)
                break
            case 'cuaca':
                if (!q) return reply("_*Masukan Kabupaten/Kota contoh: !cuaca Surabaya_")
                reply(respon.wait());
                anuuq = await fetch(`https://api.xteam.xyz/cuaca?kota=surabaya&APIKEY=${apikey_xteam}`)
                reply(`*Kota:* ${anuuq.message.kota}\n*Hari:* ${anuuq.message.hari}\n*Cuaca:* ${anuuq.message.cuaca}\n*Deskripsi:* ${anuuq.message.deskripsi}\n*Suhu:* ${anuuq.message.suhu}\n*Pressure:* ${anuuq.message.pressure}\n*Kelembapan:* ${anuuq.message.kelembapan}\n*Angin:* ${anuuq.message.angin}`)
                break
            case 'kodepos':
                if (!q) return reply("_*Masukan Kabupaten/Kota contoh: !kodepos Surabaya_")
                reply(respon.wait());
                resfetch = await fetch(`https://api.xteam.xyz/kodepos?q=${q}&APIKEY=${apikey_xteam}`)
                news = ``
                for (let res of resfetch.result) {
                    news += `\n *Provinsi:* ${res.province}\n *Kota:* ${res.city}\n *Kecamatan:* ${res.subdistrict}\n *Urban:* ${res.urban}\n *Kodepos:* ${res.postalcode}\n`
                }
                reply(news)
                break
                break
            case 'sendsession':
            case 'sendsesi':
                aeron.sendMessage(from, {
                    document: {
                        url: './session.json'
                    },
                    mimetype: 'application/octet-stream',
                    fileName: 'session.json'
                })
                break
            case 'merdeka':
                if (!q) return reply(respon.wait());
                resfetch = await fetch(`https://r1ynz.herokuapp.com/docs/merdeka`)
                news = ``
                for (let res of resfetch.result) {
                    news += `\n *Title:* ${res.title}\n *Link:* ${res.link}\n *Image:* ${res.image}\n *Label:* ${res.label}\n *Date:* ${res.date}\n`
                }
                reply(news)
                break

            case 'antara':
                if (!q) return reply(respon.wait());
                resfetch = await fetch(`https://r1ynz.herokuapp.com/docs/antaranews`)
                news = ``
                for (let res of resfetch.result) {
                    news += `\n *Title:* ${res.title}\n *Link:* ${res.link}\n *Image:* ${res.image}\n *Label:* ${res.label}\n *Date:* ${res.date}\n`
                }
                reply(news)
                break
            case 'suara':
                if (!q) return reply(respon.wait());
                resfetch = await fetch(`https://r1ynz.herokuapp.com/docs/suaracom`)
                news = ``
                for (let res of resfetch.result) {
                    news += `\n *Title:* ${res.title}\n *Link:* ${res.link}\n *Image:* ${res.image}\n *Label:* ${res.label}\n *Date:* ${res.date}\n`
                }
                await aeron.sendMessage(from, {
                    text: news
                }, {
                    quoted: msg
                })
                break
            case 's':
            case 'sticker':
            case 'stiker':
            case 'sgif':
            case 'stickergif':
            case 'stikergif':
                try {
                    reply(respon.wait());
                    if (isMedia || isQuotedImage) {
                        var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
                        var buffer = Buffer.from([])
                        for await (const chunk of stream) {
                            buffer = Buffer.concat([buffer, chunk])
                        }
                        fs.writeFileSync('./rubbish/res_buffer.jpg', buffer)
                        const image = './rubbish/res_buffer.jpg'
                        await ffmpeg(image)
                            .input(image)
                            .on('start', function(start) {
                                console.log(colors.green.bold(`${start}`))
                            })
                            .on('error', function(error) {
                                reply("error")
                                console.log(`${error}`)
                            })
                            .on('end', function() {
                                console.log(colors.yellow('Selesai convert'))
                                aeron.sendMessage(from, {
                                    sticker: {
                                        url: './rubbish/mysticker.webp'
                                    },
                                    mimetype: 'image/webp'
                                })
                            })
                            .addOutputOptions([`-vcodec`, `libwebp`, `-vf`, `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
                            .toFormat('webp')
                            .save('./rubbish/mysticker.webp')
                    } else if (isMedia || isQuotedVideo) {
                        var stream = await downloadContentFromMessage(msg.message.videoMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
                        var buffer = Buffer.from([])
                        for await (const chunk of stream) {
                            buffer = Buffer.concat([buffer, chunk])
                        }
                        fs.writeFileSync('./rubbish/res_buffer.mp4', buffer)
                        const video = './rubbish/res_buffer.mp4'
                        await ffmpeg(video)
                            .input(video)
                            .on('start', function(start) {
                                console.log(colors.green.bold(`${start}`))
                            })
                            .on('error', function(error) {
                                reply("error")
                                console.log(`${error}`)
                            })
                            .on('end', function() {
                                console.log(colors.yellow('Selesai convert'))
                                aeron.sendMessage(from, {
                                    sticker: {
                                        url: './rubbish/mysticker2.webp'
                                    },
                                    mimetype: 'image/webp'
                                })
                            })
                            .addOutputOptions(["-vcodec", "libwebp", "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"])
                            .toFormat('webp')
                            .save('./rubbish/mysticker2.webp')
                    } else {
                        reply('_Kirim gambar/video dengan caption !sticker/ reply gambar/video dengan perintah !sticker_ ')
                    }
                } catch (e) {
                    console.log(colors.red(e))
                    reply("_Maaf error, coba lagi dengan reply gambar/video dengan caption !sticker, *jika tetap terjadi lapor ke owner bot*_")
                }
                break
            case 'covid':
            case 'corona':
                if (!q) return reply("_Masukan negara contoh: !covid Indonesia_")
                if (!q) return reply(respon.wait());
                const anu = await fetch(`https://covid19.mathdro.id/api/countries/${q}`)
                reply(`*Confirmed:* ${anu.confirmed.value}\n*Recovered:* ${anu.recovered.value}\n*Deaths:* ${anu.deaths.value}\n*Last Update:* ${anu.lastUpdate}`)
                break
            case 'wpml':
            case 'wallml':
            case 'wallpaperml':
            case 'wallpapermobilelegends':
                reply(respon.wait());
                aeron.sendMessage(from, {
                    image: {
                        url: "https://r1ynz.herokuapp.com/docs/wpml"
                    },
                    mimetype: 'image/jpeg',
                    jpegThumbnail: false
                }, {
                    quoted: msg,
                });
                break
            case 'hidetag':
                if (!q) return reply(respon.notText(prefix, cmd, pushname));
                if (!isGroup) return reply(respon.onlyGroup(pushname));
                if (!isGroupAdmins) return reply(respon.onlyAdmin(pushname));
                const id = uwong.map(v => v.id)
                aeron.sendMessage(from, {
                    text: `${q}`,
                    mentions: id
                })
                break
            case 'editinfo':
            case 'editinfogroup':
            case 'editinfogrup':
                if (!isGroup) return reply(respon.onlyGroup(pushname));
                if (!isGroupAdmins) return reply(respon.onlyAdmin(pushname));
                if (!isBotGroupAdmins) return reply(respon.botAdmin(pushname));

                if (args[0] === 'all') {
                    await aeron.groupSettingUpdate(from, 'unlocked')
                } else if (args[0] === 'admin') {
                    await aeron.groupSettingUpdate(from, 'locked')
                } else {
                    const buttons = [{
                            buttonId: '!editinfo admin',
                            buttonText: {
                                displayText: 'Only admin'
                            },
                            type: 1
                        },
                        {
                            buttonId: '!editinfo all',
                            buttonText: {
                                displayText: 'All members'
                            },
                            type: 1
                        },
                    ]
                    const buttonMessage = {
                        text: "Klik Only admin untuk mengizinkan edit grup hanya admin, Klik All members untuk mengizinkan edit group untuk semua peserta group",
                        footer: `${copyright}`,
                        buttons: buttons,
                        headerType: 1
                    }
                    const sendMsg = await aeron.sendMessage(from, buttonMessage)
                }
                break
            case 'antilink':
                if (!isGroup) return reply(respon.onlyGroup(pushname));
                if (!isGroupAdmins) return reply(respon.onlyAdmin(pushname));
                if (!isBotGroupAdmins) return reply(respon.botAdmin(pushname));

                if (args[0] === 'on') {
                    antilink.push(from)
                    fs.writeFileSync('./database/hehe/antilink.json', JSON.stringify(antilink))
                    reply('_Antilink berhasil dinyalakan_')
                } else if (args[0] === 'off') {
                    antilink.splice(from, 1)
                    fs.writeFileSync('./database/hehe/antilink.json', JSON.stringify(antilink))
                    reply('_Antilink berhasil dimatikan_')
                } else {
                    const buttons = [{
                            buttonId: '!antilink on',
                            buttonText: {
                                displayText: 'Antilink on'
                            },
                            type: 1
                        },
                        {
                            buttonId: '!antilink off',
                            buttonText: {
                                displayText: 'Antilink off'
                            },
                            type: 1
                        },
                    ]
                    const buttonMessage = {
                        text: "Tekan antilink on untuk menyalakan, tekan antilink off untuk mematikan",
                        footer: `${copyright}`,
                        buttons: buttons,
                        headerType: 1
                    }
                    const sendMsg = await aeron.sendMessage(from, buttonMessage)
                }
                break
            case 'group':
            case 'grup':
                if (!isGroup) return reply(respon.onlyGroup(pushname));
                if (!isGroupAdmins) return reply(respon.onlyAdmin(pushname));
                if (!isBotGroupAdmins) return reply(respon.botAdmin(pushname));

                if (args[0] === 'close') {
                    await aeron.groupSettingUpdate(from, 'announcement')
                } else if (args[0] === 'open') {
                    await aeron.groupSettingUpdate(from, 'not_announcement')
                } else {
                    const buttons = [{
                            buttonId: '!group open',
                            buttonText: {
                                displayText: 'Open'
                            },
                            type: 1
                        },
                        {
                            buttonId: '!group close',
                            buttonText: {
                                displayText: 'Close'
                            },
                            type: 1
                        },
                    ]

                    const buttonMessage = {
                        text: "Klik open untuk membuka group, Klik close untuk menutup group\n\n Klik Only admin untuk mengizinkan edit grup hanya admin, Klik All members untuk mengizinkan edit group untuk semua peserta group",
                        footer: `${copyright}`,
                        buttons: buttons,
                        headerType: 1
                    }

                    const sendMsg = await aeron.sendMessage(from, buttonMessage)

                }
                break
            case 'promote':
                if (!isGroup) return reply(respon.onlyGroup(pushname));
                if (!isGroupAdmins) return reply(respon.onlyAdmin(pushname));
                if (!isBotGroupAdmins) return reply(respon.botAdmin(pushname));
                if (msg.message.extendedTextMessage === undefined || msg.message.extendedTextMessage === null) return reply('Tag orang yang ingin dipromosikan menjadi admin group');
                const men = msg.message.extendedTextMessage.contextInfo.mentionedJid;
                aeron.groupParticipantsUpdate(from, men, "promote");
                break
            case 'demote':
                if (!isGroup) return reply(respon.onlyGroup(pushname));
                if (!isGroupAdmins) return reply(respon.onlyAdmin(pushname));
                if (!isBotGroupAdmins) return reply(respon.botAdmin(pushname));
                if (msg.message.extendedTextMessage === undefined || msg.message.extendedTextMessage === null) return reply('Tag orang yang ingin di demote di group ini');
                const mention = msg.message.extendedTextMessage.contextInfo.mentionedJid;
                await aeron.groupParticipantsUpdate(from, mention, "demote");
                break
            case 'add':
                try {
                    if (!isGroup) return reply(respon.onlyGroup(pushname));
                    if (!isGroupAdmins) return reply(respon.onlyAdmin(pushname));
                    if (!isBotGroupAdmins) return reply(respon.botAdmin(pushname));
                    if (!q) return reply("Masukan nomor yang ingin ditambahkan di group\nex: !add 62881xxxxxxx")
                    nomor = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
                    await aeron.groupParticipantsUpdate(from, [nomor], "add")
                } catch (e) {
                    reply('Maaf error')
                }
                break
            case 'kick':
                try {
                    if (!isGroup) return reply(respon.onlyGroup(pushname));
                    if (!isGroupAdmins) return reply(respon.onlyAdmin(pushname));
                    if (!isBotGroupAdmins) return reply(respon.botAdmin(pushname));
                    if (msg.message.extendedTextMessage === undefined || msg.message.extendedTextMessage === null) return reply('Tag orang yang ingin dikeluarkan dari group ini')
                    const mention = msg.message.extendedTextMessage.contextInfo.mentionedJid
                    await aeron.groupParticipantsUpdate(from, mention, "remove")
                } catch (e) {
                    reply('Maaf error')
                }
                break

            case 'resetlink':
            case 'revoke':
                if (!isGroup) return reply(respon.onlyGroup(pushname));
                if (!isGroupAdmins) return reply(respon.onlyAdmin(pushname));
                if (!isBotGroupAdmins) return reply(respon.botAdmin(pushname));
                await aeron.groupRevokeInvite(from)
                break
            case 'linkgroup':
                if (!isGroup) return reply(respon.onlyGroup(pushname));
                if (!isGroupAdmins) return reply(respon.onlyAdmin(pushname));
                if (!isBotGroupAdmins) return reply(respon.botAdmin(pushname));
                const code = await aeron.groupInviteCode(from)
                reply("https://chat.whatsapp.com/" + code)
                break
            case 'setdesc':
                if (!isGroup) return reply(respon.onlyGroup(pushname));
                if (!isGroupAdmins) return reply(respon.onlyAdmin(pushname));
                if (!isBotGroupAdmins) return reply(respon.botAdmin(pushname));
                if (!q) return reply(respon.notText(prefix, cmd, pushname));
                sock.groupUpdateDescription(from, q)
                break
            case 'setname':
                if (!isGroup) return reply(respon.onlyGroup(pushname));
                if (!isGroupAdmins) return reply(respon.onlyAdmin(pushname));
                if (!isBotGroupAdmins) return reply(respon.botAdmin(pushname));
                if (!q) return reply(respon.notText(prefix, cmd, pushname));
                aeron.groupUpdateSubject(from, q);
                break
            case 'owner':
                const vcard = 'BEGIN:VCARD\n' +
                    'VERSION:3.0\n' +
                    'FN:ԾЩ刀乇尺\n' +
                    'TEL;type=CELL;type=VOICE;waid=6285648294105:+62 856 4829 4105\n' +
                    'END:VCARD';
                const sentMsg = await aeron.sendMessage(from, {
                    contacts: {
                        contacts: [{
                            vcard
                        }]
                    }
                });
                break
            case 'donasi':
            case 'donate':
                const donasi = `
•°•°•°•°•°•°•°•°•°•°•°•°•°•°•°•

*Indosat* 0856-4829-4105
*Dana* 0856-4829-4105
*Gopay* 0856-4829-4105

•°•°•°•°•°•°•°•°•°•°•°•°•°•°•°•
`
                reply(donasi)
                break

            default:
        }
    } catch (e) {
        console.log(`${e}`)
    }
}