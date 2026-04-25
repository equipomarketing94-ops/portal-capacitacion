'use client';

import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Award, MapPin, Search, BarChart3, CheckCircle, Clock, Loader2, ArrowLeft, Unlock, Lock } from 'lucide-react';
import Link from 'next/link';

// 1. CONEXIÓN A LA NUBE (Firebase)
import { db } from '../firebase'; 
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'; 

export default function AdminDashboard() {
  const [colaboradores, setColaboradores] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  // 2. APRENDIZAJE: useEffect (El Observador)
  // Este código se ejecuta "detrás de cámaras" apenas entras a la página 
  // para traer la lista de empleados desde Firebase.
  useEffect(() => {
    const cargarDatosReales = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "colaboradores"));
        const listaReal = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setColaboradores(listaReal);
      } catch (error) {
        console.error("Error al conectar:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarDatosReales();
  }, []);

  // 3. APRENDIZAJE: La función del "Interruptor" (updateDoc)
  // Esta es la parte que buscabas. Es el cerebro que cambia el candado.
  const toggleExamen = async (colaboradorId, estadoActual) => {
    try {
      // 'doc' ubica la hoja exacta del empleado.
      const colaboradorRef = doc(db, "colaboradores", colaboradorId);
      
      // '!estadoActual' simplemente invierte el valor (si es true, lo vuelve false).
      const nuevoEstado = !estadoActual;

      // 'updateDoc' envía la orden a Google para cambiar SOLO el campo del examen.
      await updateDoc(colaboradorRef, {
        examenHabilitado: nuevoEstado
      });

      // Actualizamos la pantalla sin recargar.
      setColaboradores(colaboradores.map(c => 
        c.id === colaboradorId ? { ...c, examenHabilitado: nuevoEstado } : c
      ));

    } catch (error) {
      console.error("Error:", error);
      alert("No se pudo cambiar el estado del examen.");
    }
  };

  const filtrados = colaboradores.filter(colab =>
    colab.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    colab.documento?.includes(busqueda)
  );

  if (cargando) return <div className="p-20 text-center font-bold">Cargando panel...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* Barra superior (Nav) */}
      <nav className="bg-slate-900 text-white p-4 shadow-xl border-b-4 border-blue-500 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BarChart3 className="text-blue-500" />
            <h1 className="text-lg font-bold">GESTIÓN HUMANA - VISTA AL VUELO</h1>
          </div>
          <Link href="/progreso" className="text-xs font-bold uppercase hover:text-orange-500 transition-colors flex items-center gap-2">
            <ArrowLeft size={14} /> Volver
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Cabecera de la tabla */}
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-800">Control de Exámenes</h2>
            <input 
              type="text" placeholder="Buscar por cédula..." value={busqueda} 
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-4 pr-4 py-2 border rounded-xl text-sm"
            />
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                <th className="p-6">Colaborador</th>
                <th className="p-6 text-center">Estado del Examen</th>
                <th className="p-6 text-right">Progreso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtrados.map((colab) => (
                <tr key={colab.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-6">
                    <p className="font-bold text-slate-800 capitalize">{colab.nombre} {colab.apellido}</p>
                    <p className="text-xs text-slate-400">{colab.documento}</p>
                  </td>
                  
                  {/* 4. APRENDIZAJE: El Botón Dinámico */}
                  {/* Aquí es donde dibujamos el botón basándonos en si está habilitado o no */}
                  <td className="p-6 text-center">
                    <button 
                      onClick={() => toggleExamen(colab.id, colab.examenHabilitado)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        colab.examenHabilitado 
                          ? 'bg-green-500 text-white shadow-lg' 
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {colab.examenHabilitado ? <Unlock size={14} /> : <Lock size={14} />}
                      {colab.examenHabilitado ? 'HABILITADO' : 'BLOQUEADO'}
                    </button>
                  </td>

                  <td className="p-6 text-right font-bold text-slate-700">
                    {colab.progresoTotal || 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}