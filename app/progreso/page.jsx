'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, CheckCircle, PlayCircle, MapPin, FileText, Lock, ChevronDown, ChevronUp, BookOpen, LogOut, BarChart3 } from 'lucide-react';
import Link from 'next/link';

// Importamos la conexión a Firebase
import { db } from '../firebase'; 
import { doc, getDoc } from 'firebase/firestore';

export default function VistaAlVueloPortal() {
  const router = useRouter();
  const [moduloAbierto, setModuloAbierto] = useState(1);
  
  // Variables dinámicas para el usuario
  const [usuario, setUsuario] = useState({ nombre: 'Cargando...', apellido: '', documento: '', progresoTotal: 0 });
  const [cargando, setCargando] = useState(true);

  // Tu currículum original
  const curriculum = [
    {
      id: 1,
      titulo: "Módulo 1: Conociendo nuestra empresa",
      progreso: 100,
      estado: "completado",
      clases: [
        { id: "1a", nombre: "Quiénes somos", tipo: "clase", estado: "completado" },
        { id: "1b", nombre: "Examen: Quiénes somos", tipo: "examen", estado: "completado" },
        { id: "1c", nombre: "Misión y visión", tipo: "clase", estado: "completado" },
        { id: "1d", nombre: "Examen: Misión y visión", tipo: "examen", estado: "completado" },
        { id: "1e", nombre: "Qué hacemos", tipo: "clase", estado: "completado" },
        { id: "1f", nombre: "Examen: Qué hacemos", tipo: "examen", estado: "completado" },
        { id: "1g", nombre: "Qué queremos", tipo: "clase", estado: "completado" },
        { id: "1h", nombre: "Examen: Qué queremos", tipo: "examen", estado: "completado" },
        { id: "1i", nombre: "Nuestros valores empresariales", tipo: "clase", estado: "completado" },
        { id: "1j", nombre: "Examen: Valores", tipo: "examen", estado: "completado" },
        { id: "1k", nombre: "EXAMEN FINAL", tipo: "final", estado: "completado" }
      ]
    },
    {
      id: 2,
      titulo: "Módulo 2: Reglamento Interno",
      progreso: 15,
      estado: "en curso",
      clases: [
        { id: "2a", nombre: "Ingreso, Contratos y Jornadas", tipo: "clase", estado: "completado" },
        { id: "2b", nombre: "Examen: Ingreso y Jornadas", tipo: "examen", estado: "en curso" },
        { id: "2c", nombre: "Descansos, Vacaciones y Permisos", tipo: "clase", estado: "bloqueado" },
        { id: "2d", nombre: "Examen: Descansos y Permisos", tipo: "examen", estado: "bloqueado" },
        { id: "2e", nombre: "Salarios, Beneficios y Seguridad", tipo: "clase", estado: "bloqueado" },
        { id: "2f", nombre: "Examen: Salarios y Seguridad", tipo: "examen", estado: "bloqueado" },
        { id: "2g", nombre: "Obligaciones, Prohibiciones y Sanciones", tipo: "clase", estado: "bloqueado" },
        { id: "2h", nombre: "Examen: Obligaciones y Sanciones", tipo: "examen", estado: "bloqueado" },
        { id: "2i", nombre: "EXAMEN FINAL: Reglamento", tipo: "final", estado: "bloqueado" }
      ]
    },
    {
      id: 3, titulo: "Módulo 3: Capacitación Bar", progreso: 0, estado: "bloqueado",
      clases: [
        { id: "3a", nombre: "Coctelería", tipo: "clase", estado: "bloqueado" },
        { id: "3b", nombre: "Licores", tipo: "clase", estado: "bloqueado" },
        { id: "3g", nombre: "EXAMEN FINAL: Bar", tipo: "final", estado: "bloqueado" }
      ]
    },
    {
      id: 4, titulo: "Módulo 4: Preparación Alimentos", progreso: 0, estado: "bloqueado",
      clases: [
        { id: "4a", nombre: "Asadero y Arepas", tipo: "clase", estado: "bloqueado" },
        { id: "4b", nombre: "Restaurante y Menú", tipo: "clase", estado: "bloqueado" },
        { id: "4f", nombre: "EXAMEN FINAL: Alimentos", tipo: "final", estado: "bloqueado" }
      ]
    },
    {
      id: 5, titulo: "Módulo 5: Aseo y Mantenimiento", progreso: 0, estado: "bloqueado",
      clases: [
        { id: "5a", nombre: "Uso de Químicos", tipo: "clase", estado: "bloqueado" },
        { id: "5b", nombre: "Manipulación y Protocolos", tipo: "clase", estado: "bloqueado" },
        { id: "5e", nombre: "EXAMEN FINAL: Aseo", tipo: "final", estado: "bloqueado" }
      ]
    },
    {
      id: 6, titulo: "Módulo 6: Liderazgo y Cultura", progreso: 0, estado: "bloqueado",
      clases: [
        { id: "6a", nombre: "Administración básica", tipo: "clase", estado: "bloqueado" },
        { id: "6b", nombre: "Compañeros y Respeto", tipo: "clase", estado: "bloqueado" },
        { id: "6e", nombre: "EXAMEN FINAL: Liderazgo", tipo: "final", estado: "bloqueado" }
      ]
    }
  ];

  useEffect(() => {
    const obtenerDatosReales = async () => {
      try {
        const documentoId = localStorage.getItem('colaboradorActivo');
        if (!documentoId) {
          router.push('/');
          return;
        }
        const docRef = doc(db, "colaboradores", documentoId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUsuario(docSnap.data());
        } else {
          localStorage.removeItem('colaboradorActivo');
          router.push('/');
        }
      } catch (error) {
        console.error("Error:", error);
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

  const toggleModulo = (id) => {
    setModuloAbierto(moduloAbierto === id ? null : id);
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      <nav className="bg-slate-900 text-white p-4 shadow-xl border-b border-orange-500/30 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <MapPin className="text-orange-500" /> VISTA AL VUELO
          </h1>
          <button onClick={cerrarSesion} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-white/10 hover:bg-white/20 px-3 py-2 rounded transition-all">
            <LogOut size={14} /> Salir
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        <div className="bg-white rounded-3xl shadow-sm p-6 border border-slate-100 flex items-center gap-6">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border-2 border-slate-50 shadow-inner shrink-0 overflow-hidden">
            <User size={40} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-black text-slate-800 capitalize">{usuario.nombre} {usuario.apellido}</h2>
            <p className="text-orange-600 font-bold uppercase text-xs tracking-widest mt-1">Colaborador en Entrenamiento</p>
            <p className="text-sm text-slate-500 mt-2">Progreso Total: <strong className="text-slate-800">{usuario.progresoTotal}%</strong></p>
            
            {/* BOTÓN SECRETO PARA EL ADMINISTRADOR */}
            {usuario.documento === '1128459431' && (
              <Link 
                href="/admin" 
                className="mt-4 inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-md"
              >
                <BarChart3 size={14} /> Panel de Control Administrativo
              </Link>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2 mt-8">Ruta de Capacitación</h3>
          {curriculum.map((modulo) => (
            <div key={modulo.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <button onClick={() => toggleModulo(modulo.id)} className="w-full p-5 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4 text-left">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${modulo.estado === 'completado' ? 'bg-green-100 text-green-600' : modulo.estado === 'en curso' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400'}`}>
                    {modulo.estado === 'completado' ? <CheckCircle size={24} /> : modulo.estado === 'bloqueado' ? <Lock size={24} /> : <BookOpen size={24} />}
                  </div>
                  <div>
                    <h4 className={`font-bold text-lg ${modulo.estado === 'bloqueado' ? 'text-slate-400' : 'text-slate-800'}`}>{modulo.titulo}</h4>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mt-1">Progreso: {modulo.progreso}%</p>
                  </div>
                </div>
                <div className="text-slate-400">{moduloAbierto === modulo.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}</div>
              </button>
              {moduloAbierto === modulo.id && (
                <div className="p-4 bg-slate-50 border-t border-slate-100 grid gap-2">
                  {modulo.clases.map((clase) => (
                    <div key={clase.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className={`${clase.estado === 'completado' ? 'text-green-500' : clase.estado === 'bloqueado' ? 'text-slate-300' : clase.tipo === 'examen' || clase.tipo === 'final' ? 'text-orange-500' : 'text-blue-500'}`}>
                          {clase.estado === 'completado' ? <CheckCircle size={20} /> : clase.estado === 'bloqueado' ? <Lock size={20} /> : clase.tipo === 'clase' ? <PlayCircle size={20} /> : <FileText size={20} />}
                        </div>
                        <span className={`text-sm font-semibold ${clase.estado === 'bloqueado' ? 'text-slate-400' : 'text-slate-700'}`}>{clase.nombre}</span>
                      </div>
                      {clase.estado !== 'bloqueado' && (
                        <Link href={clase.tipo === 'clase' ? '/clase' : '/examen'} className={`text-[10px] uppercase tracking-widest font-bold px-4 py-2 rounded-lg transition-colors ${clase.estado === 'completado' ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' : 'bg-slate-900 text-white hover:bg-orange-600'}`}>
                          {clase.estado === 'completado' ? 'Repasar' : clase.tipo === 'clase' ? 'Ver Clase' : 'Evaluar'}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}