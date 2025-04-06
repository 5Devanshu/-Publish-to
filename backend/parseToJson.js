// ✅ Export just the function
export default function kardoJson(rawString) {
  try {
    let cleanedInput = rawString.replace(/```json|```/g, '').trim();

    cleanedInput = cleanedInput.replace(/:\s*"([^"]*?)"\s*(,|\n|\r\n)/gs, (match, p1, p2) => {
      const cleaned = p1.replace(/\s*\n\s*/g, ' ');
      return `: "${cleaned}"${p2}`;
    });

    const parsed = JSON.parse(cleanedInput);
    return parsed;
  } catch (err) {
    console.error('Failed to parse JSON:', err.message);
    return null;
  }
}

  