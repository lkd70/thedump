'use strict';

const axios = require('axios');
const FormData = require('form-data');
const config = require('../config').telegram;
const {	convertWebmToMp4 } = require('./convert');
const fs = require('fs');
const Logger = require('./logger');

const telegram = axios.create({
	baseURL: `https://api.telegram.org/bot${config.token}`,
	responseType: 'json'
});

const sendPhoto = (media, chat, caption = '') => new Promise((resolve, reject) =>
	telegram(
		`/sendPhoto?chat_id=${chat}&photo=${media}&caption=${caption}`
	).then(resolve).catch(err => {
		if (err.statusCode === 429) {
			resolve(sendPhoto(media, chat, caption));
		} else {
			Logger.error(err);
			reject(err);
		}
	}));

const sendAnimation = (media, chat) => new Promise((resolve, reject) =>
	telegram(`/sendAnimation?chat_id=${chat}&animation=${media}`).then(resolve).catch(err => {
		if (err.statusCode === 429) {
			resolve(sendAnimation(media, chat));
		} else {
			Logger.error(err);
			reject(err);
		}
	}));

const sendVideo = (media, chat) => new Promise(resolve => {
	convertWebmToMp4(media).then(path => {
		const form = new FormData();
		form.append('video', fs.createReadStream(path));
		telegram.post(`/sendVideo?chat_id=${chat}`, form, {
			headers: form.getHeaders()
		}).then(() => fs.unlink(path, err => {
			if (err) {
				Logger.error(err);
				resolve(true);
			} else {
				// posted vid - deleted local
				resolve(true);
			}
		})).catch(err => {
			Logger.error(err);
			if (err.statusCode === 429) {
				resolve(sendVideo(media));
			} else {
				resolve(true);
			}
		});
	}).catch(() => {
		Logger.error('Conversion error');
		resolve(true);
	});
});

const sendMedia = post => {
	Logger.info('Posting:', post);
	if (post.reddit) {
		if (post.hint === 'image') {
			const caption = `Title: ${post.title}\nAuthor: ${post.author}\n` +
				`Link: reddit.com${post.perma}`;
			return sendPhoto(post.url, post.chat, encodeURIComponent(caption));
		}
		return Promise.resolve();
	} else {
		const sm = post.type === '.webm' ? sendVideo
			: post.type === '.gif' ? sendAnimation : sendPhoto;

		return sm(`https://i.4cdn.org/${post.board}/${post.time}${post.type}`, post.chat);
	}
};

module.exports = { sendMedia };
