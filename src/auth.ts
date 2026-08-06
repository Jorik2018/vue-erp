import { UserManager } from "oidc-client-ts";

export const manager = new UserManager({
    authority: "https://dbasure.com",
    client_id: "mkgHwdTTEpdkivkjPoDbObxCpIjaMnfe",

    redirect_uri: "http://localhost:5173/auth/callback",

    response_type: "code",

    scope: "openid profile email",

    metadata: {
        authorization_endpoint:
            "https://dbasure.com/wp-json/moserver/authorize",

        token_endpoint:
            "https://dbasure.com/wp-json/moserver/token"
    }
});