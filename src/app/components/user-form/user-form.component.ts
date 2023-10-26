import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  AbstractControl,
} from '@angular/forms';
import { COUNTRY } from 'src/app/country';
import { Country } from 'src/app/interface/Country';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent {
  userForm!: FormGroup;

  countries: Country[] = COUNTRY;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    const address = this.fb.group({
      street: ['', [Validators.required]],
      doorNumber: ['', [Validators.required]],
      zipCode: [''],
    });

    this.userForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/),
        ],
      ],
      nif: ['', [Validators.required]],
      birthday: ['', [Validators.required, this.validateMinimumAge(18)]],
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
      address: address,
      phone: ['', [Validators.required, Validators.pattern(/^[239]\d{8}$/)]],
      gender: ['', [Validators.required]],
    });

    this.country?.valueChanges.subscribe(() => {
      this.city?.setValue('');
      this.validateZipCode();
    });
  }

  validateMinimumAge(minimumAge: number) {
    return (input: any) => {
      const birthdate = new Date(input.value);
      const today = new Date();

      let age = today.getFullYear() - birthdate.getFullYear();
      const birthYear = new Date(
        today.getFullYear(),
        birthdate.getMonth(),
        birthdate.getDate()
      );

      if (birthYear > today) {
        age--;
      }

      return age >= minimumAge ? null : { minimumAge: true };
    };
  }

  validateZipCode() {
    const addressGroup = this.userForm.get('address') as FormGroup;
    const zip = addressGroup.get('zipCode');
    const country = this.country?.value;

    if (country === 'Portugal') {
      zip?.setValidators([
        Validators.required,
        Validators.pattern('[1-9][0-9]{3}-[0-9]{3}'),
      ]);
    } else {
      zip?.setValidators(Validators.required);
    }

    zip?.updateValueAndValidity();
  }

  getCitiesByCountry(countryName: string): any[] {
    const selectedCountry = this.countries.find(
      (country) => country.name === countryName
    );
    if (selectedCountry) {
      return selectedCountry.city;
    } else {
      return [];
    }
  }

  get fullName() {
    return this.userForm.get('fullName');
  }

  get email() {
    return this.userForm.get('email');
  }

  get nif() {
    return this.userForm.get('nif');
  }

  get birthday() {
    return this.userForm.get('birthday');
  }

  get country() {
    return this.userForm.get('country');
  }

  get city() {
    return this.userForm.get('city');
  }

  get address() {
    return this.userForm.get('address');
  }

  get street() {
    return this.userForm.get('street');
  }

  get doorNumber() {
    return this.userForm.get('doorNumber');
  }

  get zipCode() {
    return this.userForm.get('zipCode');
  }

  get phone() {
    return this.userForm.get('phone');
  }

  get gender() {
    return this.userForm.get('gender');
  }

  onSubmit() {
    console.log(this.userForm.value);
  }
}
