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
          "Authorization": `Bearer YOUR_OPENAI_API_KEY`
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
        meaning: "حدث خطأ أثناء جلب المعنى. تأكد من الاتصال أو المفتاح الصحيح."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">المعجم الوسيط الذكي</h1>
      <input
        placeholder="أدخل الكلمة هنا..."
        value={word}
        onChange={(e) => setWord(e.target.value)}
        className="text-right w-full p-2 border rounded"
      />
      <button onClick={handleSearch} disabled={loading} className="w-full p-2 bg-blue-500 text-white rounded">
        {loading ? "جارٍ البحث..." : "بحث"}
      </button>

      {definition && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <div className="p-4 border rounded bg-white shadow">
            <p>{definition.original}</p>
            <p><strong>النتيجة:</strong><br />{definition.meaning}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}