import type { Transaction } from '../../../context/FinanceContext';

export const generateGeminiResponse = async (
  query: string,
  summary: any,
  transactions: Transaction[],
  goal: number,
  apiKey: string
): Promise<string> => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const contextMsg = `
You are Ren's Finance Advisor, a friendly, casual AI assistant embedded in the FinTrack dashboard.
Here is the context for the current month:
- Total Income: ₹${summary.totalIncome}
- Total Expenses: ₹${summary.totalExpenses}
- Net Savings: ₹${summary.netSavings}
- Savings Goal: ₹${goal}
- Category Breakdown: ${JSON.stringify(summary.categoryBreakdown)}
- Recent Transactions (top 10): ${JSON.stringify(transactions.slice(0, 10))}

The user asks: "${query}"

Guidelines:
1. Be friendly and conversational like a knowledgeable friend, not a banker.
2. Answer the user's specific question using the provided data.
3. If they ask for tips, provide actionable, category-specific advice.
4. Keep the response concise (max 3-4 sentences) and use emojis.
`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: contextMsg }] }],
        generationConfig: {
          temperature: 0.7,
        }
      })
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    if (data.candidates && data.candidates[0].content.parts[0].text) {
        return data.candidates[0].content.parts[0].text;
    }
    return "I received an unexpected response from the AI.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Oops! I couldn't reach my brain (Gemini API). Please check your API key or network connection.";
  }
};
