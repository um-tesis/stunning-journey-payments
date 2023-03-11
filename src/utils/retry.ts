const BASE_DELAY = 1000;
const MAX_RETRIES = 5;

export async function retryWithExponentialBackoff<T>(fn: () => Promise<T>, maxRetries = MAX_RETRIES): Promise<T> {
  let retries = 0;
  let delay = BASE_DELAY;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      return await fn();
    } catch (error: any) {
      console.log(`Error occurred: ${error.message as string}`);
      retries++;
      if (retries > maxRetries) {
        console.log(`Maximum retries exceeded (${maxRetries})`);
        throw error;
      }
      console.log(`Retrying in ${delay} ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
}
