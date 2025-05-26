import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ButtonDirective} from 'primeng/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {Document} from '../../../core/models/document';
import {FileUploadModule} from 'primeng/fileupload';
import {DropdownModule} from 'primeng/dropdown';
import {NgForOf, NgIf} from '@angular/common';


@Component({
  selector: 'app-new-document',
  imports: [
    ButtonDirective,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    FileUploadModule,
    DropdownModule,
    NgIf
  ],
  templateUrl: './new-document.component.html',
  standalone: true,
  styleUrl: './new-document.component.scss'
})
export default class NewDocumentComponent{
  @ViewChild('fileInput') fileInput!: ElementRef;

  rutas:any[] = [
    { documentRepository: 'https://github.com/documents/commons'},
    { documentRepository: 'https://github.com/documents/main' }
  ];

  selectedRepository: any;
  uploadedFile: File | null = null;
  isDragging = false;

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File) {
    // Validar tipo de archivo
    const validTypes = ['application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

    if (!validTypes.includes(file.type)) {
      alert('Tipo de archivo no válido. Solo se permiten PDF y documentos de Office.');
      return;
    }

    // Validar tamaño (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Tamaño máximo: 10MB');
      return;
    }

    this.uploadedFile = file;
  }

  removeFile(event: Event) {
    event.stopPropagation();
    this.uploadedFile = null;
    this.fileInput.nativeElement.value = '';
  }


  formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  document: Document = {
    documentRepository:'',
    documentName: '',
    idProject: '',
    createDate: '',
    idUser: ''
  };

  createUser() {
    console.log('Usuario creado:', this.document);
    // lógica para enviar al backend
    if (this.uploadedFile) {
      const formData = new FormData();
      formData.append('file', this.uploadedFile);
      formData.append('repository', this.selectedRepository?.documentRepository || '');

      // Aquí iría la llamada a tu servicio para subir el archivo
      console.log('Datos a enviar:', {
        file: this.uploadedFile,
        repository: this.selectedRepository
      });
    }
  }

}
