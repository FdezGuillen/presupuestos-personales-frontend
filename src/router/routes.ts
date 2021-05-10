import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
  {
    path: '',
    component: () => import('pages/Home.vue') ,
  },
  { path: '/login', component: () => import('pages/Index.vue') },
  { path: '/recuperar-cuenta', component: () => import('pages/RecuperarCuenta.vue') },
  { path: '/passwordReset', component: () => import('pages/ResetearPassword.vue') },
  { path: '/mi-cuenta', component: () => import('pages/Usuario.vue') },
  { path: '/presupuestos', component: () => import('pages/Presupuestos.vue') },
  { path: '/presupuestos/:id', component: () => import('pages/PresupuestoDetalle.vue') },
  { path: '/categorias', component: () => import('pages/Categorias.vue') },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
