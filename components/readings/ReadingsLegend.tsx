import styles from "./readings.module.css";

export function ReadingsLegend() {
  return (
    <ul className={styles.legend} aria-label="Graph legend">
      <li>
        <span
          className={`${styles.legendMark} ${styles.legendReading}`}
          aria-hidden="true"
        />
        Green circles = readings
      </li>
      <li>
        <span
          className={`${styles.legendMark} ${styles.legendSource}`}
          aria-hidden="true"
        />
        Small beige circles = sources
      </li>
      <li>
        <span className={`${styles.legendLine}`} aria-hidden="true" />
        Thin lines = relationships
      </li>
    </ul>
  );
}
