if (!window.SlideShow) window.SlideShow = {};
SlideShow.createDelegate = function (a, b) {
	return function () {
		return b.apply(a, arguments)
	}
};
SlideShow.merge = function (a, b, c) {
	var e = a;
	for (var i in b) {
		var s = b[i],
		d;
		var f = i.split(".");
		var g = f.length;
		for (var j = 0; j < g; j++) {
			i = f[j];
			d = a[i];
			if (d) {
				if (typeof(d) == "object") a = d
			} else if (j > 0 && j < g - 1) {
				var h = {};
				h[f.slice(j, g).join(".")] = s;
				s = h;
				break
			}
		}
		if (d && typeof(d) == "object" && typeof(s) == "object") this.merge(d, s, false);
		else if (c && g <= 1 && typeof(d) == "undefined") throw new Error("Undefined property: " + i);
		else a[i] = s;
		a = e
	}
};
SlideShow.extend = function (a, b, c) {
	var F = function () {};
	F.prototype = a.prototype;
	b.prototype = new F();
	b.prototype.constructor = b;
	b.base = a.prototype;
	if (a.prototype.constructor == Object.prototype.constructor) a.prototype.constructor = a;
	if (c) for (var i in c) b.prototype[i] = c[i]
};
SlideShow.parseBoolean = function (a) {
	return (typeof(a) == "string") ? (a.toLowerCase() == "true") : Boolean(a)
};
SlideShow.formatString = function (a) {
	for (i = 1, j = arguments.length; i < j; i++) a = a.replace("{" + (i - 1) + "}", arguments[i]);
	return a
};
SlideShow.getUniqueId = function (a) {
	return a + Math.random().toString().substring(2)
};
SlideShow.addTextToBlock = function (a, b) {
	if (b) {
		b = b.toString();
		a.text = b;
		var c = a.width;
		var d = a.height;
		try {
			if (a.actualWidth <= c && a.actualHeight <= d) return;
			var e = 0;
			var f = b.length;
			var g = /\W*$/;
			var h = "\u2026";
			while (true) {
				var i = Math.floor((f + e) / 2);
				a.text = b.substring(0, i).replace(g, h);
				if (i == e) break;
				if (a.actualWidth > c || a.actualHeight > d) f = i;
				else e = i
			}
			if (a.actualWidth > c || a.actualHeight > d) a.text = null
		} catch(error) {}
	} else {
		a.text = null
	}
};
SlideShow.Object = function () {
	this.options = {};
	this.eventHandlers = {}
};
SlideShow.Object.prototype = {
	setOptions: function (a) {
		SlideShow.merge(this.options, a, true)
	},
	addEventListener: function (a, b) {
		var c = this.eventHandlers[a];
		if (!c) this.eventHandlers[a] = c = [];
		var d = c.length;
		c[d] = b;
		return d
	},
	removeEventListener: function (a, b) {
		if (typeof(b) == "function") {
			var c = this.eventHandlers[a];
			if (c) {
				for (var i = 0, j = c.length; i < j; i++) if (c[i] == b) break;
				c.splice(i, 1)
			}
		} else {
			c.splice(b, 1)
		}
	},
	fireEvent: function (a, e) {
		var b = this.eventHandlers[a];
		if (b) for (var i = 0, j = b.length; i < j; i++) b[i](this, e)
	},
	dispose: function () {
		this.options = null;
		this.eventHandlers = null
	}
};
SlideShow.JsonParser = function (a) {
	SlideShow.JsonParser.base.constructor.call(this);
	SlideShow.merge(this.options, {
		arrays: null
	});
	this.setOptions(a);
	this.initializeForcedArrays()
};
SlideShow.extend(SlideShow.Object, SlideShow.JsonParser, {
	initializeForcedArrays: function () {
		this.forcedArrays = {};
		if (this.options.arrays) {
			var a = this.options.arrays.split(",");
			for (var i = 0, j = a.length; i < j; i++) this.forcedArrays[a[i]] = true
		}
	},
	fromFeed: function (a, b) {
		window[b] = SlideShow.createDelegate(this, this.onFeedCallback);
		var c = SlideShow.getUniqueId("SlideShow_Script_");
		SlideShow.ScriptManager.addExternalScript(c, "text/javascript", a)
	},
	onFeedCallback: function (a) {
		this.fireEvent("callback", a)
	},
	fromXml: function (c, d) {
		var e;
		if (window.XMLHttpRequest) e = new window.XMLHttpRequest();
		else if (window.ActiveXObject) e = new window.ActiveXObject("Microsoft.XMLHTTP");
		else throw new Error("XML parsing failed: Unsupported browser");
		var f = function () {
			if (e.readyState == 4) {
				if (e.status == 200) {
					var a = e.responseXML;
					var b = this.parseXmlDocument(a);
					this.fireEvent("parseComplete", b)
				} else {
					throw new Error("XML parsing failed: " + e.statusText);
				}
			}
		};
		if (d) {
			e.onreadystatechange = SlideShow.createDelegate(this, f);
			e.open("GET", c, true);
			e.send(null)
		} else {
			e.open("GET", c, false);
			e.send(null);
			f.apply(this)
		}
	},
	parseXmlDocument: function (a) {
		var b = a.documentElement;
		if (!b) return;
		var c = b.nodeName;
		var d = b.nodeType;
		var e = this.parseXmlNode(b);
		if (this.forcedArrays[c]) e = [e];
		if (d == 11) return e;
		var f = {};
		f[c] = e;
		return f
	},
	parseXmlNode: function (a) {
		switch (a.nodeType) {
		case 8:
			return;
		case 3:
		case 4:
			var b = a.nodeValue;
			if (!b.match(/\S/)) return;
			return this.formatValue(b);
		default:
			var c;
			var d = {};
			var e = a.attributes;
			var f = a.childNodes;
			if (e && e.length) {
				c = {};
				for (var i = 0, j = e.length; i < j; i++) {
					var g = e[i];
					var h = g.nodeName.toLowerCase();
					var q = g.nodeValue;
					if (typeof(d[h]) == "undefined") d[h] = 0;
					this.addProperty(c, h, this.formatValue(q), ++d[h])
				}
			}
			if (f && f.length) {
				var r = true;
				if (c) r = false;
				for (var k = 0, l = f.length; k < l && r; k++) {
					var s = f[k].nodeType;
					if (s == 3 || s == 4) continue;
					r = false
				}
				if (r) {
					if (!c) c = "";
					for (var m = 0, n = f.length; m < n; m++) c += this.formatValue(f[m].nodeValue)
				} else {
					if (!c) c = {};
					for (var o = 0, p = f.length; o < p; o++) {
						var t = f[o];
						var u = t.nodeName;
						if (typeof(u) != "string") continue;
						var v = this.parseXmlNode(t);
						if (!v) continue;
						if (typeof(d[u]) == "undefined") d[u] = 0;
						this.addProperty(c, u, this.formatValue(v), ++d[u])
					}
				}
			}
			return c
		}
	},
	formatValue: function (a) {
		if (typeof(a) == "string" && a.length > 0) {
			var b = a.toLowerCase();
			if (b == "true") return true;
			else if (b == "false") return false;
			if (!isNaN(a)) return new Number(a).valueOf()
		}
		return a
	},
	addProperty: function (a, b, c, d) {
		if (this.forcedArrays[b]) {
			if (d == 1) a[b] = [];
			a[b][a[b].length] = c
		} else {
			switch (d) {
			case 1:
				a[b] = c;
				break;
			case 2:
				a[b] = [a[b], c];
				break;
			default:
				a[b][a[b].length] = c;
				break
			}
		}
	}
});
SlideShow.XmlConfigProvider = function (a) {
	SlideShow.XmlConfigProvider.base.constructor.call(this);
	SlideShow.merge(this.options, {
		url: "Configuration.xml"
	});
	this.setOptions(a)
};
SlideShow.extend(SlideShow.Object, SlideShow.XmlConfigProvider, {
	getConfig: function (a) {
		var b = new SlideShow.JsonParser({
			arrays: "module,option,script,transition"
		});
		b.addEventListener("parseComplete", a);
		b.fromXml(this.options.url, false)
	}
});
SlideShow.ScriptManager = function () {
	SlideShow.ScriptManager.base.constructor.call(this);
	this.scripts = {};
	this.timeoutId = null
};
SlideShow.extend(SlideShow.Object, SlideShow.ScriptManager, {
	register: function (a, b, c) {
		if (this.scripts[a]) throw new Error("Duplicate script: " + a);
		this.scripts[a] = {
			url: b,
			extendsClass: c,
			loaded: false
		}
	},
	load: function () {
		this.timeoutId = window.setTimeout(SlideShow.createDelegate(this, this.onLoadTimeout), 15000);
		for (var a in this.scripts) this.loadScript(a);
		this.checkLoadStatus()
	},
	loadScript: function (a) {
		var b = this.scripts[a];
		if (b.extendsClass) {
			if (typeof(eval("SlideShow." + b.extendsClass)) == "undefined") {
				var c = this;
				window.setTimeout(function () {
					c.loadScript.call(c, a)
				},
				100);
				return
			}
		}
		var d = "SlideShow_Script_" + a;
		SlideShow.ScriptManager.addExternalScript(d, "text/javascript", b.url)
	},
	checkLoadStatus: function () {
		for (var a in this.scripts) {
			var b = this.scripts[a];
			if (!b.loaded) {
				if (typeof(eval("SlideShow." + a)) == "undefined") {
					window.setTimeout(SlideShow.createDelegate(this, this.checkLoadStatus), 100);
					return
				} else {
					b.loaded = true
				}
			}
		}
		if (this.timeoutId) {
			window.clearTimeout(this.timeoutId);
			this.timeoutId = null
		}
		this.fireEvent("loadComplete")
	},
	onLoadTimeout: function () {
		this.timeoutId = null;
		throw new Error("Scripts failed to load in time");
	}
});
SlideShow.ScriptManager.addExternalScript = function (a, b, c) {
	if (!document.getElementById(a)) {
		var d = document.createElement("script");
		d.id = a;
		d.type = "text/javascript";
		d.src = c;
		document.getElementsByTagName("head")[0].appendChild(d)
	}
};
SlideShow.ScriptManager.addInlineScript = function (a, b, c) {
	if (!document.getElementById(a)) {
		var d = document.createElement("script");
		d.id = a;
		d.type = b;
		d.text = c;
		try {
			d.innerText = c
		} catch(error) {}
		document.getElementsByTagName("head")[0].appendChild(d)
	}
};
SlideShow.UserControl = function (a, b, c, d) {
	SlideShow.UserControl.base.constructor.call(this);
	SlideShow.merge(this.options, {
		top: "Auto",
		left: "Auto",
		bottom: "Auto",
		right: "Auto",
		width: "Auto",
		height: "Auto",
		background: "Transparent",
		opacity: 1,
		visibility: "Visible",
		cursor: "Default"
	});
	this.setOptions(d);
	this.control = a;
	this.children = [];
	if (b) {
		this.parent = b;
		this.parent.children.push(this)
	}
	if (c) this.root = a.host.content.createFromXaml(c, true);
	if (this.parent && this.parent.root && this.root) this.parent.root.children.add(this.root)
};
SlideShow.extend(SlideShow.Object, SlideShow.UserControl, {
	render: function () {
		this.resize(this.options.width, this.options.height);
		this.reposition();
		this.root.background = this.options.background;
		this.root.opacity = this.options.opacity;
		this.root.visibility = this.options.visibility;
		this.root.cursor = this.options.cursor;
		for (var i = 0, j = this.children.length; i < j; i++) this.children[i].render()
	},
	resize: function (a, b) {
		var c = "Auto";
		var d = this.root.width;
		var e = this.root.height;
		this.root.width = (a != c) ? Math.max(a, 0) : 0;
		this.root.height = (b != c) ? Math.max(b, 0) : 0;
		if (d != this.root.width || e != this.root.height) this.onSizeChanged()
	},
	reposition: function () {
		var a = "Auto";
		var b = this.root.width;
		var c = this.root.height;
		this.root["Canvas.Top"] = (this.options.top != a) ? this.getPosition("top", this.options.top) : 0;
		this.root["Canvas.Left"] = (this.options.left != a) ? this.getPosition("left", this.options.left) : 0;
		if (this.options.bottom != a && this.parent) {
			if (this.options.height != a && this.options.top == a) this.root["Canvas.Top"] = this.parent.root.height - this.root.height - this.getPosition("bottom", this.options.bottom);
			else if (this.options.height == a && this.options.top != a) this.root.height = Math.max(this.parent.root.height - this.root["Canvas.Top"] - this.getPosition("bottom", this.options.bottom), 0)
		}
		if (this.options.right != a && this.parent) {
			if (this.options.width != a && this.options.left == a) this.root["Canvas.Left"] = this.parent.root.width - this.root.width - this.getPosition("right", this.options.right);
			else if (this.options.width == a && this.options.left != a) this.root.width = Math.max(this.parent.root.width - this.root["Canvas.Left"] - this.getPosition("right", this.options.right), 0)
		}
		if (b != this.root.width || c != this.root.height) this.onSizeChanged()
	},
	getPosition: function (a, b) {
		if (!isNaN(b)) return b;
		var c = b.slice(0, b.length - 1) / 100;
		if (this.parent) {
			switch (a) {
			case "top":
				return this.parent.root.height * c - this.root.height / 2;
			case "left":
				return this.parent.root.width * c - this.root.width / 2;
			case "bottom":
				return (1 - this.parent.root.height * c) - this.root.height / 2;
			case "right":
				return (1 - this.parent.root.width * c) - this.root.width / 2;
			default:
				throw new Error("Invalid name: " + a);
			}
		}
	},
	dispose: function () {
		SlideShow.UserControl.base.dispose.call(this);
		if (this.parent) {
			for (var i = 0, j = this.parent.children.length; i < j; i++) if (this.parent.children[i] == this) break;
			this.parent.children.splice(i, 1);
			this.parent.root.children.remove(this.root);
			this.parent = null
		}
		this.control = null;
		this.children = null;
		this.root = null
	},
	onSizeChanged: function () {
		for (var i = 0, j = this.children.length; i < j; i++) this.children[i].reposition()
	}
});
SlideShow.Control = function (a) {
	SlideShow.Control.base.constructor.call(this);
	SlideShow.merge(this.options, {
		id: null,
		width: 640,
		height: 480,
		background: "Black",
		windowless: false,
		framerate: 48,
		enableframeratecounter: false,
		enableredrawregions: false,
		enabletrace: false,
		installinplace: true,
		installunsupportedbrowsers: false,
		cssclass: "SlideShow",
		scripts: null,
		modules: null,
		transitions: null,
		dataProvider: null
	});
	if (a instanceof SlideShow.XmlConfigProvider) {
		var b = a;
		b.getConfig(SlideShow.createDelegate(this, this.onConfigLoad))
	} else {
		this.onConfigLoad(this, {
			configuration: a
		})
	}
};
SlideShow.extend(SlideShow.UserControl, SlideShow.Control, {
	render: function () {
		if (this.options.enabletrace) {
			this.traceLog = this.host.content.createFromXaml('<TextBlock Canvas.Top="10" Canvas.Left="10" Canvas.ZIndex="999" Foreground="#66FFFFFF" FontSize="10" />');
			this.root.children.add(this.traceLog)
		}
		this.host.settings.enableFrameRateCounter = this.options.enableframeratecounter;
		this.host.settings.enableRedrawRegions = this.options.enableredrawregions;
		this.resize(this.options.width, this.options.height);
		this.reposition();
		this.root.background = this.options.background;
		this.root.opacity = this.options.opacity;
		this.root.visibility = this.options.visibility;
		for (var i = 0, j = this.children.length; i < j; i++) this.children[i].render()
	},
	createObject: function () {
		this.id = this.options.id || SlideShow.getUniqueId("SlideShow_");
		var a = "SlideShow_Source";
		var b = this.id;
		var c = b + "_Object";
		var d = '<Canvas xmlns="http://schemas.microsoft.com/client/2007" xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="Control" Visibility="Collapsed" Cursor="Wait"></Canvas>';
		SlideShow.ScriptManager.addInlineScript(a, "text/xaml", d);
		document.write('<div id="' + b + '" class="' + this.options.cssclass + '"></div>');
		Silverlight.createObjectEx({
			id: c,
			source: "#" + a,
			parentElement: document.getElementById(b),
			properties: {
				width: String(this.options.width),
				height: String(this.options.height),
				background: this.options.background,
				isWindowless: String(this.options.windowless),
				framerate: String(this.options.framerate),
				inplaceInstallPrompt: SlideShow.parseBoolean(this.options.installinplace),
				ignoreBrowserVer: SlideShow.parseBoolean(this.options.installunsupportedbrowsers),
				version: "1.0"
			},
			events: {
				onLoad: SlideShow.createDelegate(this, this.onObjectLoad)
			}
		})
	},
	getTypeFromConfig: function (a) {
		var b = eval("SlideShow." + a.type);
		if (!b) throw new Error("Invalid type: " + a.type);
		return b
	},
	getOptionsFromConfig: function (a) {
		var b = {};
		if (a.option) {
			for (var i = 0, j = a.option.length; i < j; i++) {
				var c = a.option[i]["name"];
				var d = a.option[i]["value"];
				b[c] = d
			}
		}
		return b
	},
	createObjectInstanceFromConfig: function (a) {
		var b = this.getTypeFromConfig(a);
		var c = this.getOptionsFromConfig(a);
		return new b(this, c)
	},
	createModuleInstanceFromConfig: function (a) {
		var b = this.getTypeFromConfig(a);
		var c = this.getOptionsFromConfig(a);
		return new b(this, this, c)
	},
	loadScripts: function () {
		if (this.options.scripts && this.options.scripts.script) {
			var a = new SlideShow.ScriptManager();
			a.addEventListener("loadComplete", SlideShow.createDelegate(this, this.onScriptsLoad));
			for (var i = 0, j = this.options.scripts.script.length; i < j; i++) {
				var b = this.options.scripts.script[i];
				a.register(b.key, b.url, b.extendsclass)
			}
			a.load()
		} else {
			this.onScriptsLoad(this)
		}
	},
	loadModules: function () {
		if (this.options.modules && this.options.modules.module) {
			var a = {};
			for (var i = 0, j = this.options.modules.module.length; i < j; i++) {
				var b = this.options.modules.module[i];
				var c = a[b.type] = this.createModuleInstanceFromConfig(b);
				c.render()
			}
			this.onModulesLoad(this, a)
		}
	},
	loadData: function () {
		if (this.options.dataProvider) {
			var a = this.createObjectInstanceFromConfig(this.options.dataProvider);
			a.getData(SlideShow.createDelegate(this, this.onDataLoad))
		} else {
			this.onLoad(this)
		}
	},
	isAlbumIndexValid: function (a) {
		return this.data && this.data.album && this.data.album[a]
	},
	isSlideIndexValid: function (a, b) {
		if (this.isAlbumIndexValid(a)) return this.data.album[a].slide && this.data.album[a].slide[b];
		return false
	},
	getSlideTransitionData: function (a, b) {
		var c;
		if (!this.transitions) this.transitions = {
			notransition: {
				type: "NoTransition"
			}
		};
		if (this.isSlideIndexValid(a, b)) c = this.data.album[a].slide[b].transition;
		if (c == null && this.isAlbumIndexValid(a)) c = this.data.album[a].transition;
		if (c == null && this.data) c = this.data.transition;
		if (c == null) c = "NoTransition";
		var d = c.toLowerCase();
		var e = this.transitions[d];
		if (!e) {
			if (this.options.transitions && this.options.transitions.transition) {
				for (var i = 0, j = this.options.transitions.transition.length; i < j; i++) {
					if (this.options.transitions.transition[i].name.toLowerCase() == d) {
						e = this.options.transitions.transition[i];
						break
					}
				}
			}
			if (e) this.transitions[d] = e;
			else throw new Error("Invalid transition: " + c);
		}
		return e
	},
	resize: function (a, b) {
		this.host.setAttribute("width", a);
		this.host.setAttribute("height", b)
	},
	showEmbeddedMode: function () {
		this.host.content.fullScreen = false
	},
	showFullScreenMode: function () {
		this.host.content.fullScreen = true
	},
	toggleFullScreenMode: function () {
		this.host.content.fullScreen = !this.host.content.fullScreen
	},
	isFullScreenMode: function () {
		return this.host.content.fullScreen
	},
	trace: function (a) {
		if (this.traceLog) {
			if (this.traceLog.actualHeight > this.host.content.actualHeight - 10) this.traceLog.text = "";
			this.traceLog.text = a + "\n" + this.traceLog.text
		}
	},
	onObjectLoad: function (a, b, c) {
		this.root = c;
		this.host = a;
		this.render();
		this.onResize(this);
		this.host.content.onResize = SlideShow.createDelegate(this, this.onResize);
		this.host.content.onFullScreenChange = SlideShow.createDelegate(this, this.onFullScreenChange);
		this.loadScripts()
	},
	onConfigLoad: function (a, e) {
		this.setOptions(e.configuration);
		this.createObject()
	},
	onScriptsLoad: function (a, e) {
		this.loadModules();
		this.loadData()
	},
	onModulesLoad: function (a, e) {
		this.modules = e;
		this.fireEvent("modulesLoad")
	},
	onDataLoad: function (a, e) {
		this.data = e.data;
		if (this.data) {
			if (this.data.startalbumindex != null && !this.isAlbumIndexValid(this.data.startalbumindex)) throw new Error("Invalid configuration: startalbumindex");
			if (this.data.startslideindex != null && !this.isSlideIndexValid((this.data.startalbumindex) ? this.data.startalbumindex: 0, this.data.startslideindex)) throw new Error("Invalid configuration: startslideindex");
		}
		this.fireEvent("dataLoad");
		this.onLoad(this)
	},
	onLoad: function (a, e) {
		this.root.cursor = this.options.cursor;
		this.fireEvent("load")
	},
	onResize: function (a, e) {
		SlideShow.Control.base.resize.call(this, this.host.content.actualWidth, this.host.content.actualHeight)
	},
	onFullScreenChange: function (a, e) {
		this.onResize(this);
		this.fireEvent("fullScreenChange")
	}
});
SlideShow.Button = function (a, b, c) {
	SlideShow.Button.base.constructor.call(this, a, b, c);
	SlideShow.merge(this.options, {
		width: 22,
		height: 20,
		cursor: "Hand"
	});
	this.state = "Default";
	this.root.addEventListener("MouseEnter", SlideShow.createDelegate(this, this.onMouseEnter));
	this.root.addEventListener("MouseLeave", SlideShow.createDelegate(this, this.onMouseLeave));
	this.root.addEventListener("MouseLeftButtonDown", SlideShow.createDelegate(this, this.onMouseDown));
	this.root.addEventListener("MouseLeftButtonUp", SlideShow.createDelegate(this, this.onMouseUp))
};
SlideShow.extend(SlideShow.UserControl, SlideShow.Button, {
	render: function () {
		SlideShow.Button.base.render.call(this);
		this.root.cursor = this.options.cursor
	},
	setState: function (a) {
		this.state = a;
		switch (a) {
		case "Disabled":
			this.root.cursor = "Default";
			break;
		default:
			this.root.cursor = this.options.cursor;
			break
		}
	},
	enable: function () {
		if (this.state == "Disabled") this.setState("Default")
	},
	disable: function () {
		if (this.state != "Disabled") this.setState("Disabled")
	},
	onMouseEnter: function (a, e) {
		if (this.state != "Disabled") this.setState((this.state.indexOf("Active") > -1) ? "ActiveHover": "Hover")
	},
	onMouseLeave: function (a, e) {
		if (this.state != "Disabled") this.setState((this.state.indexOf("Active") > -1) ? "ActiveUnhover": "Unhover")
	},
	onMouseDown: function (a, e) {
		if (this.state != "Disabled") {
			this.setState((this.state.indexOf("Hover") > -1) ? "ActiveHover": "Default");
			a.captureMouse()
		}
	},
	onMouseUp: function (a, e) {
		if (this.state != "Disabled") {
			var b = (this.state == "ActiveHover");
			this.setState((this.state.indexOf("Hover") > -1) ? "InactiveHover": "Default");
			a.releaseMouseCapture();
			if (b) this.onClick(e)
		}
	},
	onClick: function (e) {
		if (this.state != "Disabled") this.fireEvent("click", e)
	}
});﻿SlideShow.Transition = function (a) {
	SlideShow.Transition.base.constructor.call(this);
	this.control = a;
	this.state = "Stopped"
};
SlideShow.extend(SlideShow.Object, SlideShow.Transition, {
	begin: function (a, b) {
		this.state = "Started";
		this.fromImage = a;
		this.toImage = b;
		this.outStoryboardComplete = false;
		this.inStoryboardComplete = false
	},
	complete: function () {
		if (this.fromImage.root != null) this.fromImage.root.visibility = "Collapsed";
		if (this.toImage.root != null) this.toImage.root.visibility = "Visible";
		this.state = "Stopped";
		this.fireEvent("complete")
	},
	addStoryboard: function (a, b, c, d) {
		var e = '<Storyboard xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="TransitionStoryboard" Storyboard.TargetName="' + b + '" Storyboard.TargetProperty="' + c + '">' + d + '</Storyboard>';
		var f = this.control.host.content.createFromXaml(e);
		a.root.resources.add(f);
		return f
	},
	createClippingPath: function (a) {
		var b = '<GeometryGroup>' + a + '</GeometryGroup>';
		return this.control.host.content.createFromXaml(b)
	},
	onOutStoryboardComplete: function (a, e) {
		this.outStoryboardComplete = true;
		if (this.inStoryboardComplete) this.complete()
	},
	onInStoryboardComplete: function (a, e) {
		this.inStoryboardComplete = true;
		if (this.outStoryboardComplete) this.complete()
	}
});﻿SlideShow.ProgressIndicator = function (a, b, c) {
	SlideShow.ProgressIndicator.base.constructor.call(this, a, b, c);
	SlideShow.merge(this.options, {
		top: "50%",
		left: "50%",
		width: 40,
		height: 40,
		opacity: 0,
		progressBackground: "#99000000",
		progressForeground: "#99FFFFFF",
		progressBorderColor: "White",
		progressBorderThickness: 2,
		fadeAnimationDuration: 0.3
	});
	this.fadeStoryboard = this.root.findName("FadeStoryboard");
	this.fadeAnimation = this.root.findName("FadeAnimation");
	this.control.addEventListener("modulesLoad", SlideShow.createDelegate(this, this.onControlModulesLoad))
};
SlideShow.extend(SlideShow.UserControl, SlideShow.ProgressIndicator, {
	updateProgress: function (a) {
		if (a == 1) this.fadeOut();
		else if (this.root.opacity == 0) this.fadeIn()
	},
	fadeIn: function () {
		var a = (1 - this.root.opacity) * this.options.fadeAnimationDuration;
		if (a > 0) {
			this.fadeAnimation.to = 1;
			this.fadeAnimation.duration = "0:0:" + a.toFixed(8);
			this.fadeStoryboard.begin()
		}
	},
	fadeOut: function () {
		var a = this.root.opacity * this.options.fadeAnimationDuration;
		if (a > 0) {
			this.fadeAnimation.to = 0;
			this.fadeAnimation.duration = "0:0:" + a.toFixed(8);
			this.fadeStoryboard.begin()
		}
	},
	onControlModulesLoad: function () {
		this.slideViewer = this.control.modules["SlideViewer"];
		if (!this.slideViewer) throw new Error("Expected module missing: SlideViewer");
		this.slideViewer.addEventListener("slideLoading", SlideShow.createDelegate(this, this.onSlideLoading));
		this.slideViewer.addEventListener("downloadProgressChanged", SlideShow.createDelegate(this, this.onSlideDownloadProgressChanged))
	},
	onSlideLoading: function (a, e) {
		if (e) this.updateProgress(0)
	},
	onSlideDownloadProgressChanged: function (a, e) {
		this.updateProgress(e)
	}
});﻿SlideShow.SlideNavigation = function (a, b, c) {
	SlideShow.SlideNavigation.base.constructor.call(this, a, b, c);
	SlideShow.merge(this.options, {
		enableNextSlide: true,
		enablePreviousSlide: true,
		enableTransitionOnNext: true,
		enableTransitionOnPrevious: false
	});
	this.control.addEventListener("modulesLoad", SlideShow.createDelegate(this, this.onControlModulesLoad))
};
SlideShow.extend(SlideShow.UserControl, SlideShow.SlideNavigation, {
	slideExistsByOffset: function (a) {
		return (this.slideViewer.currentSlideIndex != this.slideViewer.getDataIndexByOffset(a)) && (this.options.loopAlbum || this.control.isSlideIndexValid(this.slideViewer.currentAlbumIndex, this.slideViewer.currentSlideIndex + a))
	},
	showPreviousSlide: function () {
		if (this.slideExistsByOffset( - 1)) {
			if (this.slideViewer.currentTransition && this.slideViewer.currentTransition.state == "Started") this.slideViewer.fromImage.setSource(this.slideViewer.toImage.image.source);
			this.slideViewer.loadImageByOffset( - 1, this.options.enableTransitionOnPrevious)
		}
	},
	showNextSlide: function () {
		if (this.slideExistsByOffset(1)) {
			if (this.slideViewer.currentTransition && this.slideViewer.currentTransition.state == "Started") this.slideViewer.fromImage.setSource(this.slideViewer.toImage.image.source);
			this.slideViewer.loadImageByOffset(1, this.options.enableTransitionOnNext)
		}
	},
	onControlModulesLoad: function (a, e) {
		this.slideViewer = this.control.modules["SlideViewer"];
		if (!this.slideViewer) throw new Error("Expected module missing: SlideViewer");
	}
});﻿SlideShow.PageContainer = function (a, b, c) {
	var d = '<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="PageContainer" Visibility="Collapsed">' + '	<Canvas.Resources>' + '		<Storyboard x:Name="storyboard">' + '			<DoubleAnimationUsingKeyFrames Storyboard.TargetName="currentPageTransform" Storyboard.TargetProperty="X"> ' + '				<SplineDoubleKeyFrame x:Name="currentPageSplineFrom" KeySpline="0,0 0,0" KeyTime="0:0:0" />' + '				<SplineDoubleKeyFrame x:Name="currentPageSplineTo" KeySpline="0,0 0,1" />' + '			</DoubleAnimationUsingKeyFrames> ' + '			<DoubleAnimationUsingKeyFrames Storyboard.TargetName="nextPageTransform" Storyboard.TargetProperty="X"> ' + '				<SplineDoubleKeyFrame x:Name="nextPageSplineFrom" KeySpline="0,0 0,0" KeyTime="0:0:0" />' + '				<SplineDoubleKeyFrame x:Name="nextPageSplineTo" KeySpline="0,0 0,1" />' + '			</DoubleAnimationUsingKeyFrames> ' + '		</Storyboard>' + '	</Canvas.Resources>' + '	<Canvas.Clip>' + '		<RectangleGeometry x:Name="centerClip" />' + '	</Canvas.Clip>' + '	<Canvas x:Name="currentPage">' + '		<Canvas.RenderTransform>' + '			<TranslateTransform x:Name="currentPageTransform" />' + '		</Canvas.RenderTransform>' + '	</Canvas>' + '	<Canvas x:Name="nextPage">' + '		<Canvas.RenderTransform>' + '			<TranslateTransform x:Name="nextPageTransform" />' + '		</Canvas.RenderTransform>' + '	</Canvas>' + '</Canvas>';
	SlideShow.PageContainer.base.constructor.call(this, a, b, d);
	SlideShow.merge(this.options, {
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		itemWidth: 220,
		itemHeight: 80,
		padding: 10,
		spacing: 10,
		animatePageChanges: true,
		animationDuration: 0.6
	});
	this.setOptions(c);
	this.columns = 0;
	this.rows = 0;
	this.itemCountPerPage = 0;
	this.pageIndex = 0;
	this.pageCount = 0;
	this.currentPage = this.root.findName("currentPage");
	this.nextPage = this.root.findName("nextPage");
	this.centerClip = this.root.findName("centerClip");
	this.currentPageTransform = this.root.findName("currentPageTransform");
	this.nextPageTransform = this.root.findName("nextPageTransform");
	this.storyboard = this.root.findName("storyboard");
	this.currentPageSplineFrom = this.root.findName("currentPageSplineFrom");
	this.currentPageSplineTo = this.root.findName("currentPageSplineTo");
	this.nextPageSplineFrom = this.root.findName("nextPageSplineFrom");
	this.nextPageSplineTo = this.root.findName("nextPageSplineTo");
	this.storyboard.addEventListener("Completed", SlideShow.createDelegate(this, this.onStoryboardComplete))
};
SlideShow.extend(SlideShow.UserControl, SlideShow.PageContainer, {
	render: function () {
		SlideShow.PageContainer.base.render.call(this);
		this.currentPage.visibility = "Visible";
		this.nextPage.visibility = "Collapsed"
	},
	determineItemFit: function (a, b) {
		if (b == 0 || a == 0) return 0;
		var c = 0;
		b -= this.options.padding * 2;
		if (a <= b) {
			c++;
			b -= a
		}
		var d = a + this.options.spacing;
		c += Math.floor(b / d);
		return c
	},
	determineCanvasPosition: function (a, b) {
		var c = this.options.spacing * b;
		var d = b * a;
		return d + c
	},
	initializePages: function () {
		var a = false;
		var b = this.determineItemFit(this.options.itemWidth, this.root.width);
		var c = this.determineItemFit(this.options.itemHeight, this.root.height);
		if (this.columns != b || this.rows != c) {
			a = true;
			this.columns = b;
			this.rows = c;
			this.itemCountPerPage = b * c
		}
		var d = this.columns * this.options.itemWidth + (this.columns - 1) * this.options.spacing;
		var e = this.rows * this.options.itemHeight + (this.rows - 1) * this.options.spacing;
		var f = Math.max(this.root.width / 2 - d / 2, this.options.padding);
		var g = this.options.padding;
		this.currentPage.width = this.nextPage.width = d;
		this.currentPage.height = this.nextPage.height = e;
		this.currentPage["Canvas.Left"] = this.nextPage["Canvas.Left"] = f;
		this.currentPage["Canvas.Top"] = this.nextPage["Canvas.Top"] = g;
		this.centerClip.Rect = f + "," + g + "," + d + "," + e;
		return a
	},
	showPage: function (a, b) {
		var c = 0;
		var d = 0;
		var e = 0;
		var f = 0;
		if (b && this.options.animatePageChanges) {
			if (b == "Next") {
				c = (this.currentPageTransform.x + this.root.width) / this.root.width * this.options.animationDuration;
				d = (this.nextPageTransform.x + this.root.width) / this.root.width * this.options.animationDuration;
				e = -(this.currentPage.width + this.options.spacing);
				f = -(this.nextPage.width + this.options.spacing);
				this.nextPage["Canvas.Left"] = (this.currentPage["Canvas.Left"] + this.nextPage.width + this.options.spacing)
			} else {
				c = (this.root.width - this.currentPageTransform.x) / this.root.width * this.options.animationDuration;
				d = (this.root.width - this.nextPageTransform.x) / this.root.width * this.options.animationDuration;
				e = this.currentPage.width + this.options.spacing;
				f = this.nextPage.width + this.options.spacing;
				this.nextPage["Canvas.Left"] = (this.currentPage["Canvas.Left"] - this.nextPage.width - this.options.spacing)
			}
		}
		this.addItemsToContainer(this.nextPage, a);
		this.nextPage.visibility = "Visible";
		this.currentPageSplineFrom.value = this.currentPageTransform.x;
		this.currentPageSplineTo.value = e;
		this.currentPageSplineTo.keyTime = "0:0:" + c.toFixed(8);
		this.nextPageSplineFrom.value = this.nextPageTransform.x;
		this.nextPageSplineTo.value = f;
		this.nextPageSplineTo.keyTime = "0:0:" + d.toFixed(8);
		this.storyboard.begin()
	},
	addItemsToContainer: function (a, b) {
		a.children.clear();
		for (var i = 0, j = 0; j < this.rows; j++) {
			for (var k = 0; k < this.columns; k++, i++) {
				if (b.length > i) {
					var c = b[i];
					a.children.add(c.root);
					c.setOptions({
						width: this.options.itemWidth,
						height: this.options.itemHeight,
						top: this.determineCanvasPosition(this.options.itemHeight, j),
						left: this.determineCanvasPosition(this.options.itemWidth, k)
					});
					c.render()
				}
			}
		}
	},
	loadPageByOffset: function (a) {
		var b = this.parent.getItemCount();
		if (b > 0 && this.itemCountPerPage > 0) this.pageCount = Math.ceil(b / this.itemCountPerPage);
		else this.pageCount = 0;
		var c = this.pageIndex + a;
		if (c < 0) c = 0;
		if (c < this.pageCount) {
			this.pageIndex = c;
			var d = this.parent.getItems(this.pageIndex * this.itemCountPerPage, this.itemCountPerPage);
			var e = (a > 0) ? "Next": (a < 0) ? "Previous": null;
			this.showPage(d, e)
		}
		this.fireEvent("pageLoad")
	},
	refresh: function () {
		if (this.initializePages()) this.loadPageByOffset(0)
	},
	onStoryboardComplete: function (a, e) {
		var b = this.nextPage;
		var c = this.currentPage;
		b.visibility = "Visible";
		c.visibility = "Collapsed";
		c.children.clear();
		this.currentPage = this.nextPage;
		this.nextPage = c;
		this.storyboard.stop();
		this.initializePages()
	},
	onSizeChanged: function () {
		SlideShow.PageContainer.base.onSizeChanged.call(this);
		this.pageIndex = 0;
		if (this.parent.root.visibility != "Collapsed") {
			window.clearTimeout(this.refreshTimerId);
			this.refreshTimerId = window.setTimeout(SlideShow.createDelegate(this, this.refresh), 10)
		}
	}
});﻿SlideShow.PageNavigation = function (a, b, c) {
	SlideShow.PageNavigation.base.constructor.call(this, a, b, c)
};
SlideShow.extend(SlideShow.SlideNavigation, SlideShow.PageNavigation, {
	showPreviousPage: function () {
		this.parent.pageContainer.loadPageByOffset( - 1)
	},
	showNextPage: function () {
		this.parent.pageContainer.loadPageByOffset(1)
	}
});﻿SlideShow.AlbumButton = function (a, b, c, d) {
	var e = '<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="AlbumButton" Visibility="Collapsed">' + '	<Canvas.Resources>' + '		<Storyboard x:Name="HoverStoryboard">' + '			<ColorAnimationUsingKeyFrames Storyboard.TargetName="Background" Storyboard.TargetProperty="(Fill).(Color)">' + '				<LinearColorKeyFrame x:Name="HoverKeyFrame" />' + '			</ColorAnimationUsingKeyFrames>' + '		</Storyboard>' + '		<Storyboard x:Name="LoadStoryboard" Storyboard.TargetName="Image" Storyboard.TargetProperty="Opacity">' + '			<DoubleAnimation x:Name="LoadAnimation" To="1" />' + '		</Storyboard>' + '	</Canvas.Resources>' + '	<Canvas.Clip>' + '		<RectangleGeometry x:Name="Clip" />' + '	</Canvas.Clip>' + '	<Rectangle x:Name="Background" />' + '	<Rectangle x:Name="ImageBackground" />' + '	<Rectangle x:Name="Image" Opacity="0">' + '		<Rectangle.Fill>' + '			<ImageBrush x:Name="ImageBrush" />' + '		</Rectangle.Fill>' + '	</Rectangle>' + '	<TextBlock x:Name="TitleTextBlock" TextWrapping="Wrap" />' + '	<TextBlock x:Name="DescriptionTextBlock" TextWrapping="Wrap" />' + '</Canvas>';
	SlideShow.AlbumButton.base.constructor.call(this, a, b, e);
	SlideShow.merge(this.options, {
		background: "#222",
		backgroundHover: "#333",
		hoverAnimationDuration: 0.2,
		loadAnimationDuration: 0.5,
		radius: 4,
		stroke: "#333",
		strokeThickness: 1,
		imageWidth: 75,
		imageHeight: 60,
		imagePaddingTop: 6,
		imagePaddingLeft: 6,
		imageBackground: "#777",
		imageSource: null,
		imageStretch: "UniformToFill",
		imageRadius: 0,
		imageStroke: "#333",
		imageStrokeThickness: 1,
		titleWidth: 126,
		titleHeight: 20,
		titlePaddingTop: 4,
		titlePaddingLeft: 6,
		titleFontFamily: "Portable User Interface",
		titleFontSize: 12,
		titleFontStretch: "Normal",
		titleFontStyle: "Normal",
		titleFontWeight: "Bold",
		titleForeground: "White",
		descriptionWidth: 126,
		descriptionHeight: 52,
		descriptionPaddingTop: 0,
		descriptionPaddingLeft: 6,
		descriptionFontFamily: "Portable User Interface",
		descriptionFontSize: 10,
		descriptionFontStretch: "Normal",
		descriptionFontStyle: "Normal",
		descriptionFontWeight: "Normal",
		descriptionForeground: "#777"
	});
	this.setOptions(d);
	this.album = c;
	this.hoverStoryboard = this.root.findName("HoverStoryboard");
	this.hoverKeyFrame = this.root.findName("HoverKeyFrame");
	this.loadStoryboard = this.root.findName("LoadStoryboard");
	this.loadAnimation = this.root.findName("LoadAnimation");
	this.clip = this.root.findName("Clip");
	this.background = this.root.findName("Background");
	this.imageBackground = this.root.findName("ImageBackground");
	this.image = this.root.findName("Image");
	this.imageBrush = this.root.findName("ImageBrush");
	this.titleTextBlock = this.root.findName("TitleTextBlock");
	this.descriptionTextBlock = this.root.findName("DescriptionTextBlock")
};
SlideShow.extend(SlideShow.Button, SlideShow.AlbumButton, {
	render: function () {
		SlideShow.AlbumButton.base.render.call(this);
		if (!this.album) throw new Error("Album missing");
		else if (this.album.image) this.options.imageSource = this.album.image;
		else if (this.album.slide && this.album.slide.length) this.options.imageSource = this.album.slide[0].image;
		this.clip.rect = SlideShow.formatString("0,0,{0},{1}", this.options.width, this.options.height);
		this.clip.radiusX = this.options.radius;
		this.clip.radiusY = this.options.radius;
		this.background.width = this.options.width;
		this.background.height = this.options.height;
		this.background.radiusX = this.options.radius;
		this.background.radiusY = this.options.radius;
		this.background.fill = this.options.background;
		this.background.stroke = this.options.stroke;
		this.background.strokeThickness = this.options.strokeThickness;
		this.imageBackground.width = this.options.imageWidth;
		this.imageBackground.height = this.options.imageHeight;
		this.imageBackground["Canvas.Top"] = this.options.imagePaddingTop;
		this.imageBackground["Canvas.Left"] = this.options.imagePaddingLeft;
		this.imageBackground.radiusX = this.options.imageRadius;
		this.imageBackground.radiusY = this.options.imageRadius;
		this.imageBackground.fill = this.options.imageBackground;
		this.imageBackground.stroke = this.options.imageStroke;
		this.imageBackground.strokeThickness = this.options.imageStrokeThickness;
		this.image.width = this.options.imageWidth;
		this.image.height = this.options.imageHeight;
		this.image["Canvas.Top"] = this.options.imagePaddingTop;
		this.image["Canvas.Left"] = this.options.imagePaddingLeft;
		this.image.radiusX = this.options.imageRadius;
		this.image.radiusY = this.options.imageRadius;
		this.image.stroke = this.options.imageStroke;
		this.image.strokeThickness = this.options.imageStrokeThickness;
		this.imageBrush.stretch = this.options.imageStretch;
		this.imageBrush.imageSource = this.options.imageSource;
		if (this.imageBrush.downloadProgress == 1) {
			this.image.opacity = 1
		} else {
			this.loadAnimation.duration = "0:0:" + this.options.loadAnimationDuration;
			this.imageBrush.addEventListener("DownloadProgressChanged", SlideShow.createDelegate(this, this.onImageDownloadProgressChanged));
			this.imageBrush.addEventListener("ImageFailed", SlideShow.createDelegate(this, this.onImageDownloadFailed))
		}
		this.titleTextBlock.width = this.options.titleWidth;
		this.titleTextBlock.height = this.options.titleHeight;
		this.titleTextBlock["Canvas.Top"] = this.options.titlePaddingTop;
		this.titleTextBlock["Canvas.Left"] = (this.options.imageWidth > 0) ? this.options.imagePaddingLeft + this.options.imageWidth + this.options.titlePaddingLeft: this.options.titlePaddingLeft;
		this.titleTextBlock.fontFamily = this.options.titleFontFamily;
		this.titleTextBlock.fontSize = this.options.titleFontSize;
		this.titleTextBlock.fontStretch = this.options.titleFontStretch;
		this.titleTextBlock.fontStyle = this.options.titleFontStyle;
		this.titleTextBlock.fontWeight = this.options.titleFontWeight;
		this.titleTextBlock.foreground = this.options.titleForeground;
		SlideShow.addTextToBlock(this.titleTextBlock, this.album.title);
		this.descriptionTextBlock.width = this.options.descriptionWidth;
		this.descriptionTextBlock.height = this.options.descriptionHeight;
		this.descriptionTextBlock["Canvas.Top"] = (this.options.titleHeight > 0) ? this.options.titlePaddingTop + this.options.titleHeight + this.options.descriptionPaddingTop: this.options.descriptionPaddingTop;
		this.descriptionTextBlock["Canvas.Left"] = (this.options.imageWidth > 0) ? this.options.imagePaddingLeft + this.options.imageWidth + this.options.descriptionPaddingLeft: this.options.descriptionPaddingLeft;
		this.descriptionTextBlock.fontFamily = this.options.descriptionFontFamily;
		this.descriptionTextBlock.fontSize = this.options.descriptionFontSize;
		this.descriptionTextBlock.fontStretch = this.options.descriptionFontStretch;
		this.descriptionTextBlock.fontStyle = this.options.descriptionFontStyle;
		this.descriptionTextBlock.fontWeight = this.options.descriptionFontWeight;
		this.descriptionTextBlock.foreground = this.options.descriptionForeground;
		SlideShow.addTextToBlock(this.descriptionTextBlock, this.album.description);
		this.hoverKeyFrame.keyTime = SlideShow.formatString("0:0:{0}", this.options.hoverAnimationDuration)
	},
	setState: function (a) {
		SlideShow.AlbumButton.base.setState.call(this, a);
		switch (a) {
		case "Hover":
		case "ActiveHover":
		case "InactiveHover":
			this.hoverKeyFrame.value = this.options.backgroundHover;
			this.hoverStoryboard.begin();
			break;
		default:
			this.hoverKeyFrame.value = this.options.background;
			this.hoverStoryboard.begin();
			break
		}
	},
	onImageDownloadProgressChanged: function (a, e) {
		if (a.downloadProgress == 1) this.loadStoryboard.begin()
	},
	onImageDownloadFailed: function (a, e) {
		throw new Error("Image download failed: " + this.imageBrush.imageSource);
	},
	onClick: function (e) {
		SlideShow.AlbumButton.base.onClick.call(this, this.album)
	}
});﻿SlideShow.AlbumNavigation = function (a, b, c) {
	var d = '<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="AlbumNavigation" Visibility="Collapsed"><TextBlock x:Name="StatusTextBlock" /></Canvas>';
	SlideShow.AlbumNavigation.base.constructor.call(this, a, b, d);
	SlideShow.merge(this.options, {
		left: "50%",
		bottom: 0,
		width: 140,
		height: 30,
		foreground: "#777",
		fontFamily: "Portable User Interface",
		fontSize: 12,
		fontStretch: "Normal",
		fontStyle: "Normal",
		fontWeight: "Normal",
		previousButton: {
			width: 24,
			height: 30,
			radius: 0,
			strokeThickness: 0,
			backgroundColor1: "Transparent",
			backgroundColor2: "Transparent",
			pathData: "M0.049999999,0.81200001 C0.049999999,0.39115903 0.39115902,0.049999999 0.81199999,0.049999999 L2.711,0.049999999 C3.1318409,0.049999999 3.473,0.39115903 3.473,0.81200001 L3.473,9.1880002 C3.473,9.6088412 3.1318409,9.9500002 2.711,9.9500002 L0.81199999,9.9500002 C0.39115902,9.9500002 0.049999999,9.6088412 0.049999999,9.1880002 z M-3.3603748,0.016 L-9.344,4.9998124 -3.3599998,9.9840002 Z",
			pathWidth: 10,
			pathHeight: 8,
			pathFill: "#777",
			pathFillDisabled: "#333"
		},
		nextButton: {
			right: 0,
			width: 24,
			height: 30,
			radius: 0,
			strokeThickness: 0,
			backgroundColor1: "Transparent",
			backgroundColor2: "Transparent",
			pathData: "M0.049999999,0.81200001 C0.049999999,0.39115903 0.39115902,0.049999999 0.81199999,0.049999999 L2.711,0.049999999 C3.1318409,0.049999999 3.473,0.39115903 3.473,0.81200001 L3.473,9.1880002 C3.473,9.6088412 3.1318409,9.9500002 2.711,9.9500002 L0.81199999,9.9500002 C0.39115902,9.9500002 0.049999999,9.6088412 0.049999999,9.1880002 z M6.9063742,0.016 L12.875,4.9998124 6.8910001,9.9840002 Z",
			pathWidth: 10,
			pathHeight: 8,
			pathFill: "#777",
			pathFillDisabled: "#333"
		}
	});
	this.setOptions(c);
	this.previousButton = new SlideShow.PathButton(a, this, this.options.previousButton);
	this.nextButton = new SlideShow.PathButton(a, this, this.options.nextButton);
	this.statusTextBlock = this.root.findName("StatusTextBlock");
	this.previousButton.addEventListener("click", SlideShow.createDelegate(this, this.onPreviousClick));
	this.nextButton.addEventListener("click", SlideShow.createDelegate(this, this.onNextClick));
	b.pageContainer.addEventListener("pageLoad", SlideShow.createDelegate(this, this.onPageLoad))
};
SlideShow.extend(SlideShow.PageNavigation, SlideShow.AlbumNavigation, {
	render: function () {
		SlideShow.AlbumNavigation.base.render.call(this);
		this.statusTextBlock.width = this.options.width - this.previousButton.options.width - this.nextButton.options.width;
		this.statusTextBlock.height = this.options.height;
		this.statusTextBlock.foreground = this.options.foreground;
		this.statusTextBlock.fontFamily = this.options.fontFamily;
		this.statusTextBlock.fontSize = this.options.fontSize;
		this.statusTextBlock.fontStretch = this.options.fontStretch;
		this.statusTextBlock.fontStyle = this.options.fontStyle;
		this.statusTextBlock.fontWeight = this.options.fontWeight
	},
	setStatus: function (a) {
		SlideShow.addTextToBlock(this.statusTextBlock, a);
		this.statusTextBlock["Canvas.Top"] = this.root.height / 2 - this.statusTextBlock.actualHeight / 2;
		this.statusTextBlock["Canvas.Left"] = this.root.width / 2 - this.statusTextBlock.actualWidth / 2
	},
	onPreviousClick: function (a, e) {
		this.showPreviousPage()
	},
	onNextClick: function (a, e) {
		this.showNextPage()
	},
	onPageLoad: function (a, e) {
		var b = this.parent.pageContainer.pageIndex;
		var c = this.parent.pageContainer.pageCount;
		this.setStatus(SlideShow.formatString("Page {0} of {1}", b + 1, c));
		if (b > 0) this.previousButton.enable();
		else this.previousButton.disable();
		if (b < c - 1) this.nextButton.enable();
		else this.nextButton.disable();
		this.root.visibility = (c > 0) ? "Visible": "Collapsed"
	}
});﻿SlideShow.AlbumViewer = function (a, b, c) {
	var d = '<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="AlbumViewer" Visibility="Collapsed" />';
	SlideShow.AlbumViewer.base.constructor.call(this, a, b, d);
	SlideShow.merge(this.options, {
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		background: "Black",
		visibility: "Collapsed",
		transitionSlideOnAlbumChange: true,
		pageContainer: {},
		albumNavigation: {},
		albumButton: {}
	});
	this.setOptions(c);
	this.pageContainer = new SlideShow.PageContainer(a, this, this.options.pageContainer);
	this.albumNavigation = new SlideShow.AlbumNavigation(a, this, this.options.albumNavigation);
	this.pageContainer.options.bottom = this.albumNavigation.options.height;
	this.control.addEventListener("modulesLoad", SlideShow.createDelegate(this, this.onModulesLoad))
};
SlideShow.extend(SlideShow.UserControl, SlideShow.AlbumViewer, {
	getItems: function (a, b) {
		var c = [];
		for (var i = a, j = a + b; i < j; i++) {
			var d = this.control.data.album[i];
			if (d) {
				var e = new SlideShow.AlbumButton(this.control, null, d, this.options.albumButton);
				e.addEventListener("click", SlideShow.createDelegate(this, this.onAlbumClick));
				c.push(e)
			}
		}
		return c
	},
	getItemCount: function () {
		return this.control.isAlbumIndexValid(0) ? this.control.data.album.length: 0
	},
	onModulesLoad: function (a, e) {
		this.slideViewer = this.control.modules["SlideViewer"];
		if (!this.slideViewer) throw new Error("Expected module missing: SlideViewer");
	},
	onAlbumClick: function (a, e) {
		for (var i = 0, j = this.control.data.album.length; i < j; i++) {
			if (this.control.data.album[i] == e && (this.slideViewer.currentAlbumIndex != i || this.slideViewer.currentSlideIndex != 0)) {
				this.slideViewer.currentAlbumIndex = i;
				this.slideViewer.currentSlideIndex = 0;
				this.slideViewer.loadImageByOffset(0, this.options.transitionSlideOnAlbumChange)
			}
		}
		this.fireEvent("albumClick", e)
	}
});﻿SlideShow.DataProvider = function (a) {
	SlideShow.DataProvider.base.constructor.call(this);
	this.control = a
};
SlideShow.extend(SlideShow.Object, SlideShow.DataProvider, {});﻿SlideShow.FadeTransition = function (a, b) {
	SlideShow.FadeTransition.base.constructor.call(this, a);
	SlideShow.merge(this.options, {
		direction: "InOut",
		duration: 0.8
	});
	this.setOptions(b)
};
SlideShow.extend(SlideShow.Transition, SlideShow.FadeTransition, {
	begin: function (a, b) {
		SlideShow.FadeTransition.base.begin.call(this, a, b);
		switch (this.options.direction.toLowerCase()) {
		case "in":
			a.root.visibility = "Collapsed";
			b.root.visibility = "Visible";
			break;
		case "inout":
			a.root.visibility = "Visible";
			b.root.visibility = "Visible";
			break;
		default:
			throw new Error("Invalid direction: " + this.options.direction);
		}
		var c = '<DoubleAnimation Duration="0:0:' + this.options.duration + '" From="1" To="0" />';
		var d = this.addStoryboard(a, a.image.name, "Opacity", c);
		d.addEventListener("Completed", SlideShow.createDelegate(this, this.onOutStoryboardComplete));
		d.begin();
		var e = '<DoubleAnimation Duration="0:0:' + this.options.duration + '" From="0" To="1" />';
		var f = this.addStoryboard(b, b.image.name, "Opacity", e);
		f.addEventListener("Completed", SlideShow.createDelegate(this, this.onInStoryboardComplete));
		f.begin()
	}
});﻿SlideShow.FlickrDataProvider = function (a, b) {
	SlideShow.FlickrDataProvider.base.constructor.call(this, a);
	SlideShow.merge(this.options, {
		apiKey: "b45329018eafdf2a4f89ebf6fb2bf47a",
		userName: null,
		usePublic: false,
		maxPublicPhotos: 100,
		transition: "CrossFadeTransition"
	});
	this.setOptions(b);
	this.albums = {};
	this.data = {
		transition: this.options.transition,
		album: []
	}
};
SlideShow.extend(SlideShow.DataProvider, SlideShow.FlickrDataProvider, {
	getData: function (a) {
		this.dataHandler = a;
		this.getUserId(this.options.userName)
	},
	getUserId: function (a) {
		this.callFlickr("flickr.people.findByUsername&username=" + a, SlideShow.createDelegate(this, this.onUserIdCallback))
	},
	getPhotosets: function (a) {
		this.callFlickr("flickr.photosets.getList&user_id=" + a, SlideShow.createDelegate(this, this.onPhotosetsCallback))
	},
	getPhotos: function (a) {
		this.callFlickr("flickr.photosets.getPhotos&photoset_id=" + a, SlideShow.createDelegate(this, this.onPhotosCallback))
	},
	getPublicPhotos: function (a) {
		this.callFlickr("flickr.people.getPublicPhotos&user_id=" + a + "&per_page=" + this.options.maxPublicPhotos, SlideShow.createDelegate(this, this.onPublicPhotosCallback))
	},
	callFlickr: function (a, b) {
		var c = SlideShow.getUniqueId("SlideShow_Callback_");
		var d = new SlideShow.JsonParser();
		d.addEventListener("callback", b);
		d.fromFeed("http://api.flickr.com/services/rest/?api_key=" + this.options.apiKey + "&format=json&jsoncallback=" + c + "&method=" + a, c)
	},
	buildAlbum: function (a) {
		var b = {};
		b.title = a.title._content;
		b.description = a.description._content;
		b.image = this.buildImageUrl(a.farm, a.server, a.primary, a.secret, "s");
		b.slide = [];
		return b
	},
	buildSlide: function (a) {
		var b = {};
		b.title = a.title;
		b.description = a.description || "";
		b.image = this.buildImageUrl(a.farm, a.server, a.id, a.secret);
		return b
	},
	buildImageUrl: function (a, b, c, d, e) {
		return SlideShow.formatString("http://farm{0}.static.flickr.com/{1}/{2}_{3}{4}.jpg", a, b, c, d, (e) ? "_" + e: "")
	},
	onUserIdCallback: function (a, e) {
		if (e.stat == "ok") {
			if (this.options.usePublic) this.getPublicPhotos(e.user.id);
			else this.getPhotosets(e.user.id)
		} else {
			throw new Error("Feed failed: " + e.message);
		}
	},
	onPhotosetsCallback: function (a, e) {
		if (e.stat == "ok") {
			this.albumCount = e.photosets.photoset.length;
			for (var i = 0, j = this.albumCount; i < j; i++) {
				var b = e.photosets.photoset[i];
				var c = this.buildAlbum(b);
				this.data.album.push(c);
				this.albums[b.id] = c;
				this.getPhotos(b.id)
			}
		} else {
			throw new Error("Feed failed: " + e.message);
		}
	},
	onPhotosCallback: function (a, e) {
		if (e.stat == "ok") {
			var b = this.albums[e.photoset.id];
			for (var i = 0, j = e.photoset.photo.length; i < j; i++) {
				var c = this.buildSlide(e.photoset.photo[i]);
				b.slide.push(c)
			}
			if (--this.albumCount == 0) this.dataHandler(this, {
				data: this.data
			})
		} else {
			throw new Error("Feed failed: " + e.message);
		}
	},
	onPublicPhotosCallback: function (a, e) {
		if (e.stat == "ok") {
			var b = {};
			b.title = "Public Photos";
			b.description = "";
			var c = e.photos.photo[0];
			if (c != null) {
				b.image = this.buildImageUrl(c.farm, c.server, c.id, c.secret, "s");
				b.slide = [];
				this.data.album.push(b);
				this.albums[0] = b;
				this.albumCount = 1;
				for (var i = 0; i < e.photos.total && i < e.photos.perpage; i++) {
					var d = this.buildSlide(e.photos.photo[i]);
					b.slide.push(d)
				}
			}
			if (--this.albumCount == 0) this.dataHandler(this, {
				data: this.data
			})
		} else {
			throw new Error("Feed failed: " + e.message);
		}
	}
});﻿SlideShow.NavigationTray = function (a, b, c) {
	var d = '<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="NavigationTray" Visibility="Collapsed">' + '	<Canvas.RenderTransform>' + '		<TranslateTransform x:Name="SlideTransform" />' + '	</Canvas.RenderTransform>' + '	<Canvas.Resources>' + '		<Storyboard x:Name="FadeStoryboard" Storyboard.TargetName="NavigationTray" Storyboard.TargetProperty="Opacity">' + '			<DoubleAnimation x:Name="FadeAnimation" />' + '		</Storyboard>' + '		<Storyboard x:Name="SlideStoryboard" Storyboard.TargetName="SlideTransform" Storyboard.TargetProperty="Y">' + '			<DoubleAnimationUsingKeyFrames> ' + '				<SplineDoubleKeyFrame x:Name="SlideKeyFrame1" KeySpline="0,0 0,0" KeyTime="0:0:0" />' + '				<SplineDoubleKeyFrame x:Name="SlideKeyFrame2" KeySpline="0,0 0,1" />' + '			</DoubleAnimationUsingKeyFrames> ' + '		</Storyboard>' + '	</Canvas.Resources>' + '</Canvas>';
	SlideShow.NavigationTray.base.constructor.call(this, a, b, d);
	SlideShow.merge(this.options, {
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		background: "#3C3C3C",
		alwaysVisibleHeight: 42,
		enableFadeAnimation: true,
		enableInitialFade: true,
		initialFadeTimout: 1000,
		initialAlbumView: false,
		fadeOpacity: 0.4,
		fadeInAnimationDuration: 0.5,
		fadeOutAnimationDuration: 0.5,
		slideAnimationDuration: 0.6,
		container: {
			top: 0,
			left: "50%",
			width: 500,
			height: 42
		},
		slideShowNavigation: {
			top: 11,
			left: 5
		},
		thumbnailViewer: {
			top: 3,
			left: 76,
			width: 350,
			height: 36
		},
		toggleAlbumViewButton: {
			top: 11,
			right: 32,
			pathData: "M0.3068684,6.6970766E-23 L4.8691305,6.6970766E-23 C5.0380702,3.6356173E-08 5.1759998,0.13792887 5.1759998,0.30690225 L5.1759998,2.6368366 C5.1759998,2.8058099 5.0380702,2.9437565 4.8691305,2.9437565 L0.3068684,2.9437565 C0.13680684,2.9437565 1.2251062E-13,2.8058099 -3.3276147E-30,2.6368366 L-3.3276147E-30,0.30690225 C1.2251062E-13,0.13792887 0.13680684,3.6356173E-08 0.3068684,6.6970766E-23 z M6.5989051,3.4025645E-07 L11.162244,3.4025645E-07 C11.331214,2.5640611E-07 11.468,0.13793494 11.468,0.30690496 L11.468,2.6368515 C11.468,2.8058217 11.331214,2.9437562 11.162244,2.9437562 L6.5989051,2.9437562 C6.4299352,2.9437562 6.2920002,2.8058217 6.2920002,2.6368515 L6.2920002,0.30690496 C6.2920002,0.13793494 6.4299352,2.5640611E-07 6.5989051,3.4025645E-07 z M0.30690471,4.0560001 L4.8690952,4.0560001 C5.0380656,4.0560001 5.1760002,4.1927856 5.1760002,4.3617556 L5.1760002,6.6928522 C5.1760002,6.861822 5.0380656,6.9997566 4.8690952,6.9997566 L0.30690471,6.9997566 C0.1367853,6.9997566 4.0662732E-08,6.861822 -3.3276153E-30,6.6928522 L-3.3276153E-30,4.3617556 C4.0662732E-08,4.1927856 0.1367853,4.0560001 0.30690471,4.0560001 z M6.5989051,4.0560005 L11.162244,4.0560005 C11.331214,4.0560005 11.468,4.192786 11.468,4.3617559 L11.468,6.6928519 C11.468,6.8618216 11.331214,6.9997562 11.162244,6.9997562 L6.5989051,6.9997562 C6.4299352,6.9997562 6.2920002,6.8618216 6.2920002,6.6928519 L6.2920002,4.3617559 C6.2920002,4.192786 6.4299352,4.0560005 6.5989051,4.0560005 z M0.30690471,8.1120001 L4.8690952,8.1120001 C5.0380656,8.1120001 5.1760002,8.2487856 5.1760002,8.4177556 L5.1760002,10.748852 C5.1760002,10.917822 5.0380656,11.055757 4.8690952,11.055757 L0.30690471,11.055757 C0.1367853,11.055757 4.0662732E-08,10.917822 -3.3276153E-30,10.748852 L-3.3276153E-30,8.4177556 C4.0662732E-08,8.2487856 0.1367853,8.1120001 0.30690471,8.1120001 z M6.5989051,8.1120005 L11.162244,8.1120005 C11.331214,8.1120005 11.468,8.248786 11.468,8.4177559 L11.468,10.748852 C11.468,10.917822 11.331214,11.055756 11.162244,11.055756 L6.5989051,11.055756 C6.4299352,11.055756 6.2920002,10.917822 6.2920002,10.748852 L6.2920002,8.4177559 C6.2920002,8.248786 6.4299352,8.1120005 6.5989051,8.1120005 Z",
			pathWidth: 11,
			pathHeight: 11
		},
		albumViewer: {
			top: 42
		},
		toggleFullScreenModeButton: {
			top: 11,
			right: 5,
			pathData: "M 7.90548,1.32341L 14.6458,1.32341L 14.6458,8.02661L 12.3811,5.78146L 8.43281,9.72004L 6.21009,7.42345L 10.1668,3.57935L 7.90548,1.32341 Z M -1.60064e-007,1.35265L 6.66667,1.35265L 6.66667,2.68583L 1.32284,2.68583L 1.32284,13.3317L 13.323,13.3317L 13.323,9.33174L 14.6562,9.33174L 14.6562,13.6585L 14.6458,13.6585L 14.6458,14.6963L -8.30604e-007,14.6963L -2.59563e-008,14.6651L -8.30604e-007,13.3317L -1.60064e-007,2.68583L -2.59563e-008,2.32351L -1.60064e-007,1.35265 Z",
			pathWidth: 12,
			pathHeight: 10
		}
	});
	this.setOptions(c);
	this.container = new SlideShow.UserControl(a, this, '<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="NavigationContainer" Visibility="Collapsed" />', this.options.container);
	this.slideShowNavigation = new SlideShow.SlideShowNavigation(a, this.container, this.options.slideShowNavigation);
	this.thumbnailViewer = new SlideShow.ThumbnailViewer(this.control, this.container, this.options.thumbnailViewer);
	this.toggleAlbumViewButton = new SlideShow.PathButton(a, this.container, this.options.toggleAlbumViewButton);
	this.toggleFullScreenModeButton = new SlideShow.PathButton(a, this.container, this.options.toggleFullScreenModeButton);
	this.albumViewer = new SlideShow.AlbumViewer(a, this, this.options.albumViewer);
	this.fadeStoryboard = this.root.findName("FadeStoryboard");
	this.fadeAnimation = this.root.findName("FadeAnimation");
	this.slideTransform = this.root.findName("SlideTransform");
	this.slideStoryboard = this.root.findName("SlideStoryboard");
	this.slideKeyFrame1 = this.root.findName("SlideKeyFrame1");
	this.slideKeyFrame2 = this.root.findName("SlideKeyFrame2");
	this.slideShowNavigation.addEventListener("previousClick", SlideShow.createDelegate(this, this.slideOut));
	this.slideShowNavigation.addEventListener("playClick", SlideShow.createDelegate(this, this.slideOut));
	this.slideShowNavigation.addEventListener("nextClick", SlideShow.createDelegate(this, this.slideOut));
	this.thumbnailViewer.addEventListener("thumbnailClick", SlideShow.createDelegate(this, this.slideOut));
	this.thumbnailViewer.thumbnailNavigation.addEventListener("previousClick", SlideShow.createDelegate(this, this.slideOut));
	this.thumbnailViewer.thumbnailNavigation.addEventListener("nextClick", SlideShow.createDelegate(this, this.slideOut));
	this.toggleAlbumViewButton.addEventListener("click", SlideShow.createDelegate(this, this.onToggleAlbumViewClick));
	this.toggleFullScreenModeButton.addEventListener("click", SlideShow.createDelegate(this, this.onToggleFullScreenModeClick));
	this.albumViewer.addEventListener("albumClick", SlideShow.createDelegate(this, this.onAlbumClick));
	this.slideStoryboard.addEventListener("Completed", SlideShow.createDelegate(this, this.onSlideStoryboardCompleted));
	this.control.addEventListener("modulesLoad", SlideShow.createDelegate(this, this.onControlModulesLoad));
	this.control.addEventListener("dataLoad", SlideShow.createDelegate(this, this.onControlDataLoad));
	this.control.addEventListener("fullScreenChange", SlideShow.createDelegate(this, this.onControlFullScreenChange));
	if (this.options.enableFadeAnimation) {
		this.root.addEventListener("MouseMove", SlideShow.createDelegate(this, this.onMouseMove));
		this.root.addEventListener("MouseEnter", SlideShow.createDelegate(this, this.onMouseEnter));
		this.root.addEventListener("MouseLeave", SlideShow.createDelegate(this, this.onMouseLeave))
	}
};
SlideShow.extend(SlideShow.UserControl, SlideShow.NavigationTray, {
	render: function () {
		SlideShow.NavigationTray.base.render.call(this);
		this.root["Canvas.Top"] = this.root.height - this.options.alwaysVisibleHeight;
		this.toggleFullScreenModeButton.enable();
		if (this.options.enableFadeAnimation && this.options.enableInitialFade) {
			this.enableFade = true;
			window.setTimeout(SlideShow.createDelegate(this, this.fadeOut), this.options.initialFadeTimout)
		}
	},
	fadeIn: function () {
		if (this.enableFade) {
			var a = this.root.opacity;
			var b = 1;
			var c = 1 - this.options.fadeOpacity;
			var d = (b - a) / c * this.options.fadeInAnimationDuration;
			if (d > 0) {
				this.fadeAnimation.to = b;
				this.fadeAnimation.duration = "0:0:" + d.toFixed(8);
				this.fadeStoryboard.begin()
			}
		}
	},
	fadeOut: function () {
		if (this.enableFade && !this.isAlbumView && !this.isSlidingIn && !this.isSlidingOut) {
			var a = this.root.opacity;
			var b = this.options.fadeOpacity;
			var c = 1 - this.options.fadeOpacity;
			var d = (a - b) / c * this.options.fadeOutAnimationDuration;
			if (d > 0) {
				this.fadeAnimation.to = b;
				this.fadeAnimation.duration = "0:0:" + d.toFixed(8);
				this.fadeStoryboard.begin()
			}
		}
	},
	slideIn: function () {
		this.isAlbumView = false;
		this.isSlidingIn = true;
		this.isSlidingOut = false;
		this.fadeStoryboard.stop();
		this.albumViewer.pageContainer.refresh();
		this.albumViewer.root.visibility = "Visible";
		var a = this.slideTransform.y;
		var b = -(this.root.height - this.options.alwaysVisibleHeight);
		var c = this.root.height - this.options.alwaysVisibleHeight;
		var d = (a - b) / c * this.options.slideAnimationDuration;
		if (d > 0) {
			this.slideKeyFrame1.value = a;
			this.slideKeyFrame2.value = b;
			this.slideKeyFrame2.keyTime = "0:0:" + d.toFixed(8);
			this.slideStoryboard.begin()
		}
		this.thumbnailViewer.disablePreview()
	},
	slideOut: function () {
		if (this.isAlbumView || this.isSlidingIn) {
			this.isAlbumView = false;
			this.isSlidingIn = false;
			this.isSlidingOut = true;
			var a = this.slideTransform.y;
			var b = 0;
			var c = this.root.height - this.options.alwaysVisibleHeight;
			var d = (b - a) / c * this.options.slideAnimationDuration;
			if (d > 0) {
				this.slideKeyFrame1.value = a;
				this.slideKeyFrame2.value = b;
				this.slideKeyFrame2.keyTime = "0:0:" + d.toFixed(8);
				this.slideStoryboard.begin()
			}
			this.thumbnailViewer.resetPreview()
		}
	},
	onControlModulesLoad: function (a, e) {
		this.slideViewer = this.control.modules["SlideViewer"];
		if (!this.slideViewer) throw new Error("Expected module missing: SlideViewer");
	},
	onControlDataLoad: function (a, e) {
		if (this.control.isAlbumIndexValid(0)) {
			this.toggleAlbumViewButton.enable();
			if (this.options.initialAlbumView) this.slideIn()
		}
	},
	onControlFullScreenChange: function (a, e) {
		if (this.control.isFullScreenMode()) this.toggleFullScreenModeButton.setPath("M 12.9504,9.72004L 6.21009,9.72004L 6.21009,3.01684L 8.47481,5.26199L 12.4231,1.32341L 14.6458,3.62L 10.6891,7.4641L 12.9504,9.72004 Z M 3.51898e-007,1.35265L 6.66667,1.35265L 6.66667,2.68583L 1.32284,2.68583L 1.32284,13.3317L 13.323,13.3317L 13.323,9.33174L 14.6562,9.33174L 14.6562,13.6585L 14.6458,13.6585L 14.6458,14.6963L -1.79383e-006,14.6963L 3.51898e-007,14.6651L -1.79383e-006,13.3317L 3.51898e-007,2.68583L 3.51898e-007,2.32351L 3.51898e-007,1.35265 Z");
		else this.toggleFullScreenModeButton.setPath("M 7.90548,1.32341L 14.6458,1.32341L 14.6458,8.02661L 12.3811,5.78146L 8.43281,9.72004L 6.21009,7.42345L 10.1668,3.57935L 7.90548,1.32341 Z M -1.60064e-007,1.35265L 6.66667,1.35265L 6.66667,2.68583L 1.32284,2.68583L 1.32284,13.3317L 13.323,13.3317L 13.323,9.33174L 14.6562,9.33174L 14.6562,13.6585L 14.6458,13.6585L 14.6458,14.6963L -8.30604e-007,14.6963L -2.59563e-008,14.6651L -8.30604e-007,13.3317L -1.60064e-007,2.68583L -2.59563e-008,2.32351L -1.60064e-007,1.35265 Z")
	},
	onMouseMove: function (a, e) {
		this.fadeIn();
		this.enableFade = false
	},
	onMouseEnter: function (a, e) {
		this.fadeIn();
		this.enableFade = false
	},
	onMouseLeave: function (a, e) {
		this.enableFade = true;
		this.fadeOut()
	},
	onToggleAlbumViewClick: function (a, e) {
		if (this.isAlbumView || this.isSlidingIn) this.slideOut();
		else this.slideIn()
	},
	onToggleFullScreenModeClick: function (a, e) {
		this.control.toggleFullScreenMode()
	},
	onAlbumClick: function (a, e) {
		this.thumbnailViewer.pageContainer.pageIndex = 0;
		this.thumbnailViewer.pageContainer.initializePages();
		this.thumbnailViewer.pageContainer.loadPageByOffset(0);
		this.slideOut()
	},
	onSlideStoryboardCompleted: function (a, e) {
		this.isAlbumView = this.slideTransform.y != 0;
		this.isSlidingIn = false;
		this.isSlidingOut = false;
		this.onAlbumViewChanged()
	},
	onAlbumViewChanged: function () {
		this.albumViewer.root.visibility = this.isAlbumView ? "Visible": "Collapsed";
		this.enableFade = !this.isAlbumView;
		if (this.enableFade && this.options.enableFadeAnimation) window.setTimeout(SlideShow.createDelegate(this, this.fadeOut), this.options.initialFadeTimout)
	},
	onSizeChanged: function () {
		SlideShow.NavigationTray.base.onSizeChanged.call(this);
		this.root["Canvas.Top"] = this.root.height - this.options.alwaysVisibleHeight;
		if (this.isAlbumView || this.isSlidingIn) {
			this.isAlbumView = true;
			this.isSlidingIn = false;
			this.isSlidingOut = false;
			this.slideStoryboard.stop();
			this.slideTransform.y = -this.root["Canvas.Top"];
			this.onAlbumViewChanged()
		} else if (this.isSlidingOut) {
			this.isAlbumView = false;
			this.isSlidingIn = false;
			this.isSlidingOut = false;
			this.slideStoryboard.stop();
			this.slideTransform.y = 0;
			this.onAlbumViewChanged()
		}
	}
});﻿SlideShow.NoTransition = function (a) {
	SlideShow.NoTransition.base.constructor.call(this, a)
};
SlideShow.extend(SlideShow.Transition, SlideShow.NoTransition, {
	begin: function (a, b) {
		SlideShow.NoTransition.base.begin.call(this, a, b);
		a.root.visibility = "Collapsed";
		b.root.visibility = "Visible";
		this.complete()
	}
});﻿SlideShow.PathButton = function (a, b, c) {
	var d = '<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="PathButton" Visibility="Collapsed">' + '	<Canvas.Resources>' + '		<Storyboard x:Name="HoverStoryboard">' + '			<ColorAnimationUsingKeyFrames Storyboard.TargetName="Path" Storyboard.TargetProperty="(Fill).(Color)">' + '				<LinearColorKeyFrame x:Name="HoverKeyFrame" />' + '			</ColorAnimationUsingKeyFrames>' + '		</Storyboard>' + '	</Canvas.Resources>' + '	<Canvas.Clip>' + '		<RectangleGeometry x:Name="Clip" />' + '	</Canvas.Clip>' + '	<Rectangle x:Name="Background">' + '		<Rectangle.Fill>' + '			<LinearGradientBrush StartPoint="0.477254,1.16548" EndPoint="0.477254,0.0426189">' + '				<LinearGradientBrush.GradientStops>' + '					<GradientStop x:Name="BackgroundColor1" Offset="0.232877" />' + '					<GradientStop x:Name="BackgroundColor2" Offset="0.987288" />' + '				</LinearGradientBrush.GradientStops>' + '			</LinearGradientBrush>' + '		</Rectangle.Fill>' + '	</Rectangle>' + '	<Path x:Name="Path" />' + '</Canvas>';
	SlideShow.PathButton.base.constructor.call(this, a, b, d);
	SlideShow.merge(this.options, {
		radius: 2,
		stroke: "#7F808BBC",
		strokeThickness: 1,
		backgroundColor1: "#273B5B",
		backgroundColor2: "#6A75A2",
		pathData: null,
		pathWidth: 10,
		pathHeight: 10,
		pathStretch: "Uniform",
		pathFill: "#BDC3DF",
		pathFillHover: "White",
		pathFillDisabled: "#6A75A2",
		hoverAnimationDuration: 0.2
	});
	this.setOptions(c);
	this.hoverStoryboard = this.root.findName("HoverStoryboard");
	this.hoverKeyFrame = this.root.findName("HoverKeyFrame");
	this.clip = this.root.findName("Clip");
	this.background = this.root.findName("Background");
	this.backgroundColor1 = this.root.findName("BackgroundColor1");
	this.backgroundColor2 = this.root.findName("BackgroundColor2");
	this.path = this.root.findName("Path")
};
SlideShow.extend(SlideShow.Button, SlideShow.PathButton, {
	render: function () {
		SlideShow.PathButton.base.render.call(this);
		this.hoverKeyFrame.keyTime = SlideShow.formatString("0:0:{0}", this.options.hoverAnimationDuration);
		this.clip.rect = SlideShow.formatString("0,0,{0},{1}", this.options.width, this.options.height);
		this.clip.radiusX = this.options.radius;
		this.clip.radiusY = this.options.radius;
		this.background.width = this.options.width;
		this.background.height = this.options.height;
		this.background.radiusX = this.options.radius;
		this.background.radiusY = this.options.radius;
		this.background.stroke = this.options.stroke;
		this.background.strokeThickness = this.options.strokeThickness;
		this.backgroundColor1.color = this.options.backgroundColor1;
		this.backgroundColor2.color = this.options.backgroundColor2;
		this.path.data = this.options.pathData;
		this.path.width = this.options.pathWidth;
		this.path.height = this.options.pathHeight;
		this.path.stretch = this.options.pathStretch;
		this.path.fill = this.options.pathFillDisabled;
		this.path["Canvas.Top"] = this.options.height / 2 - this.options.pathHeight / 2;
		this.path["Canvas.Left"] = this.options.width / 2 - this.options.pathWidth / 2;
		this.disable()
	},
	setState: function (a) {
		SlideShow.PathButton.base.setState.call(this, a);
		switch (a) {
		case "Hover":
		case "ActiveHover":
		case "InactiveHover":
			this.hoverKeyFrame.value = this.options.pathFillHover;
			this.hoverStoryboard.begin();
			break;
		case "Disabled":
			this.hoverKeyFrame.value = this.options.pathFillDisabled;
			this.hoverStoryboard.begin();
			break;
		default:
			this.hoverKeyFrame.value = this.options.pathFill;
			this.hoverStoryboard.begin();
			break
		}
	},
	setPath: function (a, b, c) {
		this.path.data = a;
		this.path.width = b || this.options.pathWidth;
		this.path.height = c || this.options.pathHeight;
		this.path["Canvas.Top"] = this.root.height / 2 - this.path.height / 2;
		this.path["Canvas.Left"] = this.root.width / 2 - this.path.width / 2
	}
});﻿SlideShow.ProgressBar = function (a, b, c) {
	var d = '<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="ProgressBar" Visibility="Collapsed">' + '	<Canvas.Resources>' + '		<Storyboard x:Name="FadeStoryboard" Storyboard.TargetName="ProgressBar" Storyboard.TargetProperty="Opacity">' + '			<DoubleAnimation x:Name="FadeAnimation" />' + '		</Storyboard>' + '	</Canvas.Resources>' + '	<Rectangle x:Name="ProgressBackground" />' + '	<Rectangle x:Name="ProgressForeground" />' + '</Canvas>';
	SlideShow.ProgressBar.base.constructor.call(this, a, b, d);
	SlideShow.merge(this.options, {
		width: 180,
		height: 4,
		progressForeground: "#CCFFFFFF",
		progressBorderThickness: 0
	});
	this.setOptions(c);
	this.maxProgressForegroundWidth = 0;
	this.progressBackground = this.root.findName("ProgressBackground");
	this.progressForeground = this.root.findName("ProgressForeground")
};
SlideShow.extend(SlideShow.ProgressIndicator, SlideShow.ProgressBar, {
	render: function () {
		SlideShow.ProgressBar.base.render.call(this);
		this.progressBackground.fill = this.options.progressBackground;
		this.progressBackground.stroke = this.options.progressBorderColor;
		this.progressBackground.strokeThickness = this.options.progressBorderThickness;
		this.progressForeground.fill = this.options.progressForeground;
		this.progressForeground["Canvas.Top"] = this.options.progressBorderThickness;
		this.progressForeground["Canvas.Left"] = this.options.progressBorderThickness
	},
	updateProgress: function (a) {
		SlideShow.ProgressBar.base.updateProgress.call(this, a);
		this.progressForeground.width = a * this.maxProgressForegroundWidth
	},
	onSizeChanged: function () {
		SlideShow.ProgressBar.base.onSizeChanged.call(this);
		this.progressBackground.width = this.root.width;
		this.progressBackground.height = this.root.height;
		this.progressForeground.width = 0;
		this.progressForeground.height = this.root.height - this.options.progressBorderThickness * 2;
		this.maxProgressForegroundWidth = this.root.width - this.options.progressBorderThickness * 2
	}
});﻿SlideShow.ProgressPie = function (a, b, c) {
	var d = '<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="ProgressPie" Visibility="Collapsed">' + '	<Canvas.Resources>' + '		<Storyboard x:Name="FadeStoryboard" Storyboard.TargetName="ProgressPie" Storyboard.TargetProperty="Opacity">' + '			<DoubleAnimation x:Name="FadeAnimation" />' + '		</Storyboard>' + '	</Canvas.Resources>' + '	<Ellipse x:Name="ProgressBackground" />' + '	<Path x:Name="ProgressForeground" />' + '	<Ellipse x:Name="ProgressBorder" />' + '</Canvas>';
	SlideShow.ProgressPie.base.constructor.call(this, a, b, d);
	this.setOptions(c);
	this.progressBackground = this.root.findName("ProgressBackground");
	this.progressForeground = this.root.findName("ProgressForeground");
	this.progressBorder = this.root.findName("ProgressBorder")
};
SlideShow.extend(SlideShow.ProgressIndicator, SlideShow.ProgressPie, {
	render: function () {
		SlideShow.ProgressPie.base.render.call(this);
		this.progressBackground.fill = this.options.progressBackground;
		this.progressForeground.fill = this.options.progressForeground;
		this.progressBorder.stroke = this.options.progressBorderColor;
		this.progressBorder.strokeThickness = this.options.progressBorderThickness
	},
	updateProgress: function (a) {
		SlideShow.ProgressPie.base.updateProgress.call(this, a);
		var b = this.progressBackground.width / 2;
		var c = SlideShow.formatString("{0},{1}", b, b);
		var d = 2 * Math.PI * a;
		var e = (a > 0.5) ? 1 : 0;
		var f = SlideShow.formatString("0,{0}", -b);
		var g = (a < 1) ? SlideShow.formatString("{0},{1}", Math.sin(d) * b, Math.cos(d) * -b) : SlideShow.formatString("-0.05,{0}", -b);
		this.progressForeground.data = SlideShow.formatString("M {0} A {1} {2} {3} 1 {4} L 0,0", f, c, d, e, g)
	},
	onSizeChanged: function () {
		SlideShow.ProgressPie.base.onSizeChanged.call(this);
		var a = Math.min(this.root.width, this.root.height);
		var b = a / 2;
		var c = this.root.height / 2 - b;
		var d = this.root.width / 2 - b;
		this.progressBackground.width = a;
		this.progressBackground.height = a;
		this.progressBackground["Canvas.Top"] = c;
		this.progressBackground["Canvas.Left"] = d;
		this.progressForeground["Canvas.Top"] = c + b;
		this.progressForeground["Canvas.Left"] = d + b;
		this.progressBorder.width = a;
		this.progressBorder.height = a;
		this.progressBorder["Canvas.Top"] = c;
		this.progressBorder["Canvas.Left"] = d
	}
});﻿SlideShow.ShapeTransition = function (a, b) {
	SlideShow.ShapeTransition.base.constructor.call(this, a);
	SlideShow.merge(this.options, {
		shape: "Circle",
		direction: "Out",
		duration: 0.8
	});
	this.setOptions(b)
};
SlideShow.extend(SlideShow.Transition, SlideShow.ShapeTransition, {
	begin: function (a, b) {
		SlideShow.ShapeTransition.base.begin.call(this, a, b);
		switch (this.options.shape.toLowerCase()) {
		case "circle":
			var c = this.options.direction.toLowerCase();
			if (c != "out" && c != "in") throw new Error("Invalid direction: " + c);
			var d = Math.max(this.control.root.width, this.control.root.height);
			var e = (c == "out") ? 0 : d;
			var f = (c == "out") ? d: 0;
			var g = '<EllipseGeometry xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="CircleBehaviorPath" Center="' + (this.control.root.width / 2) + ',' + (this.control.root.height / 2) + '" RadiusX="' + e + '" RadiusY="' + e + '" />';
			var h = g + '<RectangleGeometry Rect="0,0,' + this.control.root.width + ',' + this.control.root.height + '" />';
			if (c == "out") {
				a.root.clip = this.createClippingPath(h);
				b.root.clip = this.createClippingPath(g)
			} else {
				a.root.clip = this.createClippingPath(g);
				b.root.clip = this.createClippingPath(h)
			}
			a.root.visibility = "Visible";
			b.root.visibility = "Visible";
			a.addEventListener("sizeChange", SlideShow.createDelegate(this, this.onSlideImageSizeChanged));
			b.addEventListener("sizeChange", SlideShow.createDelegate(this, this.onSlideImageSizeChanged));
			var i = '<DoubleAnimation Storyboard.TargetProperty="RadiusX" Duration="0:0:' + this.options.duration + '" To="' + f + '" />' + '<DoubleAnimation Storyboard.TargetProperty="RadiusY" Duration="0:0:' + this.options.duration + '" To="' + f + '" />';
			this.outStoryboard = this.addStoryboard(a, "CircleBehaviorPath", "RadiusX", i);
			this.outStoryboard.addEventListener("Completed", SlideShow.createDelegate(this, this.onOutStoryboardComplete));
			this.outStoryboard.begin();
			this.inStoryboard = this.addStoryboard(b, "CircleBehaviorPath", "RadiusX", i);
			this.inStoryboard.addEventListener("Completed", SlideShow.createDelegate(this, this.onInStoryboardComplete));
			this.inStoryboard.begin();
			break;
		default:
			throw new Error("Invalid shape: " + this.options.shape.toLowerCase());
		}
	},
	onSlideImageSizeChanged: function (a) {
		if (this.state = "Started") {
			this.outStoryboard.stop();
			this.inStoryboard.stop();
			SlideShow.ShapeTransition.base.complete.call(this)
		}
		var b = a.root.clip.children.getItem(0);
		var c = Math.max(this.control.root.width, this.control.root.height);
		var d = (a.parent.root.width / 2) + ',' + (a.parent.root.height / 2);
		b.center = d;
		b.radiusX = c;
		b.radiusY = c
	}
});﻿SlideShow.SlideDescription = function (a, b, c) {
	var d = '<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="SlideDescription" Visibility="Collapsed">' + '	<Canvas x:Name="VisibleCanvas">' + '		<Canvas.Resources>' + '			<Storyboard x:Name="SlideStoryboard" Storyboard.TargetName="SlideTransform" Storyboard.TargetProperty="Y">' + '				<DoubleAnimationUsingKeyFrames> ' + '					<SplineDoubleKeyFrame x:Name="SlideKeyFrame1" KeySpline="0,0 0,0" KeyTime="0:0:0" />' + '					<SplineDoubleKeyFrame x:Name="SlideKeyFrame2" KeySpline="0,0 0,1" />' + '				</DoubleAnimationUsingKeyFrames> ' + '			</Storyboard>' + '		</Canvas.Resources>' + '		<Canvas.RenderTransform>' + '			<TranslateTransform x:Name="SlideTransform" />' + '		</Canvas.RenderTransform>' + '		<Rectangle x:Name="Background" />' + '		<Rectangle x:Name="TitleRectangle" />' + '		<Rectangle x:Name="DescriptionRectangle" />' + '		<TextBlock x:Name="TitleTextBlock" TextWrapping="Wrap" />' + '		<TextBlock x:Name="DescriptionTextBlock" TextWrapping="Wrap" />' + '	</Canvas>' + '</Canvas>';
	SlideShow.SlideDescription.base.constructor.call(this, a, b, d);
	SlideShow.merge(this.options, {
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundFill: "Black",
		backgroundOpacity: 0,
		backgroundRadius: 0,
		titleHeight: 30,
		titlePaddingTop: 5,
		titlePaddingLeft: 8,
		titleFontFamily: "Portable User Interface",
		titleFontSize: 13,
		titleFontStretch: "Normal",
		titleFontStyle: "Normal",
		titleFontWeight: "Bold",
		titleForeground: "White",
		titleBackground: "Black",
		titleOpacity: 0.5,
		descriptionHeight: 30,
		descriptionPaddingTop: 6.5,
		descriptionPaddingLeft: 8,
		descriptionFontFamily: "Portable User Interface",
		descriptionFontSize: 11,
		descriptionFontStretch: "Normal",
		descriptionFontStyle: "Normal",
		descriptionFontWeight: "Normal",
		descriptionForeground: "White",
		descriptionBackground: "Black",
		descriptionOpacity: 0.2,
		slideAnimationDuration: 0.6,
		hideIfEmpty: false
	});
	this.setOptions(c);
	this.visibleCanvas = this.root.findName("VisibleCanvas");
	this.slideTransform = this.root.findName("SlideTransform");
	this.slideStoryboard = this.root.findName("SlideStoryboard");
	this.slideKeyFrame1 = this.root.findName("SlideKeyFrame1");
	this.slideKeyFrame2 = this.root.findName("SlideKeyFrame2");
	this.background = this.root.findName("Background");
	this.titleRectangle = this.root.findName("TitleRectangle");
	this.titleTextBlock = this.root.findName("TitleTextBlock");
	this.descriptionRectangle = this.root.findName("DescriptionRectangle");
	this.descriptionTextBlock = this.root.findName("DescriptionTextBlock");
	this.root.addEventListener("MouseEnter", SlideShow.createDelegate(this, this.onMouseEnter));
	this.root.addEventListener("MouseLeave", SlideShow.createDelegate(this, this.onMouseLeave));
	this.control.addEventListener("modulesLoad", SlideShow.createDelegate(this, this.onControlModulesLoad))
};
SlideShow.extend(SlideShow.UserControl, SlideShow.SlideDescription, {
	render: function () {
		SlideShow.SlideDescription.base.render.call(this);
		var a = this.options.titleHeight + this.options.descriptionHeight;
		this.visibleCanvas["Canvas.Top"] = -a - this.options.top;
		this.visibleCanvas.height = a;
		this.background.height = this.options.titleHeight + this.options.descriptionHeight;
		this.background.fill = this.options.backgroundFill;
		this.background.opacity = this.options.backgroundOpacity;
		this.background.radiusX = this.options.backgroundRadius;
		this.background.radiusY = this.options.backgroundRadius;
		this.titleRectangle.height = this.options.titleHeight;
		this.titleRectangle.fill = this.options.titleBackground;
		this.titleRectangle.opacity = this.options.titleOpacity;
		this.titleTextBlock["Canvas.Top"] = this.options.titlePaddingTop;
		this.titleTextBlock["Canvas.Left"] = this.options.titlePaddingLeft;
		this.titleTextBlock.height = this.options.titleHeight - this.options.titlePaddingTop * 2;
		this.titleTextBlock.fontFamily = this.options.titleFontFamily;
		this.titleTextBlock.fontSize = this.options.titleFontSize;
		this.titleTextBlock.fontStretch = this.options.titleFontStretch;
		this.titleTextBlock.fontStyle = this.options.titleFontStyle;
		this.titleTextBlock.fontWeight = this.options.titleFontWeight;
		this.titleTextBlock.foreground = this.options.titleForeground;
		this.descriptionRectangle["Canvas.Top"] = this.options.titleHeight;
		this.descriptionRectangle.height = this.options.descriptionHeight;
		this.descriptionRectangle.fill = this.options.descriptionBackground;
		this.descriptionRectangle.opacity = this.options.descriptionOpacity;
		this.descriptionTextBlock["Canvas.Top"] = this.options.descriptionPaddingTop + this.options.titleHeight;
		this.descriptionTextBlock["Canvas.Left"] = this.options.descriptionPaddingLeft;
		this.descriptionTextBlock.height = this.options.descriptionHeight - this.options.descriptionPaddingTop * 2;
		this.descriptionTextBlock.fontFamily = this.options.descriptionFontFamily;
		this.descriptionTextBlock.fontSize = this.options.descriptionFontSize;
		this.descriptionTextBlock.fontStretch = this.options.descriptionFontStretch;
		this.descriptionTextBlock.fontStyle = this.options.descriptionFontStyle;
		this.descriptionTextBlock.fontWeight = this.options.descriptionFontWeight;
		this.descriptionTextBlock.foreground = this.options.descriptionForeground
	},
	setTitle: function (a) {
		SlideShow.addTextToBlock(this.titleTextBlock, a)
	},
	setDescription: function (a) {
		SlideShow.addTextToBlock(this.descriptionTextBlock, a)
	},
	slideIn: function () {
		var a = this.slideTransform.y;
		var b = this.visibleCanvas.height + this.options.top;
		var c = this.visibleCanvas.height;
		var d = (b - a) / c * this.options.slideAnimationDuration;
		if (d > 0) {
			this.slideKeyFrame1.value = a;
			this.slideKeyFrame2.value = b;
			this.slideKeyFrame2.keyTime = "0:0:" + d.toFixed(8);
			this.slideStoryboard.begin()
		}
	},
	slideOut: function () {
		var a = this.slideTransform.y;
		var b = 0;
		var c = this.visibleCanvas.height;
		var d = (a - b) / c * this.options.slideAnimationDuration;
		if (d > 0) {
			this.slideKeyFrame1.value = a;
			this.slideKeyFrame2.value = b;
			this.slideKeyFrame2.keyTime = "0:0:" + d.toFixed(8);
			this.slideStoryboard.begin()
		}
	},
	onControlModulesLoad: function (a, e) {
		var b = this.control.modules["SlideViewer"];
		if (b) b.addEventListener("slideLoading", SlideShow.createDelegate(this, this.onSlideLoading))
	},
	onSlideLoading: function (a, e) {
		this.titleText = e ? e.title: "";
		this.descriptionText = e ? e.description: "";
		this.setTitle(this.titleText);
		this.setDescription(this.descriptionText);
		if (this.options.hideIfEmpty && !this.titleText && !this.descriptionText) this.slideOut()
	},
	onMouseEnter: function (a, e) {
		if (!this.options.hideIfEmpty || this.titleText || this.descriptionText) this.slideIn()
	},
	onMouseLeave: function (a, e) {
		this.slideOut()
	},
	onSizeChanged: function () {
		SlideShow.SlideDescription.base.onSizeChanged.call(this);
		var a = this.root.width;
		this.visibleCanvas.width = a;
		this.background.width = a;
		this.titleRectangle.width = a;
		this.descriptionRectangle.width = a;
		this.titleTextBlock.width = a - this.options.titlePaddingLeft * 2;
		this.descriptionTextBlock.width = a - this.options.descriptionPaddingLeft * 2;
		SlideShow.addTextToBlock(this.titleTextBlock, this.titleText);
		SlideShow.addTextToBlock(this.descriptionTextBlock, this.descriptionText)
	}
});﻿SlideShow.SlideImage = function (a, b, c) {
	var d = '<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="SlideImage" Visibility="Collapsed"><Image x:Name="Image" /></Canvas>';
	SlideShow.SlideImage.base.constructor.call(this, a, b, d);
	SlideShow.merge(this.options, {
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		stretch: "Uniform"
	});
	this.setOptions(c);
	this.image = this.root.findName("Image")
};
SlideShow.extend(SlideShow.UserControl, SlideShow.SlideImage, {
	render: function () {
		SlideShow.SlideImage.base.render.call(this);
		this.image.stretch = this.options.stretch
	},
	setSource: function (a) {
		this.image.source = a
	},
	onSizeChanged: function () {
		SlideShow.SlideImage.base.onSizeChanged.call(this);
		this.image.width = this.root.width;
		this.image.height = this.root.height;
		this.fireEvent("sizeChange")
	}
});﻿SlideShow.SlideShowNavigation = function (a, b, c) {
	var d = '<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="SlideShowNavigation" Visibility="Collapsed">' + '	<Rectangle x:Name="Background">' + '		<Rectangle.Fill>' + '			<LinearGradientBrush StartPoint="0.477254,1.16548" EndPoint="0.477254,0.0426189">' + '				<LinearGradientBrush.GradientStops>' + '					<GradientStop x:Name="BackgroundColor1" Offset="0.232877" />' + '					<GradientStop x:Name="BackgroundColor2" Offset="0.987288" />' + '				</LinearGradientBrush.GradientStops>' + '			</LinearGradientBrush>' + '		</Rectangle.Fill>' + '	</Rectangle>' + '</Canvas>';
	SlideShow.SlideShowNavigation.base.constructor.call(this, a, b, d);
	SlideShow.merge(this.options, {
		width: 66,
		height: 20,
		radius: 2,
		stroke: "#7FF19B77",
		strokeThickness: 1,
		backgroundColor1: "#7F2D12",
		backgroundColor2: "#E9A16B",
		playTimerInterval: 3000,
		enablePlayOnLoad: true,
		loopAlbum: false,
		playButton: {
			left: "50%",
			radius: 0,
			strokeThickness: 0,
			backgroundColor1: "Transparent",
			backgroundColor2: "Transparent",
			pathData: "M 100.048,736.889L 98.5482,736.889C 97.9959,736.889 97.5482,736.441 97.5482,735.889L 97.5482,727.889C 97.5482,727.337 97.9959,726.889 98.5482,726.889L 100.048,726.889C 100.6,726.889 101.048,727.337 101.048,727.889L 101.048,735.889C 101.048,736.441 100.6,736.889 100.048,736.889 Z M 106.922,736.889L 105.422,736.889C 104.87,736.889 104.422,736.441 104.422,735.889L 104.422,727.889C 104.422,727.337 104.87,726.889 105.422,726.889L 106.922,726.889C 107.475,726.889 107.922,727.337 107.922,727.889L 107.922,735.889C 107.922,736.441 107.475,736.889 106.922,736.889 Z",
			pathWidth: 10,
			pathHeight: 12,
			pathStretch: "Fill",
			pathFill: "#F2C29F",
			pathFillDisabled: "#D3895A"
		},
		previousButton: {
			radius: 0,
			strokeThickness: 0,
			backgroundColor1: "Transparent",
			backgroundColor2: "Transparent",
			pathData: "F1 M6.0000005,1.473075E-06 L6.0000005,10.000002 5.9604696E-07,5.0000014 6.0000005,1.473075E-06 z M-1.3709068E-06,4.0019114E-07 L-1.3709068E-06,10.000006 -6.0000029,5.0000029 -1.3709068E-06,4.0019114E-07 Z",
			pathWidth: 10,
			pathHeight: 8,
			pathFill: "#F2C29F",
			pathFillDisabled: "#D3895A"
		},
		nextButton: {
			right: 0,
			radius: 0,
			strokeThickness: 0,
			backgroundColor1: "Transparent",
			backgroundColor2: "Transparent",
			pathData: "F1 M-5.9999976,1.0552602E-05 L-1.9073478E-06,4.9999938 -1.9073478E-06,1.8062785E-05 5.9999981,5.0000033 -1.9073478E-06,10.000018 -1.9073478E-06,5.0000024 -5.9999976,9.9999857 -5.9999976,1.0552602E-05 Z",
			pathWidth: 10,
			pathHeight: 8,
			pathFill: "#F2C29F",
			pathFillDisabled: "#D3895A"
		}
	});
	this.setOptions(c);
	if (!this.options.enablePlayOnLoad) this.options.playButton.pathData = "F1 M 101.447,284.834L 101.447,274.714L 106.906,279.774L 101.447,284.834 Z";
	this.playButton = new SlideShow.PathButton(this.control, this, this.options.playButton);
	if (this.options.enablePreviousSlide) {
		this.previousButton = new SlideShow.PathButton(this.control, this, this.options.previousButton);
		this.previousButton.addEventListener("click", SlideShow.createDelegate(this, this.onPreviousClick))
	}
	if (this.options.enableNextSlide) {
		this.nextButton = new SlideShow.PathButton(this.control, this, this.options.nextButton);
		this.nextButton.addEventListener("click", SlideShow.createDelegate(this, this.onNextClick))
	}
	this.mode = "Pause";
	this.background = this.root.findName("Background");
	this.backgroundColor1 = this.root.findName("BackgroundColor1");
	this.backgroundColor2 = this.root.findName("BackgroundColor2");
	this.playButton.addEventListener("click", SlideShow.createDelegate(this, this.onPlayClick));
	this.control.root.addEventListener("KeyUp", SlideShow.createDelegate(this, this.onControlKeyPressed));
	this.control.addEventListener("dataLoad", SlideShow.createDelegate(this, this.onControlDataLoad))
};
SlideShow.extend(SlideShow.SlideNavigation, SlideShow.SlideShowNavigation, {
	render: function () {
		SlideShow.SlideShowNavigation.base.render.call(this);
		this.background.width = this.options.width;
		this.background.height = this.options.height;
		this.background.radiusX = this.options.radius;
		this.background.radiusY = this.options.radius;
		this.background.stroke = this.options.stroke;
		this.background.strokeThickness = this.options.strokeThickness;
		this.backgroundColor1.color = this.options.backgroundColor1;
		this.backgroundColor2.color = this.options.backgroundColor2
	},
	play: function () {
		if (this.mode != "Play") {
			this.mode = "Play";
			this.startPlayTimer();
			this.playButton.setPath("M 100.048,736.889L 98.5482,736.889C 97.9959,736.889 97.5482,736.441 97.5482,735.889L 97.5482,727.889C 97.5482,727.337 97.9959,726.889 98.5482,726.889L 100.048,726.889C 100.6,726.889 101.048,727.337 101.048,727.889L 101.048,735.889C 101.048,736.441 100.6,736.889 100.048,736.889 Z M 106.922,736.889L 105.422,736.889C 104.87,736.889 104.422,736.441 104.422,735.889L 104.422,727.889C 104.422,727.337 104.87,726.889 105.422,726.889L 106.922,726.889C 107.475,726.889 107.922,727.337 107.922,727.889L 107.922,735.889C 107.922,736.441 107.475,736.889 106.922,736.889 Z", 12)
		}
	},
	pause: function () {
		if (this.mode != "Pause") {
			this.mode = "Pause";
			this.stopPlayTimer();
			this.playButton.setPath("F1 M 101.447,284.834L 101.447,274.714L 106.906,279.774L 101.447,284.834 Z")
		}
	},
	togglePlayMode: function () {
		if (this.mode == "Pause") this.play();
		else this.pause()
	},
	startPlayTimer: function () {
		if (!this.playTimerId) this.playTimerId = window.setTimeout(SlideShow.createDelegate(this, this.showNextSlide), this.options.playTimerInterval)
	},
	stopPlayTimer: function () {
		if (this.playTimerId) {
			window.clearTimeout(this.playTimerId);
			this.playTimerId = null
		}
	},
	onPreviousClick: function (a, e) {
		this.showPreviousSlide();
		this.fireEvent("previousClick")
	},
	onPlayClick: function (a, e) {
		this.togglePlayMode();
		this.fireEvent("playClick")
	},
	onNextClick: function (a, e) {
		this.showNextSlide();
		this.fireEvent("nextClick")
	},
	onControlModulesLoad: function (a, e) {
		SlideShow.SlideShowNavigation.base.onControlModulesLoad.call(this, a, e);
		this.slideViewer.addEventListener("slideLoading", SlideShow.createDelegate(this, this.onSlideLoading));
		this.slideViewer.addEventListener("slideChange", SlideShow.createDelegate(this, this.onSlideChange))
	},
	onControlDataLoad: function (a, e) {
		if (this.options.enablePlayOnLoad) this.play();
		this.slideViewer.loadImageByOffset(0, this.options.enableTransitionOnNext)
	},
	onSlideLoading: function (a, e) {
		if (this.mode == "Play") this.stopPlayTimer();
		if (this.options.enablePreviousSlide) {
			if (this.slideExistsByOffset( - 1)) this.previousButton.enable();
			else this.previousButton.disable()
		}
		if (this.options.enableNextSlide) {
			if (this.slideExistsByOffset(1)) this.nextButton.enable();
			else this.nextButton.disable()
		}
		if (this.slideExistsByOffset(1)) {
			this.playButton.enable()
		} else {
			this.pause();
			this.playButton.disable()
		}
	},
	onSlideChange: function (a, e) {
		if (this.mode == "Play") this.startPlayTimer()
	},
	onControlKeyPressed: function (a, e) {
		switch (e.key) {
		case 9:
			this.togglePlayMode();
			break;
		case 14:
			this.showPreviousSlide();
			break;
		case 16:
			this.showNextSlide();
			break
		}
	}
});﻿SlideShow.SlideTransition = function (a, b) {
	SlideShow.SlideTransition.base.constructor.call(this, a);
	SlideShow.merge(this.options, {
		direction: "Left",
		duration: 0.8
	});
	this.setOptions(b)
};
SlideShow.extend(SlideShow.Transition, SlideShow.SlideTransition, {
	begin: function (a, b) {
		SlideShow.SlideTransition.base.begin.call(this, a, b);
		var c, toImageFromValue, targetProperty;
		switch (this.options.direction.toLowerCase()) {
		case "left":
			c = -this.control.root.width;
			toImageFromValue = this.control.root.width;
			targetProperty = "(Canvas.Left)";
			break;
		case "right":
			c = this.control.root.width;
			toImageFromValue = -this.control.root.width;
			targetProperty = "(Canvas.Left)";
			break;
		case "up":
			c = -this.control.root.height;
			toImageFromValue = this.control.root.height;
			targetProperty = "(Canvas.Top)";
			break;
		case "down":
			c = this.control.root.height;
			toImageFromValue = -this.control.root.height;
			targetProperty = "(Canvas.Top)";
			break;
		default:
			throw new Error("Invalid direction: " + this.options.direction);
		}
		a.root.visibility = "Visible";
		b.root.visibility = "Visible";
		var d = '<DoubleAnimationUsingKeyFrames>' + '	<SplineDoubleKeyFrame KeySpline="0,0 0,1" KeyTime="0:0:0" Value="0" />' + '	<SplineDoubleKeyFrame KeySpline="0,0 0,1" KeyTime="0:0:' + this.options.duration + '" Value="' + c + '" />' + '</DoubleAnimationUsingKeyFrames>';
		var e = this.addStoryboard(a, a.image.name, targetProperty, d);
		e.addEventListener("Completed", SlideShow.createDelegate(this, this.onOutStoryboardComplete));
		e.begin();
		var f = '<DoubleAnimationUsingKeyFrames>' + '	<SplineDoubleKeyFrame KeySpline="0,0 0,1" KeyTime="0:0:0" Value="' + toImageFromValue + '" />' + '	<SplineDoubleKeyFrame KeySpline="0,0 0,1" KeyTime="0:0:' + this.options.duration + '" Value="0" />' + '</DoubleAnimationUsingKeyFrames>';
		var g = this.addStoryboard(b, b.image.name, targetProperty, f);
		g.addEventListener("Completed", SlideShow.createDelegate(this, this.onInStoryboardComplete));
		g.begin()
	}
});﻿SlideShow.SlideViewer = function (a, b, c) {
	if (c.cacheWindowSize < 3) throw new Error("Invalid option: cacheWindowSize");
	var d = '<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="SlideViewer" Visibility="Collapsed"><Canvas.Clip><RectangleGeometry x:Name="TransitionClip" /></Canvas.Clip><Image x:Name="BufferImage" Visibility="Collapsed" /></Canvas>';
	SlideShow.SlideViewer.base.constructor.call(this, a, b, d);
	SlideShow.merge(this.options, {
		top: 0,
		left: 0,
		right: 0,
		bottom: 42,
		cacheWindowSize: 3,
		slideImage: {}
	});
	this.setOptions(c);
	this.cache = [];
	this.currentAlbumIndex = 0;
	this.currentSlideIndex = 0;
	this.allowSlideChange = false;
	this.transitionNextImage = true;
	this.transitionClip = this.root.findName("TransitionClip");
	this.bufferImage = this.root.findName("BufferImage");
	this.control.addEventListener("dataLoad", SlideShow.createDelegate(this, this.onControlDataLoad));
	this.bufferImage.addEventListener("DownloadProgressChanged", SlideShow.createDelegate(this, this.onBufferImageDownloadProgressChanged));
	this.bufferImage.addEventListener("ImageFailed", SlideShow.createDelegate(this, this.onBufferImageDownloadFailed))
};
SlideShow.extend(SlideShow.UserControl, SlideShow.SlideViewer, {
	loadCache: function () {
		for (var i = this.cache.length - 1; i >= 0; i--) this.removeCacheImage(i);
		this.cache = [];
		this.cacheSize = Math.floor(this.options.cacheWindowSize / 2);
		for (var a = -this.cacheSize; a < this.cacheSize; a++) {
			var b = this.getDataIndexByOffset(a);
			if (b != null) this.cache.push(this.addCacheImage(b))
		}
	},
	addCacheImage: function (a) {
		var b;
		if (this.control.isSlideIndexValid(this.currentAlbumIndex, a)) {
			b = this.control.host.content.createFromXaml('<Image Visibility="Collapsed" />');
			var c = this.control.data.album[this.currentAlbumIndex].slide[a].image;
			if (!c) throw new Error("Invalid data: image");
			b.source = c;
			this.root.children.add(b)
		}
		return b
	},
	removeCacheImage: function (a) {
		this.root.children.remove(this.cache[a]);
		this.cache[a] = null;
		this.cache.splice(a, 1)
	},
	getDataIndexByOffset: function (a) {
		var b = 0;
		if (this.control.isSlideIndexValid(this.currentAlbumIndex, 0)) b = this.control.data.album[this.currentAlbumIndex].slide.length;
		if (b > 0) {
			var c = this.currentSlideIndex + a;
			var d = c % b;
			return (d < 0) ? b + d: d
		}
		return null
	},
	loadImageByOffset: function (a, b) {
		this.currentSlideIndex = this.getDataIndexByOffset(a);
		this.loadImage(b)
	},
	loadImage: function (a) {
		this.allowSlideChange = true;
		this.transitionNextImage = a;
		var b = this.getCurrentImageSource();
		if (b) this.bufferImage.source = b;
		else this.changeImage("");
		this.fireEvent("slideLoading", this.getCurrentSlideData())
	},
	getCurrentImageSource: function () {
		this.adjustCacheWindow();
		if (this.cache.length > 0) return this.cache[this.cacheSize].source;
		return ""
	},
	getCurrentSlideData: function () {
		if (this.control.isSlideIndexValid(this.currentAlbumIndex, this.currentSlideIndex)) return this.control.data.album[this.currentAlbumIndex].slide[this.currentSlideIndex];
		return null
	},
	adjustCacheWindow: function () {
		var a = this.getCurrentSlideData();
		if (a) {
			var b;
			for (var i = 0, j = this.cache.length; i < j; i++) {
				if (this.cache[i].source == a.image) {
					b = i;
					break
				}
			}
			if (b == null) {
				this.loadCache()
			} else {
				var c, image;
				var d = b - this.cacheSize;
				var e = Math.abs(d);
				if (d < 0) {
					for (var k = 1; k <= e; k++) {
						c = this.getDataIndexByOffset(0 - k);
						image = this.addCacheImage(c);
						this.cache.unshift(image);
						this.removeCacheImage(this.cache.length - 1)
					}
				} else if (d > 0) {
					for (var l = 1; l <= e; l++) {
						c = this.getDataIndexByOffset(l);
						image = this.addCacheImage(c);
						this.cache.push(image);
						this.removeCacheImage(0)
					}
				}
			}
		} else {
			this.loadCache()
		}
	},
	changeImage: function (a) {
		this.initializeSlideImages();
		if (this.slideImage1.root.visibility == "Visible") {
			this.fromImage = this.slideImage1;
			this.toImage = this.slideImage2
		} else {
			this.fromImage = this.slideImage2;
			this.toImage = this.slideImage1
		}
		this.toImage.setSource(a);
		this.currentTransition = null;
		if (this.transitionNextImage) {
			var b = this.control.getSlideTransitionData(this.currentAlbumIndex, this.currentSlideIndex);
			this.currentTransition = this.control.createObjectInstanceFromConfig(b)
		} else {
			this.currentTransition = this.control.createObjectInstanceFromConfig({
				type: "NoTransition"
			});
			this.transitionNextImage = true
		}
		this.currentTransition.addEventListener("complete", SlideShow.createDelegate(this, this.onSlideChange));
		this.currentTransition.begin(this.fromImage, this.toImage)
	},
	initializeSlideImages: function () {
		if (this.slideImage1 == null || this.slideImage2 == null) {
			this.slideImage1 = new SlideShow.SlideImage(this.control, this, this.options.slideImage);
			this.slideImage2 = new SlideShow.SlideImage(this.control, this, this.options.slideImage);
			this.slideImage1.options.visibility = "Collapsed"
		} else {
			var a = new SlideShow.SlideImage(this.control, this, this.options.slideImage);
			a.options.visibility = this.slideImage1.root.visibility;
			a.setSource(this.slideImage1.image.source);
			var b = new SlideShow.SlideImage(this.control, this, this.options.slideImage);
			b.options.visibility = this.slideImage2.root.visibility;
			b.setSource(this.slideImage2.image.source);
			this.slideImage1.dispose();
			this.slideImage2.dispose();
			this.slideImage1 = a;
			this.slideImage2 = b
		}
		this.slideImage1.render();
		this.slideImage2.render()
	},
	onControlDataLoad: function (a, e) {
		if (this.control.isAlbumIndexValid(0)) {
			if (this.control.data.startalbumindex || this.control.data.startslideindex) {
				this.currentAlbumIndex = this.control.data.startalbumindex || 0;
				this.currentSlideIndex = this.control.data.startslideindex || 0;
				this.loadImage(true)
			} else {
				for (var i = 0, j = this.control.data.album.length; i < j; i++) {
					var b = this.control.data.album[i].slide;
					if (b && b.length > 0) {
						this.currentAlbumIndex = i;
						this.currentSlideIndex = 0;
						this.loadImage(true);
						break
					}
				}
			}
		}
	},
	onBufferImageDownloadProgressChanged: function (a, e) {
		if (a.downloadProgress == 1 && this.allowSlideChange) {
			this.allowSlideChange = false;
			this.changeImage(a.source)
		}
		this.fireEvent("downloadProgressChanged", a.downloadProgress)
	},
	onBufferImageDownloadFailed: function (a, e) {
		throw new Error("Image download failed: " + a.source);
	},
	onSlideChange: function (a, e) {
		this.fireEvent("slideChange", this.getCurrentSlideData())
	},
	onSizeChanged: function () {
		SlideShow.SlideViewer.base.onSizeChanged.call(this);
		this.transitionClip.rect = this.root["Canvas.Left"] + "," + this.root["Canvas.Top"] + "," + this.root.width + "," + this.root.height
	}
});﻿SlideShow.ThumbnailButton = function (a, b, c, d) {
	var e = '<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="ThumbnailButton" Visibility="Collapsed">' + '	<Canvas.Resources>' + '		<Storyboard x:Name="LoadStoryboard" Storyboard.TargetName="Image" Storyboard.TargetProperty="Opacity">' + '			<DoubleAnimation x:Name="LoadAnimation" To="1" />' + '		</Storyboard>' + '	</Canvas.Resources>' + '	<Canvas.Clip>' + '		<RectangleGeometry x:Name="Clip" />' + '	</Canvas.Clip>' + '	<Rectangle x:Name="Background" />' + '	<Rectangle x:Name="Image" Opacity="0">' + '		<Rectangle.Fill>' + '			<ImageBrush x:Name="ImageBrush" />' + '		</Rectangle.Fill>' + '	</Rectangle>' + '</Canvas>';
	SlideShow.ThumbnailButton.base.constructor.call(this, a, b, e);
	SlideShow.merge(this.options, {
		radius: 0,
		stroke: "Black",
		selectedStroke: "White",
		strokeThickness: 1,
		imageStretch: "UniformToFill",
		imageBackground: "#333",
		loadAnimationDuration: 0.5
	});
	this.setOptions(d);
	this.slide = c;
	this.isSelected = false;
	this.loadStoryboard = this.root.findName("LoadStoryboard");
	this.loadAnimation = this.root.findName("LoadAnimation");
	this.clip = this.root.findName("Clip");
	this.background = this.root.findName("Background");
	this.image = this.root.findName("Image");
	this.imageBrush = this.root.findName("ImageBrush")
};
SlideShow.extend(SlideShow.Button, SlideShow.ThumbnailButton, {
	render: function () {
		SlideShow.ThumbnailButton.base.render.call(this);
		this.clip.rect = SlideShow.formatString("0,0,{0},{1}", this.options.width, this.options.height);
		this.clip.radiusX = this.options.radius;
		this.clip.radiusY = this.options.radius;
		this.background.width = this.options.width;
		this.background.height = this.options.height;
		this.background.radiusX = this.options.radius;
		this.background.radiusY = this.options.radius;
		this.background.fill = this.options.imageBackground;
		this.background.stroke = this.isSelected ? this.options.selectedStroke: this.options.stroke;
		this.background.strokeThickness = this.options.strokeThickness;
		this.image.width = this.options.width;
		this.image.height = this.options.height;
		this.image.radiusX = this.options.radius;
		this.image.radiusY = this.options.radius;
		this.image.stroke = this.isSelected ? this.options.selectedStroke: this.options.stroke;
		this.image.strokeThickness = this.options.strokeThickness;
		this.imageBrush.stretch = this.options.imageStretch;
		this.imageBrush.imageSource = this.getThumbnailImageSource();
		if (this.imageBrush.downloadProgress == 1) {
			this.image.opacity = 1
		} else {
			this.loadAnimation.duration = "0:0:" + this.options.loadAnimationDuration;
			this.imageBrush.addEventListener("DownloadProgressChanged", SlideShow.createDelegate(this, this.onImageDownloadProgressChanged));
			this.imageBrush.addEventListener("ImageFailed", SlideShow.createDelegate(this, this.onImageDownloadFailed))
		}
	},
	getThumbnailImageSource: function () {
		return this.slide.thumbnail || this.slide.image || ""
	},
	onSlideLoading: function (a, e) {
		this.isSelected = e == this.slide;
		this.background.stroke = this.isSelected ? this.options.selectedStroke: this.options.stroke;
		this.image.stroke = this.isSelected ? this.options.selectedStroke: this.options.stroke
	},
	onMouseEnter: function (a, e) {
		SlideShow.ThumbnailButton.base.onMouseEnter.call(this, a, e);
		this.fireEvent("mouseEnter", this.isSelected)
	},
	onMouseLeave: function (a, e) {
		SlideShow.ThumbnailButton.base.onMouseLeave.call(this, a, e);
		this.fireEvent("mouseLeave", this.isSelected)
	},
	onImageDownloadProgressChanged: function (a, e) {
		if (a.downloadProgress == 1) this.loadStoryboard.begin()
	},
	onImageDownloadFailed: function (a, e) {
		throw new Error("Image download failed: " + this.imageBrush.imageSource);
	},
	onClick: function (e) {
		SlideShow.ThumbnailButton.base.onClick.call(this, this.slide)
	}
});﻿SlideShow.ThumbnailNavigation = function (a, b, c) {
	var d = '<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="ThumbnailNavigation" Visibility="Collapsed" />';
	SlideShow.ThumbnailNavigation.base.constructor.call(this, a, b, d);
	SlideShow.merge(this.options, {
		left: 0,
		right: 0,
		height: 20,
		foreground: "#777",
		enablePreviousSlide: false,
		enableNextSlide: false,
		previousPageButton: {
			left: 0,
			height: 36,
			radius: 0,
			strokeThickness: 0,
			backgroundColor1: "Transparent",
			backgroundColor2: "Transparent",
			pathData: "M0.049999999,0.81200001 C0.049999999,0.39115903 0.39115902,0.049999999 0.81199999,0.049999999 L2.711,0.049999999 C3.1318409,0.049999999 3.473,0.39115903 3.473,0.81200001 L3.473,9.1880002 C3.473,9.6088412 3.1318409,9.9500002 2.711,9.9500002 L0.81199999,9.9500002 C0.39115902,9.9500002 0.049999999,9.6088412 0.049999999,9.1880002 z M-3.3603748,0.016 L-9.344,4.9998124 -3.3599998,9.9840002 Z",
			pathWidth: 10,
			pathHeight: 8,
			pathFill: "#777",
			pathFillDisabled: "#333"
		},
		nextPageButton: {
			right: 0,
			height: 36,
			radius: 0,
			strokeThickness: 0,
			backgroundColor1: "Transparent",
			backgroundColor2: "Transparent",
			pathData: "M0.049999999,0.81200001 C0.049999999,0.39115903 0.39115902,0.049999999 0.81199999,0.049999999 L2.711,0.049999999 C3.1318409,0.049999999 3.473,0.39115903 3.473,0.81200001 L3.473,9.1880002 C3.473,9.6088412 3.1318409,9.9500002 2.711,9.9500002 L0.81199999,9.9500002 C0.39115902,9.9500002 0.049999999,9.6088412 0.049999999,9.1880002 z M6.9063742,0.016 L12.875,4.9998124 6.8910001,9.9840002 Z",
			pathWidth: 10,
			pathHeight: 8,
			pathFill: "#777",
			pathFillDisabled: "#333"
		},
		previousButton: {
			top: "50%",
			left: 22,
			radius: 0,
			strokeThickness: 0,
			backgroundColor1: "Transparent",
			backgroundColor2: "Transparent",
			pathData: "M256.9375,633.46875L256.9375,636.43725 267.2495,636.43725 267.2495,633.437255242651 Z",
			pathWidth: 8,
			pathHeight: 8,
			pathFill: "#777",
			pathFillDisabled: "#333"
		},
		nextButton: {
			top: "50%",
			right: 22,
			radius: 0,
			strokeThickness: 0,
			backgroundColor1: "Transparent",
			backgroundColor2: "Transparent",
			pathData: "M612.21875,632.78125L612.21875,636.37525 608.56225,636.37525 608.56225,639.281489402504 612.21849996621,639.281489402504 612.21849996621,642.938131479117 615.093888547801,642.938131479117 615.093888547801,639.344555954334 618.8127229171,639.344555954334 618.8127229171,636.375554460764 615.093316965987,636.375554460764 615.12456845465,632.781500021178 Z",
			pathWidth: 8,
			pathHeight: 8,
			pathFill: "#777",
			pathFillDisabled: "#333"
		}
	});
	this.setOptions(c);
	this.previousPageButton = new SlideShow.PathButton(this.control, this, this.options.previousPageButton);
	this.nextPageButton = new SlideShow.PathButton(this.control, this, this.options.nextPageButton);
	if (this.options.enablePreviousSlide) {
		this.previousButton = new SlideShow.PathButton(this.control, this, this.options.previousButton);
		this.previousButton.addEventListener("click", SlideShow.createDelegate(this, this.onPreviousClick))
	}
	if (this.options.enableNextSlide) {
		this.nextButton = new SlideShow.PathButton(this.control, this, this.options.nextButton);
		this.nextButton.addEventListener("click", SlideShow.createDelegate(this, this.onNextClick))
	}
	this.previousPageButton.addEventListener("click", SlideShow.createDelegate(this, this.onPreviousPageClick));
	this.nextPageButton.addEventListener("click", SlideShow.createDelegate(this, this.onNextPageClick))
};
SlideShow.extend(SlideShow.PageNavigation, SlideShow.ThumbnailNavigation, {
	onControlModulesLoad: function (a, e) {
		SlideShow.ThumbnailNavigation.base.onControlModulesLoad.call(this, a, e);
		if (this.options.enablePreviousSlide || this.options.enableNextSlide) this.slideViewer.addEventListener("slideLoading", SlideShow.createDelegate(this, this.onSlideLoading))
	},
	onPreviousPageClick: function (a, e) {
		this.showPreviousPage()
	},
	onNextPageClick: function (a, e) {
		this.showNextPage()
	},
	onPreviousClick: function (a, e) {
		this.showPreviousSlide();
		this.fireEvent("previousClick")
	},
	onNextClick: function (a, e) {
		this.showNextSlide();
		this.fireEvent("nextClick")
	},
	onPageLoad: function (a, e) {
		var b = this.parent.pageContainer.pageIndex;
		var c = this.parent.pageContainer.pageCount;
		if (b > 0) this.previousPageButton.enable();
		else this.previousPageButton.disable();
		if (b < c - 1) this.nextPageButton.enable();
		else this.nextPageButton.disable()
	},
	onSlideLoading: function (a, e) {
		if (this.options.enablePreviousSlide) {
			if (this.slideExistsByOffset( - 1)) this.previousButton.enable();
			else this.previousButton.disable()
		}
		if (this.options.enableNextSlide) {
			if (this.slideExistsByOffset(1)) this.nextButton.enable();
			else this.nextButton.disable()
		}
	}
});﻿SlideShow.ThumbnailPreview = function (a, b, c) {
	var d = '<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="ThumbnailPreview" Visibility="Collapsed">' + '	<Canvas.Resources>' + '		<Storyboard x:Name="HoverStoryboard">' + '			<DoubleAnimation Storyboard.TargetName="ScaleTransform" Storyboard.TargetProperty="ScaleX" To="1" />' + '			<DoubleAnimation Storyboard.TargetName="ScaleTransform" Storyboard.TargetProperty="ScaleY" To="1" />' + '			<DoubleAnimation Storyboard.TargetName="TranslateTransform" Storyboard.TargetProperty="X" To="0" />' + '			<DoubleAnimation Storyboard.TargetName="TranslateTransform" Storyboard.TargetProperty="Y" To="0" />' + '		</Storyboard>' + '		<Storyboard x:Name="LoadStoryboard" Storyboard.TargetName="Image" Storyboard.TargetProperty="Opacity">' + '			<DoubleAnimation x:Name="LoadAnimation" To="1" />' + '		</Storyboard>' + '	</Canvas.Resources>' + '	<Canvas.RenderTransform>' + '		<TransformGroup>' + '			<ScaleTransform x:Name="ScaleTransform" />' + '			<TranslateTransform x:Name="TranslateTransform" />' + '		</TransformGroup>' + '	</Canvas.RenderTransform>' + '	<Rectangle x:Name="Background" />' + '	<Rectangle x:Name="Image" Opacity="0">' + '		<Rectangle.Fill>' + '			<ImageBrush x:Name="ImageBrush" />' + '		</Rectangle.Fill>' + '	</Rectangle>' + '	<Path x:Name="Arrow" Stretch="Fill" Data="M257.90625,640.65625 L264.31275,640.65625 261.10987,643.87525Z" />' + '</Canvas>';
	SlideShow.ThumbnailPreview.base.constructor.call(this, a, b, d);
	SlideShow.merge(this.options, {
		width: 150,
		height: 120,
		radius: 4,
		stroke: "White",
		strokeThickness: 2,
		arrowWidth: 10,
		arrowHeight: 6,
		arrowFill: "White",
		imageStretch: "UniformToFill",
		imageBackground: "#333",
		hoverAnimationDuration: 0.1,
		loadAnimationDuration: 0.5,
		visibility: "Collapsed"
	});
	this.setOptions(c);
	this.hoverStoryboard = this.root.findName("HoverStoryboard");
	this.loadStoryboard = this.root.findName("LoadStoryboard");
	this.loadAnimation = this.root.findName("LoadAnimation");
	this.scaleTransform = this.root.findName("ScaleTransform");
	this.translateTransform = this.root.findName("TranslateTransform");
	this.background = this.root.findName("Background");
	this.image = this.root.findName("Image");
	this.imageBrush = this.root.findName("ImageBrush");
	this.arrow = this.root.findName("Arrow")
};
SlideShow.extend(SlideShow.UserControl, SlideShow.ThumbnailPreview, {
	render: function () {
		SlideShow.ThumbnailPreview.base.render.call(this);
		this.arrow.width = this.options.arrowWidth;
		this.arrow.height = this.options.arrowHeight;
		this.arrow.fill = this.options.arrowFill;
		this.arrow["Canvas.Top"] = this.root.height;
		this.arrow["Canvas.Left"] = this.root.width / 2 - this.arrow.width / 2;
		this.background.width = this.options.width;
		this.background.height = this.options.height;
		this.background.radiusX = this.options.radius;
		this.background.radiusY = this.options.radius;
		this.background.fill = this.options.imageBackground;
		this.background.stroke = this.options.stroke;
		this.background.strokeThickness = this.options.strokeThickness;
		this.image.width = this.options.width;
		this.image.height = this.options.height;
		this.image.radiusX = this.options.radius;
		this.image.radiusY = this.options.radius;
		this.image.stroke = this.options.stroke;
		this.image.strokeThickness = this.options.strokeThickness;
		this.imageBrush.stretch = this.options.imageStretch;
		if (this.imageBrush.downloadProgress == 1) {
			this.image.opacity = 1
		} else {
			this.loadAnimation.duration = "0:0:" + this.options.loadAnimationDuration;
			this.imageBrush.addEventListener("DownloadProgressChanged", SlideShow.createDelegate(this, this.onImageDownloadProgressChanged));
			this.imageBrush.addEventListener("ImageFailed", SlideShow.createDelegate(this, this.onImageDownloadFailed))
		}
		for (var i = 0, j = this.hoverStoryboard.children.count; i < j; i++) this.hoverStoryboard.children.getItem(i).duration = "0:0:" + this.options.hoverAnimationDuration
	},
	show: function (a) {
		this.scaleTransform.scaleX = 0;
		this.scaleTransform.scaleY = 0;
		this.translateTransform.x = this.root.width / 2;
		this.translateTransform.y = this.root.height;
		this.root.visibility = "Visible";
		this.imageBrush.imageSource = a;
		this.hoverStoryboard.begin()
	},
	hide: function () {
		this.root.visibility = "Collapsed";
		this.imageBrush.imageSource = ""
	},
	onImageDownloadProgressChanged: function (a, e) {
		if (a.downloadProgress == 1) this.loadStoryboard.begin()
	},
	onImageDownloadFailed: function (a, e) {
		throw new Error("Image download failed: " + this.imageBrush.imageSource);
	}
});﻿SlideShow.ThumbnailViewer = function (a, b, c) {
	var d = '<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="ThumbnailViewer" Visibility="Collapsed" />';
	SlideShow.ThumbnailViewer.base.constructor.call(this, a, b, d);
	SlideShow.merge(this.options, {
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		enablePreview: true,
		thumbnailViewerBackground: {},
		thumbnailNavigation: {
			height: 30
		},
		thumbnailPreview: {},
		thumbnailButton: {},
		pageContainer: {
			top: 3,
			left: 19,
			right: 19,
			bottom: -5,
			padding: 0,
			spacing: 3,
			itemWidth: 30,
			itemHeight: 30
		}
	});
	this.setOptions(c);
	this.previewEnabled = this.options.enablePreview;
	this.thumbnailViewerBackground = new SlideShow.ThumbnailViewerBackground(this.control, this, this.options.thumbnailViewerBackground);
	this.thumbnailNavigation = new SlideShow.ThumbnailNavigation(this.control, this, this.options.thumbnailNavigation);
	this.thumbnailPreview = new SlideShow.ThumbnailPreview(this.control, this, this.options.thumbnailPreview);
	this.pageContainer = new SlideShow.PageContainer(this.control, this, this.options.pageContainer);
	this.pageContainer.addEventListener("pageLoad", SlideShow.createDelegate(this.thumbnailNavigation, this.thumbnailNavigation.onPageLoad));
	this.control.addEventListener("modulesLoad", SlideShow.createDelegate(this, this.onControlModulesLoad));
	this.control.addEventListener("dataLoad", SlideShow.createDelegate(this, this.onControlDataLoad))
};
SlideShow.extend(SlideShow.UserControl, SlideShow.ThumbnailViewer, {
	getItems: function (a, b) {
		var c = [];
		this.currentItemListenerTokens = [];
		for (k = 0, l = this.currentItemListenerTokens.length; k < l; k++) this.slideViewer.removeEventListener(this.currentItemListenerTokens[k]);
		for (var i = a, j = a + b; i < j; i++) {
			if (this.control.data.album[this.slideViewer.currentAlbumIndex].slide[i]) {
				var d = new SlideShow.ThumbnailButton(this.control, null, this.control.data.album[this.slideViewer.currentAlbumIndex].slide[i], this.options.thumbnailButton);
				d.addEventListener("click", SlideShow.createDelegate(this, this.onThumbnailClick));
				this.currentItemListenerTokens.push(this.slideViewer.addEventListener("slideLoading", SlideShow.createDelegate(d, d.onSlideLoading)));
				d.onSlideLoading(null, this.control.data.album[this.slideViewer.currentAlbumIndex].slide[this.slideViewer.currentSlideIndex]);
				if (this.options.enablePreview) {
					d.addEventListener("mouseEnter", SlideShow.createDelegate(this, this.onThumbnailEnter));
					d.addEventListener("mouseLeave", SlideShow.createDelegate(this, this.onThumbnailLeave))
				}
				c.push(d)
			}
		}
		return c
	},
	getItemCount: function () {
		if (this.control.data && this.control.data.album && this.control.data.album[this.slideViewer.currentAlbumIndex].slide) return this.control.data.album[this.slideViewer.currentAlbumIndex].slide.length;
		return 0
	},
	disablePreview: function () {
		this.previewEnabled = false
	},
	resetPreview: function () {
		this.previewEnabled = this.options.enablePreview
	},
	onControlDataLoad: function (a, e) {
		if (this.control.data) this.pageContainer.loadPageByOffset(0)
	},
	onControlModulesLoad: function (a, e) {
		this.slideViewer = this.control.modules["SlideViewer"];
		if (!this.slideViewer) throw new Error("Expected module missing: SlideViewer");
	},
	onThumbnailEnter: function (a, b) {
		if (!b && this.previewEnabled) {
			var c = a.root["Canvas.Top"] - this.thumbnailPreview.root.height - this.thumbnailPreview.arrow.height + 3;
			var d = this.pageContainer.root["Canvas.Left"] + this.pageContainer.currentPage["Canvas.Left"] + a.root["Canvas.Left"] + a.root.width / 2 - this.thumbnailPreview.root.width / 2;
			this.thumbnailPreview.setOptions({
				top: c,
				left: d
			});
			this.thumbnailPreview.reposition();
			this.thumbnailPreview.show(a.getThumbnailImageSource())
		}
	},
	onThumbnailLeave: function (a, b) {
		this.thumbnailPreview.hide()
	},
	onThumbnailClick: function (a, e) {
		for (var i = 0, j = this.control.data.album[this.slideViewer.currentAlbumIndex].slide.length; i < j; i++) {
			if (this.control.data.album[this.slideViewer.currentAlbumIndex].slide[i] == e && this.slideViewer.currentSlideIndex != i) {
				this.slideViewer.currentSlideIndex = i;
				this.slideViewer.loadImageByOffset(0, true)
			}
		}
		if (this.previewEnabled) this.thumbnailPreview.hide();
		this.fireEvent("thumbnailClick", e)
	}
});﻿SlideShow.ThumbnailViewerBackground = function (a, b, c) {
	var d = '<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="ThumbnailViewerBackground" Visibility="Collapsed">' + '	<Rectangle x:Name="Background" />' + '</Canvas>';
	SlideShow.ThumbnailViewerBackground.base.constructor.call(this, a, b, d);
	SlideShow.merge(this.options, {
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		radius: 4,
		fill: "Black",
		stroke: "Black",
		strokeThickness: 0
	});
	this.setOptions(c);
	this.background = this.root.findName("Background")
};
SlideShow.extend(SlideShow.UserControl, SlideShow.ThumbnailViewerBackground, {
	render: function () {
		SlideShow.ThumbnailViewerBackground.base.render.call(this);
		this.background.radiusX = this.options.radius;
		this.background.radiusY = this.options.radius;
		this.background.fill = this.options.fill;
		this.background.stroke = this.options.stroke;
		this.background.strokeThickness = this.options.strokeThickness
	},
	onSizeChanged: function () {
		SlideShow.ThumbnailViewerBackground.base.onSizeChanged.call(this);
		this.background.width = this.root.width;
		this.background.height = this.root.height
	}
});﻿SlideShow.WipeTransition = function (a, b) {
	SlideShow.WipeTransition.base.constructor.call(this, a);
	SlideShow.merge(this.options, {
		direction: "Left",
		duration: 0.8
	});
	this.setOptions(b)
};
SlideShow.extend(SlideShow.Transition, SlideShow.WipeTransition, {
	begin: function (a, b) {
		SlideShow.WipeTransition.base.begin.call(this, a, b);
		var c, toClippingPathTop, toClippingPathLeft, toClippingPathFrom, targetProperty;
		switch (this.options.direction.toLowerCase()) {
		case "left":
			c = -a.parent.root.width;
			toClippingPathTop = 0;
			toClippingPathLeft = b.parent.root.width;
			toClippingPathFrom = b.parent.root.width;
			targetProperty = "X";
			break;
		case "right":
			c = a.parent.root.width;
			toClippingPathTop = 0;
			toClippingPathLeft = -b.parent.root.width;
			toClippingPathFrom = -b.parent.root.width;
			targetProperty = "X";
			break;
		case "up":
			c = -a.parent.root.height;
			toClippingPathTop = b.parent.root.height;
			toClippingPathLeft = 0;
			toClippingPathFrom = b.parent.root.height;
			targetProperty = "Y";
			break;
		case "down":
			c = a.parent.root.height;
			toClippingPathTop = -b.parent.root.height;
			toClippingPathLeft = 0;
			toClippingPathFrom = -b.parent.root.height;
			targetProperty = "Y";
			break;
		default:
			throw new Error("Invalid direction: " + this.options.direction);
		}
		var d = '<RectangleGeometry xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" Rect="0,0,' + a.parent.root.width + "," + a.parent.root.height + '">' + '	<RectangleGeometry.Transform>' + '		<TranslateTransform x:Name="VisibleTransform" X="0" Y="0" />' + '	</RectangleGeometry.Transform>' + '</RectangleGeometry>';
		a.root.clip = this.createClippingPath(d);
		a.root.visibility = "Visible";
		var e = '<RectangleGeometry xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" Rect="0,0,' + b.parent.root.width + "," + b.parent.root.height + '">' + '	<RectangleGeometry.Transform>' + '		<TranslateTransform x:Name="VisibleTransform" X="' + toClippingPathLeft + '" Y="' + toClippingPathTop + '" />' + '	</RectangleGeometry.Transform>' + '</RectangleGeometry>';
		b.root.clip = this.createClippingPath(e);
		b.root.visibility = "Visible";
		a.addEventListener("sizeChange", SlideShow.createDelegate(this, this.onSlideImageSizeChanged));
		b.addEventListener("sizeChange", SlideShow.createDelegate(this, this.onSlideImageSizeChanged));
		var f = '<DoubleAnimationUsingKeyFrames>' + '	<SplineDoubleKeyFrame KeySpline="0,0 0,0" KeyTime="0:0:0" Value="0" />' + '	<SplineDoubleKeyFrame KeySpline="0,0 0,1" KeyTime="0:0:' + this.options.duration + '" Value="' + c + '" />' + '</DoubleAnimationUsingKeyFrames> ';
		this.outStoryboard = this.addStoryboard(a, "VisibleTransform", targetProperty, f);
		this.outStoryboard.addEventListener("Completed", SlideShow.createDelegate(this, this.onOutStoryboardComplete));
		this.outStoryboard.begin();
		var g = '<DoubleAnimationUsingKeyFrames>' + '	<SplineDoubleKeyFrame KeySpline="0,0 0,0" KeyTime="0:0:0" Value="' + toClippingPathFrom + '" />' + '	<SplineDoubleKeyFrame KeySpline="0,0 0,1" KeyTime="0:0:' + this.options.duration + '" Value="0" />' + '</DoubleAnimationUsingKeyFrames> ';
		this.inStoryboard = this.addStoryboard(b, "VisibleTransform", targetProperty, g);
		this.inStoryboard.addEventListener("Completed", SlideShow.createDelegate(this, this.onInStoryboardComplete));
		this.inStoryboard.begin()
	},
	onSlideImageSizeChanged: function (a) {
		if (this.state = "Started") {
			this.outStoryboard.seek('0:0:' + this.options.duration);
			this.inStoryboard.seek('0:0:' + this.options.duration);
			SlideShow.WipeTransition.base.complete.call(this)
		}
		var b = a.root.clip.children.getItem(0);
		b.rect = '0,0,' + a.parent.root.width + ',' + a.parent.root.height
	}
});﻿SlideShow.XmlDataProvider = function (a, b) {
	SlideShow.XmlDataProvider.base.constructor.call(this, a);
	SlideShow.merge(this.options, {
		url: "./XML/Data.xml"
	});
	this.setOptions(b)
};
SlideShow.extend(SlideShow.DataProvider, SlideShow.XmlDataProvider, {
	getData: function (a) {
		var b = new SlideShow.JsonParser({
			arrays: "album,slide"
		});
		b.addEventListener("parseComplete", a);
		b.fromXml(this.options.url, true)
	}
});