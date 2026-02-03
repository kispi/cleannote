# CleanNote (계단청소 마스터)

대한민국 계단 청소 자영업자를 위한 **가장 쉬운** 수익 관리 서비스입니다.
복잡한 장부 관리의 수고를 없애고, 금융 앱 '토스(Toss)'처럼 누구나 직관적으로 사용할 수 있는 경험을 제공합니다.

## 🎯 Project Goal
*   **엑셀보다 쉽게:** 저사양 스마트폰 환경에서도 빠르고 간편하게 업무를 처리합니다.
*   **게임처럼 재미있게:** 청소를 완료할 때마다 즉각적으로 수익이 누적되는 시각적 피드백을 제공합니다.

## 🧩 Key Features (MVP)
1.  **건물 관리:** 청소 대상 건물의 주소, 단가, 청소 주기 등을 대화하듯 쉽게 등록합니다.
2.  **수익 대시보드:** 이번 달 누적 수익과 진행률을 실시간으로 확인합니다.
3.  **히스토리:** 지난달, 지지난달의 청소 내역과 수익을 조회합니다.

## 🛠 Tech Stack
*   **Frontend:** SvelteKit (Svelte 5), Tailwind CSS
*   **Backend:** SvelteKit API Routes (Node.js)
*   **Database:** MySQL, Drizzle ORM
*   **Utilities:** Day.js, TanStack Query
*   **Internationalization (i18n):** Supports Korean (ko) and English (en).

## Roadmap
- [ ] **Cleaning Log Calendar Dashboard**: Visualize cleaning history in a calendar view.
- [ ] **Kakao Map API**: Use Kakao Map API to find correct building geometry.
- [ ] **Advanced Statistics**: Detailed revenue and performance charts.
- [ ] **User Roles**: Admin vs Cleaner roles.

## License
MIT

## 📏 Coding Standards
*   **Functions:** Always use **Arrow Functions** (`const func = () => {}`). Avoid `function` keyword and `this`.
*   **API Responses:** All API JSON responses must use **camelCase** for property keys, even if the database uses snake_case.
*   **Template:** Frontend templates must consume these camelCase properties.


## 🚀 Getting Started

### Prerequisites
*   Node.js (LTS Version)
*   MySQL Database

### Installation

```bash
# 1. Clone the repository
git clone [repository-url]

# 2. Install dependencies
npm install

# 3. Environment Setup
# Create .env file and configure DATABASE_URL
cp .env.example .env

# 4. Database Setup
npm run db:push

# 5. Run Development Server
npm run dev