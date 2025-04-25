// src/App.jsx
import { StrictMode } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
// import About from './pages/About';
// import Achados from './pages/Achados';
// import Produto from './pages/Produto';
import './App.css';

// 1) Defina suas rotas fora do componente
const routes = [
  {
    path: '/',
    element: <Home />,
  },
  /*
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/achados',
    element: <Achados />,
  },
  {
    path: '/produto/:id',
    element: <Produto />,
  },
  */
];

// 2) Crie o router com o array acima
const router = createBrowserRouter(routes);

function App() {
  // 3) Aqui você só injeta o router dentro do StrictMode
  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}

export default App;
