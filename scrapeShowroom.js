const fetch = require("node-fetch");
const fs = require("fs");


var scrapeShowroom = {
	servers : [
		{
			name : "46g",
			to : "nogizaka46",
			url: "https://campaign.showroom-live.com/nogizaka46_sr/data/rooms.json",
			group : [
				"regularMember",
				"fourthGeneration"
				]
		},
		{
			name : "46g",
			to : "keyakizaka46",
			url : "https://campaign.showroom-live.com/keyakizaka46_sr/data/rooms.json",
			group : [
				"roomUrlsFirstGeneration",
				"roomUrlsSecondGeneration"
				]
		},
		{
			name : "46g",
			to : "hinatazaka46",
			url : "https://campaign.showroom-live.com/hinatazaka46_sr/data/rooms.json",
			group : [
				"roomUrlsFirstGeneration",
				"roomUrlsSecondGeneration",
				"roomUrlsThirdGeneration"
				]
		},
		{
			name : "48g",
			to : null,
			url : "https://campaign.showroom-live.com/akb48_sr/data/rooms.json",
			group : [
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
	former:{
		name : "former",
		to : "former",
		members : require("./former.json").data.map(e=>{return e.room_url_key} )
	},
	caching : [],
	execute : async function(callback){
		for(const obj of this.servers){
			const res = await fetch(obj.url);
			const data = await res.json();

			if(obj.name !== "48g"){
				var list = []
				obj.group.map(e =>{
					const newlist = obj.name == "48g"? data[e][0]["rooms"] : data[e];
					list = [...list, ...newlist];
				})
				const newObj = {
					name : obj.name,
					to : obj.to,
					members : list
				};

				this.caching.push(newObj);
			} else if(obj.name == "48g"){
				var list = []
				obj.group.map(e =>{
					const newlist = data[e][0]["rooms"];
					const newObj = {
						name : obj.name,
						to : e,
						members : newlist
					};
					this.caching.push(newObj);
				})
			}
		}

		this.caching.push(this.former);

		const dat = {
			data : this.caching
		}

		fs.writeFile("./caching_group.json", JSON.stringify(dat,null,4),"utf8",()=>{});
		return callback(this);
	}
		
}

module.exports = scrapeShowroom;