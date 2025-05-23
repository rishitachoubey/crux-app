# CrUX Dashboard

A web app to fetch and visualize Chrome UX Report (CrUX) data for one or more URLs, with filtering, sorting, summary, and actionable insights.

---

## Features
- Enter multiple URLs (one per line)
- Fetch CrUX metrics (FCP, LCP, CLS) for each URL
- Filter and sort results
- Summary row for averages
- Insights & Recommendations for each URL
- Error handling for invalid URLs or API issues

---

## Setup & Run Instructions

### Prerequisites
- Node.js (v16 or v18 recommended)
- npm (comes with Node.js)
- Google Cloud API key with Chrome UX Report API enabled

### 1. Clone or Unzip the Project
```bash
git clone <your-repo-url>
cd <project-folder>
```

### 2. Backend Setup
```bash
cd backend
npm install
```
- Set your CrUX API key in `index.js`:
  ```js
  const CRUX_API_KEY = 'YOUR_API_KEY';
  ```
- Start the backend:
  ```bash
  node index.js
  ```
  (Runs on port 5050 by default)

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm start
```
- App opens at [http://localhost:3000](http://localhost:3000)

---

## Usage
1. Enter one or more URLs (one per line)
2. Click **SEARCH**
3. View CrUX metrics in the table
4. Use filter controls to filter results
5. Click table headers to sort
6. See summary and insights below the table

---

## Demo Video
- [Include a link to your screen recording here]
- Show entering URLs, searching, filtering, sorting, and viewing insights

---

## Design & Architecture
- **Frontend:** React + Material UI, Axios for API calls
- **Backend:** Node.js + Express, Axios for CrUX API
- **API:** Google Chrome UX Report API
- **State:** Managed with React hooks

---

## Known Issues
- CrUX API may not have data for all URLs
- API key must be set and enabled for Chrome UX Report API
- React/MUI version mismatches can cause hook errors (use React 18.2.0)
- Some UI features may require a page reload if switching input modes

---

## Next Steps / Improvements
- Deploy frontend (Vercel/Netlify) and backend (Render/Heroku)
- Add authentication for API key management
- Allow CSV export of results
- Add more detailed insights (e.g., historical trends, charts)
- Add loading spinners and better error messages
- Write unit and integration tests

---

## License
MIT 