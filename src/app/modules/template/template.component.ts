import {ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {Button, ButtonDirective} from 'primeng/button';
import {Toolbar} from 'primeng/toolbar';
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {InputText} from "primeng/inputtext";
import {Table, TableModule} from "primeng/table";

import {Template} from '../../core/models/template';
import {TemplateService} from '../../core/service/template.service';


interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

@Component({
  selector: 'app-template',
  imports: [
    Button,
    Toolbar,
    IconField,
    InputIcon,
    InputText,
    TableModule,
    ButtonDirective
  ],
  templateUrl: './template.component.html',
  standalone: true,
  styleUrl: './template.component.scss'
})
export default class TemplateComponent implements OnInit {



  templates !: Template[];

  template !: Template ;

  statuses!: any[];

  @ViewChild('dt') dt!: Table;

  cols!: Column[];


  constructor(
    private templateService : TemplateService ,
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
    this.templateService .getDocuments().then((data) => {
      this.templates  = data;
      this.cd.markForCheck();
    });

  }

  editProduct(template : Template ) {
    this.template  = { ...template  };
  }


  deleteProduct(template : Template ) {

  }



}
