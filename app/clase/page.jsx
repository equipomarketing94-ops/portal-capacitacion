'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { 
  ArrowLeft, 
  ArrowRight,
  CheckCircle, 
  XCircle,
  Loader2,
  BookOpen,
  Scale,
  AlertTriangle,
  ShieldCheck,
  Users,
  Map,
  Play
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

function ContenidoClase() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // ✅ CAMBIO CLAVE: leemos el módulo desde la URL
  const moduloId = searchParams.get('modulo') || 'modulo_1';

  const [modulo, setModulo] = useState(null);
  const [colaborador, setColaborador] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [pasoActual, setPasoActual] = useState(0);
  const [respuestas, setRespuestas] = useState({});

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // ✅ CAMBIO: usamos moduloId en lugar de "modulo_1" fijo
        const docRef = doc(db, "curriculum", moduloId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setModulo(docSnap.data());
        }

        const idGuardado = localStorage.getItem('colaboradorActivo');
        if (idGuardado) {
          const colRef = doc(db, "colaboradores", idGuardado);
          const colSnap = await getDoc(colRef);
          if (colSnap.exists()) {
            setColaborador(colSnap.data());
          }
        }
      } catch (error) {
        console.error("Error cargando módulo:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, [moduloId]);

  const responder = (pasoIndex, opcionIndex) => {
    if (respuestas[pasoIndex] !== undefined) return;
    setRespuestas({ ...respuestas, [pasoIndex]: opcionIndex });
  };

  if (cargando) return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
      <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
      <p className="text-[10px] font-black uppercase tracking-widest">Cargando Módulo...</p>
    </div>
  );

  const totalPasos = 1 + (modulo?.secciones?.length || 0) + 1;
  const esUltimoPaso = pasoActual === totalPasos - 1;
  const numeroModulo = String(moduloId).replace('modulo_', '');

  const puedeAvanzar = () => {
    if (pasoActual === 0) return true;
    const seccionIndex = pasoActual - 1;
    const secciones = modulo?.secciones || [];
    if (pasoActual <= secciones.length) {
      const seccion = secciones[seccionIndex];
      if (seccion?.pregunta) {
        return respuestas[pasoActual] !== undefined;
      }
      return true;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans pb-20">

      <nav className="p-4 border-b border-slate-800 bg-slate-900 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => router.push('/progreso')} className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="text-center">
            <p className="text-[10px] text-orange-500 font-black uppercase tracking-widest">Módulo {numeroModulo}</p>
            <h1 className="text-sm font-bold">{modulo?.titulo || 'Cargando...'}</h1>
          </div>
          <div className="text-[10px] font-black text-slate-400">
            {pasoActual + 1} / {totalPasos}
          </div>
        </div>
        <div className="max-w-4xl mx-auto mt-3">
          <div className="w-full bg-slate-700 rounded-full h-1">
            <div
              className="bg-orange-500 h-1 rounded-full transition-all duration-500"
              style={{ width: `${((pasoActual + 1) / totalPasos) * 100}%` }}
            />
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto p-4 lg:p-8 space-y-8">

        {/* PASO 0: OBJETIVO + VIDEO */}
        {pasoActual === 0 && (
          <div className="space-y-6">
            {modulo?.objetivo && (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-6">
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2">Objetivo</p>
                <p className="text-slate-300 leading-relaxed">{modulo.objetivo}</p>
              </div>
            )}
            {modulo?.videoUrl && (
              <div className="space-y-3">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 flex items-center gap-3">
                  <Play size={18} className="text-blue-400 shrink-0" />
                  <p className="text-blue-300 text-sm font-medium">
                    Revisa el video completo para continuar con la clase.
                  </p>
                </div>
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
          </div>
        )}

        {/* PASOS 1 a N: SECCIONES */}
        {pasoActual >= 1 && pasoActual <= (modulo?.secciones?.length || 0) && (() => {
          const seccion = modulo.secciones[pasoActual - 1];
          const yaRespondio = respuestas[pasoActual] !== undefined;
          const respuestaUsuario = respuestas[pasoActual];

          return (
            <div className="space-y-6">
              <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  {obtenerIcono(seccion.icono)}
                  <h3 className="font-black text-white text-lg">{seccion.titulo}</h3>
                </div>
                <p className="text-slate-400 leading-relaxed whitespace-pre-line">{seccion.contenido}</p>

                {seccion?.videoUrl && (
                  <div className="mt-4 aspect-video rounded-xl overflow-hidden border border-slate-700">
                    <iframe
                      src={seccion.videoUrl}
                      title={seccion.titulo}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                )}

                {seccion?.imagenes && seccion.imagenes.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {seccion.imagenes.map((url, imgIndex) => (
                      url ? (
                        <div key={imgIndex} className="rounded-xl overflow-hidden border border-slate-700">
                          <img
                            src={url}
                            alt={`${seccion.titulo} - imagen ${imgIndex + 1}`}
                            className="w-full object-contain max-h-96"
                            onError={e => e.target.parentElement.style.display = 'none'}
                          />
                        </div>
                      ) : null
                    ))}
                  </div>
                )}
              </div>

              {seccion?.pregunta && (
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-4">
                  <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                    Pregunta de comprensión
                  </p>
                  <h4 className="font-bold text-white">{seccion.pregunta.enunciado}</h4>
                  <div className="space-y-3">
                    {seccion.pregunta.opciones.map((opcion, oIndex) => {
                      let estilo = 'border-slate-600 text-slate-400';
                      let icono = null;

                      if (yaRespondio) {
                        if (oIndex === seccion.pregunta.correcta) {
                          estilo = 'border-green-500 bg-green-500/10 text-green-400';
                          icono = <CheckCircle size={18} className="text-green-500 shrink-0" />;
                        } else if (oIndex === respuestaUsuario) {
                          estilo = 'border-red-500 bg-red-500/10 text-red-400';
                          icono = <XCircle size={18} className="text-red-500 shrink-0" />;
                        } else {
                          estilo = 'border-slate-700 text-slate-600 opacity-50';
                        }
                      } else if (respuestaUsuario === oIndex) {
                        estilo = 'border-orange-500 bg-orange-500/10 text-orange-400';
                      }

                      return (
                        <button
                          key={oIndex}
                          onClick={() => responder(pasoActual, oIndex)}
                          disabled={yaRespondio}
                          className={`w-full p-4 text-left border-2 rounded-xl transition-all font-medium flex items-center justify-between gap-3 ${estilo}`}
                        >
                          <span>{opcion}</span>
                          {icono}
                        </button>
                      );
                    })}
                  </div>

                  {yaRespondio && seccion.pregunta.explicacion && (
                    <div className="mt-4 p-4 bg-blue-500/10 border-l-4 border-blue-500 rounded-r-xl">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">
                        Retroalimentación
                      </p>
                      <p className="text-blue-300 text-sm leading-relaxed">
                        {seccion.pregunta.explicacion}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {/* ÚLTIMO PASO: CASO PRÁCTICO */}
        {esUltimoPaso && modulo?.casoPractico && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-2xl p-6 border-l-4 border-orange-500">
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2">Caso Práctico</p>
              <h3 className="text-lg font-black text-white mb-4">{modulo.casoPractico.titulo}</h3>
              <p className="text-slate-400 leading-relaxed">{modulo.casoPractico.relato}</p>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-5">
              <p className="text-orange-300 text-sm font-medium text-center">
                ¡Completaste el contenido! Espera a que tu administrador habilite el examen.
              </p>
            </div>
          </div>
        )}

        {/* NAVEGACIÓN */}
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={() => setPasoActual(pasoActual - 1)}
            disabled={pasoActual === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed font-bold"
          >
            <ArrowLeft size={18} /> Anterior
          </button>

          {!esUltimoPaso ? (
            <button
              onClick={() => puedeAvanzar() && setPasoActual(pasoActual + 1)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                puedeAvanzar()
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              Siguiente <ArrowRight size={18} />
            </button>
          ) : colaborador?.examenHabilitado ? (
            <button
              onClick={() => router.push(`/examen?modulo=${moduloId}`)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-green-500 hover:bg-green-600 text-white transition-all"
            >
              Ir al Examen <ArrowRight size={18} />
            </button>
          ) : (
            <div className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-slate-700 text-slate-400 cursor-not-allowed">
              Examen no habilitado aún
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default function ClasePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    }>
      <ContenidoClase />
    </Suspense>
  );
}