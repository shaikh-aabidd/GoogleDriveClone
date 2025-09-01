// src/components/MainLayout.jsx
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Header, Loader } from '../components'; // Assuming Loader is also a component
import Footer from '../components/Footer';
import { Toaster } from "@/components/ui/sonner"
import { CategoriesBar } from '../components';

const MainLayout = () => {
  const location = useLocation();
  const isChatPage = location.pathname === '/chat';

  return (
    <div className="min-h-screen flex flex-col bg-mainBg">
      {/* Header */}
      <Toaster richColors />

      <Header />
      {/* CategoriesBar might also need conditional rendering if it interferes with chat layout */}
      {!isChatPage && <CategoriesBar />} 

      {/* Main Content Area */}
      <main className={`flex-grow ${isChatPage ? '' : 'container mx-auto'}`}>
        <Outlet/>
      </main>

      {/* Footer - Conditionally rendered */}
      {!isChatPage && <Footer/>}
    </div>
  );
};

export default MainLayout;