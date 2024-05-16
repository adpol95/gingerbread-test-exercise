import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AuthProvider from "react-auth-kit";
import createStore from "react-auth-kit/createStore";
import {createBrowserRouter} from "react-router-dom";
import RequireAuth from "@auth-kit/react-router/RequireAuth";
import Auth from "./components/Auth";
import MainNet from "./components/MainNet";
import {RouterProvider} from "react-router";

const store = createStore({
  authName: '_auth',
  authType: 'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: false,
  // refresh: my_refresh_api
});
const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: "/",
        element: <Auth/>,
      },
      {
        path: "main",
        element: <RequireAuth fallbackPath={'/'}>
          <MainNet/>
        </RequireAuth>
      }
    ]
  }
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider store={store}>
    <RouterProvider router={router}/>
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
