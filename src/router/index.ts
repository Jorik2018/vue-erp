//import { createRouter, createWebHistory } from '@ionic/vue-router';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Admin from '../Admin.vue';
import { useAppStore } from 'isobit-ui';
import { getActivePinia } from 'pinia';
import axios from 'axios';
const routes: Array<RouteRecordRaw> = [
  {
    path: '/file',
    component: () => import('../admin/file/List.vue')
  },
  {
    path: '/verify',
    component: () => import('../document/VerifyPanel.vue')
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
  }, {
    path: '/search', props: true,
    component: () => import('../Search.vue')
  }, {

    path: '/admin',
    component: Admin,
    children: [
      {
        path: 'desarrollo-social/people', meta: { perm: 'DS_PEOPLE_READ' },
        component: () => import(/* webpackChunkName: "people" */'../admin/desarrollo-social/people/List.vue')
      },
      {
        path: 'desarrollo-social/people/create', meta: { perm: 'DS_PEOPLE_REGISTER' },
        component: () => import(/* webpackChunkName: "people" */'../admin/desarrollo-social/people/Create.vue')
      },
      {
        path: 'desarrollo-social/people/:id', props: true, meta: { perm: 'DS_PEOPLE_READ' },
        component: () => import(/* webpackChunkName: "people" */'../admin/desarrollo-social/people/View.vue')
      },
      {
        path: 'desarrollo-social/people/:people/add/attention', props: true, meta: { perm: 'DS_PEOPLE_REGISTER' },
        component: () => import(/* webpackChunkName: "people" */'../admin/desarrollo-social/people/attention/Create.vue')
      },
      {
        path: 'desarrollo-social/attention/:id/edit', props: true,
        component: () => import(/* webpackChunkName: "people" */'../admin/desarrollo-social/people/attention/Create.vue')
      },
      {
        path: 'desarrollo-social/people/:id/edit', props: true,
        component: () => import(/* webpackChunkName: "people" */'../admin/desarrollo-social/people/Create.vue')
      },
      {
        path: 'desarrollo-social/adulto-mayor',
        component: () => import(/* webpackChunkName: "adulto-mayor" */'../admin/desarrollo-social/adulto-mayor/List.vue')
      },
      {
        path: 'desarrollo-social/adulto-mayor/create',
        component: () => import(/* webpackChunkName: "adulto-mayor" */'../admin/desarrollo-social/adulto-mayor/Create.vue')
      },
      {
        path: 'desarrollo-social/adulto-mayor/:id', props: true,
        component: () => import(/* webpackChunkName: "adulto-mayor" */'../admin/desarrollo-social/adulto-mayor/Create.vue')
      },
      {
        path: 'desarrollo-social/adulto-mayor/:id/edit', props: true,
        component: () => import(/* webpackChunkName: "adulto-mayor" */'../admin/desarrollo-social/adulto-mayor/Create.vue')
      },
      {
        path: 'inventory/item',
        component: () => import(/* webpackChunkName: "inventory" */ '../admin/inventory/List.vue')
      },
      {
        path: 'inventory/item/create',
        component: () => import(/* webpackChunkName: "inventory" */'../admin/inventory/Create.vue')
      },
      {
        path: 'inventory/item/:id/edit', props: true,
        component: () => import(/* webpackChunkName: "inventory" */'../admin/inventory/Create.vue')
      },
      {
        path: 'map',
        component: () => import('../admin/HelloWorld.vue')
      },
      {
        path: 'file',
        component: () => import('../admin/file/List.vue')
      },
      {
        path: 'obresec/crime', props: true,
        component: () => import(/* webpackChunkName: "risk-type" */ '../admin/obresec/crime/List.vue'),
      },
      {
        path: 'obresec/crime/create',
        component: () => import(/* webpackChunkName: "risk-type" */ '../admin/obresec/crime/Create.vue')
      },
      {
        path: 'obresec/crime/:id/edit', props: true,
        component: () => import(/* webpackChunkName: "risk-type" */ '../admin/obresec/crime/Create.vue')
      },
      {
        path: 'obresec/crime/type', props: true,
        component: () => import(/* webpackChunkName: "risk-type" */ '../admin/obresec/crime/type/List.vue')
      },
      {
        path: 'obresec/crime/category', props: true,
        component: () => import(/* webpackChunkName: "risk-type" */ '../admin/obresec/crime/category/List.vue')
      },
      {
        path: 'obresec/crime/category/:id/edit', props: true,
        component: () => import(/* webpackChunkName: "risk-type" */ '../admin/obresec/crime/category/Create.vue')
      },
      {
        path: 'obresec/crime/category/create', props: true,
        component: () => import(/* webpackChunkName: "risk-type" */ '../admin/obresec/crime/category/Create.vue')
      },
      {
        path: 'obresec/risk', props: true,
        component: () => import(/* webpackChunkName: "risk-type" */ '../admin/obresec/risk/List.vue'),
      },
      {
        path: 'obresec/risk/create',
        component: () => import(/* webpackChunkName: "risk-type" */ '../admin/obresec/risk/Create.vue')
      },
      {
        path: 'obresec/risk/:id/edit', props: true,
        component: () => import(/* webpackChunkName: "risk-type" */ '../admin/obresec/risk/Create.vue')
      },
      {
        path: 'obresec/risk/type', props: true,
        component: () => import(/* webpackChunkName: "risk-type" */ '../admin/obresec/risk/type/List.vue'),
      },
      {
        path: 'obresec/risk/type/create', props: true,
        component: () => import(/* webpackChunkName: "risk-type" */ '../admin/obresec/risk/type/Create.vue'),
      },
      {
        path: 'test',
        component: () => import('../admin/TestView.vue')
      },
      {
        path: '',
        component: () => import('../Blank.vue')
      },
      {
        path: 'hr/movement',
        component: () => import(/* webpackChunkName: "personal" */'../admin/hr/movement/List.vue')
      },
      {
        path: 'hr/movement/create',
        component: () => import(/* webpackChunkName: "personal" */'../admin/hr/movement/Create.vue')
      },
            {
        path: 'hr/movement/:id',props: true,
        component: () => import(/* webpackChunkName: "personal" */'../admin/hr/movement/Create.vue')
      },
            {
        path: 'hr/movement/:id/edit',props: true,
        component: () => import(/* webpackChunkName: "personal" */'../admin/hr/movement/Create.vue')
      },
      {
        path: 'hr/personal',
        component: () => import(/* webpackChunkName: "personal" */'../admin/hr/personal/List.vue')
      },
      {
        path: 'hr/personal/create',
        component: () => import(/* webpackChunkName: "personal" */'../admin/hr/personal/Create.vue')
      },
      {
        path: 'hr/personal/:id/edit', props: true,
        component: () => import(/* webpackChunkName: "personal" */'../admin/hr/personal/Create.vue')
      },
      {
        path: 'hr/personal/:id', props: true,
        component: () => import(/* webpackChunkName: "personal" */'../admin/hr/personal/View.vue')
      },
      {
        path: 'hr/personal/:id/:action/service', props: true, meta: { perm: 'HR_PERSONAL_REGISTER' },
        component: () => import(/* webpackChunkName: "personal" */'../admin/hr/personal/service/Create.vue')
      },
      {
        path: 'hr/personal/:id/:action/resource', props: true, meta: { perm: 'HR_PERSONAL_REGISTER' },
        component: () => import(/* webpackChunkName: "personal" */'../admin/hr/personal/resource/Create.vue')
      },
      {
        path: 'hr/personal/service/:id/edit', props: true, meta: { perm: 'HR_PERSONAL_REGISTER' },
        component: () => import(/* webpackChunkName: "personal" */'../admin/hr/personal/service/Create.vue')
      },
      {
        path: 'hr/personal/service/:id', props: true, meta: { perm: 'HR_RESOURCE_READ' },
        component: () => import(/* webpackChunkName: "personal" */'../admin/hr/personal/service/Create.vue')
      },
      {
        path: 'hr/personal/resource/:id', props: true, meta: { perm: 'HR_PERSONAL_REGISTER' },
        component: () => import(/* webpackChunkName: "personal" */'../admin/hr/personal/resource/Create.vue')
      },
            {
        path: 'hr/resource/:id', props: true, meta: { perm: 'HR_RESOURCE_READ' },
        component: () => import(/* webpackChunkName: "personal" */'../admin/hr/personal/resource/Create.vue')
      },
                  {
        path: 'hr/resource/:id/edit', props: true, meta: { perm: 'HR_RESOURCE_REGISTER' },
        component: () => import(/* webpackChunkName: "personal" */'../admin/hr/personal/resource/Create.vue')
      },
      {
        path: 'hr/personal/resource/:id/edit', props: true, meta: { perm: 'HR_RESOURCE_REGISTER' },
        component: () => import(/* webpackChunkName: "personal" */'../admin/hr/personal/resource/Create.vue')
      },

      {
        path: 'hr/resource', props: true, meta: { perm: 'HR_RESOURCE_READ' },
        component: () => import(/* webpackChunkName: "resource" */'../admin/hr/resource/List.vue')
      },
      {
        path: 'hr/resource/create', props: true, meta: { perm: 'HR_RESOURCE_REGISTER' },
        component: () => import(/* webpackChunkName: "resource" */'../admin/hr/resource/Create.vue')
      },
      {
        path: 'hr/employee',
        component: () => import('../admin/hr/employee/List.vue')
      },
      {
        path: 'hr/employee/create',
        component: () => import('../admin/hr/employee/Create.vue')
      },
      {
        path: 'payroll/chd',
        component: () => import('../admin/payroll/chd.vue')
      },
      {
        path: 'payroll/create',
        component: () => import('../admin/payroll/Create.vue')
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
        path: 'desarrollo-social/cancer', meta: { perm: 'CANCER_READ' },
        component: () => import('../admin/desarrollo-social/cancer/List.vue')
      },
      {
        path: 'desarrollo-social/cancer/create', meta: { perm: 'CANCER_ADMIN' },
        component: () => import('../admin/desarrollo-social/cancer/Create.vue')
      },
      {
        path: 'desarrollo-social/cancer/:id', props: true, meta: { perm: 'CANCER_READ' },
        component: () => import('../admin/desarrollo-social/cancer/Create.vue')
      },
      {
        path: 'desarrollo-social/cancer/:id/edit', props: true, meta: { perm: 'CANCER_ADMIN' },
        component: () => import('../admin/desarrollo-social/cancer/Create.vue')
      }
    ]
  },
  { path: '/:pathMatch(.*)*', component: import('../NotFound.vue') }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

(axios as any).VITE_LOGIN_PATH = import.meta.env.VITE_LOGIN_PATH;//'/simple-jwt-login/v1/auth';//

router.beforeEach((to, from, next) => {
  const pinia = getActivePinia();
  if (!pinia) {
    return next();
  }
  const store = useAppStore(pinia) as any;
  store.config({ router, axios });

  const isAuthenticated = store.authenticated;
  const userPermissions = store.session?.perms || {}; // Permisos del usuario como objeto

  // Si la ruta comienza con /admin, requiere autenticación
  if (to.path.startsWith('/admin')) {
    if (!isAuthenticated) {
      next('/login');
      return;
    }

    // Verificación de permisos
    const requiredPermission = to.meta.perm as any;
    if (requiredPermission && !userPermissions[requiredPermission]) {
      store.unauthorized = true;
      next(); // Bloquea la navegación sin cambiar la URL
      return;
    }
  }

  // Si todo está bien, continúa la navegación
  store.unauthorized = false;
  next();
});


export default router
