# 🎨 Visual Guide - Post Job & Screening Questions UI

## 📸 Post Job Page Structure

```
┌─────────────────────────────────────────────────────────────┐
│                 🎯 Post a New Job                            │
│        Create a professional job posting to attract top      │
│                        talent                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  💼 Basic Information                                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                              │
│  Job Title *                                                 │
│  ┌────────────────────────────────────────────────────┐     │
│  │ 💼 e.g. Senior Software Engineer                   │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│  ┌──────────────────────┐  ┌──────────────────────┐         │
│  │ Job Type *           │  │ Experience Level *   │         │
│  │ ▼ Full-time          │  │ ▼ Entry Level        │         │
│  └──────────────────────┘  └──────────────────────┘         │
│                                                              │
│  ┌──────────────────────┐  ┌──────────────────────┐         │
│  │ 📍 Location *        │  │ 💰 Salary Range      │         │
│  │ San Francisco, CA    │  │ $80k - $120k         │         │
│  └──────────────────────┘  └──────────────────────┘         │
│                                                              │
│  ┌──────────────────────┐  ┌──────────────────────┐         │
│  │ 👥 Vacancies: 1      │  │ 📅 Deadline:         │         │
│  └──────────────────────┘  └──────────────────────┘         │
│                                                              │
│  Required Skills                                             │
│  ┌────────────────────────────────────────────────────┐     │
│  │ JavaScript, React, Node.js, MongoDB                │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  💜 Job Details                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                              │
│  Job Description *                                           │
│  ┌────────────────────────────────────────────────────┐     │
│  │                                                     │     │
│  │ Describe the job role, company culture...          │     │
│  │                                                     │     │
│  │                                                     │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│  Requirements                                                │
│  ┌────────────────────────────────────────────────────┐     │
│  │ List qualifications, education...                  │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│  Responsibilities                                            │
│  ┌────────────────────────────────────────────────────┐     │
│  │ Describe day-to-day responsibilities...            │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ❓ Screening Questions          [➕ Add Question]           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Custom questions for applicants (Optional)                  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ① How many years of experience do you have?         │   │
│  │ ┌────────────────────────────────────────────────┐  │   │
│  │ │ Enter your question here...                    │  │   │
│  │ └────────────────────────────────────────────────┘  │   │
│  │ ☑ Required question              [🗑️ Remove]      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ② Why do you want to join our company?              │   │
│  │ ┌────────────────────────────────────────────────┐  │   │
│  │ │ Enter your question here...                    │  │   │
│  │ └────────────────────────────────────────────────┘  │   │
│  │ ☐ Required question              [🗑️ Remove]      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  💡 Tip: Add specific questions about skills, experience,    │
│     or availability to help you identify the best            │
│     candidates quickly.                                      │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┐  ┌──────────────────────┐
│   📝 Post Job        │  │      Cancel          │
└──────────────────────┘  └──────────────────────┘
```

---

## 📸 Job Application Form (Job Seeker View)

```
┌─────────────────────────────────────────────────────────────┐
│           Submit Your Application                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                              │
│  Cover Letter *                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │                                                     │     │
│  │ Tell us why you're a great fit...                  │     │
│  │                                                     │     │
│  │                                                     │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│  Resume/CV (PDF, DOC, DOCX - Max 5MB)                       │
│  ┌────────────────────────────────────────────────────┐     │
│  │ Choose File                                         │     │
│  └────────────────────────────────────────────────────┘     │
│  Selected: resume.pdf                                        │
│                                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                              │
│  ✅ Screening Questions                                      │
│  Please answer the following questions to help the           │
│  employer evaluate your application.                         │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 1. How many years of experience do you have? *       │   │
│  │ ┌────────────────────────────────────────────────┐  │   │
│  │ │                                                 │  │   │
│  │ │ Type your answer here...                       │  │   │
│  │ │                                                 │  │   │
│  │ └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 2. Why do you want to join our company?             │   │
│  │ ┌────────────────────────────────────────────────┐  │   │
│  │ │                                                 │  │   │
│  │ │ Type your answer here...                       │  │   │
│  │ │                                                 │  │   │
│  │ └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┐  ┌──────────────────────┐
│  Submit Application   │  │      Cancel          │
└──────────────────────┘  └──────────────────────┘
```

---

## 🎨 Color Theme

### Gradient Color Palette:
```
Basic Information Card:
  Header: Blue Gradient (#3B82F6 → #4F46E5)
  Icon Container: Blue (#3B82F6)
  Focus Rings: Light Blue (#DBEAFE)

Job Details Card:
  Header: Purple Gradient (#8B5CF6 → #7C3AED)
  Icon Container: Purple (#8B5CF6)
  Focus Rings: Light Purple (#EDE9FE)

Screening Questions Card:
  Header: Green Gradient (#10B981 → #059669)
  Icon Container: Green (#10B981)
  Focus Rings: Light Green (#D1FAE5)
  Question Numbers: Green Circle (#10B981)

Actions:
  Primary Button: Blue-Purple Gradient
  Delete Button: Red (#EF4444)
  Cancel Button: Gray (#6B7280)
```

---

## 🎭 Interactive Elements

### Hover Effects:
- **Cards**: Shadow increases from `shadow-lg` to `shadow-xl`
- **Buttons**: Scale transforms (1.02), shadow enhancement
- **Input Fields**: Border color changes to theme color
- **Question Cards**: Border changes to green on hover

### Focus States:
- **Input Fields**: 4px ring with theme color at 10% opacity
- **Buttons**: Ring with theme color at 30% opacity
- **Checkboxes**: 2px ring with green color

### Animations:
- **Page Load**: Smooth fade-in
- **Card Hover**: Transition duration 300ms
- **Button Click**: Scale down to 0.98 (active state)
- **Loading Spinner**: Continuous rotation

---

## 📱 Responsive Breakpoints

```
Mobile (< 768px):
  - Single column layout
  - Stack all input pairs vertically
  - Full-width buttons
  - Reduce padding

Tablet (768px - 1024px):
  - Two-column grid for paired inputs
  - Cards maintain full width
  - Comfortable spacing

Desktop (> 1024px):
  - Maximum width: 1280px (5xl)
  - Two-column grid where applicable
  - Optimal reading width for text areas
  - Side-by-side action buttons
```

---

## ✨ Special UI States

### Empty State (No Questions):
```
┌────────────────────────────────────┐
│                                    │
│           ❓ [Large Icon]          │
│                                    │
│   No screening questions added yet │
│                                    │
│  Add custom questions to filter     │
│   candidates effectively            │
│                                    │
└────────────────────────────────────┘
```

### Loading State (Submitting):
```
┌──────────────────────┐
│  ⟳ Posting Job...    │  (with spinner)
└──────────────────────┘
```

### Success State:
```
┌──────────────────────────────────────────┐
│ ✅ Job posted successfully and is now    │
│    live on Browse Jobs!                  │
└──────────────────────────────────────────┘
```

### Error State:
```
┌──────────────────────────────────────────┐
│ ⚠️ Please answer all required screening  │
│    questions                             │
└──────────────────────────────────────────┘
```

---

## 🎯 User Flow Visualization

```
EMPLOYER FLOW:
┌─────────────┐
│ Click       │
│ "Post Job"  │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Fill Basic Info │ ◄── Professional card UI
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Add Job Details │ ◄── Rich text areas
└──────┬──────────┘
       │
       ▼
┌──────────────────────┐
│ Add Questions (opt)  │ ◄── Dynamic list with add/remove
│ - Click "Add"        │
│ - Type question      │
│ - Toggle required    │
│ - Repeat             │
└──────┬───────────────┘
       │
       ▼
┌─────────────┐
│ Submit Job  │
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│ ✅ Success!      │
│ Redirect to      │
│ Dashboard        │
└──────────────────┘


JOB SEEKER FLOW:
┌─────────────┐
│ Browse Jobs │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Click Job       │
│ View Details    │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Click           │
│ "Apply Now"     │
└──────┬──────────┘
       │
       ▼
┌──────────────────────┐
│ Fill Application:    │
│ 1. Cover Letter      │
│ 2. Upload Resume     │
│ 3. Answer Questions  │ ◄── NEW! If questions exist
└──────┬───────────────┘
       │
       ▼
┌──────────────────┐
│ Validate:        │
│ - Required fields│
│ - Required Qs    │ ◄── NEW! Validation
└──────┬───────────┘
       │
       ▼
┌─────────────────┐
│ Submit          │
└──────┬──────────┘
       │
       ▼
┌──────────────────┐
│ ✅ Applied!      │
│ Redirect to      │
│ Dashboard        │
└──────────────────┘
```

---

## 💡 Pro Tips for Employers

### Good Screening Questions:
✅ "How many years of experience do you have with React?"
✅ "Describe a challenging project you've worked on."
✅ "Are you authorized to work in the US?"
✅ "What is your expected salary range?"
✅ "When can you start if offered the position?"

### Avoid:
❌ "What is your age?" (discriminatory)
❌ "Are you married?" (irrelevant)
❌ "What is your religion?" (inappropriate)
❌ Too many questions (keep it under 5)
❌ Overly complex questions (keep it simple)

---

This visual guide helps users understand the new professional interface and screening questions feature! 🎨✨
