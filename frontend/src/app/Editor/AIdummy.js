export const fetchSuggestions = async (code) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [
      `// Suggestion based on "${code.substring(0, 20)}..."`,
      "// Suggestion 2",
      "// Suggestion 3",
    ];
  };