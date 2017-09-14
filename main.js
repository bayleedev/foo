webpackJsonp([44],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(70);
	module.exports = __webpack_require__(548);


/***/ }),

/***/ 338:
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */
	
	if (process.env.NODE_ENV !== 'production') {
	  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
	    Symbol.for &&
	    Symbol.for('react.element')) ||
	    0xeac7;
	
	  var isValidElement = function(object) {
	    return typeof object === 'object' &&
	      object !== null &&
	      object.$$typeof === REACT_ELEMENT_TYPE;
	  };
	
	  // By explicitly using `prop-types` you are opting into new development behavior.
	  // http://fb.me/prop-types-in-prod
	  var throwOnDirectAccess = true;
	  module.exports = __webpack_require__(173)(isValidElement, throwOnDirectAccess);
	} else {
	  // By explicitly using `prop-types` you are opting into new production behavior.
	  // http://fb.me/prop-types-in-prod
	  module.exports = __webpack_require__(339)();
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(84)))

/***/ }),

/***/ 339:
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */
	
	'use strict';
	
	var emptyFunction = __webpack_require__(174);
	var invariant = __webpack_require__(175);
	var ReactPropTypesSecret = __webpack_require__(177);
	
	module.exports = function() {
	  function shim(props, propName, componentName, location, propFullName, secret) {
	    if (secret === ReactPropTypesSecret) {
	      // It is still safe when called from React.
	      return;
	    }
	    invariant(
	      false,
	      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
	      'Use PropTypes.checkPropTypes() to call them. ' +
	      'Read more at http://fb.me/use-check-prop-types'
	    );
	  };
	  shim.isRequired = shim;
	  function getShim() {
	    return shim;
	  };
	  // Important!
	  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
	  var ReactPropTypes = {
	    array: shim,
	    bool: shim,
	    func: shim,
	    number: shim,
	    object: shim,
	    string: shim,
	    symbol: shim,
	
	    any: shim,
	    arrayOf: getShim,
	    element: shim,
	    instanceOf: getShim,
	    node: shim,
	    objectOf: getShim,
	    oneOf: getShim,
	    oneOfType: getShim,
	    shape: getShim
	  };
	
	  ReactPropTypes.checkPropTypes = emptyFunction;
	  ReactPropTypes.PropTypes = ReactPropTypes;
	
	  return ReactPropTypes;
	};


/***/ }),

/***/ 359:
/***/ (function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ }),

/***/ 360:
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }),

/***/ 548:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(145);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(187);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _propTypes = __webpack_require__(338);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	var _RainbowListDelegate = __webpack_require__(549);
	
	var RainbowListDelegate = _interopRequireWildcard(_RainbowListDelegate);
	
	__webpack_require__(551);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } ////////////////////////////////////////////////////////////////////////////////
	// Exercise:
	//
	// Write a <ListView> that only shows the elements in the view.
	//
	// Got extra time?
	//
	// - Render fewer rows as the size of the window changes (Hint: Listen
	//   for the window's "resize" event)
	// - Try rendering a few rows above and beneath the visible area to
	//   prevent tearing when scrolling quickly
	// - Remember scroll position when you refresh the page ////////////////////////////////////////////////////////////////////////////// import React from 'react'
	
	
	var id = 0;
	
	var RainbowList = function (_React$Component) {
	  _inherits(RainbowList, _React$Component);
	
	  function RainbowList(props) {
	    _classCallCheck(this, RainbowList);
	
	    var _this = _possibleConstructorReturn(this, (RainbowList.__proto__ || Object.getPrototypeOf(RainbowList)).call(this, props));
	
	    _this.state = {
	      start: Date.now(),
	      iterations: 0,
	      diff: 0,
	      coinToss: 0
	    };
	    return _this;
	  }
	
	  _createClass(RainbowList, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this2 = this;
	
	      id = setInterval(function () {
	        if (_this2.state.iterations >= 10) {
	          console.log('done!', Date.now() - _this2.state.start);
	          clearInterval(id);
	          return;
	        }
	
	        _this2.setState({
	          iterations: _this2.state.iterations + 1,
	          diff: Math.round(Math.random() * 10),
	          coinToss: Math.round(Math.random() * 1000) % 2 });
	      }, 0);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props = this.props,
	          numRows = _props.numRows,
	          rowHeight = _props.rowHeight,
	          renderRowAtIndex = _props.renderRowAtIndex;
	      var _state = this.state,
	          diff = _state.diff,
	          coinToss = _state.coinToss;
	
	      var totalHeight = numRows * rowHeight;
	
	      var items = [];
	
	      var index = 0;
	      var rowCount = numRows + diff * (coinToss ? -1 : 1);
	      while (index < rowCount) {
	        var num = Math.round(Math.random() * 200);
	        items.push(_react2.default.createElement(
	          'li',
	          null,
	          renderRowAtIndex(num)
	        ));
	        index++;
	      }
	
	      return _react2.default.createElement(
	        'div',
	        { style: { height: '100%', overflowY: 'scroll' } },
	        _react2.default.createElement(
	          'div',
	          null,
	          'Count: ',
	          this.state.iterations
	        ),
	        _react2.default.createElement(
	          'ol',
	          { style: { height: totalHeight } },
	          items
	        )
	      );
	    }
	  }]);
	
	  return RainbowList;
	}(_react2.default.Component);
	
	RainbowList.propTypes = {
	  numRows: _propTypes2.default.number.isRequired,
	  rowHeight: _propTypes2.default.number.isRequired,
	  renderRowAtIndex: _propTypes2.default.func.isRequired
	};
	
	
	_reactDom2.default.render(_react2.default.createElement(RainbowList, {
	  numRows: 1000,
	  rowHeight: RainbowListDelegate.rowHeight,
	  renderRowAtIndex: RainbowListDelegate.renderRowAtIndex
	}), document.getElementById('app'));

/***/ }),

/***/ 549:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.renderRowAtIndex = exports.rowHeight = undefined;
	
	var _react = __webpack_require__(145);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _convertNumberToEnglish = __webpack_require__(550);
	
	var _convertNumberToEnglish2 = _interopRequireDefault(_convertNumberToEnglish);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var computeHSLRainbowColor = function computeHSLRainbowColor(n, period) {
	  return 'hsl(' + Math.round(n / period * 360) + ',100%,50%)';
	};
	
	var rowHeight = exports.rowHeight = 30;
	
	var renderRowAtIndex = exports.renderRowAtIndex = function renderRowAtIndex(index) {
	  var tag = Math.round(Math.random() * 1000) % 2 ? 'div' : 'p';
	  var style = {
	    height: rowHeight,
	    color: computeHSLRainbowColor(index, 100),
	    fontSize: 24,
	    padding: '5px 10px'
	  };
	  return _react2.default.createElement(tag, { style: style }, (0, _convertNumberToEnglish2.default)(index + 1));
	};

/***/ }),

/***/ 550:
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
	var tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
	var teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
	
	var convertTens = function convertTens(n) {
	  if (n < 10) return ones[n];
	
	  if (n >= 10 && n < 20) return teens[n - 10];
	
	  return tens[Math.floor(n / 10)] + ' ' + ones[n % 10];
	};
	
	var convertHundreds = function convertHundreds(n) {
	  if (n > 99) return ones[Math.floor(n / 100)] + ' hundred ' + convertTens(n % 100);
	
	  return convertTens(n);
	};
	
	var convertThousands = function convertThousands(n) {
	  if (n >= 1000) return convertHundreds(Math.floor(n / 1000)) + ' thousand ' + convertHundreds(n % 1000);
	
	  return convertHundreds(n);
	};
	
	var convertMillions = function convertMillions(n) {
	  if (n >= 1000000) return convertMillions(Math.floor(n / 1000000)) + ' million ' + convertThousands(n % 1000000);
	
	  return convertThousands(n);
	};
	
	var convertNumberToEnglish = function convertNumberToEnglish(n) {
	  return n === 0 ? 'zero' : convertMillions(n);
	};
	
	exports.default = convertNumberToEnglish;

/***/ }),

/***/ 551:
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(552);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(360)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../node_modules/css-loader/index.js!./styles.css", function() {
				var newContent = require("!!../../node_modules/css-loader/index.js!./styles.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),

/***/ 552:
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(359)();
	// imports
	
	
	// module
	exports.push([module.id, "html {\n  box-sizing: border-box;\n}\n*, *:before, *:after {\n  box-sizing: inherit;\n}\n\nbody {\n  margin: 0;\n  padding: 0;\n  background: #333;\n}\n\nol {\n  list-style-type: none;\n  margin: 0;\n  padding: 0;\n}\n", ""]);
	
	// exports


/***/ })

});
//# sourceMappingURL=RenderOptimizations-exercise.js.map
