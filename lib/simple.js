import path from 'path';
import fs from 'fs';
import util from 'util';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';
import chalk from 'chalk';
import PhoneNumber from 'awesome-phonenumber';
import { fileTypeFromBuffer } from 'file-type';
import sizeOf from 'image-size';
import NodeCache from '@cacheable/node-cache';
import { LRUCache } from 'lru-cache';

import store from './store.js';
import { toAudio, toPTT } from './converter.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @type {import('baileys')}
 */
import MakeWASocket, {
	isLidUser,
	isPnUser,
	isJidGroup,
	proto,
	delay,
	downloadContentFromMessage,
	jidDecode,
	areJidsSameUser,
	generateForwardMessageContent,
	generateWAMessageFromContent,
	generateWAMessage,
	getBinaryNodeChild,
	WAMessageStubType,
	extractMessageContent,
	prepareWAMessageMedia,
	S_WHATSAPP_NET,
} from 'baileys';

export function makeWASocket(connectionOptions, options = {}) {
	/**
	 * @type {import('baileys').WASocket}
	 */
	let conn = MakeWASocket(connectionOptions);

	const mediaCache = new LRUCache({
		maxSize: 150 * 1024 * 1024,
		ttl: 1000 * 60 * 10,
		ttlAutopurge: true,
		updateAgeOnGet: true,
		updateAgeOnHas: false,
		allowStale: false,
		sizeCalculation: (value) => (value == null ? 0 : Buffer.isBuffer(value) ? value.length : Buffer.byteLength(typeof value === 'object' ? JSON.stringify(value) || '' : String(value))),
	});

	conn.isLid = new NodeCache({
		stdTTL: 60 * 60,
	});

	const OrigMsg = conn.sendMessage.bind(conn);
	let sock = Object.defineProperties(conn, {
		chats: {
			value: { ...(options.chats || {}) },
			writable: true,
		},
		sendMessage: {
			value(jid, content, options = {}) {
				return OrigMsg(
					jid,
					{
						...content,
						streamingSidecar: 'Omw4hLediba3yg==',
						annotations: [
							{
								embeddedContent: {
									embeddedMusic: {
										musicContentMediaId: 12,
										songId: 11,
										author: global.author,
										title: global.namebot,
										artistAttribution: 'https://github.com/AgusXzz/ChiiMD',
									},
								},
								embeddedAction: true,
							},
						],
						mentions: content.mentions || conn.parseMention(content?.text || content?.caption || ''),
					},
					{
						...options,
						useCachedGroupMetadata: options.useCachedGroupMetadata || true,
					}
				);
			},
		},
		decodeJid: {
			value(jid) {
				if (!jid || typeof jid !== 'string') return (!nullish(jid) && jid) || null;
				return jid.decodeJid();
			},
		},
		profilePictureUrl: {
			async value(jid, type = 'image', query = 'url') {
				try {
					const result = await conn.query(
						{
							tag: 'iq',
							attrs: {
								target: jid,
								to: 's.whatsapp.net',
								type: 'get',
								xmlns: 'w:profile:picture',
							},
							content: [{ tag: 'picture', attrs: { type, query } }],
						},
						15000
					);
					const child = getBinaryNodeChild(result, 'picture');
					return child?.content || child?.attrs?.url;
				} catch {
					return query == 'buffer' ? fs.readFileSync(path.resolve(__dirname, '../media/avatar_contact.png')) : 'https://telegra.ph/file/24fa902ead26340f3df2c.png';
				}
			},
		},
		getJid: {
			value(jid) {
				jid = conn.decodeJid(jid);
				if (isPnUser(jid)) return jid;

				const cached = conn.isLid.get(jid);
				if (cached) return cached;

				for (const chat of Object.values(conn.chats)) {
					const user = chat?.metadata?.participants?.find((p) => p.lid === jid || p.id === jid);

					if (user) {
						const pn = user.phoneNumber || user.jid || user.id;
						conn.isLid.set(jid, pn);
						return pn;
					}
				}

				return jid;
			},
		},
		getLid: {
			value(jid) {
				jid = conn.decodeJid(jid);
				if (isLidUser(jid)) return jid;
				const keys = conn.isLid.keys();

				for (const key of keys) {
					const val = conn.isLid.get(key);
					if (val === jid) return key;
				}

				return jid;
			},
		},
		logger: {
			get() {
				let dates = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
				return {
					info(...args) {
						console.log(chalk.bold.bgRgb(51, 204, 51)('INFO '), `[${chalk.rgb(255, 255, 255)(dates)}]:`, chalk.cyan(util.format(...args)));
					},
					error(...args) {
						console.log(chalk.bold.bgRgb(247, 38, 33)('ERROR '), `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`, chalk.rgb(255, 38, 0)(util.format(...args)));
					},
					warn(...args) {
						console.log(chalk.bold.bgRgb(255, 153, 0)('WARNING '), `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`, chalk.redBright(util.format(...args)));
					},
					trace(...args) {
						console.log(chalk.grey('TRACE '), `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`, chalk.white(util.format(...args)));
					},
					debug(...args) {
						console.log(chalk.bold.bgRgb(66, 167, 245)('DEBUG '), `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`, chalk.white(util.format(...args)));
					},
				};
			},
			enumerable: true,
		},
		getFile: {
			/**
			 * getBuffer hehe
			 * @param {fs.PathLike} PATH
			 * @param {Boolean} saveToFile
			 */
			async value(PATH, saveToFile = false) {
				const mediaKey = getKey(typeof PATH === 'string' ? PATH : Buffer.isBuffer(PATH) ? PATH : String(PATH));
				const cached = mediaCache.get(mediaKey);
				if (cached) return cached;
				let res, filename;

				const data = Buffer.isBuffer(PATH)
					? PATH
					: PATH instanceof ArrayBuffer
						? PATH.toBuffer()
						: /^data:.*?\/.*?;base64,/i.test(PATH)
							? Buffer.from(PATH.split`,`[1], 'base64')
							: /^https?:\/\//.test(PATH)
								? (res = Buffer.from(await (await fetch(PATH)).arrayBuffer()))
								: fs.existsSync(PATH)
									? ((filename = PATH), fs.readFileSync(PATH))
									: typeof PATH === 'string'
										? PATH
										: Buffer.alloc(0);
				if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer');
				const type = (await fileTypeFromBuffer(data)) || { mime: 'application/octet-stream', ext: '.bin' };
				if (data && saveToFile && !filename) ((filename = path.join(__dirname, '../tmp/' + new Date() * 1 + '.' + type.ext)), await fs.promises.writeFile(filename, data));
				const result = {
					res,
					filename,
					...type,
					data,
					deleteFile() {
						return filename && fs.promises.unlink(filename);
					},
				};
				mediaCache.set(mediaKey, result);
				return result;
			},
			enumerable: true,
		},
		sendFile: {
			/**
			 * Send Media/File with Automatic Type Specifier
			 * @param {String} jid
			 * @param {String|Buffer} path
			 * @param {String} filename
			 * @param {String} caption
			 * @param {import('baileys').proto.WebMessageInfo} quoted
			 * @param {Boolean} ptt
			 * @param {Object} options
			 */
			async value(jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) {
				const mediaKey = getKey(path);
				const cached = mediaCache.get(mediaKey);
				if (cached) return conn.sendMessage(jid, { forward: cached }, { quoted });

				let type = await conn.getFile(path, true);
				let { res, data: file, filename: pathFile } = type;
				if ((res && res.status !== 200) || file.length <= 65536) {
					try {
						throw {
							json: JSON.parse(file.toString()),
						};
					} catch (e) {
						if (e.json) throw e.json;
					}
				}
				const fileSize = fs.statSync(pathFile).size / 1024 / 1024;
				if (fileSize >= 100) throw new Error('File size is too big!');
				let opt = {};
				if (quoted) opt.quoted = quoted;
				if (!type) options.asDocument = true;
				let mtype = '',
					mimetype = options.mimetype || type.mime,
					convert;
				if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker';
				else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image';
				else if (/video/.test(type.mime)) mtype = 'video';
				else if (/audio/.test(type.mime) || options.asAudio)
					((convert = await (ptt ? toPTT : toAudio)(file, type.ext)), (file = convert.data), (pathFile = convert.filename), (mtype = 'audio'), (mimetype = options.mimetype || 'audio/mpeg'));
				else mtype = 'document';
				if (options.asDocument) mtype = 'document';

				delete options.asSticker;
				delete options.asLocation;
				delete options.asVideo;
				delete options.asDocument;
				delete options.asImage;

				let message = {
					...options,
					caption,
					ptt,
					[mtype]: { url: pathFile },
					mimetype,
					fileName: filename || pathFile.split('/').pop(),
				};
				/**
				 * @type {import('baileys').proto.WebMessageInfo}
				 */
				let m;
				try {
					m = await conn.sendMessage(jid, message, { ...opt, ...options });
				} catch (e) {
					console.error(e);
					m = null;
				} finally {
					if (!m) m = await conn.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options });
					file = null; // releasing the memory
				}
				mediaCache.set(mediaKey, m);
				return m;
			},
			enumerable: true,
		},
		sendSticker: {
			async value(jid, path, quoted, options = {}) {
				const mediaKey = getKey(path);
				const cached = mediaCache.get(mediaKey);
				if (cached) return conn.sendMessage(jid, { forward: cached }, { quoted });
				const { data, mime } = await conn.getFile(path);
				if (data.length === 0) throw new TypeError('File tidak ditemukan');
				const exif = { packName: options.packname || global.stickpack, packPublish: options.packpublish || global.stickauth };
				const sticker = await (await import('./exif.js')).writeExif({ mimetype: mime, data }, exif);
				const m = await conn.sendMessage(jid, { sticker }, { quoted });
				mediaCache.set(mediaKey, m);
				return m;
			},
		},
		sendMedia: {
			/**
			 * Send Media/File with Automatic Type Specifier
			 * @param {String} jid
			 * @param {String|Buffer} path
			 * @param {String} filename
			 * @param {String} caption
			 * @param {import('baileys').proto.WebMessageInfo} quoted
			 * @param {Boolean} ptt
			 * @param {Object} options
			 */
			async value(jid, path, quoted, options = {}) {
				let { mime, data } = await conn.getFile(path);
				let messageType = mime.split('/')[0];
				let pase = messageType.replace('application', 'document') || messageType;
				return conn.sendMessage(jid, { [`${pase}`]: data, mimetype: mime, ...options }, { quoted });
			},
		},
		sendAlbum: {
			async value(jid, medias = [], options = {}) {
				if (medias.length < 2) throw new Error('Album minimal berisi 2 media.');

				const media = [];

				for (const item of medias) {
					const url = typeof item === 'string' ? item : item.url;
					const caption = typeof item === 'object' ? item.caption : '';

					let file;
					try {
						file = await conn.getFile(url);
					} catch {
						continue;
					}

					const mime = file.mime;
					const data = file.data;
					if (!mime || !data) continue;

					const type = mime.split('/')[0];

					if (type === 'image') {
						media.push({
							image: data,
							caption,
						});
					} else if (type === 'video') {
						media.push({
							video: data,
							caption,
						});
					} else {
						continue;
					}
				}

				return conn.sendAlbumMessage(jid, media, options);
			},
		},
		sendAlbumMessage: {
			async value(jid, medias, options = {}) {
				const userJid = conn.user?.id;
				if (!Array.isArray(medias) || medias.length < 2) throw new Error('Album minimal berisi 2 media.');

				const delayTime = options.delay || 5000;
				delete options.delay;

				const album = generateWAMessageFromContent(
					jid,
					{
						albumMessage: {
							expectedImageCount: medias.filter((m) => m.image).length,
							expectedVideoCount: medias.filter((m) => m.video).length,
							...options,
						},
					},
					{
						userJid,
						...options,
					}
				);

				await conn.relayMessage(jid, album.message, { messageId: album.key.id });

				for (const media of medias) {
					const content = media.image ? { image: media.image, ...media } : media.video ? { video: media.video, ...media } : null;

					if (!content) continue;

					const msg = await generateWAMessage(jid, content, {
						userJid,
						upload: (readStream, opts) => conn.waUploadToServer(readStream, opts),
						...options,
					});

					if (msg) {
						msg.message.messageContextInfo = {
							messageAssociation: {
								associationType: 1,
								parentMessageKey: album.key,
							},
						};
					}

					await conn.relayMessage(jid, msg.message, { messageId: msg.key.id });
					await delay(delayTime);
				}

				return album;
			},
		},
		sendButton: {
			async value(jid, content = {}, options = {}) {
				const header = {};
				if (content.image) {
					const media = await prepareWAMessageMedia({ image: content.image }, { upload: conn.waUploadToServer });
					header.hasMediaAttachment = true;
					header.imageMessage = media.imageMessage;
				} else if (content.video) {
					const media = await prepareWAMessageMedia({ video: content.video }, { upload: conn.waUploadToServer });
					header.hasMediaAttachment = true;
					header.videoMessage = media.videoMessage;
				} else if (content.document) {
					const media = await prepareWAMessageMedia({ document: content.document }, { upload: conn.waUploadToServer });
					header.hasMediaAttachment = true;
					header.documentMessage = media.documentMessage;
				}

				const interactive = {
					header: Object.keys(header).length ? header : { hasMediaAttachment: false },
					body: { text: content.body || content.text || content.caption || '' },
				};
				if (content.footer) interactive.footer = { text: content.footer };
				if (content.buttons?.length) {
					interactive.nativeFlowMessage = {
						buttons: content.buttons,
						messageParamsJson: '',
					};
				}
				if (content.contextInfo) interactive.contextInfo = content.contextInfo;

				const msg = generateWAMessageFromContent(jid, { interactiveMessage: interactive }, options);

				await conn.relayMessage(jid, msg.message, {
					messageId: msg.key.id,
					additionalNodes: [
						{
							tag: 'biz',
							attrs: {},
							content: [
								{
									tag: 'interactive',
									attrs: { type: 'native_flow', v: '1' },
									content: [{ tag: 'native_flow', attrs: { v: '9', name: 'mixed' } }],
								},
							],
						},
					],
				});

				return msg;
			},
		},
		sendContact: {
			/**
			 * Send Contact
			 * @param {String} jid
			 * @param {String[][]|String[]} data
			 * @param {import('baileys').proto.WebMessageInfo} quoted
			 * @param {Object} options
			 */
			async value(jid, data, quoted, options) {
				if (!Array.isArray(data[0]) && typeof data[0] === 'string') data = [data];
				let contacts = [];
				for (let [number, name] of data) {
					number = number.replace(/[^0-9]/g, '');
					let njid = number + '@s.whatsapp.net';
					let biz = (await conn.getBusinessProfile(njid).catch((_) => null)) || {};
					let vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${name.replace(/\n/g, '\\n')};;;
FN:${name.replace(/\n/g, '\\n')}
TEL;type=CELL;type=VOICE;waid=${number}:${PhoneNumber('+' + number).getNumber('international')}${
						biz.description
							? `
X-WA-BIZ-NAME:${(conn.chats[njid]?.vname || conn.getName(njid) || name).replace(/\n/, '\\n')}
X-WA-BIZ-DESCRIPTION:${biz.description.replace(/\n/g, '\\n')}
`.trim()
							: ''
					}
END:VCARD
        `.trim();
					contacts.push({ vcard, displayName: name });
				}
				return conn.sendMessage(
					jid,
					{
						...options,
						contacts: {
							...options,
							displayName: (contacts.length >= 2 ? `${contacts.length} kontak` : contacts[0].displayName) || null,
							contacts,
						},
					},
					{
						quoted,
						...options,
					}
				);
			},
			enumerable: true,
		},
		reply: {
			/**
			 * Reply to a message
			 * @param {String} jid
			 * @param {String|Buffer} text
			 * @param {import('baileys').proto.WebMessageInfo} quoted
			 * @param {Object} options
			 */
			value(jid, text = '', quoted, options) {
				return Buffer.isBuffer(text)
					? conn.sendFile(jid, text, 'file', '', quoted, false, options)
					: conn.sendMessage(
							jid,
							{
								text,
								...options,
							},
							{
								quoted,
								...options,
							}
						);
			},
		},
		adReply: {
			async value(jid, text, path, quoted, options = {}) {
				const mediaKey = getKey(path);
				const url = options.source || global.source || '';
				let cached = mediaCache.get(mediaKey);

				if (!cached) {
					const { data } = await conn.getFile(path);

					const { imageMessage: img } = await prepareWAMessageMedia(
						{ image: data },
						{
							upload: conn.waUploadToServer,
							mediaTypeOverride: 'thumbnail-link',
						}
					);

					const { width, height } = sizeOf(data);

					cached = {
						img,
						width: width || 192,
						height: height || 192,
					};

					mediaCache.set(mediaKey, cached);
				}

				const { img, width, height } = cached;

				const msg = generateWAMessageFromContent(
					jid,
					{
						extendedTextMessage: {
							text: url + '\n' + text,
							matchedText: url,
							jpegThumbnail: '/AgusXzz',
							title: options.title || global.namebot,
							description: options.description || '',
							previewType: 0,
							thumbnailDirectPath: img.directPath,
							mediaKey: img.mediaKey,
							mediaKeyTimestamp: img.mediaKeyTimestamp,
							thumbnailWidth: width,
							thumbnailHeight: height,
							thumbnailSha256: img.fileSha256,
							thumbnailEncSha256: img.fileEncSha256,
						},
					},
					{ quoted }
				);

				await conn.relayMessage(jid, msg.message, {
					messageId: msg.key.id,
				});
				return msg;
			},
		},
		cMod: {
			/**
			 * cMod
			 * @param {String} jid
			 * @param {import('baileys').proto.WebMessageInfo} message
			 * @param {String} text
			 * @param {String} sender
			 * @param {*} options
			 * @returns
			 */
			value(jid, message, text = '', sender = conn.user.jid, options = {}) {
				if (options.mentions && !Array.isArray(options.mentions)) options.mentions = [options.mentions];
				let copy = message.toJSON();
				delete copy.message.messageContextInfo;
				delete copy.message.senderKeyDistributionMessage;
				let mtype = Object.keys(copy.message)[0];
				let msg = copy.message;
				let content = msg[mtype];
				if (typeof content === 'string') msg[mtype] = text || content;
				else if (content.caption) content.caption = text || content.caption;
				else if (content.text) content.text = text || content.text;
				if (typeof content !== 'string') {
					msg[mtype] = { ...content, ...options };
					msg[mtype].contextInfo = { ...(content.contextInfo || {}), mentionedJid: options.mentions || content.contextInfo?.mentionedJid || [] };
				}
				if (copy.participant) sender = copy.participant = sender || copy.participant;
				else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant;
				if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid;
				else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid;
				copy.key.remoteJid = jid;
				copy.key.fromMe = areJidsSameUser(sender, conn.user.id) || false;
				return proto.WebMessageInfo.create(copy);
			},
			enumerable: true,
		},
		copyNForward: {
			/**
			 * Exact Copy Forward
			 * @param {String} jid
			 * @param {import('baileys').proto.WebMessageInfo} message
			 * @param {Boolean|Number} forwardingScore
			 * @param {Object} options
			 */
			async value(jid, message, forwardingScore = true, options = {}) {
				let vtype;
				if (options.readViewOnce && message.message.viewOnceMessage?.message) {
					vtype = Object.keys(message.message.viewOnceMessage.message)[0];
					delete message.message.viewOnceMessage.message[vtype].viewOnce;
					message.message = proto.Message.create(JSON.parse(JSON.stringify(message.message.viewOnceMessage.message)));
					message.message[vtype].contextInfo = message.message.viewOnceMessage.contextInfo;
				}
		
