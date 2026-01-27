"use client";

import React, { useMemo, useRef, useState } from "react";

/* import Image from "next/image"; */

import { 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle,
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';

const INITIAL_STUDENTS = [
  {
    id: 1,
    nome: "Ana Silva",
    serie: "3º EM",
    frequencia: 95,
    media: 8.5,
    risco: "baixo",
  },
  {
    id: 2,
    nome: "Bruno Gomes",
    serie: "3º EM",
    frequencia: 65,
    media: 4.2,
    risco: "alto",
  },
  {
    id: 3,
    nome: "Carla Souza",
    serie: "2º EM",
    frequencia: 82,
    media: 6.8,
    risco: "medio",
  },
  {
    id: 4,
    nome: "Diego Lima",
    serie: "1º EM",
    frequencia: 98,
    media: 9.1,
    risco: "baixo",
  },
  {
    id: 5,
    nome: "Elisa Martins",
    serie: "2º EM",
    frequencia: 70,
    media: 5.5,
    risco: "alto",
  },
  {
    id: 6,
    nome: "Fábio Junior",
    serie: "1º EM",
    frequencia: 85,
    media: 7.2,
    risco: "medio",
  },
  {
    id: 7,
    nome: "Giovanna N.",
    serie: "3º EM",
    frequencia: 92,
    media: 8.0,
    risco: "baixo",
  },
  {
    id: 8,
    nome: "Henrique P.",
    serie: "2º EM",
    frequencia: 60,
    media: 3.9,
    risco: "alto",
  },
];

const COLORS = {
  alto: "#ef4444",
  medio: "#f59e0b",
  baixo: "#10b981",
  primary: "#1a73e8",
  secondary: "#5f6368",
};

const Dashboard = () => {
  const [students, setStudents] = useState(INITIAL_STUDENTS);

  const statsData = useMemo(() => {
    const counts = { alto: 0, medio: 0, baixo: 0 };
    students.forEach((s) => counts[s.risco]++);
    return [
      { name: "Risco Alto", value: counts.alto, color: COLORS.alto },
      { name: "Risco Médio", value: counts.medio, color: COLORS.medio },
      { name: "Risco Baixo", value: counts.baixo, color: COLORS.baixo },
    ];
  }, [students]);

  const seriesData = [
    { name: "1º EM", evasao: 12, matriculados: 120 },
    { name: "2º EM", evasao: 8, matriculados: 110 },
    { name: "3º EM", evasao: 15, matriculados: 95 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 space-y-8 p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className={`p-2.5 rounded-xl w-fit mb-4 bg-white text-blue-600`}>
            <Users className="text-blue-600" />
          </div>
          <div className="space-y-1">
            <h4 className="text-gray-500 text-sm">Total de Alunos</h4>
            <p className="text-3xl font-bold text-gray-900">
              {students.length}
            </p>
            <p className="text-xs text-gray-400">Ativos</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className={`p-2.5 rounded-xl w-fit mb-4 bg-red-50 text-red-600`}>
            <AlertTriangle />
          </div>
          <div className="space-y-1">
            <h4 className="text-gray-500 text-sm">Risco Alto</h4>
            <p className="text-3xl font-bold text-gray-900">
              {students.filter((s) => s.risco === "alto").length}
            </p>
            <p className="text-xs text-gray-400">Urgente</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div
            className={`p-2.5 rounded-xl w-fit mb-4 bg-amber-50 text-amber-600`}
          >
            <HelpCircle />
          </div>
          <div className="space-y-1">
            <h4 className="text-gray-500 text-sm">Risco Médio</h4>
            <p className="text-3xl font-bold text-gray-900">
              {students.filter((s) => s.risco === "medio").length}
            </p>
            <p className="text-xs text-gray-400">Atenção</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div
            className={`p-2.5 rounded-xl w-fit mb-4 bg-emerald-50 text-emerald-600`}
          >
            <CheckCircle />
          </div>
          <div className="space-y-1">
            <h4 className="text-gray-500 text-sm">Risco Baixo</h4>
            <p className="text-3xl font-bold text-gray-900">
              {students.filter((s) => s.risco === "baixo").length}
            </p>
            <p className="text-xs text-gray-400">Estável</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Distribuição de Risco</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statsData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Evasão por Série</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={seriesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  cursor={{ fill: "#f3f4f6" }}
                  contentStyle={{ borderRadius: "12px", border: "none" }}
                />
                <Bar
                  dataKey="evasao"
                  fill={COLORS.primary}
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
