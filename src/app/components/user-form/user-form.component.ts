import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';
import { COUNTRY } from 'src/app/country';
import { Country } from 'src/app/interface/Country';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  providers: [],
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
      nif: ['', [Validators.required, this.nifValidator()]],
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

  // <--!-->//

  // a função recebe um argumento NIF que é aquilo que se prentende validar
  validateNIF(nif: string): boolean {
    // verificação se o primeiro ou os dois primeiros digitios são válidos
    if (
      !['1', '2', '3', '5', '6', '8'].includes(nif.substring(0, 1)) &&
      !['45', '70', '71', '72', '77', '79', '90', '91', '98', '99'].includes(
        nif.substring(0, 2)
      )
    ) {
      return false;
    }

    // o NIF a atribuir às pessoas singulares, sejam cidadãos nacionais ou estrangeiros, é um número composto por nove dígitos, sendo os oito primeiros sequenciais e o último um dígito de controlo.
    // a variável "total" verifica se os 8 primeiros digitos são válidos de acordo com a sequência definida
    // se algum destes digitos não corresponder com a sequência esperada, a soma de todos não corresponderá ao resultado esperado, resultando num NIF incorreto
    let total =
      +nif[0] * 9 +
      +nif[1] * 8 +
      +nif[2] * 7 +
      +nif[3] * 6 +
      +nif[4] * 5 +
      +nif[5] * 4 +
      +nif[6] * 3 +
      +nif[7] * 2;

    let module = total - Math.floor(total / 11) * 11;
    let compare = module === 1 || module === 0 ? 0 : 11 - module;

    return +nif[8] === compare;
  }

  nifValidator(): ValidatorFn {
    return (input) => {
      const nif = input.value;
      if (!nif) {
        return null;
      }

      if (!this.validateNIF(nif)) {
        return { nifInvalid: true };
      }

      return null;
    };
  }

  // <--!-->//

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
