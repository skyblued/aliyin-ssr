

const http = require('axios');

/**
 * 取得缩放指定倍数后的坐标
 * @param  {[type]} params    rect
 * @param  {[type]} baseIndex 基点索引
 */
export function getScaledRect(params, baseIndex) {
	var { x, y, width, height, scale } = params;
	var offset = {
	  x: 0,
	  y: 0
	};
	var deltaXScale = scale.x - 1;
	var deltaYScale = scale.y - 1;
	var deltaWidth = width * deltaXScale;
	var deltaHeight = height * deltaYScale;
	var newWidth = width + deltaWidth;
	var newHeight = height + deltaHeight;
	var newX = x - deltaWidth / 2;
	var newY = y - deltaHeight / 2
	if (baseIndex) {
	  var points = [{x, y}, {x: x+ width, y}, {x: x + width, y: y+ height}, {x, y: y+ height}];
	  var newPoints = [{x: newX, y: newY}, {x: newX+ newWidth, y: newY}, {x: newX + newWidth, y: newY+ newHeight}, {x: newX, y: newY+ newHeight}];
	  offset.x = points[baseIndex].x - newPoints[baseIndex].x;
	  offset.y = points[baseIndex].y - newPoints[baseIndex].y;
	}
	return {
	  x: newX + offset.x,
	  y: newY + offset.y,
	  width: newWidth,
	  height: newHeight
	}
  }

/**
 * 获取旋转指定角度的rect
 * @param {Object} options rect
 * @param {Number} angle 旋转角度
 */
export function getTransform (options, angle) {
	var x = options.x;
	var y = options.y;
	var width = options.width;
	var height = options.height;

	var r = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2;
	var a = Math.round(Math.atan(height / width) * 180 / Math.PI);
	var tlbra = 180 - angle - a;
	var trbla = a - angle;
	var ta = 90 - angle;
	var ra = angle;

	var halfWidth = width / 2;
	var halfHeight = height / 2;

	var middleX = x + halfWidth;
	var middleY = y + halfHeight;

	var topLeft = {
		x: middleX + r * Math.cos(tlbra * Math.PI / 180),
		y: middleY - r * Math.sin(tlbra * Math.PI / 180)
	};
	var top = {
		x: middleX + halfHeight * Math.cos(ta * Math.PI / 180),
		y: middleY - halfHeight * Math.sin(ta * Math.PI / 180),
	};
	var topRight = {
		x: middleX + r * Math.cos(trbla * Math.PI / 180),
		y: middleY - r * Math.sin(trbla * Math.PI / 180)
	};
	var right = {
		x: middleX + halfWidth * Math.cos(ra * Math.PI / 180),
		y: middleY + halfWidth * Math.sin(ra * Math.PI / 180),
	};
	var bottomRight = {
		x: middleX - r * Math.cos(tlbra * Math.PI / 180),
		y: middleY + r * Math.sin(tlbra * Math.PI / 180)
	};
	var bottom = {
		x: middleX - halfHeight * Math.sin(ra * Math.PI / 180),
		y: middleY + halfHeight * Math.cos(ra * Math.PI / 180),
	}
	var bottomLeft = {
		x: middleX - r * Math.cos(trbla * Math.PI / 180),
		y: middleY + r * Math.sin(trbla * Math.PI / 180)
	};
	var left = {
		x: middleX - halfWidth * Math.cos(ra * Math.PI / 180),
		y: middleY - halfWidth * Math.sin(ra * Math.PI / 180),
	}
	var minX = Math.min(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x);
	var maxX = Math.max(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x);
	var minY = Math.min(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y);
	var maxY = Math.max(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y);
	return {
		point: [topLeft, top, topRight, right, bottomRight, bottom, bottomLeft, left],
		width: maxX - minX,
		height: maxY - minY,
		left: minX,
		right: maxX,
		top: minY,
		bottom: maxY
	}
}

/**
	   * 根据缩放基点和缩放比例取得新的rect
	   * @param  {[type]} oPoint               [description]
	   * @param  {[type]} scale            [description]
	   * @param  {[type]} oTransformedRect [description]
	   * @param  {[type]} baseIndex        [description]
	   * @return {[type]}                  [description]
	   */
export function getNewRect(oPoint, scale, oTransformedRect, baseIndex) {
		var scaledRect = getScaledRect({
		  x: oPoint.x,
		  y: oPoint.y,
		  width: oPoint.width,
		  height: oPoint.height,
		  scale: scale
		});
		var transformedRotateRect = getTransform(scaledRect, oPoint.rotate);
		// 计算到平移后的新坐标
		var translatedX = oTransformedRect.point[baseIndex].x - transformedRotateRect.point[baseIndex].x + transformedRotateRect.left;
		var translatedY = oTransformedRect.point[baseIndex].y - transformedRotateRect.point[baseIndex].y + transformedRotateRect.top;
  
		// 计算平移后元素左上角的坐标
		var newX = translatedX + transformedRotateRect.width / 2 - scaledRect.width / 2;
		var newY = translatedY + transformedRotateRect.height / 2 - scaledRect.height / 2;
  
		// 缩放后元素的高宽
		var newWidth = scaledRect.width;
		var newHeight = scaledRect.height;
  
		return {
		  x: newX,
		  y: newY,
		  width: newWidth,
		  height: newHeight
		};
	  }

 /**
	 * 取得鼠标释放点在rect8点坐标中的对应点及其对角线点
	 * @param  {[type]} point [description]
	 * @param  {[type]} ex    [description]
	 * @param  {[type]} ey    [description]
	 */
export	function getPointAndOpposite(point, ex, ey) {
		let oppositePoint = {};
		let currentPoint = {};

		let minDelta = 1000;
		let currentIndex = 0;
		let oppositeIndex = 0;

		point.forEach((p, index) => {
			const delta = Math.sqrt(Math.pow(p.x-ex, 2) + Math.pow(p.y-ey, 2))
			if (delta < minDelta) {
			currentPoint = p;
			currentIndex = index;
			minDelta = delta;
			// 对角线点index相差4
			let offset = 4;
			let oIndex = index - offset;
			if (oIndex < 0) {
				oIndex = index + offset;
			}
			// 取对角线点坐标
			oppositePoint = point.slice(oIndex, oIndex + 1)[0];
			oppositeIndex = oIndex;
			}
		});

		return {
			current: {
			index: currentIndex,
			point: currentPoint
			},
			opposite: {
			index: oppositeIndex,
			point: oppositePoint
			}
		};
	}

/**
	 * 获取点的鼠标手势
	 * @param  {Number} degree [description]
	 * @return {Array}        [description]
	 */
export function getNewCursorArray(degree) {
		const cursorStyleArray = ['ns-resize', 'nesw-resize', 'ew-resize', 'nwse-resize', 'ns-resize', 'nesw-resize', 'ew-resize', 'nwse-resize'];

		const ARR_LENGTH = 8;
		const STEP = 45;

		let startIndex = 0;

		if (degree) {
			startIndex = Math.floor(degree / STEP);
			if (degree % STEP > (STEP / 2)) {
			startIndex += 1;
			}
		}

		if (startIndex > 1) {
			const len = ARR_LENGTH - startIndex;
			return (cursorStyleArray.slice(startIndex, startIndex + len))
					.concat(cursorStyleArray.slice(0, startIndex));
		}

		return cursorStyleArray;
	}

/**
 * path解析
 * @param {String} str 后台生成的path 字符串
 * @return {String} newStr 解析后的path
 */

export function resolver (str) {
	var arr = [], arr2 = [], arrXY = [];
	// console.log(str)

	var reg = /#glyph\d{1,}-\d{1,}/ig ; // 所有的引用
	var reg1 = /glyph\d{1,}-\d{1,}/ig; // 所有的id
	var reg2 = /<path.*\/>/ig; // 所有的path
	var reg3 = /\bx=".*?"/ig; // 所有的x
	var reg4 = /\by=".*?"/ig; //所有的y
	while(true) {
		var s = reg.exec(str);

		var s3 = reg3.exec(str);
		var s4 = reg4.exec(str);

		if(s === null) break;

		arr.push(s[0]);
		arrXY.push(Number(s3[0].slice(3,-1)) + ',' + Number(s4[0].slice(3,-1)))
		i++;
	}
	// console.log(arr)
	// console.log(arrXY)
	
	while(true) {
				
		var s1 = reg1.exec(str);
		var s2 = reg2.exec(str);

		if(s2 === null) break;
		// console.log(s2[0].indexOf('<path d='))
		if(s2[0].indexOf('<path d=') != -1) break;
		arr2['#' + s1[0]] = s2[0]
		
	}
	// console.log(arr2)

	var newStr = '';

	for(var i = 0; i < arr.length; i++){
		// 获取每个路径的下标
		var index = arr[i];

		// console.log(index)
		// 给每个path添加transform属性
		newStr += arr2[index].replace('<path', `<path transform='translate(${arrXY[i]})'`);//  data-index=${index}

		
	}
	// console.log(newStr)
	// 返回新的path字符串
	return newStr;
}



/**瀑布流计算
 * @param {Element} node 父元素
 */
export function setWaterfall(node) {
		var box = node;
		var items = box.children;
		// 定义每一列之间的间隙 为10像素
		var gap = 10;

		// 1- 确定列数  = 页面的宽度 / 图片的宽度
		var pageWidth = box.offsetWidth;
		var itemWidth = items[0].offsetWidth;
		var columns = parseInt(pageWidth / (itemWidth + gap));
		// console.log(columns)
		var arr = []
		for(var i=0;i<items.length;i++) {
			if(i<columns){
				// 2- 确定第一行
				items[i].style.top = gap + 'px';
				items[i].style.left = (itemWidth + gap) * i + 'px';
				arr.push(items[i].offsetHeight);
			} else {
				// 其他行
				// 3- 找到数组中最小高度  和 它的索引
				var minHeight = arr[0];
				var index = 0;
				for (var j = 0; j < arr.length; j++) {
					if (minHeight > arr[j]) {
						minHeight = arr[j];
						index = j;
					}
				}
				// 4- 设置下一行的第一个盒子位置
				// top值就是最小列的高度 + gap
				let left = 0;
				// console.log(i)
				if (i > 6) left = -10;
				items[i].style.top = arr[index] + gap + left + 'px';
				// left值就是最小列距离左边的距离
				items[i].style.left = items[index].offsetLeft + 'px';
				// 5- 修改最小列的高度 
				// 最小列的高度 = 当前自己的高度 + 拼接过来的高度 + 间隙的高度
				arr[index] = arr[index] + items[i].offsetHeight + gap;
			}
		}
}





