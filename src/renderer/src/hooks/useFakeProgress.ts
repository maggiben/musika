import { useEffect, useState } from 'react';

interface Progress {
  [key: string]: number[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useFakeProgress = ({ items }: { items?: any[] }): Progress => {
  const [progress, setProgress] = useState<Progress>({});

  useEffect(() => {
    if (items && Array.isArray(items) && items.length > 0) {
      const hash = items
        .map((item) => {
          const start = Math.floor(Math.random() * 10);
          return {
            [item.id]: [start, start + 5], // Math.floor(Math.random() * 101),
          };
        })
        .reduce((acc, curr) => {
          const [id, value] = Object.entries(curr)[0];
          acc[id] = value;
          return acc;
        }, {});
      setProgress(hash);
    }

    const interval = setInterval(() => {
      if (items && !window['abortx']) {
        setProgress((prevHash) => {
          for (const key in prevHash) {
            if (prevHash[key][1] < 100) {
              const end = Math.floor(Math.random() * 5);
              prevHash[key] = [prevHash[key][1], prevHash[key][1] + end];
            } else {
              prevHash[key][0] = 0;
              prevHash[key][1] = 0;
            }
          }
          return { ...prevHash };
        });
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return progress;
};

export default useFakeProgress;
