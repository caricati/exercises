
const isFunction = (parameter) => parameter instanceof Function;

module.exports = function(val) {
  while(isFunction(val)) {
    val = val();
  }

  return val
}