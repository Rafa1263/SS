import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private user: User = {} as User
  // BOOLEANO PARA IDENTIFICAR LA CARGA DE USUARIOS
  private loaded = false
  // EN EL CONSTRUCTOR INICIALIZAMOS EL SERVICIO QUE CONTIENE LOS DATOS / FUNCIONES
  constructor(private readonly authservice: AuthService) { }

  // AL CREAR EL COMPONENTE NOS SUSCRIBIMOS AL OBSERVABLE QUE RETORNA LA FUNCION GETUSERS
  ngOnInit(): void {
    this.authservice.getUsers().subscribe(() => {
      // ESTO NOS ASEGURA QUE SE HAN CARGADO LOS USUARIOS
      this.loaded = true
    })

  }

  // FUNCIONES DE TRANSICIONES
  public signIn(): void {
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container')!;
    container.classList.remove("right-panel-active");
  }

  // FUNCIONES DE TRANSICIONES
  public signUp(): void {
    const signUpButton = document.getElementById('signUp');
    const container = document.getElementById('container')!;
    container.classList.add("right-panel-active");
  }

  // FUNCIONES DE LOGIN
  public Login(): void {

    // SI SE HAN CARGADO LOS USUARIOS...
    if (this.loaded = true) {
      let username = <HTMLInputElement>document.getElementById("username")
      let password = <HTMLInputElement>document.getElementById("password")

      // GENERAMOS UNA COOKIE PARA EL USUARIO
      let token = this.authservice.getCookie()
      if (username.value != "" && password.value != "") {

        // BUSCAMOS EL USUARIO
        const userIndex = this.authservice.usuarios.findIndex((us: User) => us.name === username.value && us.password === password.value);
        // EXTRAEMOS EL USUARIO
        this.user = this.authservice.usuarios[userIndex]

        // ASIGNAMOS EL TOKEN NUEVO GENERADO PREVIAMENTE (COOKIE), USAREMOS SANCTUM PARA ESTO Xd
        this.user.token = token

        // HACEMOS UN PUT AL USER PARA CAMBIAR EL TOKEN COSA Q NO HARA FALTA CON SANCTUM
        this.authservice.putUser(this.user, userIndex)

        // SETEAMOS LA COOKIE
        this.authservice.setCookie(token)

        // ACTULIZAMOS LOS CAMBIOS AL USER
        this.authservice.user.next(this.user)
      }
    }

  }
  public register(): void {

    let username = <HTMLInputElement>document.getElementById("usernameR")
    let password = <HTMLInputElement>document.getElementById("passwordR")

    // GENERAMOS UNA COOKIE PARA EL USUARIO
    let token = this.authservice.getCookie()

    if (username.value != "" && password.value != "") {

      //CREAMEOS EL USUARIO EMPLEANDO SU INTERFAZ
      const user = {
        name: username.value,
        password: password.value,
        photo: "default",
        token: token,
        id: 0,
      }

      if (!this.authservice.usuarios.find((us: User) => us.name === user.name)) {
        //SI NO ENCONTRAMOS UN USUARIO CON EL MISMO NOMBRE...
        const max = this.authservice.usuarios.reduce((maxIndex, user, currentIndex) => {
          // RETORNAMOS EL ID MÁS ALTO (ESTO CON UN AUTOINCREMENT EN LA DB NO HACE FALTA PERO YO ESTOY USANDO UNA COSA RARA Xd)
          return user.id > this.authservice.usuarios[maxIndex].id ? currentIndex : maxIndex;
        }, 0);

        // LE ASIGANMOS LA ID EXTRAÍDA SUMANDO UNO PARA ASIGNARLE UN ID UNICO
        user.id = this.authservice.usuarios[max].id + 1

        // SETEAMOS LA COOKIE
        this.authservice.setCookie(token)

        // POSTEAMOS EL USUARIO
        this.authservice.postUser(user).subscribe(() => {

          //AVISAMOS DE QUE SE HA CREADO EL USER
          console.log("User Created")
        })

      }
    }
  }
}
