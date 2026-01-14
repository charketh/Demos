# 喝水打卡 Android APK 打包指南

## 方法一：使用 PWABuilder（推荐，最简单）

### 步骤：

1. **访问 PWABuilder**
   - 打开 https://www.pwabuilder.com/

2. **输入应用 URL**
   - 将你的应用部署到服务器（如 GitHub Pages, Netlify, Vercel 等）
   - 在 PWABuilder 输入你的应用 URL

3. **生成 Android 包**
   - 点击 "Build My PWA"
   - 选择 "Android" 平台
   - 选择 "Trusted Web Activity (TWA)" 方式
   - 填写应用信息：
     - Package ID: `com.watertracker.twa`
     - App name: `喝水打卡`
     - Launcher name: `喝水打卡`
     - Theme color: `#667eea`
     - Background color: `#667eea`
     - Icon: 上传 icon512.png

4. **下载并签名**
   - 下载生成的 Android 项目
   - 使用 Android Studio 打开项目
   - 生成签名密钥并构建 APK

---

## 方法二：使用 Bubblewrap CLI

### 前置要求：
- Node.js 14+
- JDK 8+
- Android SDK

### 安装步骤：

```bash
# 1. 安装 Bubblewrap CLI
npm install -g @bubblewrap/cli

# 2. 初始化项目
cd water-tracker
bubblewrap init --manifest=./manifest.json

# 3. 构建 APK
bubblewrap build

# 4. 生成的 APK 位于 app-release-signed.apk
```

---

## 方法三：使用 Android Studio 手动创建 TWA

### 步骤：

1. **创建新的 Android 项目**
   - 打开 Android Studio
   - 选择 "Empty Activity"
   - Package name: `com.watertracker.twa`

2. **添加依赖**
   在 `app/build.gradle` 中添加：
   ```gradle
   dependencies {
       implementation 'com.google.androidbrowserhelper:androidbrowserhelper:2.5.0'
   }
   ```

3. **配置 AndroidManifest.xml**
   添加 TWA Activity 配置（详见下方配置文件）

4. **添加 assetlinks.json**
   - 将应用部署到 HTTPS 服务器
   - 在服务器根目录创建 `.well-known/assetlinks.json`
   - 配置数字资产链接

5. **生成签名并构建**
   ```bash
   ./gradlew assembleRelease
   ```

---

## 部署要求

### 1. HTTPS 部署
应用必须部署到 HTTPS 服务器，推荐平台：
- **GitHub Pages**: 免费，支持自定义域名
- **Netlify**: 免费，自动部署
- **Vercel**: 免费，性能优秀
- **Firebase Hosting**: 免费额度充足

### 2. 配置 assetlinks.json
部署后，需要在服务器配置数字资产链接文件。

**获取 SHA256 指纹：**
```bash
keytool -list -v -keystore your-keystore.jks -alias your-key-alias
```

**assetlinks.json 示例：**
```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.watertracker.twa",
    "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT"]
  }
}]
```

将此文件放置在：`https://your-domain.com/.well-known/assetlinks.json`

---

## 快速开始（推荐流程）

### 第一步：部署到 GitHub Pages

1. 创建 GitHub 仓库
2. 将 water-tracker 文件夹内容推送到仓库
3. 在仓库设置中启用 GitHub Pages
4. 记录你的应用 URL（如：`https://username.github.io/water-tracker/`）

### 第二步：使用 PWABuilder 生成 APK

1. 访问 https://www.pwabuilder.com/
2. 输入你的应用 URL
3. 点击 "Start" 进行分析
4. 选择 "Android" 平台
5. 配置应用信息并下载项目
6. 使用 Android Studio 构建 APK

### 第三步：测试和发布

1. 在 Android 设备上安装 APK 测试
2. 确认所有功能正常工作
3. 可选：发布到 Google Play Store

---

## 注意事项

1. **Service Worker 必须正常工作**
   - 确保 sw.js 正确注册
   - 在 HTTPS 环境下测试

2. **manifest.json 必须有效**
   - 所有图标路径正确
   - start_url 可访问

3. **数字资产链接**
   - assetlinks.json 必须在 HTTPS 服务器上可访问
   - SHA256 指纹必须匹配签名密钥

4. **图标要求**
   - 至少提供 192x192 和 512x512 两种尺寸
   - 建议使用 maskable 图标以适配不同设备

---

## 常见问题

**Q: 为什么需要 HTTPS？**
A: PWA 和 TWA 都要求 HTTPS 以确保安全性。Service Worker 只能在 HTTPS 环境下工作。

**Q: 可以直接打包成 APK 吗？**
A: 不能直接打包。需要先部署到服务器，然后使用 TWA 技术将 Web 应用包装成 Android 应用。

**Q: APK 大小是多少？**
A: TWA 应用通常只有 1-2MB，因为实际内容从服务器加载。

**Q: 离线功能如何实现？**
A: 通过 Service Worker 缓存实现。当前应用已配置基本缓存策略。

---

## 相关资源

- [PWABuilder 官网](https://www.pwabuilder.com/)
- [Bubblewrap CLI 文档](https://github.com/GoogleChromeLabs/bubblewrap)
- [TWA 官方指南](https://developer.chrome.com/docs/android/trusted-web-activity/)
- [Android Browser Helper](https://github.com/GoogleChrome/android-browser-helper)
