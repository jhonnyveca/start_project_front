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
interface Rule {
  cod_jerarquia_pais:string;
  cod_oficina_venta:string;
  cod_plataforma:string;
  cod_segmento:string;
  cod_sociedad:string;
  cod_subnegocio:string;
}

interface BusinessRole {
  "status": number,
  "createDate": string,
  "lastUpdateDate": string,
  "lastUpdateUser": string,
  "createUser": string,
  "idProject": number,
  "idBusinessDomainRol": number,
  "businessDomainRol": string,
  "idBusinessDomainArea": number,
  "businessDomainArea": string,
  "idBusinessDomain": number,
  "businessDomain": string,
  rules: Rule[]
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

  businessRolesItems: any[] = [];
  allItemsWithRules: any[] = [];
  allRules: any[] = [];

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
    this.loadBussinessRolesData();
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
  loadBussinessRolesData(){
    this.rolesService.getBussinessRoles("2","1","100").subscribe({
      next: data => {
        const businessRolesItems: BusinessRole[] = data.items;

        const allItemsWithRules = data.items.map((item: BusinessRole) => ({
          status: item.status,
          createDate: item.createDate,
          lastUpdateDate: item.lastUpdateDate,
          lastUpdateUser: item.lastUpdateUser,
          createUser: item.createUser,
          idProject: item.idProject,
          idBusinessDomainRol: item.idBusinessDomainRol,
          businessDomainRol: item.businessDomainRol,
          idBusinessDomainArea: item.idBusinessDomainArea,
          businessDomainArea: item.businessDomainArea,
          idBusinessDomain: item.idBusinessDomain,
          businessDomain: item.businessDomain,
          rules: item.rules,
        }));

        const allRules: Rule[] = data.items.flatMap((item: BusinessRole) => item.rules);
        console.log(businessRolesItems)
        console.log(allItemsWithRules);
        console.log(allRules);

      },
      error: err => {
        console.log(err);
      }
    })
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
