import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated: boolean = false;

  login(username: string, password: string): boolean {
    // Aquí puedes implementar la lógica de autenticación, como una llamada a un API
    // Si la autenticación es exitosa, almacena el estado
    if (username === 'user' && password === '123') { // Ejemplo
      this.isAuthenticated = true;
      return true;
    }
    return false;
  }

  logout() {
    this.isAuthenticated = false;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
}
