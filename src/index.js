import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import Root from './routes/root';
import PageViewer from './routes/page-viewer';

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/:url",
    element: <PageViewer />
  }
]);

const colors = {
  brand: {
    "50": "#E6FBFE",
    "100": "#BAF5FC",
    "200": "#8EEFFB",
    "300": "#62E8F9",
    "400": "#36E2F7",
    "500": "#0ADBF5",
    "600": "#08AFC4",
    "700": "#068493",
    "800": "#045862",
    "900": "#022C31"
  },
}

const theme = extendTheme({ colors })

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);