import React, { useState } from "react";
import "../styles/CreateAccount.css"; // Ensure you have this file for styling

const CreateAccount = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!username || !email || !password || !role) {
      alert("All fields are required");
      return;
    }
  
    const accountData = {
      userName: username,
      email,
      password,
      role,
    };
  
    try {
      const response = await fetch("http://localhost:3001/api/accounts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accountData),
      });
  
      if (response.ok) {
        alert("Account created successfully!");
        setUsername("");
        setEmail("");
        setPassword("");
        setRole("");
      } else {
        const errorData = await response.json();
        alert(`Failed to create account: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error creating account:", error);
      alert("An error occurred while creating the account.");
    }
  };
  
  return (
    <div className="create-account-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} className="create-account-form">
        <div className="form-group">
          <label htmlFor="userName">Username</label>
          <input
            type="text"
            id="userName"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="Role">Role</label>
          <select
            id="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a role
            </option>
            <option value="seller">Seller</option>
            <option value="customer">Customer</option>
          </select>
        </div>
        <button type="submit" className="create-account-button">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default CreateAccount;
