import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Table, TableModule} from 'primeng/table';
import {Button, ButtonDirective} from 'primeng/button';
import {Toolbar} from 'primeng/toolbar';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {InputText} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {Ripple} from 'primeng/ripple';
import {RoleService} from '../../core/service/role.service';
import {Role} from '../../core/models/Role';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialog} from 'primeng/confirmdialog';


interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}


@Component({
  selector: 'app-roles',
  imports: [
    TableModule,
    ButtonDirective,
    Toolbar,
    InputText,
    FormsModule,
    NgIf,
    Ripple,
    IconField,
    InputIcon,
    Button,
    ToastModule,
    ConfirmDialog
  ],
  providers: [MessageService, ConfirmationService,RoleService],
  templateUrl: './roles.component.html',
  standalone: true,
  styleUrl: './roles.component.scss'
})
export default class RolesComponent implements OnInit{

  roles!: Role[];

  role!: Role;

  selectedRoles!: Role[] | null;

  clonedProducts: { [s: string]: Role } = {};

  statuses!: any[];

  @ViewChild('dt') dt!: Table | undefined;


  onGlobalFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dt?.filterGlobal(input.value, 'contains');
  }

  cols!: Column[];


  constructor(
    private rolesService: RoleService,
    private cd: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}


  ngOnInit() {
    this.loadDemoData();
  }

  loadDemoData() {
    this.rolesService.getRoles().then((data) => {
      this.roles = data;
      this.cd.markForCheck();
    });

    this.statuses = [
      { label: 'BO', value: 'BO' },
      { label: 'EC', value: 'EC' },
      { label: 'NG', value: 'NG' }
    ];

  }

  editProduct(role: Role) {
    this.role = { ...role };
  }

  onRowEditInit(role: Role) {
    this.clonedProducts[role.codSegmento as string] = { ...role };
  }
  onRowEditSave(role: Role) {
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Rol actuaizado correctamente',
        life: 3000
      });
  }
  onRowEditCancel(role: Role, index: number) {
    /*this.products[index] = this.clonedProducts[product.id as string];
    delete this.clonedProducts[product.id as string];*/
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar los roles seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',    // Texto personalizado para el botón Aceptar
      rejectLabel: 'Cancelar',        // Texto personalizado para el botón Rechazar
      acceptButtonStyleClass: 'p-button-danger p-button-sm', // Clases para el botón Aceptar
      rejectButtonStyleClass: 'p-button-secondary p-button-sm',   // Clases para el botón Cancelar
      accept: () => {
        this.roles = this.roles.filter((val) => !this.selectedRoles?.includes(val));
        this.selectedRoles = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Roles eliminados correctamente',
          life: 3000
        });
      }
    });
  }

}
