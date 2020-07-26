'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

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

const genFileName = () => path.join(os.tmpdir(), _randomChars(10));

const createTempFile = (data, ext) => new Promise(resolve => {
	const file = genFileName() + ext;
	fs.writeFileSync(file, data, err => {
		if (err) {
			resolve(createTempFile(data, ext));
		} else {
			resolve(file);
		}
	});
});

module.exports = {
	createTempFile
};
