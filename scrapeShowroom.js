const fetch = require("node-fetch");
const fs = require("fs");
const list_jkt = require("./list_JKT.json")


var scrapeShowroom = {
	servers: [
		{
			name: "46g",
			to: "nogizaka46",
			url: "https://campaign.showroom-live.com/nogizaka46_sr/data/rooms.json",
			group: [
				"regularMember",
				"fourthGeneration"
			]
		},
		{
			name: "46g",
			to: "sakurazaka46",
			url: "https://campaign.showroom-live.com/sakurazaka46_sr/data/rooms.json",
			group: [
				"roomUrlsFirstGeneration",
				"roomUrlsSecondGeneration"
			]
		},
		{
			name: "46g",
			to: "hinatazaka46",
			url: "https://campaign.showroom-live.com/hinatazaka46_sr/data/rooms.json",
			group: [
				"roomUrlsFirstGeneration",
				"roomUrlsSecondGeneration",
				"roomUrlsThirdGeneration"
			]
		},
		{
			name: "nearly_equal_joy",
			to: "nearly_equal_joy",
			url: "https://campaign.showroom-live.com/Nearlyequal_JOY/data/rooms.js"
		},
		{
			name: "equal_love",
			to: "equal_love",
			url: "https://campaign.showroom-live.com/Equal_LOVE/data/rooms.js"
		},
		{
			name: "notequal_me",
			to: "notequal_me",
			url: "https://campaign.showroom-live.com/Notequal_ME/data/rooms.js"
		},
		{
			name: "48g",
			to: null,
			url: "https://campaign.showroom-live.com/akb48_sr/data/rooms.json",
			group: [
				"akb48",
				"ske48",
				"nmb48",
				"hkt48",
				"ngt48",
				"stu48",
				"jkt48"
			]
		}
	],
	former: {
		name: "former",
		to: "former",
		members: require("./former.json").data.map(e => { return e.room_url_key })
	},
	caching: [],
	execute: async function(callback) {
		for (const obj of this.servers) {
			const res = await fetch(obj.url);
			if (obj.url.includes(".json")) {
				var data = await res.json()
			} else {
				var data = await res.text();

				eval(data);
				data = roomUrls;
			}

			if (obj.name !== "48g") {
				var list = []
				if (obj.group) {
					obj.group.map(e => {
						const newlist = obj.name == "48g" ? data[e][0]["rooms"] : data[e];
						list = [...list, ...newlist];
					})
				} else {
					list = data;
				}
				const newObj = {
					name: obj.name,
					to: obj.to,
					members: list
				};

				this.caching.push(newObj);
			} else if (obj.name == "48g") {
				var list = []
				obj.group.map(e => {
					const newlist = e == "jkt48"? list_jkt.data :data[e][0]["rooms"];
					const newObj = {
						name: obj.name,
						to: e,
						members: newlist
					};
					this.caching.push(newObj);
				})
			}
		}
		this.caching.push(this.former);

		const dat = {
			data: this.caching
		}

		fs.writeFile("./caching_group.json", JSON.stringify(dat, null, 4), "utf8", () => { });
		return callback(this);
	}

}

module.exports = scrapeShowroom;