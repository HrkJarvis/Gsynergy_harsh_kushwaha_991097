import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Zap, BarChart2, Filter, FileText } from "lucide-react";

const Home: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-blue-50 text-gray-900">
      {/* Hero Section */}
      <div className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-200 opacity-30 blur-xl"></div>
          <div className="absolute top-32 -left-20 w-80 h-80 rounded-full bg-indigo-200 opacity-30 blur-xl"></div>
          <div className="absolute bottom-20 right-32 w-48 h-48 rounded-full bg-purple-200 opacity-20 blur-xl"></div>
        </div>
        
        {/* Content */}
        <div className="z-10 text-center px-6">
          <h1 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 leading-tight">
            Discover Insights.
            <span className="block mt-2">Visualize Data.</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto">
            The ultimate platform for data visualization and business intelligence that transforms complex information into actionable insights.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <button className="group bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
            <Link href="/demo">
              <button className="bg-white text-indigo-600 border-2 border-indigo-100 px-8 py-4 rounded-xl text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                Watch Demo
              </button>
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <span className="text-sm text-gray-500 mb-2">Explore More</span>
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center items-start p-1">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto py-24 px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-2">Powerful Features</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-indigo-600 mx-auto"></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            Our platform offers intuitive tools that help you make data-driven decisions with confidence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { 
              title: "Real-time Data", 
              desc: "Track insights in real-time with live updates and instant notifications.", 
              icon: <Zap className="w-10 h-10 text-blue-500" /> 
            },
            { 
              title: "Interactive Charts", 
              desc: "Visualize complex data using powerful and customizable chart tools.", 
              icon: <BarChart2 className="w-10 h-10 text-indigo-500" /> 
            },
            { 
              title: "Intelligent Filters", 
              desc: "Quickly refine results with smart filtering and advanced search options.", 
              icon: <Filter className="w-10 h-10 text-purple-500" /> 
            },
            { 
              title: "Custom Reports", 
              desc: "Generate and export detailed analytics tailored to your business needs.", 
              icon: <FileText className="w-10 h-10 text-blue-500" /> 
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="relative p-8 rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-xl group transition-all duration-300"
            >
              <div className="absolute top-0 left-0 w-full h-full rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="text-center py-20 px-6 bg-gradient-to-r from-indigo-900 to-blue-900 text-white">
        <h2 className="text-4xl font-bold">Explore Key Features</h2>
        <p className="mt-4 mb-10 max-w-xl mx-auto">
          Dive deep into the specialized tools that make our platform unique in the industry.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          {[
            { name: "Store Dimension", link: "/store-dimension" },
            { name: "SKU Dimension", link: "/sku-dimension" },
            { name: "Planning Screen", link: "/planning" },
            { name: "Analytics Dashboard", link: "/analytics" },
          ].map((item, index) => (
            <Link key={index} href={item.link}>
              <button className="group relative bg-white/10 backdrop-blur-sm hover:bg-white/20 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 overflow-hidden">
                <span className="relative z-10">{item.name}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Testimonials or CTA Section could be added here */}
      
      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-indigo-600 mb-6">Ready to transform your data?</h3>
          <Link href="/signup">
            <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              Start Free Trial
            </button>
          </Link>
          <p className="mt-10 text-gray-500">© 2025 DataViz Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;