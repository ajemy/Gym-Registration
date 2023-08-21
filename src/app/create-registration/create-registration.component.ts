import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { bufferTime } from 'rxjs';
import { User } from '../models/register.model';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss'],
})
export class CreateRegistrationComponent implements OnInit {
  public packages = ['monthle', 'quarterly', 'yearly'];
  public genders = ['male', 'female'];
  public userUpdateId!: number;
  public isUpdate: boolean = false;
  invalid: boolean = false;
  importantList: string[] = [
    'Toxic Fat reduction',
    'Energy and Endurance',
    'Building Lean Muscle',
    'Healthier Digestive System',
    'Sugar Craving Body',
    'Fitness',
  ];
  public registrationForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    public activatedRoute: ActivatedRoute,
    private toastService: NgToastService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl('', [
        Validators.pattern('[A-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$'),
      ]),
      mobile: new FormControl('', [Validators.pattern('[0-9]{10}')]),
      weight: new FormControl('', [Validators.required]),
      height: new FormControl('', [Validators.required]),
      bmi: [''],
      bmiResult: [''],
      gender: new FormControl('', [Validators.required]),
      requireTrainer: new FormControl('', [Validators.required]),
      package: new FormControl('', [Validators.required]),
      important: new FormControl('', [Validators.required]),
      haveGymBefore: new FormControl('', [Validators.required]),
      enquiryDate: new FormControl('', [Validators.required]),
    });
    this.registrationForm.controls['height'].valueChanges.subscribe((res) => {
      this.calcBmi(res);
    });

    this.activatedRoute.params.subscribe((val) => {
      this.userUpdateId = val['id'];
      if (typeof this.userUpdateId == 'string') {
        this.api.getRegisterUserId(this.userUpdateId).subscribe((res) => {
          this.fillRegister(res);
          this.isUpdate = true;
        });
      }
    });
  }
  submit() {
    if (this.registrationForm.status == 'VALID') {
      this.api
        .postRegistration(this.registrationForm.value)
        .subscribe((res) => {
          this.toastService.success({
            detail: 'Success',
            summary: 'enquiry Added',
            duration: 3000,
          });
          this.registrationForm.reset();
        });
    } else {
      this.invalid = true;
      this.toastService.error({
        detail: 'Error',
        summary: 'Please Fill All Fields',
        duration: 3000,
      });
    }
  }
  calcBmi(heightValue: number) {
    const weight = this.registrationForm.value.weight; // weight in kilograms
    const height = heightValue; // height in meters
    const bmi = weight / (height * height);
    this.registrationForm.controls['bmi'].patchValue(bmi);
    switch (true) {
      case bmi < 18.5:
        this.registrationForm.controls['bmiResult'].patchValue('Underweight');
        break;
      case bmi >= 18.5 && bmi < 25:
        this.registrationForm.controls['bmiResult'].patchValue('Normal');
        break;
      case bmi >= 25 && bmi < 30:
        this.registrationForm.controls['bmiResult'].patchValue('Overweight');
        break;
      default:
        this.registrationForm.controls['bmiResult'].patchValue('Obese');
        break;
    }
  }
  fillRegister(user: User) {
    this.registrationForm.setValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      weight: user.weight,
      height: user.height,
      bmi: user.bmi,
      bmiResult: user.bmiResult,
      gender: user.gender,
      requireTrainer: user.requireTrainer,
      package: user.package,
      important: user.important,
      haveGymBefore: user.haveGymBefore,
      enquiryDate: user.enquiryDate,
    });
  }
  update(user: User) {
    if (this.registrationForm.status == 'VALID') {
      const id = this.userUpdateId;
      this.api.updateRegisterUser(user, id).subscribe(() => {
        this.toastService.success({
          detail: 'Success',
          summary: 'enquiry Updated',
          duration: 3000,
        });
        this.router.navigate(['list']);
      });
    } else {
      this.invalid = true;
      this.toastService.error({
        detail: 'Error',
        summary: 'Please Fill All Fields',
        duration: 3000,
      });
    }
  }
}
