import { Component, OnInit } from "@angular/core";
import { UsersService } from "../services/users.service";

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    standalone: true
})
export class UserComponent implements OnInit {
    constructor(
        private userService: UsersService,
    ) {}

    ngOnInit(): void {
        this.userService.getUsers()
        .pipe()
        .subscribe(users => console.log('---- users', users));
    }
}