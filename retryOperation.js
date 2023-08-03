async function retryOperation(operation, maxAttempts, delay) {
  let attempts = 0;
  while (attempts < maxAttempts) {
    try {
      const result = await operation();
      return result;
    } catch (error) {
      attempts++;
      if (attempts === maxAttempts) {
        throw error;
      } else {
        console.log(`An error occurred (${error.text}). Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
};
  
const processWithRetry = async (operation, maxAttempts, delay) => {
  return retryOperation(operation, maxAttempts, delay).catch((error) => {
    console.error('Operation failed after maximum attempts:', error);
    return null;
  });
};

export default processWithRetry;