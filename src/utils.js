// Copyright © 2016 RTE Réseau de transport d’électricité
(function() {
  'use strict';

  module.exports.mergeOptions = mergeOptions;
  module.exports.toArray = toArray;
  module.exports.toFunction = toFunction;
  module.exports.prettyNumber = prettyNumber;

  /** Merge the properties of two objects. More precisely, if a property is
    * present in "defaults" but not in "options" it is copied in options. this
    * function is used to specified default options for a function.
    *
    * @param {object} options Option object
    * @param {object} defaults Object containing default values of options
    *
    * @return {object} Merged object.
    */
  function mergeOptions(options, defaults) {
    if (options) options = JSON.parse(JSON.stringify(options));
    else options = {};
    defaults = defaults || {};
    for (var opt in defaults) {
      if (defaults.hasOwnProperty(opt) && !options.hasOwnProperty(opt)) {
        options[opt] = defaults[opt];
      }
    }
    return options;
  }

  /** Converts parameter to Array. Used when user wants to pass a single value,
    * but a function expects an array.
    * @param {any} x An array or a scalar value
    * @return {any[]}
    * 'x' if it is an array, else an array with 'x' as its unique
    * element.
    */
  function toArray(x) {
    if (x.constructor !== Array) x = [x];
    return x;
  }

  /** Converts its argument in a function.
    * @param {any} x A function, an array, or a scalar.
    * @return {function}
    * - 'x' if it is a function.
    * - If 'x' is a scalar, it returns a function that always returns 'x'
    * - If 'x' is an array it returns the function (d, i) -> x[i]
    */
  function toFunction(x) {
    if (typeof x === "function") return (x);
    x = toArray(x);
    return function(d, i) {return x[i % x.length]};
  }

  /** Transforms a number in a pretty and small string
    * @param {number} number
    * @return {string}
    * A string representing the number. It only keeps at most 2 decimal
    * digits and it adds suffixes "K", "M", "B", "T" for large values.
    */
  function prettyNumber(number) {
    if (isNaN(number) || !isFinite(number)) return "";

    var absVal = Math.abs(number);
    var sign= number < 0? "-": "";
    var scale;

    if( absVal < 1000 ) {
        scale = '';
    } else if( absVal < 1000000 ) {
        scale = 'K';
        absVal = absVal/1000;

    } else if( absVal < 1000000000 ) {
        scale = 'M';
        absVal = absVal/1000000;

    } else if( absVal < 1000000000000 ) {
        scale = 'B';
        absVal = absVal/1000000000;

    } else if( absVal < 1000000000000000 ) {
        scale = 'T';
        absVal = absVal/1000000000000;
    }

    if (absVal > 10) absVal = roundTo(absVal);
    else if (absVal > 1) absVal = roundTo(absVal, 10, true);
    else absVal = roundTo(absVal, 100, true);

    return sign + absVal + scale;
  }

  /** Round a number
    * @param {number} number
    * @param {number} to: desired precision
    * @param {boolean} inverse If true, number is rounded at the 1 / 'to'
    */
  function roundTo(number, to, inverse) {
    to = to || 1;
    if (inverse) return Math.round(number * to) / to;
    else return Math.round(number / to) * to;
  }
}());
