import { reactive } from 'vue'
import { PublicClientApplication, type AuthenticationResult, } from "@azure/msal-browser";

const clientId = 'e00db9e5-c118-4384-87bf-34b478286a6b'
const authority = 'https://login.microsoftonline.com/common/'
const scopes = ["user.read"]
const postLogoutRedirectUri = 'http://localhost:5173'

export interface AuthState {
    loginResponse?: AuthenticationResult,
    msalInstance?: PublicClientApplication
}

export const authState: AuthState = reactive({
    msalConfig: undefined,
    msalInstance: undefined
})

const initialize = async () => {
    const msalConfig = {
        auth: {
            clientId: clientId
        }, 
        cache: {
            cacheLocation: "sessionStorage",
        }
    };
    authState.msalInstance = new PublicClientApplication(msalConfig);
    await authState.msalInstance.initialize();
    return authState.msalInstance;
}

export const login = async () => {
    authState.msalInstance = authState.msalInstance ?? await initialize()
    try {
        const redirectResponse = await authState.msalInstance.handleRedirectPromise()
        if (redirectResponse == null) {
            // In case multiple accounts exist, you can select
            const currentAccounts = authState.msalInstance?.getAllAccounts();
            if (currentAccounts && currentAccounts.length === 0) {
                const loginRequest = {
                    scopes: scopes,
                    authority: authority,
                    postLogoutRedirectUri: postLogoutRedirectUri
                };
                // no accounts signed-in, attempt to sign a user in
                authState.msalInstance?.loginRedirect(loginRequest);
            }
        }
    } catch (err) {
        // handle error
        console.error("loginRedirect:error", err)
    }
}

export async function logout() {
    authState.msalInstance = authState.msalInstance ?? await initialize()
    try {
        const redirectResponse = await authState.msalInstance.handleRedirectPromise()
        if (redirectResponse == null) {
            // In case multiple accounts exist, you can select
            const currentAccounts = authState.msalInstance?.getAllAccounts();
            if (currentAccounts && currentAccounts.length > 0) {
                // no accounts signed-in, attempt to sign a user in
                authState.msalInstance?.logoutRedirect({
                    account: currentAccounts[0],
                    postLogoutRedirectUri: postLogoutRedirectUri
                });
            }
        } else {
            authState.msalInstance?.logoutRedirect({
                account: redirectResponse.account,
                postLogoutRedirectUri: postLogoutRedirectUri
            });
        }
    } catch (err) {
        console.error("loginRedirect:error", err)
    }
}

export const check = async () => {
    authState.msalInstance = authState.msalInstance ?? await initialize()
    await authState.msalInstance.handleRedirectPromise()
    const currentAccounts = authState.msalInstance?.getAllAccounts();   
    return  (currentAccounts && currentAccounts.length > 0)
}