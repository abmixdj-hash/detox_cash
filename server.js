import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;

app.post('/v1/chat/completions', async (req, res) => {
    try {
        // Берем секретный ключ из переменных окружения Railway
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'OpenAI API key is not configured on server' });
        }

        // Пересылаем запрос в OpenAI, используя скрытый на сервере ключ
        const response = await axios.post('https://api.openai.com/v1/chat/completions', req.body, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error proxying to OpenAI:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Server Error' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running and listening on port ${PORT}`);
});
