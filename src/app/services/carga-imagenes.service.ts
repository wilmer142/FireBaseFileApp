import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { FileItem } from '../models/file-item';

@Injectable({
  providedIn: 'root'
})
export class CargaImagenesService {

  private CARPETA_IMAGENES = 'img';

  constructor(private db: AngularFirestore) { }

  public cargarImagenes(imagenes: FileItem[]) {
    const storageRef = firebase.storage().ref();

    for(const item of imagenes) {
      if (item.progreso >= 100) {
        continue;
      }
      
      item.estaSubiendo = true;
      const uploadTask: firebase.storage.UploadTask = 
                        storageRef.child(`${this.CARPETA_IMAGENES}/${item.nombre}`)
                                  .put(item.archivo);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, 
        (snapshot: firebase.storage.UploadTaskSnapshot) => item.progreso = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
        (error) => console.log('Error al subir', error),
        () => {
          console.log('Imagen cargada correctamente');
          uploadTask.snapshot.ref.getDownloadURL()
            .then((downloadURL) => {
              item.url =  downloadURL;
              item.estaSubiendo = false;
              this.guardarImagen({ nombre: item.nombre, url: item.url});
            });
        }  
      )
    }
  }

  public guardarImagen(imagen: { nombre: string, url: string}) {
    this.db.collection(`/${this.CARPETA_IMAGENES}`)
      .add(imagen);
  }
}
