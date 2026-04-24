'use client';

import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Award, MapPin, Search, BarChart3, CheckCircle, Clock, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Importamos la conexión real a tu base de datos
import { db } from '../firebase'; 
import { collection, getDocs } from 'firebase/firestore';

export default function AdminDashboard() {
  const [colaboradores, setColaboradores] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  // Traer los datos reales
  useEffect(() => {
    const cargarDatosReales = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "colaboradores"));
        const listaReal = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setColaboradores(listaReal);
      } catch (error) {
        console.error("Error al conectar con la base de datos:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarDatosReales();
  }, []);

  // Lógica de búsqueda dinámica
  const filtrados = colaboradores.filter(colab =>
    colab.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    colab.documento?.includes(busqueda)
  );

  // Cálculos automáticos 
  const totalInscritos = colaboradores.length;
  const totalCompletados = colaboradores.filter(c => c.progresoTotal === 100).length;
  const totalEnCurso = colaboradores.filter(c => c.progresoTotal > 0 && c.progresoTotal < 100).length;

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
        <p className="text-slate-400 font-black text-[10px] tracking-widest uppercase">Cargando datos reales...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      
      {/* Barra de Navegación */}
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
          <Link href="/progreso" className="flex items-center gap-2 hover:bg-white/10 px-3 py-1 rounded-lg transition-all text-xs font-bold uppercase tracking-widest text-slate-300">
            <ArrowLeft size={14} /> Volver al Portal
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-4 md:p-8 mt-4 space-y-8">
        
        {/* Tarjetas de Resumen */}
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

        {/* Panel Central: Lista de Colaboradores Reales */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          
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
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm font-medium"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <th className="p-6">Colaborador</th>
                  <th className="p-6 hidden md:table-cell">Cédula</th>
                  <th className="p-6">Estado</th>
                  <th className="p-6 text-right">Progreso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtrados.map((colab) => (
                  <tr key={colab.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm shrink-0 uppercase">
                          {colab.nombre?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 capitalize">{colab.nombre} {colab.apellido}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-sm text-slate-500 font-medium hidden md:table-cell">
                      {colab.documento}
                    </td>
                    <td className="p-6">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        colab.progresoTotal === 100 ? 'bg-green-100 text-green-700' :
                        colab.progresoTotal > 0 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {colab.progresoTotal === 100 ? <CheckCircle size={12} /> :
                         colab.progresoTotal > 0 ? <TrendingUp size={12} /> : <Clock size={12} />}
                        {colab.progresoTotal === 100 ? 'Completado' : colab.progresoTotal > 0 ? 'En Curso' : 'No Iniciado'}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-end gap-4">
                        <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden hidden md:block">
                          <div 
                            className={`h-full rounded-full transition-all ${colab.progresoTotal === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${colab.progresoTotal || 0}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-slate-700 w-10 text-right">{colab.progresoTotal || 0}%</span>
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