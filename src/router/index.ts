import { createRouter, createWebHistory } from 'vue-router'
import axios from "axios";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/admin',
			component: () => import('../Admin.vue'),
			children: [
				{
					path: '',
					component: () => import('../Blank.vue')
				},
				{
					path: 'setting',
					component: () => import('../admin/Setting.vue')
				},
				{
					path: 'desarrollo-social/covid',
					component: () => import('../admin/desarrollo-social/covid/Create.vue')
				},
				{
					path: 'desarrollo-social/covid/vaccine',
					component: () => import('../admin/desarrollo-social/covid/vaccine/Create.vue')
				},
				{
					path: 'profile',
					component: () => import('../admin/Profile.vue')
				},
				{
					path: 'poll',
					component: () => import('../admin/poll/List.vue')
				},
				{
					path: 'poll/:poll/create', props: true,
					component: () => import('../admin/poll/Create.vue')
				},
				{
					path: 'desarrollo-social/emed',
					component: () => import('../admin/desarrollo-social/emed/List.vue')
				},
				{
					path: 'desarrollo-social/emed/create',
					component: () => import('../admin/desarrollo-social/emed/Create.vue')
				},
				{
					path: 'desarrollo-social/emed/:id', props: true,
					component: () => import('../admin/desarrollo-social/emed/View.vue')
				},
				{
					path: 'desarrollo-social/emed/:id/edit', props: true,
					component: () => import('../admin/desarrollo-social/emed/Create.vue')
				},
				{
					path: 'desarrollo-social/emed/:id/:action/resource', props: true,
					component: () => import('../admin/desarrollo-social/emed/resource/Create.vue')
				},
				{
					path: 'desarrollo-social/emed/damage-ipress/:id/edit', props: true,
					component: () => import('../admin/desarrollo-social/emed/damage_ipress/Create.vue')
				},
				{
					path: 'desarrollo-social/emed/damage-salud/:id/edit', props: true,
					component: () => import('../admin/desarrollo-social/emed/damage_salud/Create.vue')
				},
				{
					path: 'desarrollo-social/emed/action/:id/edit', props: true,
					component: () => import('../admin/desarrollo-social/emed/action/Create.vue')
				},
				{
					path: 'desarrollo-social/emed/:id/:action/action', props: true,
					component: () => import('../admin/desarrollo-social/emed/action/Create.vue')
				},
				{
					path: 'desarrollo-social/emed/:id/:action/source', props: true,
					component: () => import('../admin/desarrollo-social/emed/source/Create.vue')
				},
				{
					path: 'desarrollo-social/emed/:id/:action/damage-salud', props: true,
					component: () => import('../admin/desarrollo-social/emed/damage_salud/Create.vue')
				},
				{
					path: 'desarrollo-social/emed/:id/:action/damage-ipress', props: true,
					component: () => import('../admin/desarrollo-social/emed/damage_ipress/Create.vue')
				},
				{
					path: 'desarrollo-social/vea-materno',
					component: () => import('../admin/desarrollo-social/vea-materno/List.vue')
				},
				{
					path: 'desarrollo-social/vea-materno/create',
					component: () => import('../admin/desarrollo-social/vea-materno/Create.vue')
				},
				{
					path: 'desarrollo-social/vea-materno/:id', props: true,
					component: () => import('../admin/desarrollo-social/vea-materno/View.vue')
				},
				{
					path: 'desarrollo-social/vea-materno/:id/edit', props: true,
					component: () => import('../admin/desarrollo-social/vea-materno/Create.vue')
				},
				{
					path: 'desarrollo-social/pregnant',
					component: () => import('../admin/desarrollo-social/pregnant/List.vue')
				},
				{
					path: 'desarrollo-social/pregnant/create',
					component: () => import('../admin/desarrollo-social/pregnant/Create.vue')
				},
				{
					path: 'desarrollo-social/pregnant/:id', props: true,
					component: () => import('../admin/desarrollo-social/pregnant/View.vue')
				},
				{
					path: 'desarrollo-social/pregnant/:id/:action/visit', props: true,
					component: () => import('../admin/desarrollo-social/pregnant/visit/Create.vue')
				},
				{
					path: 'desarrollo-social/pregnant/visit/:id/edit', props: true,
					component: () => import('../admin/desarrollo-social/pregnant/visit/Create.vue')
				},
				{
					path: 'desarrollo-social/pregnant/:id/edit', props: true,
					component: () => import('../admin/desarrollo-social/pregnant/Create.vue')
				},
				{
					path: 'desarrollo-social/anemia',
					component: () => import('../admin/desarrollo-social/anemia/List.vue')
				},
				{
					path: 'desarrollo-social/anemia/create',
					component: () => import('../admin/desarrollo-social/anemia/Create.vue')
				},
				{
					path: 'desarrollo-social/anemia/:id', alias: 'desarrollo-social/anemia/:id/edit', props: true,
					component: () => import('../admin/desarrollo-social/anemia/Create.vue')
				},
				{
					path: 'desarrollo-social/sid',
					component: () => import('../admin/desarrollo-social/sid/List.vue')
				},
				{
					path: 'desarrollo-social/sid/create',
					component: () => import('../admin/desarrollo-social/sid/Create.vue')
				},
				{
					path: 'desarrollo-social/sid/:id', alias: 'desarrollo-social/sid/:id/edit', props: true,
					component: () => import('../admin/desarrollo-social/sid/Create.vue')
				},
				{
					path: 'desarrollo-social/tracing',
					component: () => import('../admin/desarrollo-social/tracing/List.vue')
				},
				{
					path: 'desarrollo-social/tracing/create',
					component: () => import('../admin/desarrollo-social/tracing/Create.vue')
				},
				{
					path: 'desarrollo-social/tracing/:id', alias: 'desarrollo-social/tracing/:id/edit', props: true,
					component: () => import('../admin/desarrollo-social/tracing/Create.vue')
				},
				{
					path: 'desarrollo-social/settings',
					component: () => import('../admin/desarrollo-social/Variables.vue')
				},
				{
					path: 'desarrollo-social/census',
					component: () => import('../admin/desarrollo-social/census/List.vue')
				},
				{
					path: 'desarrollo-social/census/create',
					component: () => import('../admin/desarrollo-social/census/Create.vue')
				},
				{
					path: 'desarrollo-social/census/:id', alias: 'desarrollo-social/census/:id/edit', props: true,
					component: () => import('../admin/desarrollo-social/census/Create.vue')
				},
				{
					path: 'desarrollo-social/census/:id/:action', props: true,
					component: () => import('../admin/desarrollo-social/census/Create.vue')
				},
				{
					path: 'desarrollo-social/disabled',
					component: () => import('../admin/desarrollo-social/disabled/List.vue')
				},
				{
					path: 'desarrollo-social/disabled/create',
					component: () => import('../admin/desarrollo-social/disabled/Create.vue')
				},
				{
					path: 'desarrollo-social/disabled/:id', alias: 'desarrollo-social/disabled/:id/edit', props: true,
					component: () => import('../admin/desarrollo-social/disabled/Create.vue')
				},
				{
					path: 'desarrollo-social/disabled/:id/:action', props: true,
					component: () => import('../admin/desarrollo-social/disabled/Create.vue')
				},
				{
					path: 'desarrollo-social/sivico',
					component: () => import('../admin/desarrollo-social/sivico/List.vue')
				},
				{
					path: 'desarrollo-social/sivico/create',
					component: () => import('../admin/desarrollo-social/sivico/Create.vue')
				},
				{
					path: 'desarrollo-social/sivico/:id', props: true,
					component: () => import('../admin/desarrollo-social/sivico/View.vue')
				},
				{
					path: 'desarrollo-social/sivico/:id/edit', props: true,
					component: () => import('../admin/desarrollo-social/sivico/Create.vue')
				},
				{
					path: 'desarrollo-social/sivico/:id/:action/people', props: true,
					component: () => import('../admin/desarrollo-social/sivico/people/Create.vue')
				},
				{
					path: 'desarrollo-social/sivico/people/:id/edit', props: true,
					component: () => import('../admin/desarrollo-social/sivico/people/Create.vue')
				},
				{
					path: 'desarrollo-social/sivico/:id/:action/agreement', props: true,
					component: () => import('../admin/desarrollo-social/sivico/agreement/Create.vue')
				},
				{
					path: 'desarrollo-social/sivico/agreement/:id/edit', props: true,
					component: () => import('../admin/desarrollo-social/sivico/agreement/Create.vue')
				},
				{
					path: 'desarrollo-social/cancer',
					component: () => import('../admin/desarrollo-social/cancer/List.vue')
				},
				{
					path: 'desarrollo-social/cancer/create',
					component: () => import('../admin/desarrollo-social/cancer/Create.vue')
				},
				{
					path: 'desarrollo-social/cancer/:id', props: true,
					component: () => import('../admin/desarrollo-social/cancer/Create.vue')
				},
				{
					path: 'desarrollo-social/cancer/:id/edit', props: true,
					component: () => import('../admin/desarrollo-social/cancer/Create.vue')
				},
			]
		},
		{
			path: '/login',
			component: () => import('../Login.vue')
		},
		{
			path: '/password',
			component: () => import('../Password.vue')
		}, {
			path: '/search', props: true,
			component: () => import('../Search.vue')
		}
	]
})

router.beforeEach((to, _from, next) => {
	let session = localStorage.getItem('session');
	//console.log(session);
	if (to.path == '/logout') {
		if (session) {
			axios.config = {};
			localStorage.removeItem('session');
		}
		next('/');
		return;
	}
	if (session) session = JSON.parse(session);
	if (to.path == '/login' && session) {
		next('/admin');
	} else if (to.path !== '/login' && !session) {

		if (to.path == '/register' || to.path == '/password') {

			next();
		} else {
			next('/login');
		}
	} else if (to.path == '/') {
		next('/admin');
	} else {
		console.log('to.path=' + to.path);
		next();
	}
});
export default router
