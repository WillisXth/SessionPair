const PastebinAPI = require('pastebin-js'),
pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL')
const {makeid} = require('./id');
const QRCode = require('qrcode');
const express = require('express');
const path = require('path');
const fs = require('fs');
let router = express.Router()
const pino = require("pino");
const {
	default: Winsper_Tech,
	useMultiFileAuthState,
	jidNormalizedUser,
	Browsers,
	delay,
	makeInMemoryStore,
} = require("maher-zubair-baileys");

function removeFile(FilePath) {
	if (!fs.existsSync(FilePath)) return false;
	fs.rmSync(FilePath, {
		recursive: true,
		force: true
	})
};
const {
	readFile
} = require("node:fs/promises")
router.get('/', async (req, res) => {
	const id = makeid();
	async function WILLIS_MD_QR_CODE() {
		const {
			state,
			saveCreds
		} = await useMultiFileAuthState('./temp/' + id)
		try {
			let Qr_Code_By_Winsper_Tech = Winsper_Tech({
				auth: state,
				printQRInTerminal: false,
				logger: pino({
					level: "silent"
				}),
				browser: Browsers.macOS("Desktop"),
			});

			Qr_Code_By_Winsper_Tech.ev.on('creds.update', saveCreds)
			Qr_Code_By_Winsper_Tech.ev.on("connection.update", async (s) => {
				const {
					connection,
					lastDisconnect,
					qr
				} = s;
				if (qr) await res.end(await QRCode.toBuffer(qr));
				if (connection == "open") {
					await delay(5000);
					let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
					await delay(800);
				   let b64data = Buffer.from(data).toString('base64');
				   let session = await Qr_Code_By_Winsper_Tech.sendMessage(Qr_Code_By_Winsper_Tech.user.id, { text: 'WILLIS;;;' + b64data });
	
				   let WILLIS_MD_TEXT = `
_SESSION ID_
- You have successfully connected to WinsperTech.

- ABOVE is your session ID. COPY it as it will be required during deploy.

❒ Owner: Willis +254786273945

❒ Group: https://chat.whatsapp.com/KlFKWN3QWq04DKeAdjk8gw

❒ Channel: https://whatsapp.com/channel/0029VaZ8Q0Y1XquZ673Uvs0m

❒ Github: https://github.com/WinsperTech

❒ YouTube: www.youtube.com/@WillisKE

Good Luck ✅
_____________________________________

https://github.com/WinsperTech
_____________________________________

_Don't Forget To Give Star To My Repo_`
	 await Qr_Code_By_Winsper_Tech.sendMessage(Qr_Code_By_Winsper_Tech.user.id,{text: WILLIS_MD_TEXT},{quoted:session})



					await delay(100);
					await Qr_Code_By_Winsper_Tech.ws.close();
					return await removeFile("temp/" + id);
				} else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
					await delay(10000);
					WILLIS_MD_QR_CODE();
				}
			});
		} catch (err) {
			if (!res.headersSent) {
				await res.json({
					code: "Service Unavailable"
				});
			}
			console.log(err);
			await removeFile("temp/" + id);
		}
	}
	return await WILLIS_MD_QR_CODE()
});
module.exports = router
