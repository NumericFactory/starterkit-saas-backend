import Role from "#models/role";
import User from "#models/user";

import { DateTime } from "luxon"

export interface SafeUserModelType {
    id: number
    firstname: string | null
    lastname: string | null
    email: string
    phone: string | null
    createdAt: DateTime<boolean>
    updatedAt: DateTime<boolean> | null
    validatedAt: DateTime<boolean> | null
    roles: number[]
}

export class AuthService {
    constructor() { }

    /**
     * buildAuthLink()
     * @param type @param email @param token @param tokenId (optionnal)
     * @returns string
     * ex : return http://localhost:3333/api/v1/auth/{type}?token={token}&email={email}&tokenId={tokenId}
     */
    static buildAuthLink(type: 'validate-account' | 'reset-password', email: string, token: string, tokenId?: string | number | undefined): string {
        let url = `http://localhost:3333/api/v1/auth/${type}?token=${token}&email=${email}`;
        if (tokenId) url += `&tokenId=${tokenId}`; // for account validation link
        return url;
    }

    /**
     * getSafeUserData()
     * @param user: User
     * @returns user without password
     */
    static getSafeUserData(user: User): SafeUserModelType {
        return {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phone: user.phone,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            validatedAt: user.validatedAt,
            roles: user.roles.map((role: Role) => ({ id: role.id, title: role.title })) as any
        }
    }


}