var menu = {
	obj_bt: null,
	obj_ul: null,
	opened: false,
	init: function(obj){
		menu.obj_bt = obj;
		menu.obj_ul = obj.next();
		menu.opened = false;
		menu.obj_bt.click(menu.open);
	},
	open: function(){
		if (user.opened) user.close();
		if (setting.opened) setting.close();
		menu.obj_bt.addClass("dl-active");
		menu.obj_ul.addClass("dl-menuopen");
		jQuery(window).click(menu.close);
		menu.opened = true;
		return false;
	},
	close: function(){
		menu.obj_bt.removeClass("dl-active");
		menu.obj_ul.removeClass("dl-menuopen");
		jQuery(window).click(function(){});
		menu.opened = false;
	}
};

var user = {
	obj_bt: null,
	obj_ul: null,
	opened: false,
	init: function(obj){
		user.obj_bt = obj;
		user.obj_ul = obj.next();
		user.opened = false;
		user.obj_bt.click(user.open);
	},
	open: function(){
		if (menu.opened) menu.close();
		if (setting.opened) setting.close();
		user.obj_bt.addClass("dl-active");
		user.obj_ul.addClass("dl-menuopen");
		jQuery(window).click(user.close);
		jQuery(".navbar-setting .dl-trigger").addClass("hidden");
		user.opened = true;
		return false;
	},
	close: function(){
		user.obj_bt.removeClass("dl-active");
		user.obj_ul.removeClass("dl-menuopen");
		jQuery(window).click(function(){});
		jQuery(".navbar-setting .dl-trigger").removeClass("hidden");
		user.opened = false;
	}
};

var setting = {
	obj: null,
	obj_bt: null,
	obj_box: null,
	mode: null,
	font: null,
	opened: false,
	init: function(){
		setting.opened = false;
		setting.obj = jQuery(".navbar-setting");
		setting.obj_bt = jQuery(".navbar-setting .dl-trigger");
		setting.obj_box = jQuery(".navbar-setting .setting-box");
		setting.mode = jQuery(".navbar-setting a.btn.btn-daytime.active");
		setting.font = jQuery(".navbar-setting a.btn.font.active");
		// 根据 cookie 记录，修改初始显示方式
		if (setting.getCookie("mode")=="reader-night-mode"){
			setting.setMode(jQuery(".navbar-setting a.btn.btn-nighttime"));
		}
		if (setting.getCookie("font")=="reader-font2"){
			setting.setFont(jQuery(".navbar-setting a.btn.font.hei"));
		}
		// 设置响应事件
		setting.obj_bt.click(setting.open);	
		setting.obj_box.click(function(){return false;});
		jQuery(".navbar-setting .change-background a.btn").click(function(){
			// 根据用户的操作，更改背景颜色设置
			setting.setMode($(this));
			setting.close();
		});
		jQuery(".navbar-setting .change-font a.btn").click(function(){
			// 根据用户的操作，更改字体设置
			setting.setFont($(this));
			setting.close();
		});
	},
	setMode: function(mode){
		// 背景颜色设置
		jQuery("body").removeClass(setting.mode.attr("data"));
		jQuery("body").addClass(mode.attr("data"));
		setting.mode.removeClass("active");
		mode.addClass("active");
		setting.mode = mode;
		// 记录该模式
		setting.setCookie("mode", $(this).attr("data"), 30);
	},
	setFont: function(font){
		// 字体设置
		jQuery("body").removeClass(setting.font.attr("data"));
		jQuery("body").addClass(font.attr("data"));
		setting.font.removeClass("active");
		font.addClass("active");
		setting.font = font;
		// 记录该字体
		setting.setCookie("font", $(this).attr("data"), 30);
	},
	open: function(){
		if (menu.opened) menu.close();
		if (user.opened) user.close();
		setting.obj_box.addClass("box-open");	// setting-box
		jQuery(window).click(setting.close);
		setting.opened = true;
		return false;
	},
	close: function(){
		setting.obj_box.removeClass("box-open");	// setting-box
		jQuery(window).click(function(){});
		setting.opened = false;
	},
	getCookie: function(cname){
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) {
			var c = ca[i].trim();
			if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
		}
		return "";
	},
	setCookie: function(cname, cvalue, exdays){
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires="+d.toGMTString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
	}
};

/* 处理一些需要动态请求和加载的项 */
function ajax_handle(){
	var obj_bg_img = jQuery("div.span3.left-aside img.cover-img");
	var obj_phrase = jQuery("div.span3.left-aside div.bottom-block p");
	var obj_category = jQuery("div p.description");
	if ( obj_bg_img.length>0 || obj_phrase.length>0 || obj_category.length>0 ){
		 $.get("/assets/ajax-data.json",function(data){
			if (data.state=="ok"){
				// 当返回正确的结果时，调用对应的回调函数进行对应的操作
				if (obj_bg_img.length>0)
					obj_bg_img.attr("src",data.left_bg.basic_url+"("+Math.floor(Math.random()*data.left_bg.size)+").jpg");
				if (obj_phrase.length>0)
					obj_phrase.text(data.phrase[Math.floor(Math.random()*eval(data.phrase).length)]);
				if (obj_category.length>0)
					obj_category.text(data.categories[obj_category.attr("category")].description);
			}
		});
	}
}

$(document).ready(function() {
	var scrollHeight = "800";
	jQuery(window).scroll(function() {
		if(jQuery(document).scrollTop() <= scrollHeight) {
			jQuery("div.navbar-go2top").addClass("hidden-go2top");
			return true;
		}  else {
			jQuery("div.navbar-go2top").removeClass("hidden-go2top");
		}
	});
	menu.init(jQuery("button.dl-trigger"));
	user.init(jQuery(".navbar-user a.dl-trigger"));
	setting.init();
	ajax_handle();
});
