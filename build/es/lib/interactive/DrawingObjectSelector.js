"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";

import { isDefined, noop, mapObject } from "../utils";
import { getMorePropsForChart } from "./utils";

import GenericComponent, { getMouseCanvas } from "../GenericComponent";

var DrawingObjectSelector = function (_Component) {
	_inherits(DrawingObjectSelector, _Component);

	function DrawingObjectSelector(props) {
		_classCallCheck(this, DrawingObjectSelector);

		var _this = _possibleConstructorReturn(this, (DrawingObjectSelector.__proto__ || Object.getPrototypeOf(DrawingObjectSelector)).call(this, props));

		_this.handleClick = _this.handleClick.bind(_this);
		return _this;
	}

	_createClass(DrawingObjectSelector, [{
		key: "handleClick",
		value: function handleClick(moreProps, e) {
			e.preventDefault();
			var _props = this.props,
			    enabled = _props.enabled,
			    getInteractiveNodes = _props.getInteractiveNodes,
			    drawingObjectMap = _props.drawingObjectMap;
			var onSelect = this.props.onSelect;

			if (!enabled) return;

			var interactives = mapObject(getInteractiveNodes(), function (each) {
				var key = drawingObjectMap[each.type];
				var valueArray = each.node.props[key];

				var valuePresent = isDefined(valueArray) && Array.isArray(valueArray) && valueArray.length > 0;
				if (valuePresent) {
					// console.log("Value present for ", each.type, each.chartId);
					var morePropsForChart = getMorePropsForChart(moreProps, each.chartId);

					var objects = each.node.getSelectionState(morePropsForChart);

					return {
						type: each.type,
						chartId: each.chartId,
						objects: objects
					};
				}
				return {
					type: each.type,
					chartId: each.chartId,
					objects: []
				};
			});
			onSelect(interactives, moreProps, e);
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(GenericComponent, {
				svgDraw: noop,
				canvasToDraw: getMouseCanvas,
				canvasDraw: noop,

				onClick: this.handleClick,

				drawOn: ["mousemove", "pan", "drag"]
			});
		}
	}]);

	return DrawingObjectSelector;
}(Component);

DrawingObjectSelector.propTypes = {
	getInteractiveNodes: PropTypes.func.isRequired,
	onSelect: PropTypes.func.isRequired,
	drawingObjectMap: PropTypes.object.isRequired,
	enabled: PropTypes.bool.isRequired
};

DrawingObjectSelector.defaultProps = {
	enabled: true
};

export default DrawingObjectSelector;