import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonItem, IonButton, IonInput, IonText } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { DataUserService } from '../services/data-user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [RouterModule, IonText, IonInput, IonButton, IonItem, IonContent, IonTitle, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {

  ft_register() {
    this.bl_register = !this.bl_register
  }

  email: string = ""
  password: string = ""
  name_father: string = ""
  phone: string = ""
  bl_register: boolean = false;

  ft_login() {
    let urlLogin: string = "https://kabaygroup.com/api/authenticate"

    fetch(urlLogin, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          "params": {
            "login": this.email,
            "password": this.password
          }
        }
      )
    })
      .then(response => response.json())
      .then(data => {
        if (data.result !== null) {
          this.dataUser.token_user = data.result.token
          this.dataUser.id_partner = data.result.userInfo.partner_id
          console.log(this.dataUser.id_partner)
          this.ft_father_info()

        } else {
          alert("usuario o clave errornea")
        }

      })
      .catch(error => console.error('Error:', error));
  }

  n_name: string = "";
  n_email: string = "";
  n_password: string = "";
  n_phone: string = "";

  ft_signup() {
    let urlSignUp: string = "https://kabaygroup.com/api/signup"

    fetch(urlSignUp, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "params": {
          "login": this.n_email,
          "company_id": 9,
          "password": this.n_password,
          "name": this.n_name,
          "mobile": "8095996896",
          "phone": this.n_phone
        }
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.result !== null) {
          this.ft_login()
        } else {
          alert("Este usuario esta en uso, favor cambiarlo")
        }
      })
      .catch(error => console.error('Error:', error));
  }

  ft_father_info() {
    let urlFather_info: string = ` https://kabaygroup.com/api/school/parent/${this.dataUser.id_partner}/info`

    fetch(urlFather_info, {
      method: 'GET',
      headers: {
        'Authorization': ` Bearer ${this.dataUser.token_user}`,
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(res => {
        console.log(res.data)
        this.dataUser.arr_students = res.data.students
        this.dataUser.sl_students = ""

        if (this.dataUser.arr_students.length < 1) {
          this.router.navigate(['/incribite']);
        } else {
          this.router.navigate(['/class']);
        }
      })
      .catch(error => console.error('Error:', error));
  }

  constructor(
    private dataUser: DataUserService,
    private router: Router
  ) { }

  ngOnInit() {
    // this.email = "papa1"
    // this.password = "123"
    // this.ft_login()
  }


}
