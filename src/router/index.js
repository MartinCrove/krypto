import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BuyView from '../views/BuyView.vue'
import SellView from '../views/SellView'
import TransactionsView from '../views/TransactionsView'
import ViewView from '../views/ViewView'
import EditView from '../views/EditView'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/initial',
    name: 'initial',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    
      path: '/buy',
      name: 'buy',
      component: BuyView
    
  },
  {
    
    path: '/sell',
    name: 'sell',
    component: SellView     
},
{
  path: '/transaction',
    name: 'transaction',
    component: TransactionsView  
},
{
    path: '/view/:id',
    name: 'view',
    component: ViewView 
},
{
 path: '/view/:id/edit',
 name: 'edit',
 component: EditView
}



]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
