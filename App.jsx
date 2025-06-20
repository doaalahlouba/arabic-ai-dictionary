import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function AIArabicDictionary() {
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-4",
        messages: [
          { role: "system", content: "أنت معجم لغوي عربي. أعطني المعنى الفصيح، وشرحًا مبسطًا، وجملة مثال للكلمة التالية." },
          { role: "user", content: word }
        ]
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        }
      });

      const content = response.data.choices[0].message.content;
      setDefinition({
        original: `الكلمة: ${word}`,
        meaning: content
      });
    } catch (error) {
      setDefinition({
        original: `الكلمة: ${word}`,
        meaning: "⚠️ حدث خطأ أثناء جلب المعنى. تأكد من الاتصال أو المفتاح الصحيح."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4 text-right font-sans bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-800">📘 المعجم الوسيط الذكي</h1>
      <div className="flex space-x-2 justify-end">
        <button onClick={handleSearch} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {loading ? "جاري البحث..." : "🔍 بحث"}
        </button>
        <input
          type="text"
          placeholder="أدخل الكلمة..."
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="border p-2 rounded w-full focus:outline-none focus:border-blue-400"
        />
      </div>

      {definition && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-4 rounded shadow space-y-2"
        >
          <p className="text-lg text-gray-800">{definition.original}</p>
          <p className="text-gray-700 whitespace-pre-line"><strong>النتيجة:</strong> {definition.meaning}</p>
        </motion.div>
      )}
    </div>
  );
}