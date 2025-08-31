import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import Layout from "./Layout";
import { HomePage, Chat, ErrorPage } from "./pages";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<HomePage />} />
        </Route>
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="*" element={<ErrorPage />} />
      </>
    )
    // [
    //   {
    //     path: "/",
    //     element: <Layout />,
    //     children: [
    //       {
    //         path: "",
    //         element: <HomePage />,
    //       },
    //       {
    //         path: "chat",
    //         element: <Chat />,
    //       },
    //     ],
    //   },
    //   {
    //     path: "*",
    //     element: <ErrorPage />,
    //   },
    // ]
  );
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
