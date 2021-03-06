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
	__webpack_require__(13);

	//filter Configurable
	__webpack_require__(14);//星号过滤
	__webpack_require__(15);//s-属性
	__webpack_require__(16);//不可见元素

	__webpack_require__(17);//清理已不需要的信息
	__webpack_require__(18);//宽度
	__webpack_require__(19);//空壳note升级

	//extend
	__webpack_require__(20);
	__webpack_require__(21);


	//bank version
	__webpack_require__(22);
	__webpack_require__(23);

	__webpack_require__(24);
	__webpack_require__(25);
	__webpack_require__(26);
	__webpack_require__(27);
	__webpack_require__(28);
	__webpack_require__(29);
	__webpack_require__(30);
	__webpack_require__(31);



/***/ },
/* 1 */
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
	    const Rebuilder = __webpack_require__(2);
	    const Util = __webpack_require__(4);
	    const Cache = __webpack_require__(3);
	    const Noter = __webpack_require__(5);
	    const ssContext = __webpack_require__(8);

	    var that = this;
	    var builder = new Rebuilder();
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
	                    builder.registerConvertor(arg);
	                }
	            }else if(arg.name.indexOf("-filter")>0){
	                noter.registerFilter(arg);
	            }else if(arg.name.indexOf("-convertor")>0){
	                builder.registerConvertor(arg.bind, arg);
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
	        return builder.work.apply(builder, arguments);
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
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	

	"use strict";

	const Cache = __webpack_require__(3);

	/*重建者：通过Note重建Html*/
	var Rebuilder = function(){

	    var cvts = new Cache();
	    this.registerConvertor=function(){
	        cvts.cache.apply(cvts, arguments);
	        if(arguments.length==1){
	            cvts.cache(arguments[0].name).builder = this;
	        }else if(arguments.length==2){
	            cvts.cache(arguments[0]).builder = this;
	        }
	        
	    };

	    this.work = function(note){
	        var result = "";
	        if(note.assign){
	            var cvt = cvts.cache(note.assign);
	            result = cvt.convert(note);
	        }else if(note.subNotes){
	            for (var i = 0; i < note.subNotes.length; i++) {
	                var subNote = note.subNotes[i];
	                result += this.work(subNote);
	            }
	        }
	        return result;
	    };
	};

	module.exports = Rebuilder;



/***/ },
/* 3 */
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
/* 4 */
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	

	"use strict";

	const Group = __webpack_require__(6);
	const FilterChain = __webpack_require__(7);
	const context = __webpack_require__(8);
	const Note = __webpack_require__(9);
	const NoteContext = __webpack_require__(10);
	const NoteWasher = __webpack_require__(12);
	const noteRule = __webpack_require__(11);

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
/* 6 */
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
/* 7 */
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	
	"use strict";

	const Cache = __webpack_require__(3);
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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	
	"use strict";

	const Util = __webpack_require__(4);
	const NoteContext = __webpack_require__(10);
	const nodeRule = __webpack_require__(11);

	var Note = function(node){

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
	            this.grade = 0;
	        }else if(!this.isInvalid){
	            for(var i=0;i<this.subNotes.length;i++){
	                var subNote = this.subNotes[i];
	                this.manifest = (this.manifest?this.manifest+"~":"")+subNote.manifest;                                   
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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	
	"use strict";

	const Cache = __webpack_require__(3);
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	

	"use strict";

	const Util = __webpack_require__(4);

	/*
	FACTOR = TEXT|INPUTS
	ITEM = TEXT~INPUTS    //grade = 1, inputType
	CARD = ITEM(~ITEM)+  //grade = 2
	CARD = TEXT~CARD      //grade>2
	CARD = CARD(~CARD)+     ////grade>2
	*/
	const ManifestFactors = ["TEXT", "INPUTS"];
	const NodeNameFacotrs = ["#text","SELECT","INPUT","TEXTAREA"];
	const ManifestMapping = {"#text":"TEXT","SELECT":"INPUTS","INPUT":"INPUTS", "TEXTAREA":"INPUTS"};

	var NoteRule = new function(){

		this.TEXT="TEXT";
		this.INPUTS="INPUTS";
		this.ITEM="ITEM";
		this.CARD="CARD";

	    const GRADE = {
	        "TEXT":"0",
	        "INPUTS":"0",
	        "ITEM":"1",
	        "CARD":"2"
	    }

	    this.isNodeNameFactor = function(nodeName){
	        return NodeNameFacotrs.indexOf(nodeName)!=-1;
	    };
	    this.isFactor = function(manifest){
	    	return ManifestFactors.indexOf(manifest)!=-1;
	    };
	    this.isItem = function(manifest){
	    	return /^TEXT~INPUTS$/g.test(manifest) || /^INPUTS~TEXT$/g.test(manifest);
	    };
	    this.isCARD = function(manifest){
	    	return /^ITEM(~ITEM)+$/g.test(manifest);
	    };
	    
	    this.getManifest = function(factor){
	    	return ManifestMapping[factor];
	    };
	    this.getGrade = function(manifest){
	        return GRADE[manifest]||-1;
	    };


	}

	module.exports = NoteRule;



/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	
	"use strict";

	const noteRule = __webpack_require__(11);

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
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * 基础过滤器
	 * 
	 * 辅助快照核心组件完成节点筛选
	 *  
	 */
	const Snapshot = __webpack_require__(1);

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
	        
	        note.nodeName = node.nodeName;
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

	const Snapshot = __webpack_require__(1);
	const Util = __webpack_require__(4);

	var filter = new function(){
	    this.name = "node-asterisk-filter";
	    
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

	

	"use strict";

	const Snapshot = __webpack_require__(1);
	const Util = __webpack_require__(4);

	/**
	    属性过滤器 
	    
	*/
	var filter = new function() {
	    this.name = "node-attrs-filter";
	    
	    this.filter = function(args, filterChain) {
	        var node = args[0];
	        var note = args[1];
	        
	        //find all attrs start with "s-"
	        if(Util.isElement(node)){
	            $.each( node.attributes, function ( index, attribute ) {
	                if(attribute.name.startsWith("s-")){
	                    note.ctx.data(attribute.name, attribute.value);
	                }           
	            } );
	        }

	        return filterChain.filter.apply(filterChain, args);
	    };
	}

	Snapshot.cache(filter);



/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	

	"use strict";

	const Snapshot = __webpack_require__(1);
	const context = __webpack_require__(8);

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

	

	const Snapshot = __webpack_require__(1);
	const Util = __webpack_require__(4);

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

	const Snapshot = __webpack_require__(1);

	var filter = new function(){
	    this.name = "note-upgrade-filter";
	    
	    this.filter= function(args, filterChain){

	    	var resultNote = filterChain.filter.apply(filterChain, args);

	        if(resultNote && resultNote.subNotes && resultNote.subNotes.length == 1){
	            //console.log("剥离空壳: "+result.nodeName);
	            var subNote = resultNote.subNotes[0];
	            $.extend(true, resultNote, subNote);
	        }

	    	return resultNote;            
	    };      
	}

	Snapshot.cache(filter);




/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	
	const Snapshot = __webpack_require__(1);

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
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	

	const Snapshot = __webpack_require__(1);

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
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	const Snapshot = __webpack_require__(1);

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
/* 23 */
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
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	
	const Snapshot = __webpack_require__(1);

	"use strict";

	var pr = new function(){
	    this.name = "bank-select2-processor";

	    this.beforeScan = function(note, node, ctx){        
	        if($(node).children(".select2.select2-container").length>0){  //代理select2下拉框
	            note.isFactor = true;
	            note.manifest = "INPUTS";
	            note.nodeName = "INPUT";
	            note.type = "text";
	            note.value = $(node).find(".select2-selection__rendered:last").text();

	            note.orign = "select2";
	        }
	        return note;
	    };
	}

	Snapshot.cache(pr);



/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	
	const Snapshot = __webpack_require__(1);

	"use strict";

	var pr = new function(){
	    this.name = "bank-tab-processor";

	    this.beforeScan = function(note, node, ctx){
	        if(node.className == "nav nav-tabs"){
	            note.assign = this.name;
	            note.manifest = "CARD";
	        }
	        return note;
	    };

	    this.process= function(note, node, ctx){
	        if(node.className == "nav nav-tabs"){
	            note.nodeName = "#text";
	            note.value = $(node).find("li.active a").text();
	            note.nodeType = "TEXT";
	            note.manifest = "TEXT";
	            note.hierarchy=1;
	        }
	        if(node.className == "panel-heading"){
	            note.nodeName = "#text";
	            note.value =$.trim($(node).find(".panel-title").text());
	            note.nodeType = "TEXT";
	            note.manifest = "PANEL";
	            note.hierarchy=1;
	        }
	        return note;
	    };

	    this.convert= function(note){
	        
	        var html = "<div  class=\"form-group col-md-12\">";

	        if(note.manifest=="TEXT"){
	            html += note.value;
	        }
	        if(note.manifest=="PANEL"){
	            html +="<h4 class='panel-title'>"+note.value+"</h4>";
	        }

	        html +="</div>";

	        return html;
	    };
	}

	Snapshot.cache(pr);



/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	
	const Snapshot = __webpack_require__(1);

	"use strict";

	var pr = new function(){
	    this.name = "bank-bttable-processor";

	    this.beforeScan = function(note, node, ctx){
	        if(note.ctx.data("s-type") == "form-table"){       //代理bootstrap-table
	            note.assign = this.name;
	            note.manifest = "ITEM";

	            var array=[];
	            var array1=[];
	            var $ths=$(node).find("tr").eq(0).find("th");
	            for(var i=0;i<$ths.length;i++){
	                array1.push($.trim($ths.eq(i).text()));
	            }
	            array.push(array1);
	            var $trs=$(node).find("tr");
	            for(var i=1;i<$trs.length;i++){
	                var array2=[];
	                var $tr = $trs.eq(i);
	                var $tds = $tr.find("td");
	                for(var j=0;j<$tds.length;j++){
	                    var node=$tds.eq(j).children(":first").get(0);
	                    if(node){
	                        if(node.nodeName=="INPUT"){
	                            array2.push($tds.eq(j).find("input").val());
	                        }
	                        if(node.nodeName=="SELECT"){
	                            array2.push($tds.eq(j).find("select").find("option:selected").text());
	                        }
	                        if(node.nodeName=="A"){
	                            var aString="";
	                            var len=$tds.eq(j).find("a").length;
	                            if(len>1){
	                                for(var k=0;k<len;k++){
	                                    aString+=$tds.eq(j).find("a").eq(k).text()+" ";
	                                }
	                            }else{
	                                aString=$tds.eq(j).find("a").text();
	                            }
	                            array2.push(aString);
	                        }
	                        if(node.nodeName=="SPAN"){
	                            array2.push($tds.eq(j).text());
	                        }
	                    }else {
	                        array2.push($tds.eq(j).text());
	                    }
	                }
	                array.push(array2);
	            }
	            note.value=array;

	        }
	        return note;
	    };

	    this.convert= function(note,ctx){

	        var html = '<table class="table table-bordered">';

	        html += '<thead>';
	        var ths = '';
	        for(var j=0;j<note.value[0].length;j++){
	            ths += '<th>' + note.value[0][j] + '</th>';
	        }
	        html += '<tr style="background-color: #F3F3F3;">' + ths + '</tr>';
	        html += '</thead>';

	        html += '<tbody>';
	        for(var i=1;i<note.value.length;i++){
	            var tds = '';
	            for(var j=0;j<note.value[i].length;j++){
	                tds += '<td>' + note.value[i][j] + '</td>';
	            }
	            html += '<tr>' + tds + '</tr>';
	        }
	        html += '</tbody>';
	        html += '</table>';

	        return html;
	    };

	}

	Snapshot.cache(pr);



/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	
	const Snapshot = __webpack_require__(1);

	"use strict";

	var pr = new function(){
	    this.name = "bank-ztree-processor";

	    this.beforeScan = function(note, node, ctx){
	        if(typeof node.className=="string" && node.className.indexOf("ztree")>=0){          //代理树结构
	            note.assign = this.name;
	            note.manifest = "ITEM";

	            note.nodeName="#ztree";
	            var treeObj = $.fn.zTree.getZTreeObj(node.id);
	            // var nodes = treeObj.transformToArray(treeObj.getNodes());
	            note.value = treeObj.getNodes();
	            note.nodeType = "ZTREE";
	            note.manifest="ZTREE";
	        }
	        return note;
	    };


	    this.convert= function(note,ctx){

	        if(note.nodeType=="ZTREE"){
	            var html = '<div class="zTreeDemoBackground left">' +
	                    '<ul id="tree" class="ztree menu-right-tree"></ul>' +
	                '</div>';
	            var setting = {
	                view: {
	                    selectedMulti: false
	                },
	                check: {
	                    enable: true,
	                    chkDisabledInherit: true
	                },
	                data: {
	                    simpleData: {
	                        enable: true
	                    }
	                },
	                callback: {
	                    onCheck: onCheck,
	                    onExpand:onExpand
	                }
	            };
	            var zNodes =[];

	            note.value.map(function (item) {
	                item.chkDisabled=true;
	                return item;
	            });
	            zNodes=note.value;
	            setTimeout(function(){
	                $.fn.zTree.init($("#tree"), setting, zNodes);
	            },0);
	        }else{
	            html="";
	        }

	        return html;
	    };
	}

	Snapshot.cache(pr);



/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	
	const Snapshot = __webpack_require__(1);

	"use strict";

	var pr = new function(){
	    this.name = "bank-checkboxgroup-processor";

	    this.beforeScan = function(note, node, ctx){
	        if(note.ctx.data("s-type")=="checkbox-group"){
	            var itemClass = note.ctx.data("s-item-class");
	            note.itemClass = itemClass || "col-xs-12 col-md-6";

	            note.assign = this.name;
	            note.manifest = "INPUTS";
	            note.subNotes = note.subNotes || [];
	            for (var i = 0; i < node.childNodes.length; i++) {
	                var cnode = node.childNodes[i];
	                var cnote = note.noter.takeNote(cnode);
	                if(cnote){
	                    note.subNotes.push(cnote);
	                }                
	            }
	        }
	        return note;
	    };

	    this.convert= function(note,ctx){
	        var html = "";
	        for(var i=0;i<note.subNotes.length;i++){
	            //html += this.builder.work(note.subNotes[i]);

	            var subNote = note.subNotes[i];
	            var labelNote = subNote.subNotes[1];
	            var inputNote = subNote.subNotes[0];

	            html += "<div class=\"form-group "+note.itemClass+"\" style=\"display:inline-block;\">";
	            
	            html += "<input onclick='return false;' type='"+inputNote.type+"' "+((inputNote.checked)?" checked='checked' ":"")+"/> ";
	            html += '<label for="input">';
	            html += labelNote.value;
	            html += '</label>';

	            html += "</div>";
	        }
	        return html;
	    };

	}

	Snapshot.cache(pr);



/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	
	const Snapshot = __webpack_require__(1);

	"use strict";

	var pr = new function(){
	    this.name = "bank-checkboxgroup2-processor";

	    this.beforeScan = function(note, node, ctx){
	        if(note.ctx.data("s-type")=="checkbox-group"){
	            var itemClass = note.ctx.data("s-item-class");
	            note.itemClass = itemClass || "col-xs-12 col-md-6";

	            note.assign = this.name;
	            note.manifest = "INPUTS";
	            note.subNotes = note.subNotes || [];
	            
	            var $checkboxItems = $(node).find(".checkbox-custom");
	            for (var j = 0; j < $checkboxItems.length; j++) {
	                var item = $checkboxItems[j];
	                var $input = $(item).find("input");
	                var $label = $(item).find("label");
	                cnote = {label:$label.text(), input:{type:$input.attr("type"), checked:$input[0].checked}};
	                note.subNotes.push(cnote);
	            }
	        }
	        return note;
	    };

	    this.convert= function(note,ctx){
	        var html = "";
	        for(var i=0;i<note.subNotes.length;i++){
	            //html += this.builder.work(note.subNotes[i]);

	            var subNote = note.subNotes[i];
	            var labelText = subNote.label;
	            var inputNote = subNote.input;

	            html += "<div class=\"form-group "+note.itemClass+"\" style=\"display:inline-block;\">";
	            
	            html += "<input onclick='return false;' type='"+inputNote.type+"' "+((inputNote.checked)?" checked='checked' ":"")+"/> ";
	            html += '<label for="input">';
	            html += labelText;
	            html += '</label>';

	            html += "</div>";
	        }
	        return html;
	    };

	}

	Snapshot.cache(pr);



/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	

	"use strict";

	const Snapshot = __webpack_require__(1);
	const nodeRule = __webpack_require__(11);

	var pr = new function(){
	    this.name = "bank-panel-processor";

	    this.afterScan = function(note, node, ctx){
	        return /^ITEM(~ITEM)+$/g.test(note.manifest) || /^(TEXT~CARD)+$/g.test(note.manifest);
	    }

	    this.process= function(note, node, ctx){
	        note.assign = this.name;
	        
	        if(/^ITEM(~ITEM)+$/g.test(note.manifest)){
	            note.manifest = "CARD";
	        }else if(/^(TEXT~CARD)$/g.test(note.manifest)){
	            note.header = note.subNotes[0];
	            note.body = note.subNotes[1];
	            note.subNotes = null;
	            note.manifest = "CARD";
	        }else if(/^(TEXT~CARD)+$/g.test(note.manifest)){
	            var _subNotes = note.subNotes;
	            note.subNotes = [];
	            for (var i = 0; i < _subNotes.length; i++) {
	                var header =  _subNotes[i];
	                var body = _subNotes[i+1];
	                var newNote = {assign:this.name, header:header, body:body, manifest:"CARD"};
	                note.subNotes.push(newNote);
	                i++;
	            }
	            note.manifest = "CARDS";
	        }
	        
	        return note;
	    };

	    this.convert = function(note) {
	        var html = "";
	        if(note.manifest == "CARDS"){
	            html += '<div class="panel-group">';
	            for (var i = 0; i < note.subNotes.length; i++) {
	                var subNote = note.subNotes[i];
	                html += this.convert(subNote);
	            }
	            html += '</div>';
	        }else if(note.manifest == "CARD"){
	            html += '<div class="panel panel-default">';
	            if(note.header){
	                html += '<div class="panel-heading" role="tab">';
	                    html += '<h4 class="panel-title">';
	                        html += note.header.value;
	                    html += '</h4>';
	                html += '</div>';
	            }
	            html += '<div class="panel-body">';
	            if(note.body){
	                for (var i = 0; i < note.body.subNotes.length; i++) {
	                    var subNote = note.body.subNotes[i];
	                    html += this.builder.work(subNote);
	                }
	            }else if(note.subNotes){
	                for (var i = 0; i < note.subNotes.length; i++) {
	                    var subNote = note.subNotes[i];
	                    html += this.builder.work(subNote);
	                }
	            }
	            html += '</div>';
	            html += '</div>';
	        }

	        return html;
	    };
	}

	Snapshot.cache(pr);


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	

	"use strict";

	const Snapshot = __webpack_require__(1);
	const nodeRule = __webpack_require__(11);

	var pr = new function(){
	    this.name = "bank-item-processor";

	    this.afterScan = function(note, node, ctx){
	        return /^TEXT~INPUTS$/g.test(note.manifest) || /^INPUTS~TEXT$/g.test(note.manifest);
	    }

	    this.process= function(note, node, ctx){
	        note.assign = this.name;
	        note.manifest = "ITEM";

	        var itemClass = note.ctx.closesd("s-item-class");
	        if(itemClass){
	            note.itemClass = itemClass;
	        }

	        return note;
	    };

	    this.convert = function(note) {

	        var subNote1 = note.subNotes[0];
	        var subNote2 = note.subNotes[1];

	        note.itemClass = note.itemClass || "col-xs-12 col-md-6";

	        var html = "";
	        if (subNote1.type == "checkbox" || subNote1.type == "radio") {
	            html = "<div class=\"form-group "+note.itemClass+"\" style=\"display:inline-block;\">";
	            
	            html += "<input onclick='return false;' type='"+subNote1.type+"' "+((subNote1.checked)?" checked='checked' ":"")+"/> ";
	            html += '<label for="input">';
	            html += subNote2.value;
	            html += '</label>';

	            html += "</div>";
	        }else if(subNote2.assign){
	            html += '<div class="form-group tbsp-form-item col-xs-12 col-md-12" style="">';
	            html += '<label class="col-xs-12 col-md-2 control-label pl-0 pr-5">'+subNote1.value+'</label>';
	            html += '<div class="col-xs-12 col-md-10 pl-0 ">';
	            //html = "<div class=\"col-sm-offset-1 form-group\" style=\"display:inline-block;\">";
	            html += this.builder.work(subNote2);
	            html += "</div>";
	            html += "</div>";

	        }else{
	            html = "<div class=\"form-group "+note.itemClass+"\">";
	            html += "<label for='' class='col-md-4'>" + subNote1.value + "</label>";
	            html += "<div class='col-md-8'>";

	            if(subNote2.type=="select"){
	                html += '<select readonly="readonly"><option value="'+subNote2.value+'">'+subNote2.textValue+'</option></select>';
	            }else if(subNote2.type=="textarea"){
	                html += '<textarea readonly="readonly" class="form-control" '+((subNote2.rows)?(' rows="'+subNote2.rows+'" '):'')+'>'+subNote2.textValue+'</textarea>';
	            }else{
	                html += '<input readonly="readonly" class="form-control" type="'+subNote2.type+'" value="'+subNote2.value+'" >';
	            }

	            html += "</div></div>";
	        }

	        return html;
	    };
	}

	Snapshot.cache(pr);



/***/ }
/******/ ]);