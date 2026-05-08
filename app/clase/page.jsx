'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { 
  ArrowLeft, 
  CheckCircle, 
  ChevronRight, 
  FileText, 
  Loader2,
  BookOpen,
  Scale,
  AlertTriangle,
  ShieldCheck,
  Users,
  Map
} from 'lucide-react';

const obtenerIcono = (icono) => {
  const iconos = {
    ley:        <Scale size={22} className="text-orange-500" />,
    definicion: <BookOpen size={22} className="text-orange-500" />,
    tipos:      <AlertTriangle size={22} className="text-orange-500" />,
    noesacoso:  <ShieldCheck size={22} className="text-orange-500" />,
    comite:     <Users size={22} className="text-orange-500" />,
    ruta:       <Map size={22} className="text-orange-500" />,
  };
  return iconos[icono] || <BookOpen size={22} className="text-orange-500" />;
};

export default function ClasePage() {
  const router = useRouter();
  const [modulo, setModulo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [videoFinalizado, setVideoFinalizado] = useState(false);

  useEffect(() => {
    const cargarModulo = async () => {
      try {
        const docRef = doc(db, "curriculum", "modulo_1");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setModulo(docSnap.data());
        }
      } catch (error) {
        console.error("Error cargando módulo:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarModulo();
  }, []);

  if (cargando) return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
      <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
      <p className="text-[10px] font-black uppercase tracking-widest">Cargando Módulo...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans pb-20">

      <nav className="p-4 border-b border-slate-800 bg-slate-900 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button onClick={() => router.push('/progreso')} className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <p className="text-[10px] text-orange-500 font-black uppercase tracking-widest">Módulo 1</p>
            <h1 className="text-lg font-bold">{modulo?.titulo || 'Cargando...'}</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-4 lg:p-8 space-y-10">

        {/* OBJETIVO */}
        {modulo?.objetivo && (
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-6">
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2">Objetivo</p>
            <p className="text-slate-300 leading-relaxed">{modulo.objetivo}</p>
          </div>
        )}

        {/* VIDEO */}
        {modulo?.videoUrl && (
          <div className="space-y-3">
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Video de la Capacitación</p>
            <div className="aspect-video rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
              <iframe
                src={modulo.videoUrl}
                title="Video del módulo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        )}

        {/* SECCIONES DE CONTENIDO */}
        {modulo?.secciones && modulo.secciones.length > 0 && (
          <div className="space-y-4">
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Contenido del Módulo</p>
            {modulo.secciones.map((seccion, index) => (
              <div key={index} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-3">
                  {obtenerIcono(seccion.icono)}
                  <h3 className="font-black text-white">{seccion.titulo}</h3>
                </div>
                <p className="text-slate-400 leading-relaxed whitespace-pre-line">{seccion.contenido}</p>
              </div>
            ))}
          </div>
        )}

        {/* CASO PRÁCTICO CON PREGUNTAS DE REFLEXIÓN */}
        {modulo?.casoPractico && (
          <div className="space-y-6">

            <div className="bg-slate-800 rounded-2xl p-6 border-l-4 border-orange-500">
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2">Caso Práctico</p>
              <h3 className="text-lg font-black text-white mb-4">{modulo.casoPractico.titulo}</h3>
              <p className="text-slate-400 leading-relaxed">{modulo.casoPractico.relato}</p>
            </div>

            {modulo?.preguntasReflexion && modulo.preguntasReflexion.length > 0 && (
              <div className="space-y-4">
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                  Preguntas de Reflexión
                </p>
                {modulo.preguntasReflexion.map((pregunta, pIndex) => (
                  <div key={pIndex} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      Pregunta {pIndex + 1}
                    </p>
                    <h4 className="font-bold text-white mb-4">{pregunta.enunciado}</h4>
                    <div className="space-y-2">
                      {pregunta.opciones && pregunta.opciones.map((opcion, oIndex) => (
                        <div
                          key={oIndex}
                          className="p-3 rounded-xl border border-slate-600 text-slate-400 text-sm font-medium"
                        >
                          {opcion}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <p className="text-slate-500 text-sm text-center italic">
                  Reflexiona sobre estas preguntas — las encontrarás en tu evaluación.
                </p>
              </div>
            )}

          </div>
        )}

        {/* MATERIAL DE APOYO */}
        {modulo?.materiales && modulo.materiales.length > 0 && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <FileText size={18} className="text-orange-500" /> Material de Apoyo
            </h3>
            <div className="space-y-3">
              {modulo.materiales.map((material, index) => (
                <a
                  key={index}
                  href={material.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-left p-3 rounded-lg bg-slate-900/50 hover:bg-slate-700 transition-colors text-sm border border-slate-700 flex justify-between items-center group"
                >
                  {material.nombre}
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* BOTÓN COMPLETAR Y IR AL EXAMEN */}
        <div className={`rounded-2xl p-6 shadow-lg transition-all ${videoFinalizado ? 'bg-green-600' : 'bg-orange-600'}`}>
          <h3 className="font-bold mb-2">
            {videoFinalizado ? '¡Listo para el examen!' : '¿Terminaste el módulo?'}
          </h3>
          <p className="text-sm mb-4 opacity-90">
            {videoFinalizado
              ? 'Ya puedes presentar tu evaluación.'
              : 'Marca el módulo como completado para acceder al examen.'}
          </p>
          {!videoFinalizado ? (
            <button
              onClick={() => setVideoFinalizado(true)}
              className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-white text-orange-600 hover:bg-orange-50 transition-all"
            >
              Marcar como completado
            </button>
          ) : (
            <button
              onClick={() => router.push('/examen?modulo=modulo_1')}
              className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-white text-green-600 hover:bg-green-50 transition-all"
            >
              <CheckCircle size={20} />
              Presentar Examen
            </button>
          )}
        </div>

      </main>
    </div>
  );
}