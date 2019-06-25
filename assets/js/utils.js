import Axios from 'axios';
import { saveAs } from "file-saver";



/**
 * 
 * @param {Array} arr 包含图片path
 */
export function getImagesArr(arr) { // 获取图片宽高
	if (typeof arr != "object") return resolve([])
	return Promise.all(Array.from(arr).map((item,i) => {
		return new Promise((resolve, reject)=> {
			let img = new Image();
			img.onload = (load) => {
				let data = load.path[0]
				
				item.url = data.src;
				item.width = data.width;
				item.height = data.height;
				resolve(item)
				img = null;
			}
			// img.src = store.state.port.imgBaseUrl + item.FilePath + (item.Svgtext == '' ? '!w300.src' : '')
		})
	}))
}

/**
 * 颜色转rgb
 * @param {string} sColor 颜色
 */
export function colorToRGB(sColor) {
	sColor = sColor.toLowerCase();
    //十六进制颜色值的正则表达式
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 如果是16进制颜色
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            var sColorNew = "#";
            for (var i=1; i<4; i+=1) {
                sColorNew += sColor.slice(i, i+1).concat(sColor.slice(i, i+1));    
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        var sColorChange = [];
        for (var i=1; i<7; i+=2) {
            sColorChange.push(parseInt("0x"+sColor.slice(i, i+2)));    
        }
        return "rgb(" + sColorChange.join(",") + ")";
    }
    return sColor;
}

/**
 * 将dom元素里面的图片转base64
 * @param {Element} node 一个dom元素 
 */
export function imageToBase(node) {
	let type = '', imageArr = [];
		imageArr = node.querySelectorAll('image');
	return Promise.all(Array.from(imageArr).map(function (image) {
		var href = image.getAttributeNS('http://www.w3.org/1999/xlink', 'href') || image.getAttribute('href');
		href = href.replace('http://img.aliyin.com', 'http://aliyinsrc.oss-cn-shenzhen.aliyuncs.com');
		// href += (href.indexOf('?') === -1 ? '?' : '&') + 't=' + new Date().valueOf();
		if (!href) return Promise.resolve(null);
		return new Promise(function (resolve, reject) {
			var canvas = document.createElement('canvas');
			var img = new Image();
			img.crossOrigin = 'anonymous';
			img.onerror = function () {
				return reject(new Error('找不到 ' + href));
			};
			img.onload = function () {
				canvas.width = img.width;
				canvas.height = img.height;
				canvas.getContext('2d').drawImage(img, 0, 0);
				image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', canvas.toDataURL('image/png'));
				resolve(true);
			};
			img.onerror = function() {
				resolve(true);
			}
			img.src = href;
		});
	}));
}


function img2base64(imgUrl) {
	Axios.get(imgUrl, {responseType: 'blob'})
	.then(res => {
		var blob = res;
          console.log("blob", blob)
          let oFileReader = new FileReader();
          oFileReader.onloadend = function (e) {
            let base64 = e.target.result;
            console.log("方式一》》》》》》》》》", base64)
          };
          oFileReader.readAsDataURL(blob);
          //====为了在页面显示图片，可以删除====
        //   var img = document.createElement("img");
        //   img.onload = function (e) {
        //     window.URL.revokeObjectURL(img.src); // 清除释放
        //   };
        //   let src = window.URL.createObjectURL(blob);
          img.src = src
 
	})
	
}