import React, { useState } from "react";
import { HiXMark } from "react-icons/hi2";
import { useCreateUser } from "../hooks/useUsersAdminMutations";
import "./UserModals.scss";

export default function CreateUserModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
    phone_number: "",
    status: "active",
  });
  const [errors, setErrors] = useState({});

  const createUserMutation = useCreateUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createUserMutation.mutateAsync(formData);
      onSuccess?.();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="user-modal__backdrop" onClick={onClose}>
      <div className="user-modal__wrapper" onClick={(e) => e.stopPropagation()}>
        <div className="user-modal__header">
          <h2>Create New User</h2>
          <button className="user-modal__btn-close" onClick={onClose}>
            <HiXMark />
          </button>
        </div>

        <form className="user-modal__content" onSubmit={handleSubmit}>
          <div className="user-modal__form-group">
            <label>Username *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              className={errors.username ? "error" : ""}
            />
            {errors.username && <span className="user-modal__error">{errors.username}</span>}
          </div>

          <div className="user-modal__form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className={errors.email ? "error" : ""}
            />
            {errors.email && <span className="user-modal__error">{errors.email}</span>}
          </div>

          <div className="user-modal__form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className={errors.password ? "error" : ""}
            />
            {errors.password && <span className="user-modal__error">{errors.password}</span>}
          </div>

          <div className="user-modal__form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter full name"
            />
          </div>

          <div className="user-modal__form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          <div className="user-modal__form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending_verification">Pending Verification</option>
            </select>
          </div>

          <div className="user-modal__actions">
            <button type="button" className="user-modal__btn user-modal__btn--secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="user-modal__btn user-modal__btn--primary"
              disabled={createUserMutation.isPending}
            >
              {createUserMutation.isPending ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

