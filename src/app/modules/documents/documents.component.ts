import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Toolbar} from 'primeng/toolbar';
import {Table, TableModule} from 'primeng/table';
import {Button, ButtonDirective} from 'primeng/button';
import {Document} from '../../core/models/document';

import {DocumentService} from '../../core/service/document.service';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {InputText} from 'primeng/inputtext';
import {RouterLink} from '@angular/router';
import {TreeTableModule} from 'primeng/treetable';
import {NgForOf, NgIf} from '@angular/common';
import {TreeNode} from 'primeng/api';
import {RepositoriesService} from '../../core/service/repositories.service';


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
    DropdownModule,
    FormsModule,
    ButtonDirective,
    RouterLink,
    TreeTableModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './documents.component.html',
  standalone: true,
  styleUrl: './documents.component.scss'
})
export default class DocumentsComponent implements OnInit{

  documents!: Document[];

  statuses!: any[];

  @ViewChild('dt') dt!: Table;

  cols!: Column[];

  files!: TreeNode[];

  selectionKeys = {};

  constructor(
    private documentService: DocumentService,
    private cd: ChangeDetectorRef,
    private repositoriesService: RepositoriesService
  ) {}


  ngOnInit() {
    this.loadDemoData();
    this.repositoriesService.getTreeTableNodes().then((files) => (this.files = files));
    this.cols = [
      { field: 'name', header: 'Repositorio' },
      { field: 'size', header: 'Size' },
      { field: 'type', header: 'Tipo' }
    ];

    this.selectionKeys = {
      '0': {
        partialChecked: true
      },
      '0-0': {
        partialChecked: false,
        checked: true
      },
      '0-0-0': {
        checked: true
      },
      '0-0-1': {
        checked: true
      },
      '0-0-2': {
        checked: true
      }
    };
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


}
