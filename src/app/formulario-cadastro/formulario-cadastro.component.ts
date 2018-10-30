import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl, ValidatorFn } from '../../../node_modules/@angular/forms';
import { DadosService } from '../services/dados.service';
import { StorageService } from '../services/storage.service';
import { TokenDTO } from '../model/token.dto';
import { Router } from '../../../node_modules/@angular/router';

@Component({
  selector: 'app-formulario-cadastro',
  templateUrl: './formulario-cadastro.component.html',
  styleUrls: ['./formulario-cadastro.component.css']
})
export class FormularioCadastroComponent implements OnInit {
  
  form : FormGroup;

  isShowMessage : boolean;
  message: string;
  messageType: string;
  
  private formSubmitAttempt: boolean;
  constructor( 
    private fb: FormBuilder,
    private dadosService: DadosService,
    private storageService: StorageService,
    private router: Router
  ) { }
  
  ngOnInit() {
    this.formSubmitAttempt = false;
    this.iniciaForm();
  }
  
  iniciaForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$')]],
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required],
      fullName: ['', Validators.required],
      birthDate: ['', Validators.required],
      zipCode: ['', Validators.required],
      streetName:  ['', Validators.required],
      number:  ['', Validators.required],
      complement: [''],
      neighbourhood:  ['', Validators.required],
      country: ['', Validators.required],
      state:  ['', Validators.required],
      city: ['', Validators.required],
    }, {validator: this.checkPasswords });
  }

  save() {
    this.formSubmitAttempt = true;
    if (!this.form.valid) {
      return;
    }
      
    let formValueSend = {...this.form.value};
    delete formValueSend.passwordConfirmation;
    
    this.dadosService.sendData(formValueSend)
    .subscribe(response => {
      let token: TokenDTO = JSON.parse(response.body);
      this.storageService.setLocalToken(token);
      this.showMessage('O cadastro foi feito com sucesso.', 'success');
      this.reset();
      this.router.navigate(['/dashboard']);
    }, error => {
      if (error.status == 400) {
        this.showMessage(error.message, 'danger');
        return;
      }
      if (error.status == 409) {
        this.showMessage('O email informado já existe.', 'danger');
        return;
      }
      this.showMessage('Houve um erro de comunicação, tente novamente mais tarde.', 'danger');
    });
  }

  showMessage(mensagem, messageType) {
    this.isShowMessage = true;
    this.message = mensagem;
    this.messageType = messageType;
    setTimeout(() => {this.hideMessage();}, 4000);
  }

  hideMessage() {
    this.isShowMessage = false;
    this.message = '';
    this.messageType = '';
  }

  reset() {
    this.form.reset();
    this.formSubmitAttempt = false;
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  isPasswordEquals() {
    return this.form.get('password').value == this.form.get('passwordConfirmation').value;
  }

  checkPasswords(group: FormGroup) {
    let pass = group.controls.password.value;
    let confirmPass = group.controls.passwordConfirmation.value;

    return pass === confirmPass ? null : { notSame: true }     
  }
  
}
