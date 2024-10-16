# Build an LMS Platform: Next.js 14, React, Stripe, Mux, Prisma, Tailwind, PostgreSQL

### *This is a repository for learning and practicing development best-practice and standers and interacting with intersting technoloiges like prisma, mux, uploadthing, stripe*

[VIDEO TUTORIAL](https://www.youtube.com/watch?v=Big_aFLmekI)

Key Features:

- Browse & Filter Courses
- Purchase Courses using Stripe
- Mark Chapters as Completed or Uncompleted
- Progress Calculation of each Course
- Student Dashboard
- Teacher mode
- Create new Courses
- Create new Chapters
- Easily reorder chapter position with drag n’ drop
- Upload thumbnails, attachments and videos using UploadThing
- Video processing using Mux
- HLS Video player using Mux
- Rich text editor for chapter description
- Authentication using Clerk
- ORM using Prisma
- MySQL database using Planetscale

### Getting Started

```shell
git clone https://github.com/amrmustafa282/lms-platform.git
```

### Install packages

```shell
npm i
```

### Setup .env file

```js
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
DATABASE_URL=

UPLOADTHING_TOKEN=

MUX_TOKEN_ID=
MUX_TOKEN_SECRET=

STRIPE_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
STRIPE_WEBHOOK_SECRET=

NEXT_PUBLIC_TEACHER_ID=
```

### Setup Prisma

Add PostgreSQL Database (I used [aiven.io](https://console.aiven.io))

```shell
npx prisma generate
npx prisma db push

```

### Start the app

```shell
npm run dev
```
