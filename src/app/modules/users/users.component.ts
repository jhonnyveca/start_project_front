import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Table, TableModule} from 'primeng/table';
import {FormsModule} from '@angular/forms';
import {Button, ButtonDirective} from 'primeng/button';
import {Toolbar} from 'primeng/toolbar';
import {UserService} from '../../core/service/user.service';
import {User} from '../../core/models/user';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {InputText} from 'primeng/inputtext';
import {RouterLink} from '@angular/router';


interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}
@Component({
  selector: 'app-users',
  imports: [
    TableModule,
    FormsModule,
    Toolbar,
    InputText,
    IconField,
    InputIcon,
    RouterLink,
    ButtonDirective
  ],
  templateUrl: './users.component.html',
  standalone: true,
  styleUrl: './users.component.scss'
})
export default class UsersComponent implements OnInit {

  users!: User[];

  user!: User;

  selectedUsers!: User[] | null;

  submitted: boolean = false;

  statuses!: any[];

  @ViewChild('dt') dt!: Table | undefined;

  onGlobalFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dt?.filterGlobal(input.value, 'contains');
  }

  cols!: Column[];

  exportColumns!: ExportColumn[];

  constructor(
    private userService: UserService,
    private cd: ChangeDetectorRef
  ) {}


  ngOnInit() {
    this.loadDemoData();
  }

  loadDemoData() {
    this.userService.getUsers().then((data) => {
      this.users = data;
      this.cd.markForCheck();
    });

    this.statuses = [
      { label: 'INSTOCK', value: 'instock' },
      { label: 'LOWSTOCK', value: 'lowstock' },
      { label: 'OUTOFSTOCK', value: 'outofstock' }
    ];

  }

  openNew() {
    this.user = {};
    this.submitted = false;
  }

  editProduct(user: User) {
    this.user = { ...user };
  }


  deleteProduct(user: User) {

  }

  // @ts-ignore
  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warn';
      case 'OUTOFSTOCK':
        return 'danger';
    }
  }

}
