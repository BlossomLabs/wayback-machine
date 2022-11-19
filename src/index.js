import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createHashRouter, RouterProvider } from 'react-router-dom';
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);