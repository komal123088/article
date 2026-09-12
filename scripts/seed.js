/**
 * Adds sample articles (4 per category) to the database so you have
 * something to show the client. Safe to run more than once — it will
 * just add another batch each time, so only run it when you actually
 * want more demo articles.
 *
 * Usage:
 *   npm run seed
 */
require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const CATEGORIES = [
  "Business",
  "Tech",
  "Consumer",
  "Finance",
  "Environment",
  "Property",
  "Ecommerce",
];

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: { type: String, default: "user" },
    authProvider: { type: String, default: "credentials" },
    isVerified: { type: Boolean, default: false },
    otpCode: String,
    otpExpiresAt: Date,
  },
  { timestamps: true },
);

const ArticleSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    excerpt: String,
    content: String,
    coverImage: String,
    category: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    authorName: String,
    status: { type: String, default: "published" },
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Article =
  mongoose.models.Article || mongoose.model("Article", ArticleSchema);

function slugify(title) {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") +
    "-" +
    Date.now().toString().slice(-6) +
    "-" +
    Math.floor(Math.random() * 1000)
  );
}

// One sample article template per category. Feel free to edit the text
// below before running the script to better match the client's niche.
const SAMPLE_ARTICLES = {
  Business: [
    {
      title: "Small Businesses Turn to AI Tools to Cut Operating Costs",
      excerpt:
        "More small business owners are adopting AI-powered software to handle bookkeeping, customer service and inventory — often at a fraction of the cost of hiring extra staff.",
    },
    {
      title: "Why Local Retailers Are Rethinking Their Supply Chains",
      excerpt:
        "Rising shipping costs and delivery delays are pushing store owners to source more products locally, even if it means slightly higher prices.",
    },
    {
      title: "Remote Work Is Reshaping Office Real Estate Demand",
      excerpt:
        "Companies are downsizing office space as hybrid work becomes permanent, leaving landlords to rethink how commercial buildings are used.",
    },
    {
      title: "Startups Are Raising Smaller Rounds — and That's a Good Sign",
      excerpt:
        "Investors say leaner funding rounds are forcing founders to focus on profitability earlier, which could mean healthier businesses long term.",
    },
  ],
  Tech: [
    {
      title: "What On-Device AI Means for Everyday Apps",
      excerpt:
        "Phones and laptops are increasingly running AI models locally instead of in the cloud — here's why that matters for privacy and speed.",
    },
    {
      title: "The Quiet Rise of Passwordless Logins",
      excerpt:
        "More apps are ditching passwords in favor of passkeys and biometric logins. We look at how it works and whether it's actually safer.",
    },
    {
      title: "Battery Technology Is Finally Catching Up to Demand",
      excerpt:
        "New battery chemistries promise faster charging and longer life — but manufacturers say mass adoption is still a few years away.",
    },
    {
      title: "How Browser Extensions Became a Security Blind Spot",
      excerpt:
        "Security researchers are warning that browser extensions, often overlooked, are becoming a common entry point for data theft.",
    },
  ],
  Consumer: [
    {
      title: "Grocery Prices Are Stabilizing, But Habits Have Already Changed",
      excerpt:
        "Even as inflation cools, many shoppers say they're sticking with budget brands and bulk buying — habits picked up during leaner years.",
    },
    {
      title: "The Return Policy Loophole Retailers Are Starting to Close",
      excerpt:
        "Free and easy returns helped online shopping boom — now stores are quietly tightening the rules to control rising costs.",
    },
    {
      title: "Why Extended Warranties Are Rarely Worth It",
      excerpt:
        "A closer look at the numbers shows most extended warranty plans cost more than the repairs they're meant to cover.",
    },
    {
      title:
        "Subscription Fatigue Is Real — Here's How People Are Fighting Back",
      excerpt:
        "From shared logins to subscription-tracking apps, consumers are finding new ways to keep recurring charges under control.",
    },
  ],
  Finance: [
    {
      title: "What Rising Interest Rates Actually Mean for Everyday Savers",
      excerpt:
        "Higher rates aren't all bad news — savings accounts and fixed deposits are finally offering more competitive returns.",
    },
    {
      title: "Buy Now, Pay Later Is Quietly Reshaping Personal Debt",
      excerpt:
        "Short-term installment plans are convenient, but financial advisors warn they can make it harder to track total spending.",
    },
    {
      title: "How to Read a Company's Earnings Report Without a Finance Degree",
      excerpt:
        "A simple breakdown of the numbers that actually matter when a company announces its quarterly results.",
    },
    {
      title: "The Case for Automating Your Savings, Even in Small Amounts",
      excerpt:
        "Financial planners say consistency matters more than amount — automated transfers can build a habit that compounds over time.",
    },
  ],
  Environment: [
    {
      title: "Cities Are Quietly Redesigning Streets Around Heatwaves",
      excerpt:
        "From reflective pavement to more shaded bus stops, urban planners are adapting infrastructure for hotter summers.",
    },
    {
      title: "Solar Panel Recycling Is Becoming a Real Industry",
      excerpt:
        "As the first generation of solar panels reaches the end of its life, new recycling facilities are emerging to handle the waste.",
    },
    {
      title:
        "Why Water Scarcity Is Now a Business Risk, Not Just an Environmental One",
      excerpt:
        "Companies in manufacturing and agriculture are factoring water availability into long-term planning for the first time.",
    },
    {
      title: "Electric Vehicle Batteries Are Getting a Second Life",
      excerpt:
        "Retired EV batteries are finding new uses in home energy storage, extending their usefulness well past the vehicle's lifespan.",
    },
  ],
  Property: [
    {
      title: "Why First-Time Buyers Are Looking Further From City Centers",
      excerpt:
        "Rising prices near urban cores are pushing new buyers toward suburbs and smaller towns with better affordability.",
    },
    {
      title: "The Hidden Costs of Buying an Older Home",
      excerpt:
        "A lower price tag can hide expensive surprises — from outdated wiring to plumbing that doesn't meet current standards.",
    },
    {
      title: "Co-Living Spaces Are Gaining Ground in Bigger Cities",
      excerpt:
        "Shared housing with private rooms and communal spaces is attracting young professionals looking for affordability and community.",
    },
    {
      title: "What to Actually Check Before Signing a Rental Agreement",
      excerpt:
        "A practical checklist covering the clauses renters most often overlook — and later regret not reading closely.",
    },
  ],
  Ecommerce: [
    {
      title: "Same-Day Delivery Is Becoming the New Baseline, Not a Bonus",
      excerpt:
        "Customer expectations have shifted so much that slower shipping options are starting to feel like a dealbreaker for many shoppers.",
    },
    {
      title: "How Small Online Sellers Are Competing With Marketplace Giants",
      excerpt:
        "Independent stores are leaning into niche branding and personal customer service to stand out from bigger platforms.",
    },
    {
      title: "Why Product Photos Matter More Than Ever for Conversions",
      excerpt:
        "With more shopping happening on mobile screens, sellers are investing more in photography and short video previews.",
    },
    {
      title: "The Return Rate Problem Nobody Talks About",
      excerpt:
        "High return rates are quietly eating into margins for online stores — and sizing tools are becoming a popular fix.",
    },
  ],
};

const BODY_TEMPLATE = (
  title,
) => `This is a placeholder article generated for demo purposes.

${title}

Replace this paragraph with the real article content once you're ready to publish for real readers. You can edit or delete this article any time from the admin dashboard at /admin/articles.

A good article usually opens with the most important point, then fills in context, examples, and supporting details in the paragraphs that follow. Keep paragraphs short so they're easy to read on mobile.`;

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not set in .env.local — cannot seed.");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGODB_URI);

  // Find or create a placeholder "Editorial Team" author for the demo articles.
  let author = await User.findOne({ email: "editorial@todaymagazine.com" });
  if (!author) {
    const hashedPassword = await bcrypt.hash("change-me-later", 10);
    author = await User.create({
      name: "Editorial Team",
      email: "editorial@todaymagazine.com",
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });
    console.log("Created placeholder author: editorial@todaymagazine.com");
  }

  let count = 0;
  for (const category of CATEGORIES) {
    const articles = SAMPLE_ARTICLES[category] || [];
    for (const [i, item] of articles.entries()) {
      const seed = `${category}-${i}-${Date.now()}`;
      await Article.create({
        title: item.title,
        slug: slugify(item.title),
        excerpt: item.excerpt,
        content: BODY_TEMPLATE(item.title),
        coverImage: `https://picsum.photos/seed/${encodeURIComponent(seed)}/1200/800`,
        category,
        author: author._id,
        authorName: author.name,
        status: "published",
      });
      count++;
    }
  }

  console.log(
    `Done — added ${count} sample articles across ${CATEGORIES.length} categories.`,
  );
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
