-- ============================================================
-- Fixeth — Data Science Full Curriculum (11 Courses)
-- Migration: 20260613_data_science_full_curriculum.sql
-- Based on: Free_Data_Science_Track_2026_REVISED.md
--
-- Track ID: a1000003-0003-4000-8000-000000000001 (data-science)
-- SAFE: All inserts use ON CONFLICT DO NOTHING
-- Existing lessons (c1000003-*) are NEVER modified.
-- Existing modules (b1000003-*) are NEVER modified.
-- transcript_chunks with existing lesson_ids are UNTOUCHED.
-- ============================================================

DO $$
BEGIN

-- ── COURSE 01 — Python Programming Foundations ───────────────
-- Existing: Module "Python for Data" (b1000003-0003-4000-8000-000000000001)
-- Existing lessons 1-3 already in that module (c1000003-...-000001 to 000003)
-- We add the remaining Course 01 modules (1.2 through 1.8)

INSERT INTO modules (id, track_id, title_en, title_bn, order_index) VALUES
  ('d1000001-0001-4000-8000-000000000001', 'a1000003-0003-4000-8000-000000000001', 'C01: Python Basics', 'পাইথন বেসিক', 3),
  ('d1000001-0001-4000-8000-000000000002', 'a1000003-0003-4000-8000-000000000001', 'C01: Control Flow & Loops', 'কন্ট্রোল ফ্লো ও লুপ', 4),
  ('d1000001-0001-4000-8000-000000000003', 'a1000003-0003-4000-8000-000000000001', 'C01: Functions & Modules', 'ফাংশন ও মডিউল', 5),
  ('d1000001-0001-4000-8000-000000000004', 'a1000003-0003-4000-8000-000000000001', 'C01: Data Structures', 'ডেটা স্ট্রাকচার', 6),
  ('d1000001-0001-4000-8000-000000000005', 'a1000003-0003-4000-8000-000000000001', 'C01: File I/O & Error Handling', 'ফাইল I/O ও এরর হ্যান্ডলিং', 7),
  ('d1000001-0001-4000-8000-000000000006', 'a1000003-0003-4000-8000-000000000001', 'C01: Object-Oriented Programming', 'অবজেক্ট-ওরিয়েন্টেড প্রোগ্রামিং', 8),
  ('d1000001-0001-4000-8000-000000000007', 'a1000003-0003-4000-8000-000000000001', 'C01: Code Quality, APIs & JSON', 'কোড কোয়ালিটি ও API', 9)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, module_id, title_en, title_bn, youtube_video_id, notes_md, order_index, estimated_mins) VALUES
  -- Module 1.2 — Python Basics
  ('e1000001-0001-4000-8000-000000000001', 'd1000001-0001-4000-8000-000000000001',
   'Variables & Data Types', 'ভ্যারিয়েবল ও ডেটা টাইপ',
   'rfscVS0vtbw',
   E'## Variables & Data Types\n\nPython has 4 primitive types:\n```python\nname = "Alice"   # str\nage = 25         # int\ngpa = 3.8        # float\nis_active = True # bool\n```\n\nUse `type()` to check. Use f-strings for formatting: `f"Hello, {name}!"`',
   1, 40),
  -- Module 1.3 — Control Flow
  ('e1000001-0001-4000-8000-000000000002', 'd1000001-0001-4000-8000-000000000002',
   'if/elif/else & Conditionals', 'শর্ত ও নিয়ন্ত্রণ',
   'rfscVS0vtbw',
   E'## Control Flow\n\n```python\nif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelse:\n    print("C")\n```\n\nList comprehensions:\n```python\nsquares = [x**2 for x in range(10) if x % 2 == 0]\n```',
   1, 40),
  ('e1000001-0001-4000-8000-000000000003', 'd1000001-0001-4000-8000-000000000002',
   'for Loops & while Loops', 'লুপ',
   'rfscVS0vtbw',
   E'## Loops\n\n```python\nfor i in range(5):\n    print(i)\n\nwhile condition:\n    do_something()\n    if done: break\n```\nUse `enumerate()` to get index + value together.',
   2, 35),
  -- Module 1.4 — Functions
  ('e1000001-0001-4000-8000-000000000004', 'd1000001-0001-4000-8000-000000000003',
   'Defining Functions', 'ফাংশন সংজ্ঞায়িত করা',
   'u-OmVr_fT4s',
   E'## Functions\n\n```python\ndef greet(name: str, greeting: str = "Hello") -> str:\n    return f"{greeting}, {name}!"\n```\nDefault arguments make functions flexible. Type hints improve readability.',
   1, 35),
  -- Module 1.5 — Data Structures
  ('e1000001-0001-4000-8000-000000000005', 'd1000001-0001-4000-8000-000000000004',
   'Lists, Tuples & Sets', 'লিস্ট, টাপল ও সেট',
   'W8KRzm-HUcc',
   E'## Data Structures\n\n- **List** `[]` — ordered, mutable\n- **Tuple** `()` — ordered, immutable\n- **Set** `{}` — unordered, unique\n\n```python\nfruits = ["apple", "banana"]\nunique = {1, 2, 3}\n```',
   1, 40),
  ('e1000001-0001-4000-8000-000000000006', 'd1000001-0001-4000-8000-000000000004',
   'Dictionaries', 'ডিকশনারি',
   'daefaXgEeuQ',
   E'## Dictionaries\n\n```python\nstudent = {"name": "Rahim", "grade": "A"}\nstudent["score"] = 95\n\nfor key, value in student.items():\n    print(f"{key}: {value}")\n```',
   2, 30),
  -- Module 1.6 — File I/O
  ('e1000001-0001-4000-8000-000000000007', 'd1000001-0001-4000-8000-000000000005',
   'Reading & Writing Files', 'ফাইল পড়া ও লেখা',
   'Uh2ebFW8OYM',
   E'## File I/O\n\n```python\nwith open("data.txt", "r") as f:\n    content = f.read()\n\nwith open("output.txt", "w") as f:\n    f.write("Hello!")\n```\nAlways use `with` — it auto-closes the file.',
   1, 25),
  ('e1000001-0001-4000-8000-000000000008', 'd1000001-0001-4000-8000-000000000005',
   'Exception Handling', 'এক্সেপশন হ্যান্ডলিং',
   'NIWwJbo-9_8',
   E'## Exceptions\n\n```python\ntry:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    print("Cannot divide by zero")\nfinally:\n    print("Always runs")\n```',
   2, 20),
  -- Module 1.7 — OOP
  ('e1000001-0001-4000-8000-000000000009', 'd1000001-0001-4000-8000-000000000006',
   'Classes & Objects', 'ক্লাস ও অবজেক্ট',
   'ZDa-Z5JzLYM',
   E'## OOP Basics\n\n```python\nclass Student:\n    def __init__(self, name: str):\n        self.name = name\n    \n    def greet(self) -> str:\n        return f"Hi, I am {self.name}"\n\ns = Student("Farhan")\nprint(s.greet())\n```',
   1, 45),
  -- Module 1.8 — APIs & Code Quality
  ('e1000001-0001-4000-8000-000000000010', 'd1000001-0001-4000-8000-000000000007',
   'Virtual Environments & JSON', 'ভার্চুয়াল এনভায়রনমেন্ট ও JSON',
   'Kg1Yvry_Ydk',
   E'## Environments & JSON\n\n```bash\npython -m venv venv\nsource venv/bin/activate  # Linux/Mac\nvenv\\Scripts\\activate     # Windows\n```\n\n```python\nimport json\ndata = json.loads(\'{"name": "Ali", "score": 95}\')\nprint(data["name"])  # Ali\n```',
   1, 40),
  ('e1000001-0001-4000-8000-000000000011', 'd1000001-0001-4000-8000-000000000007',
   'REST APIs with requests', 'REST API',
   'tb8gHvYlCFs',
   E'## REST APIs\n\n```python\nimport requests\n\nresponse = requests.get("https://api.open-meteo.com/v1/forecast?latitude=23.8&longitude=90.4&current_weather=true")\ndata = response.json()\nprint(data["current_weather"]["temperature"])\n```\n\nAlways check `response.status_code == 200` before parsing.',
   2, 25)
ON CONFLICT DO NOTHING;


-- ── COURSE 02 — Mathematics & Statistics ─────────────────────

INSERT INTO modules (id, track_id, title_en, title_bn, order_index) VALUES
  ('d1000002-0002-4000-8000-000000000001', 'a1000003-0003-4000-8000-000000000001', 'C02: Descriptive Statistics', 'বর্ণনামূলক পরিসংখ্যান', 10),
  ('d1000002-0002-4000-8000-000000000002', 'a1000003-0003-4000-8000-000000000001', 'C02: Probability Theory', 'সম্ভাব্যতা তত্ত্ব', 11),
  ('d1000002-0002-4000-8000-000000000003', 'a1000003-0003-4000-8000-000000000001', 'C02: Probability Distributions', 'সম্ভাব্যতা বিতরণ', 12),
  ('d1000002-0002-4000-8000-000000000004', 'a1000003-0003-4000-8000-000000000001', 'C02: Hypothesis Testing', 'হাইপোথিসিস টেস্টিং', 13),
  ('d1000002-0002-4000-8000-000000000005', 'a1000003-0003-4000-8000-000000000001', 'C02: Linear Algebra', 'রৈখিক বীজগণিত', 14),
  ('d1000002-0002-4000-8000-000000000006', 'a1000003-0003-4000-8000-000000000001', 'C02: Calculus Intuition', 'ক্যালকুলাস ইন্টুইশন', 15),
  ('d1000002-0002-4000-8000-000000000007', 'a1000003-0003-4000-8000-000000000001', 'C02: A/B Testing', 'A/B টেস্টিং', 16)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, module_id, title_en, title_bn, youtube_video_id, notes_md, order_index, estimated_mins) VALUES
  ('e1000002-0002-4000-8000-000000000001', 'd1000002-0002-4000-8000-000000000001',
   'Mean, Median, Variance & Std Dev', 'মিন, মিডিয়ান, ভ্যারিয়েন্স',
   'SzZ6GpcfoQY',
   E'## Descriptive Statistics\n\n```python\nimport numpy as np\nfrom scipy import stats\n\ndata = [12, 15, 18, 22, 25, 28]\nprint(np.mean(data))    # 20.0\nprint(np.median(data))  # 20.0\nprint(np.std(data))     # 5.47\nprint(stats.describe(data))\n```',
   1, 45),
  ('e1000002-0002-4000-8000-000000000002', 'd1000002-0002-4000-8000-000000000002',
   'Bayes'' Theorem & Conditional Probability', 'বেইজ থিওরেম',
   '9wCnvr7Xw4E',
   E'## Bayes Theorem\n\nP(A|B) = P(B|A) × P(A) / P(B)\n\nCritical for Naive Bayes classifier and understanding prior/posterior probabilities in ML models.',
   1, 30),
  ('e1000002-0002-4000-8000-000000000003', 'd1000002-0002-4000-8000-000000000003',
   'Normal Distribution & CLT', 'নরমাল বিতরণ ও CLT',
   'rzFX5NWojp0',
   E'## Normal Distribution\n\n```python\nfrom scipy.stats import norm\nimport matplotlib.pyplot as plt\nimport numpy as np\n\nx = np.linspace(-4, 4, 100)\nplt.plot(x, norm.pdf(x))\nplt.title("Standard Normal Distribution")\n```\n\nCentral Limit Theorem: sample means approach normal distribution as n → ∞.',
   1, 40),
  ('e1000002-0002-4000-8000-000000000004', 'd1000002-0002-4000-8000-000000000004',
   'Hypothesis Testing & p-values', 'হাইপোথিসিস টেস্টিং',
   '0oc49DyA3hU',
   E'## Hypothesis Testing\n\n```python\nfrom scipy import stats\n\n# Two-sample t-test\ngroup_a = [28, 31, 29, 33, 30]\ngroup_b = [35, 38, 36, 40, 37]\nt_stat, p_value = stats.ttest_ind(group_a, group_b)\nprint(f"p-value: {p_value:.4f}")  # < 0.05 → reject H0\n```',
   1, 45),
  ('e1000002-0002-4000-8000-000000000005', 'd1000002-0002-4000-8000-000000000005',
   'Vectors, Matrices & Dot Products', 'ভেক্টর ও ম্যাট্রিক্স',
   'fNk_zzaMoSs',
   E'## Linear Algebra\n\n```python\nimport numpy as np\n\nA = np.array([[1, 2], [3, 4]])\nB = np.array([[5, 6], [7, 8]])\n\nprint(np.dot(A, B))       # Matrix multiply\nprint(A.T)                # Transpose\nprint(np.linalg.inv(A))   # Inverse\n```',
   1, 50),
  ('e1000002-0002-4000-8000-000000000006', 'd1000002-0002-4000-8000-000000000006',
   'Derivatives & Gradient Descent', 'গ্রেডিয়েন্ট ডিসেন্ট',
   'sDv4f4s2SB8',
   E'## Gradient Descent\n\nGradient descent minimizes a loss function by following the slope:\n```\nθ = θ - α × ∂L/∂θ\n```\nwhere α is the learning rate. This is how neural networks learn.',
   1, 35),
  ('e1000002-0002-4000-8000-000000000007', 'd1000002-0002-4000-8000-000000000007',
   'A/B Testing: Design & Analysis', 'A/B টেস্ট ডিজাইন',
   'UFXd3bhMBwA',
   E'## A/B Testing\n\n```python\nfrom statsmodels.stats.power import TTestIndPower\n\n# Calculate required sample size\nanalysis = TTestIndPower()\nn = analysis.solve_power(effect_size=0.2, power=0.8, alpha=0.05)\nprint(f"Required n per group: {n:.0f}")\n```\n\nNever peek at results early — it inflates false positive rate.',
   1, 40)
ON CONFLICT DO NOTHING;


-- ── COURSE 03 — Data Wrangling (extend existing module b1000003-...-000002) ──

INSERT INTO modules (id, track_id, title_en, title_bn, order_index) VALUES
  ('d1000003-0003-4000-8000-000000000001', 'a1000003-0003-4000-8000-000000000001', 'C03: Data Cleaning', 'ডেটা ক্লিনিং', 17),
  ('d1000003-0003-4000-8000-000000000002', 'a1000003-0003-4000-8000-000000000001', 'C03: GroupBy & Aggregation', 'গ্রুপবাই ও অ্যাগ্রিগেশন', 18),
  ('d1000003-0003-4000-8000-000000000003', 'a1000003-0003-4000-8000-000000000001', 'C03: Merging & Reshaping', 'মার্জিং ও রিশেপিং', 19),
  ('d1000003-0003-4000-8000-000000000004', 'a1000003-0003-4000-8000-000000000001', 'C03: DateTime & Time Series', 'ডেটটাইম', 20),
  ('d1000003-0003-4000-8000-000000000005', 'a1000003-0003-4000-8000-000000000001', 'C03: Modern Formats & Polars', 'Parquet ও Polars', 21)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, module_id, title_en, title_bn, youtube_video_id, notes_md, order_index, estimated_mins) VALUES
  ('e1000003-0003-4000-8000-000000000001', 'd1000003-0003-4000-8000-000000000001',
   'Handling Missing Data', 'মিসিং ডেটা হ্যান্ডলিং',
   'bDhvCp3_lYw',
   E'## Missing Data\n\n```python\nimport pandas as pd\n\ndf.isnull().sum()                  # count NaN per column\ndf.dropna(subset=["age"])          # drop rows where age is NaN\ndf["salary"].fillna(df["salary"].median(), inplace=True)\n```\n\nChoose strategy based on MCAR/MAR/MNAR pattern.',
   1, 30),
  ('e1000003-0003-4000-8000-000000000002', 'd1000003-0003-4000-8000-000000000002',
   'GroupBy & Pivot Tables', 'গ্রুপবাই',
   'txMdrV1Ut64',
   E'## GroupBy\n\n```python\ndf.groupby("department")["salary"].agg(["mean", "max", "count"])\n\n# Pivot table\npd.pivot_table(df, values="sales", index="region", columns="quarter", aggfunc="sum")\n```',
   1, 40),
  ('e1000003-0003-4000-8000-000000000003', 'd1000003-0003-4000-8000-000000000003',
   'Merge, Join & Concat', 'মার্জ ও জয়েন',
   'XMjSGGej9y8',
   E'## Merging DataFrames\n\n```python\n# SQL-style joins\nresult = pd.merge(orders, customers, on="customer_id", how="left")\n\n# Stack vertically\ncombined = pd.concat([df_2024, df_2025], ignore_index=True)\n```',
   1, 35),
  ('e1000003-0003-4000-8000-000000000004', 'd1000003-0003-4000-8000-000000000004',
   'Working with Dates & Time', 'তারিখ ও সময়',
   'UFuo7EHI8zc',
   E'## DateTime\n\n```python\ndf["date"] = pd.to_datetime(df["date"])\ndf.set_index("date", inplace=True)\n\n# Resample monthly\nmonthly_sales = df["revenue"].resample("ME").sum()\n\n# Rolling average\ndf["rolling_avg"] = df["revenue"].rolling(window=7).mean()\n```',
   1, 30),
  ('e1000003-0003-4000-8000-000000000005', 'd1000003-0003-4000-8000-000000000005',
   'Parquet Files & Memory Optimization', 'Parquet ফাইল',
   'H_8biUtEbKU',
   E'## Parquet\n\n```python\n# Write\ndf.to_parquet("data.parquet", index=False)\n\n# Read — much faster than CSV\ndf = pd.read_parquet("data.parquet")\n\n# Memory optimization\ndf["category"] = df["category"].astype("category")  # saves memory\ndf["id"] = pd.to_numeric(df["id"], downcast="integer")\n```',
   1, 30)
ON CONFLICT DO NOTHING;


-- ── COURSE 04 — Data Visualization & Storytelling ────────────

INSERT INTO modules (id, track_id, title_en, title_bn, order_index) VALUES
  ('d1000004-0004-4000-8000-000000000001', 'a1000003-0003-4000-8000-000000000001', 'C04: Matplotlib Fundamentals', 'Matplotlib বেসিক', 22),
  ('d1000004-0004-4000-8000-000000000002', 'a1000003-0003-4000-8000-000000000001', 'C04: Seaborn Statistical Viz', 'Seaborn', 23),
  ('d1000004-0004-4000-8000-000000000003', 'a1000003-0003-4000-8000-000000000001', 'C04: Plotly Interactive Charts', 'Plotly', 24),
  ('d1000004-0004-4000-8000-000000000004', 'a1000003-0003-4000-8000-000000000001', 'C04: Tableau & Power BI', 'Tableau ও Power BI', 25),
  ('d1000004-0004-4000-8000-000000000005', 'a1000003-0003-4000-8000-000000000001', 'C04: Data Storytelling', 'ডেটা স্টোরিটেলিং', 26),
  ('d1000004-0004-4000-8000-000000000006', 'a1000003-0003-4000-8000-000000000001', 'C04: Looker Studio & Accessibility', 'Looker Studio', 27)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, module_id, title_en, title_bn, youtube_video_id, notes_md, order_index, estimated_mins) VALUES
  ('e1000004-0004-4000-8000-000000000001', 'd1000004-0004-4000-8000-000000000001',
   'Figure, Axes & Plot Types', 'ফিগার ও প্লট',
   'UO98lJQ3QAI',
   E'## Matplotlib\n\n```python\nimport matplotlib.pyplot as plt\n\nfig, axes = plt.subplots(1, 2, figsize=(12, 5))\naxes[0].plot(x, y, color="steelblue", linewidth=2)\naxes[1].bar(categories, values)\nfig.suptitle("Dashboard")\nplt.tight_layout()\n```',
   1, 45),
  ('e1000004-0004-4000-8000-000000000002', 'd1000004-0004-4000-8000-000000000002',
   'Seaborn: Distributions & Heatmaps', 'Seaborn বিতরণ',
   '6GUZXDef2U0',
   E'## Seaborn\n\n```python\nimport seaborn as sns\n\nsns.histplot(df["salary"], kde=True)\nsns.boxplot(x="department", y="salary", data=df)\nsns.heatmap(df.corr(), annot=True, fmt=".2f", cmap="coolwarm")\n```',
   1, 45),
  ('e1000004-0004-4000-8000-000000000003', 'd1000004-0004-4000-8000-000000000003',
   'Plotly Express Interactive Charts', 'Plotly এক্সপ্রেস',
   'GGL6U0k8WYA',
   E'## Plotly\n\n```python\nimport plotly.express as px\n\nfig = px.scatter(df, x="experience", y="salary",\n                 color="department", size="performance",\n                 hover_data=["name"])\nfig.show()\n```\n\nInteractive tooltips, zoom, and pan work out of the box.',
   1, 40),
  ('e1000004-0004-4000-8000-000000000004', 'd1000004-0004-4000-8000-000000000004',
   'Tableau Public Dashboard', 'Tableau ড্যাশবোর্ড',
   'TPMlZxRRaBQ',
   E'## Tableau Public\n\nConnect to CSV/Excel → Drag dimensions to Rows/Columns → Add filters → Publish to public.tableau.com\n\nFree forever. Your published dashboards = portfolio.',
   1, 50),
  ('e1000004-0004-4000-8000-000000000005', 'd1000004-0004-4000-8000-000000000005',
   'Storytelling with Data', 'ডেটা স্টোরিটেলিং',
   'r5_34YnCmhY',
   E'## Data Storytelling\n\nStructure: **Context → Tension → Resolution**\n\n1. What is the business question?\n2. What does the data show?\n3. What should the audience DO with this insight?\n\nAvoid chart junk. One key insight per slide.',
   1, 35),
  ('e1000004-0004-4000-8000-000000000006', 'd1000004-0004-4000-8000-000000000006',
   'Google Looker Studio', 'লুকার স্টুডিও',
   'hhZ_3ZW9FcU',
   E'## Looker Studio\n\nFree, browser-based, connects to Google Sheets, BigQuery, CSV.\n\n1. Go to lookerstudio.google.com\n2. Create report → Add data source\n3. Drag charts → Share link = shareable dashboard',
   1, 35)
ON CONFLICT DO NOTHING;


-- ── COURSE 05 — SQL & Relational Databases ───────────────────

INSERT INTO modules (id, track_id, title_en, title_bn, order_index) VALUES
  ('d1000005-0005-4000-8000-000000000001', 'a1000003-0003-4000-8000-000000000001', 'C05: SQL Foundations', 'SQL ফাউন্ডেশন', 28),
  ('d1000005-0005-4000-8000-000000000002', 'a1000003-0003-4000-8000-000000000001', 'C05: Intermediate SQL', 'ইন্টারমিডিয়েট SQL', 29),
  ('d1000005-0005-4000-8000-000000000003', 'a1000003-0003-4000-8000-000000000001', 'C05: Advanced SQL Analytics', 'অ্যাডভান্সড SQL', 30),
  ('d1000005-0005-4000-8000-000000000004', 'a1000003-0003-4000-8000-000000000001', 'C05: Database Design', 'ডেটাবেস ডিজাইন', 31),
  ('d1000005-0005-4000-8000-000000000005', 'a1000003-0003-4000-8000-000000000001', 'C05: Python + SQL', 'পাইথন ও SQL', 32),
  ('d1000005-0005-4000-8000-000000000006', 'a1000003-0003-4000-8000-000000000001', 'C05: dbt Core', 'dbt', 33),
  ('d1000005-0005-4000-8000-000000000007', 'a1000003-0003-4000-8000-000000000001', 'C05: DuckDB & SQL Performance', 'DuckDB', 34)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, module_id, title_en, title_bn, youtube_video_id, notes_md, order_index, estimated_mins) VALUES
  ('e1000005-0005-4000-8000-000000000001', 'd1000005-0005-4000-8000-000000000001',
   'SELECT, WHERE, ORDER BY', 'SELECT ও WHERE',
   'HXV3zeQKqGY',
   E'## SQL Basics\n\n```sql\nSELECT name, salary\nFROM employees\nWHERE department = ''Engineering''\n  AND salary > 50000\nORDER BY salary DESC\nLIMIT 10;\n```',
   1, 45),
  ('e1000005-0005-4000-8000-000000000002', 'd1000005-0005-4000-8000-000000000002',
   'JOINs & Subqueries', 'JOIN ও সাবকোয়েরি',
   '9yeOJ0ZMUYw',
   E'## JOINs\n\n```sql\nSELECT o.order_id, c.name, o.total\nFROM orders o\nINNER JOIN customers c ON o.customer_id = c.id\nWHERE o.created_at >= ''2025-01-01'';\n```\n\nTypes: INNER, LEFT, RIGHT, FULL OUTER.',
   1, 45),
  ('e1000005-0005-4000-8000-000000000003', 'd1000005-0005-4000-8000-000000000003',
   'Window Functions & CTEs', 'উইন্ডো ফাংশন ও CTE',
   'Ww71knvtDLI',
   E'## Window Functions\n\n```sql\nWITH ranked AS (\n  SELECT *,\n    RANK() OVER (PARTITION BY dept ORDER BY salary DESC) as rank\n  FROM employees\n)\nSELECT * FROM ranked WHERE rank <= 3;\n```\n\nROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, SUM OVER.',
   1, 50),
  ('e1000005-0005-4000-8000-000000000004', 'd1000005-0005-4000-8000-000000000004',
   'Database Design & Normalization', 'ডেটাবেস ডিজাইন',
   'ztHopE5BExw',
   E'## Database Design\n\n- 1NF: No repeating groups\n- 2NF: No partial dependencies\n- 3NF: No transitive dependencies\n\nUse foreign keys to enforce referential integrity.',
   1, 40),
  ('e1000005-0005-4000-8000-000000000005', 'd1000005-0005-4000-8000-000000000005',
   'Pandas + SQLAlchemy', 'পাইথন ও SQLAlchemy',
   'woKYyhLCVnU',
   E'## Python + SQL\n\n```python\nimport pandas as pd\nfrom sqlalchemy import create_engine\n\nengine = create_engine("postgresql://user:pass@host/db")\ndf = pd.read_sql("SELECT * FROM sales WHERE year=2025", engine)\n```',
   1, 35),
  ('e1000005-0005-4000-8000-000000000006', 'd1000005-0005-4000-8000-000000000006',
   'dbt Core: Transform Your Data', 'dbt ট্রান্সফর্মেশন',
   'M8oi7nSaWps',
   E'## dbt Core\n\n```bash\ndbt init my_project\ndbt run\ndbt test\n```\n\n```sql\n-- models/staging/stg_orders.sql\nSELECT\n    order_id,\n    customer_id,\n    total::numeric AS total_amount\nFROM {{ source(''raw'', ''orders'') }}\nWHERE status != ''cancelled''\n```',
   1, 45),
  ('e1000005-0005-4000-8000-000000000007', 'd1000005-0005-4000-8000-000000000007',
   'DuckDB: Fast Local Analytics', 'DuckDB অ্যানালিটিক্স',
   'bZOvAKD6Now',
   E'## DuckDB\n\n```python\nimport duckdb\n\n# Query Parquet files directly — no database server needed\nresult = duckdb.sql("""\n  SELECT department, AVG(salary) as avg_salary\n  FROM read_parquet(''employees.parquet'')\n  GROUP BY department\n  ORDER BY avg_salary DESC\n""").df()\n```\n\nFaster than pandas for analytical queries on large files.',
   1, 35)
ON CONFLICT DO NOTHING;


-- ── COURSE 06 — Exploratory Data Analysis & Feature Engineering ──

INSERT INTO modules (id, track_id, title_en, title_bn, order_index) VALUES
  ('d1000006-0006-4000-8000-000000000001', 'a1000003-0003-4000-8000-000000000001', 'C06: EDA Workflow', 'EDA ওয়ার্কফ্লো', 35),
  ('d1000006-0006-4000-8000-000000000002', 'a1000003-0003-4000-8000-000000000001', 'C06: Missing Data & Outliers', 'মিসিং ডেটা ও আউটলায়ার', 36),
  ('d1000006-0006-4000-8000-000000000003', 'a1000003-0003-4000-8000-000000000001', 'C06: Feature Engineering', 'ফিচার ইঞ্জিনিয়ারিং', 37),
  ('d1000006-0006-4000-8000-000000000004', 'a1000003-0003-4000-8000-000000000001', 'C06: Automated EDA Tools', 'অটোমেটেড EDA', 38),
  ('d1000006-0006-4000-8000-000000000005', 'a1000003-0003-4000-8000-000000000001', 'C06: EDA Case Studies', 'EDA কেস স্টাডি', 39),
  ('d1000006-0006-4000-8000-000000000006', 'a1000003-0003-4000-8000-000000000001', 'C06: Feature Selection', 'ফিচার সিলেকশন', 40)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, module_id, title_en, title_bn, youtube_video_id, notes_md, order_index, estimated_mins) VALUES
  ('e1000006-0006-4000-8000-000000000001', 'd1000006-0006-4000-8000-000000000001',
   'EDA Framework & First Look', 'EDA ফ্রেমওয়ার্ক',
   'xi0vhXFPegw',
   E'## EDA Workflow\n\n1. Shape & types: `df.shape`, `df.dtypes`, `df.info()`\n2. Missing: `df.isnull().sum()`\n3. Distributions: `df.describe()`, histograms\n4. Correlations: `df.corr()`, heatmap\n5. Outliers: IQR method, boxplots\n6. Target vs features: grouped distributions',
   1, 45),
  ('e1000006-0006-4000-8000-000000000002', 'd1000006-0006-4000-8000-000000000002',
   'Outlier Detection & Treatment', 'আউটলায়ার',
   'HYRNMcbRJi0',
   E'## Outliers\n\n```python\n# IQR method\nQ1 = df["salary"].quantile(0.25)\nQ3 = df["salary"].quantile(0.75)\nIQR = Q3 - Q1\noutliers = df[(df["salary"] < Q1 - 1.5*IQR) | (df["salary"] > Q3 + 1.5*IQR)]\n```\n\nOptions: remove, cap (winsorize), transform (log), keep + flag.',
   1, 35),
  ('e1000006-0006-4000-8000-000000000003', 'd1000006-0006-4000-8000-000000000003',
   'Feature Engineering Techniques', 'ফিচার তৈরি',
   'ha8MidBEn48',
   E'## Feature Engineering\n\n```python\n# Date features\ndf["day_of_week"] = df["date"].dt.dayofweek\ndf["month"] = df["date"].dt.month\ndf["is_weekend"] = df["day_of_week"].isin([5, 6]).astype(int)\n\n# Binning\ndf["age_group"] = pd.cut(df["age"], bins=[0,25,40,60,100], labels=["young","mid","senior","elder"])\n\n# Encoding\ndf = pd.get_dummies(df, columns=["city"], drop_first=True)\n```',
   1, 45),
  ('e1000006-0006-4000-8000-000000000004', 'd1000006-0006-4000-8000-000000000004',
   'ydata-profiling & Sweetviz', 'অটোমেটেড EDA টুল',
   'vsna7V0RBSM',
   E'## Automated EDA\n\n```python\nimport ydata_profiling as yp\nprofile = yp.ProfileReport(df, title="My Dataset")\nprofile.to_file("report.html")\n\n# Sweetviz — comparison reports\nimport sweetviz as sv\nreport = sv.analyze(df)\nreport.show_html("sweetviz.html")\n```',
   1, 30),
  ('e1000006-0006-4000-8000-000000000005', 'd1000006-0006-4000-8000-000000000005',
   'EDA on Real Dataset (End-to-End)', 'EDA কেস স্টাডি',
   'SaTDOAlRKTc',
   E'## Full EDA Project\n\nDataset: Titanic or NYC Taxi or similar.\n1. Load & inspect\n2. Clean missing values\n3. Engineer new features\n4. Visualize key patterns\n5. Write 3 data-driven insights\n6. Export cleaned dataset',
   1, 60),
  ('e1000006-0006-4000-8000-000000000006', 'd1000006-0006-4000-8000-000000000006',
   'Filter, Wrapper & Embedded Feature Selection', 'ফিচার সিলেকশন মেথড',
   'ptdhoLGSMSg',
   E'## Feature Selection\n\n```python\nfrom sklearn.feature_selection import SelectKBest, f_classif\nfrom sklearn.ensemble import RandomForestClassifier\n\n# Filter: statistical test\nselector = SelectKBest(f_classif, k=10)\nX_selected = selector.fit_transform(X, y)\n\n# Embedded: feature importance from tree\nrf = RandomForestClassifier()\nrf.fit(X, y)\nimportances = pd.Series(rf.feature_importances_, index=X.columns)\n```',
   1, 45)
ON CONFLICT DO NOTHING;


-- ── COURSE 07 — Machine Learning Fundamentals ─────────────────

INSERT INTO modules (id, track_id, title_en, title_bn, order_index) VALUES
  ('d1000007-0007-4000-8000-000000000001', 'a1000003-0003-4000-8000-000000000001', 'C07: ML Intro & Scikit-Learn', 'ML পরিচয় ও Scikit-Learn', 41),
  ('d1000007-0007-4000-8000-000000000002', 'a1000003-0003-4000-8000-000000000001', 'C07: Regression', 'রিগ্রেশন', 42),
  ('d1000007-0007-4000-8000-000000000003', 'a1000003-0003-4000-8000-000000000001', 'C07: Classification', 'ক্লাসিফিকেশন', 43),
  ('d1000007-0007-4000-8000-000000000004', 'a1000003-0003-4000-8000-000000000001', 'C07: Model Evaluation', 'মডেল মূল্যায়ন', 44),
  ('d1000007-0007-4000-8000-000000000005', 'a1000003-0003-4000-8000-000000000001', 'C07: Unsupervised Learning', 'আনসুপারভাইজড লার্নিং', 45),
  ('d1000007-0007-4000-8000-000000000006', 'a1000003-0003-4000-8000-000000000001', 'C07: Dimensionality Reduction', 'ডাইমেনশনালিটি রিডাকশন', 46),
  ('d1000007-0007-4000-8000-000000000007', 'a1000003-0003-4000-8000-000000000001', 'C07: Imbalanced Data', 'ইমব্যালান্সড ডেটা', 47),
  ('d1000007-0007-4000-8000-000000000008', 'a1000003-0003-4000-8000-000000000001', 'C07: Anomaly Detection', 'অ্যানোমালি ডিটেকশন', 48)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, module_id, title_en, title_bn, youtube_video_id, notes_md, order_index, estimated_mins) VALUES
  ('e1000007-0007-4000-8000-000000000001', 'd1000007-0007-4000-8000-000000000001',
   'ML Pipeline with Scikit-Learn', 'ML পাইপলাইন',
   'pqNCD_5r0IU',
   E'## Scikit-Learn Pipeline\n\n```python\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\n\npipe = Pipeline([\n    ("scaler", StandardScaler()),\n    ("model", LogisticRegression())\n])\npipe.fit(X_train, y_train)\nprint(pipe.score(X_test, y_test))\n```',
   1, 50),
  ('e1000007-0007-4000-8000-000000000002', 'd1000007-0007-4000-8000-000000000002',
   'Linear & Polynomial Regression', 'লিনিয়ার রিগ্রেশন',
   'nk2CQITm_eo',
   E'## Regression\n\n```python\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.metrics import r2_score, mean_absolute_error\n\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\npreds = model.predict(X_test)\nprint(f"R²: {r2_score(y_test, preds):.3f}")\nprint(f"MAE: {mean_absolute_error(y_test, preds):.2f}")\n```',
   1, 45),
  ('e1000007-0007-4000-8000-000000000003', 'd1000007-0007-4000-8000-000000000003',
   'Decision Trees & Random Forests', 'ডিসিশন ট্রি ও র‍্যান্ডম ফরেস্ট',
   'PHxYNGo8NcI',
   E'## Random Forest\n\n```python\nfrom sklearn.ensemble import RandomForestClassifier\n\nmodel = RandomForestClassifier(n_estimators=100, random_state=42)\nmodel.fit(X_train, y_train)\nprint(model.score(X_test, y_test))\n\n# Feature importance\nimportance_df = pd.DataFrame({"feature": X.columns, "importance": model.feature_importances_})\n```',
   1, 50),
  ('e1000007-0007-4000-8000-000000000004', 'd1000007-0007-4000-8000-000000000004',
   'Cross-Validation & Metrics', 'ক্রস-ভ্যালিডেশন',
   'fSytzGwwBVw',
   E'## Model Evaluation\n\n```python\nfrom sklearn.model_selection import cross_val_score\nfrom sklearn.metrics import classification_report\n\nscores = cross_val_score(model, X, y, cv=5, scoring="f1_weighted")\nprint(f"CV F1: {scores.mean():.3f} ± {scores.std():.3f}")\n\nprint(classification_report(y_test, preds))\n```',
   1, 45),
  ('e1000007-0007-4000-8000-000000000005', 'd1000007-0007-4000-8000-000000000005',
   'K-Means & Hierarchical Clustering', 'ক্লাস্টারিং',
   '4b5d3muPQmA',
   E'## Clustering\n\n```python\nfrom sklearn.cluster import KMeans\nfrom sklearn.metrics import silhouette_score\n\nkmeans = KMeans(n_clusters=3, random_state=42)\nlabels = kmeans.fit_predict(X_scaled)\nprint(f"Silhouette Score: {silhouette_score(X_scaled, labels):.3f}")\n```',
   1, 45),
  ('e1000007-0007-4000-8000-000000000006', 'd1000007-0007-4000-8000-000000000006',
   'PCA & UMAP', 'PCA ও UMAP',
   'FgakZw6K1QQ',
   E'## Dimensionality Reduction\n\n```python\nfrom sklearn.decomposition import PCA\nimport umap\n\npca = PCA(n_components=2)\nX_2d = pca.fit_transform(X_scaled)\nprint(f"Explained variance: {pca.explained_variance_ratio_.sum():.2%}")\n\n# UMAP — better for visualization\nreducer = umap.UMAP(n_components=2)\nX_umap = reducer.fit_transform(X_scaled)\n```',
   1, 40),
  ('e1000007-0007-4000-8000-000000000007', 'd1000007-0007-4000-8000-000000000007',
   'SMOTE & Class Imbalance', 'ইমব্যালান্সড ডেটা',
   'MRI3KbXfP5U',
   E'## Imbalanced Data\n\n```python\nfrom imblearn.over_sampling import SMOTE\n\nsmote = SMOTE(random_state=42)\nX_resampled, y_resampled = smote.fit_resample(X_train, y_train)\n\n# Also: class_weight="balanced" in model params\nmodel = RandomForestClassifier(class_weight="balanced")\n```',
   1, 40),
  ('e1000007-0007-4000-8000-000000000008', 'd1000007-0007-4000-8000-000000000008',
   'Isolation Forest & LOF', 'অ্যানোমালি ডিটেকশন',
   'LVpIoezFU9Q',
   E'## Anomaly Detection\n\n```python\nfrom sklearn.ensemble import IsolationForest\nfrom sklearn.neighbors import LocalOutlierFactor\n\niso = IsolationForest(contamination=0.05, random_state=42)\npredictions = iso.fit_predict(X)  # -1 = anomaly\n\nlof = LocalOutlierFactor(n_neighbors=20, contamination=0.05)\npredictions_lof = lof.fit_predict(X)\n```',
   1, 40)
ON CONFLICT DO NOTHING;


-- ── COURSE 08 — Advanced Machine Learning & Ensemble Methods ──

INSERT INTO modules (id, track_id, title_en, title_bn, order_index) VALUES
  ('d1000008-0008-4000-8000-000000000001', 'a1000003-0003-4000-8000-000000000001', 'C08: XGBoost & LightGBM', 'XGBoost ও LightGBM', 49),
  ('d1000008-0008-4000-8000-000000000002', 'a1000003-0003-4000-8000-000000000001', 'C08: Hyperparameter Tuning', 'হাইপারপ্যারামিটার টিউনিং', 50),
  ('d1000008-0008-4000-8000-000000000003', 'a1000003-0003-4000-8000-000000000001', 'C08: SHAP & Interpretability', 'SHAP ও ব্যাখ্যাযোগ্যতা', 51),
  ('d1000008-0008-4000-8000-000000000004', 'a1000003-0003-4000-8000-000000000001', 'C08: NLP with spaCy & Hugging Face', 'NLP', 52),
  ('d1000008-0008-4000-8000-000000000005', 'a1000003-0003-4000-8000-000000000001', 'C08: Time Series Forecasting', 'টাইম সিরিজ ফোরকাস্টিং', 53),
  ('d1000008-0008-4000-8000-000000000006', 'a1000003-0003-4000-8000-000000000001', 'C08: Stacking, Blending & Optuna', 'স্ট্যাকিং ও Optuna', 54)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, module_id, title_en, title_bn, youtube_video_id, notes_md, order_index, estimated_mins) VALUES
  ('e1000008-0008-4000-8000-000000000001', 'd1000008-0008-4000-8000-000000000001',
   'XGBoost, LightGBM & CatBoost', 'গ্রেডিয়েন্ট বুস্টিং',
   'OtD8wVaFm6E',
   E'## Gradient Boosting Trio\n\n```python\nimport xgboost as xgb\nimport lightgbm as lgb\n\n# XGBoost\nxgb_model = xgb.XGBClassifier(n_estimators=200, learning_rate=0.1)\nxgb_model.fit(X_train, y_train)\n\n# LightGBM — faster on large datasets\nlgb_model = lgb.LGBMClassifier(n_estimators=200)\nlgb_model.fit(X_train, y_train)\n```',
   1, 50),
  ('e1000008-0008-4000-8000-000000000002', 'd1000008-0008-4000-8000-000000000002',
   'Optuna Hyperparameter Tuning', 'Optuna',
   '5nYqK-HaoKY',
   E'## Optuna\n\n```python\nimport optuna\n\ndef objective(trial):\n    n_estimators = trial.suggest_int("n_estimators", 50, 300)\n    max_depth = trial.suggest_int("max_depth", 3, 10)\n    lr = trial.suggest_float("learning_rate", 0.01, 0.3, log=True)\n    \n    model = xgb.XGBClassifier(n_estimators=n_estimators, max_depth=max_depth, learning_rate=lr)\n    return cross_val_score(model, X, y, cv=3, scoring="roc_auc").mean()\n\nstudy = optuna.create_study(direction="maximize")\nstudy.optimize(objective, n_trials=50)\n```',
   1, 45),
  ('e1000008-0008-4000-8000-000000000003', 'd1000008-0008-4000-8000-000000000003',
   'SHAP Values for Model Explanation', 'SHAP ভ্যালু',
   'VaIuGkM3M0Y',
   E'## SHAP\n\n```python\nimport shap\n\nexplainer = shap.TreeExplainer(model)\nshap_values = explainer.shap_values(X_test)\n\n# Summary plot\nshap.summary_plot(shap_values, X_test)\n\n# Force plot for single prediction\nshap.force_plot(explainer.expected_value, shap_values[0], X_test.iloc[0])\n```',
   1, 45),
  ('e1000008-0008-4000-8000-000000000004', 'd1000008-0008-4000-8000-000000000004',
   'NLP: spaCy & Hugging Face Basics', 'NLP বেসিক',
   'dIUTsFT2MeQ',
   E'## NLP\n\n```python\nimport spacy\nnlp = spacy.load("en_core_web_sm")\n\ndoc = nlp("Apple is buying a startup in Bangladesh.")\nfor ent in doc.ents:\n    print(ent.text, ent.label_)\n\n# Hugging Face sentiment\nfrom transformers import pipeline\nsentiment = pipeline("sentiment-analysis")\nprint(sentiment("I love this course!"))\n```',
   1, 50),
  ('e1000008-0008-4000-8000-000000000005', 'd1000008-0008-4000-8000-000000000005',
   'ARIMA & Prophet Forecasting', 'টাইম সিরিজ',
   'e8Yw4alG16Q',
   E'## Time Series Forecasting\n\n```python\nfrom prophet import Prophet\n\n# Prophet expects df with columns ''ds'' and ''y''\ndf_prophet = df.rename(columns={"date": "ds", "sales": "y"})\n\nmodel = Prophet(yearly_seasonality=True)\nmodel.fit(df_prophet)\nfuture = model.make_future_dataframe(periods=90)\nforecast = model.predict(future)\nmodel.plot(forecast)\n```',
   1, 50),
  ('e1000008-0008-4000-8000-000000000006', 'd1000008-0008-4000-8000-000000000006',
   'Stacking & Blending Ensembles', 'স্ট্যাকিং এনসেম্বল',
   'TuIgtitqJho',
   E'## Model Stacking\n\n```python\nfrom sklearn.ensemble import StackingClassifier\nfrom sklearn.linear_model import LogisticRegression\n\nestimators = [\n    ("rf", RandomForestClassifier(n_estimators=100)),\n    ("xgb", xgb.XGBClassifier(n_estimators=100)),\n    ("lgb", lgb.LGBMClassifier(n_estimators=100))\n]\n\nstacking = StackingClassifier(estimators=estimators, final_estimator=LogisticRegression(), cv=5)\nstacking.fit(X_train, y_train)\n```',
   1, 45)
ON CONFLICT DO NOTHING;


-- ── COURSE 09 — Deep Learning Foundations ────────────────────

INSERT INTO modules (id, track_id, title_en, title_bn, order_index) VALUES
  ('d1000009-0009-4000-8000-000000000001', 'a1000003-0003-4000-8000-000000000001', 'C09: Neural Networks Foundations', 'নিউরাল নেটওয়ার্ক', 55),
  ('d1000009-0009-4000-8000-000000000002', 'a1000003-0003-4000-8000-000000000001', 'C09: PyTorch Fundamentals', 'PyTorch', 56),
  ('d1000009-0009-4000-8000-000000000003', 'a1000003-0003-4000-8000-000000000001', 'C09: fast.ai Practical DL', 'fast.ai', 57),
  ('d1000009-0009-4000-8000-000000000004', 'a1000003-0003-4000-8000-000000000001', 'C09: CNNs for Image Classification', 'CNN', 58),
  ('d1000009-0009-4000-8000-000000000005', 'a1000003-0003-4000-8000-000000000001', 'C09: Transformers & Hugging Face', 'ট্রান্সফর্মার', 59),
  ('d1000009-0009-4000-8000-000000000006', 'a1000003-0003-4000-8000-000000000001', 'C09: RNNs & LSTMs', 'RNN ও LSTM', 60)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, module_id, title_en, title_bn, youtube_video_id, notes_md, order_index, estimated_mins) VALUES
  ('e1000009-0009-4000-8000-000000000001', 'd1000009-0009-4000-8000-000000000001',
   'Neural Networks from Scratch', 'নিউরাল নেটওয়ার্ক বেসিক',
   'aircAruvnKk',
   E'## Neural Network Basics\n\nA neuron: weighted sum → activation\n```\nz = w₁x₁ + w₂x₂ + b\na = ReLU(z) = max(0, z)\n```\n\nLayers: Input → Hidden(s) → Output\nBackpropagation adjusts weights via gradient descent.',
   1, 60),
  ('e1000009-0009-4000-8000-000000000002', 'd1000009-0009-4000-8000-000000000002',
   'PyTorch: Tensors & Autograd', 'PyTorch টেনসর',
   'c36lUUr864M',
   E'## PyTorch\n\n```python\nimport torch\nimport torch.nn as nn\n\nclass MLP(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.layers = nn.Sequential(\n            nn.Linear(784, 128), nn.ReLU(),\n            nn.Linear(128, 10)\n        )\n    def forward(self, x):\n        return self.layers(x)\n\nmodel = MLP()\noptimizer = torch.optim.Adam(model.parameters(), lr=0.001)\n```',
   1, 60),
  ('e1000009-0009-4000-8000-000000000003', 'd1000009-0009-4000-8000-000000000003',
   'fast.ai Practical Deep Learning', 'fast.ai প্র্যাক্টিক্যাল',
   '0oycMkiqur4',
   E'## fast.ai\n\n```python\nfrom fastai.vision.all import *\n\n# Load data in 3 lines\ndls = ImageDataLoaders.from_folder(path, valid="valid")\nlearn = vision_learner(dls, resnet34, metrics=accuracy)\nlearn.fine_tune(4)\n```\n\nHigh-level API — 5 lines to train a competitive image classifier.',
   1, 60),
  ('e1000009-0009-4000-8000-000000000004', 'd1000009-0009-4000-8000-000000000004',
   'CNNs for Image Classification', 'CNN ক্লাসিফিকেশন',
   'pDdP0TFzsoQ',
   E'## CNNs\n\n```python\nmodel = nn.Sequential(\n    nn.Conv2d(3, 32, kernel_size=3, padding=1),\n    nn.ReLU(),\n    nn.MaxPool2d(2),\n    nn.Flatten(),\n    nn.Linear(32*16*16, 10)\n)\n```\n\nConv layers detect local patterns → Pooling reduces size → FC layers classify.',
   1, 55),
  ('e1000009-0009-4000-8000-000000000005', 'd1000009-0009-4000-8000-000000000005',
   'Transformers & BERT via Hugging Face', 'Hugging Face ট্রান্সফর্মার',
   'TQQlZhbC5ps',
   E'## Transformers\n\n```python\nfrom transformers import AutoTokenizer, AutoModelForSequenceClassification\nimport torch\n\ntokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")\nmodel = AutoModelForSequenceClassification.from_pretrained("bert-base-uncased")\n\ninputs = tokenizer("I love data science!", return_tensors="pt")\nwith torch.no_grad():\n    outputs = model(**inputs)\n```',
   1, 55),
  ('e1000009-0009-4000-8000-000000000006', 'd1000009-0009-4000-8000-000000000006',
   'RNNs & LSTMs for Sequences', 'RNN ও LSTM',
   'AsNTP8Kwu80',
   E'## LSTMs\n\n```python\nclass LSTMModel(nn.Module):\n    def __init__(self, input_size, hidden_size, output_size):\n        super().__init__()\n        self.lstm = nn.LSTM(input_size, hidden_size, batch_first=True)\n        self.fc = nn.Linear(hidden_size, output_size)\n    \n    def forward(self, x):\n        out, _ = self.lstm(x)\n        return self.fc(out[:, -1, :])\n```\n\nUsed for text, time series, speech.',
   1, 50)
ON CONFLICT DO NOTHING;


-- ── COURSE 10 — AI Tools, MLOps & Deployment ─────────────────

INSERT INTO modules (id, track_id, title_en, title_bn, order_index) VALUES
  ('d1000010-0010-4000-8000-000000000001', 'a1000003-0003-4000-8000-000000000001', 'C10: Git & Version Control', 'গিট ও ভার্সন কন্ট্রোল', 61),
  ('d1000010-0010-4000-8000-000000000002', 'a1000003-0003-4000-8000-000000000001', 'C10: Streamlit & Gradio', 'Streamlit ও Gradio', 62),
  ('d1000010-0010-4000-8000-000000000003', 'a1000003-0003-4000-8000-000000000001', 'C10: FastAPI ML Serving', 'FastAPI', 63),
  ('d1000010-0010-4000-8000-000000000004', 'a1000003-0003-4000-8000-000000000001', 'C10: Docker Containerization', 'ডকার', 64),
  ('d1000010-0010-4000-8000-000000000005', 'a1000003-0003-4000-8000-000000000001', 'C10: MLflow & WandB Tracking', 'MLflow ও WandB', 65),
  ('d1000010-0010-4000-8000-000000000006', 'a1000003-0003-4000-8000-000000000001', 'C10: LLM API Integration', 'LLM API', 66),
  ('d1000010-0010-4000-8000-000000000007', 'a1000003-0003-4000-8000-000000000001', 'C10: DVC Data Version Control', 'DVC', 67),
  ('d1000010-0010-4000-8000-000000000008', 'a1000003-0003-4000-8000-000000000001', 'C10: GitHub Actions CI/CD', 'GitHub Actions', 68)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, module_id, title_en, title_bn, youtube_video_id, notes_md, order_index, estimated_mins) VALUES
  ('e1000010-0010-4000-8000-000000000001', 'd1000010-0010-4000-8000-000000000001',
   'Git Workflows for Data Science', 'গিট ওয়ার্কফ্লো',
   'USjZcfj8yxE',
   E'## Git Essentials\n\n```bash\ngit init && git add . && git commit -m "init"\ngit checkout -b feature/new-model\ngit push origin feature/new-model\ngit pull --rebase origin main\n```\n\nUse `.gitignore` to exclude data files > 100MB.',
   1, 40),
  ('e1000010-0010-4000-8000-000000000002', 'd1000010-0010-4000-8000-000000000002',
   'Streamlit & Gradio Data Apps', 'Streamlit ও Gradio',
   'VqgUkExPvLY',
   E'## Streamlit\n\n```python\nimport streamlit as st\n\nst.title("Sales Forecast Dashboard")\nuploaded = st.file_uploader("Upload CSV", type="csv")\nif uploaded:\n    df = pd.read_csv(uploaded)\n    st.line_chart(df["revenue"])\n```\n\n```python\n# Gradio\nimport gradio as gr\ninterface = gr.Interface(fn=predict, inputs="text", outputs="label")\ninterface.launch()\n```',
   1, 45),
  ('e1000010-0010-4000-8000-000000000003', 'd1000010-0010-4000-8000-000000000003',
   'FastAPI ML Model Serving', 'FastAPI ML সার্ভিং',
   '7t2alSnE2-I',
   E'## FastAPI\n\n```python\nfrom fastapi import FastAPI\napp = FastAPI()\n\n@app.post("/predict")\nasync def predict(payload: dict):\n    features = payload["features"]\n    prediction = model.predict([features])[0]\n    return {"prediction": int(prediction), "probability": float(prob)}\n```\n\n`uvicorn app:app --host 0.0.0.0 --port 8000`',
   1, 45),
  ('e1000010-0010-4000-8000-000000000004', 'd1000010-0010-4000-8000-000000000004',
   'Docker for ML Projects', 'ডকার',
   'bi0cKgmRuiA',
   E'## Docker\n\n```dockerfile\nFROM python:3.11-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCOPY . .\nCMD ["uvicorn", "app:app", "--host", "0.0.0.0"]\n```\n\n```bash\ndocker build -t my-ml-app .\ndocker run -p 8000:8000 my-ml-app\n```',
   1, 45),
  ('e1000010-0010-4000-8000-000000000005', 'd1000010-0010-4000-8000-000000000005',
   'MLflow & WandB Experiment Tracking', 'MLflow ও WandB',
   '859OxXrt_TI',
   E'## MLflow\n\n```python\nimport mlflow\n\nwith mlflow.start_run():\n    mlflow.log_param("n_estimators", 100)\n    mlflow.log_metric("accuracy", 0.92)\n    mlflow.sklearn.log_model(model, "model")\n```\n\n```python\n# WandB\nimport wandb\nwandb.init(project="my-project")\nwandb.log({"accuracy": 0.92, "loss": 0.12})\n```',
   1, 45),
  ('e1000010-0010-4000-8000-000000000006', 'd1000010-0010-4000-8000-000000000006',
   'LLM API Integration (OpenAI/Claude)', 'LLM API ইন্টিগ্রেশন',
   'l6C8MjDRuOA',
   E'## LLM APIs\n\n```python\nfrom anthropic import Anthropic\n\nclient = Anthropic()\nmessage = client.messages.create(\n    model="claude-opus-4-5",\n    max_tokens=1024,\n    messages=[{"role": "user", "content": "Explain gradient descent simply."}]\n)\nprint(message.content[0].text)\n```',
   1, 40),
  ('e1000010-0010-4000-8000-000000000007', 'd1000010-0010-4000-8000-000000000007',
   'DVC: Data & Model Versioning', 'DVC ডেটা ভার্সনিং',
   'kLKBuFM56gA',
   E'## DVC\n\n```bash\ndvc init\ndvc add data/train.csv         # track large file\ngit add data/train.csv.dvc\ndvc push                        # push to remote storage\n\ndvc run -n train \\\n  -d data/train.csv -d train.py \\\n  -o model.pkl \\\n  python train.py\n```',
   1, 40),
  ('e1000010-0010-4000-8000-000000000008', 'd1000010-0010-4000-8000-000000000008',
   'GitHub Actions CI/CD for ML', 'GitHub Actions',
   'R8_veQiYBjI',
   E'## GitHub Actions\n\n```yaml\n# .github/workflows/test.yml\nname: Test ML Model\non: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with: {python-version: "3.11"}\n      - run: pip install -r requirements.txt\n      - run: pytest tests/ -v\n      - run: python evaluate.py  # log metrics\n```',
   1, 40)
ON CONFLICT DO NOTHING;


-- ── COURSE 11 — Capstone & Portfolio Development ──────────────

INSERT INTO modules (id, track_id, title_en, title_bn, order_index) VALUES
  ('d1000011-0011-4000-8000-000000000001', 'a1000003-0003-4000-8000-000000000001', 'C11: Portfolio Architecture', 'পোর্টফোলিও আর্কিটেকচার', 69),
  ('d1000011-0011-4000-8000-000000000002', 'a1000003-0003-4000-8000-000000000001', 'C11: Capstone Projects Guide', 'ক্যাপস্টোন প্রজেক্ট', 70),
  ('d1000011-0011-4000-8000-000000000003', 'a1000003-0003-4000-8000-000000000001', 'C11: Freelancing Setup', 'ফ্রিল্যান্সিং', 71),
  ('d1000011-0011-4000-8000-000000000004', 'a1000003-0003-4000-8000-000000000001', 'C11: Resume & Job Search', 'রেজুমে ও জব সার্চ', 72),
  ('d1000011-0011-4000-8000-000000000005', 'a1000003-0003-4000-8000-000000000001', 'C11: DS Interviews', 'ইন্টারভিউ প্রস্তুতি', 73),
  ('d1000011-0011-4000-8000-000000000006', 'a1000003-0003-4000-8000-000000000001', 'C11: Technical Writing & Community', 'টেকনিক্যাল রাইটিং', 74)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, module_id, title_en, title_bn, youtube_video_id, notes_md, order_index, estimated_mins) VALUES
  ('e1000011-0011-4000-8000-000000000001', 'd1000011-0011-4000-8000-000000000001',
   'Building a Data Science Portfolio', 'পোর্টফোলিও বিল্ডিং',
   'oU6ektMRzx0',
   E'## Portfolio Architecture\n\n**3-tier portfolio:**\n1. GitHub — code + READMEs\n2. Deployed app — Streamlit/Gradio on HuggingFace Spaces (free)\n3. Write-up — Medium / personal blog\n\nEach project README must have: Problem, Data, Methods, Results, How to Run.',
   1, 45),
  ('e1000011-0011-4000-8000-000000000002', 'd1000011-0011-4000-8000-000000000002',
   'Capstone Project: End-to-End ML System', 'ক্যাপস্টোন',
   'xl0N7tHiwlw',
   E'## Capstone Projects (pick 2-3)\n\n1. **EDA Report** — public health/climate dataset\n2. **ML Dashboard** — Streamlit with deployed model\n3. **SQL Analytics** — dbt + DuckDB pipeline\n4. **Time Series** — sales/weather forecasting\n5. **NLP App** — sentiment/classification via Hugging Face\n\n**Avoid Titanic/MNIST** — these are portfolio red flags in 2026.',
   1, 60),
  ('e1000011-0011-4000-8000-000000000003', 'd1000011-0011-4000-8000-000000000003',
   'Freelancing on Upwork & Fiverr', 'ফ্রিল্যান্সিং সেটআপ',
   'ImRCsAFE8Ko',
   E'## Freelancing Setup\n\n**Services to offer:**\n- Data cleaning: $25–75/hr\n- SQL reporting: $30–80/hr  \n- Dashboard (Tableau/Looker): $150–500\n- ML model: $300–1500\n- Data app (Streamlit): $200–800\n\n**Profile tips:** Show 3 strong portfolio pieces. Write results, not process.',
   1, 40),
  ('e1000011-0011-4000-8000-000000000004', 'd1000011-0011-4000-8000-000000000004',
   'DS Resume & LinkedIn Optimization', 'রেজুমে অপটিমাইজেশন',
   'w_NHFhIizGo',
   E'## Resume Tips\n\n- Quantify everything: "Built ML model achieving 92% accuracy on 50K records"\n- Skills section: Python, SQL, Pandas, Scikit-learn, TensorFlow, Tableau\n- Projects: link to GitHub + deployed demo\n- LinkedIn: headline = "Data Scientist | Python | ML | SQL"',
   1, 40),
  ('e1000011-0011-4000-8000-000000000005', 'd1000011-0011-4000-8000-000000000005',
   'DS Interview Prep: Stats, SQL & ML', 'ইন্টারভিউ প্রস্তুতি',
   'BfTpV0g8m1E',
   E'## Interview Topics\n\n**Statistics:** p-value, CLT, bias-variance, overfitting\n**SQL:** window functions, CTEs, GROUP BY aggregations\n**ML:** how does XGBoost work? When do you use regularization?\n**Coding:** LeetCode Easy + Medium (30 days)\n**Case study:** A/B test design, metric selection',
   1, 50),
  ('e1000011-0011-4000-8000-000000000006', 'd1000011-0011-4000-8000-000000000006',
   'Technical Writing & Community Building', 'টেকনিক্যাল রাইটিং',
   'T5_Lpgf_FdI',
   E'## Technical Writing\n\n**Blog structure:**\n1. Hook (why this matters)\n2. Problem statement\n3. Approach (code snippets)\n4. Results with visuals\n5. Key takeaways\n\n**Platforms:** Medium (free), Hashnode (free), Towards Data Science\n\n1 blog post = 5× more visible on LinkedIn.',
   1, 35)
ON CONFLICT DO NOTHING;

END $$;

-- ── Confirmation query ────────────────────────────────────────
SELECT
  COUNT(DISTINCT m.id) AS total_modules,
  COUNT(DISTINCT l.id) AS total_lessons
FROM modules m
JOIN lessons l ON l.module_id = m.id
WHERE m.track_id = 'a1000003-0003-4000-8000-000000000001';
