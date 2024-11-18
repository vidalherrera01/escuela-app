import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonText, IonInput, IonDatetime, IonCol, IonGrid, IonRow, IonFooter, IonIcon } from '@ionic/angular/standalone';
import { DataUserService } from '../services/data-user.service';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from "../components/footer/footer.component";
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonRow, IonGrid, IonCol, IonInput, RouterModule, IonItem, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, FooterComponent]
})
export class RegisterPage implements OnInit {

  name_student: string = ""
  date_student: string = ""
  mother: string = ""
  father: string = ""
  tel: string = ""
  phone: string = ""
  profile: File | undefined;
  profilePhoto: string | undefined;
  signature: File | undefined;
  signaturePhoto: string | undefined;
  sl_name_student: string = ""


  async ft_photo_profile() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    this.profilePhoto = image.dataUrl
    const blob = await fetch(image.dataUrl!).then((res) => res.blob());
    this.profile = new File([blob], "profile.png", { type: blob.type });

  }

  async ft_photo_signature() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    this.signaturePhoto = image.dataUrl
    const blob = await fetch(image.dataUrl!).then((res) => res.blob());
    this.signature = new File([blob], "signature.jpg", { type: blob.type });

  }

  ft_register() {
    let urlRegister: string = `https://kabaygroup.com/api/school/parent/${this.dataUser.id_partner}/student`
    let birth_date = new Date(this.date_student).getTime().toString()

    const formData = new FormData();

    if (this.profile) {
      formData.append('profile', this.profile);
    }

    if (this.signature) {
      formData.append('signature', this.signature);
    }

    formData.append('name', this.name_student);
    formData.append('father_name', this.mother);
    formData.append('mother_name', this.father);
    formData.append('allergies_or_illness', "");
    formData.append('birth_date_timestamp', birth_date);

    console.log(formData, 'formdata')

    fetch(urlRegister, {
      method: 'POST',
      headers: {
        'Authorization': ` Bearer ${this.dataUser.token_user}`,
      },
      body: formData

    })
      .then(response => response.json())
      .then(res => {
        console.log(res.data.student)

        if (res.data.student !== null) {

          this.ft_father_info()
          this.ft_loadStudent()

          this.router.navigate(['/class']);
        }
      })
      .catch(error => console.error('Error:', error));
  }

  ft_father_info() {
    console.log(this.dataUser.id_partner)
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

        this.dataUser.arr_students = res.data.students

      })
      .catch(error => console.error('Error:', error));
  }


  ft_loadStudent() {
    let last = this.dataUser.arr_students.length - 1

    if (this.sl_name_student == '') {
      console.log(this.dataUser.arr_students[last])
      this.sl_name_student = this.dataUser.arr_students[last].name
      this.dataUser.id_students = this.dataUser.arr_students[last].id
    }

    for (const item of this.dataUser.arr_students) {
      if (item.name == this.sl_name_student) {
        this.sl_name_student = item.name
        this.dataUser.id_students = item.id
      }
    }
  }

  constructor(
    public dataUser: DataUserService,
    private router: Router
  ) { }

  ngOnInit() {
  }

}
