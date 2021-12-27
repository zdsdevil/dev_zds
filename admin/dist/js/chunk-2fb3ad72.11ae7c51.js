(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2fb3ad72"],{1348:function(e,s,t){"use strict";t.r(s);var r=function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("div",{staticClass:"main user-layout-register"},[t("h3",[t("span",[e._v(e._s(e.$t("user.register.register")))])]),t("a-form",{ref:"formRegister",attrs:{form:e.form,id:"formRegister"}},[t("a-form-item",[t("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["username",{rules:[{required:!0,message:e.$t("user.username.required")}],validateTrigger:["change","blur"]}],expression:"['username', {rules: [{ required: true, message: $t('user.username.required') }], validateTrigger: ['change', 'blur']}]"}],attrs:{size:"large",type:"text",placeholder:e.$t("user.register.username.placeholder")}})],1),t("a-popover",{attrs:{placement:"rightTop",trigger:["focus"],getPopupContainer:function(e){return e.parentElement}},model:{value:e.state.passwordLevelChecked,callback:function(s){e.$set(e.state,"passwordLevelChecked",s)},expression:"state.passwordLevelChecked"}},[t("template",{slot:"content"},[t("div",{style:{width:"240px"}},[t("div",{class:["user-register",e.passwordLevelClass]},[e._v(e._s(e.$t(e.passwordLevelName)))]),t("a-progress",{attrs:{percent:e.state.percent,showInfo:!1,strokeColor:e.passwordLevelColor}}),t("div",{staticStyle:{"margin-top":"10px"}},[t("span",[e._v(e._s(e.$t("user.register.password.popover-message"))+" ")])])],1)]),t("a-form-item",[t("a-input-password",{directives:[{name:"decorator",rawName:"v-decorator",value:["password",{rules:[{required:!0,message:e.$t("user.password.required")},{validator:this.handlePasswordLevel}],validateTrigger:["change","blur"]}],expression:"['password', {rules: [{ required: true, message: $t('user.password.required') }, { validator: this.handlePasswordLevel }], validateTrigger: ['change', 'blur']}]"}],attrs:{size:"large",placeholder:e.$t("user.register.password.placeholder")},on:{click:e.handlePasswordInputClick}})],1)],2),t("a-form-item",[t("a-input-password",{directives:[{name:"decorator",rawName:"v-decorator",value:["password2",{rules:[{required:!0,message:e.$t("user.password.required")},{validator:this.handlePasswordCheck}],validateTrigger:["change","blur"]}],expression:"['password2', {rules: [{ required: true, message: $t('user.password.required') }, { validator: this.handlePasswordCheck }], validateTrigger: ['change', 'blur']}]"}],attrs:{size:"large",placeholder:e.$t("user.register.confirm-password.placeholder")}})],1),t("a-form-item",[t("a-button",{staticClass:"register-button",attrs:{size:"large",type:"primary",htmlType:"submit",loading:e.registerBtn,disabled:e.registerBtn},on:{click:function(s){return s.stopPropagation(),s.preventDefault(),e.handleSubmit.apply(null,arguments)}}},[e._v(e._s(e.$t("user.register.register"))+" ")]),t("router-link",{staticClass:"login",attrs:{to:{name:"login"}}},[e._v(e._s(e.$t("user.register.sign-in")))])],1)],1)],1)},a=[],i=t("5530"),o=(t("498a"),t("4795"),t("7ded")),n=t("705f"),l=t("ca00"),d={0:"user.password.strength.short",1:"user.password.strength.low",2:"user.password.strength.medium",3:"user.password.strength.strong"},u={0:"error",1:"error",2:"warning",3:"success"},c={0:"#ff0000",1:"#ff0000",2:"#ff7e05",3:"#52c41a"},p={name:"Register",components:{},mixins:[n["a"]],data:function(){return{form:this.$form.createForm(this),state:{time:60,level:0,smsSendBtn:!1,passwordLevel:0,passwordLevelChecked:!1,percent:10,progressColor:"#FF0000"},registerBtn:!1}},computed:{passwordLevelClass:function(){return u[this.state.passwordLevel]},passwordLevelName:function(){return d[this.state.passwordLevel]},passwordLevelColor:function(){return c[this.state.passwordLevel]}},methods:{handlePasswordLevel:function(e,s,t){if(""===s)return t();s.length>=6?(Object(l["a"])(s)>=30&&(this.state.level=1),Object(l["a"])(s)>=60&&(this.state.level=2),Object(l["a"])(s)>=80&&(this.state.level=3)):(this.state.level=0,t(new Error(this.$t("user.password.strength.msg")))),this.state.passwordLevel=this.state.level,this.state.percent=33*this.state.level,t()},handlePasswordCheck:function(e,s,t){var r=this.form.getFieldValue("password");void 0===s&&t(new Error(this.$t("user.password.required"))),s&&r&&s.trim()!==r.trim()&&t(new Error(this.$t("user.password.twice.msg"))),t()},handlePhoneCheck:function(e,s,t){t()},handlePasswordInputClick:function(){this.isMobile?this.state.passwordLevelChecked=!1:this.state.passwordLevelChecked=!0},handleSubmit:function(){var e=this.form.validateFields,s=this.state,t=this.$router;e({force:!0},(function(e,r){e||Object(o["g"])(Object(i["a"])({},r)).then((function(e){s.passwordLevelChecked=!1,t.push({name:"registerResult",params:Object(i["a"])({},r)})}))["catch"]((function(e){s.passwordLevelChecked=!1}))}))},getCaptcha:function(e){var s=this;e.preventDefault();var t=this.form.validateFields,r=this.state,a=this.$message,i=this.$notification;t(["mobile"],{force:!0},(function(e,t){if(!e){r.smsSendBtn=!0;var n=window.setInterval((function(){r.time--<=0&&(r.time=60,r.smsSendBtn=!1,window.clearInterval(n))}),1e3),l=a.loading("验证码发送中..",0);Object(o["d"])({mobile:t.mobile}).then((function(e){setTimeout(l,2500),i["success"]({message:"提示",description:"验证码获取成功，您的验证码为："+e.result.captcha,duration:8})}))["catch"]((function(e){setTimeout(l,1),clearInterval(n),r.time=60,r.smsSendBtn=!1,s.requestFailed(e)}))}}))},requestFailed:function(e){this.$notification["error"]({message:"错误",description:((e.response||{}).data||{}).message||"请求出现错误，请稍后再试",duration:4}),this.registerBtn=!1}},watch:{"state.passwordLevel":function(e){}}},h=p,m=(t("5d18"),t("5c63"),t("2877")),g=Object(m["a"])(h,r,a,!1,null,"5d9d1af9",null);s["default"]=g.exports},"5c63":function(e,s,t){"use strict";t("e6e5")},"5d18":function(e,s,t){"use strict";t("eeab")},e6e5:function(e,s,t){},eeab:function(e,s,t){}}]);