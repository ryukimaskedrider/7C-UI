import { Routes, RouterModule } from '@angular/router';
import { ROLE, ROLES } from '@core/_constants';
import { DefaultComponent } from '@core/_layout/default/default.component';
import { AuthGuard, RoleGuard} from '@core/_guards';
import { NotAllowedComponent } from '@core/_pages/not-allowed/not-allowed.component';
import { NotFoundComponent } from '@core/_pages/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'app',
  },
  {
    path: 'login',
    loadChildren: () => import('./module/auth/auth.module').then(m => m.AuthModule)
  },

  {
    path: 'app',
    component: DefaultComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        canActivate: [RoleGuard],
        loadChildren: () => import('./module/dashboard/dashboard.module').then(m => m.DashboardModule),
        data: {
          breadcrumb: 'Dashboard',
          allowedRoles: [ROLE.SUPERADMIN, ROLE.ADMIN, ROLE.RESELLER, ROLE.USER],
        }
      },
      {
        path: 'users',
        canActivate: [RoleGuard],
        loadChildren: () => import('./module/users/users.module').then(m => m.UsersModule),
        data: {
          breadcrumb: 'Users',
          allowedRoles: [ROLE.SUPERADMIN, ROLE.ADMIN],
        }
      },
      {
        path: 'products',
        canActivate: [RoleGuard],
        loadChildren: () => import('./module/products/products.module').then(m => m.ProductsModule),
        data: {
          breadcrumb: 'Products',
          allowedRoles: [ROLE.SUPERADMIN, ROLE.ADMIN],
        }
      },
      {
        path: 'packages',
        canActivate: [RoleGuard],
        loadChildren: () => import('./module/packages/packages.module').then(m => m.PackagesModule),
        data: {
          breadcrumb: 'Packages',
          allowedRoles: [ROLE.SUPERADMIN, ROLE.ADMIN],
        }
      },
      {
        path: 'product-code',
        canActivate: [RoleGuard],
        loadChildren: () => import('./module/register-product-code/register-product-code.module').then(m => m.RegisterProductCodeModule),
        data: {
          breadcrumb: 'Product Codes',
          allowedRoles: [ROLE.SUPERADMIN, ROLE.ADMIN, ROLE.RESELLER, ROLE.USER],
        }
      },
      {
        path: 'first-gen',
        canActivate: [RoleGuard],
        loadChildren: () => import('./module/first-gen/first-gen.module').then(m => m.FirstGenModule),
        data: {
          breadcrumb: 'First Gen',
          allowedRoles: [ROLE.SUPERADMIN, ROLE.ADMIN, ROLE.RESELLER],
        }
      },
      {
        path: 'encash',
        canActivate: [RoleGuard],
        loadChildren: () => import('./module/encash-admin/encash.module').then(m => m.EncashModule),
        data: {
          breadcrumb: 'First Gen',
          allowedRoles: [ROLE.SUPERADMIN, ROLE.ADMIN, ROLE.RESELLER, ROLE.USER],
        }
      }
    ]
  },
  {
    path: 'forbidden',
    component: NotAllowedComponent
  },
  {
    path: 'page_not_found',
    component: NotFoundComponent
  },
  {
    path: '**',
    redirectTo: '/page_not_found',
    pathMatch: 'full'
  }
];

export const routing = RouterModule.forRoot(routes, {
  relativeLinkResolution: 'legacy'
});
