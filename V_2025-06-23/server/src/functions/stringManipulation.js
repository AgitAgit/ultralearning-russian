function stringToWordList(str) {
  // 1. Normalize the string: convert to lowercase and remove non-alphanumeric characters.
  //    This now includes Cyrillic Unicode range.
  //    Cyrillic characters range from \u0400 to \u04FF
  const normalizedStr = str.toLowerCase().replace(/[^a-z0-9\u0400-\u04FF\s]/g, '');

  // 2. Split the string into an array of words.
  const words = normalizedStr.split(/\s+/).filter(word => word.length > 0);

  // 3. Create a map to store word counts.
  const wordCounts = {};

  // 4. Populate the wordCounts map.
  for (const word of words) {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  }

  // 5. Convert the wordCounts map into an array of objects.
  const wordList = Object.keys(wordCounts).map(word => ({
    word: word,
    count: wordCounts[word]
  }));

  // 6. Sort the array by count in descending order.
  wordList.sort((a, b) => b.count - a.count);

  return wordList;
}

module.exports = {
    stringToWordList
}