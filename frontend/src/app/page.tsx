import React from "react";

//components
import Header from "@/components/shared/Headers/Header";
import Hero from "@/components/home/Hero";
import MasonaryGrid from "@/components/home/MasonaryGrid";
import PlanningSteps from "@/components/home/PlanningSteps";
import Testimonials from "@/components/home/Testimonials";
import Subscribe from "@/components/home/Subscribe";
import Footer from "@/components/shared/Footer";

export default function Page() {
  return (
    <div className="min-h-screen bg-lightYellow dark:bg-darkBg text-gray-900 dark:text-zinc-100 transition-colors duration-200 flex flex-col justify-between">
      <Header />
      <main className="flex-1">
        <Hero />
        <MasonaryGrid />
        <PlanningSteps />
        <Subscribe />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
