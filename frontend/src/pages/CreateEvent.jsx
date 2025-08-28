import { Formik } from "formik";
import axios from "axios";
import "../EventForm.css";

export default function EventForm() {
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
    if (values.price === "" || values.price < 0) errors.price = "Required and must be >= 0";
    return errors;
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await axios.post("http://localhost:5000/events", values); //backend connection
      alert(" Event created successfully!");
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to create event");
    }
    setSubmitting(false);
  };

  return (
    <div className="event-form-container">
      {/* Image */}
      <div className="event-form-image">
        <img
          src="https://img.freepik.com/premium-vector/events-concept-illustration_114360-28883.jpg"
          alt="Event background"
          className="event-form-image"
        />
      </div>

      {/* Form */}
      <div className="event-form-side">
        <div className="event-form-inner">
          <h2 className="event-form-title">Create Event</h2>
          <Formik initialValues={initialValues} validate={validate} onSubmit={handleSubmit}>
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
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
                {errors.title && touched.title && <div className="event-form-error">{errors.title}</div>}

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
                {errors.date && touched.date && <div className="event-form-error">{errors.date}</div>}

                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.location}
                  className="event-form-input"
                />
                {errors.location && touched.location && <div className="event-form-error">{errors.location}</div>}

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
                {errors.price && touched.price && <div className="event-form-error">{errors.price}</div>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="event-form-button"
                >
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
