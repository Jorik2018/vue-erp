<template>
	<v-page header="PAD" action="/admin/bpm/run">
		<v-table :selectable="true" @loaded="tableLoaded"
			row-style-class="row.activity.id?(row.activity.progress>100?'':(row.activity.progress>70?'':'')):'gray'"
			:scrollable="true" :pagination="20" :filters="filters" src="/api/bpm/run">
			<template v-slot:header="">
				<v-button value="Crear" icon="fa-plus" class="on" @click.prevent="openPopup('Create')"></v-button>
				<v-button value="Atender" @click.prevent="attend(getSelected()[0])" icon="fa-pen"
					:disabled="!rowSelectedCount"></v-button>
				<v-button value="Ver" icon="fa-search" @click.prevent="view(getSelected()[0])"
					:disabled="!rowSelectedCount"></v-button>
				<v-button value="Eliminar" v-if="1 || can(perms.DESARROLLO_SOCIAL_REGISTER_SIVICO)" icon="fa-trash"
					@click.prevent="destroy" :disabled="!rowSelectedCount"></v-button>
				<v-button value="Reporte" icon="fa-download" @click.prevent="download"
					:disabled="!rowSelectedCount"></v-button>
				<v-button title="Refrescar" icon="fa-sync" @click.prevent="refresh"></v-button>
			</template>
			<template v-slot="{ row, index }">
				<td width="60" class="center" header="Año">
					<v-filter>
						<v-number v-model="filters.year" />
					</v-filter>
					{{ row.year }}
				</td>
				<td width="80" class="center" header="Numero">
					<v-filter>
						<v-number v-model="filters.number" />
					</v-filter>
					{{ row.number }}
				</td>
				<td width="220" header="Asunto">
					<v-filter>
						<input v-model="filters.subject" />
					</v-filter>
					{{ row.subject }}
				</td>
				<td width="220" header="Infractor">
					<v-filter>
						<input v-model="filters.offender" />
					</v-filter>
					{{ row.caso_infractor }}
					<template v-if="row.ext && row.ext.offenders && row.ext.offenders.length">
						<ul>
							<li v-for="(o, i) in row.ext.offenders" :key="i">{{ o.fullName }}
								<div class="label bold">{{ o.position }}</div>
							</li>
						</ul>
					</template>
					<br />
				</td>
				<td width="40" class="center" header="">
					<v-filter>
						<input disabled />
					</v-filter>
					<div :key="index + '_' + k" class="circle" :style="{
						border: '1px solid black',
						width: 30,
						height: 30,
						backgroundColor: row.activity
							? row.activity.id
								? row.activity.progress > 100
									? 'red'
									: getColor(row.activity)
								: 'gray'
							: '',
					}"></div>
				</td>

				<td width="220" header="Actividad">
					<v-filter>
						<input disabled />
					</v-filter>
					<template v-if="row.activity">
						<div :title="row.activity"></div>
						{{ row.activity ? row.activity.description : "" }}
						<br />
						{{ app.tt(row.activity) }}
					</template>
				</td>

				<td width="180" header="Delegado a">
					<v-filter>
						<input disabled />
					</v-filter>
					<template v-if="row">
						{{ row.delegatedUser }}
					</template>
				</td>
				<td width="90" class="center" header="Creado">
					<v-filter>
						<input v-model="filters.province" />
					</v-filter>
					<template v-if="row.dispatch">
						{{ date(row.dispatch.insertDate) }}
					</template>
				</td>
			</template>
		</v-table>
		<Teleport to="body">
			<div v-if="open" class="popup-overlay" @click.self="open = false">
				<div class="popup" :style="{width:width}">
					<button class="popup-close" @click="open = false">✕</button>
					<component :is="currentView" :id="o?.id" :callback="callback" />
				</div>
			</div>
		</Teleport>
	</v-page>
</template>
<script>
import { ui } from 'isobit-ui'
import { ref, shallowRef, defineAsyncComponent } from 'vue'
export default ui({
	setup() {
		const open = ref(false)
		const currentView = shallowRef(null)
		const oRef = ref({})
		const width = ref({})
		const openPopup = (view, o) => {
			oRef.value = o;
			currentView.value = defineAsyncComponent(() =>
				import(`./${view}.vue`)
			)
			open.value = true
		}
		const view = (o) => {
			openPopup('View', o)
		}
		const attend = (o) => {
			openPopup('Create', o)
		}
		const callback = (s) => {
			openPopup(s, oRef.value)
		}
		return { open, openPopup, currentView, view, attend, o: oRef, callback ,width};
	},
	data() {
		return {
			k: 0,
			rowSelectedCount2: 0,
			page: 0,
			data: [],
			mode: 0,
			query: null,
		};
	},
	methods: {
		getColor(o) {
			return o.color;
		},
		tableLoaded(e) {/*
			e.target.data.forEach((e) => {
				if (e.activity) this.app.tt(e.activity);
				if (e.ext) {
					Object.keys(e.ext).forEach((key) => {
						e[key] = e.ext[key];
					});
					if (e.ext.all) {
						const w = e.ext.all;
						w.split("|,").forEach((e2) => {
							e2 = e2.split("=");
							if (e[e2[0]]) {
								e[e2[0]] += ", " + e2[1];
							} else e[e2[0]] = e2[1];
						});
					}
				}
			});
			this.k++;*/
		},
		rss(e) {
			e = e.selection;
			this.rowSelectedCount2 = e ? e.length : 0;
		},
		can(o) {
			var m = this,
				u = m.user;
			return o || u.uid == 1;
			/*return u.uid == 1 || p.REGISTER_DESARROLLO_SOCIAL_SIVICO &&
				  !o || o.user == u.id;*/
		},
		view(o) {
			this.open("/admin/bpm/run/" + (o.tmpId ? -o.tmpId : o.id));
		},
		toInt(o) {
			return Array.isArray(o) ? o.length : o;
		},
		download() {
			this.app.download(this.getSelected()[0]);
		},
	},
});
</script>
<style scoped>
.circle {
	height: 30px;
	width: 30px;
}

.hg {
	background-color: green !important;
}

.hgd {
	background-color: #005d00 !important;
}

.hr {
	background-color: #bf0000 !important;
}

.hbd {
	background-color: #033d71 !important;
}

</style>