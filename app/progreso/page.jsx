'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { 
  BookOpen, 
  ChevronRight, 
  User, 
  LogOut,
  Trophy,
  Star,
  Settings,
  FileEdit // Nuevo icono para el examen
} from 'lucide-react';

export default function PaginaProgreso() {
  const router = useRouter();
  const [colaborador, setColaborador] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      const idGuardado = localStorage.getItem('colaboradorActivo');
      if (!idGuardado) {
        router.push('/');
        return;
      }

      try {
        const docRef = doc(db, "colaboradores", idGuardado);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setColaborador(docSnap.data());
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, [router]);

  const cerrarSesion = () => {
    localStorage.removeItem('colaboradorActivo');
    window.location.href = '/';
  };

  // FUNCIÓN INTELIGENTE DE NAVEGACIÓN
  const manejarClickModulo = () => {
    if (colaborador?.examenHabilitado) {
      // Si tú lo activaste desde el admin, va directo al examen
      router.push('/examen?modulo=modulo_1');
    } else {
      // Si no está activo, va a la clase primero
      router.push('/clase');
    }
  };

  if (cargando) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-black uppercase tracking-widest text-[10px]">
      Cargando...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <nav className="bg-slate-900 text-white p-6 shadow-xl border-b-4 border-orange-500">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <User size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Panel Colaborador</p>
              <h1 className="text-xl font-bold">{colaborador?.nombre}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => router.push('/admin')} className="p-3 hover:bg-orange-500 rounded-xl transition-all flex items-center gap-2 text-orange-500 hover:text-white">
              <Settings size={20} />
              <span className="text-[10px] font-black uppercase hidden md:block">Admin</span>
            </button>
            <button onClick={cerrarSesion} className="p-3 hover:bg-red-500 rounded-xl transition-all">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-[1.5rem] flex items-center justify-center"><Trophy size={32} /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progreso</p>
              <p className="text-3xl font-black text-slate-900">{colaborador?.progresoTotal || 0}%</p>
            </div>
          </div>
          {/* ... otras tarjetas ... */}
        </div>

        <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full" /> Ruta de Aprendizaje
        </h2>

        <div className="space-y-4">
          <div 
            onClick={manejarClickModulo} 
            className={`group p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6 ${colaborador?.examenHabilitado ? 'bg-orange-50 border-orange-500 shadow-orange-100 shadow-xl' : 'bg-white border-slate-100 shadow-sm hover:border-orange-500'}`}
          >
            <div className="flex items-center gap-6">
              <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-white relative overflow-hidden transition-colors ${colaborador?.examenHabilitado ? 'bg-orange-500' : 'bg-slate-900'}`}>
                {colaborador?.examenHabilitado ? <FileEdit size={30} /> : <span className="text-2xl font-black">01</span>}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Módulo 1: Conociendo Vista al Vuelo</h3>
                <p className="text-slate-500 font-medium">
                  {colaborador?.examenHabilitado ? '¡Tu examen está listo! Haz clic para iniciar.' : 'Contenido de estudio disponible.'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${colaborador?.examenHabilitado ? 'bg-orange-500 text-white border-orange-400 animate-bounce' : 'bg-slate-100 text-slate-500'}`}>
                {colaborador?.examenHabilitado ? 'PRESENTAR EXAMEN' : 'ESTUDIAR'}
              </div>
              <ChevronRight className={colaborador?.examenHabilitado ? 'text-orange-500' : 'text-slate-300'} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}