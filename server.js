const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();

// السماح بالاتصالات الخارجية (CORS) وتنسيق JSON
app.use(cors());
app.use(express.json());

// تهيئة مكتبة OpenAI باستخدام المفتاح الممرر من البيئة
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// مسار الـ API لاستقبال الاستفسارات من تطبيق Flutter
app.post('/api/assistant', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: "الرسالة مطلوبة" });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: message }]
        });

        res.json({ reply: response.choices[0].message.content });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// تحديد المنفذ المخصص للتشغيل
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
