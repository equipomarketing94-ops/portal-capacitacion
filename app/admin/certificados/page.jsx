'use client';

import React, { useState } from 'react';
import { Award, Search, Download, Printer, CheckCircle, MapPin, ChevronLeft, FileText } from 'lucide-react';
import Link from 'next/link';

export default function CertificadosAdmin() {
  // Simulamos la base de datos, pero OJO: aquí solo traemos a los que ya tienen 100%
  const graduados = [
    { id: "11223344", nombre: "Sara Botero Madrid", cargo: "Representante Legal", fechaGraduacion: "28/03/2026", folio: "VAV-2026-001" },
    { id: "71234567", nombre: "Juan Camilo Pérez", cargo: "Mesero", fechaGraduacion: "01/04/2026", folio: "VAV-2026-002" },
    // Te agrego aquí como ejemplo de alguien que ya terminó todo
    { id: "1017172306", nombre: "Nataly Martinez Orrego", cargo: "Líder de Capacitación", fechaGraduacion: "09/04/2026", folio: "VAV-2026-003" }
  ];

  // Memoria para saber qué certificado estamos viendo en la pantalla de la derecha
  const [colaboradorSeleccionado, setColaboradorSeleccionado] = useState(graduados[0]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      
      {/* Barra de Navegación */}
      <nav className="bg-slate-900 text-white p-4 shadow-xl border-b-4 border-orange-500 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-bold bg-slate-800 px-3 py-1.5 rounded-lg">
              <ChevronLeft size={16} /> Volver
            </Link>
            <div className="flex items-center gap-3 border-l border-slate-700 pl-4">
              <div className="bg-orange-500 p-2 rounded-lg">
                <Award size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight leading-none">Centro de Certificación</h1>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Emisión de Diplomas</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 md:p-8 mt-4 grid lg:grid-cols-12 gap-8">
        
        {/* Lado Izquierdo: Lista de Graduados (Ocupa 5 columnas) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-xl font-black text-slate-800 mb-1">Colaboradores Aprobados</h2>
            <p className="text-sm text-slate-500 mb-6">Selecciona un colaborador para expedir su certificado.</p>
            
            <div className="relative mb-6">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar por cédula o nombre..." 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all text-sm font-medium"
              />
            </div>

            <div className="space-y-3 h-[500px] overflow-y-auto pr-2">
              {graduados.map((colab) => (
                <button 
                  key={colab.id}
                  onClick={() => setColaboradorSeleccionado(colab)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                    colaboradorSeleccionado.id === colab.id 
                    ? 'border-orange-500 bg-orange-50 shadow-md' 
                    : 'border-slate-100 bg-white hover:border-orange-200 hover:bg-orange-50/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                      colaboradorSeleccionado.id === colab.id ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {colab.nombre.charAt(0)}
                    </div>
                    <div>
                      <p className={`font-bold ${colaboradorSeleccionado.id === colab.id ? 'text-orange-900' : 'text-slate-800'}`}>
                        {colab.nombre}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">CC: {colab.id}</p>
                    </div>
                  </div>
                  <CheckCircle size={20} className={colaboradorSeleccionado.id === colab.id ? 'text-orange-500' : 'text-slate-300'} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lado Derecho: Vista Previa y Acciones (Ocupa 7 columnas) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Botones de Acción */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Acciones para</p>
              <h3 className="text-lg font-black text-slate-800">{colaboradorSeleccionado.nombre}</h3>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors">
                <Printer size={18} /> Imprimir
              </button>
              <button className="flex items-center gap-2 bg-orange-600 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-orange-500/30">
                <Download size={18} /> Descargar PDF
              </button>
            </div>
          </div>

          {/* El Diploma (Vista Previa Visual) */}
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-12 relative overflow-hidden flex flex-col items-center text-center aspect-[1.414/1] md:aspect-[1.414/1] w-full max-w-3xl mx-auto">
            
            {/* Elementos Decorativos del Diploma */}
            <div className="absolute top-0 left-0 w-full h-4 bg-orange-500"></div>
            <div className="absolute top-4 left-0 w-full h-1 bg-slate-900"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full -ml-20 -mb-20 blur-3xl"></div>
            
            {/* Sello de agua sutil */}
            <MapPin size={400} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-50 opacity-50 z-0" />

            <div className="relative z-10 w-full flex flex-col items-center h-full justify-between">
              
              {/* Encabezado Corporativo */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                  <MapPin size={32} className="text-orange-500" />
                </div>
                <h1 className="text-2xl font-black text-slate-900 tracking-widest uppercase">
                  Jaragua de Inversiones S.A.S.
                </h1>
                <p className="text-sm font-bold text-orange-600 tracking-[0.3em] uppercase">Vista al Vuelo</p>
              </div>

              {/* Cuerpo del Diploma */}
              <div className="space-y-6 my-8 w-full">
                <p className="text-slate-500 font-medium italic text-lg">Otorga el presente certificado a:</p>
                
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 border-b-2 border-orange-200 pb-4 inline-block px-12">
                  {colaboradorSeleccionado.nombre}
                </h2>
                
                <div className="space-y-2">
                  <p className="text-slate-600">Identificado(a) con C.C. {colaboradorSeleccionado.id}</p>
                  <p className="text-slate-600 max-w-xl mx-auto leading-relaxed">
                    Por haber completado satisfactoriamente el <strong className="text-slate-900">Programa de Inducción Corporativa y Capacitación Operativa</strong>, cumpliendo con todos los requisitos académicos y demostrando compromiso con los valores de nuestra organización.
                  </p>
                </div>
              </div>

              {/* Firmas y Folio */}
              <div className="w-full flex justify-between items-end px-8 mt-auto">
                <div className="text-left">
                  <div className="w-48 h-px bg-slate-400 mb-2"></div>
                  <p className="font-bold text-slate-800 text-sm">Sara Botero Madrid</p>
                  <p className="text-xs text-slate-500">Representante Legal</p>
                </div>

                <div className="text-right">
                  <div className="w-48 h-px bg-slate-400 mb-2"></div>
                  <p className="font-bold text-slate-800 text-sm">Gestión Humana</p>
                  <p className="text-xs text-slate-500">Dirección de Capacitación</p>
                </div>
              </div>

              <div className="w-full flex justify-between items-center mt-12 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100 pt-4">
                <span>San Félix, Antioquia - {colaboradorSeleccionado.fechaGraduacion}</span>
                <span>Folio: {colaboradorSeleccionado.folio}</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}