import { useState, useEffect } from 'react';

// The <T> is a TypeScript Generic. It allows this hook to store ANY type of data (strings, arrays, objects).
export function useLocalStorage<T>(key: string, initialValue: T) {
  
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      // If the data exists in localStorage, parse and return it. Otherwise, return the mock data.
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return initialValue;
    }
  });

  // Syncing State to Storage
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Error writing to localStorage', error);
    }
  }, [key, storedValue]); // This runs automatically every time 'storedValue' changes

  return [storedValue, setStoredValue] as const;
}