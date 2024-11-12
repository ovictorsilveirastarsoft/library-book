import { User } from "src/user/entities/user.entity";

export const userEntityMock: User = {
    id_user: 1,
    name_user:"Victor",
    email_user:"victor@exemplo.com",
    password_user:"senha",
        async hashPassword(): Promise<void> {
        },
        libraries:[]

    
}

//name_user, email_user, password_user, hashPassword, libraries