(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3718],{38990:function(t){t.exports=function(t,e){var i=e.prototype,n=i.format;i.format=function(t){var e=this,i=this.$locale();if(!this.isValid())return n.bind(this)(t);var s=this.$utils(),r=(t||"YYYY-MM-DDTHH:mm:ssZ").replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g,function(t){switch(t){case"Q":return Math.ceil((e.$M+1)/3);case"Do":return i.ordinal(e.$D);case"gggg":return e.weekYear();case"GGGG":return e.isoWeekYear();case"wo":return i.ordinal(e.week(),"W");case"w":case"ww":return s.s(e.week(),"w"===t?1:2,"0");case"W":case"WW":return s.s(e.isoWeek(),"W"===t?1:2,"0");case"k":case"kk":return s.s(String(0===e.$H?24:e.$H),"k"===t?1:2,"0");case"X":return Math.floor(e.$d.getTime()/1e3);case"x":return e.$d.getTime();case"z":return"["+e.offsetName()+"]";case"zzz":return"["+e.offsetName("long")+"]";default:return t}});return n.bind(this)(r)}}},76920:function(t){t.exports=function(t,e,i){var n=function(t){return t.add(4-t.isoWeekday(),"day")},s=e.prototype;s.isoWeekYear=function(){return n(this).year()},s.isoWeek=function(t){if(!this.$utils().u(t))return this.add(7*(t-this.isoWeek()),"day");var e,s,r,a=n(this),o=(e=this.isoWeekYear(),r=4-(s=(this.$u?i.utc:i)().year(e).startOf("year")).isoWeekday(),s.isoWeekday()>4&&(r+=7),s.add(r,"day"));return a.diff(o,"week")+1},s.isoWeekday=function(t){return this.$utils().u(t)?this.day()||7:this.day(this.day()%7?t:t-7)};var r=s.startOf;s.startOf=function(t,e){var i=this.$utils(),n=!!i.u(e)||e;return"isoweek"===i.p(t)?n?this.date(this.date()-(this.isoWeekday()-1)).startOf("day"):this.date(this.date()-1-(this.isoWeekday()-1)+7).endOf("day"):r.bind(this)(t,e)}}},83718:(t,e,i)=>{"use strict";i.d(e,{diagram:()=>tY});var n,s,r,a=i(3635),o=i(22553),c=i(91975),l=i(30832),d=i(76920),u=i(99124),h=i(38990),f=i(65291),y=function(){var t=(0,o.K2)(function(t,e,i,n){for(i=i||{},n=t.length;n--;i[t[n]]=e);return i},"o"),e=[6,8,10,12,13,14,15,16,17,18,20,21,22,23,24,25,26,27,28,29,30,31,33,35,36,38,40],i=[1,26],n=[1,27],s=[1,28],r=[1,29],a=[1,30],c=[1,31],l=[1,32],d=[1,33],u=[1,34],h=[1,9],f=[1,10],y=[1,11],k=[1,12],m=[1,13],p=[1,14],g=[1,15],b=[1,16],T=[1,19],x=[1,20],v=[1,21],w=[1,22],_=[1,23],D=[1,25],$=[1,35],C={trace:(0,o.K2)(function(){},"trace"),yy:{},symbols_:{error:2,start:3,gantt:4,document:5,EOF:6,line:7,SPACE:8,statement:9,NL:10,weekday:11,weekday_monday:12,weekday_tuesday:13,weekday_wednesday:14,weekday_thursday:15,weekday_friday:16,weekday_saturday:17,weekday_sunday:18,weekend:19,weekend_friday:20,weekend_saturday:21,dateFormat:22,inclusiveEndDates:23,topAxis:24,axisFormat:25,tickInterval:26,excludes:27,includes:28,todayMarker:29,title:30,acc_title:31,acc_title_value:32,acc_descr:33,acc_descr_value:34,acc_descr_multiline_value:35,section:36,clickStatement:37,taskTxt:38,taskData:39,click:40,callbackname:41,callbackargs:42,href:43,clickStatementDebug:44,$accept:0,$end:1},terminals_:{2:"error",4:"gantt",6:"EOF",8:"SPACE",10:"NL",12:"weekday_monday",13:"weekday_tuesday",14:"weekday_wednesday",15:"weekday_thursday",16:"weekday_friday",17:"weekday_saturday",18:"weekday_sunday",20:"weekend_friday",21:"weekend_saturday",22:"dateFormat",23:"inclusiveEndDates",24:"topAxis",25:"axisFormat",26:"tickInterval",27:"excludes",28:"includes",29:"todayMarker",30:"title",31:"acc_title",32:"acc_title_value",33:"acc_descr",34:"acc_descr_value",35:"acc_descr_multiline_value",36:"section",38:"taskTxt",39:"taskData",40:"click",41:"callbackname",42:"callbackargs",43:"href"},productions_:[0,[3,3],[5,0],[5,2],[7,2],[7,1],[7,1],[7,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[19,1],[19,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,2],[9,1],[9,1],[9,1],[9,2],[37,2],[37,3],[37,3],[37,4],[37,3],[37,4],[37,2],[44,2],[44,3],[44,3],[44,4],[44,3],[44,4],[44,2]],performAction:(0,o.K2)(function(t,e,i,n,s,r,a){var o=r.length-1;switch(s){case 1:return r[o-1];case 2:case 6:case 7:this.$=[];break;case 3:r[o-1].push(r[o]),this.$=r[o-1];break;case 4:case 5:this.$=r[o];break;case 8:n.setWeekday("monday");break;case 9:n.setWeekday("tuesday");break;case 10:n.setWeekday("wednesday");break;case 11:n.setWeekday("thursday");break;case 12:n.setWeekday("friday");break;case 13:n.setWeekday("saturday");break;case 14:n.setWeekday("sunday");break;case 15:n.setWeekend("friday");break;case 16:n.setWeekend("saturday");break;case 17:n.setDateFormat(r[o].substr(11)),this.$=r[o].substr(11);break;case 18:n.enableInclusiveEndDates(),this.$=r[o].substr(18);break;case 19:n.TopAxis(),this.$=r[o].substr(8);break;case 20:n.setAxisFormat(r[o].substr(11)),this.$=r[o].substr(11);break;case 21:n.setTickInterval(r[o].substr(13)),this.$=r[o].substr(13);break;case 22:n.setExcludes(r[o].substr(9)),this.$=r[o].substr(9);break;case 23:n.setIncludes(r[o].substr(9)),this.$=r[o].substr(9);break;case 24:n.setTodayMarker(r[o].substr(12)),this.$=r[o].substr(12);break;case 27:n.setDiagramTitle(r[o].substr(6)),this.$=r[o].substr(6);break;case 28:this.$=r[o].trim(),n.setAccTitle(this.$);break;case 29:case 30:this.$=r[o].trim(),n.setAccDescription(this.$);break;case 31:n.addSection(r[o].substr(8)),this.$=r[o].substr(8);break;case 33:n.addTask(r[o-1],r[o]),this.$="task";break;case 34:this.$=r[o-1],n.setClickEvent(r[o-1],r[o],null);break;case 35:this.$=r[o-2],n.setClickEvent(r[o-2],r[o-1],r[o]);break;case 36:this.$=r[o-2],n.setClickEvent(r[o-2],r[o-1],null),n.setLink(r[o-2],r[o]);break;case 37:this.$=r[o-3],n.setClickEvent(r[o-3],r[o-2],r[o-1]),n.setLink(r[o-3],r[o]);break;case 38:this.$=r[o-2],n.setClickEvent(r[o-2],r[o],null),n.setLink(r[o-2],r[o-1]);break;case 39:this.$=r[o-3],n.setClickEvent(r[o-3],r[o-1],r[o]),n.setLink(r[o-3],r[o-2]);break;case 40:this.$=r[o-1],n.setLink(r[o-1],r[o]);break;case 41:case 47:this.$=r[o-1]+" "+r[o];break;case 42:case 43:case 45:this.$=r[o-2]+" "+r[o-1]+" "+r[o];break;case 44:case 46:this.$=r[o-3]+" "+r[o-2]+" "+r[o-1]+" "+r[o]}},"anonymous"),table:[{3:1,4:[1,2]},{1:[3]},t(e,[2,2],{5:3}),{6:[1,4],7:5,8:[1,6],9:7,10:[1,8],11:17,12:i,13:n,14:s,15:r,16:a,17:c,18:l,19:18,20:d,21:u,22:h,23:f,24:y,25:k,26:m,27:p,28:g,29:b,30:T,31:x,33:v,35:w,36:_,37:24,38:D,40:$},t(e,[2,7],{1:[2,1]}),t(e,[2,3]),{9:36,11:17,12:i,13:n,14:s,15:r,16:a,17:c,18:l,19:18,20:d,21:u,22:h,23:f,24:y,25:k,26:m,27:p,28:g,29:b,30:T,31:x,33:v,35:w,36:_,37:24,38:D,40:$},t(e,[2,5]),t(e,[2,6]),t(e,[2,17]),t(e,[2,18]),t(e,[2,19]),t(e,[2,20]),t(e,[2,21]),t(e,[2,22]),t(e,[2,23]),t(e,[2,24]),t(e,[2,25]),t(e,[2,26]),t(e,[2,27]),{32:[1,37]},{34:[1,38]},t(e,[2,30]),t(e,[2,31]),t(e,[2,32]),{39:[1,39]},t(e,[2,8]),t(e,[2,9]),t(e,[2,10]),t(e,[2,11]),t(e,[2,12]),t(e,[2,13]),t(e,[2,14]),t(e,[2,15]),t(e,[2,16]),{41:[1,40],43:[1,41]},t(e,[2,4]),t(e,[2,28]),t(e,[2,29]),t(e,[2,33]),t(e,[2,34],{42:[1,42],43:[1,43]}),t(e,[2,40],{41:[1,44]}),t(e,[2,35],{43:[1,45]}),t(e,[2,36]),t(e,[2,38],{42:[1,46]}),t(e,[2,37]),t(e,[2,39])],defaultActions:{},parseError:(0,o.K2)(function(t,e){if(e.recoverable)this.trace(t);else{var i=Error(t);throw i.hash=e,i}},"parseError"),parse:(0,o.K2)(function(t){var e=this,i=[0],n=[],s=[null],r=[],a=this.table,c="",l=0,d=0,u=0,h=r.slice.call(arguments,1),f=Object.create(this.lexer),y={yy:{}};for(var k in this.yy)Object.prototype.hasOwnProperty.call(this.yy,k)&&(y.yy[k]=this.yy[k]);f.setInput(t,y.yy),y.yy.lexer=f,y.yy.parser=this,void 0===f.yylloc&&(f.yylloc={});var m=f.yylloc;r.push(m);var p=f.options&&f.options.ranges;function g(){var t;return"number"!=typeof(t=n.pop()||f.lex()||1)&&(t instanceof Array&&(t=(n=t).pop()),t=e.symbols_[t]||t),t}"function"==typeof y.yy.parseError?this.parseError=y.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError,(0,o.K2)(function(t){i.length=i.length-2*t,s.length=s.length-t,r.length=r.length-t},"popStack"),(0,o.K2)(g,"lex");for(var b,T,x,v,w,_,D,$,C,K={};;){if(x=i[i.length-1],this.defaultActions[x]?v=this.defaultActions[x]:(null==b&&(b=g()),v=a[x]&&a[x][b]),void 0===v||!v.length||!v[0]){var S="";for(_ in C=[],a[x])this.terminals_[_]&&_>2&&C.push("'"+this.terminals_[_]+"'");S=f.showPosition?"Parse error on line "+(l+1)+":\n"+f.showPosition()+"\nExpecting "+C.join(", ")+", got '"+(this.terminals_[b]||b)+"'":"Parse error on line "+(l+1)+": Unexpected "+(1==b?"end of input":"'"+(this.terminals_[b]||b)+"'"),this.parseError(S,{text:f.match,token:this.terminals_[b]||b,line:f.yylineno,loc:m,expected:C})}if(v[0]instanceof Array&&v.length>1)throw Error("Parse Error: multiple actions possible at state: "+x+", token: "+b);switch(v[0]){case 1:i.push(b),s.push(f.yytext),r.push(f.yylloc),i.push(v[1]),b=null,T?(b=T,T=null):(d=f.yyleng,c=f.yytext,l=f.yylineno,m=f.yylloc,u>0&&u--);break;case 2:if(D=this.productions_[v[1]][1],K.$=s[s.length-D],K._$={first_line:r[r.length-(D||1)].first_line,last_line:r[r.length-1].last_line,first_column:r[r.length-(D||1)].first_column,last_column:r[r.length-1].last_column},p&&(K._$.range=[r[r.length-(D||1)].range[0],r[r.length-1].range[1]]),void 0!==(w=this.performAction.apply(K,[c,d,l,y.yy,v[1],s,r].concat(h))))return w;D&&(i=i.slice(0,-1*D*2),s=s.slice(0,-1*D),r=r.slice(0,-1*D)),i.push(this.productions_[v[1]][0]),s.push(K.$),r.push(K._$),$=a[i[i.length-2]][i[i.length-1]],i.push($);break;case 3:return!0}}return!0},"parse")};function K(){this.yy={}}return C.lexer={EOF:1,parseError:(0,o.K2)(function(t,e){if(this.yy.parser)this.yy.parser.parseError(t,e);else throw Error(t)},"parseError"),setInput:(0,o.K2)(function(t,e){return this.yy=e||this.yy||{},this._input=t,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},"setInput"),input:(0,o.K2)(function(){var t=this._input[0];return this.yytext+=t,this.yyleng++,this.offset++,this.match+=t,this.matched+=t,t.match(/(?:\r\n?|\n).*/g)?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),t},"input"),unput:(0,o.K2)(function(t){var e=t.length,i=t.split(/(?:\r\n?|\n)/g);this._input=t+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-e),this.offset-=e;var n=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),i.length-1&&(this.yylineno-=i.length-1);var s=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:i?(i.length===n.length?this.yylloc.first_column:0)+n[n.length-i.length].length-i[0].length:this.yylloc.first_column-e},this.options.ranges&&(this.yylloc.range=[s[0],s[0]+this.yyleng-e]),this.yyleng=this.yytext.length,this},"unput"),more:(0,o.K2)(function(){return this._more=!0,this},"more"),reject:(0,o.K2)(function(){return this.options.backtrack_lexer?(this._backtrack=!0,this):this.parseError("Lexical error on line "+(this.yylineno+1)+". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},"reject"),less:(0,o.K2)(function(t){this.unput(this.match.slice(t))},"less"),pastInput:(0,o.K2)(function(){var t=this.matched.substr(0,this.matched.length-this.match.length);return(t.length>20?"...":"")+t.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:(0,o.K2)(function(){var t=this.match;return t.length<20&&(t+=this._input.substr(0,20-t.length)),(t.substr(0,20)+(t.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:(0,o.K2)(function(){var t=this.pastInput(),e=Array(t.length+1).join("-");return t+this.upcomingInput()+"\n"+e+"^"},"showPosition"),test_match:(0,o.K2)(function(t,e){var i,n,s;if(this.options.backtrack_lexer&&(s={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(s.yylloc.range=this.yylloc.range.slice(0))),(n=t[0].match(/(?:\r\n?|\n).*/g))&&(this.yylineno+=n.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:n?n[n.length-1].length-n[n.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+t[0].length},this.yytext+=t[0],this.match+=t[0],this.matches=t,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(t[0].length),this.matched+=t[0],i=this.performAction.call(this,this.yy,this,e,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),i)return i;if(this._backtrack)for(var r in s)this[r]=s[r];return!1},"test_match"),next:(0,o.K2)(function(){if(this.done)return this.EOF;this._input||(this.done=!0),this._more||(this.yytext="",this.match="");for(var t,e,i,n,s=this._currentRules(),r=0;r<s.length;r++)if((i=this._input.match(this.rules[s[r]]))&&(!e||i[0].length>e[0].length)){if(e=i,n=r,this.options.backtrack_lexer){if(!1!==(t=this.test_match(i,s[r])))return t;if(!this._backtrack)return!1;e=!1;continue}if(!this.options.flex)break}return e?!1!==(t=this.test_match(e,s[n]))&&t:""===this._input?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:(0,o.K2)(function(){var t=this.next();return t||this.lex()},"lex"),begin:(0,o.K2)(function(t){this.conditionStack.push(t)},"begin"),popState:(0,o.K2)(function(){return this.conditionStack.length-1>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:(0,o.K2)(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:(0,o.K2)(function(t){return(t=this.conditionStack.length-1-Math.abs(t||0))>=0?this.conditionStack[t]:"INITIAL"},"topState"),pushState:(0,o.K2)(function(t){this.begin(t)},"pushState"),stateStackSize:(0,o.K2)(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:(0,o.K2)(function(t,e,i,n){switch(i){case 0:return this.begin("open_directive"),"open_directive";case 1:return this.begin("acc_title"),31;case 2:return this.popState(),"acc_title_value";case 3:return this.begin("acc_descr"),33;case 4:return this.popState(),"acc_descr_value";case 5:this.begin("acc_descr_multiline");break;case 6:case 15:case 18:case 21:case 24:this.popState();break;case 7:return"acc_descr_multiline_value";case 8:case 9:case 10:case 12:case 13:break;case 11:return 10;case 14:this.begin("href");break;case 16:return 43;case 17:this.begin("callbackname");break;case 19:this.popState(),this.begin("callbackargs");break;case 20:return 41;case 22:return 42;case 23:this.begin("click");break;case 25:return 40;case 26:return 4;case 27:return 22;case 28:return 23;case 29:return 24;case 30:return 25;case 31:return 26;case 32:return 28;case 33:return 27;case 34:return 29;case 35:return 12;case 36:return 13;case 37:return 14;case 38:return 15;case 39:return 16;case 40:return 17;case 41:return 18;case 42:return 20;case 43:return 21;case 44:return"date";case 45:return 30;case 46:return"accDescription";case 47:return 36;case 48:return 38;case 49:return 39;case 50:return":";case 51:return 6;case 52:return"INVALID"}},"anonymous"),rules:[/^(?:%%\{)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:%%(?!\{)*[^\n]*)/i,/^(?:[^\}]%%*[^\n]*)/i,/^(?:%%*[^\n]*[\n]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:%[^\n]*)/i,/^(?:href[\s]+["])/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:call[\s]+)/i,/^(?:\([\s]*\))/i,/^(?:\()/i,/^(?:[^(]*)/i,/^(?:\))/i,/^(?:[^)]*)/i,/^(?:click[\s]+)/i,/^(?:[\s\n])/i,/^(?:[^\s\n]*)/i,/^(?:gantt\b)/i,/^(?:dateFormat\s[^#\n;]+)/i,/^(?:inclusiveEndDates\b)/i,/^(?:topAxis\b)/i,/^(?:axisFormat\s[^#\n;]+)/i,/^(?:tickInterval\s[^#\n;]+)/i,/^(?:includes\s[^#\n;]+)/i,/^(?:excludes\s[^#\n;]+)/i,/^(?:todayMarker\s[^\n;]+)/i,/^(?:weekday\s+monday\b)/i,/^(?:weekday\s+tuesday\b)/i,/^(?:weekday\s+wednesday\b)/i,/^(?:weekday\s+thursday\b)/i,/^(?:weekday\s+friday\b)/i,/^(?:weekday\s+saturday\b)/i,/^(?:weekday\s+sunday\b)/i,/^(?:weekend\s+friday\b)/i,/^(?:weekend\s+saturday\b)/i,/^(?:\d\d\d\d-\d\d-\d\d\b)/i,/^(?:title\s[^\n]+)/i,/^(?:accDescription\s[^#\n;]+)/i,/^(?:section\s[^\n]+)/i,/^(?:[^:\n]+)/i,/^(?::[^#\n;]+)/i,/^(?::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{acc_descr_multiline:{rules:[6,7],inclusive:!1},acc_descr:{rules:[4],inclusive:!1},acc_title:{rules:[2],inclusive:!1},callbackargs:{rules:[21,22],inclusive:!1},callbackname:{rules:[18,19,20],inclusive:!1},href:{rules:[15,16],inclusive:!1},click:{rules:[24,25],inclusive:!1},INITIAL:{rules:[0,1,3,5,8,9,10,11,12,13,14,17,23,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52],inclusive:!0}}},(0,o.K2)(K,"Parser"),K.prototype=C,C.Parser=K,new K}();y.parser=y,l.extend(d),l.extend(u),l.extend(h);var k={friday:5,saturday:6},m="",p="",g=void 0,b="",T=[],x=[],v=new Map,w=[],_=[],D="",$="",C=["active","done","crit","milestone"],K=[],S=!1,E=!1,M="sunday",A="saturday",Y=0,L=(0,o.K2)(function(){w=[],_=[],D="",K=[],th=0,n=void 0,s=void 0,tm=[],m="",p="",$="",g=void 0,b="",T=[],x=[],S=!1,E=!1,Y=0,v=new Map,(0,o.IU)(),M="sunday",A="saturday"},"clear"),I=(0,o.K2)(function(t){p=t},"setAxisFormat"),W=(0,o.K2)(function(){return p},"getAxisFormat"),F=(0,o.K2)(function(t){g=t},"setTickInterval"),O=(0,o.K2)(function(){return g},"getTickInterval"),P=(0,o.K2)(function(t){b=t},"setTodayMarker"),B=(0,o.K2)(function(){return b},"getTodayMarker"),z=(0,o.K2)(function(t){m=t},"setDateFormat"),N=(0,o.K2)(function(){S=!0},"enableInclusiveEndDates"),G=(0,o.K2)(function(){return S},"endDatesAreInclusive"),H=(0,o.K2)(function(){E=!0},"enableTopAxis"),R=(0,o.K2)(function(){return E},"topAxisEnabled"),j=(0,o.K2)(function(t){$=t},"setDisplayMode"),U=(0,o.K2)(function(){return $},"getDisplayMode"),V=(0,o.K2)(function(){return m},"getDateFormat"),Z=(0,o.K2)(function(t){T=t.toLowerCase().split(/[\s,]+/)},"setIncludes"),X=(0,o.K2)(function(){return T},"getIncludes"),q=(0,o.K2)(function(t){x=t.toLowerCase().split(/[\s,]+/)},"setExcludes"),Q=(0,o.K2)(function(){return x},"getExcludes"),J=(0,o.K2)(function(){return v},"getLinks"),tt=(0,o.K2)(function(t){D=t,w.push(t)},"addSection"),te=(0,o.K2)(function(){return w},"getSections"),ti=(0,o.K2)(function(){let t=tx(),e=0;for(;!t&&e<10;)t=tx(),e++;return _=tm},"getTasks"),tn=(0,o.K2)(function(t,e,i,n){return!n.includes(t.format(e.trim()))&&(!!(i.includes("weekends")&&(t.isoWeekday()===k[A]||t.isoWeekday()===k[A]+1)||i.includes(t.format("dddd").toLowerCase()))||i.includes(t.format(e.trim())))},"isInvalidDate"),ts=(0,o.K2)(function(t){M=t},"setWeekday"),tr=(0,o.K2)(function(){return M},"getWeekday"),ta=(0,o.K2)(function(t){A=t},"setWeekend"),to=(0,o.K2)(function(t,e,i,n){let s,r;if(!i.length||t.manualEndTime)return;let[a,o]=tc(s=(s=t.startTime instanceof Date?l(t.startTime):l(t.startTime,e,!0)).add(1,"d"),t.endTime instanceof Date?l(t.endTime):l(t.endTime,e,!0),e,i,n);t.endTime=a.toDate(),t.renderEndTime=o},"checkTaskDates"),tc=(0,o.K2)(function(t,e,i,n,s){let r=!1,a=null;for(;t<=e;)r||(a=e.toDate()),(r=tn(t,i,n,s))&&(e=e.add(1,"d")),t=t.add(1,"d");return[e,a]},"fixTaskDates"),tl=(0,o.K2)(function(t,e,i){i=i.trim();let n=/^after\s+(?<ids>[\d\w- ]+)/.exec(i);if(null!==n){let t=null;for(let e of n.groups.ids.split(" ")){let i=tb(e);void 0!==i&&(!t||i.endTime>t.endTime)&&(t=i)}if(t)return t.endTime;let e=new Date;return e.setHours(0,0,0,0),e}let s=l(i,e.trim(),!0);if(s.isValid())return s.toDate();{o.Rm.debug("Invalid date:"+i),o.Rm.debug("With date format:"+e.trim());let t=new Date(i);if(void 0===t||isNaN(t.getTime())||-1e4>t.getFullYear()||t.getFullYear()>1e4)throw Error("Invalid date:"+i);return t}},"getStartDate"),td=(0,o.K2)(function(t){let e=/^(\d+(?:\.\d+)?)([Mdhmswy]|ms)$/.exec(t.trim());return null!==e?[Number.parseFloat(e[1]),e[2]]:[NaN,"ms"]},"parseDuration"),tu=(0,o.K2)(function(t,e,i,n=!1){i=i.trim();let s=/^until\s+(?<ids>[\d\w- ]+)/.exec(i);if(null!==s){let t=null;for(let e of s.groups.ids.split(" ")){let i=tb(e);void 0!==i&&(!t||i.startTime<t.startTime)&&(t=i)}if(t)return t.startTime;let e=new Date;return e.setHours(0,0,0,0),e}let r=l(i,e.trim(),!0);if(r.isValid())return n&&(r=r.add(1,"d")),r.toDate();let a=l(t),[o,c]=td(i);if(!Number.isNaN(o)){let t=a.add(o,c);t.isValid()&&(a=t)}return a.toDate()},"getEndDate"),th=0,tf=(0,o.K2)(function(t){return void 0===t?"task"+(th+=1):t},"parseId"),ty=(0,o.K2)(function(t,e){let i;let n=(":"===e.substr(0,1)?e.substr(1,e.length):e).split(","),s={};tS(n,s,C);for(let t=0;t<n.length;t++)n[t]=n[t].trim();let r="";switch(n.length){case 1:s.id=tf(),s.startTime=t.endTime,r=n[0];break;case 2:s.id=tf(),s.startTime=tl(void 0,m,n[0]),r=n[1];break;case 3:s.id=tf(n[0]),s.startTime=tl(void 0,m,n[1]),r=n[2]}return r&&(s.endTime=tu(s.startTime,m,r,S),s.manualEndTime=l(r,"YYYY-MM-DD",!0).isValid(),to(s,m,x,T)),s},"compileData"),tk=(0,o.K2)(function(t,e){let i;let n=(":"===e.substr(0,1)?e.substr(1,e.length):e).split(","),s={};tS(n,s,C);for(let t=0;t<n.length;t++)n[t]=n[t].trim();switch(n.length){case 1:s.id=tf(),s.startTime={type:"prevTaskEnd",id:t},s.endTime={data:n[0]};break;case 2:s.id=tf(),s.startTime={type:"getStartDate",startData:n[0]},s.endTime={data:n[1]};break;case 3:s.id=tf(n[0]),s.startTime={type:"getStartDate",startData:n[1]},s.endTime={data:n[2]}}return s},"parseData"),tm=[],tp={},tg=(0,o.K2)(function(t,e){let i={section:D,type:D,processed:!1,manualEndTime:!1,renderEndTime:null,raw:{data:e},task:t,classes:[]},n=tk(s,e);i.raw.startTime=n.startTime,i.raw.endTime=n.endTime,i.id=n.id,i.prevTaskId=s,i.active=n.active,i.done=n.done,i.crit=n.crit,i.milestone=n.milestone,i.order=Y,Y++;let r=tm.push(i);s=i.id,tp[i.id]=r-1},"addTask"),tb=(0,o.K2)(function(t){return tm[tp[t]]},"findTaskById"),tT=(0,o.K2)(function(t,e){let i={section:D,type:D,description:t,task:t,classes:[]},s=ty(n,e);i.startTime=s.startTime,i.endTime=s.endTime,i.id=s.id,i.active=s.active,i.done=s.done,i.crit=s.crit,i.milestone=s.milestone,n=i,_.push(i)},"addTaskOrg"),tx=(0,o.K2)(function(){let t=(0,o.K2)(function(t){let e=tm[t],i="";switch(tm[t].raw.startTime.type){case"prevTaskEnd":{let t=tb(e.prevTaskId);e.startTime=t.endTime;break}case"getStartDate":(i=tl(void 0,m,tm[t].raw.startTime.startData))&&(tm[t].startTime=i)}return tm[t].startTime&&(tm[t].endTime=tu(tm[t].startTime,m,tm[t].raw.endTime.data,S),tm[t].endTime&&(tm[t].processed=!0,tm[t].manualEndTime=l(tm[t].raw.endTime.data,"YYYY-MM-DD",!0).isValid(),to(tm[t],m,x,T))),tm[t].processed},"compileTask"),e=!0;for(let[i,n]of tm.entries())t(i),e=e&&n.processed;return e},"compileTasks"),tv=(0,o.K2)(function(t,e){let i=e;"loose"!==(0,o.D7)().securityLevel&&(i=(0,c.J)(e)),t.split(",").forEach(function(t){void 0!==tb(t)&&(tD(t,()=>{window.open(i,"_self")}),v.set(t,i))}),tw(t,"clickable")},"setLink"),tw=(0,o.K2)(function(t,e){t.split(",").forEach(function(t){let i=tb(t);void 0!==i&&i.classes.push(e)})},"setClass"),t_=(0,o.K2)(function(t,e,i){if("loose"!==(0,o.D7)().securityLevel||void 0===e)return;let n=[];if("string"==typeof i){n=i.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);for(let t=0;t<n.length;t++){let e=n[t].trim();e.startsWith('"')&&e.endsWith('"')&&(e=e.substr(1,e.length-2)),n[t]=e}}0===n.length&&n.push(t),void 0!==tb(t)&&tD(t,()=>{a._K.runFunc(e,...n)})},"setClickFun"),tD=(0,o.K2)(function(t,e){K.push(function(){let i=document.querySelector(`[id="${t}"]`);null!==i&&i.addEventListener("click",function(){e()})},function(){let i=document.querySelector(`[id="${t}-text"]`);null!==i&&i.addEventListener("click",function(){e()})})},"pushFun"),t$=(0,o.K2)(function(t,e,i){t.split(",").forEach(function(t){t_(t,e,i)}),tw(t,"clickable")},"setClickEvent"),tC=(0,o.K2)(function(t){K.forEach(function(e){e(t)})},"bindFunctions"),tK={getConfig:(0,o.K2)(()=>(0,o.D7)().gantt,"getConfig"),clear:L,setDateFormat:z,getDateFormat:V,enableInclusiveEndDates:N,endDatesAreInclusive:G,enableTopAxis:H,topAxisEnabled:R,setAxisFormat:I,getAxisFormat:W,setTickInterval:F,getTickInterval:O,setTodayMarker:P,getTodayMarker:B,setAccTitle:o.SV,getAccTitle:o.iN,setDiagramTitle:o.ke,getDiagramTitle:o.ab,setDisplayMode:j,getDisplayMode:U,setAccDescription:o.EI,getAccDescription:o.m7,addSection:tt,getSections:te,getTasks:ti,addTask:tg,findTaskById:tb,addTaskOrg:tT,setIncludes:Z,getIncludes:X,setExcludes:q,getExcludes:Q,setClickEvent:t$,setLink:tv,getLinks:J,bindFunctions:tC,parseDuration:td,isInvalidDate:tn,setWeekday:ts,getWeekday:tr,setWeekend:ta};function tS(t,e,i){let n=!0;for(;n;)n=!1,i.forEach(function(i){let s=RegExp("^\\s*"+i+"\\s*$");t[0].match(s)&&(e[i]=!0,t.shift(1),n=!0)})}(0,o.K2)(tS,"getTaskTags");var tE=(0,o.K2)(function(){o.Rm.debug("Something is calling, setConf, remove the call")},"setConf"),tM={monday:f.ABi,tuesday:f.PGu,wednesday:f.GuW,thursday:f.Mol,friday:f.TUC,saturday:f.rGn,sunday:f.YPH},tA=(0,o.K2)((t,e)=>{let i=[...t].map(()=>-1/0),n=[...t].sort((t,e)=>t.startTime-e.startTime||t.order-e.order),s=0;for(let t of n)for(let n=0;n<i.length;n++)if(t.startTime>=i[n]){i[n]=t.endTime,t.order=n+e,n>s&&(s=n);break}return s},"getMaxIntersections"),tY={parser:y,db:tK,renderer:{setConf:tE,draw:(0,o.K2)(function(t,e,i,n){let s;let a=(0,o.D7)().gantt,c=(0,o.D7)().securityLevel;"sandbox"===c&&(s=(0,f.Ltv)("#i"+e));let d="sandbox"===c?(0,f.Ltv)(s.nodes()[0].contentDocument.body):(0,f.Ltv)("body"),u="sandbox"===c?s.nodes()[0].contentDocument:document,h=u.getElementById(e);void 0===(r=h.parentElement.offsetWidth)&&(r=1200),void 0!==a.useWidth&&(r=a.useWidth);let y=n.db.getTasks(),k=[];for(let t of y)k.push(t.type);k=C(k);let m={},p=2*a.topPadding;if("compact"===n.db.getDisplayMode()||"compact"===a.displayMode){let t={};for(let e of y)void 0===t[e.section]?t[e.section]=[e]:t[e.section].push(e);let e=0;for(let i of Object.keys(t)){let n=tA(t[i],e)+1;e+=n,p+=n*(a.barHeight+a.barGap),m[i]=n}}else for(let t of(p+=y.length*(a.barHeight+a.barGap),k))m[t]=y.filter(e=>e.type===t).length;h.setAttribute("viewBox","0 0 "+r+" "+p);let g=d.select(`[id="${e}"]`),b=(0,f.w7C)().domain([(0,f.jkA)(y,function(t){return t.startTime}),(0,f.T9B)(y,function(t){return t.endTime})]).rangeRound([0,r-a.leftPadding-a.rightPadding]);function T(t,e){let i=t.startTime,n=e.startTime,s=0;return i>n?s=1:i<n&&(s=-1),s}function x(t,e,i){let s=a.barHeight,r=s+a.barGap,o=a.topPadding,c=a.leftPadding,l=(0,f.m4Y)().domain([0,k.length]).range(["#00B9FA","#F95002"]).interpolate(f.bEH);w(r,o,c,e,i,t,n.db.getExcludes(),n.db.getIncludes()),_(c,o,e,i),v(t,r,o,c,s,l,e,i),D(r,o,c,s,l),$(c,o,e,i)}function v(t,i,s,r,c,l,d){let u=[...new Set(t.map(t=>t.order))].map(e=>t.find(t=>t.order===e));g.append("g").selectAll("rect").data(u).enter().append("rect").attr("x",0).attr("y",function(t,e){return t.order*i+s-2}).attr("width",function(){return d-a.rightPadding/2}).attr("height",i).attr("class",function(t){for(let[e,i]of k.entries())if(t.type===i)return"section section"+e%a.numberSectionStyles;return"section section0"});let h=g.append("g").selectAll("rect").data(t).enter(),y=n.db.getLinks();if(h.append("rect").attr("id",function(t){return t.id}).attr("rx",3).attr("ry",3).attr("x",function(t){return t.milestone?b(t.startTime)+r+.5*(b(t.endTime)-b(t.startTime))-.5*c:b(t.startTime)+r}).attr("y",function(t,e){return t.order*i+s}).attr("width",function(t){return t.milestone?c:b(t.renderEndTime||t.endTime)-b(t.startTime)}).attr("height",c).attr("transform-origin",function(t,e){return e=t.order,(b(t.startTime)+r+.5*(b(t.endTime)-b(t.startTime))).toString()+"px "+(e*i+s+.5*c).toString()+"px"}).attr("class",function(t){let e="";t.classes.length>0&&(e=t.classes.join(" "));let i=0;for(let[e,n]of k.entries())t.type===n&&(i=e%a.numberSectionStyles);let n="";return t.active?t.crit?n+=" activeCrit":n=" active":t.done?n=t.crit?" doneCrit":" done":t.crit&&(n+=" crit"),0===n.length&&(n=" task"),t.milestone&&(n=" milestone "+n),n+=i,"task"+(n+=" "+e)}),h.append("text").attr("id",function(t){return t.id+"-text"}).text(function(t){return t.task}).attr("font-size",a.fontSize).attr("x",function(t){let e=b(t.startTime),i=b(t.renderEndTime||t.endTime);t.milestone&&(e+=.5*(b(t.endTime)-b(t.startTime))-.5*c),t.milestone&&(i=e+c);let n=this.getBBox().width;return n>i-e?i+n+1.5*a.leftPadding>d?e+r-5:i+r+5:(i-e)/2+e+r}).attr("y",function(t,e){return t.order*i+a.barHeight/2+(a.fontSize/2-2)+s}).attr("text-height",c).attr("class",function(t){let e=b(t.startTime),i=b(t.endTime);t.milestone&&(i=e+c);let n=this.getBBox().width,s="";t.classes.length>0&&(s=t.classes.join(" "));let r=0;for(let[e,i]of k.entries())t.type===i&&(r=e%a.numberSectionStyles);let o="";return(t.active&&(o=t.crit?"activeCritText"+r:"activeText"+r),t.done?o=t.crit?o+" doneCritText"+r:o+" doneText"+r:t.crit&&(o=o+" critText"+r),t.milestone&&(o+=" milestoneText"),n>i-e)?i+n+1.5*a.leftPadding>d?s+" taskTextOutsideLeft taskTextOutside"+r+" "+o:s+" taskTextOutsideRight taskTextOutside"+r+" "+o+" width-"+n:s+" taskText taskText"+r+" "+o+" width-"+n}),"sandbox"===(0,o.D7)().securityLevel){let t=(0,f.Ltv)("#i"+e).nodes()[0].contentDocument;h.filter(function(t){return y.has(t.id)}).each(function(e){var i=t.querySelector("#"+e.id),n=t.querySelector("#"+e.id+"-text");let s=i.parentNode;var r=t.createElement("a");r.setAttribute("xlink:href",y.get(e.id)),r.setAttribute("target","_top"),s.appendChild(r),r.appendChild(i),r.appendChild(n)})}}function w(t,e,i,s,r,c,d,u){let h,f;if(0===d.length&&0===u.length)return;for(let{startTime:t,endTime:e}of c)(void 0===h||t<h)&&(h=t),(void 0===f||e>f)&&(f=e);if(!h||!f)return;if(l(f).diff(l(h),"year")>5){o.Rm.warn("The difference between the min and max time is more than 5 years. This will cause performance issues. Skipping drawing exclude days.");return}let y=n.db.getDateFormat(),k=[],m=null,p=l(h);for(;p.valueOf()<=f;)n.db.isInvalidDate(p,y,d,u)?m?m.end=p:m={start:p,end:p}:m&&(k.push(m),m=null),p=p.add(1,"d");g.append("g").selectAll("rect").data(k).enter().append("rect").attr("id",function(t){return"exclude-"+t.start.format("YYYY-MM-DD")}).attr("x",function(t){return b(t.start)+i}).attr("y",a.gridLineStartPadding).attr("width",function(t){return b(t.end.add(1,"day"))-b(t.start)}).attr("height",r-e-a.gridLineStartPadding).attr("transform-origin",function(e,n){return(b(e.start)+i+.5*(b(e.end)-b(e.start))).toString()+"px "+(n*t+.5*r).toString()+"px"}).attr("class","exclude-range")}function _(t,e,i,s){let r=(0,f.l78)(b).tickSize(-s+e+a.gridLineStartPadding).tickFormat((0,f.DCK)(n.db.getAxisFormat()||a.axisFormat||"%Y-%m-%d")),o=/^([1-9]\d*)(millisecond|second|minute|hour|day|week|month)$/.exec(n.db.getTickInterval()||a.tickInterval);if(null!==o){let t=o[1],e=o[2],i=n.db.getWeekday()||a.weekday;switch(e){case"millisecond":r.ticks(f.t6C.every(t));break;case"second":r.ticks(f.ucG.every(t));break;case"minute":r.ticks(f.wXd.every(t));break;case"hour":r.ticks(f.Agd.every(t));break;case"day":r.ticks(f.UAC.every(t));break;case"week":r.ticks(tM[i].every(t));break;case"month":r.ticks(f.Ui6.every(t))}}if(g.append("g").attr("class","grid").attr("transform","translate("+t+", "+(s-50)+")").call(r).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10).attr("dy","1em"),n.db.topAxisEnabled()||a.topAxis){let i=(0,f.tlR)(b).tickSize(-s+e+a.gridLineStartPadding).tickFormat((0,f.DCK)(n.db.getAxisFormat()||a.axisFormat||"%Y-%m-%d"));if(null!==o){let t=o[1],e=o[2],s=n.db.getWeekday()||a.weekday;switch(e){case"millisecond":i.ticks(f.t6C.every(t));break;case"second":i.ticks(f.ucG.every(t));break;case"minute":i.ticks(f.wXd.every(t));break;case"hour":i.ticks(f.Agd.every(t));break;case"day":i.ticks(f.UAC.every(t));break;case"week":i.ticks(tM[s].every(t));break;case"month":i.ticks(f.Ui6.every(t))}}g.append("g").attr("class","grid").attr("transform","translate("+t+", "+e+")").call(i).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10)}}function D(t,e){let i=0,n=Object.keys(m).map(t=>[t,m[t]]);g.append("g").selectAll("text").data(n).enter().append(function(t){let e=t[0].split(o.Y2.lineBreakRegex),i=-(e.length-1)/2,n=u.createElementNS("http://www.w3.org/2000/svg","text");for(let[t,s]of(n.setAttribute("dy",i+"em"),e.entries())){let e=u.createElementNS("http://www.w3.org/2000/svg","tspan");e.setAttribute("alignment-baseline","central"),e.setAttribute("x","10"),t>0&&e.setAttribute("dy","1em"),e.textContent=s,n.appendChild(e)}return n}).attr("x",10).attr("y",function(s,r){if(!(r>0))return s[1]*t/2+e;for(let a=0;a<r;a++)return i+=n[r-1][1],s[1]*t/2+i*t+e}).attr("font-size",a.sectionFontSize).attr("class",function(t){for(let[e,i]of k.entries())if(t[0]===i)return"sectionTitle sectionTitle"+e%a.numberSectionStyles;return"sectionTitle"})}function $(t,e,i,s){let r=n.db.getTodayMarker();if("off"===r)return;let o=g.append("g").attr("class","today"),c=new Date,l=o.append("line");l.attr("x1",b(c)+t).attr("x2",b(c)+t).attr("y1",a.titleTopMargin).attr("y2",s-a.titleTopMargin).attr("class","today"),""!==r&&l.attr("style",r.replace(/,/g,";"))}function C(t){let e={},i=[];for(let n=0,s=t.length;n<s;++n)Object.prototype.hasOwnProperty.call(e,t[n])||(e[t[n]]=!0,i.push(t[n]));return i}(0,o.K2)(T,"taskCompare"),y.sort(T),x(y,r,p),(0,o.a$)(g,p,r,a.useMaxWidth),g.append("text").text(n.db.getDiagramTitle()).attr("x",r/2).attr("y",a.titleTopMargin).attr("class","titleText"),(0,o.K2)(x,"makeGantt"),(0,o.K2)(v,"drawRects"),(0,o.K2)(w,"drawExcludeDays"),(0,o.K2)(_,"makeGrid"),(0,o.K2)(D,"vertLabels"),(0,o.K2)($,"drawToday"),(0,o.K2)(C,"checkUnique")},"draw")},styles:(0,o.K2)(t=>`
  .mermaid-main-font {
        font-family: ${t.fontFamily};
  }

  .exclude-range {
    fill: ${t.excludeBkgColor};
  }

  .section {
    stroke: none;
    opacity: 0.2;
  }

  .section0 {
    fill: ${t.sectionBkgColor};
  }

  .section2 {
    fill: ${t.sectionBkgColor2};
  }

  .section1,
  .section3 {
    fill: ${t.altSectionBkgColor};
    opacity: 0.2;
  }

  .sectionTitle0 {
    fill: ${t.titleColor};
  }

  .sectionTitle1 {
    fill: ${t.titleColor};
  }

  .sectionTitle2 {
    fill: ${t.titleColor};
  }

  .sectionTitle3 {
    fill: ${t.titleColor};
  }

  .sectionTitle {
    text-anchor: start;
    font-family: ${t.fontFamily};
  }


  /* Grid and axis */

  .grid .tick {
    stroke: ${t.gridColor};
    opacity: 0.8;
    shape-rendering: crispEdges;
  }

  .grid .tick text {
    font-family: ${t.fontFamily};
    fill: ${t.textColor};
  }

  .grid path {
    stroke-width: 0;
  }


  /* Today line */

  .today {
    fill: none;
    stroke: ${t.todayLineColor};
    stroke-width: 2px;
  }


  /* Task styling */

  /* Default task */

  .task {
    stroke-width: 2;
  }

  .taskText {
    text-anchor: middle;
    font-family: ${t.fontFamily};
  }

  .taskTextOutsideRight {
    fill: ${t.taskTextDarkColor};
    text-anchor: start;
    font-family: ${t.fontFamily};
  }

  .taskTextOutsideLeft {
    fill: ${t.taskTextDarkColor};
    text-anchor: end;
  }


  /* Special case clickable */

  .task.clickable {
    cursor: pointer;
  }

  .taskText.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideLeft.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideRight.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }


  /* Specific task settings for the sections*/

  .taskText0,
  .taskText1,
  .taskText2,
  .taskText3 {
    fill: ${t.taskTextColor};
  }

  .task0,
  .task1,
  .task2,
  .task3 {
    fill: ${t.taskBkgColor};
    stroke: ${t.taskBorderColor};
  }

  .taskTextOutside0,
  .taskTextOutside2
  {
    fill: ${t.taskTextOutsideColor};
  }

  .taskTextOutside1,
  .taskTextOutside3 {
    fill: ${t.taskTextOutsideColor};
  }


  /* Active task */

  .active0,
  .active1,
  .active2,
  .active3 {
    fill: ${t.activeTaskBkgColor};
    stroke: ${t.activeTaskBorderColor};
  }

  .activeText0,
  .activeText1,
  .activeText2,
  .activeText3 {
    fill: ${t.taskTextDarkColor} !important;
  }


  /* Completed task */

  .done0,
  .done1,
  .done2,
  .done3 {
    stroke: ${t.doneTaskBorderColor};
    fill: ${t.doneTaskBkgColor};
    stroke-width: 2;
  }

  .doneText0,
  .doneText1,
  .doneText2,
  .doneText3 {
    fill: ${t.taskTextDarkColor} !important;
  }


  /* Tasks on the critical line */

  .crit0,
  .crit1,
  .crit2,
  .crit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.critBkgColor};
    stroke-width: 2;
  }

  .activeCrit0,
  .activeCrit1,
  .activeCrit2,
  .activeCrit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.activeTaskBkgColor};
    stroke-width: 2;
  }

  .doneCrit0,
  .doneCrit1,
  .doneCrit2,
  .doneCrit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.doneTaskBkgColor};
    stroke-width: 2;
    cursor: pointer;
    shape-rendering: crispEdges;
  }

  .milestone {
    transform: rotate(45deg) scale(0.8,0.8);
  }

  .milestoneText {
    font-style: italic;
  }
  .doneCritText0,
  .doneCritText1,
  .doneCritText2,
  .doneCritText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  .activeCritText0,
  .activeCritText1,
  .activeCritText2,
  .activeCritText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  .titleText {
    text-anchor: middle;
    font-size: 18px;
    fill: ${t.titleColor||t.textColor};
    font-family: ${t.fontFamily};
  }
`,"getStyles")}},99124:function(t){var e,i,n,s,r,a,o,c,l,d,u,h,f;e={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},i=/(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g,n=/\d/,s=/\d\d/,r=/\d\d?/,a=/\d*[^-_:/,()\s\d]+/,o={},c=function(t){return(t*=1)+(t>68?1900:2e3)},l=function(t){return function(e){this[t]=+e}},d=[/[+-]\d\d:?(\d\d)?|Z/,function(t){(this.zone||(this.zone={})).offset=function(t){if(!t||"Z"===t)return 0;var e=t.match(/([+-]|\d\d)/g),i=60*e[1]+(+e[2]||0);return 0===i?0:"+"===e[0]?-i:i}(t)}],u=function(t){var e=o[t];return e&&(e.indexOf?e:e.s.concat(e.f))},h=function(t,e){var i,n=o.meridiem;if(n){for(var s=1;s<=24;s+=1)if(t.indexOf(n(s,0,e))>-1){i=s>12;break}}else i=t===(e?"pm":"PM");return i},f={A:[a,function(t){this.afternoon=h(t,!1)}],a:[a,function(t){this.afternoon=h(t,!0)}],Q:[n,function(t){this.month=3*(t-1)+1}],S:[n,function(t){this.milliseconds=100*+t}],SS:[s,function(t){this.milliseconds=10*+t}],SSS:[/\d{3}/,function(t){this.milliseconds=+t}],s:[r,l("seconds")],ss:[r,l("seconds")],m:[r,l("minutes")],mm:[r,l("minutes")],H:[r,l("hours")],h:[r,l("hours")],HH:[r,l("hours")],hh:[r,l("hours")],D:[r,l("day")],DD:[s,l("day")],Do:[a,function(t){var e=o.ordinal,i=t.match(/\d+/);if(this.day=i[0],e)for(var n=1;n<=31;n+=1)e(n).replace(/\[|\]/g,"")===t&&(this.day=n)}],w:[r,l("week")],ww:[s,l("week")],M:[r,l("month")],MM:[s,l("month")],MMM:[a,function(t){var e=u("months"),i=(u("monthsShort")||e.map(function(t){return t.slice(0,3)})).indexOf(t)+1;if(i<1)throw Error();this.month=i%12||i}],MMMM:[a,function(t){var e=u("months").indexOf(t)+1;if(e<1)throw Error();this.month=e%12||e}],Y:[/[+-]?\d+/,l("year")],YY:[s,function(t){this.year=c(t)}],YYYY:[/\d{4}/,l("year")],Z:d,ZZ:d},t.exports=function(t,n,s){s.p.customParseFormat=!0,t&&t.parseTwoDigitYear&&(c=t.parseTwoDigitYear);var r=n.prototype,a=r.parse;r.parse=function(t){var n=t.date,r=t.utc,c=t.args;this.$u=r;var l=c[1];if("string"==typeof l){var d=!0===c[2],u=!0===c[3],h=c[2];u&&(h=c[2]),o=this.$locale(),!d&&h&&(o=s.Ls[h]),this.$d=function(t,n,s,r){try{if(["x","X"].indexOf(n)>-1)return new Date(("X"===n?1e3:1)*t);var a=(function(t){var n,s;n=t,s=o&&o.formats;for(var r=(t=n.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g,function(t,i,n){var r=n&&n.toUpperCase();return i||s[n]||e[n]||s[r].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,function(t,e,i){return e||i.slice(1)})})).match(i),a=r.length,c=0;c<a;c+=1){var l=r[c],d=f[l],u=d&&d[0],h=d&&d[1];r[c]=h?{regex:u,parser:h}:l.replace(/^\[|\]$/g,"")}return function(t){for(var e={},i=0,n=0;i<a;i+=1){var s=r[i];if("string"==typeof s)n+=s.length;else{var o=s.regex,c=s.parser,l=t.slice(n),d=o.exec(l)[0];c.call(e,d),t=t.replace(d,"")}}return function(t){var e=t.afternoon;if(void 0!==e){var i=t.hours;e?i<12&&(t.hours+=12):12===i&&(t.hours=0),delete t.afternoon}}(e),e}})(n)(t),c=a.year,l=a.month,d=a.day,u=a.hours,h=a.minutes,y=a.seconds,k=a.milliseconds,m=a.zone,p=a.week,g=new Date,b=d||(c||l?1:g.getDate()),T=c||g.getFullYear(),x=0;c&&!l||(x=l>0?l-1:g.getMonth());var v,w=u||0,_=h||0,D=y||0,$=k||0;return m?new Date(Date.UTC(T,x,b,w,_,D,$+60*m.offset*1e3)):s?new Date(Date.UTC(T,x,b,w,_,D,$)):(v=new Date(T,x,b,w,_,D,$),p&&(v=r(v).week(p).toDate()),v)}catch(t){return new Date("")}}(n,l,r,s),this.init(),h&&!0!==h&&(this.$L=this.locale(h).$L),(d||u)&&n!=this.format(l)&&(this.$d=new Date("")),o={}}else if(l instanceof Array)for(var y=l.length,k=1;k<=y;k+=1){c[1]=l[k-1];var m=s.apply(this,c);if(m.isValid()){this.$d=m.$d,this.$L=m.$L,this.init();break}k===y&&(this.$d=new Date(""))}else a.call(this,t)}}}}]);