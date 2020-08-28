'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const Logger = require('./logger');

const RANDOM_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function _randomChars(howMany) {
	const value = [];
	let rnd = null;

	try {
		rnd = crypto.randomBytes(howMany);
	} catch (e) {
		rnd = crypto.pseudoRandomBytes(howMany);
	}

	for (let i = 0; i < howMany; i++) {
		value.push(RANDOM_CHARS[rnd[i] % RANDOM_CHARS.length]);
	}

	return value.join('');
}

const genTempFileName = () => path.join(os.tmpdir(), _randomChars(10));

const genTempFile = (ext = '.mp4') => new Promise(resolve => {
	const file_name = genTempFileName();
	if (fs.existsSync(file_name + ext)) path.resolve(genTempFile(ext));
	Logger.info(`genTempFile() generated: ${file_name}`);
	resolve(file_name + ext);
});

module.exports = {
	genTempFile
};
