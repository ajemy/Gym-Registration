import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { User } from '../models/register.model';
import { ApiService } from '../services/api.service';
import { NgConfirmService } from 'ng-confirm-box';
import { TooltipVisibility } from '@angular/material/tooltip';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-registration-list',
  templateUrl: './registration-list.component.html',
  styleUrls: ['./registration-list.component.scss'],
})
export class RegistrationListComponent implements OnInit {
  public dataSource!: MatTableDataSource<User>;
  public users!: User[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'email',
    'mobile',
    'bmiResult',
    'gender',
    'package',
    'enquiryDate',
    'action',
  ];
  constructor(
    private api: ApiService,
    private router: Router,
    private confirm: NgConfirmService,
    private tost: NgToastService
  ) {}
  ngOnInit(): void {
    this.getUsers();
  }
  getUsers() {
    this.api.getRegisterUser().subscribe((res) => {
      this.users = res;
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  edit(id: number) {
    this.router.navigate(['/update', id]);
  }
  delete(id: number) {
    this.confirm.showConfirm(
      'Are You Sure To Delete?',
      () => {
        this.api.deleteRegister(id).subscribe((res) => {
          this.getUsers();
          this.tost.success({
            detail: 'Success',
            summary: 'enquiry Deleted',
            duration: 3000,
          });
        });
      },
      () => {}
    );
  }
}
