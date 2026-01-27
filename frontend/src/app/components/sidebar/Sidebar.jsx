"use client";

import React, { useState, useMemo, useRef } from "react";
import { usePathname, useRouter } from 'next/navigation';
import { 
  Users, 
  LayoutDashboard, 
  TrendingDown,
  LogOut,
} from 'lucide-react';

const Sidebar = () => {
  const router = useRouter();
  const pathName = usePathname(); 

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-0 h-screen">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-xl shadow-sm shadow-blue-100">
          <Users className="text-white w-4 h-4" />
        </div>
        <h1 className="text-2xl font-black tracking-tighter text-blue-900">
          EdTech
        </h1>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        <button
          onClick={() => router.push('/')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathName === "/" ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-800 hover:bg-gray-100"}`}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </button>
        <button
          onClick={() => router.push('alunos')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathName === "/alunos" ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-800 hover:bg-gray-100"}`}
        >
          <Users size={20} />
          Alunos
        </button>
        <button 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-800 hover:bg-gray-100"
        >
          <TrendingDown size={20} />
          Relatórios
        </button>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gray-100 rounded-xl p-4 mb-4 text-xs text-gray-500">
          <p className="font-semibold text-gray-700 mb-1">IA EdTech</p>
          Análise atualizada hoje.
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors">
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
