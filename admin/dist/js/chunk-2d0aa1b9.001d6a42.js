(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0aa1b9"],{1037:function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("a-result",{attrs:{isSuccess:!0,content:!1,title:t.email,"sub-title":t.description},scopedSlots:t._u([{key:"extra",fn:function(){return[n("a-button",{staticStyle:{"margin-left":"8px"},attrs:{size:"large"},on:{click:t.goHomeHandle}},[t._v("返回首页")])]},proxy:!0}])})},s=[],o=n("5530"),r=(n("4795"),n("5880")),c={name:"RegisterResult",data:function(){return{description:"",form:{}}},computed:{email:function(){var t=this.form&&this.form.username||"xxx";return"你的账户：".concat(t," 注册成功")}},created:function(){this.form=this.$route.params},methods:Object(o["a"])(Object(o["a"])({},Object(r["mapActions"])(["Login"])),{},{loginSuccess:function(t){var e=this;this.$router.push({path:"/"}),setTimeout((function(){e.$notification.success({message:"欢迎",description:"".concat(timeFix(),"，欢迎回来")})}),1e3)},requestFailed:function(t){this.$notification["error"]({message:"错误",description:((t.response||{}).data||{}).message||t||"请求出现错误，请稍后再试",duration:4})},goHomeHandle:function(){var t=this;this.Login(this.form).then((function(e){return t.loginSuccess(e)}))["catch"]((function(e){return t.requestFailed(e)}))}})},a=c,u=n("2877"),l=Object(u["a"])(a,i,s,!1,null,"7460b226",null);e["default"]=l.exports}}]);