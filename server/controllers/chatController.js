const { chatAssistant } = require('../services/aiService');

exports.chat = async (req, res) => {
  try {
    const { message, context } = req.body;
    if (!message) return res.status(400).json({ message: 'Message required' });

    const reply = await chatAssistant(message, context);
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
