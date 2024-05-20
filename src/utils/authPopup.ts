// Create the main myMSALObj instance
// configuration parameters are located at authConfig.js
import { reactive } from 'vue'
import * as msal from "@azure/msal-browser";
import { msalConfig, loginRequest, tokenRequest } from "./authConfig";
import { b2cPolicies } from "./policies";
import { callApi } from "./api";
import { apiConfig } from "./apiConfig";

const myMSALObj = new msal.PublicClientApplication(msalConfig)
await myMSALObj.initialize()

export const authState = reactive({
    myMSALObj: myMSALObj,
    accountFilter: {
        homeAccountId: "",
    },
    username: ""
})

function setAccount(account: msal.AccountInfo) {
    authState.accountFilter.homeAccountId = account.homeAccountId;
    authState.username = account.username;
}

function selectAccount() {
    /**
     * See here for more info on account retrieval: 
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */

    const currentAccounts = authState.myMSALObj.getAllAccounts();

    if (currentAccounts.length < 1) {
        return;
    } else if (currentAccounts.length > 1) {

        /**
         * Due to the way MSAL caches account objects, the auth response from initiating a user-flow
         * is cached as a new account, which results in more than one account in the cache. Here we make
         * sure we are selecting the account with homeAccountId that contains the sign-up/sign-in user-flow, 
         * as this is the default flow the user initially signed-in with.
         */
        const accounts = currentAccounts.filter(account =>
            account.homeAccountId.toUpperCase().includes(b2cPolicies.names.signUpSignIn.toUpperCase())
            &&
            account.idTokenClaims
            &&
            account.idTokenClaims.iss
            &&
            account.idTokenClaims.iss.toUpperCase().includes(b2cPolicies.authorityDomain.toUpperCase())
            &&
            account.idTokenClaims.aud === msalConfig.auth.clientId
        );

        if (accounts.length > 1) {
            // localAccountId identifies the entity for which the token asserts information.
            if (accounts.every(account => account.localAccountId === accounts[0].localAccountId)) {
                // All accounts belong to the same user
                setAccount(accounts[0]);
            } else {
                // Multiple users detected. Logout all to be safe.
                signOut();
            };
        } else if (accounts.length === 1) {
            setAccount(accounts[0]);
        }

    } else if (currentAccounts.length === 1) {
        setAccount(currentAccounts[0]);
    }
}

// in case of page refresh
selectAccount();

function handleResponse(response: msal.AuthenticationResult) {
    /**
     * To see the full list of response object properties, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#response
     */

    if (response !== null) {
        console.log("response", response)
        setAccount(response.account);
        return response;
    } else {
        selectAccount();
    }
}

export async function signIn() {
    /**
     * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
     */

    authState.myMSALObj.loginPopup(loginRequest)
        .then(handleResponse)
        .catch(error => {
            console.log(error);
        });
}

export function signOut() {

    /**
     * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
     */

    const logoutRequest = {
        postLogoutRedirectUri: msalConfig.auth.redirectUri,
        mainWindowRedirectUri: "http://localhost:5173/netplay"
    };

    authState.myMSALObj.logoutPopup(logoutRequest);
}

export async function getTokenPopup(request: msal.SilentRequest) {

    /**
    * See here for more information on account retrieval: 
    * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
    */
    request.account = authState.myMSALObj.getAccount(authState.accountFilter) ?? undefined;

    /**
     * 
     */
    return authState.myMSALObj.acquireTokenSilent(request)
        .then((response) => {
            // In case the response from B2C server has an empty accessToken field
            // throw an error to initiate token acquisition
            if (!response.accessToken || response.accessToken === "") {
                throw new msal.InteractionRequiredAuthError;
            }
            return response;
        })
        .catch(error => {
            console.log("Silent token acquisition fails. Acquiring token using popup. \n", error);
            if (error instanceof msal.InteractionRequiredAuthError) {
                // fallback to interaction when silent call fails
                return authState.myMSALObj.acquireTokenPopup(request)
                    .then(response => {
                        console.log(response);
                        return response;
                    }).catch(error => {
                        console.log(error);
                        throw new msal.InteractionRequiredAuthError;
                    });
            } else {
                return authState.myMSALObj.loginPopup(loginRequest)
                    .then(response => {
                        console.log(response);
                        return response;
                    }).catch(e => {
                        return undefined;
                    })
            }
        })
}

export async function passTokenToApi() {
    // getTokenPopup(tokenRequest)
    //     .then(response => {
    //         if (response) {
    //             console.log("access_token acquired at: " + new Date().toString());
    //             try {
    //                 callApi(apiConfig.webApi, response.accessToken);
    //             } catch (error) {
    //                 console.log(error);
    //             }
    //         }
    //     });
    const response = await getTokenPopup(tokenRequest);
    if (response) {
        console.log("access_token acquired at: " + new Date().toString());
        try {
            callApi(apiConfig.webApi, response.accessToken);
        } catch (error) {
            console.log(error);
        }
    }
}

export async function getToken() {
    const response = await getTokenPopup(tokenRequest);
    const token = response != undefined ? response.accessToken : undefined;
    return token;
}

/**
 * To initiate a B2C user-flow, simply make a login request using
 * the full authority string of that user-flow e.g.
 * https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/B2C_1_edit_profile_v2 
 */
export function editProfile() {

    const account = authState.myMSALObj.getAccount(authState.accountFilter);
    if (!account) return;
    const editProfileRequest = {
        authority: b2cPolicies.authorities.editProfile.authority,
        scopes: loginRequest.scopes,
        loginHint: account.username
    }

    authState.myMSALObj.loginPopup(editProfileRequest)
        .catch(error => {
            console.log(error);
        });
}