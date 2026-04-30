# ParikshaCal 📅

*A public calendar for exams & events — making scheduling smarter and conflict-free.*

---

## 🌍 Overview

In India, students often face **exam date clashes** across universities, boards, and recruitment bodies. Exam authorities also struggle to find **available centres**, since schools and colleges double as venues for multiple examinations and events.

**ParikshaCal** solves this problem by providing a **publicly accessible, open calendar** of exams and events. Organisers, students, and decision-makers can quickly see upcoming schedules and avoid conflicts.

---

## 🎯 Problem We Solve

* **Student Dilemma** → One student, two exams on the same day.
* **Centre Availability** → Government schools/colleges overbooked.
* **Lack of Transparency** → No centralised view for organisers to plan dates.

---

## ✅ Features

* 📌 **Calendar View** → Month & week layouts with color-coded events.
* 🎨 **Importance Levels** → National exams, state exams, and local events shown distinctly.
* 🏷 **Categories** → Secondary school, senior secondary, graduates, recruitment, etc.
* 🌐 **Scope Tags** → All-India, State-level, or local events.
* 💻 **Mode Labels** → Online vs Offline exams.
* 🔗 **Official Sources** → Each exam/event links back to its verified notice.
* ⚡ **Future-ready** → Extendable to rallies, festivals, or any public event affecting scheduling.

---

## 🛠 Tech Stack (MVP)

* **Frontend**: React + Vite
* **Calendar UI**: FullCalendar.js
* **Styling**: Tailwind CSS
* **Data Source**: JSON (stored in repo for contributors)
* **Hosting**: Cloudflare Pages / GitHub Pages / Vercel

---

## 🚀 Roadmap

**Phase 1 (MVP)**

* Static calendar site with manually curated exam data.
* Public repo with JSON/YAML exam database.

**Phase 2**

* Contributor workflow (submit new events via PR).
* Tags, filters, and event categories.
* Tooltip popups with details.

**Phase 3**

* Web app with backend + database.
* Contributor login & moderation system.
* Automatic **conflict detection** between major exams/events.
* Public API for NGOs/researchers/students.

---

## 📊 Example Data Format

```json
{
  "exam_id": "jee-main-2025",
  "title": "JEE Main 2025 (Session 1)",
  "category": "graduates",
  "mode": "online",
  "scope": "all-india",
  "date": "2025-04-02",
  "end_date": "2025-04-06",
  "importance_level": "high",
  "location": ["all states"],
  "official_source": "https://nta.ac.in/JEE",
  "notes": "Expected 12+ lakh candidates"
}
```

---

## 🤝 Contributing

ParikshaCal is **open-source** and welcomes contributions!

1. **Fork** this repository
2. **Add/Edit** exam data in the JSON/YAML file (see [DATA_FORMAT.md](./DATA_FORMAT.md))
3. **Commit & PR** with a valid official source link
4. Maintainers will **review & approve**

See [CONTRIBUTING.md](./CONTRIBUTING.md) for full guidelines.

---

## 📜 License

This project is licensed under the **MIT License** — see [LICENSE](./LICENSE) for details.

---

## 💡 Vision

ParikshaCal is more than just an exam calendar.
It’s a **public utility platform** to help:

* Students → plan exams stress-free
* Authorities → schedule conflict-free exams
* Communities → manage public events better

Together, we can build a **transparent, open, and reliable system of planning time.**