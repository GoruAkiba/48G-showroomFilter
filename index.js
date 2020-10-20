const superagent = require("superagent");
const fetch = require("node-fetch");
const {substract} = require("./utils.js");
// setInterval(do_update,30000)
// async function do_update(){
// 	const sh = showroom;
// 	console.log(await sh.execute())
// }

// scrape list of room
( async ()=>{
	const scrape = require("./scrapeShowroom.js");
	await scrape.execute(e=>{
		require("./webserver.js");
	})
})();
// webserver

// console.log()



// (async ()=>{
	//  const sh = showroom;
	// console.log( await sh.get_data())
	// .lives
	// .shift();
	// console.log(sh.caching.lives[0].streaming_url_list);
	// console.log(sh.to_remove);

	// const g48 = "https://campaign.showroom-live.com/akb48_sr/data/rooms.json";
	// const res = await fetch(g48);
	// const dats = await res.json();

	// var res = await scrape.execute();
	// console.log(res.caching);

	// dats.each(e=>console.log(e));

	// var c = [1,2,3,4,5,6,7,8,9],
	// 		d = [3,6,1];

	// console.log(substract(c,d))
// })()




