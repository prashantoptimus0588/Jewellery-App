import React from 'react';
import Hero from '../components/Layout/Hero';

const Home = () => {
  return (
    <div className="flex flex-col gap-16 pb-16">
      
      {/* Reusable Hero Component */}
      <Hero />

      {/* --- Shop By Category Section --- */}
      <section className="container mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif text-[#832729] mb-3">Shop by Category</h2>
          <div className="w-16 h-1 bg-[#832729] mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           <div className="h-64 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center text-gray-400 font-serif">Category 1</div>
           <div className="h-64 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center text-gray-400 font-serif">Category 2</div>
           <div className="h-64 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center text-gray-400 font-serif">Category 3</div>
           <div className="h-64 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center text-gray-400 font-serif">Category 4</div>
        </div>
      </section>

    </div>
  );
};

export default Home;