import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter} from "react-router-dom";
import Auth from "./components/Auth";
import MainNet from "./components/MainNet";
import {RouterProvider} from "react-router";
import {createTheme, ThemeProvider} from "@mui/material";
import {orange} from "@mui/material/colors";
import "./App.css"

const root = ReactDOM.createRoot(document.getElementById('root'));

const theme = createTheme({
    palette: {
        primary: {
            main: '#3949ab',
        },
        secondary: orange,
        third: {
            main: '#b26500',
            contrastText: '#fff',
        },
        fourth: {
            main: "#e3f2fd",
        }
    },
});
const router = createBrowserRouter([
    {
        path: "/gingerbread-test-exercise",
        element: decodeURIComponent(document.cookie).includes("token") ? <MainNet/> : <Auth/>,
    }
]);

root.render(
    <ThemeProvider theme={theme}>
        <RouterProvider router={router}/>
    </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
