import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { WarningBanner } from '../components/WarningBanner';
import { AgeGateModal } from '../components/AgeGateModal';

export const CustomerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <AgeGateModal />
      <WarningBanner />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
