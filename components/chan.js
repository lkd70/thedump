'use strict';

const axios = require('axios');

const chan = axios.create({
	baseURL: 'https://a.4cdn.org',
	responseType: 'json'
});


const getCatalog = board => new Promise((resolve, reject) => {
	chan.get(`/${board}/catalog.json`).then(c => {
		resolve(c.data.map(t => t.threads).flat(1));
	}).catch(reject);
});

const getThread = (board, thread) => chan.get(`/${board}/thread/${thread}.json`);

module.exports = {
	getCatalog,
	getThread,
};
