(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-c022fed8","chunk-0c6d61e6"],{1897:function(t,e,a){},"1fce":function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"account-settings-info-view"},[a("a-row",{attrs:{gutter:16,type:"flex",justify:"center"}},[a("a-col",{attrs:{order:t.isMobile?2:1,md:24,lg:16}},[a("a-form",{attrs:{form:t.form,layout:"vertical"}},[a("a-form-item",{attrs:{label:"账号名"}},[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["username",{initialValue:t.userInfo.username}],expression:"['username', {initialValue: userInfo.username}]"}],attrs:{disabled:""}})],1),a("a-form-item",{attrs:{label:"昵称"}},[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["nickname",{initialValue:t.userInfo.nickname}],expression:"['nickname', {initialValue: userInfo.nickname}]"}],attrs:{placeholder:"请输入您的昵称！"}})],1),a("a-form-item",{attrs:{label:"个人简介"}},[a("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["resume",{initialValue:t.userInfo.resume}],expression:"['resume', {initialValue: userInfo.resume}]"}],attrs:{rows:"4",placeholder:"请输入个人简介"}})],1),a("a-form-item",{attrs:{label:"邮箱",required:!1}},[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["email",{initialValue:t.userInfo.email},{rules:[{validator:t.checkedEmail}],validateTrigger:["change","blur"]}],expression:"['email', {initialValue: userInfo.email}, {rules: [{ validator: checkedEmail }], validateTrigger: ['change','blur']}]"}],attrs:{placeholder:"example@ant.design"}})],1),a("a-form-item",[a("a-button",{staticStyle:{"margin-right":"20px"},attrs:{type:"primary"},on:{click:t.save}},[t._v("更新基本信息")]),a("a-button",{attrs:{type:"primary"},on:{click:t.goBlog}},[t._v("博客主页")])],1)],1)],1),a("a-col",{style:{minHeight:"180px"},attrs:{order:1,md:24,lg:8}},[a("div",{staticClass:"ant-upload-preview",on:{click:function(e){return t.$refs.modal.edit(1)}}},[a("a-icon",{staticClass:"upload-icon",attrs:{type:"cloud-upload-o"}}),a("div",{staticClass:"mask"},[a("a-icon",{attrs:{type:"plus"}})],1),a("img",{attrs:{src:t.option.img}})],1)])],1),a("avatar-modal",{ref:"modal",on:{ok:t.setAvatar}})],1)},o=[],r=a("5530"),n=(a("ac1f"),a("8d90")),s=a("432b"),c=a("4360"),u={mixins:[s["a"]],components:{AvatarModal:n["default"]},data:function(){return{preview:{},userInfo:{},option:{img:"/avatar2.jpg",info:!0,size:1,outputType:"jpeg",canScale:!1,autoCrop:!0,autoCropWidth:180,autoCropHeight:180,fixedBox:!0,fixed:!0,fixedNumber:[1,1]},form:this.$form.createForm(this)}},mounted:function(){this.userInfo=c["a"].getters.userInfo,this.option.img=this.userInfo.avatar},methods:{goBlog:function(){this.$router.push("/app/blogger/"+this.userInfo._id)},checkedEmail:function(t,e,a){var i=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;i.test(e)?a():a(new Error("邮箱格式不正确！"))},setAvatar:function(t){this.option.img=t},save:function(){var t=this;this.form.validateFields((function(e,a){e||c["a"].dispatch("UpdateUser",Object(r["a"])({id:t.userInfo._id,avatar:t.option.img},a)).then((function(e){t.$message.success("更新成功")}))}))}}},l=u,d=(a("d016"),a("2877")),p=Object(d["a"])(l,i,o,!1,null,"3e179c28",null);e["default"]=p.exports},"432b":function(t,e,a){"use strict";a.d(e,"a",(function(){return r}));var i=a("5530"),o=a("5880"),r={computed:Object(i["a"])(Object(i["a"])({},Object(o["mapState"])({layout:function(t){return t.app.layout},navTheme:function(t){return t.app.theme},primaryColor:function(t){return t.app.color},colorWeak:function(t){return t.app.weak},fixedHeader:function(t){return t.app.fixedHeader},fixedSidebar:function(t){return t.app.fixedSidebar},contentWidth:function(t){return t.app.contentWidth},autoHideHeader:function(t){return t.app.autoHideHeader},isMobile:function(t){return t.app.isMobile},sideCollapsed:function(t){return t.app.sideCollapsed},multiTab:function(t){return t.app.multiTab}})),{},{isTopMenu:function(){return"topmenu"===this.layout}}),methods:{isSideMenu:function(){return!this.isTopMenu}}}},6463:function(t,e,a){"use strict";a("1897")},"78d2":function(t,e,a){"use strict";a.d(e,"a",(function(){return i}));var i="http://121.40.119.210:7001/public"},"8d90":function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("a-modal",{attrs:{title:"修改头像",visible:t.visible,maskClosable:!1,confirmLoading:t.confirmLoading,width:800,footer:null},on:{cancel:t.cancelHandel}},[a("a-row",[a("a-col",{style:{height:"350px"},attrs:{xs:24,md:12}},[a("vue-cropper",{ref:"cropper",attrs:{img:t.options.img,info:!0,autoCrop:t.options.autoCrop,autoCropWidth:t.options.autoCropWidth,autoCropHeight:t.options.autoCropHeight,fixedBox:t.options.fixedBox},on:{realTime:t.realTime}})],1),a("a-col",{style:{height:"350px"},attrs:{xs:24,md:12}},[a("div",{staticClass:"avatar-upload-preview"},[a("img",{style:t.previews.img,attrs:{src:t.previews.url}})])])],1),a("br"),a("a-row",[a("a-col",{attrs:{lg:2,md:2}},[a("a-upload",{attrs:{name:"file",beforeUpload:t.beforeUpload,showUploadList:!1}},[a("a-button",{attrs:{icon:"upload"}},[t._v("选择图片")])],1)],1),a("a-col",{attrs:{lg:{span:1,offset:2},md:2}},[a("a-button",{attrs:{icon:"plus"},on:{click:function(e){return t.changeScale(1)}}})],1),a("a-col",{attrs:{lg:{span:1,offset:1},md:2}},[a("a-button",{attrs:{icon:"minus"},on:{click:function(e){return t.changeScale(-1)}}})],1),a("a-col",{attrs:{lg:{span:1,offset:1},md:2}},[a("a-button",{attrs:{icon:"undo"},on:{click:t.rotateLeft}})],1),a("a-col",{attrs:{lg:{span:1,offset:1},md:2}},[a("a-button",{attrs:{icon:"redo"},on:{click:t.rotateRight}})],1),a("a-col",{attrs:{lg:{span:2,offset:6},md:2}},[a("a-button",{attrs:{type:"primary"},on:{click:function(e){return t.finish("blob")}}},[t._v("保存")])],1)],1)],1)},o=[],r=(a("b0c0"),a("d3b7"),a("3ca3"),a("ddb0"),a("2b3d"),a("9861"),a("4795"),a("91b6")),n=a("78d2"),s={data:function(){return{visible:!1,id:null,confirmLoading:!1,fileList:[],uploading:!1,options:{img:"",autoCrop:!0,autoCropWidth:200,autoCropHeight:200,fixedBox:!0},previews:{},fileName:""}},methods:{edit:function(t){this.visible=!0,this.id=t},close:function(){this.id=null,this.visible=!1},cancelHandel:function(){this.close()},changeScale:function(t){t=t||1,this.$refs.cropper.changeScale(t)},rotateLeft:function(){this.$refs.cropper.rotateLeft()},rotateRight:function(){this.$refs.cropper.rotateRight()},beforeUpload:function(t){var e=this;this.fileName=t.name;var a=new FileReader;return a.readAsDataURL(t),a.onload=function(){e.options.img=a.result},!1},finish:function(t){var e=this,a=this,i=new FormData;"blob"===t?a.$refs.cropper.getCropBlob((function(t){var e=window.URL.createObjectURL(t);a.model=!0,a.modelSrc=e,i.append("file",t,a.fileName),Object(r["b"])(i,{contentType:!1,processData:!1,headers:{"Content-Type":"application/x-www-form-urlencoded"}}).then((function(t){var e=n["a"]+t.result.url;a.$message.success("上传成功"),a.$emit("ok",e),a.visible=!1}))})):this.$refs.cropper.getCropData((function(t){e.model=!0,e.modelSrc=t}))},okHandel:function(){var t=this;t.confirmLoading=!0,setTimeout((function(){t.confirmLoading=!1,t.close(),t.$message.success("上传头像成功")}),2e3)},realTime:function(t){this.previews=t}}},c=s,u=(a("6463"),a("2877")),l=Object(u["a"])(c,i,o,!1,null,"04bd06aa",null);e["default"]=l.exports},"91b6":function(t,e,a){"use strict";a.d(e,"b",(function(){return o})),a.d(e,"a",(function(){return r}));var i=a("b775");function o(t){return Object(i["b"])({url:"/api/upload",method:"post",data:t})}function r(t){return Object(i["b"])({url:"/api/uploads",method:"post",data:t})}},cfe7:function(t,e,a){},d016:function(t,e,a){"use strict";a("cfe7")}}]);