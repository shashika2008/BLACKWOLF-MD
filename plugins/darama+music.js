/**
 * YouTube Downloader Bot
 * Audio: mp3
 * Video: mp4 (360p / 720p / 1080p)
 */

const { cmd } = require('../command')
const yts = require('yt-search')
const ytdl = require('ytdl-core')

//==================== AUDIO ====================//
cmd({
  pattern: "play2",
  desc: "Download YouTube songs as MP3",
  react: "🎵",
  category: "download",
  filename: __filename
},
async (conn, mek, m, { from, q, pushname, reply }) => {
  try {
    if (!q) return reply("Please give me a song name or YouTube URL")

    const search = await yts(q)
    if (!search.videos || search.videos.length === 0) {
      return reply("No results found, try another keyword.")
    }

    const data = search.videos[0]
    const url = data.url

    let desc = `
*⦁ MUSIC DOWNLOADER ⦁*

🎵 *MUSIC FOUND!* 

➥ *Title:* ${data.title} 
➥ *Duration:* ${data.timestamp} 
➥ *Views:* ${data.views} 
➥ *Uploaded On:* ${data.ago} 
➥ *Link:* ${data.url} 

🎧 *ENJOY THE MUSIC!*
`
    await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek })

    // Download audio
    const info = await ytdl.getInfo(url)
    const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' })

    // Send as audio
    await conn.sendMessage(from, {
      audio: { url: format.url },
      mimetype: "audio/mpeg"
    }, { quoted: mek })

    // Send as document
    await conn.sendMessage(from, {
      document: { url: format.url },
      mimetype: "audio/mpeg",
      fileName: `${data.title}.mp3`,
      caption: "*© Powered by Your Botname*"
    }, { quoted: mek })

  } catch (e) {
    console.log(e)
    reply(`_Hi ${pushname}, retry later_`)
  }
})


//==================== VIDEO ====================//
cmd({
  pattern: "darama",
  alias: ["video2"],
  desc: "Download YouTube videos (360p/720p/1080p)",
  react: "🎥",
  category: "download",
  filename: __filename
},
async (conn, mek, m, { from, q, args, pushname, reply }) => {
  try {
    if (!q) return reply("Please give me a video name or YouTube URL")

    const search = await yts(q)
    if (!search.videos || search.videos.length === 0) {
      return reply("No results found, try another keyword.")
    }

    const data = search.videos[0]
    const url = data.url

    // Quality selection
    let quality = "360" // default
    if (args[1] && ["360","720","1080"].includes(args[1])) quality = args[1]

    let desc = `
*⦁ VIDEO DOWNLOADER ⦁*

🎥 *VIDEO FOUND!* 

➥ *Title:* ${data.title} 
➥ *Duration:* ${data.timestamp} 
➥ *Views:* ${data.views} 
➥ *Uploaded On:* ${data.ago} 
➥ *Link:* ${data.url} 

🎬 *Downloading in ${quality}p ...*
`
    await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek })

    // Video download
    const info = await ytdl.getInfo(url)
    let format = info.formats.find(f => f.qualityLabel === quality + "p" && f.container === "mp4")

    if (!format) {
      format = ytdl.chooseFormat(info.formats, { quality: '18' }) // fallback 360p
      reply(`⚠️ ${quality}p not available, sending default quality.`)
    }

    // Send as video
    await conn.sendMessage(from, {
      video: { url: format.url },
      mimetype: "video/mp4"
    }, { quoted: mek })

    // Send as document
    await conn.sendMessage(from, {
      document: { url: format.url },
      mimetype: "video/mp4",
      fileName: `${data.title}.mp4`,
      caption: "*© Powered by blacwolf*"
    }, { quoted: mek })

  } catch (e) {
    console.log(e)
    reply(`_Hi ${pushname}, retry later_`)
  }
})
