import Image from "next/image";
import codemapImage from "./codemap_image.png";
import styles from "./codebook.module.css";

const DIAGRAM_ALT =
  "Code map diagram: AI-Mediated Creative Practice at the centre branches to Tensions, Cognitive Redistribution, and Vision Mediation, each with secondary codes. A dashed line connects Cognitive Stress to Cognitive Relief.";

export default function CodebookDiagram() {
  return (
    <>
      <figure
        className={styles.diagramWrap}
        aria-describedby="codebook-diagram-text-summary"
      >
        <div className={styles.diagramFrame}>
          <Image
            src={codemapImage}
            alt={DIAGRAM_ALT}
            width={codemapImage.width}
            height={codemapImage.height}
            className={styles.diagramImage}
            sizes="100vw"
            decoding="async"
          />
        </div>
        <figcaption className={styles.diagramFigcaption}>
          Figure 1. Code map of the AI-mediated creative practice codebook.
        </figcaption>
      </figure>

      <div
        id="codebook-diagram-text-summary"
        className={`sr-only ${styles.diagramTextSummary}`}
      >
        <p>
          The central concept is AI-Mediated Creative Practice. It connects forward to three primary
          codes.
        </p>
        <ul>
          <li>
            Tensions leads to Authenticity and Cognitive Stress. Cognitive Stress is joined by a
            dashed line to Cognitive Relief, labelled cross-primary tension.
          </li>
          <li>
            Cognitive Redistribution leads to Cognitive Relief, Cognitive Role Shift, and Creative
            Scope.
          </li>
          <li>Vision Mediation leads to Externalisation, Elaboration, and Divergence.</li>
        </ul>
      </div>
    </>
  );
}
