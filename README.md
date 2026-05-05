# Wonder Island - 奇妙词典岛

一款面向小学生的 AI 英语学习应用，通过游戏化方式培养英语学习兴趣。

## 功能模块

- **魔法搜索** - 输入/语音说中文，查单词、看图片、听发音、学拼读、谐音助记
- **词灵图鉴** - 捕捉单词，积累成就，见证宠物进化

## 技术栈

- 前端：React + Vite + Tailwind CSS
- 后端：Python FastAPI
- AI：MiniMax API（翻译 + Phonics 拆分 + 谐音）
- TTS：Edge-TTS（免费语音合成）
- 图片：Unsplash API（免费图片搜索）

## 本地开发

### 1. 准备依赖

#### 前端依赖
```bash
cd frontend
npm install
```

#### 后端依赖
```bash
cd backend
pip install -r requirements.txt
```

### 2. 配置环境变量

```bash
cd backend
cp .env.example .env
```

编辑 `.env` 文件，填入你的 API Key：

```env
# AI 翻译（选一个）
DEEPSEEK_API_KEY=your_deepseek_api_key_here
MINIMAX_API_KEY=your_minimax_api_key_here
AI_PROVIDER=deepseek  # 或 minimax

# 图片搜索
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

> **获取 API Key：**
> - DeepSeek API: https://platform.deepseek.com/
> - MiniMax API: https://www.minimax.chat/
> - Unsplash API: https://unsplash.com/developers

### 3. 启动服务

**终端 1 - 启动后端：**
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

**终端 2 - 启动前端：**
```bash
cd frontend
npm run dev
```

### 4. 访问应用

打开浏览器访问：http://localhost:5173

## 免费部署

### 方案：Vercel（前端）+ Render（后端）

#### 第一步：部署后端到 Render

1. 去 https://render.com 注册（用 GitHub 登录）
2. 点击 **New + → Web Service**
3. 连接你的 GitHub 仓库
4. 配置：
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. 添加环境变量（从 `.env` 复制）：
   - `AI_PROVIDER`
   - `DEEPSEEK_API_KEY` 或 `MINIMAX_API_KEY`
   - `UNSPLASH_ACCESS_KEY`
6. 点击 **Create Web Service**
7. 等待部署完成，复制 URL（如：`https://your-app.onrender.com`）

#### 第二步：部署前端到 Vercel

1. 去 https://vercel.com 注册（用 GitHub 登录）
2. 点击 **Add New → Project**
3. 导入你的仓库
4. 配置：
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. 添加环境变量：
   - `VITE_API_BASE_URL` = 你的后端 URL（如 `https://your-app.onrender.com`）
6. 点击 **Deploy**

#### 第三步：更新前端 API 地址

部署完前端后，修改 `frontend/src/services/api.js`，把 `baseURL` 改成后端地址：

```javascript
const api = axios.create({
  // 本地开发用 /api，生产环境用你的后端地址
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
})
```

然后重新部署。

#### 第四步：手机访问

部署完成后，用手机浏览器打开 Vercel 给你的 URL 即可。

> **注意**：免费版 Render 会休眠，15 分钟不用后首次访问会延迟几秒。

## 目录结构

```
english_study_baby/
├── backend/
│   ├── requirements.txt      # Python 依赖
│   ├── .env.example          # 环境变量模板
│   └── app/
│       ├── main.py           # FastAPI 入口
│       ├── config.py         # 配置
│       └── routers/
│           ├── translate.py  # 中英翻译 + Phonics + 谐音
│           ├── tts.py        # Edge-TTS 语音合成
│           └── image.py      # Unsplash 图片搜索
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx           # 主页面切换
│       ├── pages/
│       │   ├── MagicSearch.jsx  # 魔法搜索页
│       │   └── Collection.jsx   # 词灵图鉴页
│       └── services/
│           └── api.js       # API 封装
└── README.md
```

## API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/translate/` | POST | 中英翻译 + Phonics 拆分 + 谐音 + 例句 |
| `/api/tts/` | POST/GET | 文字转语音（流式返回 mp3） |
| `/api/tts/voices` | GET | 获取可用音色列表 |
| `/api/image/` | POST | 根据关键词搜索图片 |

## 常见问题

**Q: 翻译接口返回错误？**
A: 检查 `DEEPSEEK_API_KEY` 或 `MINIMAX_API_KEY` 是否正确配置。

**Q: 图片加载不出来？**
A: 检查 `UNSPLASH_ACCESS_KEY` 是否正确配置。

**Q: TTS 没有声音？**
A: Edge-TTS 无需 API Key，确保网络可访问微软服务。

## Unsplash 获取 Access Key

1. 打开 https://unsplash.com/developers
2. 用 GitHub 账号登录
3. 点击 **New Application**
4. 填写应用名称和描述（随便填）
5. 接受开发者条款
6. 复制 **Access Key**

免费额度：**50 请求/小时**，足够用了。

拿到 key 后填到 `.env`：
```
UNSPLASH_ACCESS_KEY=你的key
```