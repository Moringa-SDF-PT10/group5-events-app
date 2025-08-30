import { Formik } from "formik";
import axios from "axios";
import { useAuth } from "../context/useAuth";
import "./EventForm.css";

export default function EventForm() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token: ctxToken } = useAuth();

  const initialValues = {
    title: "",
    description: "",
    date: "",
    location: "",
    price: "",
  };

  const validate = (values) => {
    const errors = {};
    if (!values.title) errors.title = "Required";
    if (!values.date) errors.date = "Required";
    if (!values.location) errors.location = "Required";
    if (values.price === "" || Number(values.price) < 0)
      errors.price = "Required and must be >= 0";
    return errors;
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // ✅ Prefer context, then localStorage, then sessionStorage
    const authToken =
      ctxToken ||
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token");

    if (!authToken) {
      alert("You must be logged in to create an event");
      setSubmitting(false);
      return;
    }

    // ✅ Ensure numeric price
    const payload = {
      ...values,
      price: Number(values.price),
    };

    try {
      const res = await axios.post(`${API_URL}/events`, payload, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });


      alert("Event created successfully!");
      resetForm();
    } catch (err) {
      console.error("Create event error:", err.response?.data || err.message);
      alert("Failed to create event: " + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="event-form-container">
      <div className="event-form-image">
        <img
          src="https://img.freepik.com/premium-vector/events-concept-illustration_114360-28883.jpg"
          alt="Event background"
          className="event-form-image"
        />
      </div>

      <div className="event-form-side">
        <div className="event-form-inner">
          <h2 className="event-form-title">Create Event</h2>
          <Formik initialValues={initialValues} validate={validate} onSubmit={handleSubmit}>
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit} className="space-y-5">
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.title}
                  className="event-form-input"
                />
                {errors.title && touched.title && (
                  <div className="event-form-error">{errors.title}</div>
                )}

                <textarea
                  name="description"
                  placeholder="Description"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.description}
                  className="event-form-input"
                />

                <input
                  type="datetime-local"
                  name="date"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.date}
                  className="event-form-input"
                />
                {errors.date && touched.date && (
                  <div className="event-form-error">{errors.date}</div>
                )}

                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.location}
                  className="event-form-input"
                />
                {errors.location && touched.location && (
                  <div className="event-form-error">{errors.location}</div>
                )}

                <input
                  type="number"
                  name="price"
                  step="0.01"
                  placeholder="Price"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.price}
                  className="event-form-input"
                />
                {errors.price && touched.price && (
                  <div className="event-form-error">{errors.price}</div>
                )}

                <button type="submit" disabled={isSubmitting} className="event-form-button">
                  {isSubmitting ? "Creating..." : "Create Event"}
                </button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
