import styles from "./hero.module.css";

export function HeroHeading() {
  return (
    <h1 id="hero-title" className={styles.title}>
      Hạ tầng vững mạnh. <span>Bứt phá mọi giới hạn.</span>
    </h1>
  );
}
