-- Seed tracks (only when empty) + full curriculum for Data Science & Digital Literacy

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM tracks LIMIT 1) THEN
    RAISE NOTICE 'tracks already seeded — skipping';
    RETURN;
  END IF;

  -- ── TRACKS ──────────────────────────────────────────────────
  INSERT INTO tracks (id, slug, title_en, title_bn, description_en, description_bn, price_bdt, is_free, difficulty, estimated_hours, tier, published) VALUES
    ('a1000001-0001-4000-8000-000000000001', 'digital-literacy', 'Digital Literacy', 'ডিজিটাল সাক্ষরতা', 'Essential computer and online skills for everyday life.', 'দৈনন্দিন জীবনের জন্য কম্পিউটার ও অনলাইন দক্ষতা।', 0, true, 'beginner', 12, 1, true),
    ('a1000001-0001-4000-8000-000000000002', 'basic-computer-skills', 'Basic Computer Skills', 'বেসিক কম্পিউটার দক্ষতা', 'Operating system basics, files, and productivity.', 'অপারেটিং সিস্টেম, ফাইল ও প্রোডাক্টিভিটি।', 1500, false, 'beginner', 10, 1, false),
    ('a1000001-0001-4000-8000-000000000003', 'internet-online-safety', 'Internet & Online Safety', 'ইন্টারনেট ও অনলাইন নিরাপত্তা', 'Browse safely and protect your data online.', 'নিরাপদে ব্রাউজ করুন এবং ডেটা সুরক্ষা।', 1200, false, 'beginner', 8, 1, false),
    ('a1000001-0001-4000-8000-000000000004', 'smartphone-apps', 'Smartphone & Apps', 'স্মার্টফোন ও অ্যাপ', 'Master your phone and essential apps.', 'ফোন ও প্রয়োজনীয় অ্যাপ ব্যবহার।', 1000, false, 'beginner', 6, 1, false),
    ('a1000001-0001-4000-8000-000000000005', 'community-health-worker', 'Community Health Worker', 'কমিউনিটি হেলথ ওয়ার্কার', 'Community health fundamentals and outreach.', 'সম্প্রদায় স্বাস্থ্যের মৌলিক বিষয়।', 2000, false, 'beginner', 20, 1, false),
    ('a1000001-0001-4000-8000-000000000006', 'rooftop-gardening', 'Rooftop Gardening', 'ছাদ বাগান', 'Grow food on rooftops and balconies.', 'ছাদ ও বারান্দায় খাদ্য উৎপাদন।', 800, false, 'beginner', 8, 1, false),
    ('a1000002-0002-4000-8000-000000000001', 'git-version-control', 'Git & Version Control', 'গিট ও ভার্সন কন্ট্রোল', 'Track code changes with Git and GitHub.', 'গিট ও গিটহাব দিয়ে কোড ট্র্যাকিং।', 2500, false, 'intermediate', 10, 2, true),
    ('a1000002-0002-4000-8000-000000000002', 'ai-prompting-basics', 'AI & Prompting Basics', 'এআই ও প্রম্পটিং বেসিক', 'Use AI tools effectively with clear prompts.', 'স্পষ্ট প্রম্পট দিয়ে এআই টুল ব্যবহার।', 2000, false, 'beginner', 6, 2, false),
    ('a1000002-0002-4000-8000-000000000003', 'python-foundations', 'Python Foundations', 'পাইথন ফাউন্ডেশন', 'Python syntax, logic, and problem solving.', 'পাইথন সিনট্যাক্স, লজিক ও সমস্যা সমাধান।', 3000, false, 'beginner', 20, 2, false),
    ('a1000003-0003-4000-8000-000000000001', 'data-science', 'Data Science', 'ডেটা সায়েন্স', 'Python, pandas, visualization, and ML basics.', 'পাইথন, প্যান্ডাস, ভিজুয়ালাইজেশন ও এমএল।', 5000, false, 'intermediate', 60, 3, true),
    ('a1000003-0003-4000-8000-000000000003', 'backend-development', 'Backend Development', 'ব্যাকএন্ড ডেভেলপমেন্ট', 'APIs, databases, and server-side engineering.', 'এপিআই, ডাটাবেস ও সার্ভার।', 5500, false, 'intermediate', 50, 3, false),
    ('a1000003-0003-4000-8000-000000000004', 'devops-cloud', 'DevOps & Cloud', 'ডেভঅপ্স ও ক্লাউড', 'CI/CD, containers, and cloud deployment.', 'সিআই/সিডি, কন্টেইনার ও ক্লাউড।', 6000, false, 'advanced', 45, 3, false),
    ('a1000003-0003-4000-8000-000000000005', 'fullstack-mern', 'Full Stack MERN', 'ফুল স্ট্যাক MERN', 'MongoDB, Express, React, and Node.js.', 'মার্ন স্ট্যাক ওয়েব অ্যাপ্লিকেশন।', 6500, false, 'intermediate', 70, 3, false),
    ('a1000003-0003-4000-8000-000000000006', 'precision-agriculture', 'Precision Agriculture', 'প্রিসিশন এগ্রিকালচার', 'Data-driven farming and sensors.', 'ডেটা-চালিত কৃষি ও সেন্সর।', 4000, false, 'intermediate', 30, 3, false),
    ('a1000003-0003-4000-8000-000000000007', 'hydroponics-expert', 'Hydroponics Expert', 'হাইড্রোপনিক্স এক্সপার্ট', 'Soil-free growing systems and nutrients.', 'মাটিহীন চাষ ও পুষ্টি ব্যবস্থাপনা।', 3500, false, 'intermediate', 25, 3, false);

  -- ── DIGITAL LITERACY ────────────────────────────────────────
  INSERT INTO modules (id, track_id, title_en, title_bn, order_index) VALUES
    ('b1000001-0001-4000-8000-000000000001', 'a1000001-0001-4000-8000-000000000001', 'Computer Basics', 'কম্পিউটার বেসিক', 1),
    ('b1000001-0001-4000-8000-000000000002', 'a1000001-0001-4000-8000-000000000001', 'Internet & Email', 'ইন্টারনেট ও ইমেইল', 2);

  INSERT INTO lessons (id, module_id, title_en, title_bn, youtube_video_id, notes_md, order_index, estimated_mins) VALUES
    ('c1000001-0001-4000-8000-000000000001', 'b1000001-0001-4000-8000-000000000001', 'What is a Computer?', 'কম্পিউটার কী?', 'IEpBarc9fFY', E'## What is a Computer?\n\nA computer processes input into output using hardware and software.\n\n- **Input**: keyboard, mouse, touch\n- **Processing**: CPU and memory\n- **Output**: screen, speakers, printer', 1, 12),
    ('c1000001-0001-4000-8000-000000000002', 'b1000001-0001-4000-8000-000000000001', 'Mouse & Keyboard Skills', 'মাউস ও কীবোর্ড', 'MOIUurNRq0U', E'## Mouse & Keyboard\n\nPractice clicking, dragging, and typing accurately.\n\n- Left click selects\n- Right click opens context menu\n- Shortcuts like **Ctrl+C** copy', 2, 15),
    ('c1000001-0001-4000-8000-000000000003', 'b1000001-0001-4000-8000-000000000001', 'Files & Folders', 'ফাইল ও ফোল্ডার', '8jLOx1hD3_o', E'## Organizing Files\n\nFolders group related files. Use clear names and backup important documents.', 3, 14),
    ('c1000001-0001-4000-8000-000000000004', 'b1000001-0001-4000-8000-000000000002', 'Browsing the Web Safely', 'নিরাপদ ওয়েব ব্রাউজিং', '0QfKlDEJzk4', E'## Web Safety\n\n- Check for **https** in the address bar\n- Avoid suspicious download links\n- Use strong, unique passwords', 1, 18),
    ('c1000001-0001-4000-8000-000000000005', 'b1000001-0001-4000-8000-000000000002', 'Email Basics', 'ইমেইল বেসিক', '3BaYc4YlF70', E'## Email\n\nSend professional messages with a clear subject line and polite greeting.', 2, 16);

  -- ── DATA SCIENCE ────────────────────────────────────────────
  INSERT INTO modules (id, track_id, title_en, title_bn, order_index) VALUES
    ('b1000003-0003-4000-8000-000000000001', 'a1000003-0003-4000-8000-000000000001', 'Python for Data', 'ডেটার জন্য পাইথন', 1),
    ('b1000003-0003-4000-8000-000000000002', 'a1000003-0003-4000-8000-000000000001', 'Data Analysis', 'ডেটা বিশ্লেষণ', 2);

  INSERT INTO lessons (id, module_id, title_en, title_bn, youtube_video_id, notes_md, order_index, estimated_mins) VALUES
    ('c1000003-0003-4000-8000-000000000001', 'b1000003-0003-4000-8000-000000000001', 'Python Crash Course', 'পাইথন ক্র্যাশ কোর্স', '_uQrJ0TkZlc', E'## Python Basics\n\n```python\nname = "Fixeth"\nprint(f"Hello, {name}!")\n```\n\nVariables, types, and control flow are the foundation of data work.', 1, 60),
    ('c1000003-0003-4000-8000-000000000002', 'b1000003-0003-4000-8000-000000000001', 'Functions & Scope', 'ফাংশন ও স্কোপ', 'NSbOtYzWBpM', E'## Functions\n\nUse `def` to define reusable blocks. `return` sends a value back to the caller.', 2, 25),
    ('c1000003-0003-4000-8000-000000000003', 'b1000003-0003-4000-8000-000000000001', 'Working with Lists', 'লিস্ট নিয়ে কাজ', 'ohCDJmgcH48', E'## Lists\n\nLists hold ordered items. Index from `0`. Slicing: `items[1:3]`.', 3, 20),
    ('c1000003-0003-4000-8000-000000000004', 'b1000003-0003-4000-8000-000000000002', 'NumPy Arrays', 'নামপাই অ্যারে', 'QUT1VHiLmmI', E'## NumPy\n\nFast numeric arrays for vectorized math — essential before pandas.', 1, 45),
    ('c1000003-0003-4000-8000-000000000005', 'b1000003-0003-4000-8000-000000000002', 'Pandas DataFrames', 'প্যান্ডাস ডেটাফ্রেম', 'vmEHCJofslg', E'## Pandas\n\nLoad CSVs, filter rows, and aggregate with `groupby`.', 2, 40),
    ('c1000003-0003-4000-8000-000000000006', 'b1000003-0003-4000-8000-000000000002', 'Data Visualization', 'ডেটা ভিজুয়ালাইজেশন', 'UO98lJQ3QAI', E'## Charts\n\nUse matplotlib to explore distributions and trends before modeling.', 3, 35);

  -- Diagnostic quiz items for published tracks (5 each)
  INSERT INTO quiz_items (lesson_id, question_en, question_bn, options, difficulty) VALUES
    (NULL, 'Which password is strongest?', 'কোন পাসওয়ার্ড সবচেয়ে শক্তিশালী?', '{"options":["birthday1990","password123","dH8_!kLs2_#pQx9","admin"],"correct":2}'::jsonb, 1),
    (NULL, 'Columns in Excel are labeled with:', 'এক্সেলে কলাম চিহ্নিত হয়:', '{"options":["Numbers 1,2,3","Letters A,B,C","Symbols #,$","Roman numerals"],"correct":1}'::jsonb, 1),
    (NULL, 'HTTPS in a URL means:', 'URL-এ HTTPS মানে:', '{"options":["The site is decorative","The connection is encrypted","No login needed","Free internet"],"correct":1}'::jsonb, 1),
    (NULL, 'A folder is used to:', 'ফোল্ডার ব্যবহার করা হয়:', '{"options":["Delete the computer","Group related files","Speed up WiFi","Print documents"],"correct":1}'::jsonb, 1),
    (NULL, 'Phishing emails often:', 'ফিশিং ইমেইল সাধারণত:', '{"options":["Ask for passwords urgently","Come from friends only","Have no links","Are always short"],"correct":0}'::jsonb, 1);

  INSERT INTO quiz_items (lesson_id, question_en, question_bn, options, difficulty) VALUES
    (NULL, 'NumPy is primarily used for:', 'নামপাই মূলত ব্যবহার হয়:', '{"options":["Web styling","Numeric arrays","Email","Video editing"],"correct":1}'::jsonb, 2),
    (NULL, 'In Python, functions are defined with:', 'পাইথনে ফাংশন সংজ্ঞায়িত হয়:', '{"options":["func","def","fn","lambda only"],"correct":1}'::jsonb, 1),
    (NULL, 'A pandas DataFrame is like:', 'প্যান্ডাস ডেটাফ্রেম অনুরূপ:', '{"options":["A spreadsheet table","A GPU","An OS","A router"],"correct":0}'::jsonb, 2),
    (NULL, 'Supervised learning uses:', 'সুপারভাইজড লার্নিং ব্যবহার করে:', '{"options":["Only random data","Labeled training data","No data","Only images"],"correct":1}'::jsonb, 2),
    (NULL, 'Matplotlib is used for:', 'ম্যাটপ্লটলিব ব্যবহার হয়:', '{"options":["Plotting charts","Compiling C","DNS lookup","Git merges"],"correct":0}'::jsonb, 2);

END $$;

-