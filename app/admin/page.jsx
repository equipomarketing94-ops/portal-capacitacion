'use client';

import React, { useState } from 'react';
import { Users, TrendingUp, Award, MapPin, Search, ChevronRight, BarChart3, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  // Base de datos simulada de los colaboradores inscritos
  const [colaboradores, setColaboradores] = useState([
    { id: "1017172306", nombre: "Nataly Martinez Orrego", cargo: "Colaboradora en Entrenamiento", progreso: 19, estado: "en curso", fecha: "09/04/2026" },
    { id: "71234567", nombre: "Juan Camilo Pérez", cargo: "Mesero", progreso: 100, estado: "completado", fecha: "01/04/2026" },
    { id: "43219876", nombre: "Maria Fernanda López", cargo: "Líder de Cocina", progreso: 45, estado: "en curso", fecha: "05/04/2026" },
    { id: "10203040", nombre: "Carlos Andrés Ruiz", cargo: "Cajero", progreso: 0, estado: "no iniciado", fecha: "09/04/2026" },
    { id: "11223344", nombre: "Sara Botero Madrid", cargo: "Representante Legal", progreso: 100, estado: "completado", fecha: "28/03/2026" }
  ]);

  // Cálculos matemáticos automáticos para las tarjetas de resumen
  const totalInscritos = colaboradores.length;
  const totalCompletados = colaboradores.filter(c => c.estado === 'completado').length;
  const totalEnCurso = colaboradores.filter(c => c.estado === 'en curso').length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      
      {/* Barra de Navegación de Administración */}
      <nav className="bg-slate-900 text-white p-4 shadow-xl border-b-4 border-blue-500 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <BarChart3 size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight leading-none">Portal de Seguimiento</h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Gestión Humana</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-orange-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">VISTA AL VUELO</span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-4 md:p-8 mt-4 space-y-8">
        
        {/* Tarjetas de Resumen (KPIs) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Users size={32} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total Inscritos</p>
              <h3 className="text-4xl font-black text-slate-800">{totalInscritos}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
              <Award size={32} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Certificados</p>
              <h3 className="text-4xl font-black text-slate-800">{totalCompletados}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
              <TrendingUp size={32} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">En Entrenamiento</p>
              <h3 className="text-4xl font-black text-slate-800">{totalEnCurso}</h3>
            </div>
          </div>
        </div>

        {/* Panel Central: Lista de Colaboradores */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          
          {/* Cabecera del panel con buscador */}
          <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Directorio de Capacitación</h2>
              <p className="text-sm text-slate-500">Monitorea el avance de tu equipo en tiempo real.</p>
            </div>
            <div className="relative w-full md:w-72">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar colaborador..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium"
              />
            </div>
          </div>

          {/* Tabla de Resultados */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <th className="p-6 font-semibold">Colaborador</th>
                  <th className="p-6 font-semibold hidden md:table-cell">Fecha de Ingreso</th>
                  <th className="p-6 font-semibold">Estado</th>
                  <th className="p-6 font-semibold text-right">Progreso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {colaboradores.map((colab) => (
                  <tr key={colab.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm shrink-0">
                          {colab.nombre.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{colab.nombre}</p>
                          <p className="text-xs text-slate-400 uppercase font-semibold mt-0.5">{colab.cargo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-sm text-slate-500 font-medium hidden md:table-cell">
                      {colab.fecha}
                    </td>
                    <td className="p-6">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        colab.estado === 'completado' ? 'bg-green-100 text-green-700' :
                        colab.estado === 'en curso' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {colab.estado === 'completado' ? <CheckCircle size={12} /> :
                         colab.estado === 'en curso' ? <TrendingUp size={12} /> : <Clock size={12} />}
                        {colab.estado}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-end gap-4">
                        <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden hidden md:block">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              colab.estado === 'completado' ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${colab.progreso}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-slate-700 w-10 text-right">{colab.progreso}%</span>
                        <button className="text-slate-300 hover:text-blue-600 transition-colors p-2">
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
    </div>
  );
}