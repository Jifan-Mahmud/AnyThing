# 🚀 AnyThing - Modern Social Media Platform

**AnyThing** একটি সর্বাধুনিক, দৃষ্টিনন্দন এবং পূর্ণাঙ্গ সোশ্যাল মিডিয়া প্ল্যাটফর্ম (Instagram-inspired), যা ইউজারদের মধ্যে রিয়েল-টাইম কানেক্টিভিটি, পোস্ট ও রিলস শেয়ারিং, অডিও-ভিডিও কলিং এবং ইনস্ট্যান্ট মেসেজিং এর সুযোগ দেয়। প্রজেক্টটির ফ্রন্টএন্ড আধুনিক **Next.js (App Router)**, **Motion (motion.dev)**, **Hero UI**, এবং **Gravity UI Icons** দিয়ে অত্যন্ত ফাস্ট ও স্মুথ করা হয়েছে এবং ব্যাকএন্ডে হাই-পারফরম্যান্স **JWT (jose-cjs)** সংযুক্ত করা হয়েছে।

---

## 🛠️ ব্যবহৃত আধুনিক টেকনোলজি ও টুলস (Technologies & Tools Used)

### 🎨 Frontend (ফ্রন্টএন্ড)
- **[Next.js 16 (App Router)](https://nextjs.org/)**: লেটেস্ট Next.js App Router আর্কিটেকচার, ফাস্ট সার্ভার ও ক্লায়েন্ট সাইড রেন্ডারিং এবং অপ্টিমাইজড রাউটিং।
- **JavaScript & `.jsx`**: টাইপস্ক্রিপ্ট পরিহার করে পিওর জাভাস্ক্রিপ্ট এবং ক্লাসিক `.jsx` ফাইল ফরম্যাট ব্যবহার।
- **React Compiler (React 19)**: নেক্সট.জেএস-এর লেটেস্ট স্বয়ংক্রিয় রিঅ্যাক্ট কম্পাইলার অপ্টিমাইজেশন।
- **[Motion (motion.dev)](https://motion.dev/)**: সুপার-স্মুথ ও ফ্লুইড অ্যানিমেশন, হার্ট বার্স্ট, ট্রানজিশন এবং মাইক্রো-ইন্টারেকশনের জন্য।
- **[Hero UI](https://heroui.com/)**: আধুনিক, প্রিমিয়াম এবং অ্যাক্সেসিবল সোশ্যাল ইউআই কম্পোনেন্টস।
- **[Gravity UI Icons](https://gravity-ui.com/icons)**: মসৃণ ও দৃষ্টিনন্দন আইকন সিস্টেম।
- **[Tailwind CSS v4](https://tailwindcss.com/)**: গ্লাসফিজম (Glassmorphism), আল্ট্রা-ডার্ক মোড ও রেসপনসিভ ইউআই ডিজাইনের জন্য।
- **[Socket.io-Client](https://socket.io/)**: রিয়েল-টাইম লাইভ চ্যাট, রিয়েল-টাইম নোটিফিকেশন ও কল সিগন্যালিংয়ের জন্য।
- **[WebRTC API](https://webrtc.org/)**: ক্রিস্টাল ক্লিয়ার অডিও ও ভিডিও কলিং (Hardware Echo Cancellation, Noise Suppression, Auto Gain Control এবং STUN Server সহ)।
- **[React Toastify](https://fkhadra.github.io/react-toastify/)**: রিয়েল-টাইম পপআপ নোটিফিকেশন টোস্ট।
- **[Axios](https://axios-http.com/)**: সুরক্ষিত API যোগাযোগের জন্য HTTP ক্লায়েন্ট।

---

### ⚙️ Backend (ব্যাকএন্ড)
- **[Node.js & Express.js](https://expressjs.com/)**: হাই-পারফরম্যান্স RESTful API সার্ভার।
- **[jose-cjs (JWT)](https://github.com/panva/jose)**: আধুনিক, দ্রুত এবং সুরক্ষিত JSON Web Token (JWT) সাইনিং ও ভেরিফিকেশন।
- **[MongoDB & Mongoose](https://mongoosejs.com/)**: ক্লাউড ডাটাবেজ এবং ডাটা মডেলিং।
- **[Socket.io Server](https://socket.io/)**: রিয়েল-টাইম ব্রডকাস্টিং এবং পিয়ার কানেকশন হ্যান্ডলিং।
- **[Cloudinary SDK & Multer](https://cloudinary.com/)**: পোস্ট, রিলস, স্টোরিজ ও প্রোফাইল মিডিয়া ক্লাউডে সংরক্ষণ ও অপ্টিমাইজেশনের জন্য।
- **[Better Auth & Cookie-Parser](https://better-auth.com/)**: শক্তিশালী সেশন ও কুকি সিকিউরিটি।
- **[Zod](https://zod.dev/)**: ইনপুট ডাটা ভ্যালিডেশন।
- **[Dotenv](https://github.com/motdotla/dotenv)**: সিকিউর এনভায়রনমেন্ট ভেরিয়েবল হ্যান্ডলিং।

---

## ✨ মূল ফিচারসমূহ (Key Features)

1. **🔐 অ্যাডভান্সড অথেনটিকেশন (JWT & Session Auth):**
   - `jose-cjs` ভিত্তিক JWT Bearer টোকেন ও সিকিউর কুকি সেশন সাপোর্ট।
   - অটো-রিফ্রেশ ও প্রোটেক্টেড রাউট।
2. **📱 স্মার্ট ফিড অ্যালগরিদম (Smart Feed):**
   - প্রতি রিলোডে নতুন পোস্ট অগ্রাধিকার পেয়ে শীর্ষে চলে আসবে।
   - নিজের এবং যাদের ফলো করা হয়েছে তাদের পোস্ট অগ্রাধিকার (Priority) পাবে।
3. **🎬 রিলস ও স্টোরিজ (Reels & 24h Stories):**
   - ফুলস্ক্রিন টিকটক/রিলস স্টাইল ভিডিও প্লেয়ার, কমেন্ট ও লাইক।
   - ২৪ ঘণ্টার সেলফ-এক্সপায়ারিং স্টোরিজ দেখার ও তৈরি করার স্টোরি এডিটর।
4. **📞 অডিও ও ভিডিও কলিং (WebRTC Audio/Video Calls):**
   - এন্ড-টু-এন্ড এনক্রিপ্টেড ভয়েস ও ভিডিও কল।
   - কল ওভারলে, মিনিমাইজড পিকচার-ইন-পিকচার (PiP), এবং কল মিউট/ক্যামেরা অফ সুবিধা।
5. **💬 ইনস্ট্যান্ট মেসেজিং (Real-time Chat):**
   - সকেট ব্যবহার করে মুহূর্তেই মেসেজ আদান-প্রদান এবং এক্টিভ স্ট্যাটাস।
6. **🔔 লাইভ নোটিফিকেশন (Real-time Notifications):**
   - লাইক, কমেন্ট, ফলো, নতুন পোস্ট এবং ইনকামিং কলের লাইভ নোটিফিকেশন।
7. **👥 সাজেস্টেড পিপল (Suggested People):**
   - নতুন ক্রিয়েটর ও বন্ধুদের সহজে খুঁজে পাওয়ার ও ফলো করার পেজ।

---

## 🌐 Vercel ডিপ্লয়মেন্ট নির্দেশিকা (Important for Vercel)

আপনার ফ্রন্টএন্ডটি আগে **Vite / React** হিসেবে Vercel-এ ডিপ্লয় করা ছিল। এখন এটি **Next.js** প্রজেক্টে রূপান্তর করা হয়েছে:

১. `frontend/vercel.json` ফাইলে স্বয়ংক্রিয়ভাবে `"framework": "nextjs"` কনফিগার করা রয়েছে।
২. আপনার Vercel ড্যাশবোর্ডে গিয়ে প্রজেক্ট সেটিংসে:
   - **Settings** ➔ **General** ➔ **Framework Preset** এ গিয়ে **`Next.js`** সিলেক্ট করে সেভ করুন।
   - **Root Directory** যেন **`frontend`** থাকে।
   - GitHub-এ পুশ করার সাথে সাথেই Vercel স্বয়ংক্রিয়ভাবে Next.js হিসেবে বিল্ড ও ডিপ্লয় করে নিবে।

---

## 🚀 লোকাল মেশিনে রান করার নিয়ম (How to Run Locally)

### ১. ব্যাকএন্ড রান করুন:
```bash
cd backend
npm install
npm run dev
```

### ২. ফ্রন্টএন্ড রান করুন:
```bash
cd frontend
npm install
npm run dev
```
ব্রাউজারে [http://localhost:3000](http://localhost:3000) ওপেন করলেই যেকোনো ডিভাইসে সম্পূর্ণ সাইটটি দেখতে পাবেন।
