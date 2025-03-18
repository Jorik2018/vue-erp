<template style="color:red">
	<ion-split-pane content-id="2content" when="false">
		<AppMenu></AppMenu>
		<div style="display: flex;flex-direction: column;width: -webkit-fill-available;background-color: #ffffff;">
			<ion-header :translucent="true">
				<ion-toolbar>
					<ion-buttons slot="start">
						<ion-menu-button color="primary"></ion-menu-button>
					</ion-buttons>
					<ion-title></ion-title>
				</ion-toolbar>
			</ion-header>
			<ion-content style="display: flex;" id="2content">
				<!--ion-router-outlet id="main-content"></ion-router-outlet-->
				<div id="main-content">
					<router-view></router-view>
				</div>
			</ion-content>
		</div>
	</ion-split-pane>
</template>
<script lang="ts">
import AppMenu from './AppMenu.vue';
import { menuController, IonRouterOutlet, IonSplitPane, IonHeader, IonMenuButton, IonButtons, IonTitle, IonToolbar, IonContent } from '@ionic/vue';
import { ui, resize } from 'isobit-ui'
export default ui({
	components: { AppMenu, IonRouterOutlet, IonHeader, IonSplitPane, IonMenuButton, IonButtons, IonTitle, IonToolbar, IonContent },
	watch: {
		$route() {
			//console.log("ENTRO A ROUTE")
			//Vue.resize();
			const me = this;
			me.resultVisible = false;
			//me.mask = window._.unmask(me.mask);
		}
	},
	mounted() {
		/*const app = this.app;
		this.bindLinks(this.$el, this.hide);
		setTimeout(resize, 600);*/
	},
	updated() {
		/*this.bindLinks(this.$el, this.hide);
		this.bindLinks(this.$el);
		resize();*/
		//this.$refs.dataview.load(true); 
		//this.categoria = this.app.idcategoria;
	},
	methods: {
		open() {
			menuController.open('start')
		},
		find(ev) {
			console.log(ev)
			const valor = ev.target.value;
			this.query = valor;
			console.log(valor);
			this.$refs.dataview.load(true);
		},
	},
	computed: {
		cart() { return this.app.cart; },
		title() { return this.app.title; },
		icono() { return this.app.icono; },
	},
	data() { return { data: [], mode: 0, query: null, mask: null, path: import.meta.env.VITE_API_URL } },
});
</script>
<style scoped>
ion-content::part(scroll) {
	display: flex;
	flex: 1;
}

#main-content {
	flex: 1;
	display: flex;
	flex-direction: column;
}

::v-deep(#main-content > div) {
	flex: 1 !important;
}

::v-deep(#main-content > .ui-panel) {
	height: 0px;
}

::v-deep(#main-content > .ui-panel) {
	height: 0px;
}

::v-deep(#main-content > .ion-page) {
	display: flex;
	flex-direction: column;
}

::v-deep(#main-content > .ion-page > .ui-panel) {
	height: 0px;
	flex: 1;
}

::v-deep(#main-content > .ion-page > .ui-panel > .v-dialog-content > form > center:last-child) {
	background-color: #0f62ac;
	padding: 10px;
}

::v-deep(#main-content > .ion-page > .ui-panel > .v-dialog-content > form > center:last-child > *) {
	margin: 0px;
}

::v-deep(#main-content > .ion-page > .ui-panel > .v-dialog-content) {
	/*overflow: auto;*/
	height: 0px;
}

::v-deep(#main-content > .ui-panel > .v-dialog-content>form) {
	height: 0px;
}

::v-deep(#main-content > .ion-page > .ui-panel > .v-dialog-content > form > .v-form) {
	overflow: auto;
}

::v-deep(#main-content > .ui-panel > .v-dialog-content),
::v-deep(#main-content > .ui-panel > .v-dialog-content > form > .v-form) {
	overflow-y: auto;
}

::v-deep(#main-content > .ion-page > .ui-panel > .v-dialog-content > form) {
	height: 0px;
}

::v-deep(#main-content > div > div>form) {
	display: flex;
	flex-direction: column;
}

::v-deep(#main-content > div > div > form > .v-datatable),
::v-deep(#main-content > .ion-page > div > div > form > .v-datatable) {
	flex: 1;
	display: flex;
	flex-direction: column;
}

#main {
	display: none;
}
</style>
<style>
.toolbar {
	font-size: 12px;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity .5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active below version 2.1.8 */
	{
	opacity: 0;
}

.v-input-field svg {
	margin: 5px;
	opacity: .5;
}

.v-form input,
.v-form select,
.v-form textarea {
	border-radius: 8px !important;
}

.v-input-field input {
	width: calc(100% - 31px) !important;
	border-radius: 8px !important;
	padding-left: 26px !important;
}

.v-tab-content>span {
	text-align: justify;
	padding: 5px 0px;
}

.v-accordion>div:not(:last-child)>.v-tab-content {
	padding-bottom: 20px;
}

.v-accordion>div:not(:last-child) {
	border-bottom: 1px solid gray;
}

.v-accordion>*>.expanded {
	font-weight: bolder;
}

.v-cart {
	border-radius: 50%;
	background-color: #0f62ac;
	position: fixed;
	border: #0f62ac;
	right: 15px;
	bottom: 15px;
	padding: 14px;
	display: inline-block;
	box-shadow: 1px 2px 2px #535353a3;
	/*agregando sombra*/
}

.v-cart svg {
	margin-right: 0px;
}

a {
	display: inline-block;
}

.controls a:not(:last-child) {
	display: inline-block;
	margin-right: 0px;
}

.store .img {
	min-height: 120px;
	width: 50%;
}

.store {
	position: relative;
	width: calc(100% - 0px);
}

.v-dataview div.store-info {
	width: calc(50% - 10px);
	margin-left: 10px;
}

.store-info .controls {
	position: absolute;
	top: 0px;
	right: -10px;
}

.sc-ion-input-md-h {
	--padding-top: 5px;
	--padding-right: 0px;
	--padding-left: 0px;
	--padding-end: 0;
	--padding-bottom: 5px;
	--padding-start: 8px;
	font-size: inherit;
}

.searchionic {
	--icon-color: #f39200;
	--clear-button-color: #f39200;
	--cancel-button-color: #f39200;
	padding-right: 5px;
	padding-left: 5px;
	padding-top: 0px;
	padding-bottom: 0px;
	margin-top: -10px;
}

.searchbar-input-container.sc-ion-searchbar-ios {
	height: 36px;
	contain: strict;
	border: 1px solid rgb(187, 187, 187);
	border-radius: 10px;
}

ion-header svg {
	color: white;
}

.v-red {
	background-color: #ff9d9d !important;

}

.v-red svg {
	color: black;
}
</style>