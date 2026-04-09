'use client';

import React, { useState } from 'react';
import { CheckCircle, XCircle, ArrowRight, Award, ChevronLeft, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function ExamenPage() {
  // Aquí guardamos el estado del examen (en qué pregunta va, su puntaje, etc.)
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [puntaje, setPuntaje] = useState(0);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);
  const [respuestaRevisada, setRespuestaRevisada] = useState(false);

  // Nuestra base de datos de preguntas del Reglamento de Vista al Vuelo
  const preguntas = [
    {
      pregunta: "¿Cuál es el objetivo principal del manual de 'Cultura Vista al Vuelo' para un nuevo empleado?",
      opciones: [
        "Establecer únicamente los horarios de almuerzo y descansos.",
        "Alinear los valores personales con la misión y visión de la empresa.",
        "Listar exclusivamente los precios de los productos del mirador."
      ],
      respuestaCorrecta: 1 // La opción correcta es la segunda (en programación empezamos a contar desde 0, así que 1 es la segunda)
    },
    {
      pregunta: "En caso de una tormenta eléctrica en el mirador, ¿cuál es el protocolo de seguridad inmediato?",
      opciones: [
        "Permitir que los visitantes sigan tomando fotos si usan paraguas.",
        "Pedir a todos que se reúnan bajo los árboles más altos.",
        "Evacuar a los visitantes hacia las zonas cubiertas y seguras designadas."
      ],
      respuestaCorrecta: 2
    },
    {
      pregunta: "¿Cuál es la importancia de reportar un barandal flojo o una baldosa suelta inmediatamente?",
      opciones: [
        "Prevenir accidentes de visitantes y colaboradores en las zonas de altura.",
        "Evitar que el jefe se enoje durante la inspección mensual.",
        "Esperar a que alguien se tropiece para comprobar si es peligroso."
      ],
      respuestaCorrecta: 0
    },
    {
      pregunta: "Un cliente se queja porque hay mucha niebla y no puede ver la ciudad. ¿Qué acción refleja mejor nuestro servicio?",
      opciones: [
        "Decirle que el clima no es culpa de la empresa.",
        "Ignorar la queja y seguir atendiendo a otros clientes.",
        "Empatizar y ofrecerle una experiencia alternativa o información sobre el clima."
      ],
      respuestaCorrecta: 2
    },
    {
      pregunta: "Al finalizar el turno, ¿cuál es la responsabilidad del colaborador respecto al área de trabajo?",
      opciones: [
        "Irme rápido apenas se cumpla la hora exacta, sin importar cómo quede el lugar.",
        "Dejar el área limpia, organizada y reportar cualquier novedad al siguiente turno.",
        "Dejar la basura para que el personal de aseo la recoja al día siguiente."
      ],
      respuestaCorrecta: 1
    }
  ];

  // Función que se ejecuta cuando el usuario hace clic en una opción
  const manejarRespuesta = (indice) => {
    if (respuestaRevisada) return; // Si ya respondió, no lo deja cambiar
    setOpcionSeleccionada(indice);
    setRespuestaRevisada(true);

    if (indice === preguntas[preguntaActual].respuestaCorrecta) {
      setPuntaje(puntaje + 1);
    }
  };

  // Función para pasar a la siguiente pregunta
  const siguientePregunta = () => {
    const siguiente = preguntaActual + 1;
    if (siguiente < preguntas.length) {
      setPreguntaActual(siguiente);
      setOpcionSeleccionada(null);
      setRespuestaRevisada(false);
    } else {
      setMostrarResultado(true);
    }
  };

  // Pantalla Final: Cuando ya respondió todas las preguntas
  if (mostrarResultado) {
    const porcentaje = Math.round((puntaje / preguntas.length) * 100);
    const aprobo = porcentaje >= 80;

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center border border-slate-100">
          <Award size={80} className={`mx-auto mb-6 ${aprobo ? 'text-green-500' : 'text-red-500'}`} />
          <h2 className="text-3xl font-black text-slate-800 mb-2">
            {aprobo ? '¡Felicitaciones!' : 'Sigue intentando'}
          </h2>
          <p className="text-slate-500 mb-8">Has completado la evaluación del Reglamento Interno.</p>
          
          <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Tu Calificación</p>
            <p className={`text-5xl font-black ${aprobo ? 'text-green-600' : 'text-red-600'}`}>
              {porcentaje}%
            </p>
            <p className="text-sm text-slate-500 mt-2">Acertaste {puntaje} de {preguntas.length} preguntas</p>
          </div>

          <Link href="/progreso" className="block w-full bg-slate-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-lg">
            Volver al Portal
          </Link>
        </div>
      </div>
    );
  }

  // Pantalla del Examen (Mientras está respondiendo)
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* Barra superior */}
      <nav className="bg-slate-900 text-white p-4 shadow-lg">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <Link href="/progreso" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold">
            <ChevronLeft size={20} /> Salir
          </Link>
          <div className="text-[10px] font-bold uppercase tracking-widest bg-orange-500 px-3 py-1 rounded">
            Evaluación
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto p-4 md:p-8 mt-4">
        {/* Barra de progreso del examen */}
        <div className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Pregunta {preguntaActual + 1} de {preguntas.length}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${((preguntaActual + 1) / preguntas.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Tarjeta de la Pregunta */}
        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-10 border border-slate-100">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-relaxed">
            {preguntas[preguntaActual].pregunta}
          </h2>

          <div className="space-y-3">
            {preguntas[preguntaActual].opciones.map((opcion, index) => {
              let claseBoton = "border-slate-200 text-slate-700 hover:border-orange-300 hover:bg-orange-50";
              let Icono = null;

              if (respuestaRevisada) {
                if (index === preguntas[preguntaActual].respuestaCorrecta) {
                  claseBoton = "border-green-500 bg-green-50 text-green-800";
                  Icono = <CheckCircle className="text-green-500" size={24} />;
                } else if (index === opcionSeleccionada) {
                  claseBoton = "border-red-500 bg-red-50 text-red-800";
                  Icono = <XCircle className="text-red-500" size={24} />;
                } else {
                  claseBoton = "border-slate-100 bg-slate-50 text-slate-400 opacity-50";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => manejarRespuesta(index)}
                  disabled={respuestaRevisada}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between font-medium ${claseBoton}`}
                >
                  <span className="pr-4">{opcion}</span>
                  {Icono && <span className="shrink-0">{Icono}</span>}
                </button>
              );
            })}
          </div>

          {/* Botón para avanzar, solo aparece cuando ya respondió */}
          {respuestaRevisada && (
            <div className="mt-8 flex justify-end animate-fade-in">
              <button 
                onClick={siguientePregunta}
                className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-lg"
              >
                {preguntaActual === preguntas.length - 1 ? 'Ver Resultados' : 'Siguiente'}
                <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}