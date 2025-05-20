import {Component, OnInit} from '@angular/core';
import {ButtonDirective} from 'primeng/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {RouterLink} from '@angular/router';
import {Document} from '../../../core/models/document';
import {Select} from 'primeng/select';

@Component({
  selector: 'app-new-document',
  imports: [
    ButtonDirective,
    FormsModule,
    InputText,
    ReactiveFormsModule,
    RouterLink,
    Select
  ],
  templateUrl: './new-document.component.html',
  standalone: true,
  styleUrl: './new-document.component.scss'
})
export default class NewDocumentComponent{


  document: Document = {
    documentRepository:'',
    documentName: '',
    idProject: '',
    createDate: '',
    idUser: ''
  };

  rutas = [
    { documentRepository: 'https://github.com/documents/commons', code: 'ruta 1' },
    { documentRepository: 'https://github.com/documents/main', code: 'ruta 2' }
  ];

  createUser() {
    console.log('Usuario creado:', this.document);
    // lógica para enviar al backend
  }

}
