import { Injectable } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import { CONFIG } from '../config';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class StorageService {

  constructor(private firebaseStorage: AngularFireStorage) { }

  uploadFileByUID(uid: string, defaultFileName: string, file: any): Observable<any> {
    let observable = new Observable((observer) => {
      var fileName: string = file.name;
      var fileExtn: string = (file.name).substr(fileName.length - 4, 4);
      //console.log(defaultFileName, fileExtn);
      var storageRef: any = this.firebaseStorage.storage.ref(uid + '/' + defaultFileName + fileExtn);
      var uploadTask: any = storageRef.put(file);
      uploadTask.on('state_changed', (res) => {
        observer.next(res);
      }, (err) => {
        observer.error(err);
      });
    });
    return observable;
  }

  deleteFileByUID(uid: string, defaultFileName: string): Promise<any> {
    var promise: any = new Promise((resole, reject) => {
      var storageRef: any = this.firebaseStorage.storage.ref(uid + '/' + defaultFileName);
      storageRef.delete().then((res) => {
        resole.call(this, res);
      }).catch((err) => {
        reject.call(this, err);
      });
    });
    return promise;
  }

}
