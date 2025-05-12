import {Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  getDocumentsData(){
    return [
      {
        id:'1000',
        documentName:'Documento 1',
        idProject:'a.a@.a',
        createDate:'2025-04-30',
        idUser:'Emiliano Rodriguez'
      },
      {
        id:'1001',
        documentName:'Documento 2',
        idProject:'a.a@.a',
        createDate:'2025-04-30',
        idUser:'Jhon Alvarado'
      },
      {
        id:'1002',
        documentName:'Documento 3',
        idProject:'a.a@.a',
        createDate:'2025-04-30',
        idUser:'Esteban Meza'
      },
      {
        id:'1003',
        documentName:'Documento 4',
        idProject:'a.a@.a',
        createDate:'2025-04-30',
        idUser:'Guillermo Rodolfo'
      },
      {
        id:'1004',
        documentName:'Documento 5',
        idProject:'a.a@.a',
        createDate:'2025-04-30',
        idUser:'Emiliano Rodriguez'
      },
      {
        id:'1005',
        documentName:'Documento 6',
        idProject:'a.a@.a',
        createDate:'2025-04-30',
        idUser:'Jhon Alvarado'
      },
      {
        id:'1006',
        documentName:'Documento 7',
        idProject:'a.a@.a',
        createDate:'2025-04-30',
        idUser:'Esteban Meza'
      },
      {
        id:'1007',
        documentName:'Documento 8',
        idProject:'a.a@.a',
        createDate:'2025-04-30',
        idUser:'Guillermo Rodolfo'
      }
    ];
  }
  getDocuments(){
    return Promise.resolve(this.getDocumentsData());
  }
}
