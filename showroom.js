const fetch = require('node-fetch');
const { substract } = require('./utils.js');
var showroom = {
	main_server: 'https://www.showroom-live.com/api/live/onlives',
	info_server: 'https://www.showroom-live.com/api/room/profile',
	stream_server: 'https://www.showroom-live.com/api/live/streaming_url',
	status_server: "https://www.showroom-live.com/api/room/status",
	caching: {},
	list_group: [],
	last_fetch: [],
	to_remove: [],
	to_update: [],
	get_data: async function() {
		this.list_group = require('./caching_group.json').data;
		const res = await fetch(this.main_server);
		const data = await res.json();
		// console.log(data.onlives[2]);

		// lookup for specific genre
		// 111 => global
		// 102 => idol
		// 103 => talent
		var lives_raw = ([111,102,103]).reduce((A,B) => {
			const subject_data = data.onlives.find(onlive => onlive.genre_id == B);
			return [...A, ...subject_data.lives];
		},[]);

		var lives = lives_raw.filter(e => {
			if (e.room_id) {
				e['to'] = this.whatGroup(e.room_url_key);
				return true;
			}
		});
		// console.log(lives)
		// lives.shift();
		this.caching = lives;
		return this;
	},
	whatGroup: function(e) {
		for (const group of this.list_group) {
			if (group.members.includes(e)) {
				return group.to;
			}
		}
		return 'other';
	},
	execute: async function() {
		console.log(this.last_fetch.sort());
		// relocated last list
		if (this.caching.length && !this.last_fetch.length) {
			this.last_fetch = this.caching.map(e => {
				return e.room_id;
			});
		}

		// request new data
		await this.get_data();
		var cached = this.caching.map(e => {
			return e.room_id;
		});
		this.to_remove = substract(this.last_fetch, cached);
		const tmp_last_fetch = substract(this.last_fetch, this.to_remove);
		this.to_update = substract(cached, tmp_last_fetch);
		this.last_fetch = cached;
		return {
			to_remove: this.to_remove,
			to_update: this.caching.filter(e => {
				if (this.to_update.includes(e.room_id)) {
					e['to'] = this.whatGroup(e.room_url_key);
					return true;
				}
			})
		};
	},
	getInfo: async function(id) {
		if (!id) return {};
		const p_res = await fetch(`${this.info_server}?room_id=${id}`);
		const p_dat = await p_res.json();

		const r_res = await fetch(
			`${this.stream_server}?room_id=${id}&ignore_low_stream=1&abr_available=1`
		);
		const r_dat = await r_res.json();

		const status = await fetch(
			this.status_server + `?room_url_key=${await p_dat.room_url_key}`
		);
		const status_dat = await status.json();
		var bk = status_dat.broadcast_key;

		const dat = { ...p_dat, ...r_dat, bk };
		return dat;
	}
};

module.exports = showroom;
