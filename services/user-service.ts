import webUtils from "./web-utils";

export interface UserMetadata {
    company: string;
    jobTitle: string;
    theme: string;
}

class UserService {

    async loadUserMetadata(accessToken: string, userSub: string): Promise<UserMetadata> {
        const domain = "amwebexpert.us.auth0.com";
        const url = `https://${domain}/api/v2/users/${userSub}`;
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };

        console.log(`Calling API ${url}`);
        return new Promise(function (resolve, reject) {
            fetch(url, { headers })
                .then(webUtils.httpGetResponseHandler)
                .then(data => resolve(data))
                .catch(e => webUtils.logAndReject(e, reject));
        });
    }

}

// Singleton pattern
export const userService = new UserService();
