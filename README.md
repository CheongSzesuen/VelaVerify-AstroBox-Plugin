# Vela快应用验证工具
用于通用的RSA非对称加密验证方案的AstroBox插件，你可以前往[Vela快应用验证方案](https://github.com/CheongSzesuen/VelaVerify)使用RSA加密模板对自己的应用进行加密。
参照 [官方文档](https://plugindoc.astrobox.online) 进行开发

## 本地编译使用此插件
```bash
pnpm i #下载依赖
pnpm run build #编译插件
pnpm run package #打包插件
```
此时项目根目录下会出现`VelaVerify.abp`的文件，将此文件导入AstroBox即可使用。
## 本项目适用设备
此项目受限于Vela JS接口的密码算法(crypto)、设备信息(device)、设备通信(interconnect)接口。
|设备型号|支持状态|备注|
|---|---|---|
|小米手环10|支持||
|小米手环9 Pro|支持||
|小米手环9|不支持|不支持设备ID查询|
|小米手环8 Pro|不支持|不支持设备ID查询和密码接口|
|小米手环8|不支持|系统不支持|
|小米手环7及更老机型|不支持|非Xiaomi Vela系统|
|小米Watch S4系列|支持||
|小米Watch S3系列|支持||
|小米Watch S2系列及更老机型|不支持|协议版本不支持|
|小米Watch S1 Pro|不支持|密码接口不支持|
|红米Watch5|支持||
|红米Watch4|不支持|密码接口不支持|
|红米手环系列/小米手环Active系列|不支持||
## 感谢
参考了下面的插件项目
- [简明天气同步器](https://github.com/zaona/simple-weather-astro-plugin) 项目
- [澄序课程表 - AstroBox 数据传输插件](https://gitee.com/waterflames-team/clartime-velaapp-astroplugin) 项目
## 许可证
本项目基于GNU General Public License v3.0许可证开源，你可以在遵守许可证的前提下自由使用、修改和分发本项目的代码。