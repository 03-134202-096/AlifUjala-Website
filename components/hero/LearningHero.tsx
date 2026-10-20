import Link from 'next/link'
import { IconBadge, LearningIcon } from '@/components/ui'
import styles from './LearningHero.module.css'

export default function LearningHero() {
  return (
    <section className={styles.hero} aria-labelledby="learning-hero-title">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}><LearningIcon name="pencil" /> Little steps, bright beginnings</p>
          <h2 id="learning-hero-title">Every letter starts<br />a new <span>adventure.</span></h2>
          <p className={styles.description}>A happy place to discover Urdu through playful activities, wonderful stories, and a little practice every day.</p>
          <div className={styles.actions}>
            <Link href="/activity" className={styles.primary}><LearningIcon name="worksheet" /> Explore activities <span aria-hidden="true">→</span></Link>
            <Link href="/games" className={styles.secondary}><LearningIcon name="gamepad" /> Let&apos;s play</Link>
          </div>
          <p className={styles.note}><LearningIcon name="heart" /> Made for curious little learners.</p>
        </div>
        <div className={styles.art} aria-hidden="true">
          <div className={styles.orbit} />
          <div className={styles.lesson}>
            <div className={styles.lessonHeading}><IconBadge name="book" /><span>Today&apos;s little adventure</span></div>
            <div className={styles.letters}>
              <span lang="ur">ا</span><span lang="ur">ب</span><span lang="ur">پ</span>
            </div>
            <p lang="ur" className={styles.urdu}>آئیں، اردو سیکھیں!</p>
          </div>
          <div className={styles.bookTab}><IconBadge name="book" size="lg" /><span>Read & discover</span></div>
          <div className={styles.pencilTab}><IconBadge name="worksheet" size="lg" /><span>Trace & learn</span></div>
          <LearningIcon name="sparkles" className={styles.sparkle} />
        </div>
      </div>
    </section>
  )
}
