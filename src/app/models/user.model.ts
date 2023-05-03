// MODELO USUARIO, HAY QUE PONER LOS CAMPOS NECESARIOS

export interface User {
  name: string;
  password: string;
  photo?: string;
  token?: string;
  id: number;
}
