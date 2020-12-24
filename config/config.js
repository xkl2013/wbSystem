import { routes } from './routes';
import { plugins } from './plugins';
import { webpack } from './webpack';


export default {
    treeShaking: true,
    hash:true,
    /**
     * build时用于非根目录
     */
    /**
     * webpack相关配置
     * **/
    ...webpack,
    /**
     * 插件相关配置
     */
    plugins,
    /**
     * 路由相关配置
     */
    routes,
    /*
    * 皮肤相关
    */
    targets:{
        ie:11
    }
}
