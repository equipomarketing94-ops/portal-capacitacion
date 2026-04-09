'use client';

import React, { useState } from 'react';
import { ArrowLeft, Play, FileText, CheckCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ClasePage() {
  const [videoFinalizado, setVideoFinalizado] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* Barra Superior */}
      <nav className="p-4 border-b border-slate-800 bg-slate-900 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link href="/progreso" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <p className="text-[10px] text-orange-500 font-black uppercase tracking-widest">Módulo 1</p>
            <h1 className="text-lg font-bold">Bienvenida y Cultura Vista al Vuelo</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4 lg:p-8 grid lg:grid-cols-3 gap-8">
        
        {/* Lado Izquierdo: El Video (2 columnas de ancho) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center relative group">
            {/* Aquí iría el iframe de YouTube o Vimeo. Por ahora simulamos el reproductor */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
              <button className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center shadow-orange-500/20 shadow-2xl group-hover:scale-110 transition-transform">
                <Play size={32} fill="white" />
              </button>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200" 
              alt="Vista al Vuelo Thumbnail" 
              className="w-full h-full object-cover opacity-40"
            />
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold mb-4">Sobre esta lección</h2>
            <p className="text-slate-400 leading-relaxed">
              En este video conocerás la historia de nuestra marca, la importancia de nuestra ubicación en el mirador y qué esperamos de ti como nuevo integrante del equipo de Vista al Vuelo. ¡Bienvenido a bordo!
            </p>
          </div>
        </div>

        {/* Lado Derecho: Recursos y Temario (1 columna de ancho) */}
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <FileText size={18} className="text-orange-500" /> Material de Apoyo
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg bg-slate-900/50 hover:bg-slate-700 transition-colors text-sm border border-slate-700 flex justify-between items-center group">
                Manual de Cultura.pdf
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-slate-900/50 hover:bg-slate-700 transition-colors text-sm border border-slate-700 flex justify-between items-center group">
                Reglamento Interno.pdf
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="bg-orange-600 rounded-2xl p-6 shadow-lg shadow-orange-900/20">
            <h3 className="font-bold mb-2">¿Terminaste de ver el video?</h3>
            <p className="text-sm text-orange-100 mb-4">Márcalo como completado para avanzar al siguiente módulo.</p>
            <button 
              onClick={() => setVideoFinalizado(!videoFinalizado)}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                videoFinalizado ? 'bg-green-500 text-white' : 'bg-white text-orange-600 hover:bg-orange-50'
              }`}
            >
              {videoFinalizado ? <CheckCircle size={20} /> : null}
              {videoFinalizado ? '¡Módulo Completado!' : 'Marcar como completado'}
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
