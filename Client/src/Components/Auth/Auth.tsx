import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { MountainIcon } from "../Admin/List/List";

export function Auth() {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // console.log(cookies);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (email === "" || password === "") {
      setError("Please fill in all fields");
      return;
    }
    const response = await fetch("http://localhost:4000/login", {
      method: "POST", // Changed to POST
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }), // Changed to password
    });
    const data = await response.json();

    if (data.detail) {
      setError(data.detail);
    } else {
      setCookie("Email", data.email);
      setCookie("authToken", data.token);
      window.location.href = "/manager";
    }
  };

  return (
    <div className="bg-black flex flex-col items-center justify-center min-h-screen py-12 space-y-4 text-center md:space-y-8">
      <form className="w-full max-w-sm space-y-2" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <div className="flex items-center justify-between pb-3">
            <h1 className="text-3xl font-bold text-white">Welcome</h1>
            <Link className="lg" to="/">
              <MountainIcon className="h-6 w-6 text-white" />
              <span className="sr-only">Home</span>
            </Link>
          </div>

          <p className="text-white dark:text-gray-400">
            Enter your email below to login to your account
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              style={{ color: "white" }}
              id="email"
              placeholder="m@example.com"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              style={{ color: "white" }}
              id="password"
              required
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}
