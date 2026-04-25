// ... (Tus importaciones arriba)
import { onSnapshot, doc } from 'firebase/firestore';

// Dentro de tu función principal:
useEffect(() => {
  const documentoId = localStorage.getItem('colaboradorActivo');
  if (!documentoId) return;

  // ESTA ES LA MAGIA: Escuchamos cambios en tiempo real
  const docRef = doc(db, "colaboradores", documentoId);
  const unsub = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      setUsuario(docSnap.data()); // Si tú cambias el candado en Admin, esto se entera aquí
    }
  });

  return () => unsub(); // Limpiamos al salir
}, []);