const pick = (object, keys) => {
	return keys.reduce((obj, key) => {
		if (object && Object.prototype.hasOwnProperty.call(object, key)) {
			obj[key] = object[key];  // Using const here, no eslint-disable needed
		}
		return obj;
	}, {});
};

module.exports = pick;