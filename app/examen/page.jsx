'use client';
import React, { useState, useEffect } from 'react';
import { Timer, AlertCircle } from 'lucide-react';

export default function Examen30Minutos() {
  const [segundos, setSegundos] = useState(1800); // 30 min * 60 seg

  useEffect(() => {
    if (segundos <= 0) return;
    const reloj = setInterval(() => {
      setSegundos(prev => prev - 1);
    }, 1000);
    return () => clearInterval(reloj);
  }, [segundos]);

  const formatear = (s) => {
    const m = Math.floor(s / 60);
    const seg = s % 60;
    return `${m}:${seg < 10 ? '0' : ''}${seg}`;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center justify-center">
      <div className="bg-white/10 p-10 rounded-[3rem] border border-orange-500 shadow-2xl">
        <Timer className="mx-auto text-orange-500 mb-4" size={48} />
        <h1 className="text-6xl font-black tabular-nums">{formatear(segundos)}</h1>
        <p className="text-orange-300 mt-4 font-bold uppercase tracking-widest text-xs">Tiempo Restante</p>
      </div>
      <div className="mt-10 max-w-md text-center">
         <p className="text-slate-400">El examen se enviará automáticamente al llegar a 00:00.</p>
      </div>
    </div>
  );
}