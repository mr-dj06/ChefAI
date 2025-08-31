// components/pages/ErrorPage.jsx
import { useRouteError } from "react-router-dom";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="p-4 flex flex-col gap-2 h-screen items-center justify-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="max-w-1/5 text-center">
        Opps! Looks like the page you are looking for doesn't exists
      </p>
      {/* <p>
        <i>{error?.statusText || error?.message || "Unknown Error"}</i>
      </p> */}
      <Link to="/" className="underline text-orange-700 hover:text-red-800">
        Go back to Home
      </Link>
    </div>
  );
}
