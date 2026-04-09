'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { MapPin, User, Lock, CreditCard, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';

import { db } from './firebase'; 
// Agregamos getDoc para poder LEER los datos de Firebase
import { doc, setDoc, getDoc } from 'firebase/firestore'; 

export default function PortalInicio() {
  const router = useRouter(); 
  const [esRegistro, setEsRegistro] = useState(false); // Cambié esto a false para que empiece en Iniciar Sesión

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [documento, setDocumento] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);

  const manejarIngreso = async (e) => {
    e.preventDefault(); 
    setCargando(true); 

    try {
      if (esRegistro) {
        // MODO 1: CREAR CUENTA NUEVA (Lo que ya hicimos)
        await setDoc(doc(db, "colaboradores", documento), {
          nombre: nombre,
          apellido: apellido,
          documento: documento,
          password: password, 
          progresoTotal: 0,
          estado: "inscrito",
          fechaInscripcion: new Date().toLocaleDateString('es-CO')
        });
        
        alert("¡Cuenta creada con éxito! Bienvenid@ a Vista al Vuelo.");
        router.push('/progreso'); 

      } else {
        // MODO 2: INICIAR SESIÓN (Lo nuevo ✨)
        // 1. Buscamos el documento con esa cédula en Firebase
        const docRef = doc(db, "colaboradores", documento);
        const docSnap = await getDoc(docRef);

        // 2. Revisamos si la carpeta existe
        if (docSnap.exists()) {
          const datosDelColaborador = docSnap.data();
          
          // 3. Revisamos si la contraseña coincide
          if (datosDelColaborador.password === password) {
            // ¡Todo coincide! Le damos paso
            router.push('/progreso');
          } else {
            // Cédula correcta, pero contraseña equivocada
            alert("Contraseña incorrecta. Por favor, inténtalo de nuevo.");
          }
        } else {
          // La cédula no está en la base de datos
          alert("No encontramos ningún colaborador registrado con ese número de documento.");
        }
      }
      
    } catch (error) {
      console.error("Error conectando a la base de datos:", error);
      alert("Ups, tuvimos un problema de conexión.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="max-w-5xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Mitad Izquierda: Diseño corporativo */}
        <div className="md:w-5/12 bg-slate-900 text-white p-10 md:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full -mr-20 -mt-20 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 text-orange-500 mb-8">
              <MapPin size={32} />
              <span className="text-2xl font-black tracking-tight text-white">VISTA AL VUELO</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
              Bienvenidos al Módulo de Capacitación
            </h1>
            <p className="text-slate-400 font-medium leading-relaxed mb-8">
              Portal exclusivo para colaboradores de <strong className="text-orange-500">Jaragua de Inversiones S.A.S.</strong> 
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                <CheckCircle size={20} className="text-orange-500" /> Seguimiento en la nube
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                <CheckCircle size={20} className="text-orange-500" /> Certificación oficial
              </div>
            </div>
          </div>
        </div>

        {/* Mitad Derecha: Formulario */}
        <div className="md:w-7/12 p-10 md:p-16 bg-white">
          <div className="flex gap-4 mb-10 border-b border-slate-100 pb-4">
            <button onClick={() => setEsRegistro(false)} className={`text-lg font-black transition-colors ${!esRegistro ? 'text-slate-800' : 'text-slate-300'}`}>
              Ingresar
            </button>
            <button onClick={() => setEsRegistro(true)} className={`text-lg font-black transition-colors ${esRegistro ? 'text-orange-600' : 'text-slate-300'}`}>
              Inscripción
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-800">
              {esRegistro ? 'Haz tu inscripción aquí' : 'Bienvenido de nuevo'}
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              {esRegistro ? 'Crea tu cuenta para comenzar tu entrenamiento.' : 'Ingresa tus datos para continuar donde lo dejaste.'}
            </p>
          </div>

          <form onSubmit={manejarIngreso} className="space-y-5">
            {esRegistro && (
              <div className="flex flex-col md:flex-row gap-5">
                <div className="flex-1 relative">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Nombre</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input required={esRegistro} type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Nataly" className="w-full bg-slate-50 border border-slate-200 px-12 py-3 rounded-xl focus:outline-none focus:border-orange-500 font-medium" />
                  </div>
                </div>
                <div className="flex-1 relative">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Apellido</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input required={esRegistro} type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Ej. Martinez" className="w-full bg-slate-50 border border-slate-200 px-12 py-3 rounded-xl focus:outline-none focus:border-orange-500 font-medium" />
                  </div>
                </div>
              </div>
            )}

            <div className="relative">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Número de Documento</label>
              <div className="relative">
                <CreditCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input required type="number" value={documento} onChange={(e) => setDocumento(e.target.value)} placeholder="Tu número de cédula sin puntos" className="w-full bg-slate-50 border border-slate-200 px-12 py-3 rounded-xl focus:outline-none focus:border-orange-500 font-medium" />
              </div>
            </div>

            <div className="relative">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Contraseña</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 px-12 py-3 rounded-xl focus:outline-none focus:border-orange-500 font-medium" />
              </div>
            </div>

            <button disabled={cargando} type="submit" className="w-full bg-orange-600 text-white py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-900 transition-colors shadow-lg mt-8 disabled:opacity-50">
              {cargando ? (
                <><Loader2 className="animate-spin" size={20} /> Validando...</>
              ) : (
                <>{esRegistro ? 'Crear mi cuenta' : 'Ingresar al Portal'} <ArrowRight size={20} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}