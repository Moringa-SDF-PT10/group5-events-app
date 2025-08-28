import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(false);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const endpoint = isLogin ? "/api/login" : "/api/signup";
      const response = await fetch(`http://localhost:5000${endpoint}`, { //backend connection
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      console.log("Server response:", data);

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      // Tokens for login
      if (values.rememberMe && data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      alert(isLogin ? "Login successful!" : "Signup successful!");
      resetForm();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Min 6 characters").required("Required"),
    ...(isLogin
      ? {}
      : {
          username: Yup.string().required("Required"),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Required"),
        }),
    rememberMe: Yup.boolean(),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r">
      <div className="flex w-11/12 max-w-6xl bg-gray-100 rounded-2xl shadow-lg overflow-hidden">
        {/* Image */}
        <div
          className={`w-1/2 hidden md:flex items-center justify-center transition-all duration-700 ${
            isLogin ? "order-2" : "order-1"
          }`}
        >
          <img
            src="https://img.freepik.com/premium-vector/social-media-promotion_118813-3722.jpg"
            alt="auth visual"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Form */}
        <div
          className={`w-full md:w-1/2 p-12 flex flex-col justify-center transition-all duration-700 ${
            isLogin ? "order-1" : "order-2"
          }`}
        >
          <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">
            {isLogin ? "Login" : "Sign Up"}
          </h2>

          <Formik
            initialValues={{
              username: "",
              email: "",
              password: "",
              confirmPassword: "",
              rememberMe: false,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-5">
                {!isLogin && (
                  <>
                    <Field
                      type="text"
                      name="username"
                      placeholder="Username"
                      className="w-full px-5 py-3 border rounded-xl focus:outline-none"
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </>
                )}

                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full px-5 py-3 border rounded-xl focus:outline-none"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />

                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full px-5 py-3 border rounded-xl focus:outline-none"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />

                {!isLogin && (
                  <>
                    <Field
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      className="w-full px-5 py-3 border rounded-xl focus:outline-none"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </>
                )}

                {/* Remember Me Checkbox */}
                {isLogin && (
                  <div className="flex items-center space-x-2">
                    <Field type="checkbox" name="rememberMe" />
                    <label htmlFor="rememberMe" className="text-gray-700">
                      Remember me
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition font-semibold"
                >
                  {isSubmitting ? "Submitting..." : isLogin ? "Login" : "Sign Up"}
                </button>
              </Form>
            )}
          </Formik>

          <p className="mt-6 text-center text-gray-600">
            {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-600 font-medium hover:underline"
            >
              {isLogin ? "Sign up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
