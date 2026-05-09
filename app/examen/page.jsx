'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Timer, Send, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';

// ✅ NUEVO: función que mezcla preguntas y opciones aleatoriamente
const mezclarPreguntas = (preguntas) => {
  // Si no hay preguntas, devuelve array vacío
  if (!preguntas || preguntas.length === 0) return [];

  try {
    const preguntasMezcladas = [...preguntas].sort(() => Math.random() - 0.5);

    return preguntasMezcladas.map(pregunta => {
      // Si no tiene opciones o correcta, devuelve la pregunta sin mezclar
      if (!pregunta.opciones || pregunta.correcta === undefined) return pregunta;

      const textoCorrecta = pregunta.opciones[Number(pregunta.correcta)];
      const opcionesMezcladas = [...pregunta.opciones].sort(() => Math.random() - 0.5);
      const nuevaCorrecta = opcionesMezcladas.indexOf(textoCorrecta);

      return {
        ...pregunta,
        opciones: opcionesMezcladas,
        correcta: nuevaCorrecta === -1 ? 0 : nuevaCorrecta
      };
    });
  } catch (error) {
    console.error("Error mezclando preguntas:", error);
    return preguntas; // Si falla, devuelve las preguntas sin mezclar
  }
};

function ContenidoDelExamen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduloId = searchParams.get('modulo') || 'modulo_1';

  const [preguntas, setPreguntas] = useState([]);
  const [respuestasUsuario, setRespuestasUsuario] = useState({});
  const [segundosRestantes, setSegundosRestantes] = useState(1800);
  const [examenFinalizado, setExamenFinalizado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [puntaje, setPuntaje] = useState(0);

  useEffect(() => {
    const obtenerPreguntas = async () => {
      try {
        const docRef = doc(db, "curriculum", moduloId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // ✅ CAMBIO: aplicamos la mezcla al cargar las preguntas
          const preguntasAleatorias = mezclarPreguntas(docSnap.data().preguntas || []);
          setPreguntas(preguntasAleatorias);
        }
      } catch (error) {
        console.error("🚨 Error de conexión:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerPreguntas();
  }, [moduloId]);

  useEffect(() => {
    if (segundosRestantes <= 0 || examenFinalizado || cargando) {
      if (segundosRestantes === 0 && !examenFinalizado) finalizarExamen();
      return;
    }
    const intervalo = setInterval(() => {
      setSegundosRestantes((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(intervalo);
  }, [segundosRestantes, examenFinalizado, cargando]);

  const marcarRespuesta = (preguntaIndex, opcionIndex) => {
    setRespuestasUsuario({ ...respuestasUsuario, [preguntaIndex]: opcionIndex });
  };

  const finalizarExamen = async () => {
    setEnviando(true);
    try {
      let correctas = 0;
      preguntas.forEach((p, index) => {
        if (respuestasUsuario[index] === p.correcta) correctas++;
      });
      setPuntaje(correctas);

      const documentoId = localStorage.getItem('colaboradorActivo');
      if (documentoId) {
        const colaboradorRef = doc(db, "colaboradores", documentoId);
        await updateDoc(colaboradorRef, {
          progresoTotal: increment(20),
          examenHabilitado: false
        });
      }
    } catch (error) {
      console.log("⚠️ No se pudo guardar progreso, pero finalizaremos el examen igual.");
    } finally {
      setExamenFinalizado(true);
      setEnviando(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const irAlInicio = () => {
    router.push('/progreso');
  };

  if (cargando) return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
      <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
      <p className="text-[10px] font-black uppercase tracking-widest">Preparando Evaluación...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-20 shadow-lg border-b border-orange-500">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            {!examenFinalizado ? (
              <div className={`px-4 py-2 rounded-xl border-2 flex items-center gap-2 font-black tabular-nums ${segundosRestantes < 300 ? 'border-red-500 text-red-500 animate-pulse' : 'border-orange-500 text-orange-500'}`}>
                <Timer size={18} /> {Math.floor(segundosRestantes / 60)}:{String(segundosRestantes % 60).padStart(2, '0')}
              </div>
            ) : (
              <div className="px-4 py-2 rounded-xl bg-green-500/20 text-green-400 font-black flex items-center gap-2">
                <CheckCircle2 size={18} /> EVALUACIÓN COMPLETADA
              </div>
            )}
          </div>

          {!examenFinalizado && (
            <button
              onClick={finalizarExamen}
              disabled={enviando}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
            >
              {enviando ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />} Terminar
            </button>
          )}
        </div>
      </nav>

      <div className="max-w-3xl mx-auto p-6 mt-8 space-y-8">

        {examenFinalizado && (
          <div className="bg-white p-8 rounded-[2rem] border-2 border-green-500 shadow-xl text-center">
            <h2 className="text-3xl font-black text-slate-900 mb-2">¡Resultados Listos!</h2>
            <p className="text-slate-600 mb-6 font-medium">
              Acertaste {puntaje} de {preguntas.length} preguntas.
            </p>
            <button
              onClick={irAlInicio}
              className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-orange-500 shadow-lg transition-all"
            >
              Cerrar y Volver al Portal
            </button>
          </div>
        )}

        {preguntas.map((p, pIndex) => (
          <div key={pIndex} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
              Pregunta {pIndex + 1}
            </span>
            <h3 className="text-xl font-bold text-slate-800 mt-2 mb-6 leading-tight">{p.enunciado}</h3>

            <div className="grid gap-3">
              {p.opciones && p.opciones.map((opcion, oIndex) => {
                let colorClase = 'border-slate-100 hover:border-slate-200 text-slate-600';
                let Icono = null;

                if (examenFinalizado) {
                  if (oIndex === p.correcta) {
                    colorClase = 'border-green-500 bg-green-50 text-green-700';
                    Icono = <CheckCircle2 className="text-green-500" size={20} />;
                  } else if (respuestasUsuario[pIndex] === oIndex) {
                    colorClase = 'border-red-500 bg-red-50 text-red-700';
                    Icono = <XCircle className="text-red-500" size={20} />;
                  } else {
                    colorClase = 'border-slate-100 text-slate-300 opacity-50';
                  }
                } else if (respuestasUsuario[pIndex] === oIndex) {
                  colorClase = 'border-orange-500 bg-orange-50 text-orange-700';
                }

                return (
                  <button
                    key={oIndex}
                    onClick={() => !examenFinalizado && marcarRespuesta(pIndex, oIndex)}
                    disabled={examenFinalizado}
                    className={`w-full p-5 text-left border-2 rounded-2xl transition-all font-bold flex items-center justify-between ${colorClase}`}
                  >
                    <span>{opcion}</span>
                    {Icono}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default function PaginaExamen() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <Loader2 className="animate-spin" size={48} />
      </div>
    }>
      <ContenidoDelExamen />
    </Suspense>
  );
}