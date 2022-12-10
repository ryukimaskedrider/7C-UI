import { Menu } from '../_models/menu.model';

export const superAdminMenuItems = [
  new Menu(1, 'Dashboard', '/app/dashboard', '', '', '', false, 0, false, true),
  new Menu(2, 'Users', '/app/users', '', '', '', false, 0, false, true),
  new Menu(3, 'Packages', '/app/packages', '', '', '', false, 0, false, true),
  new Menu(4, 'Products', '/app/products', '', '', '', false, 0, false, true),
  new Menu(5, 'Encash', '/app/encash', '', '', '', false, 0, false, true),
];

export const adminMenuItems = [
  new Menu(1, 'Dashboard', '/app/dashboard', '', '', '', false, 0, false, true),
  new Menu(2, 'Users', '/app/users', '', '', '', false, 0, false, true),
  new Menu(3, 'Packages', '/app/packages', '', '', '', false, 0, false, true),
  new Menu(4, 'Products', '/app/products', '', '', '', false, 0, false, true),
];

export const resellerMenuItems = [
  new Menu(1, 'Dashboard', '/app/dashboard', '', '', '', false, 0, false, true),
  new Menu(6, 'Product Code', '/app/product-code', '', '', '', false, 0, false, true),
  new Menu(7, 'First Gen', '/app/first-gen', '', '', '', false, 0, false, true),
  new Menu(5, 'Encash', '/app/encash', '', '', '', false, 0, false, true),
];

export const userMenuItems = [
  new Menu(1, 'Dashboard', '/app/dashboard', '', 'pie_chart', '', false, 0, false, true),
  new Menu(6, 'Product Code', '/app/product-code', '', '', '', false, 0, false, true),
  new Menu(5, 'Encash', '/app/encash', '', '', '', false, 0, false, true),
];
