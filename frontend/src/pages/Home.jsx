import React from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate, Link } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4">
      <h1 className="text-5xl font-bold mb-4 text-center">Welcome to EventHub</h1>
      <p className="text-lg mb-8 text-center">
        Create, view, and manage your events with ease.
      </p>

      <div className="flex space-x-4">
        <Link
          to="/login"
          className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition"
        >
          Login / Sign Up
        </Link>
        <a
          href="#features"
          className="px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-purple-600 transition"
        >
          Learn More
        </a>
      </div>

      <section id="features" className="mt-16 max-w-4xl text-center">
        <h2 className="text-3xl font-bold mb-6">Features</h2>
        <ul className="space-y-4 text-lg">
          <li> User authentication and secure login</li>
          <li> Protected routes for dashboard & profile</li>
          <li> Event creation & management</li>
          <li>Persistent login with "Remember me"</li>
        </ul>
      </section>
    </div>
  );
};

export default Home;
