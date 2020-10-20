var utils = {
	"substract": function(a,b){
    if(!a.length || !b.length) return [];
			return a.filter((e)=>{
					const test = e.room_url_key? e.room_url_key: e;
					return !b.includes(e);
			})
	}
}

module.exports = utils;