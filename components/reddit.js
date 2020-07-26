'use strict';

const axios = require('axios');

const r = axios.create({
	baseURL: 'https://www.reddit.com/r',
	responseType: 'json'
});

const getNew = (board, limit = 100) => new Promise((resolve, reject) => {
	r.get(`/${board}/new.json?limit=${limit}`).then(res => {
		resolve(res.data.data.children);
	}).catch(reject);
});

module.exports = {
	getNew
};
