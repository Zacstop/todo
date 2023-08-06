import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

/**
 * Router
 * @returns {RouteObject} - getRoutes
 */

// Router
// const User = lazy(() => import('../pages/'));
interface RouteProps {
  path: string;
  component?: any;
  element?: any;
}

const userRoutes: Array<RouteProps> = [
  // { path: '/member/user', element: <User /> }, // 회원관리 > 일반회원
];

const getRoutes = () => {
  const AllRoutes: RouteObject[] = [];

  AllRoutes.push({
    path: '/',
    children: userRoutes,
  });

  return AllRoutes;
};

export { userRoutes, getRoutes };
