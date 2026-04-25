'use client';

import React, { useState, useEffect } from 'react'; // ¡Aquí estaba el fantasma!
import { useRouter } from 'next/navigation';
import { User, PlayCircle, MapPin, FileText, Lock, ChevronDown, ChevronUp, BookOpen, LogOut, BarChart3, Loader2, Unlock, Timer } from 'lucide-react';
import Link from 'next/link';
import { db } from '../firebase'; 
import { doc, collection, getDocs, onSnapshot } from 'firebase/firestore';

export default function VistaAlVueloPortal() {
  const router = useRouter();
  const [moduloAbierto, setModuloAbierto] = useState(null);
  const [usuario, setUsuario] = useState({ nombre: '', apellido: '', documento: '', progresoTotal: 0, examenHabilitado: false });
  const [curriculum, setCurriculum] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const documentoId = localStorage.getItem('colaboradorActivo');
    if (!documentoId) {
      router.push('/');
      return;
    }

    // Escuchamos los cambios del usuario en tiempo real
    const docRef = doc(db, "colaboradores", documentoId);
    const unsubscribeUsuario = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setUsuario(docSnap.data());
      }
    });

    // Cargamos los módulos desde Firebase
    const cargarModulos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "curriculum"));
        const listaModulos = querySnapshot.docs.map(doc => ({
          id_db: doc.id,
          ...doc.data()
        }));
        listaModulos.sort((a, b) => a.id - b.id);
        setCurriculum(listaModulos);
      } catch (error) {
        console.error("Error cargando módulos:", error);
      } finally {
        setCargando(false);
      }
    };
    
    cargarModulos();

    // Limpiamos el "oyente" cuando el usuario sale de la página
    return () => unsubscribeUsuario();
  }, [router]);

  const cerrarSesion = () => {
    localStorage.removeItem('colaboradorActivo');
    router.push('/');
  };

  if (cargando) return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
      <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
      <p className="text-[10px] font-black uppercase tracking-widest">Sincronizando Portal...</p>
    </div>
  );

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
            
            {/* Recuerda poner tu cédula aquí si quieres que se vea el botón del Admin */}
            {String(usuario.documento) === '1128459431' && (
              <Link href="/admin" className="mt-4 inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-md">
                <BarChart3 size={14} /> Panel Administrativo
              </Link>
            )}
          </div>
        </div>

        {/* Banner de Estado del Examen */}
        <div className={`p-4 rounded-2xl flex items-center gap-4 ${
          usuario.examenHabilitado ? 'bg-green-100 border border-green-200' : 'bg-orange-100 border border-orange-200'
        }`}>
          <div className={`p-3 rounded-full ${usuario.examenHabilitado ? 'bg-green-200 text-green-700' : 'bg-orange-200 text-orange-700'}`}>
            {usuario.examenHabilitado ? <Unlock size={24} /> : <Lock size={24} />}
          </div>
          <div>
            <h3 className={`font-black ${usuario.examenHabilitado ? 'text-green-800' : 'text-orange-800'}`}>
              {usuario.examenHabilitado ? '¡Evaluación Habilitada!' : 'Evaluación Bloqueada'}
            </h3>
            <p className={`text-sm font-medium ${usuario.examenHabilitado ? 'text-green-700' : 'text-orange-700'}`}>
              {usuario.examenHabilitado 
                ? 'El administrador te ha dado acceso. Puedes iniciar el examen.' 
                : 'Debes estar en presencia del administrador para realizar la prueba.'}
            </p>
          </div>
        </div>

        {/* Ruta de Capacitación */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2 mt-8">Ruta de Capacitación</h3>
          
          {curriculum.map((modulo) => (
            <div key={modulo.id_db} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <button 
                onClick={() => setModuloAbierto(moduloAbierto === modulo.id ? null : modulo.id)} 
                className="w-full p-5 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-50 text-blue-600">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-800">{modulo.titulo}</h4>
                  </div>
                </div>
                <div className="text-slate-400">{moduloAbierto === modulo.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}</div>
              </button>
              
              {moduloAbierto === modulo.id && (
                <div className="p-4 bg-slate-50 border-t border-slate-100 grid gap-2">
                  {modulo.clases?.map((clase, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className={clase.tipo === 'examen' ? 'text-orange-500' : 'text-blue-500'}>
                          {clase.tipo === 'clase' ? <PlayCircle size={20} /> : <FileText size={20} />}
                        </div>
                        <span className="text-sm font-semibold text-slate-700">{clase.nombre}</span>
                      </div>
                      
                      {/* Control Inteligente del Examen */}
                      {clase.tipo === 'clase' ? (
                        <Link href="/clase" className="text-[10px] uppercase tracking-widest font-bold px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-orange-600 transition-colors">
                          Ver Clase
                        </Link>
                      ) : (
                        usuario.examenHabilitado ? (
                          <Link href={`/examen?modulo=${modulo.id}`} className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors shadow-sm">
                            <Timer size={14} /> Iniciar Prueba
                          </Link>
                        ) : (
                          <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold px-4 py-2 rounded-lg bg-slate-200 text-slate-400 cursor-not-allowed">
                            <Lock size={14} /> Bloqueado
                          </span>
                        )
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