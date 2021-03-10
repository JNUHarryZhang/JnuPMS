### 前端项目
### python脚本生成词云图待上传，因此首页暂时缺少词云图
### 前端需要安装 nodejs 环境
### 后端需要安装 redis
### 目前数据库已经安装在腾讯云上

```bash
# 克隆项目

# 进入项目目录

# 安装依赖
npm install》

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 http://localhost:80

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```
