// Comprehensive Career Tracks, Company Tiers, Timelines, Tech Stacks & Milestone Blueprints

export const CAREER_TRACKS = [
  {
    id: "sde",
    roleName: "Software Developer",
    label: "SDE & Product Engineer",
    icon: "💻",
    tag: "Core Coding & DSA",
    salary: "14 - 36 LPA",
    targetCompanies: "Google, Microsoft, Amazon, Adobe, Atlassian",
    description: "Master C++/Java, Advanced Data Structures, System Design, and Scalable Backend architecture for top tech product firms.",
    primaryStack: "C++ / Java, Spring Boot, MySQL, System Design",
    focusPillars: ["technical", "projects", "aptitude", "interview"],
    color: "#6D5BD0",
    badge: "Most Popular",
  },
  {
    id: "fullstack",
    roleName: "Full Stack Developer",
    label: "Full Stack Web (MERN / Next.js)",
    icon: "🌐",
    tag: "Web & Microservices",
    salary: "10 - 28 LPA",
    targetCompanies: "Swiggy, Razorpay, Zepto, CRED, Freshworks",
    description: "Build robust, responsive web applications from modern React frontend to Node/Express REST APIs and PostgreSQL/MongoDB.",
    primaryStack: "React, Node.js, Express, MongoDB/Postgres, TypeScript",
    focusPillars: ["technical", "projects", "resume", "interview"],
    color: "#4FC9A8",
    badge: "High Demand",
  },
  {
    id: "aiml",
    roleName: "AI/ML Engineer",
    label: "AI & Machine Learning Engineer",
    icon: "🤖",
    tag: "Deep Learning & LLMs",
    salary: "15 - 40 LPA",
    targetCompanies: "NVIDIA, Google DeepMind, OpenAI, Fractal, MathCo",
    description: "Explore mathematics for AI, train classical & deep learning neural networks, deploy LLMs with RAG, and master MLOps.",
    primaryStack: "Python, PyTorch, Scikit-learn, LangChain, FastAPI",
    focusPillars: ["technical", "projects", "aptitude", "interview"],
    color: "#8B7CF6",
    badge: "Future Ready",
  },
  {
    id: "datascience",
    roleName: "Data Scientist",
    label: "Data Science & Big Data",
    icon: "📊",
    tag: "Analytics & ML",
    salary: "10 - 24 LPA",
    targetCompanies: "Mu Sigma, Tiger Analytics, LatentView, Walmart, Target",
    description: "Harness complex SQL queries, statistical hypothesis testing, data visualization in PowerBI/Tableau, and predictive ML models.",
    primaryStack: "Python, SQL, Pandas, Tableau/PowerBI, Scikit-Learn",
    focusPillars: ["technical", "aptitude", "projects", "interview"],
    color: "#5CA8F2",
    badge: "Data Driven",
  },
  {
    id: "cloud",
    roleName: "Cloud Engineer",
    label: "Cloud, DevOps & SRE",
    icon: "☁️",
    tag: "AWS & Kubernetes",
    salary: "10 - 26 LPA",
    targetCompanies: "Amazon AWS, Red Hat, Cisco, VMware, Cognizant Cloud",
    description: "Automate containerized deployments with Docker & Kubernetes, build CI/CD pipelines, and provision cloud infra using Terraform.",
    primaryStack: "AWS, Docker, Kubernetes, Linux, Terraform, GitHub Actions",
    focusPillars: ["technical", "projects", "interview"],
    color: "#7C93F0",
    badge: "Infrastructure",
  },
  {
    id: "masshiring",
    roleName: "IT Services / Mass Hiring Track",
    label: "Campus Drive & Mass Hiring",
    icon: "🏢",
    tag: "TCS, Infosys, Cognizant, Wipro",
    salary: "4.5 - 10 LPA",
    targetCompanies: "TCS Digital/Ninja, Infosys DSE, Cognizant, Wipro, Accenture",
    description: "Accelerate your campus placement preparation with quantitative speed math, reasoning puzzles, verbal English, and core coding drills.",
    primaryStack: "C / Java, Quant Aptitude, Logical Reasoning, SQL, OOPs",
    focusPillars: ["aptitude", "technical", "communication", "interview"],
    color: "#5847B8",
    badge: "Drive Ready",
  },
  {
    id: "cybersecurity",
    roleName: "Cybersecurity",
    label: "Cybersecurity & InfoSec",
    icon: "🛡️",
    tag: "Ethical Hacking & Defense",
    salary: "9 - 22 LPA",
    targetCompanies: "Palo Alto, Fortinet, QuickHeal, EY, Deloitte Cyber",
    description: "Learn network defense, OWASP Web Security, penetration testing, cryptography, and security operations incident response.",
    primaryStack: "Kali Linux, Wireshark, Burp Suite, Python, SIEM",
    focusPillars: ["technical", "projects", "interview"],
    color: "#F5A6C9",
    badge: "Security",
  },
  {
    id: "uiux",
    roleName: "UI/UX Designer",
    label: "UI/UX & Product Design",
    icon: "🎨",
    tag: "Figma & Interaction",
    salary: "8 - 20 LPA",
    targetCompanies: "Zomato, CRED, Razorpay, Flipkart, ThoughtWorks",
    description: "Master user research, wireframing, design systems in Figma, interactive micro-prototyping, and portfolio case studies.",
    primaryStack: "Figma, Design Systems, User Research, Prototyping",
    focusPillars: ["projects", "resume", "communication", "interview"],
    color: "#F5B27A",
    badge: "Creative",
  },
  {
    id: "mobile",
    roleName: "Mobile App Developer",
    label: "Mobile Apps (Flutter / React Native)",
    icon: "📱",
    tag: "Cross-Platform Mobile",
    salary: "9 - 22 LPA",
    targetCompanies: "Jio, Paytm, Ola, MakeMyTrip, Dream11",
    description: "Craft cross-platform mobile apps for iOS & Android with state management, clean architecture, and offline SQLite/Firebase sync.",
    primaryStack: "Flutter, Dart, React Native, Firebase, REST APIs",
    focusPillars: ["technical", "projects", "interview"],
    color: "#4FC9A8",
    badge: "Mobile",
  },
];

export const COMPANY_TIERS = [
  { id: "tier1", label: "Tier 1 Product Companies", sub: "Google, Microsoft, Amazon, Adobe, Atlassian", ctc: "15 - 45 LPA", icon: "🏆", desc: "Rigorous DSA, System Design, Low Level Design & CS Core" },
  { id: "startups", label: "High-Growth Unicorn Startups", sub: "Swiggy, Razorpay, Zepto, CRED, Meesho", ctc: "12 - 25 LPA", icon: "🚀", desc: "Hands-on Full-Stack, System Architecture & High Execution Speed" },
  { id: "fintech", label: "Global FinTech & Investment Banks", sub: "Goldman Sachs, Morgan Stanley, JP Morgan", ctc: "15 - 32 LPA", icon: "🏦", desc: "Quant Aptitude, Low-Latency, C++/Java, Concurrency & DB Internals" },
  { id: "mass", label: "IT Services & Mass Recruiters", sub: "TCS Digital/Ninja, Infosys DSE, Cognizant, Wipro", ctc: "4.5 - 10 LPA", icon: "🏢", desc: "Quantitative Aptitude, Logical Reasoning, Foundation Coding & SQL" },
  { id: "remote", label: "Global Remote & Open Source", sub: "Global Tech Startups, Web3, US/EU Remote", ctc: "$35k - $90k", icon: "🌍", desc: "Production Projects, GitHub Contribution PRs & Modern Frameworks" },
];

export const PREP_TIMELINES = [
  { id: "30days", label: "30-Day Sprint", sub: "Fast-track emergency prep for immediate campus drive", icon: "⚡", days: 30 },
  { id: "60days", label: "60-Day Crash Course", sub: "Targeted high-yield daily practice for mid-term placements", icon: "🎯", days: 60 },
  { id: "90days", label: "90-Day Standard", sub: "Balanced comprehensive mastery across coding, aptitude & mock drives (Recommended)", icon: "🚀", days: 90 },
  { id: "180days", label: "180-Day Deep Dive", sub: "Comprehensive preparation starting from 3rd or final year", icon: "🏆", days: 180 },
  { id: "1year", label: "1-Year Foundation", sub: "End-to-end semester journey starting from 2nd/3rd year", icon: "📅", days: 365 },
];

export const WEEKLY_HOURS = [
  { id: "5h", label: "5 - 8 Hours / Week", sub: "Light & flexible — balancing college exams and laboratory sessions" },
  { id: "15h", label: "12 - 16 Hours / Week", sub: "Recommended — 2 hours daily focused placement routine" },
  { id: "25h", label: "25+ Hours / Week", sub: "Intensive — Placement bootcamp mode targeting top-tier packages" },
];

export const TECH_STACKS = [
  { id: "mern", label: "MERN Stack", tech: "React, Node.js, Express, MongoDB, TypeScript", icon: "🌐" },
  { id: "java", label: "Java Enterprise", tech: "Core Java, Spring Boot, Microservices, PostgreSQL", icon: "☕" },
  { id: "python_ai", label: "Python & AI Stack", tech: "Python, PyTorch, Scikit-learn, Pandas, LangChain", icon: "🐍" },
  { id: "cpp_dsa", label: "C++ & Advanced DSA", tech: "C++, STL, Dynamic Programming, System Design", icon: "⚙️" },
  { id: "cloud_devops", label: "Cloud & DevOps", tech: "Docker, Kubernetes, AWS, Terraform, CI/CD", icon: "☁️" },
  { id: "flutter", label: "Mobile Apps", tech: "Flutter, Dart, Firebase, Clean Architecture", icon: "📱" },
];

export const DEGREE_PROGRAMS = ["B.E / B.Tech", "BCA / B.Sc (CS/IT)", "M.E / M.Tech", "MCA", "Other"];
export const PASSOUT_YEARS = ["2025", "2026", "2027", "2028"];

export const CORE_FOCUS_AREAS = [
  { id: "technical", label: "Technical Coding & DSA", icon: "Code2", desc: "LeetCode medium/hard, problem solving, algorithms" },
  { id: "aptitude", label: "Quantitative & Logical Aptitude", icon: "Calculator", desc: "Speed math, puzzles, time & work, data interpretation" },
  { id: "projects", label: "Full Stack / Capstone Projects", icon: "BookOpen", desc: "Live production apps with auth, database & deployment" },
  { id: "communication", label: "Communication & GD", icon: "MessageSquare", desc: "Group discussions, English fluency, technical pitches" },
  { id: "resume", label: "ATS Resume & GitHub Portfolio", icon: "FileText", desc: "Keyword optimization, quantifiable bullet points, LinkedIn" },
  { id: "interview", label: "Mock Interviews & HR Rounds", icon: "Mic", desc: "STAR format responses, technical whiteboard drills" },
];

/* ==================== TRACK-SPECIFIC ROADMAP MILESTONES ==================== */
export const TRACK_MILESTONES = {
  sde: [
    { id: "start", title: "Career Launchpad", desc: "Diagnostic evaluation & target tier setup.", cats: [], duration: "Day 1",
      subtasks: [
        { id: "st1", text: "Choose primary language (C++ / Java / Python)", done: true },
        { id: "st2", text: "Setup LeetCode & GitHub profile tracking", done: true },
      ]
    },
    { id: "prog_core", title: "Language Proficiency & OOPs", desc: "Pointers, memory management, classes, interfaces & STL/Collections.", cats: ["technical"], duration: "Week 1 - 2",
      subtasks: [
        { id: "st1", text: "Master OOPs pillars: Encapsulation, Inheritance, Polymorphism, Abstraction", done: true },
        { id: "st2", text: "Practice STL / Java Collections (Vectors, HashMaps, Sets, PriorityQueue)", done: true },
        { id: "st3", text: "Understand memory stack vs heap and garbage collection", done: false },
      ]
    },
    { id: "linear_dsa", title: "Linear Data Structures", desc: "Master Arrays, Strings, Two Pointers, Linked Lists, Stacks & Queues.", cats: ["technical"], subset: ["Data Structures"], duration: "Week 3 - 4",
      subtasks: [
        { id: "st1", text: "Solve 20 Array & String interview questions (Kadane, Sliding Window)", done: true },
        { id: "st2", text: "Implement Singly & Doubly Linked List with reversal drills", done: true },
        { id: "st3", text: "Solve Next Greater Element & Parentheses matching using Stacks", done: false },
      ]
    },
    { id: "trees_graphs", title: "Non-Linear DSA: Trees & Graphs", desc: "Binary Trees, BST, DFS, BFS, Dijkstra, and Topological Sort.", cats: ["technical"], subset: ["Algorithms"], duration: "Week 5 - 6",
      subtasks: [
        { id: "st1", text: "Binary Tree traversals (Inorder, Preorder, Level Order, Zigzag)", done: false },
        { id: "st2", text: "BST validation, LCA, and balanced tree checks", done: false },
        { id: "st3", text: "Graph representations, BFS/DFS traversal and cycle detection", done: false },
      ]
    },
    { id: "dp_algo", title: "Dynamic Programming & Greedy", desc: "Memoization, Tabulation, Knapsack, LCS, and Interval scheduling.", cats: ["technical"], subset: ["Algorithms"], duration: "Week 7 - 8",
      subtasks: [
        { id: "st1", text: "1D DP: Climbing Stairs, House Robber, Coin Change", done: false },
        { id: "st2", text: "2D DP: 0/1 Knapsack, Longest Common Subsequence", done: false },
        { id: "st3", text: "Greedy: Activity Selection & Minimum Platforms", done: false },
      ]
    },
    { id: "cs_core", title: "CS Core Fundamentals", desc: "Operating Systems, DBMS, SQL, and Computer Networks.", cats: ["technical"], subset: ["SQL"], duration: "Week 9 - 10",
      subtasks: [
        { id: "st1", text: "OS: Process vs Thread, Deadlocks, Paging, Virtual Memory", done: false },
        { id: "st2", text: "DBMS: Normalization, ACID properties, Indexing, Transactions", done: false },
        { id: "st3", text: "Networks: TCP vs UDP, HTTP/HTTPS, DNS, OSI 7-layer model", done: false },
      ]
    },
    { id: "system_design", title: "System Design Foundations", desc: "Low-Level Design (LLD), SOLID principles & Design Patterns.", cats: ["technical"], duration: "Week 11",
      subtasks: [
        { id: "st1", text: "Apply SOLID principles to code refactoring exercises", done: false },
        { id: "st2", text: "Implement Singleton, Factory, and Observer design patterns", done: false },
        { id: "st3", text: "Design Parking Lot or URL Shortener high-level architecture", done: false },
      ]
    },
    { id: "portfolio_proj", title: "Scalable Capstone Project", desc: "Production-ready backend / full stack app with database and auth.", cats: ["projects"], duration: "Week 12",
      subtasks: [
        { id: "st1", text: "Build RESTful APIs with database indexing & authentication", done: false },
        { id: "st2", text: "Write clean documentation, API testing with Postman, and deploy live", done: false },
      ]
    },
    { id: "aptitude_comm", title: "Aptitude & Speed Math Drills", desc: "Quant, logical reasoning, and verbal readiness for campus screening rounds.", cats: ["aptitude","communication"], duration: "Week 13",
      subtasks: [
        { id: "st1", text: "Time & Work, Speed Distance, Profit & Loss formulas", done: false },
        { id: "st2", text: "Syllogisms, Blood Relations, and Data Sufficiency", done: false },
      ]
    },
    { id: "interview_round", title: "Mock Technical & HR Rounds", desc: "ATS resume polish, behavioral STAR responses, and live mock drills.", cats: ["resume","interview"], duration: "Week 14",
      subtasks: [
        { id: "st1", text: "Tailor ATS resume with quantifiable metrics and GitHub links", done: false },
        { id: "st2", text: "Conduct 2 mock coding interviews with timed pressure", done: false },
        { id: "st3", text: "Prepare 5 STAR stories for HR behavioral rounds", done: false },
      ]
    },
    { id: "placementready", title: "Placement Ready", desc: "Congratulations! You are calibrated for Tier-1 Product & SDE roles. 🎯", cats: [], overall: true, duration: "Goal Achieved",
      subtasks: [
        { id: "st1", text: "Pass full placement readiness assessment with 85%+ score", done: false },
      ]
    },
  ],

  fullstack: [
    { id: "start", title: "Full Stack Pathway Launch", desc: "Web stack environment setup & development tooling.", cats: [], duration: "Day 1",
      subtasks: [
        { id: "st1", text: "Setup VS Code, Node.js, Git, and Chrome DevTools", done: true },
        { id: "st2", text: "Clone starter repository and practice Git branch workflows", done: true },
      ]
    },
    { id: "web_foundations", title: "Modern Web Foundations", desc: "Semantic HTML5, CSS3, Flexbox, CSS Grid, and responsive UI.", cats: ["technical"], subset: ["HTML/CSS"], duration: "Week 1 - 2",
      subtasks: [
        { id: "st1", text: "Build responsive multi-column layouts with Flexbox & CSS Grid", done: true },
        { id: "st2", text: "Implement CSS custom properties and dark mode theme switching", done: true },
      ]
    },
    { id: "js_mastery", title: "Modern JavaScript Deep Dive", desc: "ES6+, Promises, Async/Await, Fetch API, and DOM Manipulation.", cats: ["technical"], subset: ["JavaScript"], duration: "Week 3 - 4",
      subtasks: [
        { id: "st1", text: "Closures, Prototypes, Event Loop & Microtask Queue", done: true },
        { id: "st2", text: "Fetch API, Error handling with try/catch, and LocalStorage", done: false },
      ]
    },
    { id: "frontend_framework", title: "Frontend Architecture: React", desc: "Component hierarchy, Hooks, State management, and Client Routing.", cats: ["technical"], duration: "Week 5 - 6",
      subtasks: [
        { id: "st1", text: "Master useState, useEffect, useMemo, useCallback, and useRef", done: false },
        { id: "st2", text: "Build modular UI components and form validation", done: false },
      ]
    },
    { id: "backend_api", title: "Backend APIs: Node & Express", desc: "RESTful API design, Middleware, JWT Authentication, and Security.", cats: ["technical"], duration: "Week 7 - 8",
      subtasks: [
        { id: "st1", text: "Design CRUD REST endpoints with Express router", done: false },
        { id: "st2", text: "Implement JWT auth, bcrypt password hashing, and CORS protection", done: false },
      ]
    },
    { id: "databases", title: "Databases: PostgreSQL & MongoDB", desc: "Schema design, relational joins, indexing, and Mongoose/Prisma ORM.", cats: ["technical"], subset: ["SQL"], duration: "Week 9 - 10",
      subtasks: [
        { id: "st1", text: "Design normalized SQL relational schemas and write JOIN queries", done: false },
        { id: "st2", text: "Build MongoDB document models with aggregation pipelines", done: false },
      ]
    },
    { id: "capstone_saas", title: "Full Stack Capstone SaaS Project", desc: "Production application with live database, auth, and stateful UX.", cats: ["projects"], duration: "Week 11 - 12",
      subtasks: [
        { id: "st1", text: "Integrate React frontend with Express backend and database", done: false },
        { id: "st2", text: "Deploy frontend on Vercel and backend on Render / AWS", done: false },
      ]
    },
    { id: "dsa_aptitude", title: "DSA & Problem Solving for Web", desc: "Essential DSA algorithms and aptitude drills for technical screening.", cats: ["aptitude","technical"], duration: "Week 13",
      subtasks: [
        { id: "st1", text: "Solve top 30 Array, Hashmap, and String coding questions", done: false },
        { id: "st2", text: "Practice numerical ability and company aptitude patterns", done: false },
      ]
    },
    { id: "interview_prep", title: "Resume, GitHub & Full Stack Mock", desc: "Live project demo rehearsals, system architecture explanations, and HR.", cats: ["resume","interview"], duration: "Week 14",
      subtasks: [
        { id: "st1", text: "Record 2-minute elevator pitch and live project walkthrough", done: false },
        { id: "st2", text: "Complete mock technical interview covering web fundamentals", done: false },
      ]
    },
    { id: "placementready", title: "Placement Ready", desc: "Ready for high-growth tech firms & Full Stack SDE drives! 🎯", cats: [], overall: true, duration: "Goal Achieved",
      subtasks: [
        { id: "st1", text: "Attain 85%+ readiness score across all categories", done: false },
      ]
    },
  ],

  aiml: [
    { id: "start", title: "AI/ML Track Kickoff", desc: "Python scientific computing environment and math setup.", cats: [], duration: "Day 1",
      subtasks: [
        { id: "st1", text: "Setup Anaconda / Jupyter Notebook & PyTorch GPU environment", done: true },
      ]
    },
    { id: "math_python", title: "Math for AI & NumPy", desc: "Linear algebra, matrix calculus, statistics, probability, and vectorized NumPy.", cats: ["technical"], subset: ["Python"], duration: "Week 1 - 2",
      subtasks: [
        { id: "st1", text: "Matrix multiplications, eigenvalues, dot products, and vectorization", done: true },
        { id: "st2", text: "Probability distributions, Bayes theorem, and statistical metrics", done: true },
      ]
    },
    { id: "data_wrangling", title: "Data Wrangling & Feature Engineering", desc: "Pandas dataframes, missing value imputation, outlier filtering, and Seaborn visualization.", cats: ["technical"], duration: "Week 3 - 4",
      subtasks: [
        { id: "st1", text: "Perform exploratory data analysis (EDA) on real-world datasets", done: false },
        { id: "st2", text: "Encode categorical variables and apply standard/min-max scalers", done: false },
      ]
    },
    { id: "classical_ml", title: "Classical Machine Learning", desc: "Scikit-Learn: Regression, Logistic, SVM, Decision Trees, and Random Forests.", cats: ["technical"], duration: "Week 5 - 6",
      subtasks: [
        { id: "st1", text: "Train classification models and evaluate Precision, Recall, F1, ROC-AUC", done: false },
        { id: "st2", text: "Apply cross-validation, hyperparameter grid search, and regularization", done: false },
      ]
    },
    { id: "deep_learning", title: "Deep Learning & PyTorch", desc: "Feedforward Neural Networks, Backpropagation, CNNs for Vision, and Optimizers.", cats: ["technical"], duration: "Week 7 - 8",
      subtasks: [
        { id: "st1", text: "Implement neural network forward & backward passes in PyTorch", done: false },
        { id: "st2", text: "Train Convolutional Neural Network (CNN) on image classification", done: false },
      ]
    },
    { id: "nlp_llms", title: "NLP, Transformers & GenAI", desc: "Tokenization, Hugging Face, Attention mechanisms, RAG, and LangChain.", cats: ["technical"], duration: "Week 9 - 10",
      subtasks: [
        { id: "st1", text: "Fine-tune or prompt Hugging Face transformer models", done: false },
        { id: "st2", text: "Build a Retrieval-Augmented Generation (RAG) system with vector store", done: false },
      ]
    },
    { id: "ai_project", title: "Production AI Capstone", desc: "Deploy trained AI model with FastAPI backend and Streamlit/React UI.", cats: ["projects"], duration: "Week 11 - 12",
      subtasks: [
        { id: "st1", text: "Containerize model inference pipeline with Docker", done: false },
        { id: "st2", text: "Host live interactive demo on Hugging Face Spaces or AWS", done: false },
      ]
    },
    { id: "math_dsa", title: "DSA & Analytical Aptitude", desc: "Problem solving in Python, computational complexity, and quant logic.", cats: ["aptitude","technical"], duration: "Week 13",
      subtasks: [
        { id: "st1", text: "Solve 25 Python algorithmic problems (Arrays, Hashmaps, Graphs)", done: false },
        { id: "st2", text: "Practice quantitative aptitude and probability questions", done: false },
      ]
    },
    { id: "ai_interviews", title: "AI Technical & Case Interviews", desc: "Explain model math, trade-offs, loss functions, and ML system design.", cats: ["resume","interview"], duration: "Week 14",
      subtasks: [
        { id: "st1", text: "Prepare mathematical proofs for Gradient Descent and Cross-Entropy", done: false },
        { id: "st2", text: "Conduct mock ML system design interview (e.g. Recommendation Feed)", done: false },
      ]
    },
    { id: "placementready", title: "Placement Ready", desc: "Calibrated for AI/ML Engineer & Data Science roles! 🎯", cats: [], overall: true, duration: "Goal Achieved",
      subtasks: [
        { id: "st1", text: "Complete all AI modules with 85%+ readiness score", done: false },
      ]
    },
  ],

  datascience: [
    { id: "start", title: "Data Science Onboarding", desc: "Environment setup with SQL Workbench, Python & Jupyter.", cats: [], duration: "Day 1",
      subtasks: [{ id: "st1", text: "Setup MySQL / PostgreSQL local instance and Jupyter", done: true }]
    },
    { id: "sql_advanced", title: "Advanced SQL for Analytics", desc: "Window functions, CTEs, self-joins, aggregations, and subqueries.", cats: ["technical"], subset: ["SQL"], duration: "Week 1 - 3",
      subtasks: [
        { id: "st1", text: "Master ROW_NUMBER(), RANK(), DENSE_RANK(), and LEAD/LAG", done: true },
        { id: "st2", text: "Write complex analytical queries on multi-million row datasets", done: false },
      ]
    },
    { id: "python_analytics", title: "Python Data Analysis (Pandas)", desc: "GroupBy operations, pivot tables, merging datasets, and cleaning.", cats: ["technical"], subset: ["Python"], duration: "Week 4 - 6",
      subtasks: [
        { id: "st1", text: "Clean real-world messy CSV/JSON datasets with Pandas", done: false },
        { id: "st2", text: "Create actionable exploratory charts with Seaborn and Matplotlib", done: false },
      ]
    },
    { id: "bi_dashboards", title: "BI & Dashboarding (Tableau/PowerBI)", desc: "KPI cards, drill-downs, DAX expressions, and executive dashboards.", cats: ["technical"], duration: "Week 7 - 8",
      subtasks: [
        { id: "st1", text: "Build an interactive sales/marketing KPI dashboard", done: false },
      ]
    },
    { id: "stats_testing", title: "Statistical Inference & A/B Testing", desc: "Hypothesis testing, T-tests, ANOVA, Chi-square, and Confidence intervals.", cats: ["aptitude"], duration: "Week 9 - 10",
      subtasks: [
        { id: "st1", text: "Design and evaluate an A/B test experiment with P-values", done: false },
      ]
    },
    { id: "ml_predictive", title: "Predictive Analytics & Modeling", desc: "Churn prediction, customer segmentation, and regression forecasting.", cats: ["projects"], duration: "Week 11 - 12",
      subtasks: [
        { id: "st1", text: "Build end-to-end customer churn prediction pipeline", done: false },
      ]
    },
    { id: "aptitude_drills", title: "Quant Aptitude & Guesstimates", desc: "Market sizing, business problem solving, and logical drills.", cats: ["aptitude"], duration: "Week 13",
      subtasks: [
        { id: "st1", text: "Solve 10 business case guesstimates under time constraints", done: false },
      ]
    },
    { id: "interview_drills", title: "Live SQL Tests & Case Interview", desc: "Live coding SQL problems on HackerRank / LeetCode and HR rounds.", cats: ["resume","interview"], duration: "Week 14",
      subtasks: [
        { id: "st1", text: "Solve 20 Medium SQL questions on LeetCode", done: false },
      ]
    },
    { id: "placementready", title: "Placement Ready", desc: "Ready for Data Scientist & Business Analyst campus drives! 🎯", cats: [], overall: true, duration: "Goal Achieved",
      subtasks: [{ id: "st1", text: "Attain 85%+ readiness score across SQL, Analytics & Stats", done: false }]
    },
  ],

  cloud: [
    { id: "start", title: "Cloud & DevOps Foundation", desc: "Linux shell, SSH keys, and version control setup.", cats: [], duration: "Day 1",
      subtasks: [{ id: "st1", text: "Install Ubuntu WSL or Linux VM and configure Git SSH keys", done: true }]
    },
    { id: "linux_scripting", title: "Linux Administration & Bash", desc: "File systems, permissions, process monitoring, systemd, and cron.", cats: ["technical"], duration: "Week 1 - 2",
      subtasks: [
        { id: "st1", text: "Write Bash automation scripts for server log rotation & backups", done: true },
        { id: "st2", text: "Master networking commands: curl, netstat, iptables, traceroute", done: false },
      ]
    },
    { id: "docker_containers", title: "Docker & Containerization", desc: "Container lifecycle, Dockerfile best practices, networks, and compose.", cats: ["technical"], duration: "Week 3 - 4",
      subtasks: [
        { id: "st1", text: "Write multi-stage Dockerfiles to minimize image footprint", done: false },
        { id: "st2", text: "Orchestrate multi-container app with Docker Compose", done: false },
      ]
    },
    { id: "cloud_aws", title: "AWS Core Infrastructure", desc: "EC2, S3, IAM policies, VPC subnetting, security groups, and RDS.", cats: ["technical"], duration: "Week 5 - 7",
      subtasks: [
        { id: "st1", text: "Configure secure custom VPC with public and private subnets", done: false },
        { id: "st2", text: "Deploy web application on EC2 behind an Application Load Balancer", done: false },
      ]
    },
    { id: "kubernetes", title: "Kubernetes Orchestration", desc: "Pods, ReplicaSets, Deployments, Services, Ingress, and ConfigMaps.", cats: ["technical"], duration: "Week 8 - 10",
      subtasks: [
        { id: "st1", text: "Deploy rolling update microservice deployment on Minikube / K8s", done: false },
      ]
    },
    { id: "cicd_iac", title: "CI/CD & Terraform (IaC)", desc: "GitHub Actions automated pipelines, Terraform infrastructure provisioning.", cats: ["projects"], duration: "Week 11 - 12",
      subtasks: [
        { id: "st1", text: "Build automated GitHub Actions CI/CD pipeline with unit test runs", done: false },
        { id: "st2", text: "Provision AWS resources declaratively using Terraform code", done: false },
      ]
    },
    { id: "aptitude_core", title: "Aptitude & Core CS for Cloud", desc: "Operating systems, networking protocols, and quantitative logic.", cats: ["aptitude"], duration: "Week 13",
      subtasks: [
        { id: "st1", text: "Practice network subnetting and campus aptitude sets", done: false },
      ]
    },
    { id: "cloud_interview", title: "DevOps Mock Interviews", desc: "Incident troubleshooting, architecture whiteboard, and STAR HR round.", cats: ["resume","interview"], duration: "Week 14",
      subtasks: [
        { id: "st1", text: "Prepare incident post-mortem walkthroughs and resume highlights", done: false },
      ]
    },
    { id: "placementready", title: "Placement Ready", desc: "Calibrated for Cloud Engineer & SRE placement roles! 🎯", cats: [], overall: true, duration: "Goal Achieved",
      subtasks: [{ id: "st1", text: "Pass cloud readiness criteria with 85%+ score", done: false }]
    },
  ],

  masshiring: [
    { id: "start", title: "Campus Recruitment Drive Launch", desc: "Overview of TCS Digital/Ninja, Infosys DSE, and Cognizant drive patterns.", cats: [], duration: "Day 1",
      subtasks: [
        { id: "st1", text: "Review syllabus and previous year questions for targeted drives", done: true },
      ]
    },
    { id: "quant_math", title: "Quantitative Aptitude Mastery", desc: "Time & Work, Speed Distance, Percentages, Ratios, Profit & Loss.", cats: ["aptitude"], duration: "Week 1 - 3",
      subtasks: [
        { id: "st1", text: "Master shortcut formulas for Time & Work and Pipes & Cisterns", done: true },
        { id: "st2", text: "Practice Speed, Time & Distance problems (Trains, Boats)", done: true },
        { id: "st3", text: "Solve 50 Profit, Loss, Discount, and Simple/Compound Interest drills", done: false },
      ]
    },
    { id: "logical_reasoning", title: "Logical Reasoning & Puzzles", desc: "Coding-Decoding, Blood Relations, Seating Arrangement, and Syllogisms.", cats: ["aptitude"], duration: "Week 4 - 5",
      subtasks: [
        { id: "st1", text: "Solve Linear & Circular Seating Arrangement puzzles", done: false },
        { id: "st2", text: "Practice Syllogisms (Venn Diagrams) and Direction Sense tests", done: false },
      ]
    },
    { id: "verbal_english", title: "Verbal Ability & Professional English", desc: "Reading Comprehension, Sentence Correction, Vocabulary, and Parajumbles.", cats: ["communication"], duration: "Week 6 - 7",
      subtasks: [
        { id: "st1", text: "Grammar rules: Subject-Verb Agreement, Prepositions, Tenses", done: false },
        { id: "st2", text: "Practice 15 Reading Comprehension speed-reading passages", done: false },
      ]
    },
    { id: "coding_foundations", title: "Core Programming in C/Java/Python", desc: "Data types, Loops, Pattern printing, Strings, and Array manipulations.", cats: ["technical"], duration: "Week 8 - 9",
      subtasks: [
        { id: "st1", text: "Solve 30 foundational coding problems (Prime, Fibonacci, Palindrome)", done: false },
        { id: "st2", text: "String manipulation drills (Anagrams, Vowels, Substrings)", done: false },
      ]
    },
    { id: "oops_sql", title: "OOPs & Basic SQL Queries", desc: "Inheritance, Polymorphism, Encapsulation, SELECT, JOINs, and GROUP BY.", cats: ["technical"], subset: ["SQL"], duration: "Week 10 - 11",
      subtasks: [
        { id: "st1", text: "Explain OOPs concepts with real-world examples", done: false },
        { id: "st2", text: "Write essential SQL queries for database interviews", done: false },
      ]
    },
    { id: "company_mock_tests", title: "Timed Company Mock Tests", desc: "Full-length timed simulation tests replicating TCS, Infosys & Wipro rounds.", cats: ["aptitude","technical"], duration: "Week 12 - 13",
      subtasks: [
        { id: "st1", text: "Take 3 full-length timed mock tests with strict timer", done: false },
      ]
    },
    { id: "hr_interview", title: "HR Interview & Self-Introduction", desc: "Personal pitch, college project explanation, strengths/weaknesses.", cats: ["resume","interview"], duration: "Week 14",
      subtasks: [
        { id: "st1", text: "Craft confident 90-second self-introduction", done: false },
        { id: "st2", text: "Prepare answers for 'Why should we hire you?' and relocation queries", done: false },
      ]
    },
    { id: "placementready", title: "Placement Ready", desc: "Calibrated for Mass Hiring & IT Services campus drives! 🎯", cats: [], overall: true, duration: "Goal Achieved",
      subtasks: [
        { id: "st1", text: "Attain 85%+ readiness score across Aptitude & Technical", done: false },
      ]
    },
  ],

  cybersecurity: [
    { id: "start", title: "Cybersecurity Pathway Kickoff", desc: "Ethics, lab setup, and virtualization environment.", cats: [], duration: "Day 1",
      subtasks: [{ id: "st1", text: "Set up Kali Linux VM and basic terminal tooling", done: true }]
    },
    { id: "network_security", title: "Networking & Protocol Defense", desc: "TCP/IP handshake, DNS, Wireshark packet capture, and subnet security.", cats: ["technical"], duration: "Week 1 - 3",
      subtasks: [
        { id: "st1", text: "Analyze packet traces in Wireshark for cleartext credentials", done: true },
      ]
    },
    { id: "web_security", title: "Web App Security & OWASP Top 10", desc: "SQL Injection, Cross-Site Scripting (XSS), CSRF, and Burp Suite testing.", cats: ["technical"], duration: "Week 4 - 6",
      subtasks: [
        { id: "st1", text: "Identify and remediate SQLi and XSS vulnerabilities on DVWA", done: false },
      ]
    },
    { id: "defensive_ops", title: "Defensive Operations & Cryptography", desc: "Firewalls, IDS/IPS, symmetric/asymmetric encryption, and SIEM logs.", cats: ["technical"], duration: "Week 7 - 9",
      subtasks: [
        { id: "st1", text: "Implement RSA encryption & decryption in Python", done: false },
      ]
    },
    { id: "security_projects", title: "Security Capstone & CTF Drills", desc: "TryHackMe / HackTheBox rooms and security incident documentation.", cats: ["projects"], duration: "Week 10 - 12",
      subtasks: [
        { id: "st1", text: "Complete 10 TryHackMe rooms and write detailed incident writeups", done: false },
      ]
    },
    { id: "interview_readiness", title: "Security Mock Interviews", desc: "Incident triage questions, port number quizzes, and behavioral HR rounds.", cats: ["interview"], duration: "Week 13 - 14",
      subtasks: [
        { id: "st1", text: "Practice rapid security triage mock interview scenarios", done: false },
      ]
    },
    { id: "placementready", title: "Placement Ready", desc: "Calibrated for Cybersecurity Analyst & SOC roles! 🎯", cats: [], overall: true, duration: "Goal Achieved",
      subtasks: [{ id: "st1", text: "Achieve 85%+ security readiness benchmark", done: false }]
    },
  ],

  uiux: [
    { id: "start", title: "UI/UX Pathway Launch", desc: "Design fundamentals, UX principles, and Figma setup.", cats: [], duration: "Day 1",
      subtasks: [{ id: "st1", text: "Install Figma and explore component libraries & plugins", done: true }]
    },
    { id: "user_research", title: "User Research & Personas", desc: "Empathy maps, user interviews, journey maps, and problem framing.", cats: ["projects"], duration: "Week 1 - 3",
      subtasks: [
        { id: "st1", text: "Conduct user interviews and create 2 distinct student personas", done: true },
      ]
    },
    { id: "wireframing_ia", title: "Information Architecture & Wireframes", desc: "Card sorting, site maps, low-fidelity paper and digital wireframes.", cats: ["projects"], duration: "Week 4 - 6",
      subtasks: [
        { id: "st1", text: "Create low-fidelity wireframes for a campus placement tracking app", done: false },
      ]
    },
    { id: "figma_systems", title: "Visual Design & Figma Systems", desc: "Color palettes, typography hierarchies, auto-layout, and tokens.", cats: ["projects"], duration: "Week 7 - 9",
      subtasks: [
        { id: "st1", text: "Build a complete scalable design system in Figma with tokens", done: false },
      ]
    },
    { id: "prototyping_portfolio", title: "High-Fidelity Prototypes & Case Study", desc: "Interactive smart animations, usability testing, and Behance portfolio.", cats: ["resume","projects"], duration: "Week 10 - 12",
      subtasks: [
        { id: "st1", text: "Publish in-depth case study on Behance or personal portfolio", done: false },
      ]
    },
    { id: "design_critique", title: "Design Critiques & Mock Interviews", desc: "Whiteboard design challenges, portfolio defense, and design rationale.", cats: ["communication","interview"], duration: "Week 13 - 14",
      subtasks: [
        { id: "st1", text: "Present design portfolio defense in 15-minute mock interview", done: false },
      ]
    },
    { id: "placementready", title: "Placement Ready", desc: "Calibrated for Product Designer & UI/UX roles! 🎯", cats: [], overall: true, duration: "Goal Achieved",
      subtasks: [{ id: "st1", text: "Attain 85%+ portfolio and design readiness score", done: false }]
    },
  ],

  mobile: [
    { id: "start", title: "Mobile App Pathway Setup", desc: "Flutter SDK, Dart environment, Android Studio & emulator setup.", cats: [], duration: "Day 1",
      subtasks: [{ id: "st1", text: "Setup Flutter doctor and run Hello World on emulator", done: true }]
    },
    { id: "dart_mastery", title: "Dart Language Fundamentals", desc: "OOP in Dart, null safety, async/await, Streams, and collections.", cats: ["technical"], duration: "Week 1 - 2",
      subtasks: [
        { id: "st1", text: "Master Dart null safety and collection methods", done: true },
      ]
    },
    { id: "flutter_widgets", title: "Flutter Widgets & UI Layouts", desc: "Stateless vs Stateful, Custom Painters, Responsive LayoutBuilder.", cats: ["technical"], duration: "Week 3 - 5",
      subtasks: [
        { id: "st1", text: "Build responsive cross-platform UI with clean widget composition", done: false },
      ]
    },
    { id: "state_management", title: "State Management & Architecture", desc: "Riverpod / Provider / BLoC, Dependency Injection, and Repository pattern.", cats: ["technical"], duration: "Week 6 - 8",
      subtasks: [
        { id: "st1", text: "Implement Riverpod or BLoC state management in practical app", done: false },
      ]
    },
    { id: "mobile_backend", title: "Firebase & REST API Integration", desc: "Authentication, Firestore database, Push notifications, and offline caching.", cats: ["projects"], duration: "Week 9 - 11",
      subtasks: [
        { id: "st1", text: "Build full mobile app with Firebase Auth, Cloud Firestore & Push notifications", done: false },
      ]
    },
    { id: "mobile_interviews", title: "Mobile Capstone & Placement Prep", desc: "App Store / Play Store bundle generation, mobile performance, and mock HR.", cats: ["resume","interview"], duration: "Week 12 - 14",
      subtasks: [
        { id: "st1", text: "Prepare mobile architectural explanation and interview drills", done: false },
      ]
    },
    { id: "placementready", title: "Placement Ready", desc: "Calibrated for Mobile App Developer roles! 🎯", cats: [], overall: true, duration: "Goal Achieved",
      subtasks: [{ id: "st1", text: "Attain 85%+ readiness score across mobile & problem solving", done: false }]
    },
  ],
};

// Helper to resolve the correct track key for a role
export function getTrackKeyForRole(roleName) {
  if (!roleName) return "sde";
  const r = roleName.toLowerCase();
  if (r.includes("full stack")) return "fullstack";
  if (r.includes("ai") || r.includes("machine learning") || r.includes("ml")) return "aiml";
  if (r.includes("data scientist") || r.includes("data analyst") || r.includes("data")) return "datascience";
  if (r.includes("cloud") || r.includes("devops") || r.includes("sre")) return "cloud";
  if (r.includes("cyber") || r.includes("security")) return "cybersecurity";
  if (r.includes("ui") || r.includes("ux") || r.includes("design")) return "uiux";
  if (r.includes("mobile") || r.includes("flutter") || r.includes("android") || r.includes("ios")) return "mobile";
  if (r.includes("mass") || r.includes("tcs") || r.includes("infosys") || r.includes("it services")) return "masshiring";
  return "sde";
}

// Retrieve milestones for the active track with custom milestones inserted
export function getTrackMilestones(roleName, customMilestones = []) {
  const key = getTrackKeyForRole(roleName);
  const base = TRACK_MILESTONES[key] || TRACK_MILESTONES.sde;
  if (!customMilestones || customMilestones.length === 0) return base;

  // Insert custom milestones right before the final 'placementready' milestone
  const finalIdx = base.findIndex(m => m.id === "placementready");
  if (finalIdx === -1) return [...base, ...customMilestones];
  return [
    ...base.slice(0, finalIdx),
    ...customMilestones,
    base[finalIdx],
  ];
}

// 3 Curated Persona profiles for 1-Click Instant Demo Login
export const DEMO_PERSONAS = {
  sivaranjani: {
    key: "sivaranjani",
    name: "Sivaranjani K",
    email: "sivaranjani@annauniv.edu",
    college: "Anna University Regional Campus, Tirunelveli",
    degree: "B.E / B.Tech",
    department: "Computer Science & Engineering",
    year: "Final Year",
    targetRole: "Software Developer",
    targetCompanyTier: "tier1",
    pace: "90days",
    weeklyHours: "15h",
    primaryStack: "cpp_dsa",
    focusAreas: ["technical", "projects", "aptitude", "interview"],
    level: "Advanced",
    avatarColor: "#8B7CF6",
    tagline: "SDE Track · Final Year · Anna Univ",
  },
  arun: {
    key: "arun",
    name: "Arun Kumar M",
    email: "arun.ai@psgtech.edu",
    college: "PSG College of Technology, Coimbatore",
    degree: "B.Tech",
    department: "AI & Data Science",
    year: "3rd Year",
    targetRole: "AI/ML Engineer",
    targetCompanyTier: "startups",
    pace: "180days",
    weeklyHours: "25h",
    primaryStack: "python_ai",
    focusAreas: ["technical", "projects", "interview"],
    level: "Intermediate",
    avatarColor: "#4FC9A8",
    tagline: "AI / ML Engineer · 3rd Year · PSG Tech",
  },
  priya: {
    key: "priya",
    name: "Priya Dharshini",
    email: "priya.web@mitindia.edu",
    college: "Madras Institute of Technology (MIT), Chennai",
    degree: "B.E",
    department: "Information Technology",
    year: "2nd Year",
    targetRole: "Full Stack Developer",
    targetCompanyTier: "tier1",
    pace: "90days",
    weeklyHours: "15h",
    primaryStack: "mern",
    focusAreas: ["technical", "projects", "resume", "interview"],
    level: "Intermediate",
    avatarColor: "#7C93F0",
    tagline: "Full Stack Web · 2nd Year · MIT",
  },
};
