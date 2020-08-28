'use strict';

const pathToFfmpeg = require('ffmpeg-static');
const { exec } = require('child_process');
const { genTempFile } = require('./filesystem');
const Logger = require('./logger');

const convertWebmToMp4 = url => new Promise((resolve, reject) => {
	genTempFile().then(file => {
		exec(`${pathToFfmpeg} -i ${url} ${file}`, err => {
			if (err) {
				Logger.error(err);
				reject(err);
			} else {
				resolve(file);
			}
		});
	});
});

module.exports = { convertWebmToMp4 };
