'use strict';

const pathToFfmpeg = require('ffmpeg-static');
const os = require('os');
const { exec } = require('child_process');
const { join } = require('path');
const { genFileName } = require('./filesystem');

const convertWebmToMp4 = url => new Promise((resolve, reject) => {
	try {
		const file = join(os.tmpdir(), genFileName() + '.mp4');
		exec(`${pathToFfmpeg} -i ${url} ${file}`, err => {
			if (err) {
				reject(err);
			} else {
				resolve(file);
			}
		});
	} catch (err) {
		reject(err);
	}
});

module.exports = { convertWebmToMp4 };
