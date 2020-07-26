'use strict';

const DataStore = require('nedb');

const db = new DataStore({ filename: './store/posts.db', autoload: true });

const chanPostExists = post => new Promise((resolve, reject) => db.findOne({
	chat: post.chat,
	md5: post.md5,
}, (err, doc) => {
	if (err) {
		if (debug) console.error(err);
		reject(err);
	} else {
		resolve(doc !== null);
	}
}));

const redditPostExists = post => new Promise((resolve, reject) => db.findOne({
	reddit: true,
	subreddit_id: post.subreddit_id,
	id: post.id,
}, (err, doc) => {
	if (err) {
		if (debug) console.error(err);
		reject(err);
	} else {
		resolve(doc !== null);
	}
}));

const addPost = (post) => new Promise((resolve, reject) => {
	db.insert(post, (err, doc) => {
		if (err) reject(err);
		resolve(doc);
	});
});

module.exports = {
	chanPostExists,
	redditPostExists,
	addPost
};
