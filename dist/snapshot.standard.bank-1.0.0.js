/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
	"use strict";

	//core
	__webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(4);
	__webpack_require__(6);
	__webpack_require__(7);
	__webpack_require__(9);

	__webpack_require__(11);
	__webpack_require__(13);

	//filter Configurable
	__webpack_require__(14);//星号过滤
	__webpack_require__(15);//s-属性
	__webpack_require__(16);//不可见元素

	__webpack_require__(17);//清理已不需要的信息
	__webpack_require__(18);//宽度
	__webpack_require__(19);//空壳note升级

	//processor
	__webpack_require__(20);
	__webpack_require__(21);
	__webpack_require__(22);

	//extend
	__webpack_require__(23);
	__webpack_require__(24);


	//standard version
	__webpack_require__(25);
	__webpack_require__(26);

	__webpack_require__(27);

	//bank
	__webpack_require__(28);


/***/ },
/* 1 */
/***/ function(module, exports) {

	

	"use strict";

	var FilterChain = function(){
	    var filters = [],
	    	curIdx = -1,
	        weaved = {};
	    this.push = function(filter){
	        filters.push(filter);
	    },
	    this.resetIdx = function(){
	        curIdx = -1;
	    },
	    this.filter = function(){
	        curIdx++;
	        if(curIdx < filters.length){                
	            var result = filters[curIdx].filter(arguments, this);
	            return result;
	        }else{
	            return this.invoke.apply(this, arguments);
	        }            
	    },
	    this.invoke = function(){
	        return weaved.method.apply(weaved.target, arguments);
	    },
	    this.weave = function(target, method){
	        weaved.target = target;
	        weaved.method = method;
	        return (function(chain){
	            return function(){
	            	chain.resetIdx();
	            	return chain.filter.apply(chain, arguments);
	            }            
	        })(this);
	    }
	};

	module.exports = FilterChain;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	

	"use strict";

	const Util = __webpack_require__(3);

	/*
	FACTOR = TEXT|INPUTS //TEXT可升级为LABEL
	ITEM = (LABEL|TEXT)(~INPUTS)+
	GROUP = ((LABEL|TEXT)?~)?ITEM+(~ITEM)*
	GROUP = (LABEL|TEXT)~GROUP
	PANEL = GROUP(~GROUP)*
	PANEL = (LABEL|TEXT)~PANEL
	*/
	const ManifestFactors = ["TEXT", "INPUTS", "LABEL"];
	const NodeNameFacotrs = ["#text","SELECT","INPUT", "TEXTAREA"];
	const ManifestMapping = {"#text":"TEXT","SELECT":"INPUTS","INPUT":"INPUTS", "TEXTAREA":"INPUTS"};

	var NoteRule = new function(){

		this.TEXT="TEXT";
		this.LABEL="LABEL";
		this.INPUTS="INPUTS";
		this.ITEM="ITEM";
		this.GROUP="GROUP";
		this.PANEL="PANEL";

	    const GRADE = {
	        "TEXT":"0",
	        "LABEL":"0",
	        "INPUTS":"0",
	        "ITEM":"1",
	        "GROUP":"2",
	        "PANEL":"3"
	    }

	    this.isNodeNameFactor = function(nodeName){
	        return NodeNameFacotrs.indexOf(nodeName)!=-1;
	    };
	    this.isFactor = function(manifest){
	    	return ManifestFactors.indexOf(manifest)!=-1;
	    };
	    this.isItem = function(manifest){
	    	return /^(LABEL|TEXT)(~INPUTS)+$/g.test(manifest) || /^INPUTS~TEXT$/g.test(manifest);
	    };
	    this.isGroup = function(manifest){
	    	return /^((LABEL|TEXT)?~)?ITEM+(~ITEM)+$/g.test(manifest) || /^(LABEL|TEXT)~GROUP$/g.test(manifest);
	    };
	    this.isPanel = function(manifest){
	    	return /^GROUP(~GROUP)+$/g.test(manifest) || /^(LABEL|TEXT)~PANEL$/g.test(manifest);
	    };
	    this.getManifest = function(factor){
	    	return ManifestMapping[factor];
	    };
	    this.getGrade = function(manifest){
	        return GRADE[manifest]||-1;
	    };
	    this.upgradeManifest = function(manifest){
	        switch(manifest){
	            case this.ITEM:
	                return this.GROUP;
	            case this.GROUP:
	                return this.PANEL;
	            default:
	                return manifest;
	        }
	    };


	}

	module.exports = NoteRule;



/***/ },
/* 3 */
/***/ function(module, exports) {

	
	"use strict";

	var Util = {
	    trim:function(x) {
	        if(typeof x !== "string"){
	            throw x+"is not string";
	        }
	        return x.replace(/^\s+|\s+$/gm,'');
	    },
	    /*
			http://www.w3school.com.cn/jsref/prop_node_nodetype.asp
			nodeType 属性返回以数字值返回指定节点的节点类型。
			如果节点是元素节点，则 nodeType 属性将返回 1。
			如果节点是Text节点，则 nodeType 属性将返回 3。
		*/
	    isElement:function(node){
	    	return node.nodeType==1;
	    }
	}


	module.exports = Util;



/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	
	"use strict";

	const Cache = __webpack_require__(5);
	var NoteContext = function(parent){
	    
	    this.parent = parent || null;

	    var aCache = new Cache();
	    this.data = function(){
	        return aCache.cache.apply(aCache, arguments);
	    };
	    this.closesd = function(key){
	    	if(typeof aCache.cache(key) === "undefined"){
	    		if(this.parent){
	    			return this.parent.closesd(key);
	    		}else{
	    			return undefined;
	    		}
	    	}
	    	return aCache.cache(key);
	    };
	    
	}

	module.exports = NoteContext;



/***/ },
/* 5 */
/***/ function(module, exports) {

	
	"use strict";

	var Cache = function(){
		var caches = {};
	    this.cache = function(){
	        if(arguments.length==0){
	            throw "arguments length must be greater then 0.";
	        }
	        if(arguments.length==1){
	            if(typeof arguments[0] == "string"){
	                return caches[arguments[0]];
	            }else if(arguments[0] && arguments[0].name){
	                caches[arguments[0].name] = arguments[0];
	            }
	        }else if(arguments.length==2){
	            caches[arguments[0]] = arguments[1];
	        }
	        return this;
	    }

	    this.get = function(name){
	        return caches[name];
	    }

	    this.set = function(name, value){
	        caches[name] = value;
	        return this;
	    }

	};

	module.exports = Cache;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	
	"use strict";

	const Util = __webpack_require__(3);
	const NoteContext = __webpack_require__(4);
	const nodeRule = __webpack_require__(2);

	var Note = function(node){

	    this.parent = null;
	    this.subNotes = [],
	    this.depth = 0;
	    this.ctx = new NoteContext();

	    /*Object.defineProperty(this, "assign", {
	            value:undefined,
	            get : function(){
	                return value;
	            },
	            set : function(newValue){
	                value = newValue;
	                console.log("assign:"+assign);
	            }
	        }
	    );*/

	}

	Note.prototype = {
	    constructor:Note,
	    hierarchy:0,
	    scan:function(node, noter){
	        if(nodeRule.isNodeNameFactor(node.nodeName)){
	            this.recordFactor(node);
	        }else if(node.childNodes){
	            for (var i = 0; i < node.childNodes.length; i++) {
	                var subNote = noter.createNote(node.childNodes[i]);
	                this.appendChild(subNote);
	                var result = noter.work( node.childNodes[i], subNote );
	                if(!result){
	                    this.removeChild(subNote);
	                }
	            }        
	        }
	        this.makeManifest();
	        return this;
	    },
	    recordFactor:function(node){
	        //open to external
	        this.isFactor = true;
	        this.nodeName = node.nodeName;
	        switch(node.nodeName){
	            case "INPUT"://text,hidden,radio,checkbox,password
	                var type = node.getAttribute("type");
	                switch(type){
	                    case "radio":
	                    case "checkbox":
	                        this.checked = node.checked;
	                        break;
	                    case "button":
	                    case "submit":
	                    case "reset":
	                    case "file":
	                        this.isFactor = false;
	                        this.isInvalid = true;
	                        break;
	                    default:
	                        this.value = node.value||"";
	                        break;
	                }
	                this.type = type || "text";
	                break;
	            case "SELECT"://multiple
	                this.type = "select";
	                this.value = $(node).val();
	                this.textValue = $(node).find("option:selected").text();
	                //options
	                break;
	            case "TEXTAREA":
	                this.type = "textarea";
	                this.textValue = $(node).val();
	                this.rows = $(node).attr("rows");
	                this.cols = $(node).attr("cols");                
	                break;
	            case "#text"://button
	                this.type="text";
	                this.value=Util.trim(node.nodeValue);
	                break;
	            default:;
	        }
	        return this;
	    },
	    makeManifest:function(){
	        if(this.isFactor){
	            this.manifest = nodeRule.getManifest(this.nodeName);
	            this.high = 1;
	        }else if(!this.isInvalid){
	            for(var i=0;i<this.subNotes.length;i++){
	                var subNote = this.subNotes[i];
	                this.manifest = (this.manifest?this.manifest+"~":"")+subNote.manifest;                                   
	            }
	            if(nodeRule.isItem(this.manifest)){
	                this.originalManifest = this.manifest;
	                this.manifest = nodeRule.ITEM;
	            }else if(nodeRule.isGroup(this.manifest)){
	                this.manifest = nodeRule.GROUP;
	            }else if(nodeRule.isPanel(this.manifest)){
	                this.manifest = nodeRule.PANEL;
	            }
	        }

	        return this;
	    },
	    appendChild:function(note){
	        note.depth = this.depth++;
	        note.ctx.parent = this.ctx;
	        this.subNotes.push(note);
	    },
	    appendChilds:function(notes){
	        for (var i = 0; i < notes.length; i++) {
	            this.appendChild(notes[i]);
	        }
	    },
	    removeChild:function(note){
	        for (var i = 0; i < this.subNotes.length; i++) {
	            var subNote = this.subNotes[i];
	            if(subNote == note){
	                this.subNotes.splice(i, 1);
	            }
	        }
	    }
	};

	module.exports = Note;



/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	

	"use strict";

	const Group = __webpack_require__(8);
	const context = __webpack_require__(9);
	const Note = __webpack_require__(6);
	const NoteContext = __webpack_require__(4);
	const FilterChain = __webpack_require__(1);
	const NoteWasher = __webpack_require__(10);
	const noteRule = __webpack_require__(2);

	var Noter = function(){

	    var prGroup = new Group();
	    var filters = new FilterChain();
	    var noteWasher = new NoteWasher();

	    this.registerProcessor=function(pr){
	        prGroup.pushWithName(pr);
	    }
	    this.registerFilter=function(filter){
	        filters.push(filter);
	    }
	    this.createNote = function(node){
	        var note = new Note(node);
	        note.ctx = new NoteContext();
	        note.noter = this;
	        return note;
	    }

	    var work = function(node, note ) {

	    	//notify before
	        if(!noteRule.isFactor(node.nodeName)){
	            for( var i=0; i < prGroup.length; i++ ){
	                var pr = prGroup.get(i);
	                if(pr.beforeScan){              
	                    pr.beforeScan(note, node, context);
	                    if(note.manifest){
	                        return note;
	                    }else if(note.assign){
	                        break;
	                    }
	                }
	            }
	        }

	        //scan
	        note.scan( node, this );

	        //notify after
	        if(!noteRule.isFactor(note.manifest)){
	            if(note.assign){
	                var pr = prGroup.getByName(note.assign);
	                return pr.process(note, node, context);
	            }else{
	                for( var i=0; i < prGroup.length; i++ ){
	                    var pr = prGroup.get(i);
	                    if(pr.afterScan && pr.afterScan(note, node, context)){
	                        return pr.process(note, node, context);
	                    }
	                }

	                note.subNotes = noteWasher.wash(note.subNotes);
	                note.manifest = "";
	                note.makeManifest();
	                

	                for( var i=0; i < prGroup.length; i++ ){
	                    var pr = prGroup.get(i);
	                    if(pr.afterScan && pr.afterScan(note, node, context)){
	                        return pr.process(note, node, context);
	                    }
	                }
	            }
	        }
	       
	        return note; 
	    };

	    this.work = filters.weave(this, work);

	    this.takeNote = function(node){
	        var note = this.createNote(node);
	        return this.work( node, note );
	    };
	};

	module.exports = Noter;



/***/ },
/* 8 */
/***/ function(module, exports) {

	
	"use strict";

	var Group = function(){
		var group = [];
	    var groupMap = {};
	    this.length = 0;

	    this.get = function(idx){
	        return group[idx];
	    }
	    this.push = function(object){
	        group.push(object);
	        this.length++;
	    }
	    this.pushWithName = function(){
	        if(arguments.length==2){
	            this.push(arguments[1]);
	            groupMap[arguments[0]] = arguments[1];
	        }else if(arguments.length==1 && arguments[0].name){
	            this.push(arguments[0]);
	            groupMap[arguments[0].name] = arguments[0];
	        }else{
	            throw "pleace check your arguments.";
	        }
	        return this;
	    }
	    this.getByName = function(name){
	        return groupMap[name];
	    }

	};

	module.exports = Group;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	
	"use strict";

	const Cache = __webpack_require__(5);
	var ssContext = new function(){

	    this.cfg = {};

	    var aCache = new Cache();
	    this.data = function(){
	        return aCache.cache.apply(aCache, arguments);
	    };
	    
	    this.closesd = function(key){
	        if(typeof aCache.cache(key) === "undefined"){
	            if(this.parent){
	                return this.parent.closesd(key);
	            }else{
	                return undefined;
	            }
	        }
	        return aCache.cache(key);
	    };




	};

	module.exports = ssContext;



/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	
	"use strict";

	const noteRule = __webpack_require__(2);

	var NoteWasher = function(parent){
	    
	    this.wash = function(notes){
	        var highestGrade = -1;
	        for (var i = 0; i < notes.length; i++) {
	            var note = notes[i];
	            var grade = noteRule.getGrade(note.manifest);
	            highestGrade = Math.max(highestGrade, grade);
	        }

	        for (var i = 0; i < notes.length; i++) {
	            var note = notes[i];
	            var upgradedManifest = noteRule.upgradeManifest(note.manifest);
	            var newGrade = noteRule.getGrade(upgradedManifest);
	            if(newGrade < highestGrade){
	                notes.splice(i, 1);
	                i--;
	            }else if(newGrade == highestGrade){
	                note.manifest = upgradedManifest;
	            }
	        }

	        return notes;
	    };
	    
	}

	module.exports = NoteWasher;



/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

	/**
	 * 表单快照核心组件
	 * 
	 * Note: 便签，记录节点相关信息
	 * Filter：过滤器，对每个节点扫描前后进行过滤 
	 * Catcher: 捕捉者，
	 * ProcessContext：上下文，节点处理时提供上下文信息
	 * Manifest：货单，简单的节点描述规则，方便识别
	 * 
	 * !!TEXT~INPUTS~~!TEXT~INPUTS
	 *  
	 * 统一前缀：s-
	 * 
	 */

	( function ( global, $ ) {

	    "use strict"

	    const VERSION = "1.0.0";/*版本*/
	    const HtmlFactory = __webpack_require__(12);
	    const Util = __webpack_require__(3);
	    const Cache = __webpack_require__(5);
	    const Noter = __webpack_require__(7);
	    const ssContext = __webpack_require__(9);

	    var that = this;
	    var htmlFactory = new HtmlFactory();
	    var aCache = new Cache();
	    var noter = new Noter();

	    var ProcessContext = function(node, opts){
	        this.noteRoot = null;
	        this.pnote = null;
	        this.curNote = null;
	        this.opts = opts;
	        this.depth = function(){
	            if(this.pnote){
	                return this.pnote.depth+1;
	            }
	            return 1;
	        };
	        this.appendNote = function(note){
	            if(this.noteRoot == null){
	                this.noteRoot = note;
	            }else{
	                this.pnote.appendChild(note);
	            }            
	        };
	        this.removeNote = function(note){
	            this.pnote.removeChild(note);
	        }
	    }

	    var Snapshot = function( options ) {
	        this.init( options );
	        this.takeSnap = function( selector, opts ){
	            $.extend(ssContext.cfg, opts);
	            var node = $(selector)[0];
	            return noter.takeNote(node);
	        };
	    };

	    Snapshot.cache = function(){
	        return aCache.cache.apply(aCache, arguments);
	    }

	    Snapshot.register = function(){
	        for (var i = 0; i < arguments.length; i++) {
	            var arg = arguments[i];
	            if(typeof arg == "string"){
	                var m = Snapshot.cache(arg);
	                if(m){
	                    Snapshot.register(m);
	                }else{
	                    throw "Snapshot cannot find \""+arg+"\" in caches ";
	                }
	            }else if(arg.name.indexOf("-processor")>0){
	                noter.registerProcessor(arg);
	                if(typeof arg.convert === "function"){
	                    htmlFactory.equip(arg);
	                }
	            }else if(arg.name.indexOf("-filter")>0){
	                noter.registerFilter(arg);
	            }else if(arg.name.indexOf("-convertor")>0){
	                htmlFactory.equip(arg.bind, arg);
	            }else{
	                Snapshot.cache(arg);
	            }            
	        }
	        return this;
	    }

	    Snapshot.fn = Snapshot.prototype = {
	        version: VERSION,
	        constructor: Snapshot,
	        config: { maxDepth:10, isVisible:true },
	        init: function( options ){
	            this.config = this.config||{};
	            if( options ){
	                this.config.isVisible = options.isVisible;
	                this.config.convertType = options["convert-type"];
	            }
	            return this;
	        }
	    }    
	    
	    Snapshot.convert = function(){
	        return htmlFactory.convert.apply(htmlFactory, arguments);
	    };
	    Snapshot.fn.convert = Snapshot.convert;
	    
	    global.Snapshot = Snapshot;

	    if ( true ) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	            return Snapshot;
	        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    }

	    if(true){
	        module.exports = Snapshot;
	    }

	})( typeof window !== "undefined" ? window : this, jQuery );



/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	

	"use strict";

	const Cache = __webpack_require__(5);

	var HtmlFactory = function(){

		var convertors = new Cache();
		this.convert = function(arg, convertor){
			if(!arg){
	            throw "convert param is required.";
	        }else if(arg instanceof Array){
	            return this.convertArray.call(this, arg, convertor);
	        }

	        var html = "", note = arg;
	        if(note.assign){
	            var cvt = convertors.cache(note.assign);
	            html = cvt.convert(note, convertor);
	        }

	        return html;
		}

		this.convertArray = function(arr, convertor){
	        var html = "";
	        for (var i = 0; i < arr.length; i++) {
	            html += this.convert(arr[i], convertor);
	        }
	        return html;
	    }

		this.equip = function(){
			convertors.cache.apply(convertors, arguments);
		}


	}

	module.exports = HtmlFactory;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * 基础过滤器
	 * 
	 * 辅助快照核心组件完成节点筛选
	 *  
	 */
	const Snapshot = __webpack_require__(11);

	"use strict";

	var filter = new function(){
	    this.name = "base-filter";

	    /*
			http://www.w3school.com.cn/jsref/prop_node_nodetype.asp
			nodeType 属性返回以数字值返回指定节点的节点类型。
			如果节点是元素节点，则 nodeType 属性将返回 1。
			如果节点是Text节点，则 nodeType 属性将返回 3。
		*/
	    this.filter= function(args, filterChain){
	        var node = args[0];

	        //换行符、空节点 直接跳过
	    	if(node.nodeType==3 && /(^\s*$)/.test(node.nodeValue)){
	            return;
	        }

	        if(node.nodeName == "BUTTON"){
	            return;
	        }

	    	var note = filterChain.filter.apply(filterChain, args);

	        if(!note){
	            return note;
	        }
	        
	        //已委派
	        if(note.assign){
	            return note;
	        }
	        
	        //无货单，也无委派，进行丢弃
	        if(!note.manifest){            
	            //console.log("无效节点: "+note.nodeName);
	            return null;
	        }

	        //未委派，但是有正常货单的情况，直接返回
	    	return note;            
	    };      
	}

	Snapshot.register(filter);




/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	

	"use strict";

	const Snapshot = __webpack_require__(11);
	const Util = __webpack_require__(3);

	var filter = new function(){
	    this.name = "node-asterisk-filter";
	    
	    /*
			http://www.w3school.com.cn/jsref/prop_node_nodetype.asp
			nodeType 属性返回以数字值返回指定节点的节点类型。
			如果节点是元素节点，则 nodeType 属性将返回 1。
			如果节点是Text节点，则 nodeType 属性将返回 3。
		*/
	    this.filter= function(args, filterChain){
	        var node = args[0];

	        //过滤*号
	        if(node.nodeName=="#text" && Util.trim(node.nodeValue)=="*"){
	            return;
	        }

	    	return filterChain.filter.apply(filterChain, args);        
	    };      
	}

	Snapshot.cache(filter);




/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	

	const Snapshot = __webpack_require__(11);

	"use strict";

	/**
	    属性过滤器 
	    
	*/
	var filter = new function() {
	    this.name = "node-attrs-filter";
	    
	    this.filter = function(args, filterChain) {
	        var node = args[0];
	        var note = args[1];
	        
	        //find all attrs start with "s-"
	        $.each( node.attributes, function ( index, attribute ) {
	            if(attribute.name.startsWith("s-")){
	                note.ctx.data(attribute.name, attribute.value);
	            }           
	        } );

	        return filterChain.filter.apply(filterChain, args);
	    };
	}

	Snapshot.cache(filter);



/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	

	"use strict";

	const Snapshot = __webpack_require__(11);
	const context = __webpack_require__(9);

	/**
	    不可见元素过滤器，
	    默认情况过滤所有不可见元素
	    如果需要自定义过滤规则，请使用属性“s-visible=false|true”
	*/
	var filter = new function() {
	    this.name = "node-invisible-filter";

	    this.filter = function(args, filterChain) {
	        var node = args[0];
	        var note = args[1];

	        var visible = note.ctx.closesd("s-visible");
	        switch(visible){
	            case "true":
	                return filterChain.filter.apply(filterChain, args);
	            case "false":
	                return;
	            default:
	                if (node.nodeType == 1 && !$(node).is(":visible")) {
	                    return;
	                }else{
	                    return filterChain.filter.apply(filterChain, args);
	                }
	        }
	        return note;
	    };
	}

	Snapshot.cache(filter);



/***/ },
/* 17 */
/***/ function(module, exports) {

	
	"use strict";

	/*
	 清理note上无用的数据
	*/
	var filter = new function() {
	    this.name = "note-clean-filter";

	    this.filter = function(args, filterChain) {
	        var node = args[0];

	        var resultNote = filterChain.filter.apply(filterChain, args);

	        if(resultNote){
	        	delete resultNote.ctx;
	        }        
	        
	        return resultNote;
	    };
	}

	Snapshot.cache(filter);



/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	

	const Snapshot = __webpack_require__(11);
	const Util = __webpack_require__(3);

	"use strict";

	var filter = new function(){
	    this.name = "note-width-filter";
	    
	    this.filter= function(args, filterChain){
	    	var node = args[0];

	    	var resultNote = filterChain.filter.apply(filterChain, args);

	        if(Util.isElement(node)){//元素节点
	            resultNote.layout = resultNote.layout || {};
	            resultNote.layout.width = $(node).width();
	        }

	    	return resultNote;            
	    };      
	}

	Snapshot.cache(filter);




/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	
	"use strict";

	const Snapshot = __webpack_require__(11);

	var filter = new function(){
	    this.name = "note-upgrade-filter";
	    
	    this.filter= function(args, filterChain){

	    	var resultNote = filterChain.filter.apply(filterChain, args);

	        if(resultNote && resultNote.subNotes && resultNote.subNotes.length == 1){
	            //console.log("剥离空壳: "+result.nodeName);
	            var subNote = resultNote.subNotes[0];
	            if(subNote.manifest == resultNote.manifest){
	            	$.extend(resultNote, subNote);
	            }
	        }

	    	return resultNote;            
	    };      
	}

	Snapshot.cache(filter);




/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	

	"use strict";

	const Snapshot = __webpack_require__(11);
	const nodeRule = __webpack_require__(2);

	var pr = new function(){
	    this.name = "default-item-processor";

	    this.afterScan = function(note, node, ctx){
	        return note.manifest == nodeRule.ITEM;
	    }

	    this.process= function(note, node, ctx){
	        note.assign = this.name;
	        return note;
	    };

	    this.convert = function(note, converter) {
	    	var subNote1 = note.subNotes[0];
	    	var subNote2 = note.subNotes[1];

	        var html = "";
	    	html += '<p>';
	    	if(subNote1.type == "checkbox" || subNote1.type == "radio"){
				html += "<input type='"+subNote1.type+"'/> ";
		        html += '<label for="input">';
		    	html += subNote2.value;
		    	html += '</label>';
	    	}else{
	    		html += '<label for="input">';
		    	html += subNote1.value;
		    	html += '</label>';
	    		if (/^INPUT$/g.test(subNote2.nodeName)) {
		        	html += '<input type="text" value="'+subNote2.value+'">';
		        }else if(/^SELECT$/g.test(subNote2.nodeName)){
		        	html += '<select><option value="'+subNote2.value+'">'+subNote2.textValue+'</option></select>';
		        }else if(/^TEXTAREA$/g.test(subNote2.nodeName)){
	                html += '<textarea '+((subNote2.rows)?(' rows="'+subNote2.rows+'" '):'')+'>'+subNote2.textValue+'</textarea>';
	            }else{
		        	html += '<input type="text" value="'+subNote2.value+'">';
		        }
	    	}

	        html += '</p>'
	        return html;
	    };
	}

	Snapshot.cache(pr);



/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	

	"use strict";

	const Snapshot = __webpack_require__(11);
	const nodeRule = __webpack_require__(2);

	var pr = new function(){
	    this.name = "default-group-processor";

	    this.afterScan = function(note, node, ctx){
	    	var group = note.ctx.closesd("s-group");
	    	if(group){

	    	}
	        return group || (note.manifest == nodeRule.GROUP);
	    }

	    this.process= function(note, node, ctx){
	        note.assign = this.name;
	        return note;
	    };

	    this.convert = function(note, converter) {
	        var html = "";
	        html += '<div class="card">';
	        html += '<div class="card-body">';
	        for (var i = 0; i < note.subNotes.length; i++) {
	            var subNote = note.subNotes[i];
	            html += converter.convert(subNote, converter);
	        }        
	        html += '</div>'
	        html += '</div>'

	        return html;
	    };
	}

	Snapshot.cache(pr);



/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	

	"use strict";

	const Snapshot = __webpack_require__(11);
	const nodeRule = __webpack_require__(2);

	var pr = new function(){
	    this.name = "default-panel-processor";

	    this.afterScan = function(note, node, ctx){
	    	var panel = note.ctx.closesd("s-panel");
	    	if(panel){

	    	}
	        return panel || (note.manifest == nodeRule.PANEL);
	    }

	    this.process= function(note, node, ctx){
	        note.assign = this.name;
	        return note;
	    };

	    this.convert = function(note, converter) {

	        var html = "";
	        html += '<div class="card">';
	        html += '<div class="card-body">';
	        //<h5 class="card-title">Card title</h5>
	        for (var i = 0; i < note.subNotes.length; i++) {
	            var subNote = note.subNotes[i];
	            html += converter.convert(subNote, converter);
	        }        
	        html += '</div>'
	        html += '</div>'

	        return html;
	    };
	}

	Snapshot.cache(pr);



/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	
	const Snapshot = __webpack_require__(11);

	"use strict";

	var pr = new function(){
	    this.name = "default-table-processor";

	    this.beforeScan = function(note, node, ctx){
	        if(node.nodeName == "TABLE"){
	            note.assign = this.name;
	        }
	        return note;
	    }

	    this.process= function(note, node, ctx){
	        note.manifest = "GROUP";
	        var opts = ctx.cfg;
	        var rows = [];
	        var table = node;

	        var thTexts = getRowText($(table).find("tr:first"));
	        rows.push(thTexts);

	        if(opts && opts.data ){//选择器操作（自定义多选框-selector，自定义行操作-selector/elem）
	            var tr=$( node ).find(opts.data).closest("tr");
	            if(tr.length == 0){
	                throw "cannt find tr";
	            }
	            rows.push( getRowText(tr) );
	        }else if(opts && opts.event && $(node).has(event.target)){//行操作
	            var tr = $(event.target).closest("tr");
	            if(tr.length == 0){
	                throw "cannt find tr";
	            }
	            rows.push( getRowText(tr) );
	        }

	        if(rows.length == 1){//常规多选框
	            var checkedTrs = $( table ).find("tr").has("input:checked");
	            if(checkedTrs){
	                for (var i = checkedTrs.length - 1; i >= 0; i--) {
	                    var tr = checkedTrs[i];
	                    rows.push(getRowText(tr));
	                }
	            }
	        }

	        if(rows.length == 1){
	            throw "have not got operated table records."
	        }

	        note.data=rows;
	        return note;
	    };
	}

	function getRowText(tr){
	    var tds = $(tr).find("td,th");
	    var texts = tds.map(function(){
	        return $(this).text();
	    }).get();

	    return texts;
	}

	Snapshot.cache(pr);



/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	

	const Snapshot = __webpack_require__(11);

	"use strict";

	var convertor = new function(){
	    this.name = "default-table-convertor";
	    this.bind = "default-table-processor";

	    this.convert= function(note){

	        var html = '<table class="table table-bordered">';

	        html += '<thead>';
	        var ths = '';
	        for(var j=0;j<note.data[0].length;j++){
	            ths += '<th>' + note.data[0][j] + '</th>';
	        }
	        html += '<tr style="background-color: #F3F3F3;">' + ths + '</tr>';
	        html += '</thead>';

	        html += '<tbody>';
	        for(var i=1;i<note.data.length;i++){
	            var tds = '';
	            for(var j=0;j<note.data[i].length;j++){
	                tds += '<td>' + note.data[i][j] + '</td>';
	            }
	            html += '<tr>' + tds + '</tr>';
	        }
	        html += '</tbody>';
	        html += '</table>';
	        return html;
	    };
	    
	}

	Snapshot.cache(convertor);





/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	const Snapshot = __webpack_require__(11);

	"use strict";

	/**
	 * 发布前置：快照或者模板发布前处理
	 * 
	    opt:{
	        type:"ss|tpl",
	        target:"#form1",
	        data:{}|""//"td[recordId=10000]"|elem|tpl-data
	    }
	 */
	function beforePublish(opt) {
	    if (opt.type == "ss") {
	        if($(opt.target).length==0){
	            throw "can not find the element by \""+opt.target+"\".";
	        }
	        var result = new Snapshot().takeSnap(opt.target, opt);
	        return {
	            type: "ss",
	            version: Snapshot.version,
	            data: result
	        };
	    } else if (opt.type == "tpl") {
	        return {
	            type: "tpl",
	            version: Snapshot.version,
	            data: {
	                tpl: opt.target,
	                data: opt.data
	            }
	        };
	    } else {
	        throw "publish type is unknown.";
	    }
	}

	//tpl-consumer, ss-consumer
	function consume(ss) {
	    if (ss.type == "ss") {
	        var consumer = Snapshot.cache("ss-consumer");
	        if (!consumer) {
	            throw "please register ss-consumer first by Snapshot.";
	        }
	        return consumer.consume(ss.data);
	    } else if (ss.type == "tpl") {
	        var consumer = Snapshot.cache("tpl-consumer");
	        if (!consumer) {
	            throw "please register tpl-consumer first by Snapshot.";
	        }
	        return consumer.consume(ss.data.tpl, ss.data.data);
	    }
	}

	//请根据具体需求再次注册，即可覆盖该消费者
	Snapshot.register({
	    name: "ss-consumer",
	    consume: function(data) {
	        return Snapshot.convert(data);
	    }
	});

	Snapshot.beforePublish = beforePublish;
	Snapshot.consume = consume;

/***/ },
/* 26 */
/***/ function(module, exports) {

	(function(global, Snapshot, $) {

	    "use strict";

	    /*

	    $.ajax({
	        url: "",
	        method:"post",
	        ss: "#form1", //ss-type="ss|tpl"
	        ss:["../aa/tpl-1", {}],
	        //"#",".ss-"
	        ss:["#form1", "html"],
	        ss:["#table1", "td[recordId=10000]"|event|elem],
	        data: {
	            "a": "b"
	        },
	        success: function() {}
	    });

	    $.ajax("http://www.abc.com", {
	        method:"post",
	        ss: {
	            type:"ss|tpl",
	            target:"#form1",
	            data:{}/"",
	            event:evt
	        },
	        data: {
	            "a": "b"
	        },
	        success: function() {}
	    });

	    <table ss-selected=".checkbox-selected">
	        <tr><td class="checkbox-selected"></td>..</tr>
	        <tr><td class="checkbox-selected"></td>..</tr>
	        <tr>..</tr>
	        <tr>..</tr>
	        <tr>..</tr>
	    </table>

	    */

	    function resolveSSValue(value) {
	        var cfg = {};

	        if (typeof value == "string") {
	            cfg.type = "ss";
	            cfg.target = value;
	        } else if (value instanceof Array) {
	            var opt1 = value[0];
	            if (typeof opt1 != "string") {
	                throw "first option must be string for ajax/ss";
	            }
	            if (value.length == 1) {
	                return resolveOptions(opt1);
	            }

	            var opt2 = value[1];
	            if (opt1.startsWith("#") || opt1.startsWith(".ss-")) { //ss
	                cfg.type = "ss";
	                cfg.target = opt1;

	                //表格的情况会有第二个参数
	                if (opt2) {
	                    cfg.data = opt2.target || opt2;
	                }
	            } else if (typeof opt2 == "object") { //tpl
	                cfg.type = "tpl";
	                cfg.target = opt1;
	                if (!opt2) {
	                    throw "please check your \"ss\" value in ajax.";
	                }
	                cfg.data = opt2;
	            } else {
	                throw "It has not yet been supported";
	            }

	        } else {
	            throw "It has not yet been supported";
	        }

	        return cfg;
	    }

	    Snapshot._ajax_ = $.ajax;

	    Snapshot.proxyAjax = function() {
	        var options = (typeof arguments[0] == "string") ? arguments[1] : arguments[0];
	        var ssVal = options.ss;
	        if (ssVal) { //需要进行快照发布
	            if (options.method !== "post" && options.method !== "POST") {
	                throw "The http method must be 'post'";
	            }

	            var ssOpts = resolveSSValue(ssVal);
	            var ssResult = Snapshot.beforePublish(ssOpts);
	            if (!ssResult) {
	                return;
	            }

	            options.data = options.data || {}; //数据可能在uri上
	            if (typeof options.data == "string") {
	                if (options.data.indexOf("_ss=") > 0) {
	                    throw "The parameter named \"_ss\" is reserved for Snapshot."
	                }
	                options.data += "&_ss=" + encodeURIComponent(JSON.stringify(ssResult));
	            } else {
	                if (typeof options.data._ss != "undefined") {
	                    throw "The parameter named \"_ss\" is reserved for Snapshot."
	                }
	                options.data._ss = encodeURIComponent(JSON.stringify(ssResult));
	            }
	        }

	        //delete options.ss;
	        return Snapshot._ajax_.apply($, arguments);
	    }

	    Snapshot.proxyAjax.proxy = "snapshot";
	    $.ajax = Snapshot.proxyAjax;

	})(typeof window !== "undefined" ? window : this, Snapshot, jQuery);

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	
	const Snapshot = __webpack_require__(11);

	"use strict";

	var pr = new function(){
	    this.name = "default-tab-processor";


	    this.beforeScan = function(note, node, ctx){
	        if(note.ctx.data("s-type") == "tab"){
	            note.assign = this.name;
	            note.manifest = "GROUP";

	            var tabNames = [];
	            var contents = [];

	            $(node).find("a").each(function(idx, el){
	                tabNames.push($(el).text());
	            });

	            note.tabNames = tabNames;

	            $(node).find(".tab-pane").each(function(idx, el){
	                var contentNode = note.noter.takeNote(el);
	                contents.push(contentNode);//考虑空节点
	            }); 
	            note.contents = contents;
	        }

	        return note;
	    }

	    this.convert=function(note, convertor){
	        var html = "";
	        html += '<div class="nav nav-tabs" id="nav-tab" role="tablist">'
	        for (var i = 0; i < note.tabNames.length; i++) {
	            var tabName = note.tabNames[i];
	            html += '<a class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">'+tabName+'</a>'
	        }
	        html += '</div>'

	        for (var i = 0; i < note.contents.length; i++) {
	            var contentNote = note.contents[i];
	            html += '<div class="tab-pane fade active show in" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">';
	            html += convertor.convert(contentNote, convertor);
	            html += '</div>';
	        }
	        
	        return html;
	    }
	}

	Snapshot.cache(pr);



/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	
	const Snapshot = __webpack_require__(11);

	"use strict";

	var pr = new function(){
	    this.name = "bank-select2-processor";

	    this.beforeScan = function(note, node, ctx){        
	        if($(node).children(".select2.select2-container").length>0){  //代理select2下拉框
	            note.isFactor = true;
	            note.manifest = "INPUTS";
	            note.nodeName = "INPUT";
	            note.type = "text";
	            note.value = $(node).find(".select2-selection__rendered").text();

	            note.orign = "select2";
	        }
	        return note;
	    };
	}

	Snapshot.cache(pr);



/***/ }
/******/ ]);