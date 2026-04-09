'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  CheckCircle2, 
  PlayCircle, 
  Award, 
  LogOut, 
  BarChart3,
  ChevronRight,
  Clock
} from 'lucide-react';

// Importamos la conexión a Firebase
import { db } from '../firebase'; 
import { doc, getDoc } from 'firebase/firestore'; 

export default function PaginaProgreso() {
  const router = useRouter();
  
  // Estado para guardar los datos del colaborador
  const [usuario, setUsuario] = useState({
    nombre: 'Cargando...',
    apellido: '',
    progresoTotal: 0,
    estado: ''
  });

  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerDatosReales = async () => {
      try {
        // 1. Buscamos el "gafete" en la memoria del navegador
        const documentoId = localStorage.getItem('colaboradorActivo');

        if (!documentoId) {
          // Si no hay nadie logueado, mandamos al inicio
          router.push('/');
          return;
        }

        // 2. Consultamos en Firebase los datos de esa cédula
        const docRef = doc(db, "colaboradores", documentoId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUsuario(docSnap.data());
        } else {
          // Si por alguna razón el documento no existe, borramos memoria y fuera
          localStorage.removeItem('colaboradorActivo');
          router.push('/');
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerDatosReales();
  }, [router]);

  const cerrarSesion = () => {
    localStorage.removeItem('colaboradorActivo');
    router.push('/');
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-bold tracking-widest uppercase text-xs">Cargando tu progreso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* HEADER DE BIENVENIDA */}
      <div className="bg-slate-900 text-white pt-12 pb-24 px-6 md:px-12 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-6">
          <div>
            <div className="flex items-center gap-2 text-orange-500 mb-4">
              <BarChart3 size={20} />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Panel de Control</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black mb-2">
              Hola, <span className="text-orange-500">{usuario.nombre}</span> 👋
            </h1>
            <p className="text-slate-400 font-medium">
              Este es el avance de tu formación en <strong className="text-white">Vista al Vuelo</strong>.
            </p>
          </div>

          <button 
            onClick={cerrarSesion}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-white/10"
          >
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </div>

      {/* TARJETAS DE ESTADO */}
      <div className="max-w-6xl mx-auto px-6 -mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card: Progreso General */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <div className="p-3 bg-orange-100 rounded-2xl text-orange-600">
                <CheckCircle2 size={24} />
              </div>
              <span className="text-3xl font-black text-slate-800">{usuario.progresoTotal}%</span>
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Progreso Total</p>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-orange-500 h-full transition-all duration-1000" 
                style={{ width: `${usuario.progresoTotal}%` }}
              ></div>
            </div>
          </div>

          {/* Card: Próximo Paso */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
            <div className="p-3 bg-blue-100 rounded-2xl text-blue-600 w-fit mb-6">
              <PlayCircle size={24} />
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Siguiente Clase</p>
            <h3 className="text-xl font-black text-slate-800">Introducción al Servicio</h3>
          </div>

          {/* Card: Logros */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
            <div className="p-3 bg-yellow-100 rounded-2xl text-yellow-600 w-fit mb-6">
              <Award size={24} />
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Certificaciones</p>
            <h3 className="text-xl font-black text-slate-800">
              {usuario.progresoTotal === 100 ? '¡Certificado Disponible!' : '0 Completadas'}
            </h3>
          </div>

        </div>
      </div>

      {/* LISTA DE MÓDULOS */}
      <div className="max-w-4xl mx-auto px-6 mt-16">
        <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
          <BookOpen className="text-orange-500" /> Plan de Capacitación
        </h2>

        <div className="space-y-4">
          {[
            { id: 1, titulo: "Bienvenida y Cultura Organizacional", duracion: "15 min", estado: "completado" },
            { id: 2, titulo: "Protocolos de Seguridad en Parapente", duracion: "45 min", estado: "pendiente" },
            { id: 3, titulo: "Atención al Cliente Premium", duracion: "30 min", estado: "bloqueado" },
          ].map((modulo) => (
            <div 
              key={modulo.id}
              className={`group flex items-center justify-between p-6 rounded-2xl border transition-all cursor-pointer
                ${modulo.estado === 'completado' ? 'bg-white border-green-100' : 'bg-white border-slate-100 hover:border-orange-200'}
              `}
              onClick={() => modulo.estado !== 'bloqueado' && router.push('/clase')}
            >
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black
                  ${modulo.estado === 'completado' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}
                `}>
                  {modulo.estado === 'completado' ? <CheckCircle2 size={24} /> : modulo.id}
                </div>
                <div>
                  <h4 className={`font-bold ${modulo.estado === 'bloqueado' ? 'text-slate-300' : 'text-slate-800'}`}>
                    {modulo.titulo}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium mt-1">
                    <span className="flex items-center gap-1"><Clock size={12} /> {modulo.duracion}</span>
                  </div>
                </div>
              </div>
              
              {modulo.estado !== 'bloqueado' && (
                <ChevronRight className="text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}