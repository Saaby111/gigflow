import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { gigAPI, authAPI } from "../services/api";

function CreateGig() {
  const navigate = useNavigate();
  const user = authAPI.getCurrentUser();

  if (!user || user.role !== "client") {
    navigate("/login");
    return null;
  }

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Web Development",
    budget: "",
    deadline: "",
    requirements: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await gigAPI.createGig(formData);
      setSuccess("Gig posted successfully!");

      // Clear form
      setFormData({
        title: "",
        description: "",
        category: "Web Development",
        budget: "",
        deadline: "",
        requirements: "",
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/browse");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create gig");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "Web Development",
    "Mobile Development",
    "Graphic Design",
    "Content Writing",
    "Digital Marketing",
    "Video Editing",
    "SEO",
    "Data Entry",
    "Other",
  ];

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-card">
          <h2 className="form-title">Post a New Gig</h2>
          <p className="form-subtitle">
            Find the perfect freelancer for your project
          </p>

          {success && <div className="alert alert-success">{success}</div>}

          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="title">
                Gig Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Website Development, Logo Design"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your project in detail..."
                required
                rows="4"
                className="form-input"
              />
            </div>

            <div className="grid grid-2 gap-2">
              <div className="form-group">
                <label className="form-label" htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-input"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="budget">
                  Budget ($) *
                </label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="e.g., 500"
                  required
                  min="1"
                  className="form-input"
                />
              </div>
            </div>

            <div className="grid grid-2 gap-2">
              <div className="form-group">
                <label className="form-label" htmlFor="deadline">
                  Deadline
                </label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="requirements">
                Requirements (Optional)
              </label>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="Any specific requirements or skills needed..."
                rows="3"
                className="form-input"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1, padding: "12px" }}
                disabled={loading}
              >
                {loading ? "Posting..." : "Post Gig"}
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate("/browse")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateGig;
