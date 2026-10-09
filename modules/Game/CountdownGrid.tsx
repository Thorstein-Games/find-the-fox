import { useEffect, useRef, useState } from 'react';

import styles from './game.module.scss';

const CountdownGrid = ({ timeUp, timer = 30 }: { timeUp: () => void; timer?: number }) => {
  const [count, setCount] = useState(timer);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const decreaseNum = () => {
    setCount((prev) => prev - 1);
  };

  useEffect(() => {
    intervalRef.current = setInterval(decreaseNum, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (count === 0) {
      timeUp();
      clearInterval(intervalRef.current);
    }
  }, [count]);

  useEffect(() => {
    clearInterval(intervalRef.current);
    setCount(timer);
    intervalRef.current = setInterval(decreaseNum, 1000);
  }, [timer]);

  return <span className={styles.countdown}>{count}</span>;
};

export default CountdownGrid;
