import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../models/register.model';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  user!: User;
  constructor(private api: ApiService, private activateRout: ActivatedRoute) {
    this.getUserDetail();
  }
  ngOnInit(): void {}
  getUserDetail() {
    this.activateRout.params.subscribe((val) => {
      this.api.getRegisterUserId(val['id']).subscribe((res) => {
        this.user = res;
      });
      // this.api.getRegisterUserId(val['id'])
    });
  }
}
