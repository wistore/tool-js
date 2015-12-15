/*******************************
 *
 * date 	@2015/11/27
 * author 	@Jack Fan
 * desc 	@tools func 本工具函数包不依赖任何框架，采用原生javascript实现
 *
 * ******************************/

;(function() {

    var TOOL = {};

    // 匹配手机号码的正则
    TOOL.REG_PHONE = /^((\(\d{2,3}\))|(\d{3}\-))?(13|15|18|14|17)\d{9}$/;

    // 匹配身份证号码的正则
    TOOL.REG_IDCARD = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

    // 匹配邮箱的正则
    TOOL.REG_EMAIL = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]+$/;

    // 网址的正则
    TOOL.REG_URL = "^((https|http|ftp|rtsp|mms)?://)" + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
    + "(([0-9]{1,3}\.){3}[0-9]{1,3}" //IP形式的URL- 199.194.52.184
    + "|" //允许IP和DOMAIN（域名）
    + "([0-9a-z_!~*'()-]+\.)*" //域名- www.
    + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." //二级域名
    + "[a-z]{2,6})" //first level domain- .com or .museum
    + "(:[0-9]{1,4})?" //端口- :80
    + "((/?)|" + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";


    // 验证邮箱是否符合邮箱格式 (true:符合 or false:不符合)
    TOOL.valid_email = function(email) {

        var patten = new RegExp(TOOL.REG_EMAIL);
        return patten.test(email);

    };

    // 验证手机号码是否符合手机格式 (true:符合 or false:不符合)
    TOOL.valid_phone = function(phone) {

        var patten = new RegExp(TOOL.REG_PHONE);
        return patten.test(phone);

    };

    // 验证身份证号码是否符合身份证格式 (true:符合 or false:不符合)
    TOOL.valid_idcard = function(idcard) {

        var patten = new RegExp(TOOL.REG_IDCARD);
        return patten.test(idcard);

    };

    // 验证网址是否符合网址格式 (true:符合 or false:不符合)
    TOOL.valid_url = function(url) {

        var patten = new RegExp(TOOL.REG_URL);
        return patten.test(url);

    };


    // 判断是否微信浏览器(true:微信内置浏览器 or false:其他浏览器)
    TOOL.valid_wxbrowser = function() {

        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }

    };

    // 弹窗提示并且3秒后提示自动消失
    // msg：提示内容
    // cls: 绑定显示面板的class
    TOOL.alert_tips = function(msg, id) {

        TOOL.get_dom(id).html(msg);
        document.getElementById(id).style.display = '';
        setTimeout(function() {
            TOOL.get_dom(id).html('');
            document.getElementById(id).style.display = 'none';
        }, 3000);

    };

    // 获取dom节点并给对应的节点添加html方法
    TOOL.get_dom = function(id){

        var dom = document.getElementById(id);
        var result = {
            html:function(str){
                if(typeof str == 'string') {
                    dom.innerHTML = str;
                    return str;
                } else 
                    return dom.innerHTML;
            }
        }
        return result;
    };

    // 移除含有html标签的字符串里的html
    // 去除所有HTMLtag
    // 去除行尾空白
    // 去除多余空行
    // 去掉&nbsp;
    TOOL.remove_html_tag = function(str) {

        str = str.replace(/<\/?[^>]*>/g, '');
        str = str.replace(/[ | ]*\n/g, '\n');
        str = str.replace(/\n[\s| | ]*\r/g, '\n');
        str = str.replace(/&nbsp;/ig, '');
        return str;

    };

    // html标签转为转义字符
    TOOL.html_to_escape = function(str) {

        str = str.replace(/[<>&"]/g,
            function(c) {
                return {
                    '<': '&lt;',
                    '>': '&gt;',
                    '&': '&amp;',
                    '"': '&quot;'
                }[c];
            }
        );
        return str;

    };

    // 判断是否以某个字符开始
    // s ：字符
    // str :字符串
    TOOL.start_with = function(s, str) {

        return str.indexOf(s) == 0;

    };

    // 判断是否以某个字符结束
    // s ：字符
    // str :字符串
    TOOL.end_with = function(s, str) {

        var d = str.length - s.length;
        return (d >= 0 && str.lastIndexOf(s) == d);

    };


    // 抓取当前页面所有url，包括图片地址
    TOOL.get_current_page_all_url = function() {

        var all = document.documentElement.outerHTML.match(
            /(url\(|src=|href=)[\"\']*([^\"\'\(\)\<\>\[\] ]+)[\"\'\)]*|(http:\/\/[\w\-\.]+[^\"\'\(\)\<\>\[\] ]+)/ig
        ).join("\r\n").replace(
            /^(src=|href=|url\()[\"\']*|[\"\'\>\) ]*$/igm, ""
        );
        return all;

    };

    // 根据参数名获取当前url的参数值
    // 例如：xxx.html?a=10&id=8   
    // 执行：TOOL.get_param(id) 可得到值8
    TOOL.get_param = function(id) {

        var str = window.location.href.split("?");
        if (str[1]) {
            var _params = str[1].split("&");
            var _param = [];
            for (var i = 0; i < _params.length; i++) {
                var p = _params[i].split("=");
                var key = p[0];
                _param[key] = p[1];
            }
        }
        return _param[id];

    };

    // 获取随机数（时间戳＋随机数）
    TOOL.unique_id = function() {

        var a = Math.random,
            b = parseInt;
        return Number(new Date()).toString() + b(10 * a()) + b(10 * a()) + b(10 * a());

    };

    // 获取页面的可视区域高度
    TOOL.get_pageview_height = function() {

        var d = document,
            a = d.compatMode == "BackCompat" ? d.body : d.documentElement;
        return a.clientHeight;

    };

    // 获取页面的可视区域宽度
    TOOL.get_pageview_width = function() {

        var d = document,
            a = d.compatMode == "BackCompat" ? d.body : d.documentElement;
        return a.clientWidth;

    };

    // 获取网页被卷取的位置
    TOOL.get_scroll_xy = function() {

        return document.body.scrollTop ? {
            x: document.body.scrollLeft,
            y: document.body.scrollTop
        } : {
            x: document.documentElement.scrollLeft,
            y: document.documentElement.scrollTop
        }

    };

    // 判断是否为移动设备
    // 是：true   否：false
    TOOL.is_mobile_agent = function() {

        return (/iphone|ipod|android.*mobile|windows.*phone|blackberry.*mobile/i.test(
            window.navigator.userAgent.toLowerCase()
        ));

    };

    // 判断是否为苹果移动设备
    // 是：true   否：false
    TOOL.is_apple_mobile_device = function() {

        return (/iphone|ipod|ipad|Macintosh/i.test(navigator.userAgent.toLowerCase()));

    };

    // 判断是否为安卓移动设备
    // 是：true   否：false
    TOOL.is_android_mobile_device = function() {

        return (/android/i.test(navigator.userAgent.toLowerCase()));

    };

    // 设置cookie
    TOOL.set_cookie = function(name, value, days) {

        var date = new Date();
        date.setTime(date.getTime() + parseInt(days) * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + date.toGMTString() + ";path=/";

    };

    // 读取cookie
    TOOL.get_cookie = function(name) {

        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return (arr[2]);
        } else {
            return null;
        }

    };

    // 删除cookie
    TOOL.del_cookie = function(name) {

        TOOL.set_cookie(name, "", -1);

    };


    // 设置永久性本地存储
    TOOL.set_localstorage = function(name,value) {

        if (window.localStorage) {
            localStorage.setItem(name,value);
        }

    };

    // 获取永久本地存储
    TOOL.get_localstorage = function(name) {

        if (window.localStorage) {
            return localStorage.getItem(name);
        }

    };

    // 删除指定的永久本地存储
    TOOL.del_localstorage = function(name) {

        if (window.localStorage) {
            localStorage.removeItem(name);
        }

    };

    // 清空所有的永久本地存储
    TOOL.clear_localstorage =  function() {

        if (window.localStorage) {
            localStorage.clear();
        }

    };

    // 设置为全局对象
    window.TOOL = TOOL;


    // 判断加载模块
    if (typeof define === "function") {
        define(function() {
            return TOOL;
        });
    }

})();
