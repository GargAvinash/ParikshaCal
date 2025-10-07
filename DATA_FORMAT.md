# Data Format Guide for ParikshaCal 📄

All exams/events in **ParikshaCal** follow a structured format.
Data is stored in **`data/events.json`** (or YAML).

This document explains the schema in detail.

---

## 📌 Schema Fields

| Field              | Type   | Required | Description                                                                                                     | Example                          |
| ------------------ | ------ | -------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `exam_id`          | string | ✅ Yes    | Unique identifier for the exam/event (use lowercase, hyphens).                                                  | `"jee-main-2025"`                |
| `title`            | string | ✅ Yes    | Full name of the exam/event.                                                                                    | `"JEE Main 2025 (Session 1)"`    |
| `category`         | string | ✅ Yes    | Target audience / exam category. Allowed: `secondary`, `senior-secondary`, `graduates`, `recruitment`, `other`. | `"graduates"`                    |
| `mode`             | string | ✅ Yes    | Mode of exam/event. Allowed: `online`, `offline`, `hybrid`.                                                     | `"online"`                       |
| `scope`            | string | ✅ Yes    | Geographical scope. Allowed: `all-india`, `state`, `district`, `local`.                                         | `"all-india"`                    |
| `date`             | string | ✅ Yes    | Start date (format: `YYYY-MM-DD`).                                                                              | `"2025-04-02"`                   |
| `end_date`         | string | ❌ No     | End date (if multi-day exam/event).                                                                             | `"2025-04-06"`                   |
| `importance_level` | string | ✅ Yes    | Scale of importance. Allowed: `high`, `medium`, `low`.                                                          | `"high"`                         |
| `location`         | array  | ✅ Yes    | States/regions covered (list format).                                                                           | `["Bihar"]`, `["all states"]`    |
| `official_source`  | string | ✅ Yes    | Official website/notice link (Govt, University, or Verified Source).                                            | `"https://nta.ac.in/JEE"`        |
| `notes`            | string | ❌ No     | Extra information (optional).                                                                                   | `"Expected 12+ lakh candidates"` |

---

## ✅ Example 1 (Single-Day Exam)

```json
{
  "exam_id": "ssc-cgl-2025",
  "title": "SSC CGL 2025",
  "category": "graduates",
  "mode": "online",
  "scope": "all-india",
  "date": "2025-06-15",
  "importance_level": "high",
  "location": ["all states"],
  "official_source": "https://ssc.nic.in/",
  "notes": "Tier 1 exam"
}
```

---

## ✅ Example 2 (Multi-Day State Exam)

```json
{
  "exam_id": "bihar-board-10th-2025",
  "title": "Bihar Board 10th Exam 2025",
  "category": "secondary",
  "mode": "offline",
  "scope": "state",
  "date": "2025-02-05",
  "end_date": "2025-02-12",
  "importance_level": "high",
  "location": ["Bihar"],
  "official_source": "http://biharboardonline.bihar.gov.in/",
  "notes": "Covers all subjects"
}
```

---

## ⚡ Best Practices

* Always use **ISO date format** → `YYYY-MM-DD`.
* Use **lowercase & hyphens** for `exam_id`.
* Ensure the **official source** is valid and trustworthy.
* Keep **titles clear** (avoid abbreviations unless widely known).
* Keep **notes short** (only critical info).

---

## 🚀 Future Fields (Planned)

These may be added later as the project grows:

* `organiser` → Exam conducting body (e.g., NTA, BSEB).
* `conflicts_with` → Auto-generated list of exams clashing.
* `last_updated` → Timestamp of last edit.

---

📢 If you’re unsure about a field, check existing examples in `data/events.json` or open an **Issue** for clarification.
