'use client'

import React, { useState } from "react";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Headers/Header";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginVendor as loginVendorAPI } from "@/api/auth/vendor.auth.api";
import { useVendorAuth } from "@/contexts/VendorAuthContext";
import { toast } from 'react-hot-toast';

const VendorLoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { login } = useVendorAuth();
    const router = useRouter();

   const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  try {
    // Send login request to backend
    const response = await loginVendorAPI(email, password);

    // Check if login was successful
    if (response && response.message === 'Login successful') {
      // Read token from cookie (backend sets it in cookie)
      const storedToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('access_tokenVendor='));

      if (storedToken) {
        const token = storedToken.split('=')[1];
        
        // Store token and trigger context login
        login(token);

        // Show success message
        toast.success('Login successful!', {
          style: { background: '#333', color: '#fff' },
        });

        // Redirect to dashboard
        router.push('/vendor-dashboard');
      } else {
        // Token not found in cookie
        setError('No token received. Please try again.');
        toast.error('No token received. Please try again.', {
          style: { background: '#333', color: '#fff' },
        });
      }
    } else {
      setError('Login failed. Please try again.');
      toast.error('Login failed. Please try again.', {
        style: { background: '#333', color: '#fff' },
      });
    }
  } catch (err) {
    console.error('Login failed:', err);
    setError('Invalid credentials. Please try again.');
    toast.error('Invalid credentials. Please try again.', {
      style: { background: '#333', color: '#fff' },
    });
  }
};


    return (
      <div>
          <Header />

          <div className="relative z-10 w-full h-[500px] md:h-[650px]">
              <Image
                src="/images/login-signup.webp"
                layout="fill"
                objectFit="cover"
                alt="sign image"
              />
              <div className="absolute inset-0 font-body">
                  <div className="flex flex-col justify-center items-center text-center">
                      <div className="bg-white bg-opacity-70 my-8 md:mt-20 w-[350px] md:w-[400px] border-solid border-black border-2 border-opacity-60 rounded-md p-8">
                          <h1 className="text-text mx-[20px] text-3xl font-bold text-center font-title">
                              Login to your account
                          </h1>
                          <form onSubmit={handleSubmit}>
                              <div className="mt-6 flex space-x-2 justify-center">
                                  <label
                                    htmlFor="terms"
                                    className="text-lg text-left leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                      Enter your email and password{" "}
                                  </label>
                              </div>
                              <div className="mt-6 grid grid-cols-1 w-full items-center gap-x-12 gap-y-5">
                                  <div className="border-black border-solid border-2 rounded-lg flex flex-row space-y-1.5">
                                      <Input
                                        className="h-8"
                                        type="email"
                                        id="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)} // Set email state
                                        required
                                      />
                                  </div>
                                  <div className="border-black border-solid border-2 rounded-lg flex flex-row space-y-1.5">
                                      <Input
                                        className="h-8"
                                        type="password"
                                        id="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)} // Set password state
                                        required
                                      />
                                  </div>
                              </div>
                              {/* Show error message */}
                              {error && <p className="text-red-500 mt-2">{error}</p>}

                              <div className="border-black rounded-md border-2 mt-6 flex flex-col w-full border-solid bg-primary ">
                                  <Button
                                    type="submit" // Submit button for the form
                                    className="rounded-none text-black font-bold hover:bg-primary bg-primary text-xl"
                                  >
                                      Login
                                  </Button>
                              </div>
                          </form>
                          <div className="mt-6 flex space-x-2 justify-center">
                              <label
                                htmlFor="terms"
                                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                  <Link href="/">Forgot password?</Link>
                              </label>
                          </div>
                          <div className="mt-6 flex space-x-2 justify-center">
                              <label
                                htmlFor="terms"
                                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                  Don&apos;t have an account?
                                  <Link href="/sign-up" className="underline ">
                                      Register Here
                                  </Link>
                              </label>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <Footer />
      </div>
    );
};

export default VendorLoginPage;
