import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public selectedUser: string = '';

  constructor(private router: Router) {}

  login() {
    if (this.selectedUser) {
      this.router.navigate(['/chat'], { queryParams: { username: this.selectedUser } });
    }
  }
}
