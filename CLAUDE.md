# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **워크소스 (WorkSauce)**, a Korean recruitment platform that uses job execution type assessments for hiring. It's a React + TypeScript + Vite application with Supabase backend integration.

## Development Commands

```bash
# Development server (runs on port 3000)
npm run dev

# Build for production
npm run build

# Type checking without building
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Preview production build
npm run preview
```

## Architecture & Key Technologies

### Frontend Stack

- **React 18** with TypeScript
- **Vite** as build tool and dev server
- **Tailwind CSS** with custom design system
- **React Router v6** for routing
- **React Query** for server state management
- **React Hook Form** with Zod validation
- **Framer Motion** for animations
- **React Hot Toast** for notifications

### Backend Integration

- **Supabase** for authentication and database
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

### Code Organization

The project follows a **feature-based architecture**:

```
src/
├── shared/           # Shared utilities, components, contexts
│   ├── components/   # Reusable UI components (Button, Input, etc.)
│   ├── contexts/     # React contexts (AuthContext)
│   ├── hooks/        # Custom hooks (usePageSEO)
│   └── lib/          # Third-party integrations (supabase.ts)
├── features/         # Feature-specific code
│   ├── landing/      # Landing page feature
│   ├── auth/         # Authentication feature
│   └── dashboard/    # Dashboard feature
└── App.tsx           # Main app with routing
```

### Authentication System

The auth system uses **Supabase Auth** with a custom AuthContext:

- `AuthProvider` wraps the app and manages auth state
- `useAuth` hook provides auth methods: `signIn`, `signUp`, `signOut`, `forceSignOut`
- `ProtectedRoute` component guards authenticated routes
- `PublicRoute` component redirects logged-in users from auth pages
- **User data**: Uses `user.user_metadata` from Supabase Auth (no additional database tables required)
- **Graceful fallbacks**: Handles deleted users and invalid sessions automatically

#### 4-Step Signup Flow

The signup process consists of **4 beautiful, accessible steps**:

1. **NameStep**: Collects user's name with real-time validation and preview
2. **EmailStep**: Email verification with 6-digit codes and 10-minute timer
3. **PasswordStep**: Password creation with real-time strength indicator
4. **AgreementStep**: Terms and privacy policy acceptance

#### Email Verification System

Custom email verification using **Supabase Edge Functions**:

- **6-digit verification codes** sent via Resend API from `worksauce.kr`
- **10-minute expiration timer** with real-time countdown
- **Professional Korean email templates** with WorkSauce branding
- **Edge Functions**: `send-verification-email`, `verify-email-code`
- **Database**: `verification_codes` table with RLS policies and auto-cleanup
- **Security**: Service role authentication, input validation, spam prevention

### Routing Structure

- `/` - Landing page (public, shows different header when logged in)
- `/auth/login` - Login page (redirects to dashboard if authenticated)
- `/auth/signup` - 4-step signup flow (redirects to dashboard if authenticated)
- `/dashboard` - Protected dashboard showing all hiring groups (requires authentication)
- `/dashboard/create-group` - Group creation page with multi-step form (protected)
- `/dashboard/groups/:groupId` - Group detail page with applicant management (protected)
- `/applicant/detail` - Individual applicant analysis page (protected)
- `*` - 404 routes redirect to landing page

**Route Guards:**
- `ProtectedRoute`: Redirects to login if not authenticated
- `PublicRoute`: Redirects to dashboard if already authenticated

### Navigation System

#### Landing Header States

The `LandingHeader` component adapts based on authentication state:

**Logged Out State:**
- Shows "도움말" and "로그인 / 회원가입" menu items
- Standard responsive mobile menu

**Logged In State:**
- **Desktop**: User profile dropdown with name, email, dashboard link, logout
- **Mobile**: User avatar + menu with profile info and navigation
- **Development**: Additional "강제 로그아웃 (DEV)" button for debugging

### Design System

**Custom Tailwind configuration** with Korean design considerations:

- **Primary colors**: Custom OKLCH color palette for WorkSauce branding
- **Typography**: Pretendard font family (Korean-optimized)
- **Status colors**: Success, warning, error, info with background/border variants
- **Korean UI text**: All user-facing text is in Korean

**Design System Consistency** (Dec 2024):
- **Section spacing**: `mb-6` (24px) for consistent vertical rhythm
- **Grid gaps**: `gap-4 sm:gap-6` (16px → 24px responsive)
- **Border colors**: `border-neutral-200` for cards, `border-neutral-100` for dividers
- **Typography scale**: Consistent responsive patterns (`text-xs sm:text-sm`, `text-lg sm:text-2xl`)
- **Applied across**: DashboardPage, GroupPage, DashboardSkeleton for unified UX

### Component Conventions

1. **forwardRef pattern**: Most UI components use `forwardRef` for ref forwarding
2. **clsx for styling**: Use `clsx` utility for conditional class names
3. **TypeScript interfaces**: All components have proper TypeScript interfaces
4. **displayName**: Set `displayName` for better debugging
5. **Export pattern**: Use `export { ComponentName }` format
6. **React Icons**: Prefer `react-icons/md` (Material Design) for consistency

### Shared Components Library

The `shared/components/ui/` directory contains reusable UI components:

- **Button**: Variants (primary, secondary, outline, ghost) with sizes (sm, md, lg) and loading states
- **Input**: Text input with error states and label support
- **Checkbox**: Accessible checkbox with label
- **Dropdown**: Headless UI based dropdown menu
- **Modal**: Accessible modal dialog with backdrop
- **Alert**: Status alerts (success, warning, error, info)
- **TabGroup**: Tabbed interface component
- **Tooltip**: Hover tooltip component
- **Toast**: Toast notification system with context provider
- **Logo**: WorkSauce logo component

### Multi-step Forms

The signup flow demonstrates the multi-step form pattern:

- `SignUpFlow` component manages overall state and step navigation (4 steps total)
- Individual step components (`NameStep`, `EmailStep`, `PasswordStep`, `AgreementStep`)
- `StepIndicator` component with accessibility features and progress visualization
- `PasswordStrengthIndicator` for real-time password validation with visual feedback
- Seamless navigation with previous/next buttons and form validation

### Accessibility

Components include proper accessibility attributes:

- ARIA labels, roles, and properties
- Screen reader support with `sr-only` classes
- Keyboard navigation support
- Semantic HTML structure

### State Management

- **Local state**: React useState for component-level state
- **Auth state**: AuthContext for authentication
- **Server state**: React Query for API data fetching (configured in App.tsx)
- **Form state**: React Hook Form for form management

**React Query Configuration:**
```typescript
// Global defaults in App.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

**Per-Query Overrides:**
- `useGroups()` hook: `staleTime: 5 minutes`, `gcTime: 10 minutes`, `refetchOnWindowFocus: true`, `retry: 2`

### Environment Setup

#### Frontend Environment Variables

Required environment variables in `.env`:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_URL=https://worksauce.kr  # Base URL for generating test links
VITE_ENV=Dev  # Set to "Production" to hide development features
```

#### Supabase Edge Functions Environment

Required environment variables in `supabase/functions/.env`:

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_api_key
EMAIL_DOMAIN=worksauce.kr
```

#### Database Setup

Required database tables and functions:

1. **verification_codes table**: For email verification system
2. **Database trigger**: `handle_new_user()` for automatic profile creation
3. **RLS policies**: Secure access control for verification codes

See `supabase/DEPLOYMENT.md` for complete setup instructions.

## Development Guidelines

### Code Style

- All user-facing text is in **Korean**
- Follow the existing **feature-based folder structure**
- Use **absolute imports** with `@/` prefix (configured in vite.config.ts)
- The app uses **Korean design patterns** and **typography optimizations**
- Use **`user.user_metadata`** for user information instead of database profiles
- Implement **proper error handling** with user-friendly Korean messages

### Authentication Best Practices

- **Graceful degradation**: App works with or without user profiles
- **Session validation**: Automatically handles deleted users and invalid tokens
- **Development tools**: Force logout feature available in development mode
- **Security**: All sensitive operations use service role authentication

### Email System

- **Custom domain**: All emails sent from `noreply@worksauce.kr`
- **Professional templates**: Korean-language templates with WorkSauce branding
- **Security**: 6-digit codes with 10-minute expiration and automatic cleanup
- **User experience**: Real-time countdown timers and validation feedback

### Deployment Checklist

Before deploying to production:

1. ✅ Set `VITE_ENV=Production` to hide development features
2. ✅ Deploy Supabase Edge Functions with environment variables
3. ✅ Run database migrations for verification_codes table
4. ✅ Verify Resend domain authentication for worksauce.kr
5. ✅ Test complete signup flow end-to-end
6. ✅ Verify auth state persistence across page refreshes

## Dashboard Feature Architecture

The dashboard is the core feature of WorkSauce, providing recruitment management capabilities. It's organized into two main feature modules: `features/dashboard/` and `features/groups/`.

### Dashboard Pages & Routes

**DashboardPage** (`/dashboard`)
- Main hub displaying all hiring groups
- Grid view and Calendar view modes
- Search by group name/description
- Status filtering (active, completed, draft)
- Pagination (6 items per page)
- Summary statistics: total groups, active groups, total applicants, completed tests
- Group cards with status badges, progress bars, and action dropdown menus

**CreateGroupPage** (`/dashboard/create-group`)
- Multi-step form for creating new recruitment groups
- **GroupInfoForm**: Collects name, description, position, experience level, work types, deadline, auto-reminder
- **ApplicantManager**: Excel file upload or manual entry, with duplicate detection
- Client-side validation via `useGroupForm` hook
- Submission via `useCreateGroupFlow` hook (handles full flow: group creation → email sending → navigation)
- **Refactored architecture** (Dec 2024): 402 lines → 220 lines (45% reduction)
  - Business logic extracted to dedicated hooks for reusability and testability
  - `useSendTestEmails`: Email sending logic (100 lines extracted)
  - `useCreateGroupFlow`: Entire flow orchestration (create → email → navigate)
  - `useGroupFormValidation`: Form validation + toast notifications
  - `buildCreateGroupRequest`: Pure utility function for request object construction

**GroupPage** (`/dashboard/groups/:groupId`)
- Detailed view of a specific group with applicant list
- Tabbed interface: "Recommended", "All applicants", "Filtered"
- Summary stats and work type distribution chart
- Search, sort, and star/favorite functionality
- Individual applicant cards with test scores and job fit scores

**ApplicantDetail** (`/applicant/detail`)
- Deep-dive analysis of a single applicant
- Tabs: Work Type Analysis, Interview Guide
- Displays test scores, strengths/weaknesses, and interview questions

### API Layer

**Dashboard API** (`features/dashboard/api/dashboardApi.ts`)
- `getGroupsWithApplicants()`: Fetches all groups with nested applicant data via Supabase joins

**Groups API** (`features/groups/api/groupApi.ts`)
- `createGroup(data)`: Creates group and bulk inserts applicants with unique test tokens (using nanoid)
- `getGroups()`: Fetches all groups (without applicants)
- `updateGroup(groupId, updates)`: Updates group fields
- `deleteGroup(groupId)`: Deletes group (CASCADE deletes applicants)

### Custom Hooks

**Dashboard Hooks:**
- `useGroups()`: React Query hook for fetching groups with applicants (5min staleTime, 10min cache)
- `useCalendar()`: Manages calendar navigation and date calculations
- `useDdayCalculator()`: Calculates deadline urgency ("D-3", "D-Day") with color coding
- `useGroupsByDate(groups)`: Filters groups by specific date

**Groups Hooks:**
- `useCreateGroup(options)`: React Query mutation for creating groups (invalidates cache on success)
- `useCreateGroupFlow(options)`: Orchestrates entire group creation flow (create → email → navigate)
- `useSendTestEmails()`: Reusable email sending logic with progress tracking
- `useGroupFormValidation()`: Form validation + toast notifications (eliminates duplication)
- `useGroupForm()`: Manages group form state and client-side validation
- `useApplicantManager()`: Manages applicant list, filtering, bulk operations, duplicate detection
- `useFileUpload(applicants)`: Handles Excel file parsing (.xlsx, .xls, .csv) with Korean/English header support
- `useCustomPosition()`: Manages custom position creation modal state, selection handling, validation

### Data Types

**Key TypeScript interfaces:**
```typescript
interface Group {
  id: string
  user_id: string
  name: string
  position: string
  preferred_work_types: string[]
  deadline: string // ISO 8601
  auto_reminder: boolean
  status: "active" | "completed" | "draft"
  applicants: ApplicantSummary[]
}

interface Applicant {
  id: string
  group_id: string
  name: string
  email: string
  test_token: string // nanoid(32)
  test_status: "pending" | "in_progress" | "completed" | "expired"
  test_result: TestResult | null
  test_url: string
}
```

### Architecture Patterns

1. **Feature-based organization**: Each feature has its own `/api`, `/hooks`, `/components`, `/pages`, `/types` folders
2. **API layer separation**: Pure API functions in `*Api.ts` files, wrapped by React Query hooks
3. **Custom hooks for business logic**: Complex state and logic isolated in custom hooks
4. **Toast notifications**: Used extensively for user feedback (success, error, warning)
5. **Client-side validation**: Form validation before API calls for immediate feedback
6. **Nanoid for tokens**: Uses `nanoid(32)` to generate unique test tokens for applicants
7. **Excel parsing**: Supports Korean headers ("이름", "이메일") and English ("name", "email")

### Database Schema

**Required Supabase tables:**
- `groups`: Stores recruitment group information
- `applicants`: Stores individual applicant data with test results
- Foreign key: `applicants.group_id` → `groups.id` (CASCADE on delete)

**Note:** The current CLAUDE.md mentions Supabase Edge Functions and database setup, but there's no `supabase/` directory in the project. Database migrations may be managed externally or through Supabase dashboard.

---

## Product Development Roadmap

### Product Positioning

**Core Value Proposition:**
> "소스테스트로 채용을 더 똑똑하게 (Smarter hiring with SauceTest)"

**Key Principles:**
- 🚀 **점진적 확장**: Start with MVP, expand based on user feedback
- 💡 **즉각적 가치**: Every feature must provide immediate actionable value

---

## AI 직무 매칭 분석 (n8n + GPT-4o-mini)

### 개요

지원자의 테스트 결과를 바탕으로 **AI가 직무 적합도를 분석**하여 개인화된 리포트를 생성하는 기능. n8n 워크플로우와 OpenAI GPT-4o-mini를 활용하여 실행 프로필 기반 매칭 분석을 수행.

### 워크플로우 아키텍처

```
Webhook (POST) → Validation → Sanity Check → Transform Profile → AI Agent → Parse & Format → Supabase INSERT → Notification
```

**노드별 역할:**

1. **Webhook**: 프론트엔드에서 분석 요청 수신 (CORS 설정: worksauce.kr)
2. **Validation**: 필수 필드 검증 (jobInput, testResult, metadata)
3. **Sanity Check**: 직무 설명이 의미 있는 내용인지 AI로 검증
4. **Transform Applicant Profile**: 테스트 점수 → 5가지 실행 프로필 축으로 변환
5. **AI Agent**: GPT-4o-mini로 직무-지원자 프로필 비교 분석
6. **Parse & Format**: AI 응답 파싱 및 최종 응답 구조화
7. **Supabase INSERT**: `ai_job_analysis` 테이블에 분석 결과 저장
8. **Notification**: `notifications` 테이블에 완료 알림 생성

### 실행 프로필 (Execution Profile)

지원자의 Work Type 점수를 5가지 실행 축으로 변환:

| 축 | 설명 | 0점 | 100점 |
|---|---|---|---|
| `decision_speed` | 의사결정 속도 | 신중한 분석 후 결정 | 빠른 판단과 실행 |
| `uncertainty_tolerance` | 불확실성 내성 | 명확한 구조 선호 | 변화와 모호함 수용 |
| `autonomy` | 자율성 | 협업/조정 중심 | 독립적 업무 선호 |
| `relationship_focus` | 관계 중심성 | 과제/결과 중심 | 대인관계/조화 중심 |
| `precision_requirement` | 정확성 요구도 | 속도/유연성 우선 | 완벽함/디테일 중시 |

**변환 로직** (`transform applicant profile` 노드):
- Work Type별 가중치 기반 점수 계산
- 예: `decision_speed` = 빠른 실행형(EE, EG) - 신중한 분석형(UR, SA, SE, CH)

### AI 분석 출력 구조

```typescript
interface AIJobAnalysis {
  analysisId: string;

  // 직무 실행 프로필 (AI 생성)
  jobExecutionProfile: {
    executionProfile: ExecutionProfile;
    rationale: Record<string, string>;  // 각 축 점수의 근거
    primaryAxes: Array<{               // 핵심 축 2개
      axis: string;
      failurePattern: string;          // 이 직무에서 흔한 실패 패턴
      criticalBecause: string;         // 왜 치명적인가
    }>;
  };

  // 지원자 실행 프로필 (계산된 값)
  applicantExecutionProfile: ExecutionProfile;

  // 축별 차이 분석
  axisDifferences: Array<{
    axis: string;
    axisName: string;
    isPrimaryAxis: boolean;
    jobScore: number;
    applicantScore: number;
    gap: number;
    gapLevel: "critical" | "significant" | "moderate" | "minimal";
    interpretation: string;
    trade_off: { positive: string; negative: string };
  }>;

  // 전체 요약
  overallSummary: {
    matchingAreas: string[];
    differingAreas: string[];
    interpretationSummary: string;
  };

  // 시나리오 분석
  scenarioAnalysis: {
    bestScenario: string;      // 지원자가 빛날 상황
    worstScenario: string;     // 고전할 상황
    teamSynergyRecommendation: string;  // 함께 일하면 좋은 동료 유형
  };

  // 관리 포인트
  managementPoints: Array<{
    category: "onboarding" | "daily_work" | "growth" | "communication";
    categoryLabel: string;
    point: string;
    priority: "high" | "medium" | "low";
  }>;

  // 신뢰도
  confidence: {
    level: "high" | "medium" | "low";
    note: string | null;
  };
}
```

### 데이터베이스 스키마

**ai_job_analysis 테이블:**
```sql
CREATE TABLE ai_job_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  applicant_id UUID NOT NULL REFERENCES applicants(id),
  group_id UUID NOT NULL REFERENCES groups(id),
  analysis_id TEXT NOT NULL,
  job_execution_profile JSONB NOT NULL,
  applicant_execution_profile JSONB NOT NULL,
  axis_differences JSONB NOT NULL,
  overall_summary JSONB NOT NULL,
  scenario_analysis JSONB NOT NULL,
  management_points JSONB NOT NULL,
  confidence JSONB NOT NULL,
  credits_used INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**notifications 테이블:**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### API 호출 방법

**Webhook 엔드포인트:** `POST /webhook/80cad2e1-b232-4abf-8e3a-32301367e21a`

**Request Body:**
```typescript
{
  userId: string;
  applicant: {
    id: string;
    name: string;
  };
  jobInput: {
    jobTitle: string;
    position: string;
    experienceLevel?: string;
    jobDescription?: string;
  };
  testResult: {
    primaryType: string;
    scoreDistribution: Record<string, number>;
    statementScores: Record<string, number>;
    verbSelections?: Record<string, string[]>;
  };
  metadata: {
    transactionId: string;
    groupId: string;
  };
}
```

### 핵심 특징

1. **Sanity Check**: 무의미한 직무 설명 필터링 (농담, 무관한 내용 등)
2. **Constraint-based Scoring**: AI가 직무 프로필 생성 시 트레이드오프 제약 적용
   - `decision_speed + precision_requirement ≤ 140`
   - `autonomy + relationship_focus ≤ 130`
3. **Failure-driven Analysis**: 해당 직무에서 흔한 실패 패턴 기반 핵심 축 선정
4. **비동기 처리**: 분석 완료 시 notifications 테이블에 알림 생성

---

### Technical Architecture Principles

**Refactoring Standards:**
- Component complexity: < 250 lines preferred
- Business logic: Extract to custom hooks
- Reusable logic: Create dedicated hooks/utilities
- Type safety: Full TypeScript coverage
- Testing: Hooks should be independently testable

**Recent Examples:**
- `useSendTestEmails`: 100+ lines extracted, reusable across features
- `useCreateGroupFlow`: Orchestrates complex async flows
- `buildCreateGroupRequest`: Pure function for testability
