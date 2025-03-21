// This is a simple in-memory database for demonstration purposes
// In a real application, you would use a proper database like MongoDB, PostgreSQL, etc.

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  categorySlug: string;
  imageUrl?: string; // Optional since not all articles will have images
  youtubeUrl?: string; // Optional for video-specific articles
  author: string;
  date: string;
  views: number;
  featured?: boolean;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  count: number;
  color: string;
};

// Sample categories
export const categories: Category[] = [
  { id: "1", name: "Politics", slug: "politics", count: 24, color: "blue" },
  { id: "2", name: "Economy", slug: "economy", count: 18, color: "green" },
  { id: "3", name: "Sports", slug: "sports", count: 15, color: "purple" },
  { id: "4", name: "Other", slug: "other", count: 12, color: "orange" },
  { id: "5", name: "Research", slug: "research", count: 10, color: "red" },
  {
    id: "6",
    name: "Bloggers",
    slug: "bloggers",
    count: 8,
    color: "indigo",
  },
  { id: "7", name: "Video", slug: "video", count: 6, color: "pink" },
];

// Sample articles
export const articles: Article[] = [
  {
    id: "1",
    title: "Эрчим хүчний реформд гологдсон дулаан",
    slug: "1",
    excerpt:
      "Эрчим хүчний тухай хуульд эрчим хүч гэдгийг цахилгаан, дулаан үйлдвэрлэх зориулалтаар ашиглаж болох бүх төрлийн түлш, сэргээгдэх болон бусад эх үүсвэрийг болон түүнийг ашиглан хэрэглэгчийн хэрэгцээнд зориулан үйлдвэрлэсэн цахилгаан, дулаан, шугам сүлжээгээр дамжуулан хэрэглэгчид түгээх метаны хийг хэлнэ хэмээн заасан байдаг. ",
    content: `
      <p>Эрчим хүчний тухай хуульд эрчим хүч гэдгийг цахилгаан, дулаан үйлдвэрлэх зориулалтаар ашиглаж болох бүх төрлийн түлш, сэргээгдэх болон бусад эх үүсвэрийг болон түүнийг ашиглан хэрэглэгчийн хэрэгцээнд зориулан үйлдвэрлэсэн цахилгаан, дулаан, шугам сүлжээгээр дамжуулан хэрэглэгчид түгээх метаны хийг хэлнэ хэмээн заасан байдаг. Өөрөөр хэлбэл, эрчим хүчний салбар гэсэн малгайн дор цахилгаан болон дулаан гэсэн хоёр том агуулга хамт явдаг байна. Гэсэн ч олон нийтийн ойлголт эрчим хүч гэхээр нь тогны, цахилгааны асуудлыг ойлгох тохиолдол бий.</p>
      
      <p>Гэтэл иргэд нь ч гэлтгүй төр нь ч гэсэн эрчим хүч гэдгээр зөвхөн цахилгааны асуудлыг ойлгодог бололтой.</p>
      
      <h2>Учир нь, Засгийн газар эрчим хүчний реформ хийнэ гэчхээд зөвхөн цахилгааны үнэд зохицуулалт хийж, дулааны үнэ дээр нүдээ аниад өнгөрлөө.</h2>
      
      <p>"Тодруулбал, өнгөрсөн оны 11-р сард ААН-ийн цахилгааны үнийг 30 хувиар, айл өрхийн хэрэглээг гурван шатлалтай нэмсэн. Ийнхүү үнэ нэмж байгаа шалтгаанаа эрчим хүчний салбарын алдагдлыг нөхөх зорилготой хэмээн тайлбарласан юм. Тухайн үед эрчим хүчний салбар 203 тэрбум төгрөгийн алдагдалтай ажиллах тооцоотой байсан бөгөөд ийнхүү үнэ нэмснээр энэ алдагдлаас сэргийлнэ гэж үзсэн. Энэ үед дулааны үнийг оны дараа нэмнэ гэж байсан ч яг нэмэх дээрээ тулахад улс төрчид шийдвэрээсээ ухарч, хэрэгжих хугацааг тодорхойгүй хугацаагаар хойшлууллаа. Үүнийгээ тайлбарлахдаа тогны үнийн нэмэгдлээс болж инфляц өндөр гарсан, төрөөс үнэ нэмдгээс болж иргэд хэцүү амьдарч байна хэмээн учирласан. Угтаа бол шийдвэр гаргагчид энэ бүх эрсдэлийг тооцоолж л шийдвэрээ гаргасан баймаар. "</p>
      
      <h2>Дулаан нэмээгүйгээс болж 118 тэрбумын алдагдал хүлээнэ</h2>
      
      <p>Хамгийн гол нь дулааны үнэ нэмэхийг хойшлуулснаар эрчим хүчний салбар 118 тэрбум төгрөгийн алдагдал хүлээх эрсдэлтэй байна. Энэ талаар ЭХЗХ-ны эх сурвалжууд news.mn сайтад тодруулга өгчээ. Тэдний мэдээлснээр "Дулааны эрчим хүчний тарифын хувьд 118 тэрбум төгрөгийн дутагдалд орох тооцоо гарсан. Хэрэв энэ дүн татаасаар олгогдохгүй бол эх үүсвэрийн дутагдалд орох, салбарын нөхцөл байдал хүндрэх, өр үүсээд явах эрсдэл тулгарна" гэсэн байна. 

Өөрөөр хэлбэл, энэхүү дутагдлыг 118 тэрбум төгрөгийн алдагдлыг нөхөхийн тулд нэг бол үнэ нэмэх шаардлагатай, үгүй бол төрөөс татаас авах шаардлагатай гэсэн үг юм. </p>
      
      <h2>Хэрэв үнэ нэмэх бол дараах байдлаар нэмнэ. </h2>
      
      
      <ul>
        <li>Улаанбаатар хотод 1 мкв нь 506 төгрөг</li>
        <li>Дархан, Эрдэнэт, Чойбалсан хотод 1 мкв нь 648 төгрөг </li>
        <li>Бусад аймгийн төвүүдэд 1 мкв нь 1024 төгрөг хүрээд байна. </li>
      </ul>
    `,
    category: "Politics",
    categorySlug: "politics",
    imageUrl: "/placeholder.svg?height=400&width=800",
    author: "Gantuya",
    date: "March 21, 2025",
    views: 6837,
    featured: true,
  },
  {
    id: "2",
    title: "Central Bank Maintains Current Interest Rates Despite Pressure",
    slug: "central-bank-interest-rates",
    excerpt:
      "The Central Bank has decided to maintain current interest rates despite growing pressure from various sectors to implement cuts to stimulate economic growth.",
    content: `
      <p>The Central Bank has decided to maintain current interest rates despite growing pressure from various sectors to implement cuts to stimulate economic growth.</p>
      
      <p>In its monthly monetary policy meeting, the bank's board voted unanimously to keep the benchmark interest rate at 4.5%, citing concerns about inflation and the need to maintain economic stability.</p>
      
      <h2>Economic Considerations</h2>
      
      <p>"While we understand the desire for lower interest rates to stimulate growth, our primary mandate is to ensure price stability," said the Central Bank Governor in a statement. "Current economic indicators suggest that maintaining the current rate is the most prudent course of action."</p>
      
      <p>The decision comes amid mixed economic signals, with strong employment figures but slowing GDP growth in the last quarter. Business associations have been calling for rate cuts to reduce borrowing costs and stimulate investment.</p>
      
      <h2>Market Reaction</h2>
      
      <p>Financial markets reacted with moderate volatility to the announcement, with the stock market initially dropping before recovering by the end of the trading day. Currency exchange rates remained relatively stable.</p>
      
      <p>Economists are divided on the decision, with some supporting the cautious approach while others argue that the economy needs monetary stimulus to avoid a potential slowdown.</p>
    `,
    category: "Economy",
    categorySlug: "economy",
    imageUrl: "/placeholder.svg?height=400&width=800",
    author: "Sarah Johnson",
    date: "March 20, 2025",
    views: 5242,
  },
  {
    id: "3",
    title: "International Summit Addresses Climate Change Initiatives",
    slug: "international-climate-summit",
    excerpt:
      "World leaders gathered at the International Climate Summit to discuss new emission reduction targets and collaborative approaches to addressing global warming.",
    content: `
      <p>World leaders gathered at the International Climate Summit to discuss new emission reduction targets and collaborative approaches to addressing global warming.</p>
      
      <p>The three-day summit, hosted in Geneva, brought together representatives from over 150 countries to negotiate new climate agreements and share strategies for transitioning to renewable energy sources.</p>
      
      <h2>New Commitments</h2>
      
      <p>"The time for incremental action has passed," stated the UN Secretary-General in the opening address. "We need bold, transformative commitments from all nations to limit global temperature rise to 1.5 degrees Celsius."</p>
      
      <p>Several major economies announced enhanced emission reduction targets, with some pledging carbon neutrality by 2045, five years earlier than previously committed.</p>
      
      <h2>Financial Support</h2>
      
      <p>A key focus of the summit was financial support for developing nations to implement climate adaptation measures and transition to clean energy technologies.</p>
      
      <p>A new climate finance package worth $100 billion annually was proposed, with contributions based on historical emissions and economic capacity. The proposal will be finalized in the coming months following further negotiations.</p>
    `,
    category: "Other",
    categorySlug: "other",
    imageUrl: "/placeholder.svg?height=400&width=800",
    author: "Michael Wong",
    date: "March 19, 2025",
    views: 6200,
  },
  {
    id: "4",
    title: "Economic Ecosystem Development Initiative Launched",
    slug: "economic-ecosystem-development",
    excerpt:
      "A new initiative aimed at strengthening the economic ecosystem has been launched, focusing on supporting small businesses and promoting sustainable growth.",
    content: `
      <p>A new initiative aimed at strengthening the economic ecosystem has been launched, focusing on supporting small businesses and promoting sustainable growth across multiple sectors.</p>
      
      <p>The Economic Ecosystem Development Initiative (EEDI) is a collaborative effort between the government, private sector, and academic institutions to create a more resilient and inclusive economy.</p>
      
      <h2>Key Components</h2>
      
      <p>"This initiative represents a holistic approach to economic development," explained the Minister of Economic Development. "Rather than focusing on individual sectors, we're looking at how different parts of the economy interact and support each other."</p>
      
      <p>The initiative includes several key components:</p>
      
      <ul>
        <li>A $500 million fund to provide low-interest loans to small and medium enterprises</li>
        <li>Technical assistance programs for entrepreneurs and business owners</li>
        <li>Research partnerships between industry and universities</li>
        <li>Regulatory reforms to reduce bureaucratic barriers to business growth</li>
      </ul>
      
      <h2>Expected Outcomes</h2>
      
      <p>Officials expect the initiative to create approximately 30,000 new jobs over the next five years and increase the contribution of small businesses to GDP by 5%.</p>
      
      <p>The program will initially focus on five priority sectors: technology, renewable energy, agriculture, manufacturing, and tourism.</p>
    `,
    category: "Research",
    categorySlug: "research",
    imageUrl: "/placeholder.svg?height=400&width=800",
    author: "Emily Chen",
    date: "March 18, 2025",
    views: 4832,
  },
  {
    id: "5",
    title: "National Team Qualifies for World Cup Finals",
    slug: "national-team-world-cup",
    excerpt:
      "The national football team has qualified for the World Cup finals after a thrilling victory in the qualifying tournament.",
    content: `
      <p>The national football team has qualified for the World Cup finals after a thrilling victory in the qualifying tournament, securing their place in the prestigious competition for the first time in 12 years.</p>
      
      <p>In a nail-biting match that went to extra time, the team defeated their opponents 2-1, with the winning goal scored in the 118th minute by team captain Alex Rodriguez.</p>
      
      <h2>Historic Achievement</h2>
      
      <p>"This is a historic moment for our country's football," said the national team coach. "The players showed incredible determination and skill throughout the qualifying campaign, and they deserve this success."</p>
      
      <p>The qualification is particularly significant given the team's rebuilding phase over the past four years, with many young players being integrated into the squad.</p>
      
      <h2>Preparation Plans</h2>
      
      <p>With the World Cup scheduled to begin in November, the team's management has already outlined preparation plans, including friendly matches against top-ranked teams and specialized training camps.</p>
      
      <p>The Football Federation has also announced increased funding to ensure the team has access to the best facilities and support staff during their World Cup campaign.</p>
    `,
    category: "Sports",
    categorySlug: "sports",
    imageUrl: "/placeholder.svg?height=400&width=800",
    author: "David Martinez",
    date: "March 17, 2025",
    views: 7845,
  },
  {
    id: "6",
    title: "New Tax Regulations to Take Effect Next Quarter",
    slug: "new-tax-regulations",
    excerpt:
      "The government has announced new tax regulations that will take effect at the beginning of the next fiscal quarter, impacting both individuals and businesses.",
    content: `
      <p>The government has announced new tax regulations that will take effect at the beginning of the next fiscal quarter, impacting both individuals and businesses across the country.</p>
      
      <p>The changes, which were approved by parliament last month after extensive debate, include adjustments to income tax brackets, new deductions for certain types of investments, and modified corporate tax rates.</p>
      
      <h2>Individual Tax Changes</h2>
      
      <p>"These reforms are designed to make our tax system more progressive while encouraging savings and investment," stated the Minister of Finance. "The average middle-income family will see a modest reduction in their tax burden."</p>
      
      <p>Key changes for individual taxpayers include:</p>
      
      <ul>
        <li>Expansion of the lowest tax bracket, reducing taxes for lower-income earners</li>
        <li>New deductions for education expenses and retirement savings</li>
        <li>Increased child tax credits for families</li>
      </ul>
      
      <h2>Business Taxation</h2>
      
      <p>For businesses, the new regulations introduce a tiered corporate tax structure based on company size and revenue, with small businesses receiving more favorable rates to encourage entrepreneurship and growth.</p>
      
      <p>Additionally, enhanced tax incentives will be available for companies investing in research and development, renewable energy, and job creation in economically disadvantaged regions.</p>
    `,
    category: "Economy",
    categorySlug: "economy",
    imageUrl: "/placeholder.svg?height=400&width=800",
    author: "Robert Kim",
    date: "March 16, 2025",
    views: 5128,
  },
  {
    id: "7",
    title: "Tech Innovation Summit Draws Global Attention",
    slug: "tech-innovation-summit",
    excerpt:
      "The annual Tech Innovation Summit has attracted record attendance this year, with industry leaders showcasing cutting-edge technologies and discussing future trends.",
    content: `
      <p>The annual Tech Innovation Summit has attracted record attendance this year, with industry leaders showcasing cutting-edge technologies and discussing future trends that will shape the digital landscape.</p>
      
      <p>Held in the capital city's convention center, the three-day event features keynote speeches, panel discussions, product demonstrations, and networking opportunities for technology professionals, investors, and enthusiasts.</p>
      
      <h2>Emerging Technologies</h2>
      
      <p>"We're witnessing an unprecedented pace of technological change," noted the summit's keynote speaker, the CEO of a leading global tech company. "From artificial intelligence to quantum computing, the innovations being developed today will fundamentally transform how we live and work."</p>
      
      <p>Among the most discussed technologies at this year's summit are:</p>
      
      <ul>
        <li>Advanced AI systems capable of complex reasoning and creativity</li>
        <li>Practical applications of quantum computing in medicine and materials science</li>
        <li>Next-generation renewable energy storage solutions</li>
        <li>Immersive augmented reality platforms for education and training</li>
      </ul>
      
      <h2>Local Tech Ecosystem</h2>
      
      <p>The summit also highlighted the growing importance of the local technology sector, with several homegrown startups presenting their innovations alongside international tech giants.</p>
      
      <p>Government officials used the occasion to announce new initiatives to support the technology ecosystem, including increased funding for STEM education, tax incentives for tech startups, and infrastructure improvements to support digital businesses.</p>
    `,
    category: "Bloggers",
    categorySlug: "bloggers",
    imageUrl: "/placeholder.svg?height=400&width=800",
    author: "Lisa Park",
    date: "March 15, 2025",
    views: 4567,
  },
  {
    id: "8",
    title: "Healthcare Reform Bill Passes First Reading",
    slug: "healthcare-reform-bill",
    excerpt:
      "The comprehensive healthcare reform bill has passed its first reading in parliament, marking a significant step toward overhauling the national healthcare system.",
    content: `
      <p>The comprehensive healthcare reform bill has passed its first reading in parliament, marking a significant step toward overhauling the national healthcare system to improve access, quality, and affordability.</p>
      
      <p>The bill, which has been in development for over two years with input from medical professionals, patient advocacy groups, and policy experts, received support from a majority of lawmakers despite some opposition.</p>
      
      <h2>Key Provisions</h2>
      
      <p>"This legislation represents a balanced approach to addressing the challenges in our healthcare system," said the Minister of Health. "It maintains what works well while implementing necessary changes to ensure everyone has access to quality care."</p>
      
      <p>Major components of the reform include:</p>
      
      <ul>
        <li>Expansion of insurance coverage to include previously excluded treatments</li>
        <li>Reduction of patient co-payments for essential medications</li>
        <li>Increased funding for rural healthcare facilities</li>
        <li>New incentives to address physician shortages in underserved areas</li>
        <li>Modernization of healthcare IT systems to improve coordination of care</li>
      </ul>
      
      <h2>Next Steps</h2>
      
      <p>The bill will now proceed to committee review, where lawmakers will examine it in detail and potentially propose amendments before the second reading.</p>
      
      <p>If passed in its final form, the reforms would be implemented gradually over a three-year period, with the first changes taking effect approximately six months after final approval.</p>
    `,
    category: "Video",
    categorySlug: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=wCfewUTI6oY", // Example YouTube link
    author: "Thomas Wilson",
    date: "March 14, 2025",
    views: 3982,
  },
  {
    id: "9",
    title: "Famous Actor to Star in Upcoming Historical Drama",
    slug: "actor-historical-drama",
    excerpt:
      "Award-winning actor James Anderson has been cast as the lead in an upcoming historical drama about the founding of the nation, set to begin production next month.",
    content: `
      <p>Award-winning actor James Anderson has been cast as the lead in an upcoming historical drama about the founding of the nation, set to begin production next month.</p>
      
      <p>The film, titled "Foundation," will depict the pivotal events and figures involved in the country's struggle for independence and the establishment of its democratic institutions.</p>
      
      <h2>Production Details</h2>
      
      <p>"This is a story that deserves to be told with authenticity and respect for historical accuracy," Anderson stated in a press release. "I'm honored to portray such a significant figure in our nation's history."</p>
      
      <p>The production has assembled an impressive team, including:</p>
      
      <ul>
        <li>Award-winning director Elena Rodriguez</li>
        <li>Screenplay by renowned historical writer Benjamin Taylor</li>
        <li>Cinematography by three-time Oscar nominee Christopher Lee</li>
        <li>A supporting cast featuring several acclaimed actors</li>
      </ul>
      
      <h2>Historical Consultation</h2>
      
      <p>To ensure historical accuracy, the production has engaged a team of historians as consultants, including professors from leading universities and experts from the National Historical Society.</p>
      
      <p>Filming will take place at actual historical locations where possible, supplemented by meticulously designed sets for scenes where the original settings no longer exist or are unsuitable for filming.</p>
    `,
    category: "Entertainment",
    categorySlug: "entertainment",
    imageUrl: "/placeholder.svg?height=400&width=800",
    author: "Jennifer Lopez",
    date: "March 13, 2025",
    views: 5621,
  },
  {
    id: "10",
    title: "Scientists Discover Potential Breakthrough in Cancer Research",
    slug: "cancer-research-breakthrough",
    excerpt:
      "A team of researchers has announced a potential breakthrough in cancer treatment, identifying a novel mechanism that could lead to more effective therapies for aggressive forms of the disease.",
    content: `
      <p>A team of researchers has announced a potential breakthrough in cancer treatment, identifying a novel mechanism that could lead to more effective therapies for aggressive forms of the disease.</p>
      
      <p>The discovery, published in a leading medical journal, involves a previously unknown cellular pathway that cancer cells use to evade the immune system and resist conventional treatments.</p>
      
      <h2>Research Findings</h2>
      
      <p>"This discovery opens up entirely new possibilities for cancer treatment," explained the lead researcher, Dr. Maria Chen. "By targeting this specific pathway, we may be able to make existing therapies more effective and develop new approaches for cancers that currently have limited treatment options."</p>
      
      <p>The research team identified a protein that plays a crucial role in this pathway and has already developed experimental compounds that can inhibit its function, showing promising results in laboratory studies.</p>
      
      <h2>Clinical Implications</h2>
      
      <p>While the findings are still at an early stage, medical experts not involved in the study have described the discovery as potentially significant.</p>
      
      <p>"If these results can be translated to clinical applications, it could represent a meaningful advance in how we treat certain aggressive cancers," commented the director of a national cancer research institute.</p>
      
      <p>The research team is now preparing for pre-clinical trials to further validate their findings and assess the safety and efficacy of the experimental compounds before potential human trials.</p>
    `,
    category: "Health",
    categorySlug: "health",
    imageUrl: "/placeholder.svg?height=400&width=800",
    author: "Dr. James Wilson",
    date: "March 12, 2025",
    views: 4328,
  },
];

// Database operations
export const getArticles = () => articles;

export const getFeaturedArticles = () =>
  articles.filter((article) => article.featured);

export const getArticleById = (id: string) =>
  articles.find((article) => article.id === id);

export const getArticleBySlug = (slug: string) =>
  articles.find((article) => article.slug === slug);

export const getArticlesByCategory = (categorySlug: string) =>
  articles.filter((article) => article.categorySlug === categorySlug);

export const searchArticles = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return articles.filter(
    (article) =>
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.excerpt.toLowerCase().includes(lowercaseQuery) ||
      article.content.toLowerCase().includes(lowercaseQuery) ||
      article.category.toLowerCase().includes(lowercaseQuery)
  );
};

export const getCategories = () => categories;

export const getCategoryBySlug = (slug: string) =>
  categories.find((category) => category.slug === slug);
