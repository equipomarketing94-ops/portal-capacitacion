'use client';

import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Award, Search, BarChart3, Loader2, ArrowLeft, Unlock, Lock, CheckCircle, XCircle, Printer } from 'lucide-react';
import Link from 'next/link';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';

// ✅ COMPONENTE DEL CERTIFICADO
function Certificado({ colaborador, numeroCertificado, onCerrar }) {
  const fechaHoy = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const imprimir = () => window.print();

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      
      {/* BOTONES FUERA DEL CERTIFICADO — no se imprimen */}
      <div className="absolute top-6 right-6 flex gap-3 print:hidden">
        <button
          onClick={imprimir}
          className="flex items-center gap-2 bg-white text-slate-900 px-5 py-2 rounded-xl font-bold hover:bg-orange-500 hover:text-white transition-all"
        >
          <Printer size={16} /> Imprimir
        </button>
        <button
          onClick={onCerrar}
          className="flex items-center gap-2 bg-slate-700 text-white px-5 py-2 rounded-xl font-bold hover:bg-red-500 transition-all"
        >
          Cerrar
        </button>
      </div>

      {/* CERTIFICADO */}
      <div
        id="certificado"
        className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl print:shadow-none print:rounded-none print:max-w-full"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {/* FRANJA SUPERIOR */}
        <div className="bg-slate-900 p-6 text-center">
          <p className="text-orange-500 font-black uppercase tracking-[0.4em] text-xs">Vista al Vuelo</p>
          <p className="text-slate-400 text-xs mt-1 tracking-widest uppercase">Jaragua de Inversiones S.A.S.</p>
        </div>

        {/* CUERPO */}
        <div className="p-12 text-center space-y-6 border-8 border-slate-900 mx-6 my-6 rounded-2xl">
          
          <div className="space-y-2">
            <p className="text-slate-400 uppercase tracking-[0.3em] text-xs font-bold">Certificado N°</p>
            <p className="text-4xl font-black text-slate-900">{String(numeroCertificado).padStart(3, '0')}</p>
          </div>

          <div className="w-16 h-1 bg-orange-500 mx-auto rounded-full" />

          <div className="space-y-4">
            <p className="text-slate-600 text-lg">Vista al Vuelo certifica que</p>
            
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-wide">
              {colaborador.nombre} {colaborador.apellido}
            </h2>
            
            <p className="text-slate-600 text-lg">ha realizado con éxito la capacitación en</p>
            
            <h3 className="text-2xl font-black text-orange-500 uppercase tracking-widest">
              Acoso Laboral
            </h3>

           <p className="text-slate-500 text-sm">
  con una calificación de{' '}
  <strong className="text-slate-900">
    {colaborador.ultimoExamen?.puntaje} de {colaborador.ultimoExamen?.total} respuestas correctas
  </strong>
</p>
          </div>

          <div className="w-16 h-1 bg-orange-500 mx-auto rounded-full" />

          <div className="flex justify-between text-sm text-slate-500">
            <p>Ciudad: <strong className="text-slate-900">Medellín</strong></p>
            <p>Fecha: <strong className="text-slate-900">{fechaHoy}</strong></p>
          </div>

          {/* FIRMAS */}
          <div className="grid grid-cols-2 gap-12 pt-8">
            <div className="text-center">
              <div className="border-t-2 border-slate-900 pt-3">
                <p className="font-bold text-slate-900 text-sm">Firma Administrador</p>
                <p className="text-slate-500 text-xs mt-1">Gestión Humana</p>
                <p className="text-slate-400 text-xs">Jaragua de Inversiones S.A.S.</p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t-2 border-slate-900 pt-3">
                <p className="font-bold text-slate-900 text-sm">Firma Colaborador</p>
                <p className="text-slate-500 text-xs mt-1">{colaborador.nombre} {colaborador.apellido}</p>
                <p className="text-slate-400 text-xs">C.C. {colaborador.documento}</p>
              </div>
            </div>
          </div>

        </div>

        {/* FRANJA INFERIOR */}
        <div className="bg-slate-900 p-4 text-center">
          <p className="text-slate-400 text-xs tracking-widest uppercase">
            Este certificado valida la participación y aprobación del programa de capacitación interna.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [colaboradores, setColaboradores] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [certificadoActivo, setCertificadoActivo] = useState(null);
  const [totalCertificados, setTotalCertificados] = useState(0);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "colaboradores"));
        const lista = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setColaboradores(lista);
        // Contamos cuántos certificados ya se emitieron
        const emitidos = lista.filter(c => c.certificadoEmitido).length;
        setTotalCertificados(emitidos);
      } catch (error) {
        console.error("Error al conectar:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  const toggleExamen = async (colaboradorId, estadoActual) => {
    try {
      const colaboradorRef = doc(db, "colaboradores", colaboradorId);
      const nuevoEstado = !estadoActual;
      await updateDoc(colaboradorRef, { examenHabilitado: nuevoEstado });
      setColaboradores(colaboradores.map(c =>
        c.id === colaboradorId ? { ...c, examenHabilitado: nuevoEstado } : c
      ));
    } catch (error) {
      alert("No se pudo cambiar el estado.");
    }
  };

  // ✅ NUEVO: emitir certificado y asignar número consecutivo
  const emitirCertificado = async (colaborador) => {
    try {
      if (!colaborador.certificadoEmitido) {
        const nuevoCertificado = totalCertificados + 1;
        const colaboradorRef = doc(db, "colaboradores", colaborador.id);
        await updateDoc(colaboradorRef, {
          certificadoEmitido: true,
          numeroCertificado: nuevoCertificado
        });
        setColaboradores(colaboradores.map(c =>
          c.id === colaborador.id
            ? { ...c, certificadoEmitido: true, numeroCertificado: nuevoCertificado }
            : c
        ));
        setTotalCertificados(nuevoCertificado);
        setCertificadoActivo({ ...colaborador, numeroCertificado: nuevoCertificado });
      } else {
        setCertificadoActivo(colaborador);
      }
    } catch (error) {
      alert("No se pudo emitir el certificado.");
    }
  };

  const filtrados = colaboradores.filter(colab =>
    colab.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    colab.documento?.includes(busqueda)
  );

  const totalInscritos = colaboradores.length;
  const totalCompletados = colaboradores.filter(c => c.certificadoEmitido).length;
  const totalEnCurso = colaboradores.filter(c => c.progresoTotal > 0 && !c.certificadoEmitido).length;

  if (cargando) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
      <p className="text-slate-400 font-black text-[10px] tracking-widest uppercase">Cargando datos...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">

      {/* CERTIFICADO MODAL */}
      {certificadoActivo && (
        <Certificado
          colaborador={certificadoActivo}
          numeroCertificado={certificadoActivo.numeroCertificado}
          onCerrar={() => setCertificadoActivo(null)}
        />
      )}

      <nav className="bg-slate-900 text-white p-4 shadow-xl border-b-4 border-blue-500 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-lg"><BarChart3 size={20} /></div>
            <div>
              <h1 className="text-lg font-bold tracking-tight leading-none">Portal de Seguimiento</h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Gestión Humana</span>
            </div>
          </div>
          <Link href="/progreso" className="flex items-center gap-2 hover:bg-white/10 px-3 py-1 rounded-lg transition-all text-xs font-bold uppercase text-slate-300">
            <ArrowLeft size={14} /> Volver al Portal
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-4 md:p-8 mt-4 space-y-8">

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><Users size={32} /></div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total Inscritos</p>
              <h3 className="text-4xl font-black text-slate-800">{totalInscritos}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center"><Award size={32} /></div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Certificados</p>
              <h3 className="text-4xl font-black text-slate-800">{totalCompletados}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center"><TrendingUp size={32} /></div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">En Entrenamiento</p>
              <h3 className="text-4xl font-black text-slate-800">{totalEnCurso}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Directorio de Capacitación</h2>
              <p className="text-sm text-slate-500">Monitorea el avance de tu equipo en tiempo real.</p>
            </div>
            <div className="relative w-full md:w-72">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar colaborador..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <th className="p-6">Colaborador</th>
                  <th className="p-6 hidden md:table-cell">Cédula</th>
                  <th className="p-6 text-center">Resultado Examen</th>
                  <th className="p-6 text-center">Control Examen</th>
                  <th className="p-6 text-center">Certificado</th>
                  <th className="p-6 text-right">Progreso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtrados.map((colab) => (
                  <tr key={colab.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm uppercase">
                          {colab.nombre?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 capitalize">{colab.nombre} {colab.apellido}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-sm text-slate-500 font-medium hidden md:table-cell">
                      {colab.documento}
                    </td>

                    {/* ✅ NUEVO: RESULTADO DEL EXAMEN */}
                    <td className="p-6 text-center">
                      {colab.ultimoExamen ? (
                        <div className="flex flex-col items-center gap-1">
                          {colab.ultimoExamen.aprobado ? (
                            <span className="flex items-center gap-1 text-green-600 font-bold text-xs">
                              <CheckCircle size={14} /> Aprobado
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-500 font-bold text-xs">
                              <XCircle size={14} /> No aprobado
                            </span>
                          )}
                          <span className="text-slate-400 text-xs">
                            {colab.ultimoExamen.puntaje}/{colab.ultimoExamen.total} correctas
                          </span>
                          <span className="text-slate-300 text-xs">{colab.ultimoExamen.fecha}</span>
                        </div>
                      ) : (
                        <span className="text-slate-300 text-xs">Sin examen</span>
                      )}
                    </td>

                    {/* CONTROL EXAMEN */}
                    <td className="p-6 text-center">
                      <button
                        onClick={() => toggleExamen(colab.id, colab.examenHabilitado)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                          colab.examenHabilitado
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {colab.examenHabilitado ? <Unlock size={14} /> : <Lock size={14} />}
                        {colab.examenHabilitado ? 'Habilitado' : 'Bloqueado'}
                      </button>
                    </td>

                    {/* ✅ NUEVO: BOTÓN CERTIFICADO */}
                    <td className="p-6 text-center">
                      {colab.ultimoExamen?.aprobado ? (
                        <button
                          onClick={() => emitirCertificado(colab)}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                            colab.certificadoEmitido
                              ? 'bg-blue-500 text-white hover:bg-blue-600'
                              : 'bg-orange-500 text-white hover:bg-orange-600'
                          }`}
                        >
                          <Award size={14} />
                          {colab.certificadoEmitido ? `Ver Cert. N°${String(colab.numeroCertificado).padStart(3,'0')}` : 'Emitir Certificado'}
                        </button>
                      ) : (
                        <span className="text-slate-300 text-xs">No disponible</span>
                      )}
                    </td>

                    <td className="p-6 text-right">
                      <span className="font-bold text-slate-700">{colab.progresoTotal || 0}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}