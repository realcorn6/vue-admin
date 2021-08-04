import cookie from "js-cookie";

export function getToken() {
    return cookie.get("admin_token")
}

export function setToken(token) {
    cookie.set("admin_token", token)
}

export function setUsername(username) {
    cookie.set("admin_username", username)
}
