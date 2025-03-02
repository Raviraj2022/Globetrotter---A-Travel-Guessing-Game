import { useState } from "react";
import axios from "axios";

const RegisterForm = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/register", {
        username,
      });

      // Store user data & navigate to game page
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Globetrotter - Register</h1>
      <form onSubmit={handleRegister} className="bg-gray-800 p-6 rounded-lg">
        <input
          type="text"
          className="w-full p-2 mb-4 rounded text-black text-white"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full bg-blue-500 p-2 rounded">
          Register & Play
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
