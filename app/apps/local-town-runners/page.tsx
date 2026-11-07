import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./spotlight.module.css";

const description = "The story of Local Town Runners: an AIBRY Labs community commerce prototype connecting small-town shops, customers, and everyday journeys.";
export const metadata: Metadata = {
  title: "Local Town Runners — Small Towns. Big Possibilities.",
  description,
  alternates: { canonical: "https://aibrylabs.com/apps/local-town-runners" },
  openGraph: {
    title: "Local Town Runners | Small Towns. Big Possibilities.", description,
    url: "https://aibrylabs.com/apps/local-town-runners", type: "article",
    images: [{ url: "/apps/local-town-runners/opengraph-image", width: 1200, height: 630, alt: "Local Town Runners — Small towns. Big possibilities. An AIBRY Labs project." }],
  },
  twitter: { card: "summary_large_image", title: "Local Town Runners", description, images: ["/apps/local-town-runners/opengraph-image"] },
};

const milestones = [
  ["The initial experiment", "A PayPal AI Hackathon project exploring trusted payment flows and the coordination behind a local marketplace."],
  ["The community pivot", "The idea becomes Local Town Runners: a project shaped around small-town relationships and journeys people already make."],
  ["The marketplace foundation", "Fictional storefronts, demonstration products, browsing, carts, and customer, vendor, and runner perspectives make the concept tangible."],
  ["Real account workflows", "The prototype grows to include authenticated onboarding, vendor and runner applications, recorded consent, signed agreements, private PDFs, and administrator review."],
  ["Payment integration", "PayPal Sandbox checkout and webhook processing introduce a critical distinction: pending money is not a completed payment."],
  ["The road ahead", "The next challenge is validating the model with consenting businesses, real catalog operations, and carefully controlled fulfillment. This is a planned direction, not a commercial launch."],
];
const capabilities = [
  ["Discover & shop", "Fictional demo storefronts and listings, catalog discovery, a shopping cart, and isolated customer, vendor, and runner workspaces."],
  ["Join & review", "Authenticated account intake, vendor and runner applications, drawn signatures, generated agreements, private documents, and administrator review."],
  ["Follow an order", "A labeled simulated walkthrough lets visitors explore the roles involved in an order. Simulation does not send a payment or create real-world delivery."],
  ["Handle payment states", "PayPal Sandbox checkout, capture validation, signed webhooks, and reconciliation code. Simulated allocations are not actual payouts."],
];

export default function LocalTownRunnersPage() {
  return (
    <div className={styles.story}>
      <section className={styles.hero} aria-labelledby="ltr-title">
        <div className={styles.wrap}>
          <Link href="/apps" className={styles.back}>← AIBRY Labs / Projects</Link>
          <div className={styles.heroGrid}>
            <div>
              <p className={styles.eyebrow}>Local Town Runners · Project story</p>
              <h1 id="ltr-title">Small towns.<br /><em>Big possibilities.</em></h1>
              <p className={styles.lead}>Your neighbor is already going that way.</p>
              <p className={styles.intro}>What if the infrastructure for better local delivery already existed in the people traveling through town every day?</p>
              <div className={styles.actions}>
                <a className={styles.button} href="#watch">Watch the project film ↓</a>
                <a className={styles.secondary} href="https://runners.aibrylabs.com" target="_blank" rel="noopener noreferrer">Explore the prototype ↗</a>
              </div>
              <p className={styles.note}>An AIBRY Labs project · Conceived for the PayPal AI Hackathon</p>
            </div>
            <div className={styles.heroNote}>
              <span className={styles.eyebrow}>Inspired by Louisiana, Missouri</span>
              <p>Local shops.<br />Everyday journeys.<br /><em>A better connection.</em></p>
              <span>A community-centered marketplace concept, built around the way small towns actually live.</span>
              <div className={styles.miniRoute} aria-hidden="true"><b>Shop</b><i /><b>Neighbor</b><i /><b>Home</b></div>
            </div>
          </div>
          <nav className={styles.chapters} aria-label="Project story chapters">
            <a href="#why">01 / The spark</a><a href="#idea">02 / The connection</a><a href="#journey">03 / The journey</a><a href="#prototype">04 / The prototype</a><a href="#future">05 / What comes next</a>
          </nav>
        </div>
      </section>

      <section id="why" className={styles.section}>
        <div className={styles.wrap}>
          <p className={styles.eyebrow}>01 / The problem worth solving</p>
          <h2>Small towns deserve technology<br />designed for their lives.</h2>
          <p className={styles.intro}>Inspired by communities such as Louisiana, Missouri, Local Town Runners asks how local commerce could work when shops are independent, neighbors know one another, and delivery options can be limited.</p>
          <div className={styles.threeCards}>
            <article><span>For customers</span><h3>Local finds. Limited options.</h3><p>Residents want to discover nearby goods and services, even when getting to the shop or arranging delivery is difficult.</p></article>
            <article><span>For vendors</span><h3>A storefront beyond Main Street.</h3><p>Small shops, makers, and independent providers need practical ways to reach buyers and coordinate getting an order into their hands.</p></article>
            <article><span>For runners</span><h3>A journey already happening.</h3><p>A neighbor may already be heading past the shop and toward the customer. Could a convenient pickup fit that trip?</p></article>
          </div>
          <blockquote>The opportunity is in connecting the people already moving.</blockquote>
          <p className={styles.intro}>Traditional delivery often depends on dedicated dispatch and dense demand. LTR explores trip-compatible coordination instead. Lower costs, fewer emissions, and better efficiency are possibilities to test, not proven outcomes.</p>
        </div>
      </section>

      <section id="idea" className={`${styles.section} ${styles.light}`}>
        <div className={styles.wrap}>
          <p className={styles.eyebrow}>02 / The connection</p><h2>One order. Three neighbors.<br />A shared direction.</h2>
          <p className={styles.intro}>A customer discovers something local. A vendor prepares it. An eligible runner whose existing journey fits may accept the delivery.</p>
          <ol className={styles.route} aria-label="Conceptual order journey">
            {[ ["01", "Find something local", "The customer discovers a product from a nearby independent business."], ["02", "Prepare the order", "The vendor confirms and prepares the purchase for pickup."], ["03", "Connect a journey", "A compatible runner may accept a pickup along an existing trip."], ["04", "Bring it home", "The order reaches the customer and the delivery is confirmed."] ].map(([n,title,copy]) => <li key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p></li>)}
          </ol>
          <p className={styles.note}>The intended model. Demo matching and fulfillment controls explore this flow; they do not establish a live dispatch or delivery network.</p>
        </div>
      </section>

      <section id="watch" className={styles.section}>
        <div className={styles.wrap}>
          <p className={styles.eyebrow}>Meet Local Town Runners</p><h2>The idea, on screen.</h2>
          <div className={styles.video}><iframe src="https://www.youtube-nocookie.com/embed/3_TTpw0K51g" title="Local Town Runners project video" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>
          <a className={styles.textLink} href="https://www.youtube.com/watch?v=3_TTpw0K51g" target="_blank" rel="noopener noreferrer">Watch directly on YouTube ↗</a>
        </div>
      </section>

      <section id="journey" className={`${styles.section} ${styles.panel}`}>
        <div className={styles.wrap}>
          <p className={styles.eyebrow}>03 / From experiment to a bigger question</p><h2>How the project grew.</h2>
          <p className={styles.intro}>A hackathon was the starting point. The deeper motivation was making local commerce work for the communities it serves. Open each chapter to follow the development.</p>
          <div className={styles.timeline}>{milestones.map(([title,copy],i)=><details key={title} open={i===0}><summary><span>0{i+1}</span>{title}<b aria-hidden="true">+</b></summary><p>{copy}</p></details>)}</div>
        </div>
      </section>

      <section id="prototype" className={styles.section}>
        <div className={styles.wrap}>
          <p className={styles.eyebrow}>04 / What exists now</p><h2>A working prototype.<br /><em>A deliberate boundary.</em></h2>
          <p className={styles.intro}>The source includes marketplace, account, agreement, and Sandbox payment workflows. The public demo uses fictional shopping data and explicitly labeled simulation. It is not a commercial marketplace launch.</p>
          <div className={styles.twoCards}>{capabilities.map(([title,copy])=><article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div>
          <figure className={styles.screenshot}><Image src="/images/local-town-runners/demo-catalog.png" alt="Actual Local Town Runners demo catalog showing four explicitly fictional vendors and featured demonstration products" width={1152} height={1654} sizes="(max-width: 768px) 100vw, 1104px" /><figcaption>Actual application capture from the project repository, October 27, 2026. The storefronts and products shown are fictional demo data.</figcaption></figure>
          <div className={styles.engineering}>
            <div><p className={styles.eyebrow}>Engineering beneath the idea</p><h3>Trust is part of the workflow.</h3><p>Next.js and TypeScript power the application, with Supabase-backed data and authentication, Vercel deployment configuration, generated agreement PDFs, and PayPal Sandbox integration.</p></div>
            <div><h3>Pending never means paid.</h3><p>The payment code distinguishes pending from completed captures, checks amount and currency, and handles webhook events. Demo simulation stays separate from Sandbox transactions. Neither demonstrates live payouts.</p></div>
          </div>
          <p className={styles.note}>Capabilities checked against the development source and its documentation. This case study does not certify the current hosted deployment or payment provider status.</p>
        </div>
      </section>

      <section id="future" className={`${styles.section} ${styles.light}`}>
        <div className={styles.wrap}>
          <p className={styles.eyebrow}>05 / Planned directions</p><h2>Start local.<br />Learn what travels.</h2>
          <div className={styles.threeCards}>
            <article><span>Near-term</span><h3>A controlled pilot</h3><p>Work with consenting businesses, real catalog management, and completed-payment reconciliation before expanding beyond demonstration.</p></article>
            <article><span>Next</span><h3>Community coordination</h3><p>Validate trip-compatible matching, pickup coordination, order visibility, and delivery completion in real operating conditions.</p></article>
            <article><span>Long-term</span><h3>A model other towns can use</h3><p>Explore a repeatable approach for rural communities, local makers, small retailers, and independent service providers.</p></article>
          </div>
          <p className={styles.note}>These are ambitions to validate, not launched services or promised outcomes.</p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.closing}`}>
        <div className={styles.wrap}>
          <p className={styles.eyebrow}>Built by AIBRY Labs</p><h2>The future of local commerce might start with the neighbors already on the road.</h2>
          <p className={styles.intro}>Local Town Runners began as a hackathon experiment and grew into a broader question: what could small communities accomplish if the people, businesses, and everyday journeys around them were better connected?</p>
          <div className={styles.actions}><a className={styles.button} href="https://runners.aibrylabs.com" target="_blank" rel="noopener noreferrer">Explore Local Town Runners ↗</a><a className={styles.secondary} href="https://github.com/bryan060807/local-town-runners" target="_blank" rel="noopener noreferrer">View the development repository ↗</a><Link className={styles.textLink} href="/apps">Discover more AIBRY Labs projects →</Link></div>
        </div>
      </section>
    </div>
  );
}
