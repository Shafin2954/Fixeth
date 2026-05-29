WITH track_data AS (
  INSERT INTO tracks (slug, title_en, title_bn, description_en, description_bn, is_free, difficulty, estimated_hours, skills, tools, published, tier)
  VALUES
    ('python-foundations', 'Python Foundations', 'পাইথন ভিত্তি', 'Learn Python basics from scratch', 'শূন্য থেকে পাইথন শিখুন', true, 'beginner', 40, ARRAY['programming', 'python'], ARRAY['VSCode', 'Python 3'], true, 1),
    ('web-development', 'Web Development with JavaScript', 'জাভাস্ক্রিপ্ট দিয়ে ওয়েব ডেভেলপমেন্ট', 'Build responsive web applications', 'প্রতিক্রিয়াশীল ওয়েব অ্যাপ্লিকেশন তৈরি করুন', false, 'intermediate', 60, ARRAY['javascript', 'html', 'css'], ARRAY['VSCode', 'React'], true, 2),
    ('data-science-101', 'Data Science Fundamentals', 'ডেটা বিজ্ঞান মৌলিকবিষয়', 'Introduction to data analysis and visualization', 'ডেটা বিশ্লেষণ এবং ভিজুয়ালাইজেশনের পরিচয়', false, 'intermediate', 50, ARRAY['data-science', 'python'], ARRAY['Jupyter', 'Pandas'], true, 2)
  RETURNING id, slug
),
python_modules AS (
  INSERT INTO modules (track_id, title_en, title_bn, order_index)
  SELECT t.id, m.title_en, m.title_bn, m.order_index
  FROM (
    SELECT * FROM track_data WHERE slug = 'python-foundations'
  ) t,
  (
    VALUES
      ('Introduction & Setup', 'পরিচয় ও সেটআপ', 1),
      ('Data Types and Variables', 'ডেটা টাইপ এবং ভেরিয়েবল', 2),
      ('Control Flow', 'নিয়ন্ত্রণ প্রবাহ', 3),
      ('Functions and Modules', 'ফাংশন এবং মডিউল', 4),
      ('Object-Oriented Programming', 'অবজেক্ট-ওরিয়েন্টেড প্রোগ্রামিং', 5)
  ) m(title_en, title_bn, order_index)
  RETURNING id, track_id
),
web_modules AS (
  INSERT INTO modules (track_id, title_en, title_bn, order_index)
  SELECT t.id, m.title_en, m.title_bn, m.order_index
  FROM (
    SELECT * FROM track_data WHERE slug = 'web-development'
  ) t,
  (
    VALUES
      ('HTML Essentials', 'HTML অপরিহার্যতা', 1),
      ('CSS Styling & Layouts', 'CSS স্টাইলিং এবং লেআউট', 2),
      ('JavaScript Fundamentals', 'জাভাস্ক্রিপ্ট মৌলিকবিষয়', 3),
      ('React Basics', 'রিঅ্যাক্ট মৌলিকবিষয়', 4)
  ) m(title_en, title_bn, order_index)
  RETURNING id, track_id
),
data_modules AS (
  INSERT INTO modules (track_id, title_en, title_bn, order_index)
  SELECT t.id, m.title_en, m.title_bn, m.order_index
  FROM (
    SELECT * FROM track_data WHERE slug = 'data-science-101'
  ) t,
  (
    VALUES
      ('Data Analysis Basics', 'ডেটা বিশ্লেষণ মৌলিকবিষয়', 1),
      ('Pandas Mastery', 'পাণ্ডাস দক্ষতা', 2),
      ('Data Visualization', 'ডেটা ভিজুয়ালাইজেশন', 3)
  ) m(title_en, title_bn, order_index)
  RETURNING id, track_id
),
python_lessons AS (
  INSERT INTO lessons (module_id, title_en, title_bn, order_index, estimated_mins, youtube_video_id)
  SELECT m.id, l.title_en, l.title_bn, l.order_index, l.estimated_mins, NULL
  FROM python_modules m
  CROSS JOIN LATERAL (
    CASE 
      WHEN ROW_NUMBER() OVER (ORDER BY m.id) = 1 THEN (SELECT ARRAY[
        ('What is Python?', 'পাইথন কি?', 1, 15),
        ('Installation and Setup', 'ইনস্টলেশন এবং সেটআপ', 2, 12),
        ('Your First Program', 'আপনার প্রথম প্রোগ্রাম', 3, 10)
      ] AS t)
      WHEN ROW_NUMBER() OVER (ORDER BY m.id) = 2 THEN (SELECT ARRAY[
        ('Integers and Floats', 'পূর্ণ সংখ্যা এবং ভগ্নাংশ', 1, 18),
        ('Strings and Operations', 'স্ট্রিং এবং অপারেশন', 2, 20),
        ('Lists and Tuples', 'লিস্ট এবং টিপেল', 3, 22)
      ] AS t)
      WHEN ROW_NUMBER() OVER (ORDER BY m.id) = 3 THEN (SELECT ARRAY[
        ('If Statements', 'ইফ স্টেটমেন্ট', 1, 20),
        ('Loops and Iteration', 'লুপ এবং পুনরাবৃত্তি', 2, 25),
        ('Break and Continue', 'ব্রেক এবং কন্টিনিউ', 3, 15)
      ] AS t)
      WHEN ROW_NUMBER() OVER (ORDER BY m.id) = 4 THEN (SELECT ARRAY[
        ('Defining Functions', 'ফাংশন সংজ্ঞা', 1, 20),
        ('Parameters and Returns', 'প্যারামিটার এবং রিটার্ন', 2, 18),
        ('Importing Modules', 'মডিউল আমদানি', 3, 15)
      ] AS t)
      ELSE (SELECT ARRAY[
        ('Classes and Objects', 'ক্লাস এবং অবজেক্ট', 1, 25),
        ('Inheritance', 'উত্তরাধিকার', 2, 20),
        ('Polymorphism', 'পলিমরফিজম', 3, 18)
      ] AS t)
    END
  ) l(title_en, title_bn, order_index, estimated_mins)
  RETURNING id, module_id
),
web_lessons AS (
  INSERT INTO lessons (module_id, title_en, title_bn, order_index, estimated_mins, youtube_video_id)
  SELECT m.id, l.title_en, l.title_bn, l.order_index, l.estimated_mins, NULL
  FROM web_modules m
  CROSS JOIN LATERAL (
    CASE 
      WHEN ROW_NUMBER() OVER (ORDER BY m.id) = 1 THEN (SELECT ARRAY[
        ('HTML Document Structure', 'HTML ডকুমেন্ট কাঠামো', 1, 15),
        ('Common HTML Elements', 'সাধারণ HTML উপাদান', 2, 20),
        ('Forms and Input', 'ফর্ম এবং ইনপুট', 3, 18)
      ] AS t)
      WHEN ROW_NUMBER() OVER (ORDER BY m.id) = 2 THEN (SELECT ARRAY[
        ('CSS Selectors', 'CSS নির্বাচক', 1, 20),
        ('Box Model', 'বক্স মডেল', 2, 18),
        ('Flexbox and Grid', 'ফ্লেক্সবক্স এবং গ্রিড', 3, 25)
      ] AS t)
      WHEN ROW_NUMBER() OVER (ORDER BY m.id) = 3 THEN (SELECT ARRAY[
        ('Variables and Scope', 'ভেরিয়েবল এবং স্কোপ', 1, 22),
        ('DOM Manipulation', 'DOM হেরফের', 2, 25),
        ('Events and Listeners', 'ইভেন্ট এবং শ্রোতা', 3, 20)
      ] AS t)
      ELSE (SELECT ARRAY[
        ('Components and Props', 'কম্পোনেন্ট এবং প্রপস', 1, 25),
        ('Hooks Basics', 'হুকস মৌলিকবিষয়', 2, 25),
        ('State Management', 'অবস্থা ব্যবস্থাপনা', 3, 20)
      ] AS t)
    END
  ) l(title_en, title_bn, order_index, estimated_mins)
  RETURNING id, module_id
),
data_lessons AS (
  INSERT INTO lessons (module_id, title_en, title_bn, order_index, estimated_mins, youtube_video_id)
  SELECT m.id, l.title_en, l.title_bn, l.order_index, l.estimated_mins, NULL
  FROM data_modules m
  CROSS JOIN LATERAL (
    CASE 
      WHEN ROW_NUMBER() OVER (ORDER BY m.id) = 1 THEN (SELECT ARRAY[
        ('What is Data Analysis?', 'ডেটা বিশ্লেষণ কি?', 1, 18),
        ('Data Types and Sources', 'ডেটা ধরন এবং উৎস', 2, 20),
        ('Basic Statistics', 'মৌলিক পরিসংখ্যান', 3, 22)
      ] AS t)
      WHEN ROW_NUMBER() OVER (ORDER BY m.id) = 2 THEN (SELECT ARRAY[
        ('DataFrames Essentials', 'ডেটাফ্রেম অপরিহার্যতা', 1, 25),
        ('Reading and Writing Data', 'ডেটা পড়া এবং লেখা', 2, 20),
        ('Data Cleaning', 'ডেটা পরিচ্ছন্নতা', 3, 25)
      ] AS t)
      ELSE (SELECT ARRAY[
        ('Matplotlib Basics', 'ম্যাটপ্লটলিব মৌলিকবিষয়', 1, 20),
        ('Advanced Visualizations', 'উন্নত ভিজুয়ালাইজেশন', 2, 25),
        ('Interactive Dashboards', 'ইন্টারঅ্যাক্টিভ ড্যাশবোর্ড', 3, 22)
      ] AS t)
    END
  ) l(title_en, title_bn, order_index, estimated_mins)
  RETURNING id, module_id
)
SELECT COUNT(*) AS total_lessons_created FROM (
  SELECT * FROM python_lessons
  UNION ALL SELECT * FROM web_lessons
  UNION ALL SELECT * FROM data_lessons
) combined;
