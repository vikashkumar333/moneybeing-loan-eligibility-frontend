# MoneyBeing Loan Eligibility & Lead Management System - Frontend

## Overview
A modern, responsive, and type-safe **Next.js (App Router)** frontend for the **MoneyBeing Loan Eligibility & Lead Management System**.

---

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Architecture**: Service Layer, Custom Hooks, Context-based Auth State

---

## Routes
- `/`: Public landing page with direct entry points.
- `/apply`: Customer Loan Application form with validation and instant eligibility submission.
- `/result`: Transparent application decision page displaying Lead ID, Credit Bureau Score, and detailed rejection reasons.
- `/login`: Admin authentication portal with JWT token persistence.
- `/dashboard`: Executive Analytics dashboard with live KPI statistics (Total, Eligible, Rejected, Avg Score) and breakdown charts.
- `/leads`: Paginated Lead Management data table with debounced search, multi-field filters, and column sorting.
- `/leads/[id]`: Detailed applicant view with complete personal, financial, and individual BRE rule evaluation audit trails.
- `/bre-rules`: Dynamic Business Rule Engine (BRE) manager allowing admins to create, edit, deactivate, and toggle business rules.

---

## Environment Setup
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

---

## Running Locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
