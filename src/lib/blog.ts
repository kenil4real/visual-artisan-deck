import photographySetImg from "@/assets/photography-set.jpg";
import productFilmImg from "@/assets/product-film.jpg";
import droneAerialImg from "@/assets/drone-aerial.jpg";

export type BlogBlock =
  { type: "p"; text: string } | { type: "h2"; text: string } | { type: "quote"; text: string };

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  dateLabel: string;
  readTime: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  blocks: BlogBlock[];
}

export const posts: BlogPost[] = [
  {
    slug: "what-a-1500-marketing-retainer-should-include",
    title: "What a $1,500/Month Marketing Retainer Should Actually Include",
    date: "2026-10-01",
    dateLabel: "October 1, 2026",
    readTime: "2 min read",
    excerpt:
      "Most $1,500 retainers buy a logo on a slide deck and a monthly report nobody reads. Here is what that money should actually get you.",
    image: photographySetImg,
    imageAlt: "Creative team reviewing campaign work in a studio",
    blocks: [
      {
        type: "p",
        text: "We see the same thing when we take over accounts: a small business paying $1,500 a month, getting a monthly PDF and a prayer. That is not a retainer. That is a subscription to busywork. Here is what $1,500 should actually buy.",
      },
      { type: "h2", text: "A strategy you can point at" },
      {
        type: "p",
        text: "You should get a written 90-day roadmap: what we are doing, why, and what number it is supposed to move. If your agency cannot show you that document, you do not have a strategy. You have a vendor.",
      },
      { type: "h2", text: "Fresh creative every month" },
      {
        type: "p",
        text: "Ads die without new creative. Your retainer should include new hooks, new angles, new formats every month. Not one video in January running until June. We shoot, cut, and refresh creative inside the retainer, because stale creative is the number one reason ROAS slides.",
      },
      { type: "h2", text: "Hands in the accounts, weekly" },
      {
        type: "p",
        text: "Someone should be inside your Meta, Google, TikTok, and LinkedIn accounts every week: watching ROAS, killing losers, scaling winners. Plus a live dashboard so you can see the numbers yourself anytime, without waiting for a report.",
      },
      {
        type: "quote",
        text: "If you cannot see what your retainer bought you last month, it bought you nothing.",
      },
      {
        type: "p",
        text: "That is the bar. One point of contact, a live dashboard, fresh creative monthly, and a plan in writing. Anything less and the $1,500 is a donation.",
      },
    ],
  },
  {
    slug: "your-ads-are-fine-your-creative-is-the-problem",
    title: "Your Ads Are Fine. Your Creative Is the Problem.",
    date: "2026-10-08",
    dateLabel: "October 8, 2026",
    readTime: "2 min read",
    excerpt:
      "We audit ad accounts every week. Targeting is fine. Budget is fine. The ads themselves are tired. Here is the fix nobody wants to hear.",
    image: productFilmImg,
    imageAlt: "Cinema camera filming a product for an advertising campaign",
    blocks: [
      {
        type: "p",
        text: "We audit ad accounts every week, and the pattern never changes. Targeting is fine. Budget is fine. The ads themselves are tired: same video for four months, same hook, same thumbnail. Then the client asks why ROAS dropped, as if the audience owes them attention forever.",
      },
      { type: "h2", text: "Creative has a shelf life" },
      {
        type: "p",
        text: "On Meta and TikTok, an ad peaks in two to four weeks, then fatigue sets in. Costs climb, click-through drops, and no budget increase fixes it. The only fix is new creative. This is not a theory. It is the most consistent pattern in every account we touch.",
      },
      { type: "h2", text: "Refresh the hook, not just the footage" },
      {
        type: "p",
        text: "A refresh does not mean reshooting everything. A new opening three seconds. A new angle on the same offer. A customer clip cut differently. Small changes, big effect. We keep a running bench of hooks so there is always something fresh ready to test.",
      },
      { type: "h2", text: "Test like you mean it" },
      {
        type: "p",
        text: "Run the new creative against the old. Kill what loses. Scale what wins. Repeat monthly. That loop is the entire job, and most businesses never run it because nobody is making the creative.",
      },
      {
        type: "quote",
        text: "Your targeting did not break. Your audience just got bored.",
      },
      {
        type: "p",
        text: "If your ROAS slid and nothing else changed, start with creative. It is almost always creative.",
      },
    ],
  },
  {
    slug: "local-seo-map-pack",
    title: "Local SEO: the 5 Things That Actually Move You Up the Map Pack",
    date: "2026-10-15",
    dateLabel: "October 15, 2026",
    readTime: "3 min read",
    excerpt:
      "Everyone wants the top of the map pack. Few want to do the unglamorous work that gets you there. Five things, in order of impact.",
    image: droneAerialImg,
    imageAlt: "Aerial view of a town and the surrounding area",
    blocks: [
      {
        type: "p",
        text: "Everyone wants the top of the map pack. Few want to do the unglamorous work that gets you there. Here are the five things that actually move the needle, in order of impact.",
      },
      { type: "h2", text: "1. Complete your Google Business Profile, fully" },
      {
        type: "p",
        text: "Every field. Every service. Real photos, not stock. Hours that are actually correct. Most profiles we audit are 60 percent done. Google rewards the complete ones.",
      },
      { type: "h2", text: "2. Get reviews, and answer every one" },
      {
        type: "p",
        text: "Review count and recency are ranking factors, full stop. Ask every happy customer. Then reply to all of them, good and bad. A business that answers reviews looks alive, and Google notices.",
      },
      { type: "h2", text: "3. Keep your name, address, and phone identical everywhere" },
      {
        type: "p",
        text: "Yelp, Facebook, directories, your own site: the exact same formatting. Inconsistencies confuse Google and cost you positions. This is boring work. It matters.",
      },
      { type: "h2", text: "4. Add local content to your site" },
      {
        type: "p",
        text: "Pages and posts that mention your actual service areas. Not keyword stuffing. Real content about real places you serve. A Berks County business should sound like a Berks County business.",
      },
      { type: "h2", text: "5. Post on your profile weekly" },
      {
        type: "p",
        text: "Google Business posts are free visibility most businesses ignore. An update, an offer, a photo. Weekly. It signals the business is active, and active businesses rank.",
      },
      {
        type: "p",
        text: "None of this is exotic. That is the point. The map pack goes to businesses that do the basics completely, while competitors do them halfway.",
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug);
}
