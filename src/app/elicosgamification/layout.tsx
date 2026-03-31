import type { ReactNode } from "react";
import styles from "./elicos.module.css";

export default function ElicosGamificationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
