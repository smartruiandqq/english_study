const CATEGORIES = {
  '🐾 动物': 'animal',
  '🍎 水果': 'fruit',
  '🚗 交通': 'vehicle',
  '🌈 其他': 'other',
}

export default function Collection({ words }) {
  if (words.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
        <div className="text-6xl mb-4">🥚</div>
        <h2 className="text-2xl font-bold text-primary mb-2">图鉴空空如也</h2>
        <p className="text-gray-400">去魔法搜索捕捉单词吧！</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-island mb-4 flex items-center gap-2">
          🏆 词灵图鉴
          <span className="text-sm bg-island/20 text-island px-3 py-1 rounded-full">
            {words.length} 个词灵
          </span>
        </h2>

        {/* 进化进度 */}
        <div className="mb-4">
          <p className="text-xs text-gray-400 mb-1">宠物进化进度</p>
          <div className="bg-gray-100 rounded-full h-4 overflow-hidden">
            <div
              className="bg-accent h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((words.length % 10) * 10, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {words.length % 10}/10 词语，进化还差 {10 - (words.length % 10)} 个词！
          </p>
        </div>

        {/* 单词网格 */}
        <div className="grid grid-cols-3 gap-3">
          {words.map((w, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-3 text-center hover:scale-105 transition cursor-pointer"
            >
              {w.image && (
                <img
                  src={w.image}
                  alt={w.word}
                  className="w-full h-20 object-cover rounded-xl mb-2"
                />
              )}
              <p className="font-bold text-primary text-lg">{w.word}</p>
              <p className="text-xs text-gray-400">{w.phonetic}</p>
              {w.mnemonic && (
                <p className="text-xs text-pink-500 mt-1">💬 {w.mnemonic}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}