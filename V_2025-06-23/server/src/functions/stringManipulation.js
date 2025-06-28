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

/**
 * 
 * @param { string[] } knownWords 
 * @param {string[]} bookWords 
 * @returns The percent of known words
 */
function uniquePercent(knownWords, bookWords) {
  // Handle edge cases where arrays might be empty
  if (!bookWords || bookWords.length === 0) {
    return 0; // If there are no book words, 0% are known.
  }

  if (!knownWords || knownWords.length === 0) {
    return 0; // If there are no known words, 0% of book words can be known.
  }

  // Convert knownWords to a Set for efficient lookup (O(1) average time complexity)
  const knownWordsSet = new Set(knownWords);

  let knownWordCount = 0;
  // Use a Set to track unique known words found in the book, to avoid counting duplicates in bookWords
  const uniqueKnownBookWords = new Set();

  for (const word of bookWords) {
    if (knownWordsSet.has(word)) {
      if (!uniqueKnownBookWords.has(word)) {
        uniqueKnownBookWords.add(word);
        knownWordCount++;
      }
    }
  }

  // Calculate the percentage
  // We need the number of unique words in the book for the denominator
  const uniqueBookWordsCount = new Set(bookWords).size;

  if (uniqueBookWordsCount === 0) {
    return 0; // Avoid division by zero if bookWords somehow contains only duplicates that were filtered out
  }

  const percentage = (knownWordCount / uniqueBookWordsCount) * 100;

  return percentage;
}

// This will be the percent of known words out of all the words in the book,
// not just the unique ones.
/**
 * 
 * @param {*} knownWords 
 * @param {*} bookWords 
 */
function weightedPercent(knownWords, bookWords){

}


module.exports = {
  stringToWordList,
  uniquePercent
}