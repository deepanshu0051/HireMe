import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Briefcase, Menu, X, Bell, Search } from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "../../utils/cn";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Find Jobs", href: "/jobs" },
    { name: "Companies", href: "/companies" },
    { name: "Salaries", href: "/salaries" },
    { name: "Dashboard", href: "/" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b border-transparent",
        isScrolled
          ? "bg-white/80 backdrop-blur-lg border-gray-100 py-3 shadow-sm"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Briefcase className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              HireMe
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600",
                  location.pathname === link.href
                    ? "text-blue-600"
                    : "text-gray-500"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Search size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-6 w-px bg-gray-200 mx-2" />
            <Button variant="ghost" size="sm">Log In</Button>
            <Button size="sm">Sign Up</Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 top-[73px] bg-white z-[99] md:hidden transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="block py-4 text-lg font-medium border-b border-gray-50 text-gray-900"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 space-y-4">
            <Button className="w-full" size="lg">Sign Up</Button>
            <Button className="w-full" variant="outline" size="lg">Log In</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export { Navbar };
