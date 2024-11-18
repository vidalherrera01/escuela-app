import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonSelect, IonSelectOption, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonText, IonAvatar, IonModal, IonTitle, IonButtons, IonItem } from '@ionic/angular/standalone';
import { DataUserService } from '../services/data-user.service';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from "../components/footer/footer.component";

@Component({
  selector: 'app-class',
  templateUrl: './class.page.html',
  styleUrls: ['./class.page.scss'],
  standalone: true,
  imports: [IonItem, IonButtons, IonTitle, IonModal, IonAvatar, IonText, IonCol, IonRow, IonGrid, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonButton, RouterModule, IonContent, IonSelect, IonSelectOption, IonHeader, IonToolbar, CommonModule, FormsModule, FooterComponent]
})
export class ClassPage implements OnInit {


  ft_get_courses_item(item: any) {
    console.log(item, "soy item")

    this.dataUser.arr_student_courses = item
  }

  isModalOpen: boolean = false;

  ft_goProducts(id: any) {
    this.dataUser.id_coursers = id;
    this.router.navigate(['/product']);
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  ft_loadStudent() {
    console.clear()
    let last = this.dataUser.arr_students.length - 1

    for (const item of this.dataUser.arr_students) {
      if (item.name == this.dataUser.sl_students) {
        console.log(item.invoices)
        this.dataUser.sl_students = item.name
        this.dataUser.id_students = item.id
        this.dataUser.avatar_image = item.image
        // this.dataUser.arr_student_courses = item.arr_student_courses
        // console.log(this.dataUser.arr_student_courses)

        // console.log(item, "soy arrEstudiante")
      }
    }

    if (this.dataUser.sl_students == '') {
      console.log(this.dataUser.arr_students[last].invoices)
      this.dataUser.sl_students = this.dataUser.arr_students[last].name
      this.dataUser.id_students = this.dataUser.arr_students[last].id
      this.dataUser.avatar_image = this.dataUser.arr_students[last].image
      // this.dataUser.arr_student_courses = this.dataUser.arr_students[last].arr_student_courses
      // console.log(this.dataUser.arr_students[last], 'soy arr Estudent')
    }

    this.ft_get_courses()
  }

  ft_get_courses() {
    const urlCourses: string = `https://kabaygroup.com/api/school/student/${this.dataUser.id_students}/courses`

    fetch(urlCourses, {
      method: 'GET',
      headers: {
        'Authorization': ` Bearer ${this.dataUser.token_user}`,
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(res => {
        // console.log(res.data)
        console.log(res.data.courses)
        this.dataUser.arr_courses = res.data.courses
      })
      .catch(error => console.error('Error:', error));
  }

  ft_addCourse(idCourse: number) {

    this.dataUser.id_coursers = idCourse
    console.log(idCourse)
    console.log(this.dataUser.arr_courses)

    const urlCourseID = `https://kabaygroup.com/api/school/course/${idCourse}/subscribe`

    // for (const item of this.dataUser.arr_courses) {
    //   if (item.id == idCourse) {
    //     console.log("si son igusles")

    //     this.ft_verify_id(idCourse)
    //   }
    // }

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
        console.log(res)
        this.dataUser.arr_students = res.data.students
        console.log(this.dataUser.arr_students)
      })
      .catch(error => console.error('Error:', error));
  }

  constructor(
    public dataUser: DataUserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.ft_loadStudent()
  }

}
