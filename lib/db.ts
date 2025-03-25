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
  { id: "4", name: "Other", slug: "other", count: 37, color: "orange" },
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
    slug: "erchim-huchnii-reform",
    excerpt:
      "Эрчим хүчний тухай хуульд эрчим хүч гэдгийг цахилгаан, дулаан үйлдвэрлэх зориулалтаар ашиглаж болох бүх төрлийн түлш, сэргээгдэх болон бусад эх үүсвэрийг болон түүнийг ашиглан хэрэглэгчийн хэрэгцээнд зориулан үйлдвэрлэсэн цахилгаан, дулааны талаар",
    content: `
      <p>Эрчим хүчний тухай хуульд эрчим хүч гэдгийг цахилгаан, дулаан үйлдвэрлэх зориулалтаар ашиглаж болох бүх төрлийн түлш, сэргээгдэх болон бусад эх үүсвэрийг болон түүнийг ашиглан хэрэглэгчийн хэрэгцээнд зориулан үйлдвэрлэсэн цахилгаан, дулаан, шугам сүлжээгээр дамжуулан хэрэглэгчид түгээх метаны хийг хэлнэ хэмээн заасан байдаг.</p>
      <p>Гэтэл иргэд нь ч гэлтгүй төр нь ч гэсэн эрчим хүч гэдгээр зөвхөн цахилгааны асуудлыг ойлгодог бололтой. Учир нь, Засгийн газар эрчим хүчний реформ хийнэ гэчхээд зөвхөн цахилгааны үнэд зохицуулалт хийж, дулааны үнэ дээр нүдээ аниад өнгөрлөө.</p>
    `,
    category: "Politics",
    categorySlug: "politics",
    imageUrl: "/medeenii_cover1.jpg",
    author: "Б.Гантуяа",
    date: "2024-03-20",
    views: 6837,
    featured: true,
  },
  {
    id: "2",
    title: "Монгол Улсын эдийн засгийн өсөлт 2024 онд 5.4 хувь байна",
    slug: "mongol-ulsiin-ediin-zasgiin-usult",
    excerpt:
      "Дэлхийн банкнаас Монгол Улсын эдийн засгийн өсөлтийг 2024 онд 5.4 хувь байна гэж таамаглаж байна. Энэ нь өмнөх жилийн өсөлтөөс 0.8 пунктээр өндөр үзүүлэлт юм.",
    content: `
      <p>Дэлхийн банкнаас Монгол Улсын эдийн засгийн өсөлтийг 2024 онд 5.4 хувь байна гэж таамаглаж байна. Энэ нь өмнөх жилийн өсөлтөөс 0.8 пунктээр өндөр үзүүлэлт юм.</p>
      <h2>Өсөлтийн гол хөдөлгөгч хүчин зүйлс</h2>
      <ul>
        <li>Уул уурхайн салбарын өсөлт</li>
        <li>Хятад улсын эдийн засгийн сэргэлт</li>
        <li>Гадаадын шууд хөрөнгө оруулалтын өсөлт</li>
      </ul>
      <p>Гэвч инфляцийн дарамт, гадаад өрийн асуудал зэрэг сорилтууд байсаар байна.</p>
    `,
    category: "Economy",
    categorySlug: "economy",
    imageUrl: "/medeenii_cover1.jpg",
    author: "Д.Болормаа",
    date: "2024-03-21",
    views: 5242,
  },
  {
    id: "3",
    title: "Оюу Толгойн экспортын орлого 40 хувиар өсчээ",
    slug: "oyu-tolgoi-export-revenue",
    excerpt:
      "Оюу Толгой компанийн 2024 оны эхний улирлын экспортын орлого өмнөх оны мөн үеэс 40 хувиар өсч, 1.2 тэрбум ам.долларт хүрлээ.",
    content: `
      <p>Оюу Толгой компанийн 2024 оны эхний улирлын экспортын орлого өмнөх оны мөн үеэс 40 хувиар өсч, 1.2 тэрбум ам.долларт хүрлээ. Энэ нь гүний уурхайн бүтээн байгуулалт дууссантай холбоотой юм.</p>
      <h2>Үндсэн үзүүлэлтүүд</h2>
      <ul>
        <li>Зэсийн баяжмалын үйлдвэрлэл 30% өссөн</li>
        <li>Алтны агуулга өмнөх оноос 2 дахин нэмэгдсэн</li>
        <li>Ажилчдын тоо 20% өссөн</li>
      </ul>
      <p>Энэхүү өсөлт нь Монгол Улсын ДНБ-д эерэгээр нөлөөлөх төлөвтэй байна.</p>
    `,
    category: "Economy",
    categorySlug: "economy",
    imageUrl: "/medeenii_cover1.jpg",
    author: "Б.Батбаяр",
    date: "2024-03-19",
    views: 6200,
  },
  {
    id: "4",
    title: "Монголын хөрөнгийн зах зээлийн үнэлгээ түүхэн дээд түвшинд хүрлээ",
    slug: "mongolian-stock-market-peak",
    excerpt:
      "Монголын хөрөнгийн биржийн зах зээлийн нийт үнэлгээ анх удаа 5 их наяд төгрөгийг давж, шинэ түүхэн амжилт тогтоолоо.",
    content: `
      <p>Монголын хөрөнгийн биржийн зах зээлийн нийт үнэлгээ анх удаа 5 их наяд төгрөгийг давж, шинэ түүхэн амжилт тогтоолоо. Энэ нь сүүлийн 3 жилийн хугацаанд 2 дахин өссөн үзүүлэлт юм.</p>
      <h2>Өсөлтийн гол шалтгаанууд</h2>
      <ul>
        <li>Хөрөнгө оруулагчдын тоо нэмэгдсэн</li>
        <li>Компаниудын санхүүгийн үзүүлэлт сайжирсан</li>
        <li>Гадаадын хөрөнгө оруулалт нэмэгдсэн</li>
      </ul>
    `,
    category: "Economy",
    categorySlug: "economy",
    imageUrl: "/medeenii_cover1.jpg",
    author: "Г.Золбоо",
    date: "2024-03-18",
    views: 4832,
  },
  {
    id: "5",
    title: "Монголын эдийн засагт нөлөөлж буй 5 том эрсдэл",
    slug: "mongolian-economy-risks",
    excerpt:
      "Монгол Улсын эдийн засагт тулгарч буй гол эрсдэлүүд болон тэдгээрийг даван туулах арга замуудын талаарх дүн шинжилгээ.",
    content: `
      <p>Монгол Улсын эдийн засагт тулгарч буй гол эрсдэлүүд болон тэдгээрийг даван туулах арга замуудын талаарх дүн шинжилгээг танилцуулж байна.</p>
      <h2>Тулгамдсан асуудлууд</h2>
      <ul>
        <li>Гадаад өрийн дарамт</li>
        <li>Инфляцийн өсөлт</li>
        <li>Валютын ханшийн хэлбэлзэл</li>
        <li>Уул уурхайн хэт хамаарал</li>
        <li>Дэд бүтцийн хөгжил удаашралтай</li>
      </ul>
    `,
    category: "Economy",
    categorySlug: "economy",
    imageUrl: "/medeenii_cover1.jpg",
    author: "Д.Ганбат",
    date: "2024-03-17",
    views: 7845,
  },
  {
    id: "6",
    title: "Монголын технологийн салбарын ирээдүй",
    slug: "mongolian-tech-future",
    excerpt:
      "Монголын технологийн салбарын хөгжил, стартап экосистем, болон дижитал шилжилтийн талаарх дүн шинжилгээ.",
    content: `
      <p>Монголын технологийн салбар сүүлийн жилүүдэд эрчимтэй хөгжиж байна. Стартап компаниуд олноор бий болж, гадаадын хөрөнгө оруулагчдын анхаарлыг татаж эхэллээ.</p>
      <h2>Гол чиг хандлагууд</h2>
      <ul>
        <li>Финтек салбарын өсөлт</li>
        <li>Хиймэл оюун ухааны хэрэглээ</li>
        <li>Дижитал шилжилт</li>
      </ul>
      <p>Цаашид энэ салбар улам хурдацтай хөгжих хандлагатай байна.</p>
    `,
    category: "Bloggers",
    categorySlug: "bloggers",
    imageUrl: "/medeenii_cover1.jpg",
    author: "Б.Төгөлдөр",
    date: "2024-03-16",
    views: 5128,
  },
  {
    id: "7",
    title: "Монголын залуу үеийнхний санхүүгийн боловсрол",
    slug: "youth-financial-education",
    excerpt:
      "Монголын залуучуудын санхүүгийн боловсрол, хуримтлал, хөрөнгө оруулалтын талаарх судалгаа ба дүгнэлт.",
    content: `
      <p>Монголын залуучуудын дунд явуулсан судалгаагаар тэдний 70 хувь нь санхүүгийн боловсролоо дээшлүүлэх хэрэгцээ байгааг илэрхийлжээ.</p>
      <h2>Гол асуудлууд</h2>
      <ul>
        <li>Санхүүгийн мэдлэг дутмаг</li>
        <li>Хуримтлал багатай</li>
        <li>Зээлийн хэт хамаарал</li>
      </ul>
      <p>Энэ асуудлыг шийдвэрлэхэд боловсролын систем чухал үүрэг гүйцэтгэнэ.</p>
    `,
    category: "Bloggers",
    categorySlug: "bloggers",
    imageUrl: "/medeenii_cover1.jpg",
    author: "С.Билгүүн",
    date: "2024-03-15",
    views: 4567,
  },
  {
    id: "8",
    title: "Монголын бизнес эрхлэгч эмэгтэйчүүд",
    slug: "mongolian-women-entrepreneurs",
    excerpt:
      "Монголын бизнес эрхлэгч эмэгтэйчүүдийн амжилтын түүх, тулгарч буй бэрхшээл, ба ирээдүйн боломжууд.",
    content: `
      <p>Монголын бизнес эрхлэгч эмэгтэйчүүдийн тоо жил бүр өсөж байна. Тэд эдийн засгийн өсөлтөд чухал хувь нэмэр оруулж байна.</p>
      <h2>Амжилтын түлхүүр</h2>
      <ul>
        <li>Тууштай байдал</li>
        <li>Инноваци</li>
        <li>Сүлжээ холбоо</li>
      </ul>
      <p>Тэдний туршлага бусдад сургамж болж чадна.</p>
    `,
    category: "Bloggers",
    categorySlug: "bloggers",
    imageUrl: "/medeenii_cover1.jpg",
    author: "О.Сарангэрэл",
    date: "2024-03-14",
    views: 3982,
  },
  {
    id: "10",
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
    id: "11",
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
    id: "12",
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
    id: "15",
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
    id: "16",
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
    id: "17",
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

export const getArticlesByCategory = (categorySlug: string) => {
  if (categorySlug === "other") {
    return articles.filter(
      (article) =>
        article.categorySlug === "other" ||
        article.categorySlug === "sports" ||
        article.categorySlug === "research"
    );
  }
  return articles.filter((article) => article.categorySlug === categorySlug);
};

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
