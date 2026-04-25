'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Timer, Send, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { db } from '../firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

export default function PaginaExamen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduloId = searchParams.get('modulo') || '1';

  // --- 1. CONFIGURACIÓN DEL TIEMPO (1800 segundos = 30 min) ---
  const TIEMPO_INICIAL = 1800;
  const [segundosRestantes, setSegundosRestantes] = useState(TIEMPO_INICIAL);
  const [examenFinalizado, setExamenFinalizado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // --- 2. LÓGICA DEL CRONÓMETRO ---
  useEffect(() => {
    // Si el tiempo se acaba o el examen termina, no hacemos nada
    if (segundosRestantes <= 0 || examenFinalizado) {
      if (segundosRestantes === 0) finalizarExamen();
      return;
    }

    // El 'latido' del reloj: resta 1 segundo cada 1000ms
    const intervalo = setInterval(() => {
      setSegundosRestantes((prev) => prev - 1);
    }, 1000);

    // Limpiador: detiene el reloj si el usuario se va de la página
    return () => clearInterval(intervalo);
  }, [segundosRestantes, examenFinalizado]);

  // --- 3. CONVERTIDOR DE FORMATO (MM:SS) ---
  const formatearTiempo = (segundos) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos}:${segs < 10 ? '0' : ''}${segs}`;
  };

  // --- 4. FUNCIÓN PARA ENVIAR RESULTADOS ---
  const finalizarExamen = async () => {
    if (examenFinalizado) return;
    setEnviando(true);

    try {
      const documentoId = localStorage.getItem('colaboradorActivo');
      if (documentoId) {
        const colaboradorRef = doc(db, "colaboradores", documentoId);
        
        // Actualizamos el progreso y bloqueamos el examen de nuevo
        await updateDoc(colaboradorRef, {
          progresoTotal: increment(15), // Ejemplo: sube 15% al terminar
          examenHabilitado: false // ¡IMPORTANTE! Se bloquea automáticamente al terminar
        });
      }
      setExamenFinalizado(true);
    } catch (error) {
      console.error("Error al enviar examen:", error);
    } finally {
      setEnviando(false);
    }
  };

  if (examenFinalizado) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-10 rounded-[3rem] shadow-xl max-w-md border border-slate-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">¡Examen Recibido!</h2>
          <p className="text-slate-500 font-medium mb-8">Tu evaluación ha sido guardada. El administrador revisará tus resultados pronto.</p>
          <button 
            onClick={() => router.push('/progreso')}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-orange-600 transition-all"
          >
            Volver al Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* Barra de Tiempo fija arriba */}
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-20 shadow-lg border-b border-orange-500">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Timer className={segundosRestantes < 300 ? 'text-red-500 animate-pulse' : 'text-orange-500'} />
            <span className="text-xl font-black tabular-nums">
              {formatearTiempo(segundosRestantes)}
            </span>
          </div>
          <h1 className="text-xs font-black uppercase tracking-[0.2em] hidden sm:block">Evaluación Módulo {moduloId}</h1>
          <button 
            onClick={finalizarExamen}
            disabled={enviando}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
          >
            {enviando ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
            Finalizar
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto p-6 mt-8">
        <div className="bg-orange-50 border border-orange-100 p-6 rounded-3xl flex gap-4 mb-8">
          <AlertCircle className="text-orange-600 shrink-0" />
          <p className="text-sm text-orange-800 font-medium">
            <strong>Atención:</strong> Tienes 30 minutos para completar esta prueba. Si el tiempo llega a cero, el examen se enviará automáticamente con las respuestas que hayas marcado.
          </p>
        </div>

        {/* AQUÍ IRÁN LAS PREGUNTAS MÁS ADELANTE */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Pregunta 1</span>
            <h3 className="text-xl font-bold text-slate-800 mt-2 mb-6">¿Cuál es la misión principal de Jaragua de Inversiones según lo visto en el módulo?</h3>
            <div className="space-y-3">
              {['Opción A: Descripción corta aquí', 'Opción B: Descripción corta aquí', 'Opción C: Descripción corta aquí'].map((opt, i) => (
                <button key={i} className="w-full p-4 text-left border border-slate-200 rounded-2xl hover:border-orange-500 hover:bg-orange-50 transition-all font-medium text-slate-700">
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}