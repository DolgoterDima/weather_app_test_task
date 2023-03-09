"use strict";(self["webpackChunkweather_app_test"]=self["webpackChunkweather_app_test"]||[]).push([[752],{4752:function(t,e,s){s.r(e),s.d(e,{default:function(){return p}});var i=function(){var t=this,e=t._self._c;return e("div",{staticClass:"home"},[e("div",{staticClass:"days-list"},[t.loadingMessage?e("LoadingComponent",{attrs:{message:t.loadingMessage}}):t._e(),t._l(t.daysList,(function(s){return e("DayCard",{key:s.id,staticClass:"days-list__item",attrs:{city:s.city,id:s.id},on:{remove:t.removeDay,addToFavorite:t.addDayToFavorite}})})),t.isShowAddNewDay?e("button",{staticClass:"days-list__add",on:{click:t.addNewDay}},[e("font-awesome-icon",{attrs:{icon:"plus",size:"xl"}})],1):t._e()],2)])},a=[],o=(s(7658),s(2897)),n=s(3259),r=s(3494),d=s(8539),l=s(7749);r.vI.add(d.r8p);const c=5;var y={name:"HomeView",data(){return{daysList:[],usersCity:"222",favoritesList:[],loadingMessage:""}},components:{DayCard:o.Z,FontAwesomeIcon:l.GN},computed:{isShowAddNewDay(){return this.daysList.length<c}},methods:{async getCurrentUserCity(){if(navigator.geolocation)try{this.loadingMessage="Detecting your current city";const t=await new Promise(((t,e)=>{navigator.geolocation.getCurrentPosition(t,e)})),{latitude:e,longitude:s}=t.coords,i=`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e}&lon=${s}&accept-language=en`,a=await fetch(i),o=await a.json();this.loadingMessage="",this.daysList.push({id:Date.now(),city:o.address.city})}catch(t){t.code==t.PERMISSION_DENIED?(this.loadingMessage="You disallow access to geolocation",setTimeout((()=>{this.loadingMessage="",this.addNewDay()}),3e3)):(this.loadingMessage=`${t}. Please enter city name manually`,setTimeout((()=>{this.loadingMessage=""}),5e3),console.log(`API error ${t}`),this.addNewDay())}else this.loadingMessage="Geolocation is not supported by this browser"},removeDay(t){n.N.$emit("open-popup",{text:"Do you really want to remove city? ",id:t})},addNewDay(){this.daysList.push({id:Date.now(),city:""})},addDayToFavorite({id:t,city:e}){const s=this.favoritesList.find((t=>t.city===e)),i=this.favoritesList.length>c;s||i||(this.favoritesList.push({id:t,city:e}),localStorage.setItem("favoritesList",JSON.stringify(this.favoritesList)),n.N.$emit("added-to-favorites",t)),i&&n.N.$emit("open-popup",{text:"You can`t add more then 5 cities ",id:!1}),s&&n.N.$emit("open-popup",{text:"This city is already in your favorites",id:!1})}},mounted(){this.getCurrentUserCity(),console.log("localStorage",localStorage.getItem("favoritesList")),this.favoritesList=JSON.parse(localStorage.getItem("favoritesList"))||[]},created(){n.N.$on("delete-card",(t=>{this.daysList=this.daysList.filter((e=>e.id!==t))}))}},g=y,u=s(1001),h=(0,u.Z)(g,i,a,!1,null,null,null),p=h.exports}}]);
//# sourceMappingURL=752.a3472303.js.map