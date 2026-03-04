import { useState } from "react";
import { useLocation } from "wouter";
import { Link } from "react-router-dom";

export default function SignupPage() {
  const [, setLocation] = useLocation();
  const [includeMedical, setIncludeMedical] = useState(false);
  async function sendAge() {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;
    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;
    const password = document.getElementById("password").value;
    const checkbox = document.getElementById("checker");

    let datas = {
      name,
      phone,
      email,
      address,
      age,
      gender,
      password,
      includeMedical: checkbox.checked
    };

    // Only add extra fields if checkbox is checked
    if (checkbox.checked) {
      datas = {
        ...datas,
        weight: document.getElementById("weight").value,
        height: document.getElementById("height").value,
        blood: document.getElementById("blood").value,
        vision: document.getElementById("vision").value,
        allergies: document.getElementById("allergies").value,
        emergency: document.getElementById("emergency").value,
        doctor: document.getElementById("doctor").value
      };
    }

    console.log(datas);
    const res = await fetch("http://127.0.0.1:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datas),
      });

  const data = await res.json();
  if(data.error){
    alert(data.error);
  }else{
    if(data.message){
      setLocation("/verify"); 
    }
  }
  console.log(data);
}
const handleSignup = (e) => {
  e.preventDefault();
  sendAge();
  // ✅ Add your signup logic here
  setLocation("/dashboard"); // redirect after signup
};

  return (
    <div className="min-h-screen bg-[#f5f9ff] flex items-center justify-center py-10">
      <div className="bg-white shadow-lg rounded-2xl flex flex-col md:flex-row w-full max-w-5xl overflow-hidden">
        
        {/* Left Side (Illustration) */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 p-6">
          <img
            src="/doctor-illustration.png"
            alt="Healthcare"
            className="rounded-xl"
          />
        </div>

        {/* Right Side (Form) */}
        <div className="w-full md:w-1/2 p-8 overflow-y-auto">
          {/* Heading */}
          <h1 className="text-2xl font-bold text-gray-800">
            Arogya<span className="text-green-600">Care</span>
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Join our healthcare community and manage your health journey
          </p>

        <form onSubmit={handleSignup} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span>👤</span> Personal Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name *"
                id="name"
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                id="phone"
                placeholder="Phone Number *"
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                id="email"
                placeholder="Email Address *"
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                id="address"
                placeholder="Address *"
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 sm:col-span-2"
                required
              />
              <input
                type="number"
                id="age"
                placeholder="Age *"
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
              <select
                id="gender"
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              <input
                type="password"
                id="password"
                placeholder="Password *"
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 sm:col-span-2"
                required
              />
            </div>
          </div>

          {/* Toggle for Medical Info */}
          <div className="border rounded-md p-3 bg-green-50">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                id="checker"
                checked={includeMedical}
                onChange={(e) => setIncludeMedical(e.target.checked)}
              />
              <span className="text-sm text-gray-700">
                Include Medical Details (Optional but Recommended)
              </span>
            </label>
          </div>

          {/* Medical Information */}
          {includeMedical && (
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span>💚</span> Medical Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="number"
                  id="weight"
                  placeholder="Weight (kg)"
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  id="height"
                  placeholder="Height (cm)"
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
                <select id="blood" className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500">
                  <option value="">Blood Group</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>O+</option>
                  <option>O-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                </select>
                <input
                  type="text"
                  id="vision"
                  placeholder="Vision Details (e.g., -2.5 both eyes)"
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  id="allergies"
                  placeholder="Allergies or Medical Conditions"
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 sm:col-span-2"
                />
                <input
                  type="text"
                  id="emergency"
                  placeholder="Emergency Contact Number"
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  id="doctor"
                  placeholder="Primary Doctor Contact"
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 rounded-lg font-medium"
          >
            Create Account
          </button>

          <p className="text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setLocation("/Login")}
              className="text-blue-600 font-medium hover:underline"
            >
              <Link to="/Login" >Back to Login</Link>
            </button>
          </p>

          <p className="text-xs text-gray-500 text-center mt-4">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  </div>
);
}
