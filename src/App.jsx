import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  LayoutDashboard, Map as MapIcon, ListChecks, BarChart3, Gauge, Trophy, History as HistoryIcon,
  User as UserIcon, Settings as SettingsIcon, Bell, Moon, Sun, Search, Plus, Trash2, Edit2, Check,
  X, ChevronRight, ChevronLeft, Flame, Target, CheckCircle2, Award, Download, LogOut,
  Sparkles, GraduationCap, BookOpen, Code2, Calculator, MessageSquare, FileText, Mic,
  TrendingUp, Lock, Circle, Star, Menu, ArrowRight, RotateCcw, Filter, ChevronDown, Eye, EyeOff,
  Briefcase, Layers, Compass, Clock, Zap, Building2, Sliders, Calendar, Globe, Cpu, ShieldCheck, CheckSquare,
  Play, ExternalLink, HelpCircle, Video, Youtube, AlertTriangle, Mail
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, PieChart, Pie, Cell, Legend
} from "recharts";
import {
  CAREER_TRACKS, COMPANY_TIERS, PREP_TIMELINES, WEEKLY_HOURS, TECH_STACKS,
  DEGREE_PROGRAMS, PASSOUT_YEARS, CORE_FOCUS_AREAS, TRACK_MILESTONES,
  getTrackKeyForRole, getTrackMilestones, DEMO_PERSONAS
} from "./roadmapData.js";
import { getTopicContent, getCourseMasterclass } from "./courseContentData.js";

/* ============================== DESIGN TOKENS (PROFESSIONAL TECH SUITE) ============================== */
const T = {
  // Primary Brand: Professional Tech Blue / Enterprise Cobalt (Stripe / Linear / Vercel)
  violet: "#2563EB",       // Blue-600: Authoritative primary accent & buttons
  lavender: "#3B82F6",     // Blue-500: Crisp interactive blue
  periwinkle: "#60A5FA",   // Blue-400: Clean accent & gradients
  violetDeep: "#1D4ED8",   // Blue-700: Deep corporate navy

  // Semantic Accents: High-clarity, professional tones
  mint: "#059669",         // Emerald-600: Verified mastery, completed items
  peach: "#D97706",        // Amber-600: In-progress items, study streaks
  blush: "#E11D48",        // Rose-600: Critical alerts, priority flags
  babyBlue: "#0284C7",     // Sky-600: Analytics, projects, roadmap highlights

  // High-Grade Neutrals (Executive SaaS Canvas)
  bg: "#F8FAFC",           // Slate-50: Crisp, clean light canvas (no pastel tint)
  bgAlt: "#F1F5F9",        // Slate-100: Secondary card surface / controls
  bgCard: "#FFFFFF",       // Pristine White

  // High-Contrast Typography
  ink: "#0F172A",          // Slate-900: High-contrast, sharp corporate text
  inkSoft: "#475569",      // Slate-600: Legible secondary text & descriptions
  inkFaint: "#94A3B8",     // Slate-400: Refined placeholders & tertiary captions

  // Architectural Borders
  border: "rgba(226, 232, 240, 0.95)",
};

const DARK = {
  // Primary Brand in Dark Mode
  violet: "#3B82F6",       // Blue-500
  lavender: "#60A5FA",     // Blue-400
  periwinkle: "#93C5FD",   // Blue-300
  violetDeep: "#2563EB",   // Blue-600

  // Semantic Accents
  mint: "#10B981",         // Emerald-500
  peach: "#F59E0B",        // Amber-500
  blush: "#F43F5E",        // Rose-500
  babyBlue: "#38BDF8",     // Sky-400

  // Modern Obsidian Canvas (Linear / Vercel style)
  bg: "#0B0F19",           // Obsidian Slate
  bgAlt: "#111827",        // Gray-900
  bgCard: "#1E293B",       // Slate-800

  // High-Contrast Typography in Dark
  ink: "#F8FAFC",          // Slate-50
  inkSoft: "#CBD5E1",      // Slate-300
  inkFaint: "#64748B",     // Slate-500

  border: "rgba(51, 65, 85, 0.7)",
};

const FONT_HEAD = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const FONT_BODY = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

const CATEGORY_META = {
  technical:     { label: "Technical Skills",   weight: 25, grad: ["#2563EB", "#60A5FA"], icon: Code2 },
  aptitude:      { label: "Aptitude",            weight: 15, grad: ["#0284C7", "#059669"], icon: Calculator },
  projects:      { label: "Projects",            weight: 15, grad: ["#059669", "#10B981"], icon: BookOpen },
  communication: { label: "Communication",       weight: 10, grad: ["#D97706", "#F59E0B"], icon: MessageSquare },
  resume:        { label: "Resume",              weight: 10, grad: ["#F59E0B", "#D97706"], icon: FileText },
  interview:     { label: "Interview Prep",      weight: 15, grad: ["#2563EB", "#4F46E5"], icon: Mic },
};
const CONSISTENCY_WEIGHT = 10;
const CATEGORY_ORDER = ["technical","aptitude","projects","communication","resume","interview"];

const ROLES = CAREER_TRACKS.map(t => t.roleName);
const FOCUS_AREAS = [
  { id: "technical", label: "Technical Skills" }, { id: "aptitude", label: "Aptitude" },
  { id: "projects", label: "Projects" }, { id: "communication", label: "Communication" },
  { id: "resume", label: "Resume" }, { id: "interview", label: "Interview Preparation" },
];
const LEVELS = ["Beginner","Intermediate","Advanced"];

const MILESTONES = TRACK_MILESTONES.sde;

const ACHIEVEMENT_DEFS = [
  { id: "streak7", label: "7 Day Streak", icon: "🔥", desc: "Kept the momentum for a full week." },
  { id: "firstMilestone", label: "First Milestone", icon: "🎯", desc: "Completed your first roadmap milestone." },
  { id: "taskCrusher", label: "Task Crusher", icon: "📚", desc: "Completed 20 preparation tasks." },
  { id: "skillMaster", label: "Skill Master", icon: "💻", desc: "Took a skill all the way to 100%." },
  { id: "interviewReady", label: "Interview Ready", icon: "🚀", desc: "Reached Interview Ready status." },
  { id: "streak30", label: "30 Day Streak", icon: "🔥", desc: "A full month of daily consistency." },
  { id: "careerChampion", label: "Career Champion", icon: "🏆", desc: "Completed every milestone on the roadmap." },
];

const STORAGE_KEY = "careerly_data_v2";

/* ============================== SEED DATA ============================== */
// Each skill (a "course") is organized into modules of topics. Topic status is
// 'pending' | 'in-progress' | 'done'. Progress % is always derived from actual
// completed topics — never a static number.
const DIFFICULTY_BY_MODULE = ["Beginner","Beginner","Intermediate","Intermediate","Advanced","Advanced"];
const TIME_BY_MODULE = [20, 25, 30, 35, 45, 45];

function buildModules(mods) {
  return mods.map((m, mi) => ({
    id: `m${mi}`,
    title: m.title,
    topics: m.topics.map((name, ti) => ({
      id: `m${mi}_t${ti}`,
      name,
      status: "pending",
      desc: `Understand the core ideas behind ${name} and practice applying them through short exercises.`,
      time: TIME_BY_MODULE[Math.min(mi, TIME_BY_MODULE.length-1)],
      difficulty: DIFFICULTY_BY_MODULE[Math.min(mi, DIFFICULTY_BY_MODULE.length-1)],
    })),
  }));
}
function flatTopics(skill) { return skill.modules.flatMap(m => m.topics); }

const SKILL_DEFS = {
  technical: [
    { id: "java", name: "Java", icon: "☕", desc: "Master Java fundamentals for placements and interviews.",
      modules: [
        { title: "Java Fundamentals", topics: ["Introduction to Java","Variables & Data Types","Operators","Conditional Statements","Loops"] },
        { title: "Object-Oriented Programming", topics: ["Classes & Objects","Encapsulation","Inheritance","Polymorphism","Abstraction","Interfaces"] },
        { title: "Collections & Exception Handling", topics: ["Exception Handling","ArrayList","HashMap","HashSet","Iterators"] },
        { title: "Advanced Java", topics: ["File Handling","Multithreading","Streams","Lambda Expressions","Java Interview Questions"] },
      ] },
    { id: "python", name: "Python", icon: "🐍", desc: "Build a strong Python foundation for scripting and interviews.",
      modules: [
        { title: "Python Basics", topics: ["Basics","Variables","Conditions","Loops"] },
        { title: "Functions & Data Structures", topics: ["Functions","Lists","Tuples","Sets","Dictionaries"] },
        { title: "OOP & Modules", topics: ["OOP","Modules","File Handling","Exception Handling"] },
        { title: "Applied Python", topics: ["Libraries","Interview Problems"] },
      ] },
    { id: "cpp", name: "C++", icon: "⚙️", desc: "Strengthen C++ fundamentals, OOP and STL for coding rounds.",
      modules: [
        { title: "C++ Fundamentals", topics: ["Syntax & Pointers","Variables & Data Types","Operators","Control Flow"] },
        { title: "OOP in C++", topics: ["Classes & Objects","Inheritance","Polymorphism","Encapsulation"] },
        { title: "STL & Memory", topics: ["STL Containers","Iterators & Algorithms","Memory Management","Smart Pointers"] },
      ] },
    { id: "js", name: "JavaScript", icon: "🟨", desc: "Learn modern JavaScript for interactive, dynamic web apps.",
      modules: [
        { title: "Core JavaScript", topics: ["Variables","Functions","Arrays","Objects"] },
        { title: "Browser & DOM", topics: ["DOM","Events","LocalStorage"] },
        { title: "Modern JavaScript", topics: ["ES6+","Modules"] },
        { title: "Async JavaScript", topics: ["Async JavaScript","Promises","Fetch API"] },
      ] },
    { id: "htmlcss", name: "HTML & CSS", icon: "🎨", desc: "Craft semantic, responsive, accessible interfaces.",
      modules: [
        { title: "HTML Foundations", topics: ["HTML Basics","Semantic HTML","Forms","Tables"] },
        { title: "CSS Foundations", topics: ["CSS Basics","Box Model","Flexbox","Grid"] },
        { title: "Modern & Responsive", topics: ["Responsive Design","Animations","Accessibility"] },
      ] },
    { id: "sql", name: "SQL", icon: "🗄️", desc: "Query, join and manage relational databases with confidence.",
      modules: [
        { title: "Database Basics", topics: ["Database Basics","SELECT","WHERE","ORDER BY"] },
        { title: "Aggregation & Joins", topics: ["GROUP BY","JOINs","Subqueries"] },
        { title: "Advanced SQL", topics: ["Functions","Constraints","Indexes","Transactions"] },
      ] },
    { id: "ds", name: "Data Structures", icon: "🧩", desc: "Core data structures every placement drive tests.",
      modules: [
        { title: "Linear Structures", topics: ["Arrays","Strings","Linked Lists","Stacks","Queues"] },
        { title: "Non-linear Structures", topics: ["Hashing","Trees","Graphs"] },
      ] },
    { id: "algo", name: "Algorithms", icon: "🧠", desc: "Problem-solving techniques for coding interviews.",
      modules: [
        { title: "Core Techniques", topics: ["Recursion","Sorting","Searching"] },
        { title: "Advanced Techniques", topics: ["Dynamic Programming","Greedy Algorithms","Graph Algorithms"] },
      ] },
  ],
  aptitude: [
    { id: "quant", name: "Quantitative Aptitude", icon: "🔢", desc: "Speed and accuracy for numeric reasoning rounds.",
      modules: [
        { title: "Foundations", topics: ["Number Systems","Percentages","Profit & Loss","Ratio"] },
        { title: "Applied Quant", topics: ["Time & Work","Time & Distance","Probability","Permutations"] },
      ] },
    { id: "logical", name: "Logical Reasoning", icon: "🧭", desc: "Pattern recognition and structured problem solving.",
      modules: [{ title: "Pattern & Puzzles", topics: ["Series & Patterns","Puzzles & Arrangements","Blood Relations","Syllogisms"] }] },
    { id: "verbal", name: "Verbal Ability", icon: "🗣️", desc: "Reading, grammar and vocabulary for aptitude rounds.",
      modules: [{ title: "Language Skills", topics: ["Reading Comprehension","Grammar & Usage","Vocabulary","Sentence Correction"] }] },
  ],
  projects: [
    { id: "proj", name: "Projects", icon: "🚀", desc: "Ship a portfolio that proves what you can build.",
      modules: [{ title: "Build & Ship", topics: ["Portfolio Project #1","Portfolio Project #2","GitHub Profile Polish","Live Deployment","Project README & Docs"] }] },
  ],
  communication: [
    { id: "comm", name: "Communication", icon: "💬", desc: "Speak and write with clarity and confidence.",
      modules: [{ title: "Speaking & Writing", topics: ["Elevator Pitch","Group Discussion Practice","Mock Presentation","Email Etiquette","Public Speaking Session"] }] },
  ],
  resume: [
    { id: "res", name: "Resume", icon: "📄", desc: "Build a resume recruiters actually remember.",
      modules: [{ title: "Resume Building", topics: ["Draft Resume","Projects & Experience Section","Skills & Achievements Section","Peer/Mentor Review","Final Polish & PDF Export"] }] },
  ],
  interview: [
    { id: "int", name: "Interview Preparation", icon: "🎤", desc: "Walk into interviews prepared and confident.",
      modules: [{ title: "Interview Readiness", topics: ["HR Questions","Technical Questions","DSA Questions","Project Explanation","Behavioral Questions","Mock Interviews"] }] },
  ],
};

function seedSkills(targetPct) {
  const out = {};
  CATEGORY_ORDER.forEach((cat) => {
    out[cat] = SKILL_DEFS[cat].map((def) => {
      const modules = buildModules(def.modules);
      const all = flatTopics({ modules });
      const pct = targetPct[cat] ?? 50;
      const doneCount = Math.round((pct / 100) * all.length);
      all.forEach((t, i) => { t.status = i < doneCount ? "done" : "pending"; });
      return { id: def.id, name: def.name, icon: def.icon, desc: def.desc, modules };
    });
  });
  return out;
}

const TASK_TEMPLATES = [
  ["Solve 10 DSA problems","technical","High"],["Revise Java OOP concepts","technical","Medium"],
  ["Practice SQL join queries","technical","Medium"],["Build a REST API demo","technical","High"],
  ["Complete JavaScript async module","technical","Medium"],["Solve linked list problems","technical","High"],
  ["Practice CSS flexbox layouts","technical","Low"],["Revise sorting algorithms","technical","Medium"],
  ["Solve graph traversal problems","technical","High"],["Practice C++ STL problems","technical","Low"],
  ["Complete aptitude practice set","aptitude","High"],["Practice time & work problems","aptitude","Medium"],
  ["Solve logical puzzles","aptitude","Medium"],["Take a verbal ability quiz","aptitude","Low"],
  ["Practice permutation problems","aptitude","Medium"],["Attempt a full mock aptitude test","aptitude","High"],
  ["Update portfolio project README","projects","Medium"],["Deploy project to production","projects","High"],
  ["Add new feature to project #2","projects","Medium"],["Polish GitHub profile","projects","Low"],
  ["Write project case study","projects","Medium"],["Practice a 2-minute elevator pitch","communication","Medium"],
  ["Join a group discussion session","communication","High"],["Record a mock presentation","communication","Low"],
  ["Practice professional email writing","communication","Low"],["Rewrite resume summary","resume","Medium"],
  ["Add quantifiable achievements to resume","resume","High"],["Get resume reviewed by a mentor","resume","Medium"],
  ["Tailor resume to target role","resume","High"],["Practice 5 interview questions","interview","High"],
  ["Do a mock technical interview","interview","High"],["Prepare STAR-format answers","interview","Medium"],
];

function seedTasks() {
  const today = new Date();
  return TASK_TEMPLATES.map((tpl, i) => {
    const completed = i % 4 !== 3;
    const deadline = new Date(today); deadline.setDate(today.getDate() + ((i % 7) - 2));
    return {
      id: `task_${i}`, title: tpl[0], description: "", category: tpl[1], priority: tpl[2],
      status: completed ? "Completed" : (i % 8 === 0 ? "In Progress" : "Pending"),
      deadline: deadline.toISOString().slice(0,10),
      createdAt: new Date(today.getTime() - (32 - i) * 86400000).toISOString(),
      completedAt: completed ? new Date(today.getTime() - (32 - i) * 43200000).toISOString() : null,
    };
  });
}

function seedActivityHistory() {
  const days = [];
  const today = new Date();
  for (let i = 20; i >= 0; i--) {
    if (i === 15 || i === 16) continue; // small realistic gap before current streak
    const d = new Date(today); d.setDate(today.getDate() - i);
    days.push(d.toISOString().slice(0,10));
  }
  return days;
}

function defaultData(name = "Sivaranjani") {
  const today = new Date().toISOString().slice(0,10);
  return {
    onboarded: true,
    user: { name, email: "demo@careerly.app" },
    profile: { name, college: "Anna University Regional Campus, Tirunelveli", degree: "B.E / B.Tech", department: "CSE", year: "Final Year", avatarSeed: name },
    careerGoal: {
      targetRole: "Software Developer",
      targetCompanyTier: "tier1",
      pace: "90days",
      weeklyHours: "15h",
      primaryStack: "cpp_dsa",
      focusAreas: ["technical","aptitude","projects","interview"],
      targetDate: new Date(Date.now()+90*86400000).toISOString().slice(0,10),
      level: "Advanced"
    },
    customMilestones: [],
    milestoneSubtasks: {},
    skills: seedSkills({ technical: 72, aptitude: 58, projects: 84, communication: 68, resume: 76, interview: 61 }),
    tasks: seedTasks(),
    streak: { current: 12, longest: 21, lastActiveDate: today, history: seedActivityHistory() },
    achievements: { streak7: new Date(Date.now()-5*86400000).toISOString(), firstMilestone: new Date(Date.now()-30*86400000).toISOString(), taskCrusher: new Date(Date.now()-2*86400000).toISOString(), skillMaster: null, interviewReady: null, streak30: null, careerChampion: null },
    history: [
      { id: "h1", date: today, type: "task", text: "Completed \"Solve 10 DSA problems\"" },
      { id: "h2", date: today, type: "readiness", text: "Readiness updated" },
      { id: "h3", date: new Date(Date.now()-86400000).toISOString().slice(0,10), type: "task", text: "Completed \"Rewrite resume summary\"" },
    ],
    settings: { theme: "light", notifications: true },
  };
}

function emptyData(name, extra = {}) {
  const d = defaultData(name);
  d.skills = seedSkills({ technical: 0, aptitude: 0, projects: 0, communication: 0, resume: 0, interview: 0 });
  d.tasks = [];
  d.streak = { current: 0, longest: 0, lastActiveDate: null, history: [] };
  d.achievements = Object.fromEntries(ACHIEVEMENT_DEFS.map(a => [a.id, null]));
  d.history = [];
  d.customMilestones = [];
  d.milestoneSubtasks = {};
  return { ...d, ...extra, onboarded: false };
}

/* ============================== CALCULATIONS ============================== */
function skillProgress(skill) {
  const all = flatTopics(skill);
  if (!all.length) return 0;
  return Math.round((all.filter(t => t.status === "done").length / all.length) * 100);
}
function skillTopicCounts(skill) {
  const all = flatTopics(skill);
  const done = all.filter(t => t.status === "done").length;
  const inProgress = all.filter(t => t.status === "in-progress").length;
  return { done, inProgress, remaining: all.length - done - inProgress, total: all.length };
}
function categoryProgress(skills, cat) {
  const list = skills[cat] || [];
  if (!list.length) return 0;
  return Math.round(list.reduce((s, sk) => s + skillProgress(sk), 0) / list.length);
}
function subsetProgress(skills, cat, names) {
  const list = (skills[cat] || []).filter(s => names.includes(s.name));
  if (!list.length) return categoryProgress(skills, cat);
  return Math.round(list.reduce((s, sk) => s + skillProgress(sk), 0) / list.length);
}
function last7Rate(tasks) {
  const cutoff = Date.now() - 7 * 86400000;
  const recent = tasks.filter(t => new Date(t.createdAt).getTime() >= cutoff);
  if (!recent.length) return tasks.length ? (tasks.filter(t=>t.status==="Completed").length/tasks.length*100) : 0;
  const done = recent.filter(t => t.status === "Completed").length;
  return (done / recent.length) * 100;
}
function consistencyScore(streak, tasks) {
  const streakScore = Math.min(streak.current / 30, 1) * 100;
  const rate = last7Rate(tasks);
  return Math.round(streakScore * 0.6 + rate * 0.4);
}
function computeReadiness(state) {
  const catScores = {};
  CATEGORY_ORDER.forEach(c => { catScores[c] = categoryProgress(state.skills, c); });
  const consistency = consistencyScore(state.streak, state.tasks);
  let total = 0;
  CATEGORY_ORDER.forEach(c => { total += (catScores[c] * CATEGORY_META[c].weight) / 100; });
  total += (consistency * CONSISTENCY_WEIGHT) / 100;
  const score = Math.round(total);
  let level = "Beginner";
  if (score >= 85) level = "Interview Ready";
  else if (score >= 65) level = "Advanced";
  else if (score >= 40) level = "Intermediate";
  return { score, level, catScores, consistency };
}
function computeMilestones(state, readiness) {
  const roleName = state?.careerGoal?.targetRole || "Software Developer";
  const milestonesList = getTrackMilestones(roleName, state?.customMilestones || []) || TRACK_MILESTONES.sde;
  let firstIncompleteFound = false;
  return (milestonesList || []).map((m) => {
    let pct = 0;
    if (m.id === "start") {
      pct = 100;
    } else if (m.overall) {
      pct = readiness ? readiness.score : 70;
    } else if (m.subtasks && m.subtasks.length > 0) {
      const doneCount = m.subtasks.filter(st => {
        const key = `${m.id}_${st.id}`;
        return state?.milestoneSubtasks?.[key] !== undefined ? state.milestoneSubtasks[key] : st.done;
      }).length;
      pct = Math.round((doneCount / m.subtasks.length) * 100);
    } else if (m.subset && m.cats && m.cats.length && state?.skills) {
      pct = subsetProgress(state.skills, m.cats[0], m.subset);
    } else if (m.cats && m.cats.length && state?.skills) {
      pct = categoryProgress(state.skills, m.cats[0]);
    } else {
      pct = 50;
    }

    const threshold = m.overall ? 85 : 85;
    let status = pct >= threshold ? "completed" : "upcoming";
    if (status !== "completed" && !firstIncompleteFound) {
      status = "current";
      firstIncompleteFound = true;
    }
    return { ...m, pct: Math.min(100, Math.max(0, Math.round(pct))), status };
  });
}
function taskStats(tasks) {
  const completed = tasks.filter(t => t.status === "Completed").length;
  return { completed, total: tasks.length, pct: tasks.length ? Math.round((completed/tasks.length)*100) : 0 };
}
function overallProgress(state) {
  const catAvg = CATEGORY_ORDER.reduce((s,c) => s + categoryProgress(state.skills, c), 0) / CATEGORY_ORDER.length;
  return Math.round(catAvg);
}
function isSameDay(a, b) { return a === b; }
function todayStr() { return new Date().toISOString().slice(0,10); }

function bumpStreak(streak) {
  const today = todayStr();
  if (streak.lastActiveDate === today) return streak; // already counted today
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0,10);
  const current = streak.lastActiveDate === yesterday ? streak.current + 1 : 1;
  const longest = Math.max(streak.longest, current);
  const history = streak.history.includes(today) ? streak.history : [...streak.history, today];
  return { current, longest, lastActiveDate: today, history };
}

function checkAchievements(state, readiness, milestones) {
  const next = { ...state.achievements };
  const unlockedNow = [];
  const unlock = (id) => { if (!next[id]) { next[id] = new Date().toISOString(); unlockedNow.push(id); } };
  if (state.streak.current >= 7) unlock("streak7");
  if (state.streak.current >= 30) unlock("streak30");
  if (milestones.some(m => m.id !== "start" && m.status === "completed")) unlock("firstMilestone");
  if (taskStats(state.tasks).completed >= 20) unlock("taskCrusher");
  const anyMaxed = CATEGORY_ORDER.some(c => (state.skills[c]||[]).some(sk => skillProgress(sk) === 100));
  if (anyMaxed) unlock("skillMaster");
  if (readiness.score >= 85) unlock("interviewReady");
  if (milestones.filter(m => m.id !== "start").every(m => m.status === "completed")) unlock("careerChampion");
  return { achievements: next, unlockedNow };
}

function buildRecommendations(state, readiness) {
  const recs = [];
  const c = readiness.catScores;
  const sorted = [...CATEGORY_ORDER].sort((a,b) => c[a]-c[b]);
  if (c.aptitude < 60) recs.push({ id: "apt", text: "Your aptitude score is currently low. Spend 30 minutes practicing quantitative aptitude today.", cat: "aptitude" });
  const dsa = (state.skills.technical||[]).find(s => s.name === "Data Structures");
  const algo = (state.skills.technical||[]).find(s => s.name === "Algorithms");
  if (dsa && skillProgress(dsa) < 60) recs.push({ id: "dsa", text: "Focus on Arrays and Strings before moving to advanced algorithms.", cat: "technical" });
  else if (algo && skillProgress(algo) < 60) recs.push({ id: "algo", text: "Strengthen recursion and dynamic programming — they show up often in interviews.", cat: "technical" });
  if (c.resume < 100) recs.push({ id: "resume", text: "Complete your resume milestone before your next placement drive.", cat: "resume" });
  if (c.interview < 70) recs.push({ id: "interview", text: "Practice 5 technical interview questions this week.", cat: "interview" });
  if (c.communication < 60) recs.push({ id: "comm", text: "Join a group discussion or record a mock presentation to sharpen communication.", cat: "communication" });
  if (c.projects < 60) recs.push({ id: "proj", text: "Ship one more portfolio project — recruiters look for recent, deployed work.", cat: "projects" });
  if (!recs.length) recs.push({ id: "default", text: `Keep going — ${CATEGORY_META[sorted[0]].label} has the most room to grow next.`, cat: sorted[0] });
  return recs.slice(0, 4);
}

/* ============================== STORAGE HOOK ============================== */
function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const defaults = defaultData(parsed?.profile?.name || "Student");
      return {
        ...defaults,
        ...parsed,
        profile: { ...defaults.profile, ...(parsed.profile || {}) },
        careerGoal: { ...defaults.careerGoal, ...(parsed.careerGoal || {}) },
        customMilestones: Array.isArray(parsed.customMilestones) ? parsed.customMilestones : [],
        milestoneSubtasks: parsed.milestoneSubtasks || {},
        skills: parsed.skills || defaults.skills,
        tasks: Array.isArray(parsed.tasks) ? parsed.tasks : defaults.tasks,
        streak: parsed.streak || defaults.streak,
        achievements: parsed.achievements || defaults.achievements,
        history: Array.isArray(parsed.history) ? parsed.history : defaults.history,
      };
    }
  } catch (e) { /* ignore */ }
  return null;
}
function saveData(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
}

/* ============================== GLOBAL STYLE ============================== */
function GlobalStyle({ dark }) {
  const c = dark ? DARK : T;
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
      .cly * { box-sizing: border-box; }
      .cly { font-family: ${FONT_BODY}; color: ${c.ink}; background: ${c.bg}; }
      .cly h1, .cly h2, .cly h3, .cly .headfont { font-family: ${FONT_HEAD}; }
      .cly ::selection { background: ${c.lavender}30; color: ${c.ink}; }
      .cly-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
      .cly-scroll::-webkit-scrollbar-thumb { background: ${c.border}; border-radius: 8px; }

      /* Normal, non-distracting UI states without jitter/loops */
      .cly-anim-fadeup { opacity: 1; }
      .cly-anim-fadein { opacity: 1; }
      .cly-anim-scalein { opacity: 1; }

      .cly-card {
        background: ${c.bgCard};
        border: 1px solid ${c.border};
        box-shadow: ${dark ? "0 4px 24px -2px rgba(0,0,0,0.5)" : "0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.04)"};
      }
      .cly-focus:focus-visible { outline: 2px solid ${c.violet}; outline-offset: 2px; }
      input.cly-input, select.cly-input, textarea.cly-input { font-family: ${FONT_BODY}; }
      @media (max-width: 900px) {
        .cly-grid-2 { grid-template-columns: 1fr !important; }
        .cly-grid-3 { grid-template-columns: 1fr 1fr !important; }
        .cly-sidebar { display: none !important; }
      }
      @media (max-width: 560px) {
        .cly-grid-3 { grid-template-columns: 1fr !important; }
      }

      .cly-input { transition: border-color .15s ease, box-shadow .15s ease; }
      .cly-input:focus { border-color: ${c.violet} !important; box-shadow: 0 0 0 3px ${c.violet}25; outline: none; }
      .cly-btn-primary { transition: background .15s ease, filter .15s ease, transform .1s ease; }
      .cly-btn-primary:hover { filter: brightness(1.05); }
      .cly-btn-primary:active { transform: scale(0.98); }
      .cly-course-card { transition: border-color .15s ease, box-shadow .15s ease, transform .15s ease; }
      .cly-course-card:hover { border-color: ${c.violet}; box-shadow: 0 8px 24px -10px ${c.violet}35; transform: translateY(-1px); }
    `}</style>
  );
}

/* ============================== SHARED PRIMITIVES ============================== */
function useCountUp(target, duration = 900, dep) {
  const [val, setVal] = useState(0);
  const raf = useRef();
  useEffect(() => {
    const start = performance.now();
    const from = 0;
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(from + (target - from) * eased));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line
  }, [target, dep]);
  return val;
}

function ProgressRing({ pct, size = 160, stroke = 14, grad = [T.lavender, T.periwinkle], c = T, label, sublabel, dots = [] }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const animated = useCountUp(pct, 1100, pct);
  const gid = useMemo(() => "g" + Math.random().toString(36).slice(2), []);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={grad[0]} /><stop offset="100%" stopColor={grad[1]} />
          </linearGradient>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} stroke={c.border} strokeWidth={stroke} fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={`url(#${gid})`} strokeWidth={stroke} fill="none"
          strokeLinecap="round" strokeDasharray={circ}
          strokeDashoffset={circ - (animated/100) * circ}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(.3,.8,.3,1)" }} />
        {dots.map((d, i) => {
          const ang = (d.pos/100) * 2*Math.PI - Math.PI/2 + Math.PI/2;
          const rr = r;
          const a2 = (d.pos/100) * 2*Math.PI;
          const x = size/2 + rr*Math.cos(a2); const y = size/2 + rr*Math.sin(a2);
          return <circle key={i} cx={x} cy={y} r={3.2} fill={d.color} style={{ transform: "rotate(90deg)", transformOrigin: `${size/2}px ${size/2}px` }} />;
        })}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div className="headfont" style={{ fontSize: size*0.24, fontWeight: 800, color: c.ink, lineHeight: 1 }}>{animated}%</div>
        {label && <div style={{ fontSize: size*0.075, fontWeight: 700, letterSpacing: 1, color: c.violet, marginTop: 6, textTransform: "uppercase" }}>{label}</div>}
        {sublabel && <div style={{ fontSize: size*0.065, color: c.inkSoft, marginTop: 2 }}>{sublabel}</div>}
      </div>
    </div>
  );
}

function ProgressBar({ pct, grad = [T.lavender, T.periwinkle], c = T, height = 8, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 80 + delay); return () => clearTimeout(t); }, [pct, delay]);
  return (
    <div style={{ width: "100%", height, borderRadius: 99, background: c.bgAlt, overflow: "hidden" }}>
      <div style={{ width: `${w}%`, height: "100%", borderRadius: 99, background: `linear-gradient(90deg, ${grad[0]}, ${grad[1]})`, transition: "width 1s cubic-bezier(.3,.8,.3,1)" }} />
    </div>
  );
}

function Badge({ children, tone = "violet", c = T }) {
  const map = { violet: c.violet, mint: c.mint, peach: c.peach, blush: c.blush, blue: c.babyBlue, gray: c.inkFaint };
  const color = map[tone] || c.violet;
  return <span style={{ fontSize: 11, fontWeight: 700, color, background: color+"1c", padding: "3px 9px", borderRadius: 99, letterSpacing: .3 }}>{children}</span>;
}

function IconBadge({ Icon, grad, size = 40 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
      background: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`, boxShadow: `0 6px 16px -6px ${grad[0]}99` }}>
      <Icon size={size*0.5} color="#fff" strokeWidth={2.2} />
    </div>
  );
}

function Toast({ toast, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3400); return () => clearTimeout(t); }, [toast, onDone]);
  if (!toast) return null;
  return (
    <div style={{
      position: "fixed", top: 20, left: "50%", zIndex: 200, animation: "clyToastIn .4s cubic-bezier(.2,.8,.3,1.1) both",
      background: toast.c?.bgCard || T.bgCard, border: `1px solid ${toast.c?.border || T.border}`,
      borderRadius: 16, padding: "12px 18px", boxShadow: "0 14px 40px -12px rgba(80,60,160,.35)",
      display: "flex", alignItems: "center", gap: 10, maxWidth: 340,
    }}>
      <span style={{ fontSize: 22 }}>{toast.emoji || "✨"}</span>
      <div>
        <div style={{ fontWeight: 800, fontSize: 13.5, color: toast.c?.ink }}>{toast.title}</div>
        {toast.subtitle && <div style={{ fontSize: 12, color: toast.c?.inkSoft }}>{toast.subtitle}</div>}
      </div>
    </div>
  );
}

function Modal({ open, onClose, children, width = 440 }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(30,20,60,.42)", backdropFilter: "blur(3px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16, animation: "clyFadeIn .25s ease" }}>
      <div onClick={e => e.stopPropagation()} className="cly-anim-scalein cly-card" style={{ width: "100%", maxWidth: width, borderRadius: 22,
        padding: 26, boxShadow: "0 30px 70px -20px rgba(60,40,120,.4)", maxHeight: "88vh", overflowY: "auto" }}>
        {children}
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon = Sparkles, title, subtitle, c = T, action }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 20px" }}>
      <div style={{ width: 56, height: 56, margin: "0 auto 14px", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center",
        background: `linear-gradient(135deg, ${c.lavender}22, ${c.blush}22)` }}>
        <Icon size={26} color={c.violet} />
      </div>
      <div className="headfont" style={{ fontWeight: 800, fontSize: 16, color: c.ink }}>{title}</div>
      {subtitle && <div style={{ fontSize: 13, color: c.inkSoft, marginTop: 6, maxWidth: 320, marginInline: "auto" }}>{subtitle}</div>}
      {action}
    </div>
  );
}

/* ============================== STUDY BACKGROUND ============================== */
function StudyBackground({ dark, hero = false }) {
  const c = dark ? DARK : T;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
      {/* Executive modern background */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: dark
          ? "radial-gradient(ellipse at 50% 0%, #172554 0%, #0B0F19 75%)"
          : "radial-gradient(ellipse at 50% 0%, #E2E8F0 0%, #F8FAFC 75%)"
      }} />
      {/* Subtle modern dot matrix */}
      <div style={{
        position: "absolute",
        inset: 0,
        opacity: dark ? 0.2 : 0.45,
        backgroundImage: `radial-gradient(${dark ? "#3B82F6" : "#2563EB"} 0.8px, transparent 0.8px)`,
        backgroundSize: "28px 28px"
      }} />
      {/* Soft ambient tech glows */}
      <div style={{
        position: "absolute",
        top: -100,
        right: -80,
        width: 480,
        height: 480,
        borderRadius: "50%",
        background: dark ? "rgba(59, 130, 246, 0.08)" : "rgba(37, 99, 235, 0.05)",
        filter: "blur(90px)"
      }} />
      <div style={{
        position: "absolute",
        bottom: -100,
        left: -80,
        width: 480,
        height: 480,
        borderRadius: "50%",
        background: dark ? "rgba(16, 185, 129, 0.06)" : "rgba(16, 185, 129, 0.05)",
        filter: "blur(90px)"
      }} />
    </div>
  );
}

/* ============================== AUTH: EXECUTIVE LOGIN SCREEN (ENLARGED & PROFESSIONAL) ============================== */
function AuthScreen({ dark, onAuth, onDemo }) {
  const c = dark ? DARK : T;
  const [mode, setMode] = useState("login"); // login | register
  const [form, setForm] = useState({ name: "", email: "", password: "", college: "", department: "", year: "Final Year" });
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");

  function submit(e) {
    e.preventDefault();
    if (mode === "login") {
      if (!form.email || !form.password) { setErr("Enter your email and password."); return; }
      onAuth({ type: "login", email: form.email });
    } else {
      if (!form.name || !form.email || !form.password) { setErr("Please fill in name, email and password."); return; }
      onAuth({ type: "register", ...form });
    }
  }

  return (
    <div className="cly" style={{
      minHeight: "100vh", position: "relative", display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "48px 24px", gap: 26
    }}>
      <GlobalStyle dark={dark} />
      <StudyBackground dark={dark} hero />

      {/* Top Header Tag - Executive & Authoritative */}
      <div style={{
        position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 8,
        color: c.violet, fontSize: 12.5, fontWeight: 800, letterSpacing: 2.5, textTransform: "uppercase",
        background: `${c.violet}12`, border: `1px solid ${c.violet}28`, padding: "6px 16px", borderRadius: 99
      }}>
        <Sparkles size={14} color={c.violet} /> CAMPUS PLACEMENT INTELLIGENCE & COPILOT
      </div>

      {/* Main Centered Login Card - Truly Enlarged, Grand & Professional (720px width) */}
      <div className="cly-card" style={{
        position: "relative",
        zIndex: 1,
        width: "100%",
        maxWidth: 720,
        borderRadius: 28,
        padding: "54px 58px",
        boxShadow: dark
          ? "0 30px 90px -15px rgba(0,0,0,0.7), 0 0 0 1px rgba(51, 65, 85, 0.8)"
          : "0 25px 70px -12px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(226, 232, 240, 0.8)",
        backdropFilter: "blur(16px)",
        background: dark ? `${c.bgCard}f8` : "rgba(255,255,255,0.96)"
      }}>
        {/* Brand Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
          <div style={{
            width: 58,
            height: 58,
            borderRadius: 16,
            background: `linear-gradient(135deg, ${c.violet}, ${c.periwinkle})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 10px 24px -6px ${c.violet}55`,
            flexShrink: 0
          }}>
            <GraduationCap size={32} color="#fff" />
          </div>
          <div>
            <div className="headfont" style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.7, color: c.ink }}>
              Careerly
            </div>
            <div style={{ fontSize: 13, color: c.inkSoft, fontWeight: 700, letterSpacing: 0.2 }}>
              Enterprise Campus Placement & Career Readiness Suite
            </div>
          </div>
        </div>

        <div style={{ color: c.inkSoft, fontSize: 15, marginBottom: 28, lineHeight: 1.6 }}>
          Personalized company roadmaps, curated topic masterclasses, interactive placement quizzes, and real-time task alerts.
        </div>

        {/* Tab switch between Sign In and Create Account */}
        <div style={{
          display: "flex", padding: 6, borderRadius: 16, background: c.bgAlt,
          border: `1px solid ${c.border}`, marginBottom: 26
        }}>
          <button
            type="button"
            onClick={() => { setMode("login"); setErr(""); }}
            className="cly-focus"
            style={{
              flex: 1, padding: "12px 0", borderRadius: 12, fontSize: 14.5, fontWeight: 800, cursor: "pointer", border: "none",
              background: mode === "login" ? c.bgCard : "transparent",
              color: mode === "login" ? c.violet : c.inkSoft,
              boxShadow: mode === "login" ? "0 2px 10px rgba(0,0,0,0.06)" : "none",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8
            }}
          >
            <Lock size={15} /> Student Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode("register"); setErr(""); }}
            className="cly-focus"
            style={{
              flex: 1, padding: "12px 0", borderRadius: 12, fontSize: 14.5, fontWeight: 800, cursor: "pointer", border: "none",
              background: mode === "register" ? c.bgCard : "transparent",
              color: mode === "register" ? c.violet : c.inkSoft,
              boxShadow: mode === "register" ? "0 2px 10px rgba(0,0,0,0.06)" : "none",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8
            }}
          >
            <Sparkles size={15} /> Create Account
          </button>
        </div>

        <div>
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {mode === "register" && (
              <Field label="Full Name" c={c}>
                <div style={{ position: "relative" }}>
                  <UserIcon size={18} style={{ position: "absolute", left: 16, top: 15, color: c.inkFaint }} />
                  <input
                    className="cly-input cly-focus"
                    style={{ ...inputStyle(c), paddingLeft: 46 }}
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Sivaranjani K"
                  />
                </div>
              </Field>
            )}

            <Field label="College / University Email ID" c={c}>
              <div style={{ position: "relative" }}>
                <Mail size={18} style={{ position: "absolute", left: 16, top: 15, color: c.inkFaint }} />
                <input
                  className="cly-input cly-focus"
                  style={{ ...inputStyle(c), paddingLeft: 46 }}
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="name@college.edu or personal email"
                />
              </div>
            </Field>

            <Field label="Password" c={c}>
              <div style={{ position: "relative" }}>
                <Lock size={18} style={{ position: "absolute", left: 16, top: 15, color: c.inkFaint }} />
                <input
                  className="cly-input cly-focus"
                  style={{ ...inputStyle(c), paddingLeft: 46, paddingRight: 46 }}
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  style={{
                    position: "absolute", right: 14, top: 14, background: "none", border: "none",
                    cursor: "pointer", color: c.inkFaint, padding: 2
                  }}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </Field>

            {mode === "register" && (
              <>
                <Field label="College / University" c={c}>
                  <div style={{ position: "relative" }}>
                    <Building2 size={18} style={{ position: "absolute", left: 16, top: 15, color: c.inkFaint }} />
                    <input
                      className="cly-input cly-focus"
                      style={{ ...inputStyle(c), paddingLeft: 46 }}
                      value={form.college}
                      onChange={e => setForm({ ...form, college: e.target.value })}
                      placeholder="e.g. Anna University Regional Campus"
                    />
                  </div>
                </Field>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <Field label="Department" c={c}>
                    <input
                      className="cly-input cly-focus"
                      style={inputStyle(c)}
                      value={form.department}
                      onChange={e => setForm({ ...form, department: e.target.value })}
                      placeholder="e.g. Computer Science (CSE)"
                    />
                  </Field>
                  <Field label="Passout Year" c={c}>
                    <select
                      className="cly-input cly-focus"
                      style={inputStyle(c)}
                      value={form.year}
                      onChange={e => setForm({ ...form, year: e.target.value })}
                    >
                      {PASSOUT_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </Field>
                </div>
              </>
            )}

            {err && (
              <div style={{
                color: "#E11D48", fontSize: 13.5, fontWeight: 700, padding: "10px 14px",
                borderRadius: 12, background: "rgba(225, 29, 72, 0.1)", border: "1px solid rgba(225, 29, 72, 0.2)"
              }}>
                {err}
              </div>
            )}

            <button
              type="submit"
              className="cly-focus cly-btn-primary"
              style={{
                marginTop: 6, padding: "16px 0", borderRadius: 14, border: "none", cursor: "pointer",
                color: "#fff", fontWeight: 800, fontSize: 16, background: `linear-gradient(135deg, ${c.violet}, ${c.periwinkle})`,
                boxShadow: `0 12px 28px -8px ${c.violet}77`, letterSpacing: 0.3
              }}
            >
              {mode === "login" ? "Sign In to Dashboard →" : "Create Account & Start Roadmap →"}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "24px 0 18px" }}>
            <div style={{ flex: 1, height: 1, background: c.border }} />
            <span style={{ fontSize: 11.5, color: c.inkFaint, fontWeight: 800, letterSpacing: 1 }}>OR TRY DEMO PROFILES</span>
            <div style={{ flex: 1, height: 1, background: c.border }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              type="button"
              onClick={() => onDemo("sivaranjani")}
              className="cly-focus cly-btn-primary"
              style={{
                width: "100%", padding: "14px 0", borderRadius: 14, cursor: "pointer",
                fontWeight: 800, fontSize: 14.5, color: c.violet, background: c.bgAlt, border: `1.5px solid ${c.border}`,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8
              }}
            >
              <Zap size={16} color={c.violet} /> Continue with Instant Demo (Fast Placement Preview)
            </button>

            {/* Quick Persona Buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }} className="cly-grid-3">
              {[
                { key: "sivaranjani", role: "SDE Aspirant", tier: "Tier-1 Product", icon: "👩‍💻" },
                { key: "rahul", role: "Full Stack Dev", tier: "Tier-2 Tech", icon: "👨‍💻" },
                { key: "ananya", role: "Data Analyst", tier: "Analytics / AI", icon: "👩‍🔬" },
              ].map(p => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => onDemo(p.key)}
                  className="cly-focus"
                  style={{
                    padding: "8px 10px", borderRadius: 10, border: `1px solid ${c.border}`, background: c.bgCard,
                    cursor: "pointer", textAlign: "left", display: "flex", flexDirection: "column", gap: 2,
                    transition: "border-color 0.15s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = c.violet}
                  onMouseLeave={e => e.currentTarget.style.borderColor = c.border}
                >
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: c.ink, display: "flex", alignItems: "center", gap: 4 }}>
                    <span>{p.icon}</span> <span>{p.role}</span>
                  </div>
                  <div style={{ fontSize: 10, color: c.inkFaint, fontWeight: 600 }}>{p.tier}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: c.inkSoft }}>
          {mode === "login" ? (
            <>New to Careerly? <button onClick={() => { setMode("register"); setErr(""); }} className="cly-focus" style={linkBtn(c)}>Create Account Free</button></>
          ) : (
            <>Already have an account? <button onClick={() => { setMode("login"); setErr(""); }} className="cly-focus" style={linkBtn(c)}>Sign In</button></>
          )}
        </div>
        <div style={{ textAlign: "center", marginTop: 14, fontSize: 12, color: c.inkFaint }}>
          🔒 Secure Student Portal • Placement-Ready Preparation 2026-2027
        </div>
      </div>

      {/* Bottom Feature Badges - Professional Executive Cards */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", maxWidth: 760 }}>
        {[
          [MapIcon, "AI-Powered Placement Roadmaps"],
          [Video, "Topic Masterclasses & Quizzes"],
          [AlertTriangle, "Real-time Task Warnings"],
          [Target, "Interview Readiness Scoring"]
        ].map(([Icon, label], i) => (
          <div
            key={i}
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 99,
              background: dark ? "rgba(30, 41, 59, 0.85)" : "rgba(255, 255, 255, 0.95)",
              border: `1px solid ${c.border}`, backdropFilter: "blur(8px)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
            }}
          >
            <Icon size={15} color={c.violet} />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: c.ink }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, c, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 7, fontSize: 13.5, fontWeight: 700, color: c.inkSoft, flex: 1 }}>
      {label}
      {children}
    </label>
  );
}
function inputStyle(c) {
  return {
    width: "100%", padding: "13px 16px", borderRadius: 14, border: `1.5px solid ${c.border}`,
    background: c.bg, color: c.ink, fontSize: 14.5, outline: "none", transition: "all 0.15s ease"
  };
}
function linkBtn(c) {
  return { background: "none", border: "none", color: c.violet, fontWeight: 800, cursor: "pointer", fontSize: 14, padding: "0 4px" };
}

/* ============================== ONBOARDING (7-STEP RICH ROADMAP BUILDER) ============================== */
function Onboarding({ dark, initial, onComplete }) {
  const c = dark ? DARK : T;
  const [step, setStep] = useState(1);
  const total = 7;

  const [data, setData] = useState({
    name: initial?.name || "",
    college: initial?.college || "",
    degree: initial?.degree || "B.E / B.Tech",
    department: initial?.department || "CSE",
    year: initial?.year || "Final Year",
    targetRole: "Software Developer",
    targetCompanyTier: "tier1",
    primaryStack: "cpp_dsa",
    pace: "90days",
    weeklyHours: "15h",
    focusAreas: ["technical", "projects", "aptitude", "interview"],
    targetDate: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
    level: "Intermediate",
  });

  function next() {
    if (step < total) setStep(step + 1);
    else onComplete(data);
  }

  function toggleFocus(id) {
    setData(d => ({
      ...d,
      focusAreas: d.focusAreas.includes(id)
        ? (d.focusAreas.length > 1 ? d.focusAreas.filter(f => f !== id) : d.focusAreas)
        : [...d.focusAreas, id]
    }));
  }

  function selectTimeline(t) {
    const days = t.days || 90;
    const newDate = new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
    setData(d => ({ ...d, pace: t.id, targetDate: newDate }));
  }

  return (
    <div className="cly" style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
      <GlobalStyle dark={dark} />
      <StudyBackground dark={dark} />
      <div className="cly-card" style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 660, borderRadius: 26, padding: "32px 30px", background: dark ? DARK.bgCard : "#FFFFFF" }}>
        
        {/* Step Progress Dots */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {Array.from({ length: total }).map((_, i) => {
              const n = i + 1;
              const active = n <= step;
              return (
                <div
                  key={i}
                  style={{
                    width: n === step ? 24 : 10, height: 10, borderRadius: 99,
                    background: active ? `linear-gradient(135deg, ${c.violet}, ${c.periwinkle})` : c.border,
                    transition: "width .2s ease, background .2s ease"
                  }}
                />
              );
            })}
          </div>
          <div style={{ fontSize: 12, fontWeight: 800, color: c.violet }}>
            Step {step} of {total}
          </div>
        </div>

        <div>
          {/* STEP 1: IDENTITY & DEGREE */}
          {step === 1 && (
            <>
              <StepHead title="Tell us about your college journey" sub="We calibrate your roadmap according to your branch and graduation year." c={c} />
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Field label="Full Name" c={c}>
                  <input className="cly-input cly-focus" style={inputStyle(c)} value={data.name} onChange={e=>setData({...data, name: e.target.value})} placeholder="e.g. Sivaranjani K" />
                </Field>
                <Field label="College / University Name" c={c}>
                  <input className="cly-input cly-focus" style={inputStyle(c)} value={data.college} onChange={e=>setData({...data, college: e.target.value})} placeholder="e.g. Anna University Regional Campus" />
                </Field>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  <Field label="Degree" c={c}>
                    <select className="cly-input cly-focus" style={inputStyle(c)} value={data.degree} onChange={e=>setData({...data, degree: e.target.value})}>
                      {DEGREE_PROGRAMS.map(deg => <option key={deg} value={deg}>{deg}</option>)}
                    </select>
                  </Field>
                  <Field label="Department" c={c}>
                    <input className="cly-input cly-focus" style={inputStyle(c)} value={data.department} onChange={e=>setData({...data, department: e.target.value})} placeholder="e.g. CSE / IT" />
                  </Field>
                  <Field label="Year of Study" c={c}>
                    <select className="cly-input cly-focus" style={inputStyle(c)} value={data.year} onChange={e=>setData({...data, year: e.target.value})}>
                      <option value="Final Year">Final Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="1st Year">1st Year</option>
                    </select>
                  </Field>
                </div>
              </div>
            </>
          )}

          {/* STEP 2: CAREER TRACK */}
          {step === 2 && (
            <>
              <StepHead title="Which career track are you targeting?" sub="Choose from 9 specialized placement pathways with custom milestones." c={c} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, maxHeight: "50vh", overflowY: "auto", paddingRight: 4 }}>
                {CAREER_TRACKS.map(track => {
                  const active = data.targetRole === track.roleName;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => setData({ ...data, targetRole: track.roleName, primaryStack: track.id === "fullstack" ? "mern" : track.id === "aiml" ? "python_ai" : "cpp_dsa" })}
                      className="cly-focus"
                      style={{
                        textAlign: "left", padding: "12px 14px", borderRadius: 14, cursor: "pointer",
                        border: `1.5px solid ${active ? c.violet : c.border}`,
                        background: active ? (dark ? "rgba(165, 148, 255, 0.16)" : "rgba(109, 91, 208, 0.08)") : c.bgCard,
                        color: c.ink, display: "flex", flexDirection: "column", gap: 4
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 20 }}>{track.icon}</span>
                        {track.badge && (
                          <span style={{ fontSize: 10.5, fontWeight: 800, padding: "2px 7px", borderRadius: 6, background: `${c.violet}20`, color: c.violet }}>
                            {track.badge}
                          </span>
                        )}
                      </div>
                      <div className="headfont" style={{ fontWeight: 800, fontSize: 13.5, marginTop: 4, color: active ? c.violet : c.ink }}>
                        {track.label}
                      </div>
                      <div style={{ fontSize: 11.5, color: c.inkSoft, lineHeight: 1.3 }}>
                        {track.description}
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: c.mint, marginTop: 4 }}>
                        CTC: {track.salary}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* STEP 3: COMPANY TIER */}
          {step === 3 && (
            <>
              <StepHead title="What company tier is your dream goal?" sub="We calibrate your problem difficulty, system design rounds, and aptitude depth." c={c} />
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {COMPANY_TIERS.map(tier => {
                  const active = data.targetCompanyTier === tier.id;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setData({ ...data, targetCompanyTier: tier.id })}
                      className="cly-focus"
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 14, cursor: "pointer",
                        border: `1.5px solid ${active ? c.violet : c.border}`,
                        background: active ? (dark ? "rgba(165, 148, 255, 0.16)" : "rgba(109, 91, 208, 0.08)") : c.bgCard,
                        textAlign: "left"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 24 }}>{tier.icon}</span>
                        <div>
                          <div className="headfont" style={{ fontWeight: 800, fontSize: 14, color: active ? c.violet : c.ink }}>{tier.label}</div>
                          <div style={{ fontSize: 12, color: c.inkSoft }}>{tier.sub}</div>
                          <div style={{ fontSize: 11, color: c.inkFaint, marginTop: 2 }}>{tier.desc}</div>
                        </div>
                      </div>
                      <div style={{ padding: "4px 10px", borderRadius: 8, background: `${c.mint}20`, color: c.mint, fontSize: 12, fontWeight: 800 }}>
                        {tier.ctc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* STEP 4: PRIMARY TECH STACK */}
          {step === 4 && (
            <>
              <StepHead title="Select your primary technical stack" sub="Your coding tests and project showcase milestones will be tailored to this stack." c={c} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {TECH_STACKS.map(stack => {
                  const active = data.primaryStack === stack.id;
                  return (
                    <button
                      key={stack.id}
                      type="button"
                      onClick={() => setData({ ...data, primaryStack: stack.id })}
                      className="cly-focus"
                      style={{
                        textAlign: "left", padding: "14px 14px", borderRadius: 14, cursor: "pointer",
                        border: `1.5px solid ${active ? c.violet : c.border}`,
                        background: active ? (dark ? "rgba(165, 148, 255, 0.16)" : "rgba(109, 91, 208, 0.08)") : c.bgCard
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 20 }}>{stack.icon}</span>
                        <span className="headfont" style={{ fontWeight: 800, fontSize: 14, color: active ? c.violet : c.ink }}>{stack.label}</span>
                      </div>
                      <div style={{ fontSize: 12, color: c.inkSoft, lineHeight: 1.4 }}>{stack.tech}</div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* STEP 5: PREPARATION TIMELINE & PACE */}
          {step === 5 && (
            <>
              <StepHead title="What is your preparation pace & deadline?" sub="Choose a sprint or semester timeframe to schedule daily drills." c={c} />
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
                {PREP_TIMELINES.map(tl => {
                  const active = data.pace === tl.id;
                  return (
                    <button
                      key={tl.id}
                      type="button"
                      onClick={() => selectTimeline(tl)}
                      className="cly-focus"
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 14, cursor: "pointer",
                        border: `1.5px solid ${active ? c.violet : c.border}`,
                        background: active ? (dark ? "rgba(165, 148, 255, 0.16)" : "rgba(109, 91, 208, 0.08)") : c.bgCard,
                        textAlign: "left"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 20 }}>{tl.icon}</span>
                        <div>
                          <div className="headfont" style={{ fontWeight: 800, fontSize: 13.5, color: active ? c.violet : c.ink }}>{tl.label}</div>
                          <div style={{ fontSize: 11.5, color: c.inkSoft }}>{tl.sub}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: active ? c.violet : c.inkFaint }}>
                        {tl.days} Days
                      </div>
                    </button>
                  );
                })}
              </div>
              <Field label="Target Placement Ready Date" c={c}>
                <input type="date" className="cly-input cly-focus" style={inputStyle(c)} value={data.targetDate} onChange={e=>setData({...data, targetDate: e.target.value})} />
              </Field>
            </>
          )}

          {/* STEP 6: WEEKLY HOURS & STARTING LEVEL */}
          {step === 6 && (
            <>
              <StepHead title="Weekly study commitment & current level" sub="This sets the number of suggested tasks and milestone velocity." c={c} />
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: c.inkSoft, marginBottom: 8 }}>Weekly Study Hours</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {WEEKLY_HOURS.map(wh => {
                    const active = data.weeklyHours === wh.id;
                    return (
                      <button
                        key={wh.id}
                        type="button"
                        onClick={() => setData({ ...data, weeklyHours: wh.id })}
                        className="cly-focus"
                        style={{
                          textAlign: "left", padding: "10px 14px", borderRadius: 12, cursor: "pointer",
                          border: `1.5px solid ${active ? c.violet : c.border}`,
                          background: active ? (dark ? "rgba(165, 148, 255, 0.16)" : "rgba(109, 91, 208, 0.08)") : c.bgCard
                        }}
                      >
                        <div className="headfont" style={{ fontWeight: 800, fontSize: 13, color: active ? c.violet : c.ink }}>{wh.label}</div>
                        <div style={{ fontSize: 11.5, color: c.inkSoft }}>{wh.sub}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: c.inkSoft, marginBottom: 8 }}>Current Proficiency Starting Point</div>
                <div style={{ display: "flex", gap: 10 }}>
                  {LEVELS.map(l => {
                    const active = data.level === l;
                    return (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setData({ ...data, level: l })}
                        className="cly-focus"
                        style={{
                          flex: 1, padding: "12px 8px", borderRadius: 12, cursor: "pointer",
                          fontWeight: 800, fontSize: 13, border: `1.5px solid ${active ? c.violet : c.border}`,
                          background: active ? `linear-gradient(135deg, ${c.violet}, ${c.periwinkle})` : c.bgCard,
                          color: active ? "#fff" : c.inkSoft
                        }}
                      >
                        {l}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* STEP 7: CORE FOCUS PILLARS */}
          {step === 7 && (
            <>
              <StepHead title="Select your core preparation pillars" sub="Check all the areas you want your daily task generator to focus on." c={c} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {CORE_FOCUS_AREAS.map(f => {
                  const active = data.focusAreas.includes(f.id);
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => toggleFocus(f.id)}
                      className="cly-focus"
                      style={{
                        display: "flex", alignItems: "flex-start", gap: 10, textAlign: "left", padding: "12px 14px", borderRadius: 14, cursor: "pointer",
                        border: `1.5px solid ${active ? c.violet : c.border}`,
                        background: active ? (dark ? "rgba(165, 148, 255, 0.16)" : "rgba(109, 91, 208, 0.08)") : c.bgCard
                      }}
                    >
                      <span style={{ width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${active ? c.violet : c.border}`, background: active ? c.violet : "transparent", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2, flexShrink: 0 }}>
                        {active && <Check size={12} color="#fff" />}
                      </span>
                      <div>
                        <div className="headfont" style={{ fontWeight: 800, fontSize: 13, color: active ? c.violet : c.ink }}>{f.label}</div>
                        <div style={{ fontSize: 11.5, color: c.inkSoft, marginTop: 2 }}>{f.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Back and Continue / Finish Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26, paddingTop: 18, borderTop: `1px solid ${c.border}` }}>
          <button
            type="button"
            onClick={() => step > 1 && setStep(step - 1)}
            className="cly-focus"
            style={{
              visibility: step === 1 ? "hidden" : "visible", background: "none", border: "none",
              cursor: "pointer", color: c.inkSoft, fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 4
            }}
          >
            <ChevronLeft size={16} /> Back
          </button>
          <button
            type="button"
            onClick={next}
            className="cly-focus cly-btn-primary"
            style={{
              padding: "10px 24px", borderRadius: 13, border: "none", cursor: "pointer", color: "#fff",
              fontWeight: 800, fontSize: 13.5, background: `linear-gradient(135deg, ${c.violet}, ${c.periwinkle})`,
              boxShadow: `0 8px 18px -6px ${c.violet}`, display: "flex", alignItems: "center", gap: 6
            }}
          >
            {step === total ? "Generate My Custom Roadmap" : "Continue"} <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

function StepHead({ title, sub, c }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div className="headfont" style={{ fontSize: 19, fontWeight: 800, letterSpacing: -0.3, color: c.ink }}>{title}</div>
      <div style={{ fontSize: 13, color: c.inkSoft, marginTop: 4 }}>{sub}</div>
    </div>
  );
}

/* ============================== ROADMAP REVEAL ============================== */
function RoadmapReveal({ dark, onDone }) {
  const c = dark ? DARK : T;
  useEffect(() => {
    const t = setTimeout(onDone, 1200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="cly" style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <GlobalStyle dark={dark} />
      <StudyBackground dark={dark} />
      <div className="cly-card" style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 440, padding: "36px 30px", borderRadius: 24 }}>
        <div style={{ width: 60, height: 60, borderRadius: 20, background: `linear-gradient(135deg, ${c.mint}, ${c.babyBlue})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#fff", boxShadow: `0 8px 20px -6px ${c.mint}` }}>
          <CheckCircle2 size={32} />
        </div>
        <div className="headfont" style={{ fontSize: 22, fontWeight: 800, color: c.ink }}>Your Career Roadmap is Ready</div>
        <div style={{ color: c.inkSoft, marginTop: 8, fontSize: 13.5, lineHeight: 1.5 }}>
          Calibrating milestones, company tiers, and tailored weekly drills. Redirecting to your dashboard…
        </div>
      </div>
    </div>
  );
}

/* ============================== APP SHELL ============================== */
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "roadmap", label: "My Roadmap", icon: MapIcon },
  { id: "tasks", label: "Tasks", icon: ListChecks },
  { id: "skills", label: "Skills", icon: Gauge },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "readiness", label: "Readiness", icon: Target },
  { id: "achievements", label: "Achievements", icon: Trophy },
  { id: "history", label: "History", icon: HistoryIcon },
];
const MOBILE_NAV = ["dashboard","roadmap","tasks","skills","readiness"];

function Sidebar({ page, setPage, c, name, onLogout }) {
  return (
    <div className="cly-scroll" style={{ width: 232, flexShrink: 0, borderRight: `1px solid ${c.border}`, display: "flex", flexDirection: "column",
      padding: "22px 14px", height: "100vh", position: "sticky", top: 0, overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "0 8px", marginBottom: 26 }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: `linear-gradient(135deg, ${c.lavender}, ${c.blush})`,
          display: "flex", alignItems: "center", justifyContent: "center" }}><GraduationCap size={17} color="#fff" /></div>
        <div className="headfont" style={{ fontWeight: 800, fontSize: 17, letterSpacing: -0.4 }}>Careerly</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
        {NAV_ITEMS.map(it => {
          const active = page === it.id; const Icon = it.icon;
          return (
            <button key={it.id} onClick={()=>setPage(it.id)} className="cly-focus" style={{
              display: "flex", alignItems: "center", gap: 11, padding: "9px 12px", borderRadius: 12, border: "none", cursor: "pointer",
              textAlign: "left", fontSize: 13.3, fontWeight: active ? 800 : 600,
              background: active ? `linear-gradient(135deg, ${c.violet}, ${c.periwinkle})` : "transparent",
              color: active ? "#fff" : c.inkSoft, transition: "all .18s" }}
              onMouseEnter={e=>{ if(!active) e.currentTarget.style.background = c.bgAlt; }}
              onMouseLeave={e=>{ if(!active) e.currentTarget.style.background = "transparent"; }}>
              <Icon size={16} /> {it.label}
            </button>
          );
        })}
      </div>
      <div style={{ borderTop: `1px solid ${c.border}`, paddingTop: 10, display: "flex", flexDirection: "column", gap: 3 }}>
        <button onClick={()=>setPage("profile")} className="cly-focus" style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 12px", borderRadius: 12,
          border: "none", cursor: "pointer", background: page==="profile"? c.bgAlt : "transparent", textAlign: "left", fontSize: 13.3, fontWeight: 700, color: c.inkSoft }}>
          <UserIcon size={16}/> Profile
        </button>
        <button onClick={()=>setPage("settings")} className="cly-focus" style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 12px", borderRadius: 12,
          border: "none", cursor: "pointer", background: page==="settings"? c.bgAlt : "transparent", textAlign: "left", fontSize: 13.3, fontWeight: 700, color: c.inkSoft }}>
          <SettingsIcon size={16}/> Settings
        </button>
        <button onClick={onLogout} className="cly-focus" style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 12px", borderRadius: 12,
          border: "none", cursor: "pointer", background: "transparent", textAlign: "left", fontSize: 13.3, fontWeight: 700, color: c.inkFaint }}>
          <LogOut size={16}/> Log out
        </button>
      </div>
    </div>
  );
}

function NotificationDrawer({ open, onClose, c, dark, tasks = [], streak, readiness, milestones = [], onNav }) {
  if (!open) return null;

  const incomplete = tasks.filter(t => t.status !== "Completed");
  const overdue = incomplete.filter(t => new Date(t.deadline) < new Date(todayStr()));
  const highPriority = incomplete.filter(t => t.priority === "High");
  const streakAtRisk = streak?.lastActiveDate !== todayStr();
  const readinessLow = (readiness?.score || 0) < 85;
  const currentMilestone = (milestones || []).find(m => m.status === "current");

  // Compile warning and notice items
  const warnings = [];

  if (overdue.length > 0) {
    warnings.push({
      id: "overdue",
      severity: "danger",
      icon: "🚨",
      title: `${overdue.length} Overdue Task${overdue.length > 1 ? "s" : ""} Warning!`,
      desc: `Tasks like "${overdue[0].title}" have exceeded their target deadline. Complete these immediately to stay on track!`,
      actionLabel: "View Overdue Tasks",
      targetPage: "tasks"
    });
  }

  if (incomplete.length > 0) {
    warnings.push({
      id: "incomplete",
      severity: "warning",
      icon: "⚠️",
      title: `${incomplete.length} Incomplete Task${incomplete.length > 1 ? "s" : ""} Pending!`,
      desc: `You have ${highPriority.length} High Priority tasks pending today. Finish them before midnight to maintain your placement preparation schedule!`,
      actionLabel: "Complete Tasks Now",
      targetPage: "tasks"
    });
  }

  if (streakAtRisk) {
    warnings.push({
      id: "streak",
      severity: "warning",
      icon: "🔥",
      title: "Daily Study Streak at Risk!",
      desc: `Your ${streak?.current || 0}-day study streak is pending for today. Complete at least one task or course topic to keep it active.`,
      actionLabel: "Save My Streak",
      targetPage: "tasks"
    });
  }

  if (currentMilestone) {
    warnings.push({
      id: "milestone",
      severity: "info",
      icon: "🎯",
      title: `Roadmap Stage In Progress: ${currentMilestone.title}`,
      desc: `Currently at ${currentMilestone.pct || 0}% progress. Finish remaining checklist subtasks to unlock the next placement stage!`,
      actionLabel: "Open My Roadmap",
      targetPage: "roadmap"
    });
  }

  if (readinessLow) {
    warnings.push({
      id: "readiness",
      severity: "info",
      icon: "📈",
      title: `Placement Readiness: ${readiness?.score || 0}%`,
      desc: "Top product companies require 85%+ readiness. Boost your score by completing topic quizzes and technical drills.",
      actionLabel: "Practice Skills & Quizzes",
      targetPage: "skills"
    });
  }

  return (
    <Modal open={open} onClose={onClose} width={490}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${c.violet}20`, display: "flex", alignItems: "center", justifyContent: "center", color: c.violet }}>
            <Bell size={18} />
          </div>
          <div>
            <div className="headfont" style={{ fontWeight: 800, fontSize: 17, color: c.ink }}>Notifications & Warnings</div>
            <div style={{ fontSize: 11.5, color: c.inkSoft }}>
              {incomplete.length > 0 ? `⚠️ ${incomplete.length} tasks incomplete` : "All tasks up to date"}
            </div>
          </div>
        </div>
        <button onClick={onClose} className="cly-focus" style={{ background: "none", border: "none", cursor: "pointer", color: c.inkFaint }}>
          <X size={18} />
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: "60vh", overflowY: "auto", paddingRight: 4 }}>
        {warnings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px 10px" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
            <div style={{ fontWeight: 800, fontSize: 15, color: c.ink }}>All Caught Up!</div>
            <div style={{ fontSize: 12.5, color: c.inkSoft, marginTop: 4 }}>No pending task warnings or streak alerts. Great work!</div>
          </div>
        ) : (
          warnings.map(w => {
            const isDanger = w.severity === "danger";
            const isWarning = w.severity === "warning";
            const bg = isDanger ? "rgba(239, 68, 68, 0.08)" : isWarning ? "rgba(245, 178, 122, 0.12)" : c.bgAlt;
            const border = isDanger ? "#EF444455" : isWarning ? "rgba(245, 178, 122, 0.4)" : c.border;
            return (
              <div
                key={w.id}
                style={{
                  borderRadius: 14, padding: "13px 15px", background: bg, border: `1.5px solid ${border}`,
                  display: "flex", flexDirection: "column", gap: 6
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{w.icon}</span>
                    <span style={{ fontWeight: 800, fontSize: 13, color: c.ink }}>{w.title}</span>
                  </div>
                  <Badge tone={isDanger ? "blush" : isWarning ? "peach" : "violet"} c={c}>
                    {isDanger ? "Critical Warning" : isWarning ? "Warning" : "Notice"}
                  </Badge>
                </div>
                <div style={{ fontSize: 12, color: c.inkSoft, lineHeight: 1.45 }}>
                  {w.desc}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
                  <button
                    onClick={() => { onNav && onNav(w.targetPage); onClose(); }}
                    className="cly-focus"
                    style={{
                      background: "none", border: "none", cursor: "pointer", color: c.violet,
                      fontWeight: 800, fontSize: 12, display: "flex", alignItems: "center", gap: 4
                    }}
                  >
                    {w.actionLabel} <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${c.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11.5, color: c.inkFaint }}>💡 Complete tasks daily to clear warnings</span>
        <button onClick={onClose} className="cly-focus" style={{ padding: "7px 14px", borderRadius: 10, background: c.bgAlt, border: `1px solid ${c.border}`, color: c.inkSoft, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
          Close
        </button>
      </div>
    </Modal>
  );
}

function Topbar({ c, name, dark, setDark, title, sub, data, readiness, onNav, milestones }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const incompleteCount = (data?.tasks || []).filter(t => t.status !== "Completed").length;
  const overdueCount = (data?.tasks || []).filter(t => t.status !== "Completed" && new Date(t.deadline) < new Date(todayStr())).length;
  const streakAtRisk = data?.streak?.lastActiveDate !== todayStr();
  const warningCount = (overdueCount > 0 ? 1 : 0) + (incompleteCount > 0 ? 1 : 0) + (streakAtRisk ? 1 : 0);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 26px", flexWrap: "wrap", gap: 12 }}>
      <div>
        <div className="headfont" style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.3 }}>{title}</div>
        {sub && <div style={{ fontSize: 12.5, color: c.inkSoft, marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Bell Button with Warning Badge */}
        <button
          onClick={() => setNotifOpen(true)}
          className="cly-focus"
          title={incompleteCount > 0 ? `⚠️ ${incompleteCount} tasks incomplete — click for alerts` : "Notifications"}
          style={{ ...iconBtnStyle(c), position: "relative" }}
        >
          <Bell size={16} color={warningCount > 0 ? (overdueCount > 0 ? "#EF4444" : "#F59E0B") : c.inkSoft} />
          {warningCount > 0 && (
            <span style={{
              position: "absolute", top: -4, right: -4, minWidth: 18, height: 18, padding: "0 4px", borderRadius: 99,
              background: overdueCount > 0 ? "#EF4444" : "#F59E0B", color: "#fff", fontSize: 10.5, fontWeight: 800,
              display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
            }}>
              {incompleteCount > 9 ? "9+" : incompleteCount}
            </span>
          )}
        </button>
        <button onClick={()=>setDark(d=>!d)} className="cly-focus" style={iconBtnStyle(c)}>{dark ? <Sun size={16}/> : <Moon size={16}/>}</button>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${c.lavender}, ${c.blush})`,
          display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 13 }}>
          {(name||"?").charAt(0).toUpperCase()}
        </div>
      </div>

      <NotificationDrawer
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        c={c}
        dark={dark}
        tasks={data?.tasks || []}
        streak={data?.streak}
        readiness={readiness}
        milestones={milestones}
        onNav={onNav}
      />
    </div>
  );
}
function iconBtnStyle(c) { return { width: 34, height: 34, borderRadius: 10, border: `1px solid ${c.border}`, background: c.bgCard, cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center", color: c.inkSoft }; }

function MobileNav({ page, setPage, c }) {
  return (
    <div className="cly-scroll" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, background: c.bgCard, borderTop: `1px solid ${c.border}`,
      display: "flex", justifyContent: "space-around", padding: "8px 4px", boxShadow: "0 -8px 24px -12px rgba(80,60,160,.2)" }}>
      {MOBILE_NAV.map(id => {
        const it = NAV_ITEMS.find(n=>n.id===id); const Icon = it.icon; const active = page===id;
        return (
          <button key={id} onClick={()=>setPage(id)} className="cly-focus" style={{ background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color: active ? c.violet : c.inkFaint, fontSize: 10, fontWeight: 700, padding: 4 }}>
            <Icon size={18} /> {it.label.split(" ")[0]}
          </button>
        );
      })}
    </div>
  );
}

/* ============================== STREAK CARD ============================== */
function StreakCard({ c, streak, justBumped }) {
  const days = useCountUp(streak.current, 900, streak.current);
  return (
    <div className="cly-card" style={{ borderRadius: 20, padding: "20px 18px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%",
        background: `radial-gradient(circle, ${c.peach}44, transparent 70%)`, filter: "blur(4px)" }} />
      <div style={{ position: "relative", textAlign: "center" }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <div style={{ fontSize: 38, filter: `drop-shadow(0 0 10px ${c.peach}55)` }}>🔥</div>
        </div>
        <div key={days} className="headfont" style={{ fontSize: 30, fontWeight: 800, marginTop: 4 }}>{days}</div>
        <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1.2, color: c.inkFaint, textTransform: "uppercase" }}>Day Streak</div>
        <div style={{ marginTop: 10, fontSize: 11.5, color: c.inkSoft }}>Longest streak · <b style={{ color: c.ink }}>{streak.longest} days</b></div>
      </div>
    </div>
  );
}

function StatCard({ c, icon: Icon, grad, label, value, sub }) {
  return (
    <div className="cly-card" style={{ borderRadius: 18, padding: "16px 16px", transition: "transform .2s, box-shadow .2s", cursor: "default" }}
      onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 16px 30px -16px rgba(90,70,160,.35)"; }}
      onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}>
      <IconBadge Icon={Icon} grad={grad} size={36} />
      <div className="headfont" style={{ fontSize: 22, fontWeight: 800, marginTop: 12 }}>{value}</div>
      <div style={{ fontSize: 12, color: c.inkSoft, fontWeight: 600 }}>{label}</div>
      {sub && <div style={{ fontSize: 10.5, color: c.inkFaint, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function DashboardPage({ c, state, readiness, milestones, name, onToggleTask, onNav }) {
  const stats = taskStats(state.tasks);
  const overall = overallProgress(state);
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const focusTasks = state.tasks.filter(t => t.status !== "Completed").slice(0, 4);
  const weakest = [...CATEGORY_ORDER].sort((a,b)=>readiness.catScores[a]-readiness.catScores[b])[0];
  const recs = useMemo(() => buildRecommendations(state, readiness), [state, readiness]);
  const dots = CATEGORY_ORDER.map((cat, i) => ({ pos: (i/CATEGORY_ORDER.length)*100, color: CATEGORY_META[cat].grad[0] }));

  return (
    <div style={{ padding: "0 26px 90px", display: "flex", flexDirection: "column", gap: 22 }}>
      <div className="cly-anim-fadeup">
        <div className="headfont" style={{ fontSize: 24, fontWeight: 800 }}>{greet}, {name} 👋</div>
        <div style={{ fontSize: 13.5, color: c.inkSoft, marginTop: 4 }}>Small progress every day builds a successful career.</div>
      </div>

      {/* TASK COMPLETION WARNING BANNER */}
      {(() => {
        const incompleteList = state.tasks.filter(t => t.status !== "Completed");
        const overdueList = incompleteList.filter(t => new Date(t.deadline) < new Date(todayStr()));
        if (incompleteList.length === 0) return null;
        const isCritical = overdueList.length > 0;
        return (
          <div
            className="cly-card cly-anim-fadeup"
            style={{
              padding: "14px 18px", borderRadius: 16,
              background: isCritical ? "rgba(239, 68, 68, 0.08)" : "rgba(245, 178, 122, 0.12)",
              border: `1.5px solid ${isCritical ? "#EF444455" : "rgba(245, 178, 122, 0.45)"}`,
              display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: isCritical ? "rgba(239, 68, 68, 0.18)" : "rgba(245, 178, 122, 0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: isCritical ? "#EF4444" : "#D97706", flexShrink: 0
              }}>
                <AlertTriangle size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 13.5, color: c.ink, display: "flex", alignItems: "center", gap: 8 }}>
                  <span>
                    {isCritical
                      ? `⚠️ WARNING: ${overdueList.length} Task${overdueList.length > 1 ? "s" : ""} Overdue!`
                      : `⚡ TASK REMINDER: ${incompleteList.length} Task${incompleteList.length > 1 ? "s" : ""} Pending Completion`}
                  </span>
                  <Badge tone={isCritical ? "blush" : "peach"} c={c}>
                    {isCritical ? "Critical Alert" : "Streak at Risk"}
                  </Badge>
                </div>
                <div style={{ fontSize: 12, color: c.inkSoft, marginTop: 2 }}>
                  {isCritical
                    ? "Incomplete overdue tasks cause your Interview Readiness score to decrease. Complete them immediately to stay on track."
                    : "Complete today's pending tasks before midnight to maintain your daily study streak and unlock new milestones."}
                </div>
              </div>
            </div>
            <button
              onClick={() => onNav("tasks")}
              className="cly-focus"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10,
                background: isCritical ? "#EF4444" : `linear-gradient(135deg, ${c.violet}, ${c.periwinkle})`,
                color: "#fff", border: "none", fontWeight: 800, fontSize: 12.5, cursor: "pointer"
              }}
            >
              Complete Tasks Now <ChevronRight size={14} />
            </button>
          </div>
        );
      })()}

      <div style={{ display: "grid", gridTemplateColumns: "minmax(260px, 1.1fr) 2fr", gap: 18 }} className="cly-grid-2">
        <div className="cly-card cly-anim-fadeup" style={{ borderRadius: 22, padding: 22, display: "flex", flexDirection: "column", alignItems: "center",
          background: `linear-gradient(160deg, ${c.bgCard}, ${c.bgAlt})` }}>
          <div style={{ fontWeight: 800, fontSize: 13, alignSelf: "flex-start", color: c.inkSoft, marginBottom: 8 }}>Placement Readiness</div>
          <ProgressRing pct={readiness.score} size={168} stroke={13} grad={[c.violet, c.periwinkle]} c={c} label={readiness.level} dots={dots} />
          <div style={{ marginTop: 14, fontSize: 12.5, color: c.inkSoft, textAlign: "center" }}>
            {readiness.level === "Interview Ready" ? "You're fully interview ready 🎉" : `${Math.max(0, 85-readiness.score)}% more to reach Interview Ready`}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="cly-grid-2">
          <StreakCard c={c} streak={state.streak} />
          <StatCard c={c} icon={Target} grad={[c.lavender, c.periwinkle]} label="Overall Progress" value={`${overall}%`} />
          <StatCard c={c} icon={CheckCircle2} grad={[c.mint, c.babyBlue]} label="Tasks Completed" value={`${stats.completed} / ${stats.total}`} />
          <StatCard c={c} icon={Trophy} grad={[c.violet, c.blush]} label="Achievements" value={Object.values(state.achievements).filter(Boolean).length} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18 }} className="cly-grid-2">
        <div className="cly-card cly-anim-fadeup" style={{ borderRadius: 20, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontWeight: 800, fontSize: 14.5 }}>Today's Focus</div>
            <button onClick={()=>onNav("tasks")} className="cly-focus" style={{ background: "none", border: "none", color: c.violet, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>View all</button>
          </div>
          {focusTasks.length === 0 ? (
            <EmptyState icon={CheckCircle2} title="All caught up!" subtitle="No pending tasks for today. Add a new one to keep the streak alive." c={c} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {focusTasks.map(t => (
                <label key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 13, background: c.bgAlt, cursor: "pointer" }}>
                  <Checkbox checked={t.status==="Completed"} onChange={()=>onToggleTask(t.id)} c={c} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: c.ink, textDecoration: t.status==="Completed" ? "line-through" : "none", opacity: t.status==="Completed"?0.5:1 }}>{t.title}</div>
                    <div style={{ fontSize: 10.5, color: c.inkFaint, marginTop: 1 }}>{CATEGORY_META[t.category]?.label}</div>
                  </div>
                  <Badge tone="violet" c={c}>{t.priority}</Badge>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="cly-card cly-anim-fadeup" style={{ borderRadius: 20, padding: 20 }}>
          <div style={{ fontWeight: 800, fontSize: 14.5, marginBottom: 4 }}>Your next best focus</div>
          <div style={{ fontSize: 12.5, color: c.inkSoft, marginBottom: 14 }}>{CATEGORY_META[weakest].label} — {readiness.catScores[weakest]}%</div>
          <ProgressBar pct={readiness.catScores[weakest]} grad={CATEGORY_META[weakest].grad} c={c} height={9} />
          <div style={{ fontSize: 12, color: c.inkSoft, marginTop: 14, lineHeight: 1.5 }}>{recs[0]?.text}</div>
        </div>
      </div>

      {/* ACTIVE ROADMAP MILESTONE TRACKER */}
      {(() => {
        const msList = milestones && milestones.length ? milestones : computeMilestones(state, readiness);
        const currMilestone = (msList || []).find(m => m.status === "current") || (msList || [])[0];
        const completedCount = (msList || []).filter(m => m.status === "completed").length;
        const targetRole = state?.careerGoal?.targetRole || "Software Developer";
        return (
          <div className="cly-card cly-anim-fadeup" style={{ borderRadius: 22, padding: "20px 22px", background: `linear-gradient(135deg, ${c.bgCard}, ${c.bgAlt})`, border: `1.5px solid ${c.border}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${c.violet}, ${c.periwinkle})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
                  <MapIcon size={20} />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span className="headfont" style={{ fontWeight: 800, fontSize: 15, color: c.ink }}>Target Career Roadmap</span>
                    <span style={{ fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 6, background: `${c.violet}18`, color: c.violet }}>
                      {targetRole}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: c.inkSoft, marginTop: 2 }}>
                    {completedCount} of {(msList || []).length} Milestones Completed · Active: <b style={{ color: c.ink }}>{currMilestone?.title || "Career Launchpad"}</b>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onNav("roadmap")}
                className="cly-focus cly-btn-primary"
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 12,
                  background: `linear-gradient(135deg, ${c.violet}, ${c.periwinkle})`, border: "none", color: "#fff",
                  fontSize: 12.5, fontWeight: 800, cursor: "pointer", boxShadow: `0 4px 12px -4px ${c.violet}`
                }}
              >
                Go to My Roadmap <ArrowRight size={14} />
              </button>
            </div>
            {currMilestone && (
              <div style={{ background: c.bgCard, borderRadius: 14, padding: "14px 16px", border: `1px solid ${c.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, fontSize: 12.5, fontWeight: 700 }}>
                  <span style={{ color: c.ink }}>Current Stage: {currMilestone.title}</span>
                  <span style={{ color: c.violet, fontWeight: 800 }}>{currMilestone.pct || 0}%</span>
                </div>
                <ProgressBar pct={currMilestone.pct || 0} grad={[c.violet, c.mint]} c={c} height={7} />
              </div>
            )}
          </div>
        );
      })()}

      <div className="cly-card cly-anim-fadeup" style={{ borderRadius: 20, padding: 20 }}>
        <div style={{ fontWeight: 800, fontSize: 14.5, marginBottom: 14 }}>Skill Progress</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }} className="cly-grid-3">
          {CATEGORY_ORDER.map((cat, i) => {
            const meta = CATEGORY_META[cat]; const Icon = meta.icon; const pct = readiness.catScores[cat];
            return (
              <div key={cat}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <IconBadge Icon={Icon} grad={meta.grad} size={26} />
                  <div style={{ fontSize: 12.5, fontWeight: 700, flex: 1 }}>{meta.label}</div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: c.inkSoft }}>{pct}%</div>
                </div>
                <ProgressBar pct={pct} grad={meta.grad} c={c} delay={i*80} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Checkbox({ checked, onChange, c, size = 20 }) {
  return (
    <button onClick={onChange} className="cly-focus" style={{ width: size, height: size, borderRadius: 7, border: `2px solid ${checked ? c.violet : c.border}`,
      background: checked ? `linear-gradient(135deg, ${c.violet}, ${c.periwinkle})` : "transparent", display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", flexShrink: 0, transition: "all .18s" }}>
      {checked && <Check size={size*0.65} color="#fff" strokeWidth={3} style={{ animation: "clyPop .3s ease" }} />}
    </button>
  );
}

/* ============================== ROADMAP PAGE (RICH OPTIONS & DYNAMIC TRACKS) ============================== */
function RoadmapCustomizeModal({ open, onClose, c, currentGoal, onSave }) {
  const [form, setForm] = useState({
    targetRole: currentGoal?.targetRole || "Software Developer",
    targetCompanyTier: currentGoal?.targetCompanyTier || "tier1",
    pace: currentGoal?.pace || "90days",
    weeklyHours: currentGoal?.weeklyHours || "15h",
    primaryStack: currentGoal?.primaryStack || "cpp_dsa",
    level: currentGoal?.level || "Intermediate",
    targetDate: currentGoal?.targetDate || new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
  });

  if (!open) return null;

  function handleTimelineChange(paceId) {
    const tl = PREP_TIMELINES.find(t => t.id === paceId);
    const days = tl?.days || 90;
    const newDate = new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
    setForm(f => ({ ...f, pace: paceId, targetDate: newDate }));
  }

  function handleSave() {
    onSave(form);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} width={580}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${c.violet}20`, display: "flex", alignItems: "center", justifyContent: "center", color: c.violet }}>
            <Sliders size={18} />
          </div>
          <div>
            <div className="headfont" style={{ fontWeight: 800, fontSize: 18, color: c.ink }}>Customize Career Roadmap</div>
            <div style={{ fontSize: 12, color: c.inkSoft }}>Adjust role track, target company tier, timeline & tech stack.</div>
          </div>
        </div>
        <button onClick={onClose} className="cly-focus" style={{ background: "none", border: "none", cursor: "pointer", color: c.inkFaint }}>
          <X size={18} />
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, maxHeight: "64vh", overflowY: "auto", paddingRight: 4 }}>
        {/* Track / Role */}
        <Field label="Career Track / Target Role" c={c}>
          <select className="cly-input cly-focus" style={inputStyle(c)} value={form.targetRole} onChange={e=>setForm({...form, targetRole: e.target.value})}>
            {CAREER_TRACKS.map(t => <option key={t.id} value={t.roleName}>{t.icon} {t.label} (CTC: {t.salary})</option>)}
          </select>
        </Field>

        {/* Company Tier */}
        <Field label="Target Company Hiring Tier" c={c}>
          <select className="cly-input cly-focus" style={inputStyle(c)} value={form.targetCompanyTier} onChange={e=>setForm({...form, targetCompanyTier: e.target.value})}>
            {COMPANY_TIERS.map(tier => <option key={tier.id} value={tier.id}>{tier.icon} {tier.label} ({tier.ctc})</option>)}
          </select>
        </Field>

        {/* Tech Stack */}
        <Field label="Primary Tech Stack Focus" c={c}>
          <select className="cly-input cly-focus" style={inputStyle(c)} value={form.primaryStack} onChange={e=>setForm({...form, primaryStack: e.target.value})}>
            {TECH_STACKS.map(s => <option key={s.id} value={s.id}>{s.icon} {s.label} ({s.tech})</option>)}
          </select>
        </Field>

        {/* Pace & Timeline */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Preparation Timeline & Pace" c={c}>
            <select className="cly-input cly-focus" style={inputStyle(c)} value={form.pace} onChange={e=>handleTimelineChange(e.target.value)}>
              {PREP_TIMELINES.map(tl => <option key={tl.id} value={tl.id}>{tl.icon} {tl.label} ({tl.days}d)</option>)}
            </select>
          </Field>
          <Field label="Target Placement Date" c={c}>
            <input type="date" className="cly-input cly-focus" style={inputStyle(c)} value={form.targetDate} onChange={e=>setForm({...form, targetDate: e.target.value})} />
          </Field>
        </div>

        {/* Weekly Hours & Level */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Weekly Study Hours" c={c}>
            <select className="cly-input cly-focus" style={inputStyle(c)} value={form.weeklyHours} onChange={e=>setForm({...form, weeklyHours: e.target.value})}>
              {WEEKLY_HOURS.map(wh => <option key={wh.id} value={wh.id}>{wh.label}</option>)}
            </select>
          </Field>
          <Field label="Preparation Level" c={c}>
            <select className="cly-input cly-focus" style={inputStyle(c)} value={form.level} onChange={e=>setForm({...form, level: e.target.value})}>
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20, paddingTop: 14, borderTop: `1px solid ${c.border}` }}>
        <button onClick={onClose} className="cly-focus" style={{ padding: "9px 16px", borderRadius: 11, border: `1px solid ${c.border}`, background: c.bgAlt, cursor: "pointer", fontWeight: 700, fontSize: 13, color: c.inkSoft }}>
          Cancel
        </button>
        <button onClick={handleSave} className="cly-focus cly-btn-primary" style={{ padding: "9px 20px", borderRadius: 11, border: "none", cursor: "pointer", color: "#fff", fontWeight: 800, fontSize: 13, background: `linear-gradient(135deg, ${c.violet}, ${c.periwinkle})` }}>
          Apply & Rebuild Roadmap
        </button>
      </div>
    </Modal>
  );
}

function AddMilestoneModal({ open, onClose, c, onAdd }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [duration, setDuration] = useState("Week 5");
  const [category, setCategory] = useState("technical");
  const [subtasksText, setSubtasksText] = useState("");

  if (!open) return null;

  function handleAdd() {
    if (!title.trim()) return;
    const subtasks = subtasksText
      .split("\n")
      .map(s => s.trim())
      .filter(Boolean)
      .map((text, i) => ({ id: `custom_st_${Date.now()}_${i}`, text, done: false }));

    const newMilestone = {
      id: `custom_m_${Date.now()}`,
      title,
      desc: desc || "Custom user-defined milestone target.",
      cats: [category],
      duration: duration || "Custom",
      subtasks: subtasks.length > 0 ? subtasks : [{ id: `custom_st_${Date.now()}_0`, text: title, done: false }],
      isCustom: true,
    };

    onAdd(newMilestone);
    setTitle("");
    setDesc("");
    setSubtasksText("");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} width={500}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${c.mint}20`, display: "flex", alignItems: "center", justifyContent: "center", color: c.mint }}>
            <Plus size={18} />
          </div>
          <div>
            <div className="headfont" style={{ fontWeight: 800, fontSize: 17, color: c.ink }}>Add Custom Milestone</div>
            <div style={{ fontSize: 12, color: c.inkSoft }}>Insert your own specific goal or hackathon target into the roadmap.</div>
          </div>
        </div>
        <button onClick={onClose} className="cly-focus" style={{ background: "none", border: "none", cursor: "pointer", color: c.inkFaint }}>
          <X size={18} />
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Field label="Milestone Title" c={c}>
          <input className="cly-input cly-focus" style={inputStyle(c)} value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Solve 50 LeetCode Mediums or AWS Cert" />
        </Field>
        <Field label="Description" c={c}>
          <textarea className="cly-input cly-focus" style={{ ...inputStyle(c), minHeight: 50, resize: "vertical" }} value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Key objectives and deliverables for this milestone." />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Associated Category" c={c}>
            <select className="cly-input cly-focus" style={inputStyle(c)} value={category} onChange={e=>setCategory(e.target.value)}>
              {CATEGORY_ORDER.map(cat => <option key={cat} value={cat}>{CATEGORY_META[cat].label}</option>)}
            </select>
          </Field>
          <Field label="Timeline / Duration" c={c}>
            <input className="cly-input cly-focus" style={inputStyle(c)} value={duration} onChange={e=>setDuration(e.target.value)} placeholder="e.g. Week 4 - 5" />
          </Field>
        </div>
        <Field label="Actionable Subtasks (one per line)" c={c}>
          <textarea className="cly-input cly-focus" style={{ ...inputStyle(c), minHeight: 65, resize: "vertical" }} value={subtasksText} onChange={e=>setSubtasksText(e.target.value)} placeholder="Complete Binary Tree inversion&#10;Solve Lowest Common Ancestor&#10;Solve Diameter of Binary Tree" />
        </Field>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
        <button onClick={onClose} className="cly-focus" style={{ padding: "8px 16px", borderRadius: 10, border: `1px solid ${c.border}`, background: c.bgAlt, cursor: "pointer", fontWeight: 700, fontSize: 12.5, color: c.inkSoft }}>
          Cancel
        </button>
        <button onClick={handleAdd} className="cly-focus cly-btn-primary" style={{ padding: "8px 18px", borderRadius: 10, border: "none", cursor: "pointer", color: "#fff", fontWeight: 800, fontSize: 12.5, background: `linear-gradient(135deg, ${c.violet}, ${c.periwinkle})` }}>
          Add Milestone
        </button>
      </div>
    </Modal>
  );
}

function RoadmapPage({
  c,
  dark,
  state,
  readiness,
  milestones = [],
  onUpdateCareerGoal,
  onAddCustomMilestone,
  onDeleteCustomMilestone,
  onToggleMilestoneSubtask,
  onSwitchTrack
}) {
  const isDark = dark !== undefined ? dark : (c === DARK);
  const [filter, setFilter] = useState("all"); // all | inprogress | completed | upcoming
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [addMilestoneOpen, setAddMilestoneOpen] = useState(false);

  const goal = state?.careerGoal || {};
  const currentRole = goal.targetRole || "Software Developer";
  const trackKey = getTrackKeyForRole(currentRole);
  const activeTrackMeta = CAREER_TRACKS.find(t => t.id === trackKey) || CAREER_TRACKS[0];
  const activeTierMeta = COMPANY_TIERS.find(t => t.id === goal.targetCompanyTier) || COMPANY_TIERS[0];
  const activeTimelineMeta = PREP_TIMELINES.find(t => t.id === goal.pace) || PREP_TIMELINES[2];

  // Guaranteed non-empty milestones list with valid status and pct on every single item
  const activeMilestones = useMemo(() => {
    if (milestones && milestones.length > 0 && milestones[0]?.status) {
      return milestones;
    }
    const computed = computeMilestones(state, readiness);
    if (computed && computed.length > 0) return computed;
    const base = getTrackMilestones(currentRole, state?.customMilestones || []) || TRACK_MILESTONES.sde;
    return (base || []).map((m, i) => ({
      ...m,
      pct: i === 0 ? 100 : i === 1 ? 67 : 0,
      status: i === 0 ? "completed" : i === 1 ? "current" : "upcoming",
    }));
  }, [milestones, state, readiness, currentRole]);

  const completedCount = activeMilestones.filter(m => m.status === "completed").length;
  const inProgressCount = activeMilestones.filter(m => m.status === "current").length;
  const upcomingCount = activeMilestones.filter(m => m.status === "upcoming").length;
  const overallPct = activeMilestones.length ? Math.round((completedCount / activeMilestones.length) * 100) : 0;

  // Filtered list
  const filteredMilestones = useMemo(() => {
    if (filter === "completed") return activeMilestones.filter(m => m.status === "completed");
    if (filter === "inprogress") return activeMilestones.filter(m => m.status === "current");
    if (filter === "upcoming") return activeMilestones.filter(m => m.status === "upcoming");
    return activeMilestones;
  }, [activeMilestones, filter]);

  return (
    <div style={{ padding: "0 26px 90px", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* HEADER OVERVIEW CARD */}
      <div className="cly-card" style={{ borderRadius: 24, padding: "24px 26px", background: `linear-gradient(135deg, ${c.bgCard}, ${c.bgAlt})` }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: `linear-gradient(135deg, ${c.violet}, ${c.periwinkle})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "#fff", boxShadow: `0 8px 18px -6px ${c.violet}` }}>
              {activeTrackMeta.icon}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                <span className="headfont" style={{ fontSize: 20, fontWeight: 800, color: c.ink }}>{activeTrackMeta.label}</span>
                <span style={{ padding: "3px 8px", borderRadius: 6, background: `${c.violet}18`, color: c.violet, fontSize: 11, fontWeight: 800 }}>
                  {activeTrackMeta.tag}
                </span>
                <span style={{ padding: "3px 8px", borderRadius: 6, background: `${c.mint}18`, color: c.mint, fontSize: 11, fontWeight: 800 }}>
                  CTC {activeTrackMeta.salary}
                </span>
              </div>
              <div style={{ fontSize: 12.5, color: c.inkSoft, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <span>🎯 {activeTierMeta.label}</span>
                <span>⏱️ {activeTimelineMeta.label}</span>
                <span>📅 Target: <b>{goal.targetDate || "3 Months"}</b></span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 9 }}>
            <button
              onClick={() => setAddMilestoneOpen(true)}
              className="cly-focus"
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 12,
                background: c.bgCard, border: `1px solid ${c.border}`, color: c.ink, fontSize: 12.5, fontWeight: 700, cursor: "pointer"
              }}
            >
              <Plus size={14} color={c.violet} /> Add Milestone
            </button>
            <button
              onClick={() => setCustomizeOpen(true)}
              className="cly-focus cly-btn-primary"
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 12,
                background: `linear-gradient(135deg, ${c.violet}, ${c.periwinkle})`, border: "none", color: "#fff", fontSize: 12.5, fontWeight: 800, cursor: "pointer",
                boxShadow: `0 6px 16px -6px ${c.violet}`
              }}
            >
              <Sliders size={14} /> Customize Roadmap
            </button>
          </div>
        </div>

        {/* Overall progress bar */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, fontWeight: 700, color: c.inkSoft, marginBottom: 6 }}>
            <span>Milestone Progress ({completedCount} of {activeMilestones.length} Completed)</span>
            <span style={{ color: c.violet, fontWeight: 800 }}>{overallPct}%</span>
          </div>
          <ProgressBar pct={overallPct} grad={[c.violet, c.mint]} c={c} height={8} />
        </div>
      </div>

      {/* QUICK TRACK SWITCHER BAR */}
      <div>
        <div style={{ fontSize: 11.5, fontWeight: 800, color: c.inkFaint, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <Layers size={13} /> Quick Career Track Switcher (Explore & Switch Anytime)
        </div>
        <div className="cly-scroll" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {CAREER_TRACKS.map(t => {
            const active = t.roleName === currentRole;
            return (
              <button
                key={t.id}
                onClick={() => onSwitchTrack && onSwitchTrack(t.roleName)}
                className="cly-focus"
                style={{
                  padding: "8px 14px", borderRadius: 12, fontSize: 12.5, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
                  border: `1.5px solid ${active ? c.violet : c.border}`,
                  background: active ? (c.violet) : c.bgCard,
                  color: active ? "#fff" : c.inkSoft,
                  display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
                  boxShadow: active ? `0 4px 14px -4px ${c.violet}` : "none"
                }}
              >
                <span>{t.icon}</span> {t.roleName}
              </button>
            );
          })}
        </div>
      </div>

      {/* STATUS FILTER BAR */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 6, background: c.bgAlt, padding: 4, borderRadius: 12, border: `1px solid ${c.border}` }}>
          {[
            { id: "all", label: `All (${activeMilestones.length})` },
            { id: "inprogress", label: `In Progress (${inProgressCount})` },
            { id: "completed", label: `Completed (${completedCount})` },
            { id: "upcoming", label: `Upcoming (${upcomingCount})` },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="cly-focus"
              style={{
                padding: "6px 12px", borderRadius: 9, border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer",
                background: filter === f.id ? c.bgCard : "transparent",
                color: filter === f.id ? c.violet : c.inkSoft,
                boxShadow: filter === f.id ? "0 2px 6px rgba(0,0,0,0.06)" : "none"
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 12, color: c.inkFaint }}>
          💡 Click subtask checkboxes inside milestones to record your progress!
        </div>
      </div>

      {/* MILESTONE TIMELINE STEPPER */}
      <div style={{ maxWidth: 760, margin: "0 auto", width: "100%", position: "relative" }}>
        {/* Connecting line */}
        {filteredMilestones.length > 0 && (
          <div style={{ position: "absolute", left: 23, top: 12, bottom: 20, width: 3, borderRadius: 3, background: `linear-gradient(180deg, ${c.violet}, ${c.blush}, ${c.border})` }} />
        )}

        {filteredMilestones.length === 0 ? (
          <div className="cly-card" style={{ padding: "48px 24px", textAlign: "center", borderRadius: 22, width: "100%", margin: "0 auto" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📍</div>
            <div className="headfont" style={{ fontWeight: 800, fontSize: 17, color: c.ink, marginBottom: 6 }}>
              No milestones found under "{filter === "inprogress" ? "In Progress" : filter.charAt(0).toUpperCase() + filter.slice(1)}"
            </div>
            <div style={{ fontSize: 13, color: c.inkSoft, marginBottom: 18, lineHeight: 1.5, maxWidth: 440, marginInline: "auto" }}>
              Your {activeTrackMeta.label} roadmap has {activeMilestones.length} structured milestones. Click below to show all milestones.
            </div>
            <button
              onClick={() => setFilter("all")}
              className="cly-focus cly-btn-primary"
              style={{
                padding: "9px 22px", borderRadius: 12, border: "none", cursor: "pointer", color: "#fff",
                fontWeight: 800, fontSize: 13, background: `linear-gradient(135deg, ${c.violet}, ${c.periwinkle})`,
                boxShadow: `0 6px 16px -6px ${c.violet}`
              }}
            >
              Show All {activeMilestones.length} Milestones
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {filteredMilestones.map((m, i) => {
              const isCompleted = m.status === "completed";
              const isCurrent = m.status === "current";
              const isUpcoming = m.status === "upcoming";

              return (
                <div key={m.id} style={{ display: "flex", gap: 18, position: "relative" }}>
                  {/* Stepper Circle */}
                  <div
                    style={{
                      flexShrink: 0, width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                      zIndex: 1, fontSize: 15, fontWeight: 800,
                      background: isCompleted ? `linear-gradient(135deg, ${c.mint}, ${c.babyBlue})` :
                                  isCurrent ? `linear-gradient(135deg, ${c.violet}, ${c.periwinkle})` : c.bgAlt,
                      color: isUpcoming ? c.inkFaint : "#fff",
                      boxShadow: isCurrent ? `0 0 0 5px ${c.violet}22, 0 8px 18px -6px ${c.violet}` :
                                 isCompleted ? `0 6px 14px -6px ${c.mint}` : "none",
                      border: isUpcoming ? `2px solid ${c.border}` : "none",
                    }}
                  >
                    {isCompleted ? <Check size={22} strokeWidth={2.8} /> : isUpcoming ? <Lock size={16} /> : i + 1}
                  </div>

                  {/* Milestone Detail Card */}
                  <div
                    className="cly-card"
                    style={{
                      flex: 1, borderRadius: 20, padding: "20px 22px",
                      opacity: isUpcoming ? 0.72 : 1,
                      border: `1.5px solid ${isCurrent ? `${c.violet}66` : c.border}`,
                      background: isCurrent ? (isDark ? "rgba(165, 148, 255, 0.05)" : "rgba(109, 91, 208, 0.02)") : c.bgCard
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span className="headfont" style={{ fontWeight: 800, fontSize: 16, color: c.ink }}>{m.title}</span>
                        {m.duration && (
                          <span style={{ fontSize: 11, fontWeight: 700, color: c.inkFaint, padding: "2px 7px", borderRadius: 6, background: c.bgAlt }}>
                            {m.duration}
                          </span>
                        )}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {isCompleted && <Badge tone="mint" c={c}>Completed</Badge>}
                        {isCurrent && <Badge tone="violet" c={c}>In Progress</Badge>}
                        {isUpcoming && <Badge tone="gray" c={c}>Upcoming</Badge>}

                        {m.isCustom && onDeleteCustomMilestone && (
                          <button
                            onClick={() => onDeleteCustomMilestone(m.id)}
                            className="cly-focus"
                            title="Delete custom milestone"
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#E0577A", padding: 4 }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div style={{ fontSize: 13, color: c.inkSoft, marginBottom: 12, lineHeight: 1.5 }}>
                      {m.desc}
                    </div>

                    {/* ACTIONABLE SUBTASKS CHECKLIST */}
                    {m.subtasks && m.subtasks.length > 0 && (
                      <div style={{ background: c.bgAlt, borderRadius: 14, padding: "12px 14px", marginBottom: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: c.inkFaint, textTransform: "uppercase", letterSpacing: 0.6 }}>
                          Actionable Milestone Checklist
                        </div>
                        {m.subtasks.map(st => {
                          const key = `${m.id}_${st.id}`;
                          const isDone = state?.milestoneSubtasks?.[key] !== undefined ? state.milestoneSubtasks[key] : st.done;
                          return (
                            <label
                              key={st.id}
                              style={{
                                display: "flex", alignItems: "center", gap: 9, fontSize: 12.5, cursor: "pointer",
                                color: isDone ? c.inkFaint : c.ink, textDecoration: isDone ? "line-through" : "none"
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isDone}
                                onChange={(e) => onToggleMilestoneSubtask && onToggleMilestoneSubtask(m.id, st.id, e.target.checked)}
                                style={{ width: 16, height: 16, accentColor: c.violet, cursor: "pointer" }}
                              />
                              <span>{st.text}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {/* Progress bar */}
                    {m.id !== "start" && (
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: c.inkFaint, fontWeight: 700, marginBottom: 4 }}>
                          <span>Completion Rate</span>
                          <span>{m.pct || 0}%</span>
                        </div>
                        <ProgressBar pct={m.pct || 0} grad={isCompleted ? [c.mint, c.babyBlue] : [c.violet, c.periwinkle]} c={c} height={6} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODALS */}
      <RoadmapCustomizeModal
        open={customizeOpen}
        onClose={() => setCustomizeOpen(false)}
        c={c}
        currentGoal={goal}
        onSave={(updated) => onUpdateCareerGoal && onUpdateCareerGoal(updated)}
      />

      <AddMilestoneModal
        open={addMilestoneOpen}
        onClose={() => setAddMilestoneOpen(false)}
        c={c}
        onAdd={(newM) => onAddCustomMilestone && onAddCustomMilestone(newM)}
      />
    </div>
  );
}

/* ============================== TASKS PAGE ============================== */
const CATS_FOR_SELECT = CATEGORY_ORDER;
function TaskForm({ c, initial, onSave, onCancel }) {
  const [t, setT] = useState(initial || { title: "", description: "", category: "technical", priority: "Medium", deadline: todayStr() });
  return (
    <div>
      <div className="headfont" style={{ fontWeight: 800, fontSize: 17, marginBottom: 16 }}>{initial ? "Edit Task" : "New Task"}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Field label="Title" c={c}><input className="cly-input cly-focus" style={inputStyle(c)} value={t.title} onChange={e=>setT({...t, title: e.target.value})} placeholder="e.g. Solve 10 DSA problems" /></Field>
        <Field label="Description (optional)" c={c}><textarea className="cly-input cly-focus" style={{...inputStyle(c), minHeight: 60, resize: "vertical"}} value={t.description} onChange={e=>setT({...t, description: e.target.value})} /></Field>
        <div style={{ display: "flex", gap: 10 }}>
          <Field label="Category" c={c}>
            <select className="cly-input cly-focus" style={inputStyle(c)} value={t.category} onChange={e=>setT({...t, category: e.target.value})}>
              {CATS_FOR_SELECT.map(cat => <option key={cat} value={cat}>{CATEGORY_META[cat].label}</option>)}
            </select>
          </Field>
          <Field label="Priority" c={c}>
            <select className="cly-input cly-focus" style={inputStyle(c)} value={t.priority} onChange={e=>setT({...t, priority: e.target.value})}>
              {["High","Medium","Low"].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Deadline" c={c}><input type="date" className="cly-input cly-focus" style={inputStyle(c)} value={t.deadline} onChange={e=>setT({...t, deadline: e.target.value})} /></Field>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button onClick={onCancel} className="cly-focus" style={{ flex: 1, padding: "10px 0", borderRadius: 12, border: `1px solid ${c.border}`, background: "none", cursor: "pointer", fontWeight: 700, color: c.inkSoft }}>Cancel</button>
        <button onClick={()=> t.title.trim() && onSave(t)} className="cly-focus" style={{ flex: 1, padding: "10px 0", borderRadius: 12, border: "none", cursor: "pointer",
          fontWeight: 800, color: "#fff", background: `linear-gradient(135deg, ${c.violet}, ${c.periwinkle})` }}>Save Task</button>
      </div>
    </div>
  );
}

function TasksPage({ c, tasks, onToggle, onAdd, onEdit, onDelete }) {
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal] = useState(null); // null | 'new' | task obj

  const incomplete = tasks.filter(t => t.status !== "Completed");
  const overdue = incomplete.filter(t => new Date(t.deadline) < new Date(todayStr()));

  const filtered = tasks.filter(t => {
    if (query && !t.title.toLowerCase().includes(query.toLowerCase())) return false;
    if (catFilter !== "all" && t.category !== catFilter) return false;
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    return true;
  }).sort((a,b) => new Date(a.deadline) - new Date(b.deadline));

  return (
    <div style={{ padding: "0 26px 90px" }}>
      {/* PENDING / OVERDUE TASKS WARNING BANNER */}
      {overdue.length > 0 ? (
        <div className="cly-card cly-anim-fadeup" style={{
          padding: "16px 20px", borderRadius: 16, marginBottom: 18,
          background: "rgba(239, 68, 68, 0.08)", border: "1.5px solid #EF444466",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, background: "rgba(239, 68, 68, 0.18)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444", fontSize: 20
            }}>
              🚨
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14.5, color: c.ink, display: "flex", alignItems: "center", gap: 8 }}>
                <span>CRITICAL WARNING: {overdue.length} Task{overdue.length > 1 ? "s" : ""} Overdue!</span>
                <Badge tone="blush" c={c}>Action Required</Badge>
              </div>
              <div style={{ fontSize: 12, color: c.inkSoft, marginTop: 2 }}>
                Overdue tasks negatively impact your Interview Readiness score and indicate preparation lag. Complete them now!
              </div>
            </div>
          </div>
          <button
            onClick={() => setStatusFilter("Pending")}
            className="cly-focus"
            style={{
              padding: "8px 16px", borderRadius: 10, background: "#EF4444", color: "#fff",
              border: "none", fontWeight: 800, fontSize: 12.5, cursor: "pointer"
            }}
          >
            Filter Pending Tasks ({incomplete.length})
          </button>
        </div>
      ) : incomplete.length > 0 ? (
        <div className="cly-card cly-anim-fadeup" style={{
          padding: "14px 18px", borderRadius: 16, marginBottom: 18,
          background: "rgba(245, 178, 122, 0.12)", border: "1.5px solid rgba(245, 178, 122, 0.45)",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: "rgba(245, 178, 122, 0.25)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "#D97706", fontSize: 18
            }}>
              ⚠️
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 13.5, color: c.ink, display: "flex", alignItems: "center", gap: 8 }}>
                <span>Task Warning: {incomplete.length} Incomplete Task{incomplete.length > 1 ? "s" : ""} Pending</span>
                <Badge tone="peach" c={c}>Streak at Risk</Badge>
              </div>
              <div style={{ fontSize: 12, color: c.inkSoft, marginTop: 2 }}>
                Check off your tasks today to maintain your daily preparation consistency and reach your next career milestone.
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: c.inkSoft }}>
              {tasks.length - incomplete.length} of {tasks.length} Done ({Math.round(((tasks.length - incomplete.length)/Math.max(1, tasks.length))*100)}%)
            </span>
          </div>
        </div>
      ) : (
        <div className="cly-card cly-anim-fadeup" style={{
          padding: "12px 18px", borderRadius: 14, marginBottom: 16,
          background: "rgba(79, 201, 168, 0.1)", border: `1.5px solid ${c.mint}44`,
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>🎉</span>
            <div style={{ fontSize: 13, fontWeight: 800, color: c.ink }}>
              All Tasks Completed! No pending warnings. Keep up the high placement momentum!
            </div>
          </div>
          <Badge tone="mint" c={c}>100% Up to date</Badge>
        </div>
      )}

      <div className="cly-anim-fadeup" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 200px" }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: 11, color: c.inkFaint }} />
          <input className="cly-focus" style={{...inputStyle(c), paddingLeft: 34}} placeholder="Search tasks..." value={query} onChange={e=>setQuery(e.target.value)} />
        </div>
        <select className="cly-focus" style={{...inputStyle(c), width: "auto"}} value={catFilter} onChange={e=>setCatFilter(e.target.value)}>
          <option value="all">All categories</option>
          {CATEGORY_ORDER.map(c2 => <option key={c2} value={c2}>{CATEGORY_META[c2].label}</option>)}
        </select>
        <select className="cly-focus" style={{...inputStyle(c), width: "auto"}} value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option><option>Pending</option><option>In Progress</option><option>Completed</option>
        </select>
        <button onClick={()=>setModal("new")} className="cly-focus" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 12,
          border: "none", cursor: "pointer", color: "#fff", fontWeight: 800, fontSize: 13, background: `linear-gradient(135deg, ${c.violet}, ${c.periwinkle})` }}>
          <Plus size={15}/> New Task
        </button>
      </div>

      {filtered.length === 0 ? <EmptyState icon={ListChecks} title="No tasks found" subtitle="Try a different filter, or create a new preparation task." c={c} /> : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="cly-grid-2">
          {filtered.map(t => {
            const meta = CATEGORY_META[t.category];
            const overdue = t.status !== "Completed" && new Date(t.deadline) < new Date(todayStr());
            return (
              <div key={t.id} className="cly-card cly-anim-fadein" style={{ borderRadius: 16, padding: 14, display: "flex", gap: 10 }}>
                <Checkbox checked={t.status==="Completed"} onChange={()=>onToggle(t.id)} c={c} size={22} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 6 }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5, textDecoration: t.status==="Completed"?"line-through":"none", opacity: t.status==="Completed"?0.55:1 }}>{t.title}</div>
                    <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                      <button onClick={()=>setModal(t)} className="cly-focus" style={{ background: "none", border: "none", cursor: "pointer", color: c.inkFaint }}><Edit2 size={13}/></button>
                      <button onClick={()=>onDelete(t.id)} className="cly-focus" style={{ background: "none", border: "none", cursor: "pointer", color: c.inkFaint }}><Trash2 size={13}/></button>
                    </div>
                  </div>
                  {t.description && <div style={{ fontSize: 11.5, color: c.inkSoft, marginTop: 3 }}>{t.description}</div>}
                  <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <Badge tone="violet" c={c}>{meta.label}</Badge>
                    <Badge tone={t.priority==="High"?"blush":t.priority==="Medium"?"peach":"blue"} c={c}>{t.priority}</Badge>
                    <span style={{ fontSize: 10.5, color: overdue ? "#E0577A" : c.inkFaint, fontWeight: 700 }}>{overdue?"Overdue · ":""}{t.deadline}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={!!modal} onClose={()=>setModal(null)}>
        {modal && <TaskForm c={c} initial={modal !== "new" ? modal : null} onCancel={()=>setModal(null)}
          onSave={(t)=>{ modal==="new" ? onAdd(t) : onEdit(t); setModal(null); }} />}
      </Modal>
    </div>
  );
}

/* ============================== SKILLS PAGE ============================== */
function SkillGapRow({ c, name, pct }) {
  const dot = pct >= 75 ? "🟢" : pct >= 45 ? "🟡" : "🔴";
  const label = pct >= 75 ? "Strong" : pct >= 45 ? "Improving" : "Needs Attention";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
      <span>{dot}</span>
      <span style={{ fontSize: 12.5, fontWeight: 700, flex: 1 }}>{name}</span>
      <span style={{ fontSize: 11.5, color: c.inkSoft }}>{label}</span>
      <span style={{ fontSize: 11.5, fontWeight: 800, width: 34, textAlign: "right" }}>{pct}%</span>
    </div>
  );
}

const SKILL_TAB_GROUPS = {
  all: { label: "All", cats: CATEGORY_ORDER },
  technical: { label: "Technical", cats: ["technical"] },
  aptitude: { label: "Aptitude", cats: ["aptitude"] },
  career: { label: "Career", cats: ["projects","communication","resume","interview"] },
};

function levelFor(pct) { return pct >= 85 ? "Advanced" : pct >= 50 ? "Intermediate" : "Beginner"; }

function CourseCard({ c, s, cat, onOpen }) {
  const pct = skillProgress(s); const counts = skillTopicCounts(s); const meta = CATEGORY_META[cat];
  return (
    <button onClick={onOpen} className="cly-card cly-focus cly-course-card cly-anim-fadein" style={{ borderRadius: 18, padding: 16, textAlign: "left",
      cursor: "pointer", border: `1px solid ${c.border}`, display: "flex", flexDirection: "column", gap: 10, background: c.bgCard }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19,
          background: `linear-gradient(135deg, ${meta.grad[0]}22, ${meta.grad[1]}22)` }}>{s.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 14 }}>{s.name}</div>
          <Badge tone="violet" c={c}>{levelFor(pct)}</Badge>
        </div>
      </div>
      <div style={{ fontSize: 11.5, color: c.inkSoft, lineHeight: 1.4, minHeight: 30 }}>{s.desc}</div>
      <ProgressBar pct={pct} grad={meta.grad} c={c} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 11, color: c.inkFaint, fontWeight: 700 }}>{pct}% · {counts.done}/{counts.total} topics</div>
        <div style={{ fontSize: 11.5, fontWeight: 800, color: c.violet, display: "flex", alignItems: "center", gap: 3 }}>Continue<ChevronRight size={13}/></div>
      </div>
    </button>
  );
}

/* ============================== INLINE TOPIC QUIZ & ACCORDION (SAME-PAGE EXPERIENCE) ============================== */

function InlineTopicQuiz({ c, dark, skill, module, topic, onClose, onSetStatus }) {
  if (!topic) return null;
  const content = useMemo(() => {
    return getTopicContent(skill?.id, skill?.name, module?.title, topic.name);
  }, [skill, module, topic]);

  const [activeTab, setActiveTab] = useState("quiz"); // "quiz" | "faqs"
  const [currentQ, setCurrentQ] = useState(0); // 0 to 9
  const [quizAnswers, setQuizAnswers] = useState({}); // { [qIndex]: selectedOptionIndex }
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(0);
  const [reviewMode, setReviewMode] = useState("step"); // "step" | "list"

  const quizzes = content.quizzes || [];
  const answeredCount = Object.keys(quizAnswers).length;
  const score = quizzes.filter((q, idx) => quizAnswers[idx] === q.answer).length;
  const isPassed = score >= 7;

  function handleSelectOption(qIdx, optIdx) {
    if (isSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  }

  function handleSubmitQuiz() {
    setIsSubmitted(true);
  }

  function handleRetakeQuiz() {
    setQuizAnswers({});
    setIsSubmitted(false);
    setCurrentQ(0);
    setReviewMode("step");
  }

  return (
    <div
      className="cly-anim-fadein"
      style={{
        marginTop: 10,
        marginBottom: 8,
        padding: "20px 22px",
        borderRadius: 16,
        border: `1.5px solid ${c.violet}40`,
        background: dark ? "rgba(20, 16, 36, 0.95)" : "#F8FAFC",
        boxShadow: dark ? "0 8px 24px rgba(0,0,0,0.35)" : "0 4px 18px rgba(0,0,0,0.05)"
      }}
    >
      {/* Top Inline Header Bar */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 9px", borderRadius: 6, background: `${c.violet}16`, color: c.violet }}>
              {module?.title || "Module"}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 6,
              background: topic.difficulty === "Advanced" ? `${c.blush}18` : topic.difficulty === "Intermediate" ? `${c.peach}18` : `${c.mint}18`,
              color: topic.difficulty === "Advanced" ? c.blush : topic.difficulty === "Intermediate" ? c.peach : c.mint
            }}>
              {topic.difficulty}
            </span>
            <span style={{ fontSize: 11.5, color: c.inkFaint, fontWeight: 600 }}>
              ⏱ {topic.time} min test
            </span>
            <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 9px", borderRadius: 6, background: `${c.mint}18`, color: c.mint }}>
              10 Placement Questions
            </span>
          </div>

          <div className="headfont" style={{ fontWeight: 800, fontSize: 17, color: c.ink }}>
            {topic.name} — Interactive Placement Quiz
          </div>
          <div style={{ fontSize: 12.5, color: c.inkSoft, marginTop: 2, maxWidth: 680 }}>
            {topic.desc}
          </div>
        </div>

        {/* Quick action buttons & Close */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => onSetStatus(topic.status === "in-progress" ? "todo" : "in-progress")}
            className="cly-focus"
            style={{
              padding: "6px 12px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.bgCard,
              color: topic.status === "in-progress" ? c.peach : c.inkSoft, fontSize: 12, fontWeight: 700, cursor: "pointer"
            }}
          >
            {topic.status === "in-progress" ? "● In Progress" : "Mark In Progress"}
          </button>

          <button
            type="button"
            onClick={() => onSetStatus(topic.status === "done" ? "todo" : "done")}
            className="cly-focus"
            style={{
              padding: "6px 14px", borderRadius: 8, border: "none",
              background: topic.status === "done" ? c.mint : c.violet,
              color: "#FFFFFF", fontSize: 12, fontWeight: 800, cursor: "pointer"
            }}
          >
            {topic.status === "done" ? "✓ Completed" : "Mark Complete"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="cly-focus"
            title="Close Quiz"
            style={{
              display: "inline-flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 8,
              border: `1px solid ${c.border}`, background: c.bgCard, color: c.inkSoft, fontSize: 12, fontWeight: 700, cursor: "pointer"
            }}
          >
            <X size={14} /> Close
          </button>
        </div>
      </div>

      {/* Tabs: Quiz vs Concept FAQs */}
      <div style={{
        display: "flex", padding: 3, borderRadius: 10, background: c.bgAlt,
        border: `1px solid ${c.border}`, marginBottom: 16, maxWidth: 420
      }}>
        <button
          type="button"
          onClick={() => setActiveTab("quiz")}
          className="cly-focus"
          style={{
            flex: 1.2, padding: "7px 0", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12.5, fontWeight: 800,
            background: activeTab === "quiz" ? c.bgCard : "transparent",
            color: activeTab === "quiz" ? c.violet : c.inkSoft,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            boxShadow: activeTab === "quiz" ? "0 2px 6px rgba(0,0,0,0.06)" : "none"
          }}
        >
          <span>📝</span> 10-Question Quiz
          {isSubmitted ? (
            <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 6, background: isPassed ? `${c.mint}25` : `${c.blush}20`, color: isPassed ? c.mint : c.blush, fontWeight: 800 }}>
              {score}/10
            </span>
          ) : (
            <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 6, background: `${c.violet}15`, color: c.violet, fontWeight: 700 }}>
              {answeredCount}/10
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("faqs")}
          className="cly-focus"
          style={{
            flex: 1, padding: "7px 0", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12.5, fontWeight: 800,
            background: activeTab === "faqs" ? c.bgCard : "transparent",
            color: activeTab === "faqs" ? c.violet : c.inkSoft,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            boxShadow: activeTab === "faqs" ? "0 2px 6px rgba(0,0,0,0.06)" : "none"
          }}
        >
          <HelpCircle size={14} color={activeTab === "faqs" ? c.violet : c.inkSoft} /> FAQs ({content.faqs.length})
        </button>
      </div>

      {/* ================= QUIZ TAB ================= */}
      {activeTab === "quiz" && (
        <div>
          {/* Post-Submission Result Card */}
          {isSubmitted && (
            <div style={{
              borderRadius: 14, padding: "16px 18px", marginBottom: 16,
              background: isPassed
                ? (dark ? "rgba(16, 185, 129, 0.15)" : "linear-gradient(135deg, rgba(5, 150, 105, 0.08), rgba(2, 132, 199, 0.08))")
                : (dark ? "rgba(239, 68, 68, 0.12)" : "rgba(239, 68, 68, 0.06)"),
              border: `1.5px solid ${isPassed ? c.mint : "#EF4444"}`
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{isPassed ? "🎉" : "⚠️"}</span>
                    <span className="headfont" style={{ fontWeight: 800, fontSize: 16, color: isPassed ? c.mint : "#EF4444" }}>
                      {isPassed ? "Passed! Placement Ready Score" : "Needs Review (Passing Mark: 7/10)"}
                    </span>
                    <span style={{
                      padding: "3px 10px", borderRadius: 6, fontWeight: 800, fontSize: 13,
                      background: isPassed ? c.mint : "#EF4444", color: "#FFFFFF"
                    }}>
                      {score} / 10 ({score * 10}%)
                    </span>
                  </div>
                  <div style={{ fontSize: 12.5, color: c.inkSoft, marginTop: 4 }}>
                    {isPassed
                      ? "Great job! You have demonstrated strong concept clarity for this topic."
                      : `You answered ${score} out of 10 correctly. Review the explanations below and retake to score 70%+`}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={handleRetakeQuiz}
                    className="cly-focus"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 8,
                      border: `1px solid ${c.border}`, background: c.bgCard, color: c.ink, fontSize: 12, fontWeight: 700, cursor: "pointer"
                    }}
                  >
                    <RotateCcw size={13} /> Retake Quiz
                  </button>

                  {isPassed && (
                    <button
                      type="button"
                      onClick={() => onSetStatus("done")}
                      className="cly-focus"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 16px", borderRadius: 8,
                        border: "none", background: c.mint, color: "#FFFFFF", fontSize: 12, fontWeight: 800, cursor: "pointer"
                      }}
                    >
                      <CheckCircle2 size={14} /> Mark Completed ✓
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Question Navigator (1 to 10 Pills) */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
            padding: "10px 14px", borderRadius: 12, background: c.bgCard, border: `1px solid ${c.border}`, marginBottom: 14
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: c.inkSoft, fontWeight: 700 }}>
              <span>Questions:</span>
              <span style={{ color: c.violet, fontWeight: 800 }}>{answeredCount}/10 Answered</span>
            </div>

            {/* 1 to 10 buttons */}
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {quizzes.map((q, idx) => {
                const isAns = quizAnswers[idx] !== undefined;
                const isCur = currentQ === idx && reviewMode === "step";
                let bg = c.bgAlt;
                let bdr = c.border;
                let col = c.inkSoft;

                if (isSubmitted) {
                  const isRight = quizAnswers[idx] === q.answer;
                  bg = isRight ? `${c.mint}22` : "rgba(239, 68, 68, 0.15)";
                  bdr = isRight ? c.mint : "#EF4444";
                  col = isRight ? c.mint : "#EF4444";
                } else if (isCur) {
                  bg = `${c.violet}20`;
                  bdr = c.violet;
                  col = c.violet;
                } else if (isAns) {
                  bg = `${c.babyBlue}15`;
                  bdr = `${c.babyBlue}40`;
                  col = c.ink;
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => { setCurrentQ(idx); setReviewMode("step"); }}
                    className="cly-focus"
                    style={{
                      width: 30, height: 30, borderRadius: 7, border: `1.5px solid ${bdr}`,
                      background: bg, color: col, fontSize: 12, fontWeight: isCur || isAns ? 800 : 600,
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.12s",
                      boxShadow: isCur ? `0 0 0 2px ${c.violet}30` : "none"
                    }}
                  >
                    {isSubmitted ? (quizAnswers[idx] === q.answer ? "✓" : "✗") : idx + 1}
                  </button>
                );
              })}
            </div>

            {isSubmitted && (
              <button
                type="button"
                onClick={() => setReviewMode(reviewMode === "list" ? "step" : "list")}
                className="cly-focus"
                style={{
                  padding: "5px 10px", borderRadius: 6, border: `1px solid ${c.border}`, background: c.bgAlt,
                  fontSize: 11.5, fontWeight: 700, color: c.inkSoft, cursor: "pointer"
                }}
              >
                {reviewMode === "list" ? "View by Step" : "View All 10"}
              </button>
            )}
          </div>

          {/* ACTIVE QUESTION STEP VIEW */}
          {(!isSubmitted || reviewMode === "step") && quizzes[currentQ] && (
            <div style={{
              borderRadius: 14, padding: "18px 20px", border: `1px solid ${c.border}`,
              background: c.bgCard, marginBottom: 14
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{
                  padding: "3px 10px", borderRadius: 6, background: `${c.violet}16`, color: c.violet,
                  fontWeight: 800, fontSize: 12
                }}>
                  Question {currentQ + 1} of 10
                </span>
                {quizAnswers[currentQ] !== undefined && !isSubmitted && (
                  <span style={{ fontSize: 11.5, color: c.mint, fontWeight: 700 }}>
                    ● Option selected
                  </span>
                )}
              </div>

              {/* Question Text */}
              <div style={{ fontWeight: 700, fontSize: 15, color: c.ink, lineHeight: 1.5, marginBottom: 16 }}>
                {quizzes[currentQ].question}
              </div>

              {/* 4 Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 16 }}>
                {quizzes[currentQ].options.map((opt, optIdx) => {
                  const letter = String.fromCharCode(65 + optIdx);
                  const isSelected = quizAnswers[currentQ] === optIdx;
                  const isRightAnswer = optIdx === quizzes[currentQ].answer;

                  let optBg = c.bgAlt;
                  let optBorder = c.border;
                  let optColor = c.ink;

                  if (isSubmitted) {
                    if (isRightAnswer) {
                      optBg = `${c.mint}20`;
                      optBorder = c.mint;
                      optColor = c.ink;
                    } else if (isSelected && !isRightAnswer) {
                      optBg = "rgba(239, 68, 68, 0.15)";
                      optBorder = "#EF4444";
                      optColor = c.ink;
                    }
                  } else if (isSelected) {
                    optBg = `${c.violet}15`;
                    optBorder = c.violet;
                    optColor = c.ink;
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(currentQ, optIdx)}
                      className="cly-focus"
                      style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 10,
                        border: `1.5px solid ${optBorder}`, background: optBg, color: optColor,
                        fontSize: 13, fontWeight: isSelected || (isSubmitted && isRightAnswer) ? 700 : 500,
                        cursor: isSubmitted ? "default" : "pointer", textAlign: "left", transition: "all 0.12s"
                      }}
                    >
                      <span style={{
                        width: 24, height: 24, borderRadius: 6,
                        background: isSubmitted && isRightAnswer ? c.mint : isSubmitted && isSelected && !isRightAnswer ? "#EF4444" : isSelected ? c.violet : `${c.violet}18`,
                        color: (isSubmitted && (isRightAnswer || isSelected)) || isSelected ? "#fff" : c.violet,
                        fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                      }}>
                        {isSubmitted && isRightAnswer ? "✓" : isSubmitted && isSelected && !isRightAnswer ? "✗" : letter}
                      </span>
                      <span style={{ flex: 1, lineHeight: 1.4 }}>{opt}</span>
                      {isSubmitted && isRightAnswer && (
                        <span style={{ fontSize: 11.5, fontWeight: 800, color: c.mint }}>✓ Correct</span>
                      )}
                      {isSubmitted && isSelected && !isRightAnswer && (
                        <span style={{ fontSize: 11.5, fontWeight: 800, color: "#EF4444" }}>✗ Your Choice</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Technical Explanation in submitted mode */}
              {isSubmitted && (
                <div style={{
                  padding: "12px 14px", borderRadius: 10,
                  background: quizAnswers[currentQ] === quizzes[currentQ].answer ? `${c.mint}12` : "rgba(239, 68, 68, 0.08)",
                  border: `1px solid ${quizAnswers[currentQ] === quizzes[currentQ].answer ? c.mint + "40" : "#EF444440"}`,
                  marginBottom: 14
                }}>
                  <div style={{ fontWeight: 800, fontSize: 12, color: quizAnswers[currentQ] === quizzes[currentQ].answer ? c.mint : "#EF4444", marginBottom: 3 }}>
                    💡 Technical Explanation:
                  </div>
                  <div style={{ fontSize: 12.5, color: c.inkSoft, lineHeight: 1.5 }}>
                    {quizzes[currentQ].explanation}
                  </div>
                </div>
              )}

              {/* Prev / Next & Submit Controls */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <button
                  type="button"
                  disabled={currentQ === 0}
                  onClick={() => setCurrentQ(prev => Math.max(0, prev - 1))}
                  className="cly-focus"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 5, padding: "8px 14px", borderRadius: 8,
                    border: `1px solid ${c.border}`, background: c.bgAlt, color: c.ink, fontSize: 12, fontWeight: 700,
                    cursor: currentQ === 0 ? "not-allowed" : "pointer", opacity: currentQ === 0 ? 0.4 : 1
                  }}
                >
                  <ChevronLeft size={14} /> Previous
                </button>

                <div style={{ fontSize: 12, color: c.inkFaint, fontWeight: 700 }}>
                  Question {currentQ + 1} of 10
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {currentQ < 9 && (
                    <button
                      type="button"
                      onClick={() => setCurrentQ(prev => Math.min(9, prev + 1))}
                      className="cly-focus"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 5, padding: "8px 15px", borderRadius: 8,
                        border: "none", background: c.violet, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer"
                      }}
                    >
                      Next <ChevronRight size={14} />
                    </button>
                  )}

                  {!isSubmitted && (
                    <button
                      type="button"
                      onClick={handleSubmitQuiz}
                      className="cly-focus"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 5, padding: "8px 18px", borderRadius: 8,
                        border: "none", cursor: "pointer", color: "#FFFFFF", fontWeight: 800, fontSize: 12.5,
                        background: answeredCount === 10 ? "linear-gradient(135deg, #10B981, #059669)" : c.violet,
                        boxShadow: "0 3px 10px -2px rgba(37,99,235,0.4)"
                      }}
                    >
                      <CheckCircle2 size={14} /> Submit ({answeredCount}/10)
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* FULL REVIEW MODE (All 10 Questions displayed in a clean list) */}
          {isSubmitted && reviewMode === "list" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {quizzes.map((quiz, qIdx) => {
                const selectedOpt = quizAnswers[qIdx];
                const isCorrect = selectedOpt === quiz.answer;

                return (
                  <div
                    key={qIdx}
                    style={{
                      borderRadius: 12, padding: "14px 16px", border: `1.5px solid ${isCorrect ? c.mint + "50" : "#EF444450"}`,
                      background: c.bgCard
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                      <span style={{
                        width: 22, height: 22, borderRadius: 6, background: isCorrect ? c.mint : "#EF4444", color: "#fff",
                        fontWeight: 800, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1
                      }}>
                        {isCorrect ? "✓" : "✗"}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, color: isCorrect ? c.mint : "#EF4444", fontWeight: 800, marginBottom: 2 }}>
                          Question {qIdx + 1} • {isCorrect ? "Correct" : "Incorrect"}
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 13.5, color: c.ink, lineHeight: 1.4 }}>
                          {quiz.question}
                        </div>
                      </div>
                    </div>

                    {/* Options list in review */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10, paddingLeft: 30 }}>
                      {quiz.options.map((opt, optIdx) => {
                        const letter = String.fromCharCode(65 + optIdx);
                        const isThisSelected = selectedOpt === optIdx;
                        const isThisRight = optIdx === quiz.answer;

                        let optBg = "transparent";
                        let optBorder = c.border;
                        let optText = c.inkSoft;

                        if (isThisRight) {
                          optBg = `${c.mint}20`;
                          optBorder = c.mint;
                          optText = c.ink;
                        } else if (isThisSelected && !isThisRight) {
                          optBg = "rgba(239, 68, 68, 0.15)";
                          optBorder = "#EF4444";
                          optText = c.ink;
                        }

                        return (
                          <div
                            key={optIdx}
                            style={{
                              display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8,
                              border: `1px solid ${optBorder}`, background: optBg, color: optText, fontSize: 12,
                              fontWeight: isThisRight || isThisSelected ? 700 : 500
                            }}
                          >
                            <span style={{ fontWeight: 800, fontSize: 11 }}>({letter})</span>
                            <span style={{ flex: 1 }}>{opt}</span>
                            {isThisRight && <span style={{ fontSize: 11, fontWeight: 800, color: c.mint }}>✓ Correct</span>}
                            {isThisSelected && !isThisRight && <span style={{ fontSize: 11, fontWeight: 800, color: "#EF4444" }}>✗ Your Answer</span>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div style={{
                      marginLeft: 30, padding: "10px 12px", borderRadius: 8,
                      background: isCorrect ? `${c.mint}10` : "rgba(239, 68, 68, 0.06)",
                      border: `1px solid ${isCorrect ? c.mint + "30" : "#EF444430"}`
                    }}>
                      <div style={{ fontWeight: 800, fontSize: 11, color: isCorrect ? c.mint : "#EF4444", marginBottom: 2 }}>
                        Explanation:
                      </div>
                      <div style={{ fontSize: 12, color: c.inkSoft, lineHeight: 1.45 }}>
                        {quiz.explanation}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= CONCEPT & FAQS TAB ================= */}
      {activeTab === "faqs" && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 800, fontSize: 13.5, color: c.ink, marginBottom: 12 }}>
            <HelpCircle size={15} color={c.violet} />
            <span>Placement Interview Questions & Concepts</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
            {content.faqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    borderRadius: 10,
                    border: `1px solid ${isOpen ? c.violet + "40" : c.border}`,
                    background: isOpen ? (dark ? "rgba(165, 148, 255, 0.08)" : "rgba(37, 99, 235, 0.04)") : c.bgCard,
                    overflow: "hidden"
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? -1 : idx)}
                    className="cly-focus"
                    style={{
                      width: "100%", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between",
                      gap: 10, background: "none", border: "none", cursor: "pointer", textAlign: "left"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 20, height: 20, borderRadius: 5, background: `${c.violet}18`, color: c.violet, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10.5, fontWeight: 800, flexShrink: 0 }}>
                        Q{idx + 1}
                      </span>
                      <span style={{ fontWeight: 700, fontSize: 13, color: c.ink }}>
                        {faq.q}
                      </span>
                    </div>
                    <ChevronDown
                      size={14}
                      color={c.inkFaint}
                      style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0 }}
                    />
                  </button>

                  {isOpen && (
                    <div style={{ padding: "0 14px 12px 38px" }}>
                      <div style={{ fontSize: 12.5, color: c.inkSoft, lineHeight: 1.55, whiteSpace: "pre-line", marginBottom: 8 }}>
                        {faq.a}
                      </div>
                      {faq.tip && (
                        <div style={{
                          display: "flex", alignItems: "flex-start", gap: 6, padding: "8px 10px", borderRadius: 8,
                          background: `${c.mint}14`, border: `1px solid ${c.mint}33`, color: c.ink, fontSize: 11.5, fontWeight: 600
                        }}>
                          <span>💡</span>
                          <span><strong>Recruiter Tip:</strong> {faq.tip}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Key Takeaways */}
          <div style={{ borderRadius: 12, padding: "12px 14px", background: c.bgCard, border: `1px solid ${c.border}` }}>
            <div style={{ fontWeight: 800, fontSize: 11.5, color: c.inkSoft, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Key Placement Takeaways
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 4 }}>
              {content.keyTakeaways.map((takeaway, i) => (
                <li key={i} style={{ fontSize: 12, color: c.ink }}>{takeaway}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Bottom compact close button */}
      <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={onClose}
          className="cly-focus"
          style={{
            display: "inline-flex", alignItems: "center", gap: 4, padding: "6px 14px", borderRadius: 8,
            border: `1px solid ${c.border}`, background: c.bgCard, color: c.inkSoft, fontSize: 12, fontWeight: 700, cursor: "pointer"
          }}
        >
          ▲ Collapse Quiz Card
        </button>
      </div>
    </div>
  );
}

function TopicItem({ c, dark, topic, module, skill, isExpanded, onToggle, onSetStatus }) {
  const icon = topic.status === "done" ? <CheckCircle2 size={17} color={c.mint} />
    : topic.status === "in-progress" ? <div style={{ width: 17, height: 17, borderRadius: "50%", border: `2px solid ${c.peach}`, borderTopColor: "transparent" }} />
    : <Circle size={17} color={c.inkFaint} />;

  return (
    <div style={{
      borderRadius: 12,
      border: isExpanded ? `1.5px solid ${c.violet}` : `1px solid transparent`,
      background: isExpanded ? (dark ? "rgba(165, 148, 255, 0.05)" : "rgba(37, 99, 235, 0.03)") : "transparent",
      transition: "background 0.15s ease",
      overflow: "hidden"
    }}>
      {/* Clickable Topic Header Row */}
      <div
        onClick={onToggle}
        className="cly-focus"
        style={{
          display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10,
          cursor: "pointer", width: "100%", textAlign: "left", userSelect: "none"
        }}
        onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = c.bgAlt; }}
        onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = "transparent"; }}
      >
        {icon}
        <span style={{
          fontSize: 13, fontWeight: 600, flex: 1,
          color: topic.status === "done" ? c.inkFaint : c.ink,
          textDecoration: topic.status === "done" ? "line-through" : "none"
        }}>
          {topic.name}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 700,
            padding: "3px 8px", borderRadius: 6, background: `${c.violet}14`, color: c.violet
          }}>
            <HelpCircle size={11} /> FAQs
          </span>

          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 800,
            padding: "4px 12px", borderRadius: 8,
            background: isExpanded ? c.mint : `${c.mint}18`,
            color: isExpanded ? "#FFFFFF" : c.mint,
            border: `1px solid ${c.mint}35`,
            transition: "all 0.15s"
          }}>
            📝 {isExpanded ? "Hide Quiz ▴" : "Attend Quiz (10 Qs) ▾"}
          </span>

          {topic.status === "in-progress" && <Badge tone="peach" c={c}>In Progress</Badge>}
          {topic.status === "done" && <Badge tone="mint" c={c}>Completed</Badge>}

          <ChevronDown
            size={15}
            color={c.inkFaint}
            style={{
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease"
            }}
          />
        </div>
      </div>

      {/* Inline Quiz & FAQ Card on the EXACT SAME PAGE */}
      {isExpanded && (
        <div style={{ padding: "0 10px 10px 10px" }}>
          <InlineTopicQuiz
            c={c}
            dark={dark}
            skill={skill}
            module={module}
            topic={topic}
            onClose={onToggle}
            onSetStatus={onSetStatus}
          />
        </div>
      )}
    </div>
  );
}

function ModuleAccordion({ c, dark, module, skill, expandedTopicId, onToggleTopic, onSetStatus }) {
  const [open, setOpen] = useState(true);
  const done = module.topics.filter(t=>t.status==="done").length;
  const complete = done === module.topics.length;

  return (
    <div className="cly-card" style={{ borderRadius: 16, overflow: "hidden" }}>
      <button onClick={()=>setOpen(o=>!o)} className="cly-focus" style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "13px 14px",
        background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
        <div style={{ fontWeight: 800, fontSize: 13, flex: 1 }}>{module.title}</div>
        <Badge tone={complete ? "mint" : "violet"} c={c}>{done}/{module.topics.length}{complete ? " ✓" : ""}</Badge>
        <ChevronDown size={15} color={c.inkFaint} style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform .25s" }} />
      </button>

      {open && (
        <div style={{ padding: "0 8px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
          {module.topics.map(t => (
            <TopicItem
              key={t.id}
              c={c}
              dark={dark}
              topic={t}
              module={module}
              skill={skill}
              isExpanded={expandedTopicId === t.id}
              onToggle={() => onToggleTopic(t.id)}
              onSetStatus={(status) => onSetStatus(t.id, status)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CourseDetail({ c, dark, cat, s, onBack, onSetStatus }) {
  const pct = skillProgress(s);
  const counts = skillTopicCounts(s);
  const meta = CATEGORY_META[cat];
  const [expandedTopicId, setExpandedTopicId] = useState(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const courseContent = useMemo(() => {
    return getTopicContent(s.id, s.name, "Overview", s.name);
  }, [s]);

  // Filter modules and topics based on search and status
  const filteredModules = useMemo(() => {
    return s.modules.map(m => {
      const filtered = m.topics.filter(t => {
        if (query && !t.name.toLowerCase().includes(query.toLowerCase()) && !t.desc.toLowerCase().includes(query.toLowerCase())) {
          return false;
        }
        if (statusFilter === "done" && t.status !== "done") return false;
        if (statusFilter === "in-progress" && t.status !== "in-progress") return false;
        if (statusFilter === "todo" && (t.status === "done" || t.status === "in-progress")) return false;
        return true;
      });
      return { ...m, topics: filtered };
    }).filter(m => m.topics.length > 0);
  }, [s, query, statusFilter]);

  return (
    <div className="cly-anim-fadein">
      {/* Back button */}
      <button onClick={onBack} className="cly-focus" style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer",
        color: c.inkSoft, fontWeight: 700, fontSize: 13, marginBottom: 14 }}><ChevronLeft size={16}/> Back to All Courses</button>

      {/* Main Course Header Card */}
      <div className="cly-card" style={{ borderRadius: 22, padding: "24px 26px", display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center", marginBottom: 18 }}>
        <div style={{ width: 62, height: 62, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30,
          background: `linear-gradient(135deg, ${meta.grad[0]}22, ${meta.grad[1]}22)`, flexShrink: 0 }}>{s.icon}</div>
        <div style={{ flex: "1 1 240px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span className="headfont" style={{ fontWeight: 800, fontSize: 22, color: c.ink }}>{s.name}</span>
            <Badge tone="violet" c={c}>{meta.label}</Badge>
          </div>
          <div style={{ fontSize: 13, color: c.inkSoft }}>{s.desc}</div>
        </div>
        <ProgressRing pct={pct} size={94} stroke={9} grad={meta.grad} c={c} />
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 18 }} className="cly-grid-3">
        <MiniStat c={c} label="Completed Topics" value={counts.done} tone="mint" />
        <MiniStat c={c} label="In Progress" value={counts.inProgress} tone="peach" />
        <MiniStat c={c} label="Remaining" value={counts.remaining} tone="gray" />
      </div>

      {/* COURSE MASTERCLASS & EXPLAINING VIDEO CARD */}
      <div className="cly-card" style={{ borderRadius: 20, padding: 20, marginBottom: 22, background: dark ? "rgba(34, 28, 54, 0.7)" : "#fff", border: `1px solid ${c.border}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <Video size={15} />
            </div>
            <div>
              <div className="headfont" style={{ fontWeight: 800, fontSize: 16, color: c.ink }}>{s.name} Full Course Masterclass</div>
              <div style={{ fontSize: 12, color: c.inkSoft }}>
                {courseContent.video.title} • {courseContent.video.channel} ({courseContent.video.duration})
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <button
              type="button"
              onClick={() => window.open(courseContent.video.watchUrl, "_blank")}
              className="cly-focus"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10,
                background: "#EF4444", border: "none", color: "#FFFFFF", fontWeight: 800, fontSize: 12.5, cursor: "pointer",
                boxShadow: "0 4px 12px -3px rgba(239,68,68,0.4)"
              }}
            >
              <Play size={13} fill="#FFFFFF" /> Open on YouTube →
            </button>
            <button
              type="button"
              onClick={() => window.open(courseContent.video.youtubeSearchUrl, "_blank")}
              className="cly-focus"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 10,
                background: "#FF000015", border: "1px solid #FF000030", color: "#E02424", fontWeight: 700, fontSize: 12, cursor: "pointer"
              }}
            >
              <Youtube size={14} /> Full Course on YouTube
            </button>
            <button
              type="button"
              onClick={() => window.open(courseContent.video.googleSearchUrl, "_blank")}
              className="cly-focus"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 10,
                background: `${c.babyBlue}15`, border: `1px solid ${c.babyBlue}35`, color: c.babyBlue, fontWeight: 700, fontSize: 12, cursor: "pointer"
              }}
            >
              <Search size={13} /> Google Explanations
            </button>
          </div>
        </div>

        {/* Embedded Course Video */}
        <div style={{ position: "relative", width: "100%", paddingBottom: "52%", borderRadius: 14, overflow: "hidden", background: "#000", marginBottom: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
          <iframe
            src={courseContent.video.embedUrl}
            title={courseContent.video.title}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>

      {/* TOPIC SEARCH & STATUS FILTERS */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div className="headfont" style={{ fontWeight: 800, fontSize: 16, color: c.ink }}>Course Modules & Topics</div>
        
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {/* Search bar */}
          <div style={{ position: "relative", width: 220 }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: 9, color: c.inkFaint }} />
            <input
              className="cly-focus"
              style={{ ...inputStyle(c), paddingLeft: 30, paddingBlock: 6, fontSize: 12.5 }}
              placeholder="Search topics / FAQs..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>

          {/* Filter tabs */}
          <div style={{ display: "flex", padding: 3, borderRadius: 10, background: c.bgAlt, border: `1px solid ${c.border}` }}>
            {[
              { id: "all", label: "All" },
              { id: "in-progress", label: "In Progress" },
              { id: "done", label: "Completed" },
              { id: "todo", label: "Remaining" },
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatusFilter(f.id)}
                className="cly-focus"
                style={{
                  padding: "5px 10px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 11.5, fontWeight: 700,
                  background: statusFilter === f.id ? c.bgCard : "transparent",
                  color: statusFilter === f.id ? c.violet : c.inkSoft,
                  boxShadow: statusFilter === f.id ? "0 2px 6px rgba(0,0,0,0.06)" : "none"
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MODULES ACCORDION LIST */}
      {filteredModules.length === 0 ? (
        <div className="cly-card" style={{ borderRadius: 16, padding: "30px 20px", textAlign: "center", color: c.inkSoft }}>
          No topics matched your search or filter. Try a different query.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredModules.map(m => (
            <ModuleAccordion
              key={m.id}
              c={c}
              dark={dark}
              module={m}
              skill={s}
              expandedTopicId={expandedTopicId}
              onToggleTopic={(topicId) => setExpandedTopicId(cur => cur === topicId ? null : topicId)}
              onSetStatus={(topicId, status) => onSetStatus(s.id, topicId, status)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MiniStat({ c, label, value, tone }) {
  const map = { mint: c.mint, peach: c.peach, gray: c.inkFaint };
  return (
    <div className="cly-card" style={{ borderRadius: 14, padding: "14px 12px", textAlign: "center" }}>
      <div className="headfont" style={{ fontWeight: 800, fontSize: 22, color: map[tone] }}>{value}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: c.inkSoft, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function SkillsPage({ c, dark, skills, onSetTopicStatus }) {
  const [tab, setTab] = useState("all");
  const [openCourse, setOpenCourse] = useState(null); // { cat, skillId }
  const allSkills = CATEGORY_ORDER.flatMap(cat => skills[cat].map(s => ({ ...s, cat, pct: skillProgress(s) })));
  const gaps = [...allSkills].sort((a,b) => a.pct - b.pct);
  const overall = Math.round(allSkills.reduce((sum,s)=>sum+s.pct,0) / (allSkills.length||1));

  if (openCourse) {
    const s = skills[openCourse.cat].find(x => x.id === openCourse.skillId);
    if (s) return (
      <div style={{ padding: "0 26px 90px" }}>
        <CourseDetail c={c} dark={dark} cat={openCourse.cat} s={s} onBack={()=>setOpenCourse(null)}
          onSetStatus={(skillId, topicId, status)=>onSetTopicStatus(openCourse.cat, skillId, topicId, status)} />
      </div>
    );
  }

  const visibleCats = SKILL_TAB_GROUPS[tab].cats;

  return (
    <div style={{ padding: "0 26px 90px", display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="cly-anim-fadeup">
        <div className="headfont" style={{ fontSize: 21, fontWeight: 800 }}>Your Skills</div>
        <div style={{ fontSize: 13, color: c.inkSoft, marginTop: 3 }}>Build the skills that move your career forward.</div>
      </div>

      <div className="cly-card cly-anim-fadeup" style={{ borderRadius: 18, padding: "14px 18px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 13 }}>Overall Skill Progress</div>
        <div style={{ flex: 1 }}><ProgressBar pct={overall} grad={[c.violet, c.periwinkle]} c={c} height={9} /></div>
        <div className="headfont" style={{ fontWeight: 800, fontSize: 16, color: c.violet }}>{overall}%</div>
      </div>

      <div className="cly-card cly-anim-fadeup" style={{ borderRadius: 20, padding: 20 }}>
        <div style={{ fontWeight: 800, fontSize: 14.5, marginBottom: 6 }}>Skill Gaps</div>
        <div style={{ fontSize: 12, color: c.inkSoft, marginBottom: 8 }}>Sorted by where you need the most attention.</div>
        {gaps.slice(0, 6).map(s => <SkillGapRow key={s.cat+s.id} c={c} name={s.name} pct={s.pct} />)}
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }} className="cly-anim-fadeup">
        {Object.entries(SKILL_TAB_GROUPS).map(([id, g]) => {
          const active = tab === id;
          return (
            <button key={id} onClick={()=>setTab(id)} className="cly-focus" style={{ padding: "8px 14px", borderRadius: 12, cursor: "pointer",
              border: `1.5px solid ${active ? c.violet : c.border}`, background: active ? `linear-gradient(135deg, ${c.lavender}18, ${c.blush}18)` : c.bgCard,
              color: active ? c.violet : c.inkSoft, fontWeight: 700, fontSize: 12.5 }}>{g.label}</button>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }} className="cly-grid-3">
        {visibleCats.flatMap(cat => skills[cat].map(s => (
          <CourseCard key={cat+s.id} c={c} s={s} cat={cat} onOpen={()=>setOpenCourse({ cat, skillId: s.id })} />
        )))}
      </div>
    </div>
  );
}

/* ============================== ANALYTICS PAGE ============================== */
function AnalyticsPage({ c, state, readiness }) {
  const [range, setRange] = useState("7D");
  const days = range === "7D" ? 7 : range === "30D" ? 30 : range === "3M" ? 90 : 180;

  const activityData = useMemo(() => {
    const out = [];
    for (let i = days-1; i >= 0; i--) {
      const d = new Date(Date.now() - i*86400000);
      const key = d.toISOString().slice(0,10);
      const active = state.streak.history.includes(key);
      const tasksThatDay = state.tasks.filter(t => t.completedAt && t.completedAt.slice(0,10) === key).length;
      out.push({ date: key.slice(5), tasks: tasksThatDay, active: active ? 1 : 0 });
    }
    return out;
  }, [days, state]);

  const catData = CATEGORY_ORDER.map(cat => ({ name: CATEGORY_META[cat].label.split(" ")[0], value: readiness.catScores[cat], fill: CATEGORY_META[cat].grad[0] }));
  const stats = taskStats(state.tasks);
  const pieData = [{ name: "Completed", value: stats.completed }, { name: "Remaining", value: stats.total - stats.completed }];
  const activeDaysInRange = activityData.filter(d=>d.active).length;

  return (
    <div style={{ padding: "0 26px 90px", display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="cly-anim-fadeup" style={{ display: "flex", gap: 8 }}>
        {["7D","30D","3M","All"].map(r => (
          <button key={r} onClick={()=>setRange(r)} className="cly-focus" style={{ padding: "7px 14px", borderRadius: 10, cursor: "pointer",
            border: `1.5px solid ${range===r?c.violet:c.border}`, background: range===r? c.violet : c.bgCard, color: range===r?"#fff":c.inkSoft, fontWeight: 700, fontSize: 12 }}>{r}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }} className="cly-grid-2">
        <div className="cly-card cly-anim-fadeup" style={{ borderRadius: 20, padding: 18 }}>
          <div style={{ fontWeight: 800, fontSize: 13.5, marginBottom: 4 }}>Activity Over Time</div>
          <div style={{ fontSize: 11.5, color: c.inkSoft, marginBottom: 10 }}>{activeDaysInRange} active days in this range</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={activityData}>
              <defs><linearGradient id="fillTasks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={c.violet} stopOpacity={0.5}/><stop offset="95%" stopColor={c.violet} stopOpacity={0}/>
              </linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={c.border} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: c.inkFaint }} interval={Math.floor(days/7)} />
              <YAxis tick={{ fontSize: 10, fill: c.inkFaint }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 10, fontSize: 12 }} />
              <Area type="monotone" dataKey="tasks" stroke={c.violet} fill="url(#fillTasks)" strokeWidth={2} name="Tasks completed" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="cly-card cly-anim-fadeup" style={{ borderRadius: 20, padding: 18, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 13.5, alignSelf: "flex-start", marginBottom: 6 }}>Task Completion</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius={48} outerRadius={70} paddingAngle={3}>
                <Cell fill={c.violet} /><Cell fill={c.border} />
              </Pie>
              <Tooltip contentStyle={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 10, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ fontSize: 12, color: c.inkSoft, marginTop: -4 }}><b style={{color:c.ink}}>{stats.pct}%</b> of all tasks completed</div>
        </div>
      </div>

      <div className="cly-card cly-anim-fadeup" style={{ borderRadius: 20, padding: 18 }}>
        <div style={{ fontWeight: 800, fontSize: 13.5, marginBottom: 10 }}>Category Performance</div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={catData}>
            <CartesianGrid strokeDasharray="3 3" stroke={c.border} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: c.inkFaint }} />
            <YAxis tick={{ fontSize: 10, fill: c.inkFaint }} domain={[0,100]} />
            <Tooltip contentStyle={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 10, fontSize: 12 }} />
            <Bar dataKey="value" radius={[8,8,0,0]}>{catData.map((d,i)=><Cell key={i} fill={d.fill} />)}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ============================== READINESS PAGE ============================== */
function ReadinessPage({ c, readiness, state }) {
  const recs = useMemo(()=>buildRecommendations(state, readiness), [state, readiness]);
  const dots = CATEGORY_ORDER.map((cat, i) => ({ pos: (i/CATEGORY_ORDER.length)*100, color: CATEGORY_META[cat].grad[0] }));
  return (
    <div style={{ padding: "0 26px 90px", display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="cly-card cly-anim-fadeup" style={{ borderRadius: 22, padding: 26, display: "flex", gap: 26, flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
        <ProgressRing pct={readiness.score} size={190} stroke={15} grad={[c.violet, c.periwinkle]} c={c} label={readiness.level} dots={dots} />
        <div style={{ flex: "1 1 240px", minWidth: 240 }}>
          <div className="headfont" style={{ fontWeight: 800, fontSize: 17, marginBottom: 10 }}>Weighted Breakdown</div>
          {CATEGORY_ORDER.map(cat => (
            <div key={cat} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, marginBottom: 4 }}>
                <span style={{ fontWeight: 700 }}>{CATEGORY_META[cat].label} <span style={{ color: c.inkFaint }}>({CATEGORY_META[cat].weight}%)</span></span>
                <span style={{ fontWeight: 800 }}>{readiness.catScores[cat]}%</span>
              </div>
              <ProgressBar pct={readiness.catScores[cat]} grad={CATEGORY_META[cat].grad} c={c} height={6} />
            </div>
          ))}
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, marginBottom: 4 }}>
              <span style={{ fontWeight: 700 }}>Consistency <span style={{ color: c.inkFaint }}>(10%)</span></span>
              <span style={{ fontWeight: 800 }}>{readiness.consistency}%</span>
            </div>
            <ProgressBar pct={readiness.consistency} grad={[c.peach, c.blush]} c={c} height={6} />
          </div>
        </div>
      </div>
      <div className="cly-card cly-anim-fadeup" style={{ borderRadius: 20, padding: 20 }}>
        <div style={{ fontWeight: 800, fontSize: 14.5, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><Sparkles size={16} color={c.violet}/> Personalized Recommendations</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {recs.map(r => (
            <div key={r.id} style={{ display: "flex", gap: 10, padding: "12px 14px", borderRadius: 14, background: c.bgAlt }}>
              <IconBadge Icon={CATEGORY_META[r.cat]?.icon || Sparkles} grad={CATEGORY_META[r.cat]?.grad || [c.violet,c.blush]} size={30} />
              <div style={{ fontSize: 12.5, color: c.ink, lineHeight: 1.5, alignSelf: "center" }}>{r.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================== ACHIEVEMENTS PAGE ============================== */
function AchievementsPage({ c, achievements }) {
  return (
    <div style={{ padding: "0 26px 90px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }} className="cly-grid-3">
        {ACHIEVEMENT_DEFS.map((a, i) => {
          const unlockedAt = achievements[a.id];
          const unlocked = !!unlockedAt;
          return (
            <div key={a.id} className="cly-card cly-anim-fadeup" style={{ borderRadius: 20, padding: 20, textAlign: "center", position: "relative",
              opacity: unlocked ? 1 : 0.5, animationDelay: `${i*60}ms`, overflow: "hidden" }}>
              {unlocked && <div style={{ position: "absolute", inset: -20, background: `radial-gradient(circle at 50% 0%, ${c.lavender}22, transparent 60%)` }} />}
              <div style={{ position: "relative", fontSize: 40, marginBottom: 8, filter: unlocked ? `drop-shadow(0 0 12px ${c.lavender}88)` : "grayscale(1)" }}>{a.icon}</div>
              <div className="headfont" style={{ fontWeight: 800, fontSize: 13.5 }}>{a.label}</div>
              <div style={{ fontSize: 11, color: c.inkSoft, marginTop: 4 }}>{a.desc}</div>
              <div style={{ marginTop: 10 }}>
                {unlocked ? <Badge tone="mint" c={c}>Unlocked · {new Date(unlockedAt).toLocaleDateString()}</Badge> : <Badge tone="gray" c={c}><Lock size={9} style={{display:"inline",marginRight:3,verticalAlign:-1}}/>Locked</Badge>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================== HISTORY PAGE ============================== */
function HistoryPage({ c, history }) {
  const grouped = useMemo(() => {
    const g = {};
    [...history].reverse().forEach(h => { (g[h.date] = g[h.date] || []).push(h); });
    return Object.entries(g).sort((a,b) => new Date(b[0]) - new Date(a[0]));
  }, [history]);
  const dayLabel = (d) => {
    if (d === todayStr()) return "Today";
    if (d === new Date(Date.now()-86400000).toISOString().slice(0,10)) return "Yesterday";
    return new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };
  const iconFor = (type) => type === "task" ? "✓" : type === "milestone" ? "🏁" : type === "achievement" ? "🏆" : type === "streak" ? "🔥" : "↑";
  return (
    <div style={{ padding: "0 26px 90px" }}>
      {grouped.length === 0 ? <EmptyState icon={HistoryIcon} title="No history yet" subtitle="Complete tasks and milestones to build your activity timeline." c={c} /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {grouped.map(([date, items]) => (
            <div key={date} className="cly-anim-fadeup">
              <div style={{ fontWeight: 800, fontSize: 13, color: c.inkSoft, marginBottom: 8 }}>{dayLabel(date)}</div>
              <div className="cly-card" style={{ borderRadius: 16, padding: "6px 4px" }}>
                {items.map((h, i) => (
                  <div key={h.id} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", borderBottom: i < items.length-1 ? `1px solid ${c.border}` : "none" }}>
                    <span style={{ fontSize: 14 }}>{iconFor(h.type)}</span>
                    <span style={{ fontSize: 12.5, color: c.ink }}>{h.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================== PROFILE PAGE ============================== */
function ProfilePage({ c, profile, careerGoal, onSave }) {
  const [form, setForm] = useState({ ...profile, ...careerGoal });
  const [editing, setEditing] = useState(false);
  function save() { onSave(form); setEditing(false); }
  return (
    <div style={{ padding: "0 26px 90px" }}>
      <div className="cly-card cly-anim-fadeup" style={{ borderRadius: 22, padding: 26, maxWidth: 560 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg, ${c.lavender}, ${c.blush})`,
            display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 24, fontWeight: 800 }}>
            {(profile.name||"?").charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="headfont" style={{ fontWeight: 800, fontSize: 19 }}>{profile.name}</div>
            <div style={{ fontSize: 12.5, color: c.inkSoft }}>{profile.department} · {profile.year}</div>
          </div>
          <button onClick={()=>setEditing(e=>!e)} className="cly-focus" style={{ marginLeft: "auto", padding: "8px 14px", borderRadius: 11, border: `1px solid ${c.border}`,
            background: c.bgAlt, cursor: "pointer", fontWeight: 700, fontSize: 12, color: c.violet, display: "flex", alignItems: "center", gap: 5 }}>
            <Edit2 size={12}/> {editing ? "Cancel" : "Edit"}
          </button>
        </div>
        {editing ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Field label="Name" c={c}><input className="cly-input cly-focus" style={inputStyle(c)} value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></Field>
            <Field label="College" c={c}><input className="cly-input cly-focus" style={inputStyle(c)} value={form.college} onChange={e=>setForm({...form,college:e.target.value})}/></Field>
            <div style={{ display: "flex", gap: 10 }}>
              <Field label="Department" c={c}><input className="cly-input cly-focus" style={inputStyle(c)} value={form.department} onChange={e=>setForm({...form,department:e.target.value})}/></Field>
              <Field label="Year" c={c}><input className="cly-input cly-focus" style={inputStyle(c)} value={form.year} onChange={e=>setForm({...form,year:e.target.value})}/></Field>
            </div>
            <Field label="Target role" c={c}>
              <select className="cly-input cly-focus" style={inputStyle(c)} value={form.targetRole} onChange={e=>setForm({...form,targetRole:e.target.value})}>
                {ROLES.map(r=><option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Target placement date" c={c}><input type="date" className="cly-input cly-focus" style={inputStyle(c)} value={form.targetDate} onChange={e=>setForm({...form,targetDate:e.target.value})}/></Field>
            <button onClick={save} className="cly-focus" style={{ marginTop: 6, padding: "11px 0", borderRadius: 12, border: "none", cursor: "pointer",
              fontWeight: 800, color: "#fff", background: `linear-gradient(135deg, ${c.violet}, ${c.periwinkle})` }}>Save Changes</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <InfoRow c={c} label="College" value={profile.college} />
            <InfoRow c={c} label="Department" value={profile.department} />
            <InfoRow c={c} label="Year" value={profile.year} />
            <InfoRow c={c} label="Target Role" value={careerGoal.targetRole} />
            <InfoRow c={c} label="Target Placement Date" value={careerGoal.targetDate} />
            <InfoRow c={c} label="Preparation Level" value={careerGoal.level} />
          </div>
        )}
      </div>
    </div>
  );
}
function InfoRow({ c, label, value }) {
  return (<div><div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: .5, color: c.inkFaint, textTransform: "uppercase" }}>{label}</div>
    <div style={{ fontSize: 13.5, fontWeight: 700, color: c.ink, marginTop: 3 }}>{value || "—"}</div></div>);
}

/* ============================== SETTINGS PAGE ============================== */
function SettingsPage({ c, dark, setDark, settings, onSettingsChange, onExport, onReset }) {
  const [confirmReset, setConfirmReset] = useState(false);
  return (
    <div style={{ padding: "0 26px 90px", display: "flex", flexDirection: "column", gap: 16, maxWidth: 560 }}>
      <SettingsSection c={c} title="Appearance">
        <ToggleRow c={c} label="Dark mode" desc="Keep the Careerly aesthetic in low light." checked={dark} onChange={()=>setDark(d=>!d)} />
      </SettingsSection>
      <SettingsSection c={c} title="Notifications">
        <ToggleRow c={c} label="Reminders" desc="Get nudged about pending tasks and streaks." checked={settings.notifications} onChange={()=>onSettingsChange({...settings, notifications: !settings.notifications})} />
      </SettingsSection>
      <SettingsSection c={c} title="Data Management">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={onExport} className="cly-focus" style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 14px", borderRadius: 13,
            border: `1px solid ${c.border}`, background: c.bgAlt, cursor: "pointer", fontWeight: 700, fontSize: 13, color: c.violet }}>
            <Download size={15}/> Export progress data (JSON)
          </button>
          {!confirmReset ? (
            <button onClick={()=>setConfirmReset(true)} className="cly-focus" style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 14px", borderRadius: 13,
              border: `1px solid #E0577A44`, background: "transparent", cursor: "pointer", fontWeight: 700, fontSize: 13, color: "#E0577A" }}>
              <RotateCcw size={15}/> Reset all progress
            </button>
          ) : (
            <div style={{ padding: "12px 14px", borderRadius: 13, border: "1px solid #E0577A44", background: "#E0577A11" }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: c.ink, marginBottom: 8 }}>This clears all tasks, skills and progress. This can't be undone.</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={()=>{onReset(); setConfirmReset(false);}} className="cly-focus" style={{ padding: "7px 14px", borderRadius: 10, border: "none", background: "#E0577A", color: "#fff", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>Yes, reset</button>
                <button onClick={()=>setConfirmReset(false)} className="cly-focus" style={{ padding: "7px 14px", borderRadius: 10, border: `1px solid ${c.border}`, background: "none", color: c.inkSoft, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </SettingsSection>
    </div>
  );
}
function SettingsSection({ c, title, children }) {
  return (<div className="cly-card cly-anim-fadeup" style={{ borderRadius: 18, padding: 18 }}>
    <div style={{ fontWeight: 800, fontSize: 13.5, marginBottom: 12 }}>{title}</div>{children}</div>);
}
function ToggleRow({ c, label, desc, checked, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>{label}</div>
        <div style={{ fontSize: 11.5, color: c.inkSoft }}>{desc}</div>
      </div>
      <button onClick={onChange} className="cly-focus" style={{ width: 42, height: 24, borderRadius: 99, border: "none", cursor: "pointer", position: "relative",
        background: checked ? `linear-gradient(135deg, ${c.violet}, ${c.periwinkle})` : c.border, transition: "background .2s" }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: checked ? 21 : 3, transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,.2)" }} />
      </button>
    </div>
  );
}

/* ============================== PAGE TITLES ============================== */
const PAGE_META = {
  dashboard: { title: "Dashboard", sub: "Your placement prep, at a glance." },
  roadmap: { title: "My Roadmap", sub: "Your step-by-step career journey." },
  tasks: { title: "Tasks", sub: "Create, track and complete preparation tasks." },
  skills: { title: "Skills", sub: "Track competency across every category." },
  analytics: { title: "Analytics", sub: "Trends, consistency and category performance." },
  readiness: { title: "Readiness", sub: "Your placement readiness, explained." },
  achievements: { title: "Achievements", sub: "Milestones worth celebrating." },
  history: { title: "History", sub: "A timeline of your preparation journey." },
  profile: { title: "Profile", sub: "Your details and career goal." },
  settings: { title: "Settings", sub: "Appearance, data and notifications." },
};

/* ============================== ROOT APP ============================== */
export default function CareerlyApp() {
  const [authState, setAuthState] = useState("loading"); // loading | auth | onboarding | reveal | app
  const [data, setData] = useState(null);
  const [dark, setDark] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = loadData();
    if (saved) {
      setData(saved);
      setDark(saved.settings?.theme === "dark");
      setAuthState(saved.onboarded ? "app" : "onboarding");
    } else {
      setAuthState("auth");
    }
  }, []);

  useEffect(() => { if (data) saveData({ ...data, settings: { ...data.settings, theme: dark ? "dark" : "light" } }); }, [dark]); // eslint-disable-line
  useEffect(() => { if (data) saveData(data); }, [data]);

  const c = dark ? DARK : T;

  function pushHistory(state, entries) {
    return { ...state, history: [...state.history, ...entries.map((e,i) => ({ id: `h_${Date.now()}_${i}`, date: todayStr(), ...e }))] };
  }

  function reconcile(state, opts = {}) {
    // Recompute readiness / milestones / achievements and push history + toasts as needed.
    const readiness = computeReadiness(state);
    const milestones = computeMilestones(state, readiness);
    const { achievements, unlockedNow } = checkAchievements(state, readiness, milestones);
    let next = { ...state, achievements };
    let entries = [];
    if (opts.taskCompletedTitle) entries.push({ type: "task", text: `Completed "${opts.taskCompletedTitle}"` });
    if (opts.topicCompletedText) entries.push({ type: "task", text: opts.topicCompletedText });
    if (opts.streakBumped) entries.push({ type: "streak", text: `Streak reached ${next.streak.current} days` });
    unlockedNow.forEach(id => {
      const def = ACHIEVEMENT_DEFS.find(a => a.id === id);
      entries.push({ type: "achievement", text: `Unlocked "${def.label}"` });
    });
    if (opts.prevScore !== undefined && opts.prevScore !== readiness.score) {
      entries.push({ type: "readiness", text: `Readiness updated to ${readiness.score}%` });
    }
    if (entries.length) next = pushHistory(next, entries);

    if (opts.streakBumped) {
      setToast({ emoji: "🔥", title: `${next.streak.current} day streak!`, subtitle: "You're building an amazing habit.", c });
    } else if (unlockedNow.length) {
      const def = ACHIEVEMENT_DEFS.find(a => a.id === unlockedNow[0]);
      setToast({ emoji: def.icon, title: "Achievement Unlocked!", subtitle: def.label, c });
    }
    return next;
  }

  function markActivity(state) {
    const before = state.streak;
    const bumped = bumpStreak(before);
    return { state: { ...state, streak: bumped }, bumped: bumped.current !== before.current };
  }

  const readiness = useMemo(() => data ? computeReadiness(data) : null, [data]);
  const milestones = useMemo(() => data && readiness ? computeMilestones(data, readiness) : [], [data, readiness]);

  function handleAuth(payload) {
    if (payload.type === "login") {
      const existing = loadData();
      if (existing) { setData(existing); setAuthState(existing.onboarded ? "app" : "onboarding"); }
      else { const fresh = emptyData(payload.email.split("@")[0]); setData(fresh); setAuthState("onboarding"); }
    } else {
      const fresh = emptyData(payload.name, { profile: { name: payload.name, college: payload.college, department: payload.department, year: payload.year, avatarSeed: payload.name }, user: { name: payload.name, email: payload.email } });
      setData(fresh); setAuthState("onboarding");
    }
  }
  function handleDemo(personaKey = "sivaranjani") {
    const persona = DEMO_PERSONAS[personaKey] || DEMO_PERSONAS.sivaranjani;
    const fresh = defaultData(persona.name);
    fresh.profile = {
      ...fresh.profile,
      name: persona.name,
      college: persona.college,
      department: persona.department,
      year: persona.year,
      degree: persona.degree || "B.E / B.Tech",
      avatarSeed: persona.name,
    };
    fresh.user = {
      ...fresh.user,
      name: persona.name,
      email: `${persona.name.toLowerCase().replace(/\s+/g, "")}@college.edu`,
    };
    fresh.careerGoal = {
      ...fresh.careerGoal,
      targetRole: persona.targetRole || persona.role || "Software Developer",
      targetCompanyTier: persona.targetCompanyTier || persona.tier || "tier1",
      degree: persona.degree || "B.E / B.Tech",
      pace: persona.pace || "90days",
      weeklyHours: persona.weeklyHours || "15h",
      primaryStack: persona.primaryStack || persona.stack || "cpp_dsa",
      focusAreas: persona.focusAreas || ["technical", "projects", "aptitude", "interview"],
      targetDate: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
      level: persona.level || "Intermediate",
    };
    fresh.customMilestones = [];
    fresh.milestoneSubtasks = {};
    setData(fresh);
    saveData(fresh);
    setAuthState("app");
    setPage("roadmap");
  }
  function handleOnboardingComplete(form) {
    setData(d => ({
      ...d,
      onboarded: true,
      profile: {
        ...d.profile,
        name: form.name,
        college: form.college,
        department: form.department,
        year: form.year,
        degree: form.degree,
      },
      user: { ...d.user, name: form.name },
      careerGoal: {
        ...d.careerGoal,
        targetRole: form.targetRole,
        targetCompanyTier: form.targetCompanyTier,
        pace: form.pace,
        weeklyHours: form.weeklyHours,
        primaryStack: form.primaryStack,
        focusAreas: form.focusAreas,
        targetDate: form.targetDate,
        level: form.level || "Beginner to Placement-Ready",
      },
    }));
    setAuthState("reveal");
  }

  function updateAndReconcile(mutator, opts) {
    setData(prev => {
      const prevReadiness = computeReadiness(prev);
      let next = mutator(prev);
      next = reconcile(next, { ...opts, prevScore: prevReadiness.score });
      return next;
    });
  }

  function toggleTask(id) {
    setData(prev => {
      const prevReadiness = computeReadiness(prev);
      const task = prev.tasks.find(t => t.id === id);
      const willComplete = task.status !== "Completed";
      const tasks = prev.tasks.map(t => t.id === id ? { ...t, status: willComplete ? "Completed" : "Pending", completedAt: willComplete ? new Date().toISOString() : null } : t);
      let next = { ...prev, tasks };
      let bumped = false;
      if (willComplete) { const r = markActivity(next); next = r.state; bumped = r.bumped; }
      next = reconcile(next, { taskCompletedTitle: willComplete ? task.title : undefined, streakBumped: bumped, prevScore: prevReadiness.score });
      return next;
    });
  }
  function addTask(t) {
    setData(prev => ({ ...prev, tasks: [...prev.tasks, { id: `task_${Date.now()}`, ...t, description: t.description||"", status: "Pending", createdAt: new Date().toISOString(), completedAt: null }] }));
  }
  function editTask(t) { setData(prev => ({ ...prev, tasks: prev.tasks.map(x => x.id === t.id ? { ...x, ...t } : x) })); }
  function deleteTask(id) { setData(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) })); }

  function setTopicStatus(cat, skillId, topicId, status) {
    setData(prev => {
      const prevReadiness = computeReadiness(prev);
      let justCompleted = false; let skillName = "", topicName = "";
      const skills = { ...prev.skills, [cat]: prev.skills[cat].map(s => {
        if (s.id !== skillId) return s;
        skillName = s.name;
        return { ...s, modules: s.modules.map(m => ({ ...m, topics: m.topics.map(t => {
          if (t.id !== topicId) return t;
          topicName = t.name;
          if (status === "done" && t.status !== "done") justCompleted = true;
          return { ...t, status };
        }) })) };
      })};
      let next = { ...prev, skills };
      let bumped = false;
      if (justCompleted) { const r = markActivity(next); next = r.state; bumped = r.bumped; }
      next = reconcile(next, { topicCompletedText: justCompleted ? `Completed "${topicName}" in ${skillName}` : undefined, streakBumped: bumped, prevScore: prevReadiness.score });
      return next;
    });
  }

  function saveProfile(form) {
    setData(prev => ({ ...prev, profile: { ...prev.profile, name: form.name, college: form.college, department: form.department, year: form.year },
      careerGoal: { ...prev.careerGoal, targetRole: form.targetRole, targetDate: form.targetDate } }));
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `careerly-progress-${todayStr()}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    setToast({ emoji: "📦", title: "Export ready", subtitle: "Your progress report has downloaded.", c });
  }
  function resetProgress() {
    const fresh = emptyData(data.profile.name, { profile: data.profile, user: data.user, careerGoal: data.careerGoal, onboarded: true });
    setData(fresh);
    setToast({ emoji: "♻️", title: "Progress reset", subtitle: "Starting fresh — you've got this.", c });
  }
  function logout() { localStorage.removeItem(STORAGE_KEY); setData(null); setAuthState("auth"); setPage("dashboard"); }

  if (authState === "loading") return <div className="cly" style={{ minHeight: "100vh", background: T.bg }} />;
  if (authState === "auth") return <AuthScreen dark={dark} onAuth={handleAuth} onDemo={handleDemo} />;
  if (authState === "onboarding") return <Onboarding dark={dark} initial={data?.profile} onComplete={handleOnboardingComplete} />;
  if (authState === "reveal") return <RoadmapReveal dark={dark} onDone={()=>{ setAuthState("app"); setPage("dashboard"); }} />;

  const meta = PAGE_META[page] || PAGE_META.dashboard;

  return (
    <div className="cly" style={{ minHeight: "100vh", display: "flex", background: c.bg }}>
      <GlobalStyle dark={dark} />
      <Toast toast={toast} onDone={()=>setToast(null)} />
      <div className="cly-sidebar"><Sidebar page={page} setPage={setPage} c={c} name={data.profile.name} onLogout={logout} /></div>
      <div style={{ flex: 1, minWidth: 0, paddingBottom: 60 }}>
        <Topbar c={c} name={data.profile.name} dark={dark} setDark={setDark} title={meta.title} sub={meta.sub} data={data} readiness={readiness} milestones={milestones} onNav={setPage} />
        <div key={page} className="cly-anim-fadein">
          {page === "dashboard" && <DashboardPage c={c} state={data} readiness={readiness} milestones={milestones} name={data.profile.name} onToggleTask={toggleTask} onNav={setPage} />}
          {page === "roadmap" && (
            <RoadmapPage
              c={c}
              dark={dark}
              milestones={milestones}
              readiness={readiness}
              state={data}
              onUpdateCareerGoal={(updatedGoal) =>
                updateAndReconcile(
                  d => ({ ...d, careerGoal: { ...d.careerGoal, ...updatedGoal } }),
                  { type: "roadmap_rebuilt" }
                )
              }
              onAddCustomMilestone={(newM) =>
                updateAndReconcile(
                  d => ({ ...d, customMilestones: [...(d.customMilestones || []), newM] }),
                  { type: "milestone_added" }
                )
              }
              onDeleteCustomMilestone={(id) =>
                updateAndReconcile(
                  d => ({ ...d, customMilestones: (d.customMilestones || []).filter(m => m.id !== id) })
                )
              }
              onToggleMilestoneSubtask={(mId, stId, checked) =>
                updateAndReconcile(
                  d => ({
                    ...d,
                    milestoneSubtasks: { ...(d.milestoneSubtasks || {}), [`${mId}_${stId}`]: checked },
                  }),
                  { type: "subtask_toggle" }
                )
              }
              onSwitchTrack={(role) =>
                updateAndReconcile(
                  d => ({ ...d, careerGoal: { ...d.careerGoal, targetRole: role } }),
                  { type: "track_switched" }
                )
              }
            />
          )}
          {page === "tasks" && <TasksPage c={c} tasks={data.tasks} onToggle={toggleTask} onAdd={addTask} onEdit={editTask} onDelete={deleteTask} />}
          {page === "skills" && <SkillsPage c={c} dark={dark} skills={data.skills} onSetTopicStatus={setTopicStatus} />}
          {page === "analytics" && <AnalyticsPage c={c} state={data} readiness={readiness} />}
          {page === "readiness" && <ReadinessPage c={c} readiness={readiness} state={data} />}
          {page === "achievements" && <AchievementsPage c={c} achievements={data.achievements} />}
          {page === "history" && <HistoryPage c={c} history={data.history} />}
          {page === "profile" && <ProfilePage c={c} profile={data.profile} careerGoal={data.careerGoal} onSave={saveProfile} />}
          {page === "settings" && <SettingsPage c={c} dark={dark} setDark={setDark} settings={data.settings} onSettingsChange={(s)=>setData(p=>({...p,settings:s}))} onExport={exportData} onReset={resetProgress} />}
        </div>
      </div>
      <div className="cly-mobile-nav" style={{ display: "none" }}>
        <MobileNav page={page} setPage={setPage} c={c} />
      </div>
      <style>{`
        @media (max-width: 900px) {
          .cly-mobile-nav { display: block !important; }
          .cly { padding-bottom: 64px; }
        }
      `}</style>
    </div>
  );
}
