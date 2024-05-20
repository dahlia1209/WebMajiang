
export const b2cPolicies = {
    names: {
        signUpSignIn: "B2C_1_sign_up_sign_in",
        forgotPassword: "B2C_1_reset",
        editProfile: "B2C_1_edit_profile"
    },
    authorities: {
        signUpSignIn: {
            authority: "https://webmajiang.b2clogin.com/webmajiang.onmicrosoft.com/B2C_1_sign_up_sign_in",
        },
        forgotPassword: {
            authority: "https://webmajiang.b2clogin.com/webmajiang.onmicrosoft.com/b2c_1_reset",
        },
        editProfile: {
            authority: "https://webmajiang.b2clogin.com/webmajiang.onmicrosoft.com/b2c_1_edit_profile",
        }
    },
    authorityDomain: "webmajiang.b2clogin.com"
}