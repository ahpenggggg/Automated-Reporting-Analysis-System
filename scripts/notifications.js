Math.randomString=function(o){for(var i="",n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=0;t<o;t++)i+=n.charAt(Math.floor(Math.random()*n.length));return i};var Lobibox=Lobibox||{};!function(){var o=function(o,i){this.$type=null,this.$options=null,this.$el=null;var n=this,t=function(o){o.closest(".lb-notify-tabs").find(">li").removeClass("active"),o.addClass("active");var i=$(o.find(">a").attr("href"));i.closest(".lb-notify-wrapper").find(">.lb-tab-pane").removeClass("active"),i.addClass("active")},s=function(o){var i=$("<li></li>",{class:Lobibox.notify.OPTIONS[n.$type].class});return $("<a></a>",{href:"#"+o}).append('<i class="tab-control-icon '+n.$options.icon+'"></i>').appendTo(i),i},e=function(){return $("<div></div>",{class:"lb-tab-pane",id:Math.randomString(10)})},a=function(o){n.$options.closable&&$('<span class="lobibox-close">&times;</span>').click(function(o){o.preventDefault(),o.stopPropagation(),n.remove()}).appendTo(o)},l=function(o){n.$options.closeOnClick&&o.click(function(){n.remove()})},r=function(o){if(n.$options.delay){if(n.$options.delayIndicator){var i=$('<div class="lobibox-delay-indicator"><div></div></div>');o.append(i)}var t=0,s=1e3/30,e=(new Date).getTime(),a=setInterval(function(){n.$options.continueDelayOnInactiveTab?t=(new Date).getTime()-e:t+=s;var o=100*t/n.$options.delay;o>=100&&(o=100,n.remove(),a=clearInterval(a)),n.$options.delayIndicator&&i.find("div").css("width",o+"%")},s);n.$options.pauseDelayOnHover&&o.on("mouseenter.lobibox",function(){s=0}).on("mouseleave.lobibox",function(){s=1e3/30})}},c=function(o){return o=Math.min($(window).outerWidth(),o)};this.remove=function(){n.$el.removeClass(n.$options.showClass).addClass(n.$options.hideClass);var o=n.$el.parent(),i=o.closest(".lobibox-notify-wrapper-large"),s="#"+o.attr("id"),e=i.find('>.lb-notify-tabs>li:has(a[href="'+s+'"])');return e.addClass(Lobibox.notify.OPTIONS.class).addClass(n.$options.hideClass),setTimeout(function(){if("normal"===n.$options.size||"mini"===n.$options.size)n.$el.remove();else if("large"===n.$options.size){var i=function(o){var i=o.prev();return 0===i.length&&(i=o.next()),0===i.length?null:i}(e);i&&t(i),e.remove(),o.remove()}var s=Lobibox.notify.list,a=s.indexOf(n);s.splice(a,1);var l=s[a];l&&l.$options.showAfterPrevious&&l._init()},500),n},n._init=function(){var o=function(){var o,i,t,s,e,p=Lobibox.notify.OPTIONS,d=$("<div></div>",{class:"lobibox-notify "+p[n.$type].class+" "+p.class+" "+n.$options.showClass});return t=$('<div class="lobibox-notify-icon-wrapper"></div>').appendTo(d),o=$('<div class="lobibox-notify-icon"></div>').appendTo(t),i=$("<div></div>").appendTo(o),n.$options.img?i.append('<img src="'+n.$options.img+'"/>'):n.$options.icon?i.append('<div class="icon-el"><i class="'+n.$options.icon+'"></i></div>'):d.addClass("without-icon"),e=$('<div class="lobibox-notify-msg">'+n.$options.msg+"</div>"),!1!==n.$options.messageHeight&&e.css("max-height",n.$options.messageHeight),s=$("<div></div>",{class:"lobibox-notify-body"}).append(e).appendTo(d),n.$options.title&&s.prepend('<div class="lobibox-notify-title">'+n.$options.title+"<div>"),a(d),"normal"!==n.$options.size&&"mini"!==n.$options.size||(l(d),r(d)),n.$options.width&&d.css("width",c(n.$options.width)),d}();if("mini"===n.$options.size&&o.addClass("notify-mini"),"string"==typeof n.$options.position){var i=function(){var o,i=("large"===n.$options.size?".lobibox-notify-wrapper-large":".lobibox-notify-wrapper")+"."+n.$options.position.replace(/\s/gi,".");return 0===(o=$(i)).length&&(o=$("<div></div>").addClass(i.replace(/\./g," ").trim()).appendTo($("body")),"large"===n.$options.size&&o.append($('<ul class="lb-notify-tabs"></ul>')).append($('<div class="lb-notify-wrapper"></div>'))),o}();!function(o,i){if("normal"===n.$options.size)i.hasClass("bottom")?i.prepend(o):i.append(o);else if("mini"===n.$options.size)i.hasClass("bottom")?i.prepend(o):i.append(o);else if("large"===n.$options.size){var a=e().append(o),l=s(a.attr("id"));i.find(".lb-notify-wrapper").append(a),i.find(".lb-notify-tabs").append(l),t(l),l.find(">a").click(function(){t(l)})}}(o,i),i.hasClass("center")&&i.css("margin-left","-"+i.width()/2+"px")}else $("body").append(o),o.css({position:"fixed",left:n.$options.position.left,top:n.$options.position.top});(n.$el=o,n.$options.sound)&&new Audio(n.$options.sound).play();n.$options.rounded&&n.$el.addClass("rounded"),n.$el.on("click.lobibox",function(o){n.$options.onClickUrl&&(window.location.href=n.$options.onClickUrl),n.$options.onClick&&"function"==typeof n.$options.onClick&&n.$options.onClick.call(n,o)}),n.$el.data("lobibox",n)},this.$type=o,this.$options=function(o){return"mini"!==o.size&&"large"!==o.size||(o=$.extend({},Lobibox.notify.OPTIONS[o.size],o)),"mini"!==(o=$.extend({},Lobibox.notify.OPTIONS[n.$type],Lobibox.notify.DEFAULTS,o)).size&&!0===o.title?o.title=Lobibox.notify.OPTIONS[n.$type].title:"mini"===o.size&&!0===o.title&&(o.title=!1),!0===o.icon&&(o.icon=Lobibox.notify.OPTIONS.icons[o.iconSource][n.$type]),!0===o.sound&&(o.sound=Lobibox.notify.OPTIONS[n.$type].sound),o.sound&&(o.sound=o.soundPath+o.sound+o.soundExt),o}(i),n.$options.showAfterPrevious&&0!==Lobibox.notify.list.length||this._init()};Lobibox.notify=function(i,n){if(["default","info","warning","error","success"].indexOf(i)>-1){var t=new o(i,n);return Lobibox.notify.list.push(t),t}},Lobibox.notify.list=[],Lobibox.notify.closeAll=function(){var o=Lobibox.notify.list;for(var i in o)o[i].remove()},Lobibox.notify.DEFAULTS={title:!0,size:"normal",soundPath:"../sounds/",soundExt:".ogg",showClass:"fadeInDown",hideClass:"zoomOut",icon:!0,msg:"",img:null,closable:!0,hideCloseButton:!1,delay:5e3,delayIndicator:!0,closeOnClick:!0,width:400,sound:!0,position:"bottom right",iconSource:"bootstrap",rounded:!1,messageHeight:60,pauseDelayOnHover:!0,onClickUrl:null,showAfterPrevious:!1,continueDelayOnInactiveTab:!0,onClick:null},Lobibox.notify.OPTIONS={class:"animated-fast",large:{width:500,messageHeight:96},mini:{class:"notify-mini",messageHeight:32},default:{class:"lobibox-notify-default",title:"Default",sound:!1},success:{class:"lobibox-notify-success",title:"Success",sound:"sound2"},error:{class:"lobibox-notify-error",title:"Error",sound:"sound4"},warning:{class:"lobibox-notify-warning",title:"Warning",sound:"sound5"},info:{class:"lobibox-notify-info",title:"Information",sound:"sound6"},icons:{bootstrap:{success:"glyphicon glyphicon-ok-sign",error:"glyphicon glyphicon-remove-sign",warning:"glyphicon glyphicon-exclamation-sign",info:"glyphicon glyphicon-info-sign"},fontAwesome:{success:"fa fa-check-circle",error:"fa fa-times-circle",warning:"fa fa-exclamation-circle",info:"fa fa-info-circle"}}}}();