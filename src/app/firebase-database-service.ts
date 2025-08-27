import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { ref, onValue, set, update, push, remove, getDatabase, get } from "firebase/database";

import { Observable } from 'rxjs';


const firebaseConfig = {
    apiKey: "AIzaSyAuIhNOePMCx9CFS9F2tdGZiVV9F_C5RzM",
    authDomain: "rout-9f25c.firebaseapp.com",
    databaseURL: "https://rout-9f25c-default-rtdb.firebaseio.com",
    projectId: "rout-9f25c",
    storageBucket: "rout-9f25c.firebasestorage.app",
    messagingSenderId: "478241178049",
    appId: "1:478241178049:web:dc149c2c4e13e539922f40"
};

@Injectable({
    providedIn: 'root'
})
export class FirebaseDatabaseService {
    private db: any;

    constructor() {
        const app = initializeApp(firebaseConfig);
        this.db = getDatabase(app);
    }


    getData(path: string): Observable<any> {
        return new Observable(observer => {
            const dbRef = ref(this.db, path);
            onValue(dbRef, (snapshot) => {
                const data = snapshot.val();
                observer.next(data);
            }, { onlyOnce: false }); // onlyOnce = true para obtener solo una vez
        });
    }

    setData(path: string, data: any): Promise<void> {
        const dbRef = ref(this.db, path);
        return set(dbRef, data);
    }

    updateData(path: string, data: any): Promise<void> {
        const dbRef = ref(this.db, path);
        return update(dbRef, data);
    }

    pushData(path: string, data: any): Promise<string> {
        const dbRef = ref(this.db, path);
        return push(dbRef, data)
            .then((snapshot) => {
                const key = snapshot.key;
                if (key) {
                    return key; // Retorna la clave si existe
                } else {
                    throw new Error("La clave es nula.  Error al agregar datos."); // Lanza un error si la clave es nula
                }
            })
            .catch((error) => {
                console.error("Error al agregar datos:", error);
                throw error; // Re-lanza el error para que se pueda manejar en el componente
            });
    }


    removeData(path: string): Promise<void> {
        const dbRef = ref(this.db, path);
        return remove(dbRef);
    }


    async getAndIncrementCounter(): Promise<number> {
        const counterRef = ref(this.db, 'contador');
        let currentCounter = await this.getCounter();

        //Usando update para hacer la operación de forma atomica
        await update(counterRef, { value: currentCounter + 1 });

        return currentCounter;
    }

    async getCounter(): Promise<number> {
        const counterRef = ref(this.db, 'contador');
        const snapshot = await get(counterRef);
        return snapshot.exists() ? snapshot.val().value : 10000; //Valor inicial por defecto
    }

    async generateCode(): Promise<string> {
        const counter = await this.getAndIncrementCounter();
        const code = counter.toString().padStart(5, '0'); // Asegura 5 dígitos
        return code;
    }


    // Función para buscar un registro por código como string
    getRecordByCode(code: string): Promise<Record> {
        const db = getDatabase();
        return new Promise((resolve, reject) => {
            const recordRef = ref(db, 'records');
            onValue(recordRef, (snapshot) => {
                const records = snapshot.val() as { [key: string]: Record }; // Definir el tipo de records
                if (records) {
                    // Busca un registro cuyo código coincida
                    const foundRecord = Object.entries(records).find(([key, record]) => record.code === code);
                    if (foundRecord && typeof foundRecord[1] === 'object') { // Verifica que el segundo elemento sea un objeto
                        resolve({ key: foundRecord[0], ...foundRecord[1] } as Record);
                    } else {
                        reject('No se obtuvieron valores'); // Caso donde no se encuentra el registro
                    }
                } else {
                    reject('No se obtuvieron valores'); // Si no hay registros en la base de datos
                }
            }, { onlyOnce: true }); // Solo leer una vez
        });
    }

    // Función para actualizar el estado de un código específico
    updateCodeStatus(code: string, newStatus: string): Promise<void> {
        return this.getRecordByCode(code)
            .then(record => {
                const db = getDatabase();
                // Actualiza el estado del código en la base de datos
                return update(ref(db, `records/${record.key}`), { codeStatus: newStatus });
            })
            .then(() => {
                console.log('Código actualizado con éxito'); // Mensaje de éxito
            })
            .catch(error => {
                console.error('Error al actualizar el código:', error); // Manejo de errores
                throw error; // Re-lanzar el error para que pueda ser manejado por el llamador
            });
    }

    // Función para eliminar todos los datos de un path específico
    deleteAllData(path: string): Observable<any> {
        return new Observable(observer => {
            const dbRef = ref(this.db, path);
            remove(dbRef)
                .then(() => {
                    observer.next('Datos eliminados exitosamente');
                    observer.complete();
                })
                .catch(error => {
                    observer.error(error);
                });
        });
    }

}

interface Record {
    key?: string;  // La clave de Firebase, opcional
    code: string;  // Código del registro
    codeStatus?: string;  // Estado del código
}