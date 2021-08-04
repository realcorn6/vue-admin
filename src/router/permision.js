import router from "./index";
import { getToken } from "../utils/app";

const whiteRouter = ["/login"]

// 路由守卫
router.beforeEach((to, from, next) =>{
    if (getToken()){
        next()
        console.log("存在")
    } else {
        console.log("不存在")
        if (whiteRouter.indexOf(to.path) !== -1) {
            next()
        } else {
            next("/login")
        }
    }
    console.log(to) // 进入的页面（下一个页面）
    console.log(next) // 离开之前的页面（上一个）
    next()
})
