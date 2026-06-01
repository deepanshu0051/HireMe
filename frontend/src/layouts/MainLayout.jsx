import React from "react";
import { Toaster } from "sonner";
import { Navbar } from "../components/shared/Navbar";
import { Footer } from "../components/shared/Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-row">
       {/* Sidebar could go here if needed, but for now we'll stick to a main container */}
       <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 pt-24 pb-12">
            {children}
          </main>
          <Footer />
       </div>
       <Toaster position="top-right" richColors />
    </div>
  );
};

export { MainLayout };
