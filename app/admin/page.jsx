'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, TrendingUp, Award, Search, BarChart3, Loader2, 
  ArrowLeft, Unlock, Lock, CheckCircle, XCircle, Printer,
  Plus, Trash2, Save, BookOpen, Video, FileText, 
  HelpCircle, Edit3, ToggleLeft, ToggleRight
} from 'lucide-react';
import Link from 'next/link';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';

// ==================== CERTIFICADO ====================
function Certificado({ colaborador, numeroCertificado, onCerrar }) {
  const fechaHoy = new Date().toLocaleDateString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const imprimir = () => window.print();

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="absolute top-6 right-6 flex gap-3 print:hidden">
        <button onClick={imprimir} className="flex items-center gap-2 bg-white text-slate-900 px-5 py-2 rounded-xl font-bold hover:bg-orange-500 hover:text-white transition-all">
          <Printer size={16} /> Imprimir
        </button>
        <button onClick={onCerrar} className="flex items-center gap-2 bg-slate-700 text-white px-5 py-2 rounded-xl font-bold hover:bg-red-500 transition-all">
          Cerrar
        </button>
      </div>
      <div id="certificado" className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl print:shadow-none print:rounded-none print:max-w-full" style={{ fontFamily: 'Georgia, serif' }}>
        <div className="bg-slate-900 p-6 text-center">
          <p className="text-orange-500 font-black uppercase tracking-[0.4em] text-xs">Vista al Vuelo</p>
          <p className="text-slate-400 text-xs mt-1 tracking-widest uppercase">Jaragua de Inversiones S.A.S.</p>
        </div>
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
            <h3 className="text-2xl font-black text-orange-500 uppercase tracking-widest">Acoso Laboral</h3>
          </div>
          <div className="w-16 h-1 bg-orange-500 mx-auto rounded-full" />
          <div className="flex justify-between text-sm text-slate-500">
            <p>Ciudad: <strong className="text-slate-900">Medellín</strong></p>
            <p>Fecha: <strong className="text-slate-900">{fechaHoy}</strong></p>
          </div>
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
        <div className="bg-slate-900 p-4 text-center">
          <p className="text-slate-400 text-xs tracking-widest uppercase">
            Este certificado valida la participación y aprobación del programa de capacitación interna.
          </p>
        </div>
      </div>
    </div>
  );
}

// ==================== GESTOR DE MÓDULOS ====================
const moduloInicial = {
  id: '', titulo: '', objetivo: '', videoUrl: '',
  secciones: [], casoPractico: { titulo: '', relato: '' },
  preguntas: [], materiales: []
};

// ✅ CAMBIO: agregamos videoUrl a seccionInicial
const seccionInicial = {
  icono: 'definicion', titulo: '', contenido: '', videoUrl: '', tienePregunta: false,
  pregunta: { enunciado: '', opciones: ['', '', '', ''], correcta: 0, explicacion: '' }
};

function GestorModulos() {
  const [modulos, setModulos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [vista, setVista] = useState('lista');
  const [moduloActual, setModuloActual] = useState(moduloInicial);
  const [seccionesActivas, setSeccionesActivas] = useState({
    objetivo: false, video: false, secciones: false,
    casoPractico: false, preguntas: false, materiales: false
  });
  const [guardando, setGuardando] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => { cargarModulos(); }, []);

  const cargarModulos = async () => {
    try {
      const snap = await getDocs(collection(db, "curriculum"));
      setModulos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error cargando módulos:", error);
    } finally {
      setCargando(false);
    }
  };

  const iniciarCreacion = () => {
    setModuloActual(moduloInicial);
    setSeccionesActivas({ objetivo: false, video: false, secciones: false, casoPractico: false, preguntas: false, materiales: false });
    setModoEdicion(false);
    setVista('formulario');
  };

  const iniciarEdicion = (modulo) => {
    setModuloActual({
      ...modulo,
      casoPractico: modulo.casoPractico || { titulo: '', relato: '' },
      // ✅ CAMBIO: incluimos videoUrl al cargar cada sección
      secciones: (modulo.secciones || []).map(s => ({
        ...s,
        videoUrl: s.videoUrl || '',
        tienePregunta: !!s.pregunta,
        pregunta: s.pregunta || { enunciado: '', opciones: ['', '', '', ''], correcta: 0, explicacion: '' }
      })),
      preguntas: modulo.preguntas || [],
      materiales: modulo.materiales || []
    });
    setSeccionesActivas({
      objetivo: !!modulo.objetivo,
      video: !!modulo.videoUrl,
      secciones: !!(modulo.secciones?.length > 0),
      casoPractico: !!modulo.casoPractico,
      preguntas: !!(modulo.preguntas?.length > 0),
      materiales: !!(modulo.materiales?.length > 0)
    });
    setModoEdicion(true);
    setVista('formulario');
  };

  const toggleSeccion = (seccion) => setSeccionesActivas(prev => ({ ...prev, [seccion]: !prev[seccion] }));

  const agregarSeccion = () => setModuloActual(prev => ({ ...prev, secciones: [...prev.secciones, { ...seccionInicial, pregunta: { enunciado: '', opciones: ['', '', '', ''], correcta: 0, explicacion: '' } }] }));
  const eliminarSeccion = (i) => setModuloActual(prev => ({ ...prev, secciones: prev.secciones.filter((_, idx) => idx !== i) }));
  const actualizarSeccion = (i, campo, valor) => setModuloActual(prev => ({ ...prev, secciones: prev.secciones.map((s, idx) => idx === i ? { ...s, [campo]: valor } : s) }));
  const actualizarPreguntaSeccion = (si, campo, valor) => setModuloActual(prev => ({ ...prev, secciones: prev.secciones.map((s, i) => i === si ? { ...s, pregunta: { ...s.pregunta, [campo]: valor } } : s) }));
  const actualizarOpcionSeccion = (si, oi, valor) => setModuloActual(prev => ({ ...prev, secciones: prev.secciones.map((s, i) => i === si ? { ...s, pregunta: { ...s.pregunta, opciones: s.pregunta.opciones.map((o, j) => j === oi ? valor : o) } } : s) }));

  const agregarPregunta = () => setModuloActual(prev => ({ ...prev, preguntas: [...prev.preguntas, { enunciado: '', opciones: ['', '', '', ''], correcta: 0, explicacion: '' }] }));
  const eliminarPregunta = (i) => setModuloActual(prev => ({ ...prev, preguntas: prev.preguntas.filter((_, idx) => idx !== i) }));
  const actualizarPregunta = (i, campo, valor) => setModuloActual(prev => ({ ...prev, preguntas: prev.preguntas.map((p, idx) => idx === i ? { ...p, [campo]: valor } : p) }));
  const actualizarOpcionPregunta = (pi, oi, valor) => setModuloActual(prev => ({ ...prev, preguntas: prev.preguntas.map((p, i) => i === pi ? { ...p, opciones: p.opciones.map((o, j) => j === oi ? valor : o) } : p) }));

  const agregarMaterial = () => setModuloActual(prev => ({ ...prev, materiales: [...prev.materiales, { nombre: '', url: '' }] }));
  const eliminarMaterial = (i) => setModuloActual(prev => ({ ...prev, materiales: prev.materiales.filter((_, idx) => idx !== i) }));
  const actualizarMaterial = (i, campo, valor) => setModuloActual(prev => ({ ...prev, materiales: prev.materiales.map((m, idx) => idx === i ? { ...m, [campo]: valor } : m) }));

  const guardarModulo = async () => {
    if (!moduloActual.id || !moduloActual.titulo) {
      alert("El ID y el título son obligatorios.");
      return;
    }
    setGuardando(true);
    try {
      const datos = { titulo: moduloActual.titulo };
      if (seccionesActivas.objetivo) datos.objetivo = moduloActual.objetivo;
      if (seccionesActivas.video) datos.videoUrl = moduloActual.videoUrl;
      if (seccionesActivas.secciones) {
        datos.secciones = moduloActual.secciones.map(s => {
          const sec = { icono: s.icono, titulo: s.titulo, contenido: s.contenido };
          // ✅ CAMBIO: guardamos videoUrl si existe
          if (s.videoUrl) sec.videoUrl = s.videoUrl;
          if (s.tienePregunta) sec.pregunta = s.pregunta;
          return sec;
        });
      }
      if (seccionesActivas.casoPractico) datos.casoPractico = moduloActual.casoPractico;
      if (seccionesActivas.preguntas) datos.preguntas = moduloActual.preguntas;
      if (seccionesActivas.materiales) datos.materiales = moduloActual.materiales;

      await setDoc(doc(db, "curriculum", moduloActual.id), datos);
      await cargarModulos();
      setVista('lista');
      alert(modoEdicion ? "¡Módulo actualizado!" : "¡Módulo creado!");
    } catch (error) {
      alert("Error al guardar.");
    } finally {
      setGuardando(false);
    }
  };

  const inputClase = "w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-500 font-medium text-slate-800";
  const labelClase = "text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block";

  const ToggleBoton = ({ activo, onClick, children }) => (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activo ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
      {activo ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
      {children}
    </button>
  );

  if (vista === 'lista') return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Módulos de Capacitación</h2>
          <p className="text-sm text-slate-500">Crea y gestiona los módulos del portal.</p>
        </div>
        <button onClick={iniciarCreacion} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl font-bold transition-all">
          <Plus size={18} /> Nuevo Módulo
        </button>
      </div>
      {cargando ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-orange-500" size={32} /></div>
      ) : modulos.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
          <BookOpen size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">No hay módulos creados aún.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {modulos.map(modulo => (
            <div key={modulo.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center font-black text-lg">
                  {String(modulo.id).replace('modulo_', '')}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{modulo.titulo}</h3>
                  <p className="text-xs text-slate-400">ID: {modulo.id}</p>
                </div>
              </div>
              <button onClick={() => iniciarEdicion(modulo)} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-xl font-bold text-sm transition-all">
                <Edit3 size={14} /> Editar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setVista('lista')} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{modoEdicion ? 'Editar Módulo' : 'Nuevo Módulo'}</h2>
            <p className="text-sm text-slate-500">Activa las secciones que necesites.</p>
          </div>
        </div>
        <button onClick={guardarModulo} disabled={guardando} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50">
          {guardando ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          {modoEdicion ? 'Actualizar' : 'Guardar Módulo'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h3 className="font-black text-slate-800 flex items-center gap-2"><BookOpen size={18} className="text-orange-500" /> Datos Básicos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClase}>ID del Módulo</label>
            <input type="text" placeholder="ej: modulo_2" value={moduloActual.id} onChange={e => setModuloActual(prev => ({ ...prev, id: e.target.value }))} disabled={modoEdicion} className={`${inputClase} ${modoEdicion ? 'opacity-50 cursor-not-allowed' : ''}`} />
            <p className="text-xs text-slate-400 mt-1">Formato: modulo_1, modulo_2, etc.</p>
          </div>
          <div>
            <label className={labelClase}>Título del Módulo</label>
            <input type="text" placeholder="ej: Acoso Laboral" value={moduloActual.titulo} onChange={e => setModuloActual(prev => ({ ...prev, titulo: e.target.value }))} className={inputClase} />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="font-black text-slate-800 mb-4">¿Qué secciones incluye este módulo?</h3>
        <div className="flex flex-wrap gap-3">
          <ToggleBoton activo={seccionesActivas.objetivo} onClick={() => toggleSeccion('objetivo')}>Objetivo</ToggleBoton>
          <ToggleBoton activo={seccionesActivas.video} onClick={() => toggleSeccion('video')}>Video</ToggleBoton>
          <ToggleBoton activo={seccionesActivas.secciones} onClick={() => toggleSeccion('secciones')}>Secciones de Contenido</ToggleBoton>
          <ToggleBoton activo={seccionesActivas.casoPractico} onClick={() => toggleSeccion('casoPractico')}>Caso Práctico</ToggleBoton>
          <ToggleBoton activo={seccionesActivas.preguntas} onClick={() => toggleSeccion('preguntas')}>Preguntas del Examen</ToggleBoton>
          <ToggleBoton activo={seccionesActivas.materiales} onClick={() => toggleSeccion('materiales')}>Materiales</ToggleBoton>
        </div>
      </div>

      {seccionesActivas.objetivo && (
        <div className="bg-white p-6 rounded-3xl border border-orange-200 shadow-sm space-y-3">
          <h3 className="font-black text-slate-800">Objetivo del Módulo</h3>
          <textarea rows={3} placeholder="Describe el objetivo..." value={moduloActual.objetivo} onChange={e => setModuloActual(prev => ({ ...prev, objetivo: e.target.value }))} className={inputClase} />
        </div>
      )}

      {seccionesActivas.video && (
        <div className="bg-white p-6 rounded-3xl border border-orange-200 shadow-sm space-y-3">
          <h3 className="font-black text-slate-800 flex items-center gap-2"><Video size={18} className="text-orange-500" /> URL del Video Principal</h3>
          <input type="text" placeholder="https://www.youtube.com/embed/XXXXXXXXX" value={moduloActual.videoUrl} onChange={e => setModuloActual(prev => ({ ...prev, videoUrl: e.target.value }))} className={inputClase} />
          <p className="text-xs text-slate-400">Formato embed de YouTube: youtube.com/embed/ID</p>
        </div>
      )}

      {seccionesActivas.secciones && (
        <div className="bg-white p-6 rounded-3xl border border-orange-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-800">Secciones de Contenido</h3>
            <button onClick={agregarSeccion} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">
              <Plus size={14} /> Agregar Sección
            </button>
          </div>
          {moduloActual.secciones.length === 0 && <p className="text-center text-slate-400 text-sm py-4">Haz clic en "Agregar Sección" para comenzar.</p>}
          {moduloActual.secciones.map((seccion, sIndex) => (
            <div key={sIndex} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-orange-500 uppercase tracking-widest">Sección {sIndex + 1}</span>
                <button onClick={() => eliminarSeccion(sIndex)} className="p-1 hover:bg-red-100 rounded-lg transition-all"><Trash2 size={14} className="text-red-400" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClase}>Ícono</label>
                  <select value={seccion.icono} onChange={e => actualizarSeccion(sIndex, 'icono', e.target.value)} className={inputClase}>
                    <option value="definicion">📖 Definición</option>
                    <option value="ley">⚖️ Ley / Marco normativo</option>
                    <option value="tipos">⚠️ Tipos</option>
                    <option value="noesacoso">🛡️ Lo que NO es</option>
                    <option value="comite">👥 Comité</option>
                    <option value="ruta">🗺️ Ruta de actuación</option>
                  </select>
                </div>
                <div>
                  <label className={labelClase}>Título</label>
                  <input type="text" placeholder="ej: Marco Normativo" value={seccion.titulo} onChange={e => actualizarSeccion(sIndex, 'titulo', e.target.value)} className={inputClase} />
                </div>
              </div>
              <div>
                <label className={labelClase}>Contenido</label>
                <textarea rows={4} placeholder="Contenido de la sección..." value={seccion.contenido} onChange={e => actualizarSeccion(sIndex, 'contenido', e.target.value)} className={inputClase} />
              </div>

              {/* ✅ NUEVO: Campo de video por sección */}
              <div>
                <label className={labelClase}>Video de la sección (opcional)</label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/embed/XXXXXXXXX"
                  value={seccion.videoUrl || ''}
                  onChange={e => actualizarSeccion(sIndex, 'videoUrl', e.target.value)}
                  className={inputClase}
                />
                <p className="text-xs text-slate-400 mt-1">Deja vacío si esta sección no tiene video.</p>
              </div>

              <button onClick={() => actualizarSeccion(sIndex, 'tienePregunta', !seccion.tienePregunta)} className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold transition-all ${seccion.tienePregunta ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                <HelpCircle size={12} /> {seccion.tienePregunta ? 'Pregunta activada' : 'Agregar pregunta de comprensión'}
              </button>
              {seccion.tienePregunta && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <p className="text-xs font-black text-orange-500 uppercase tracking-widest">Pregunta de Comprensión</p>
                  <input type="text" placeholder="Enunciado..." value={seccion.pregunta.enunciado} onChange={e => actualizarPreguntaSeccion(sIndex, 'enunciado', e.target.value)} className={inputClase} />
                  <div className="space-y-2">
                    {seccion.pregunta.opciones.map((opcion, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-3">
                        <input type="radio" name={`correcta_s_${sIndex}`} checked={seccion.pregunta.correcta === oIndex} onChange={() => actualizarPreguntaSeccion(sIndex, 'correcta', oIndex)} className="accent-orange-500" />
                        <input type="text" placeholder={`Opción ${oIndex + 1}`} value={opcion} onChange={e => actualizarOpcionSeccion(sIndex, oIndex, e.target.value)} className={inputClase} />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400">El radio button indica la respuesta correcta</p>
                  <input type="text" placeholder="Explicación de la respuesta..." value={seccion.pregunta.explicacion} onChange={e => actualizarPreguntaSeccion(sIndex, 'explicacion', e.target.value)} className={inputClase} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {seccionesActivas.casoPractico && (
        <div className="bg-white p-6 rounded-3xl border border-orange-200 shadow-sm space-y-4">
          <h3 className="font-black text-slate-800">Caso Práctico</h3>
          <div>
            <label className={labelClase}>Título del Caso</label>
            <input type="text" placeholder="ej: Estamos en Temporada Alta" value={moduloActual.casoPractico.titulo} onChange={e => setModuloActual(prev => ({ ...prev, casoPractico: { ...prev.casoPractico, titulo: e.target.value } }))} className={inputClase} />
          </div>
          <div>
            <label className={labelClase}>Relato</label>
            <textarea rows={6} placeholder="Describe el caso práctico..." value={moduloActual.casoPractico.relato} onChange={e => setModuloActual(prev => ({ ...prev, casoPractico: { ...prev.casoPractico, relato: e.target.value } }))} className={inputClase} />
          </div>
        </div>
      )}

      {seccionesActivas.preguntas && (
        <div className="bg-white p-6 rounded-3xl border border-orange-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-800">Preguntas del Examen</h3>
              <p className="text-xs text-slate-400">{moduloActual.preguntas.length} pregunta(s)</p>
            </div>
            <button onClick={agregarPregunta} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">
              <Plus size={14} /> Agregar Pregunta
            </button>
          </div>
          {moduloActual.preguntas.length === 0 && <p className="text-center text-slate-400 text-sm py-4">Haz clic en "Agregar Pregunta" para comenzar.</p>}
          {moduloActual.preguntas.map((pregunta, pIndex) => (
            <div key={pIndex} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-orange-500 uppercase tracking-widest">Pregunta {pIndex + 1}</span>
                <button onClick={() => eliminarPregunta(pIndex)} className="p-1 hover:bg-red-100 rounded-lg transition-all"><Trash2 size={14} className="text-red-400" /></button>
              </div>
              <input type="text" placeholder="Enunciado..." value={pregunta.enunciado} onChange={e => actualizarPregunta(pIndex, 'enunciado', e.target.value)} className={inputClase} />
              <div className="space-y-2">
                <label className={labelClase}>Opciones (selecciona la correcta)</label>
                {pregunta.opciones.map((opcion, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-3">
                    <input type="radio" name={`correcta_${pIndex}`} checked={pregunta.correcta === oIndex} onChange={() => actualizarPregunta(pIndex, 'correcta', oIndex)} className="accent-orange-500" />
                    <input type="text" placeholder={`Opción ${oIndex + 1}`} value={opcion} onChange={e => actualizarOpcionPregunta(pIndex, oIndex, e.target.value)} className={inputClase} />
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400">El radio button indica la respuesta correcta</p>
              <div>
                <label className={labelClase}>Explicación</label>
                <input type="text" placeholder="¿Por qué esta es la respuesta correcta?" value={pregunta.explicacion} onChange={e => actualizarPregunta(pIndex, 'explicacion', e.target.value)} className={inputClase} />
              </div>
            </div>
          ))}
        </div>
      )}

      {seccionesActivas.materiales && (
        <div className="bg-white p-6 rounded-3xl border border-orange-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-800 flex items-center gap-2"><FileText size={18} className="text-orange-500" /> Materiales de Apoyo</h3>
            <button onClick={agregarMaterial} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">
              <Plus size={14} /> Agregar Material
            </button>
          </div>
          {moduloActual.materiales.length === 0 && <p className="text-center text-slate-400 text-sm py-4">Haz clic en "Agregar Material" para comenzar.</p>}
          {moduloActual.materiales.map((material, mIndex) => (
            <div key={mIndex} className="flex items-center gap-3">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <input type="text" placeholder="Nombre del archivo" value={material.nombre} onChange={e => actualizarMaterial(mIndex, 'nombre', e.target.value)} className={inputClase} />
                <input type="text" placeholder="URL del archivo" value={material.url} onChange={e => actualizarMaterial(mIndex, 'url', e.target.value)} className={inputClase} />
              </div>
              <button onClick={() => eliminarMaterial(mIndex)} className="p-2 hover:bg-red-100 rounded-lg transition-all"><Trash2 size={14} className="text-red-400" /></button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button onClick={() => setVista('lista')} className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition-all">Cancelar</button>
        <button onClick={guardarModulo} disabled={guardando} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50">
          {guardando ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          {modoEdicion ? 'Actualizar Módulo' : 'Guardar Módulo'}
        </button>
      </div>
    </div>
  );
}

// ==================== ADMIN DASHBOARD ====================
export default function AdminDashboard() {
  const [pestanaActiva, setPestanaActiva] = useState('colaboradores');
  const [colaboradores, setColaboradores] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [certificadoActivo, setCertificadoActivo] = useState(null);
  const [totalCertificados, setTotalCertificados] = useState(0);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "colaboradores"));
        const lista = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setColaboradores(lista);
        setTotalCertificados(lista.filter(c => c.certificadoEmitido).length);
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
      setColaboradores(colaboradores.map(c => c.id === colaboradorId ? { ...c, examenHabilitado: nuevoEstado } : c));
    } catch (error) {
      alert("No se pudo cambiar el estado.");
    }
  };

  const emitirCertificado = async (colaborador) => {
    try {
      if (!colaborador.certificadoEmitido) {
        const nuevoCertificado = totalCertificados + 1;
        const colaboradorRef = doc(db, "colaboradores", colaborador.id);
        await updateDoc(colaboradorRef, { certificadoEmitido: true, numeroCertificado: nuevoCertificado });
        setColaboradores(colaboradores.map(c => c.id === colaborador.id ? { ...c, certificadoEmitido: true, numeroCertificado: nuevoCertificado } : c));
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

      {certificadoActivo && (
        <Certificado colaborador={certificadoActivo} numeroCertificado={certificadoActivo.numeroCertificado} onCerrar={() => setCertificadoActivo(null)} />
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

        <div className="flex gap-2 border-b border-slate-200">
          <button onClick={() => setPestanaActiva('colaboradores')} className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${pestanaActiva === 'colaboradores' ? 'border-orange-500 text-orange-500' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
            👥 Colaboradores
          </button>
          <button onClick={() => setPestanaActiva('modulos')} className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${pestanaActiva === 'modulos' ? 'border-orange-500 text-orange-500' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
            📚 Módulos
          </button>
        </div>

        {pestanaActiva === 'colaboradores' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Directorio de Capacitación</h2>
                <p className="text-sm text-slate-500">Monitorea el avance de tu equipo en tiempo real.</p>
              </div>
              <div className="relative w-full md:w-72">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Buscar colaborador..." value={busqueda} onChange={e => setBusqueda(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none" />
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
                  {filtrados.map(colab => (
                    <tr key={colab.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm uppercase">
                            {colab.nombre?.charAt(0) || '?'}
                          </div>
                          <p className="font-bold text-slate-800 capitalize">{colab.nombre} {colab.apellido}</p>
                        </div>
                      </td>
                      <td className="p-6 text-sm text-slate-500 font-medium hidden md:table-cell">{colab.documento}</td>
                      <td className="p-6 text-center">
                        {colab.ultimoExamen ? (
                          <div className="flex flex-col items-center gap-1">
                            {colab.ultimoExamen.aprobado ? (
                              <span className="flex items-center gap-1 text-green-600 font-bold text-xs"><CheckCircle size={14} /> Aprobado</span>
                            ) : (
                              <span className="flex items-center gap-1 text-red-500 font-bold text-xs"><XCircle size={14} /> No aprobado</span>
                            )}
                            <span className="text-slate-400 text-xs">{colab.ultimoExamen.puntaje}/{colab.ultimoExamen.total} correctas</span>
                            <span className="text-slate-300 text-xs">{colab.ultimoExamen.fecha}</span>
                          </div>
                        ) : (
                          <span className="text-slate-300 text-xs">Sin examen</span>
                        )}
                      </td>
                      <td className="p-6 text-center">
                        <button onClick={() => toggleExamen(colab.id, colab.examenHabilitado)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${colab.examenHabilitado ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                          {colab.examenHabilitado ? <Unlock size={14} /> : <Lock size={14} />}
                          {colab.examenHabilitado ? 'Habilitado' : 'Bloqueado'}
                        </button>
                      </td>
                      <td className="p-6 text-center">
                        {colab.ultimoExamen?.aprobado ? (
                          <button onClick={() => emitirCertificado(colab)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${colab.certificadoEmitido ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-orange-500 text-white hover:bg-orange-600'}`}>
                            <Award size={14} />
                            {colab.certificadoEmitido ? `Ver Cert. N°${String(colab.numeroCertificado).padStart(3, '0')}` : 'Emitir Certificado'}
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
        )}

        {pestanaActiva === 'modulos' && <GestorModulos />}

      </div>
    </div>
  );
}