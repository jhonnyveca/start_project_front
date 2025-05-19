import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {Toolbar} from 'primeng/toolbar';
import {Table, TableModule} from 'primeng/table';
import {Button, ButtonDirective} from 'primeng/button';
import {Document} from '../../../domain/document';

import {DocumentService} from '../../../service/document.service';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {InputText} from 'primeng/inputtext';


interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}
@Component({
  selector: 'app-documents',
    imports: [
        Toolbar,
        TableModule,
        Button,
        DropdownModule,
        FormsModule,
        IconField,
        InputIcon,
        InputText,
        ButtonDirective
    ],
  templateUrl: './documents.component.html',
  standalone: true,
  styleUrl: './documents.component.scss'
})
export default class DocumentsComponent {

  documents!: Document[];

  document!: Document;

  selectedDocuments!: Document[] | null;

  submitted: boolean = false;

  statuses!: any[];

  @ViewChild('dt') dt!: Table;

  cols!: Column[];


  constructor(
    private documentService: DocumentService,
    private cd: ChangeDetectorRef
  ) {}


  ngOnInit() {
    this.loadDemoData();
  }

  onGlobalFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dt?.filterGlobal(input.value, 'contains');
  }

  loadDemoData() {
    this.documentService.getDocuments().then((data) => {
      this.documents = data;
      this.cd.markForCheck();
    });

    this.statuses = [
      { label: 'INSTOCK', value: 'instock' },
      { label: 'LOWSTOCK', value: 'lowstock' },
      { label: 'OUTOFSTOCK', value: 'outofstock' }
    ];

  }

  openNew() {
    this.document = {};
    this.submitted = false;
  }

  editProduct(document: Document) {
    this.document = { ...document };
  }


  deleteProduct(document: Document) {

  }

  apps = [
    { label: 'Fininsight', value: 'admin' },
    { label: 'Alivoice', value: 'editor' }
  ];

}
