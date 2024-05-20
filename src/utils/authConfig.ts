import { b2cPolicies } from "./policies";
import { apiConfig } from "./apiConfig";
import * as msal from "@azure/msal-browser";

export const msalConfig = {
    auth: {
        clientId: "68982152-ee23-4571-9c92-f3e1645b56a4", // This is the ONLY mandatory field; everything else is optional.
        authority: b2cPolicies.authorities.signUpSignIn.authority, // Choose sign-up/sign-in user-flow as your default.
        knownAuthorities: [b2cPolicies.authorityDomain], // You must identify your tenant's domain as a known authority.
        redirectUri: "http://localhost:5173/oauth2-redirect", // You must register this URI on Azure Portal/App Registration. Defaults to "window.location.href".
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    },
    // system: {
    //     loggerOptions: {
    //         loggerCallback: (level: msal.LogLevel, message: any, containsPii: any) => {
    //             if (containsPii) {
    //                 return;
    //             }
    //             switch (level) {
    //                 case msal.LogLevel.Error:
    //                     console.error(message);
    //                     return;
    //                 case msal.LogLevel.Info:
    //                     console.info(message);
    //                     return;
    //                 case msal.LogLevel.Verbose:
    //                     console.debug(message);
    //                     return;
    //                 case msal.LogLevel.Warning:
    //                     console.warn(message);
    //                     return;
    //             }
    //         }
    //     }
    // }
};


export const loginRequest = {
    scopes: ["openid", ...apiConfig.b2cScopes],
};

export const tokenRequest:msal.SilentRequest = {
    scopes: [...apiConfig.b2cScopes],  // e.g. ["https://fabrikamb2c.onmicrosoft.com/helloapi/demo.read"]
    forceRefresh: false, // Set this to "true" to skip a cached token and go to the server to get a new token
};