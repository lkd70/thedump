'use strict';

const debug = require('../config').debug;
const pathToFfmpeg = require('ffmpeg-static');
const { exec } = require('child_process');
const { genTempFile } = require('./filesystem');

const convertWebmToMp4 = url => new Promise((resolve, reject) => {
	genTempFile().then(file => {
		exec(`${pathToFfmpeg} -i ${url} ${file}`, err => {
			if (err) {
				if (debug) console.log('error: ', err);
				reject(err);
			} else {
				resolve(file);
			}
		});
	});
});

module.exports = { convertWebmToMp4 };
