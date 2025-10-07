# Contributing to ParikshaCal 📅

Thank you for considering contributing to **ParikshaCal**! 🙌
This project is open-source and community-driven. Our goal is to build a **public calendar of exams & events** that helps students, organisers, and communities avoid scheduling conflicts.

---

## 📌 How You Can Contribute

You can contribute in many ways:

* Add a new **exam or event** to the calendar
* Update/correct existing exam/event information
* Report bugs or suggest features
* Improve documentation

---

## 📝 Adding or Updating an Exam/Event

### 1. Fork & Clone

Fork the repository and clone it to your local machine.

```bash
git clone https://github.com/<your-username>/ParikshaCal.git
cd ParikshaCal
```

### 2. Find the Data File

All exams and events are stored in **`data/events.json`** (or YAML).

### 3. Follow the Data Format

Each exam/event entry should follow this structure:

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

### 4. Add Your Event

* Place your entry in the correct **chronological order** by date.
* Ensure all fields are filled, especially:

  * **official_source** → must be a valid link (Govt/official notice).
  * **date** → in `YYYY-MM-DD` format.
* If the exam spans multiple days, include **end_date**.

### 5. Commit & Push

```bash
git checkout -b add-jee-main-2025
git add data/events.json
git commit -m "Add JEE Main 2025 Session 1"
git push origin add-jee-main-2025
```

### 6. Open a Pull Request (PR)

Go to the original repo and create a **PR** with:

* A clear title → *“Added JEE Main 2025 exam”*
* Description → Why this event was added, and the source.

---

## ✅ Contribution Rules

To maintain accuracy and reliability:

* ✔ Always include an **official source** link.
* ✔ Follow the correct **data format**.
* ✔ One PR = One exam/event (keeps review simple).
* ✔ Be respectful in discussions (see Code of Conduct).

---

## 🔍 Example Contribution

Here’s a valid example:

```json
{
  "exam_id": "bihar-board-12th-2025",
  "title": "Bihar Board 12th Exam 2025",
  "category": "senior-secondary",
  "mode": "offline",
  "scope": "state",
  "date": "2025-02-01",
  "end_date": "2025-02-14",
  "importance_level": "high",
  "location": ["Bihar"],
  "official_source": "http://biharboardonline.bihar.gov.in/",
  "notes": "Covers all major streams (Science, Arts, Commerce)"
}
```

---

## 💬 Need Help?

* Open an **Issue** if you’re unsure about something.
* Join discussions in the repo.
* Maintainers will guide you during review.

---

## 🤝 Code of Conduct

Please follow our [Code of Conduct](./CODE_OF_CONDUCT.md) to ensure a welcoming environment for all contributors.

---

✨ That’s it! Thank you for helping make **ParikshaCal** better and more useful for everyone.