import { Component } from '@angular/core';
import { AuthService } from '../../Servicios/auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-menu-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './menu-layout.component.html',
  styleUrl: './menu-layout.component.css'
})
export class MenuLayoutComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
