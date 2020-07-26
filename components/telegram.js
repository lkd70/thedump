'use strict';

const axios = require('axios');
const FormData = require('form-data');
const config = require('../config').telegram;
const debug = require('../config').debug;
const {	convertWebmToMp4 } = require('./convert');
const fs = require('fs');
const { promises } = require('dns');

const telegram = axios.create({
	baseURL: `https://api.telegram.org/bot${config.token}`,
	responseType: 'json'
});

const sendPhoto = (media, chat, caption = '') => new Promise((resolve, reject) =>
	telegram(
		`/sendPhoto?chat_id=${chat}&photo=${media}&caption=${caption}`
	).then(resolve).catch(err => {
		if (err.statusCode === 429) {
			if (debug) console.log('Posting failed due to cooldown. Trying again shortly');
			resolve(sendPhoto(media, chat, caption));
		} else {
			reject(err);
		}
	}));

const sendAnimation = (media, chat) => new Promise((resolve, reject) =>
	telegram(`/sendAnimation?chat_id=${chat}&animation=${media}`).then(resolve).catch(err => {
		if (err.statusCode === 429) {
			if (debug) console.log('Posting failed due to cooldown. Trying again shortly');
			resolve(sendAnimation(media, chat));
		} else {
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
				if (debug) console.log('Error in deleting: ', err);
				resolve(true);
			} else {
				// posted vid - deleted local
				resolve(true);
			}
		})).catch(err => {
			if (err.statusCode === 429) {
				if (debug) console.log('Posting failed due to cooldown. Trying again shortly');
				resolve(sendVideo(media));
			} else {
				if (debug) console.log('Unknown error (1): ', err);
				resolve(true);
			}
		});
	}).catch(() => {
		console.error('convert error');
		// Convert failed for some reason, resolve for now
		resolve(true);
	});
});

const sendMedia = post => {
	if (post.reddit) {
		if (post.hint === 'image') {
			const caption = `Title: ${post.title}\nAuthor: ${post.author}\n` +
				`Link: reddit.com${post.perma}`;
			return sendPhoto(post.url, post.chat, encodeURIComponent(caption));
		}
		return Promise.resolve();
	} else {
		if (debug) console.log('Posting: ', post);
		const sm = post.type === '.webm' ? sendVideo
			: post.type === '.gif' ? sendAnimation : sendPhoto;

		return sm(`https://i.4cdn.org/${post.board}/${post.time}${post.type}`, post.chat);
	}
};

module.exports = { sendMedia };
