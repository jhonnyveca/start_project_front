import {Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  getTemplatesData(){
    return [
      {
        id:'1000',
        questionTemplate:'Pregunta  1',
        idProject:'a.a@.a',
        createDate:'2025-04-30',
        idUser:'Emiliano Rodriguez'
      },
      {
        id:'1001',
        questionTemplate:'Pregunta  2',
        idProject:'a.a@.a',
        createDate:'2025-04-30',
        idUser:'Jhon Alvarado'
      },
      {
        id:'1002',
        questionTemplate:'Pregunta  3',
        idProject:'a.a@.a',
        createDate:'2025-04-30',
        idUser:'Esteban Meza'
      },
      {
        id:'1003',
        questionTemplate:'Pregunta  4',
        idProject:'a.a@.a',
        createDate:'2025-04-30',
        idUser:'Guillermo Rodolfo'
      },
      {
        id:'1004',
        questionTemplate:'Pregunta  5',
        idProject:'a.a@.a',
        createDate:'2025-04-30',
        idUser:'Emiliano Rodriguez'
      },
      {
        id:'1005',
        questionTemplate:'Pregunta  6',
        idProject:'a.a@.a',
        createDate:'2025-04-30',
        idUser:'Jhon Alvarado'
      },
      {
        id:'1006',
        questionTemplate:'Pregunta  7',
        idProject:'a.a@.a',
        createDate:'2025-04-30',
        idUser:'Esteban Meza'
      },
      {
        id:'1007',
        questionTemplate:'Pregunta  8',
        idProject:'a.a@.a',
        createDate:'2025-04-30',
        idUser:'Guillermo Rodolfo'
      }
    ];
  }
  getDocuments(){
    return Promise.resolve(this.getTemplatesData());
  }
}
