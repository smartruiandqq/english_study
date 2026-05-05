# Wonder Island - 奇妙词典岛

一款面向小学生的 AI 英语学习应用，通过游戏化方式培养英语学习兴趣。

## 功能模块

- **魔法搜索** - 输入中文，查单词、看图片、听发音、学拼读
- **词灵图鉴** - 捕捉单词，积累成就，见证宠物进化

## 技术栈

- 前端：React + Vite + Tailwind CSS
- 后端：Python FastAPI
- AI：DeepSeek API（翻译 + Phonics 拆分）
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
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_MODEL=deepseek-chat
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
│           ├── translate.py  # 中英翻译 + Phonics
│           ├── tts.py        # Edge-TTS 语音合成
│           └── image.py     # Unsplash 图片搜索
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
| `/api/translate/` | POST | 中英翻译 + Phonics 拆分 + 例句生成 |
| `/api/tts/` | POST | 文字转语音（流式返回 mp3） |
| `/api/tts/voices` | GET | 获取可用音色列表 |
| `/api/image/` | POST | 根据关键词搜索图片 |

## 常见问题

**Q: 翻译接口返回错误？**
A: 检查 `DEEPSEEK_API_KEY` 是否正确配置。

**Q: 图片加载不出来？**
A: 检查 `UNSPLASH_ACCESS_KEY` 是否正确配置。

**Q: TTS 没有声音？**
A: Edge-TTS 无需 API Key，确保网络可访问微软服务。


#  unsplash 获取 access key
1. 打开 https://unsplash.com/developers
  2. 用 GitHub 账号登录
  3. 点击 New Application
  4. 填写应用名称和描述（随便填）
  5. 接受开发者条款
  6. 复制 Access Key

  免费额度：50 请求/小时，足够用了。

  拿到 key 后填到 .env：
  UNSPLASH_ACCESS_KEY=你的key