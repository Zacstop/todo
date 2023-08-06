import React, { lazy, useState } from "react"
import { Navigate, useRoutes } from 'react-router-dom';
import { getRoutes } from './AllRoutes';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import Home from 'page/Home';
import Login from 'page/Login';
import ErrorPage404 from 'page/404';

const Router = () => {
  const [userId, setUserId] = useState<any>()

  const getUserData = () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => 
        setUserId(user)
    );

    return unsubscribe()
  }

  const allRoutes = getRoutes();

  const getHomeRoute = () => {
    getUserData();
    console.log(userId, 'getroute')
    if (userId) {
      return '/';
    } else {
      return '/login';
    }
  };

  const routes = useRoutes([
    {
      path: '/',
      index: true,
      element: <Navigate replace to={getHomeRoute()} />,
    },
    {
      path: '/',
      element: <Home />,
      children: [
        { path: '/login', element: <Login /> },
      ],
    },
    {
      path: '*',
      element: <ErrorPage404 />,
    },
    ...allRoutes,
  ]);

  return routes;
};

export default Router;
