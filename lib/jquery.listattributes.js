jQuery.fn.listAttributes = function(prefix) {
	var list = [];
	$(this).each(function() {
		// console.info(this);
		var attributes = [];
		for(var key in this.attributes) {
			if(!isNaN(key)) {
				if(!prefix || this.attributes[key].name.substr(0,prefix.length) == prefix) {
					attributes.push(this.attributes[key].name);
				}
			}
		}
		list.push(attributes);
	});
	return (list.length > 1 ? list : list[0]);
};
