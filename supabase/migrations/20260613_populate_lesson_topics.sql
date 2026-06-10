-- ============================================================
-- Fixeth — Populate lesson_topics table from lesson_topics.md
-- ============================================================

-- Video ID: y2kg3MOk1sY
INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Introduction'::text,
    NULL::text,
    0::numeric,
    55::numeric,
    0::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'y2kg3MOk1sY'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'What Is a Computer?'::text,
    NULL::text,
    55::numeric,
    217::numeric,
    1::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'y2kg3MOk1sY'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Buttons and Ports on a Computer'::text,
    NULL::text,
    217::numeric,
    361::numeric,
    2::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'y2kg3MOk1sY'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Basic Parts of a Computer'::text,
    NULL::text,
    361::numeric,
    527::numeric,
    3::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'y2kg3MOk1sY'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Inside a Computer'::text,
    NULL::text,
    527::numeric,
    658::numeric,
    4::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'y2kg3MOk1sY'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Getting to Know Laptop Computers'::text,
    NULL::text,
    658::numeric,
    775::numeric,
    5::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'y2kg3MOk1sY'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Understanding Operating Systems'::text,
    NULL::text,
    775::numeric,
    861::numeric,
    6::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'y2kg3MOk1sY'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Understanding Applications'::text,
    NULL::text,
    861::numeric,
    953::numeric,
    7::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'y2kg3MOk1sY'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Setting Up a Desktop Computer'::text,
    NULL::text,
    953::numeric,
    1127::numeric,
    8::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'y2kg3MOk1sY'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Connecting to the Internet'::text,
    NULL::text,
    1127::numeric,
    1361::numeric,
    9::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'y2kg3MOk1sY'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'What Is the Cloud?'::text,
    NULL::text,
    1361::numeric,
    1506::numeric,
    10::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'y2kg3MOk1sY'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Cleaning Your Computer'::text,
    NULL::text,
    1506::numeric,
    1742::numeric,
    11::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'y2kg3MOk1sY'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Protecting Your Computer'::text,
    NULL::text,
    1742::numeric,
    1937::numeric,
    12::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'y2kg3MOk1sY'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Creating a Safe Workspace'::text,
    NULL::text,
    1937::numeric,
    2185::numeric,
    13::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'y2kg3MOk1sY'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Internet Safety: Your Browser''s Security Features'::text,
    NULL::text,
    2185::numeric,
    2316::numeric,
    14::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'y2kg3MOk1sY'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Understanding Spam and Phishing'::text,
    NULL::text,
    2316::numeric,
    2607::numeric,
    15::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'y2kg3MOk1sY'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Understanding Digital Tracking'::text,
    NULL::text,
    2607::numeric,
    2739::numeric,
    16::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'y2kg3MOk1sY'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Windows Basics: Getting Started with the Desktop'::text,
    NULL::text,
    2739::numeric,
    2860::numeric,
    17::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'y2kg3MOk1sY'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Mac OS X Basics: Getting Started with the Desktop'::text,
    NULL::text,
    2860::numeric,
    3146::numeric,
    18::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'y2kg3MOk1sY'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Browser Basics'::text,
    NULL::text,
    3146::numeric,
    86400::numeric,
    19::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'y2kg3MOk1sY'
LIMIT 1;

-- Video ID: vKauB_ui598
INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Intro'::text,
    NULL::text,
    0::numeric,
    11::numeric,
    0::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'vKauB_ui598'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Keyboard'::text,
    NULL::text,
    11::numeric,
    430::numeric,
    1::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'vKauB_ui598'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Mouse'::text,
    NULL::text,
    430::numeric,
    560::numeric,
    2::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'vKauB_ui598'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Outro'::text,
    NULL::text,
    560::numeric,
    86400::numeric,
    3::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'vKauB_ui598'
LIMIT 1;

-- Video ID: VXtjG_GzO7Q
INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Intro to Pandas 🐼'::text,
    NULL::text,
    0::numeric,
    138::numeric,
    0::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VXtjG_GzO7Q'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Series 1️⃣'::text,
    NULL::text,
    138::numeric,
    789::numeric,
    1::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VXtjG_GzO7Q'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'DataFrames 🔢'::text,
    NULL::text,
    789::numeric,
    1334::numeric,
    2::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VXtjG_GzO7Q'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Importing 📥'::text,
    NULL::text,
    1334::numeric,
    1635::numeric,
    3::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VXtjG_GzO7Q'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Selection 🎯'::text,
    NULL::text,
    1635::numeric,
    2192::numeric,
    4::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VXtjG_GzO7Q'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Filtering 🔍'::text,
    NULL::text,
    2192::numeric,
    2586::numeric,
    5::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VXtjG_GzO7Q'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Aggregation ➕'::text,
    NULL::text,
    2586::numeric,
    3057::numeric,
    6::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VXtjG_GzO7Q'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Data cleaning 🧹'::text,
    NULL::text,
    3057::numeric,
    86400::numeric,
    7::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VXtjG_GzO7Q'
LIMIT 1;

-- Video ID: VV8iRJ-DS0A
INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Introduction'::text,
    NULL::text,
    0::numeric,
    77::numeric,
    0::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Column Chart'::text,
    NULL::text,
    77::numeric,
    234::numeric,
    1::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Bar Chart'::text,
    NULL::text,
    234::numeric,
    358::numeric,
    2::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Line Chart'::text,
    NULL::text,
    358::numeric,
    466::numeric,
    3::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Pie/Doughnut Chart'::text,
    NULL::text,
    466::numeric,
    545::numeric,
    4::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'XY Scatter Plot Chart'::text,
    NULL::text,
    545::numeric,
    642::numeric,
    5::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Area Chart'::text,
    NULL::text,
    642::numeric,
    740::numeric,
    6::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Radar Chart'::text,
    NULL::text,
    740::numeric,
    808::numeric,
    7::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Stock Chart'::text,
    NULL::text,
    808::numeric,
    966::numeric,
    8::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Histogram Chart'::text,
    NULL::text,
    966::numeric,
    1106::numeric,
    9::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Pareto Chart'::text,
    NULL::text,
    1106::numeric,
    1180::numeric,
    10::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Waterfall Chart'::text,
    NULL::text,
    1180::numeric,
    1253::numeric,
    11::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Box & Whisker Chart'::text,
    NULL::text,
    1253::numeric,
    1370::numeric,
    12::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Treemap Chart'::text,
    NULL::text,
    1370::numeric,
    1482::numeric,
    13::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Map Chart'::text,
    NULL::text,
    1482::numeric,
    1560::numeric,
    14::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Recommended Chart'::text,
    NULL::text,
    1560::numeric,
    1609::numeric,
    15::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Chart Customization'::text,
    NULL::text,
    1609::numeric,
    1647::numeric,
    16::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Organize Data'::text,
    NULL::text,
    1647::numeric,
    1691::numeric,
    17::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Choose the Best Chart Type'::text,
    NULL::text,
    1691::numeric,
    1710::numeric,
    18::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Applying Chart Styles'::text,
    NULL::text,
    1710::numeric,
    1723::numeric,
    19::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Adjust Chart Elements and Labels'::text,
    NULL::text,
    1723::numeric,
    1748::numeric,
    20::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Enhancing Data Label and Gridlines'::text,
    NULL::text,
    1748::numeric,
    1773::numeric,
    21::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Applying Color Themes and Palettes'::text,
    NULL::text,
    1773::numeric,
    1814::numeric,
    22::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Utilizing Combination Chart and Secondary Axis'::text,
    NULL::text,
    1814::numeric,
    1851::numeric,
    23::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Incorporate Trendlines'::text,
    NULL::text,
    1851::numeric,
    1890::numeric,
    24::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Applying Chart Elements'::text,
    NULL::text,
    1890::numeric,
    1903::numeric,
    25::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Best Practices for Chart Customization'::text,
    NULL::text,
    1903::numeric,
    1949::numeric,
    26::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Excel Dashboard'::text,
    NULL::text,
    1949::numeric,
    1993::numeric,
    27::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Interactive Dashboard'::text,
    NULL::text,
    1993::numeric,
    2014::numeric,
    28::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Plan Your Excel Dashboard'::text,
    NULL::text,
    2014::numeric,
    2063::numeric,
    29::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Clean Data'::text,
    NULL::text,
    2063::numeric,
    2593::numeric,
    30::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Building Relationships'::text,
    NULL::text,
    2593::numeric,
    2771::numeric,
    31::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Writing DAX'::text,
    NULL::text,
    2771::numeric,
    2923::numeric,
    32::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Building Pivot Table'::text,
    NULL::text,
    2923::numeric,
    3119::numeric,
    33::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Building Charts'::text,
    NULL::text,
    3119::numeric,
    3436::numeric,
    34::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Building KPIs'::text,
    NULL::text,
    3436::numeric,
    3666::numeric,
    35::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Incorporate Interactivity'::text,
    NULL::text,
    3666::numeric,
    3904::numeric,
    36::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Building Dashboard'::text,
    NULL::text,
    3904::numeric,
    4195::numeric,
    37::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Free Excel Course'::text,
    NULL::text,
    4195::numeric,
    86400::numeric,
    38::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'VV8iRJ-DS0A'
LIMIT 1;

-- Video ID: rY2HOcodQFk
INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Introduction'::text,
    NULL::text,
    0::numeric,
    74::numeric,
    0::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'rY2HOcodQFk'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Write Function To Multiply By 1000'::text,
    NULL::text,
    74::numeric,
    110::numeric,
    1::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'rY2HOcodQFk'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Apply Function To DataFrame'::text,
    NULL::text,
    110::numeric,
    146::numeric,
    2::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'rY2HOcodQFk'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Add Commas To Numbers'::text,
    NULL::text,
    146::numeric,
    169::numeric,
    3::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'rY2HOcodQFk'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Add Last Names To Employees'::text,
    NULL::text,
    169::numeric,
    231::numeric,
    4::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'rY2HOcodQFk'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Use Lambdas'::text,
    NULL::text,
    231::numeric,
    307::numeric,
    5::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'rY2HOcodQFk'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Conclusion'::text,
    NULL::text,
    307::numeric,
    86400::numeric,
    6::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'rY2HOcodQFk'
LIMIT 1;

-- Video ID: qg4PchTECck
INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Intro'::text,
    NULL::text,
    0::numeric,
    18::numeric,
    0::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'qg4PchTECck'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Problem Formulation'::text,
    NULL::text,
    18::numeric,
    70::numeric,
    1::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'qg4PchTECck'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Gradient Descent'::text,
    NULL::text,
    70::numeric,
    132::numeric,
    2::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'qg4PchTECck'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Flavors of Gradient Descent'::text,
    NULL::text,
    132::numeric,
    86400::numeric,
    3::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'qg4PchTECck'
LIMIT 1;

-- Video ID: pZjpNS9YeVA
INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Introduction & The Retail Analogy'::text,
    NULL::text,
    1::numeric,
    23::numeric,
    0::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'pZjpNS9YeVA'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Context Optimization vs. Model Optimization'::text,
    NULL::text,
    23::numeric,
    41::numeric,
    1::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'pZjpNS9YeVA'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'The First Employee: Introduction to Prompt Engineering'::text,
    NULL::text,
    41::numeric,
    85::numeric,
    2::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'pZjpNS9YeVA'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Advanced Prompting: Chain-of-Thought'::text,
    NULL::text,
    85::numeric,
    93::numeric,
    3::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'pZjpNS9YeVA'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'The Product Manual: Introduction to Retrieval-Augmented Generation (RAG)'::text,
    NULL::text,
    93::numeric,
    155::numeric,
    4::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'pZjpNS9YeVA'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Scaling the Store: The Need for Specialized Training (Fine-Tuning)'::text,
    NULL::text,
    155::numeric,
    207::numeric,
    5::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'pZjpNS9YeVA'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Defining the Taxonomy: Context Windows vs. Model Parameters'::text,
    NULL::text,
    207::numeric,
    242::numeric,
    6::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'pZjpNS9YeVA'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Production Challenges: Output Control and Real-Time Data'::text,
    NULL::text,
    242::numeric,
    268::numeric,
    7::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'pZjpNS9YeVA'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Key Summary Point 1: Additive Techniques & Cost Savings'::text,
    NULL::text,
    268::numeric,
    310::numeric,
    8::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'pZjpNS9YeVA'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Key Summary Point 2: Always Start with Prompt Engineering'::text,
    NULL::text,
    310::numeric,
    335::numeric,
    9::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'pZjpNS9YeVA'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Key Summary Point 3: Accuracy vs. Early Optimization'::text,
    NULL::text,
    335::numeric,
    360::numeric,
    10::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'pZjpNS9YeVA'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Key Summary Point 4: Data Quality (DQ) over Data Quantity'::text,
    NULL::text,
    360::numeric,
    390::numeric,
    11::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'pZjpNS9YeVA'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Key Summary Point 5: Quantifying and Baselining Success'::text,
    NULL::text,
    390::numeric,
    433::numeric,
    12::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'pZjpNS9YeVA'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    '"Comparative Breakdown: Overlaps Between PE, RAG, and Fine-Tuning"'::text,
    NULL::text,
    433::numeric,
    493::numeric,
    13::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'pZjpNS9YeVA'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Memory Metaphor: Short-Term (RAG) vs. Long-Term (Fine-Tuning)'::text,
    NULL::text,
    493::numeric,
    503::numeric,
    14::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'pZjpNS9YeVA'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Strategic Roadmap: When to Move from Context to Fine-Tuning'::text,
    NULL::text,
    503::numeric,
    537::numeric,
    15::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'pZjpNS9YeVA'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Final Review: Token Window Trade-offs vs. Specialized Domain Experts'::text,
    NULL::text,
    537::numeric,
    86400::numeric,
    16::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'pZjpNS9YeVA'
LIMIT 1;

-- Video ID: PEB9jEXh0X4
INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Introduction & Accessing Gmail'::text,
    NULL::text,
    0::numeric,
    22::numeric,
    0::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'PEB9jEXh0X4'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Composing & Formatting Emails'::text,
    NULL::text,
    22::numeric,
    86::numeric,
    1::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'PEB9jEXh0X4'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Adding Attachments'::text,
    NULL::text,
    86::numeric,
    110::numeric,
    2::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'PEB9jEXh0X4'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Creating & Managing Signatures'::text,
    NULL::text,
    110::numeric,
    218::numeric,
    3::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'PEB9jEXh0X4'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Handling Drafts'::text,
    NULL::text,
    218::numeric,
    284::numeric,
    4::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'PEB9jEXh0X4'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Scheduling & Undoing Sent Emails'::text,
    NULL::text,
    284::numeric,
    399::numeric,
    5::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'PEB9jEXh0X4'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    '"Inbox Management (Reading, Replying, Forwarding)"'::text,
    NULL::text,
    399::numeric,
    453::numeric,
    6::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'PEB9jEXh0X4'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Organization Tools (Delete & Mark as Unread)'::text,
    NULL::text,
    453::numeric,
    507::numeric,
    7::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'PEB9jEXh0X4'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    '"Display & Layout Settings (View, Themes, Reading Pane)"'::text,
    NULL::text,
    507::numeric,
    590::numeric,
    8::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'PEB9jEXh0X4'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Conversation View'::text,
    NULL::text,
    590::numeric,
    614::numeric,
    9::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'PEB9jEXh0X4'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Searching for Emails'::text,
    NULL::text,
    614::numeric,
    634::numeric,
    10::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'PEB9jEXh0X4'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Organizing with Labels'::text,
    NULL::text,
    634::numeric,
    86400::numeric,
    11::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'PEB9jEXh0X4'
LIMIT 1;

-- Video ID: MJUJ4wbFm_A
INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Introduction to Git and Version Control'::text,
    NULL::text,
    0::numeric,
    220::numeric,
    0::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'MJUJ4wbFm_A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Git Clone'::text,
    NULL::text,
    220::numeric,
    301::numeric,
    1::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'MJUJ4wbFm_A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Git Add'::text,
    NULL::text,
    301::numeric,
    506::numeric,
    2::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'MJUJ4wbFm_A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Git Commit'::text,
    NULL::text,
    506::numeric,
    633::numeric,
    3::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'MJUJ4wbFm_A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Git Status'::text,
    NULL::text,
    633::numeric,
    722::numeric,
    4::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'MJUJ4wbFm_A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Git Push'::text,
    NULL::text,
    722::numeric,
    823::numeric,
    5::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'MJUJ4wbFm_A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Git Pull'::text,
    NULL::text,
    823::numeric,
    931::numeric,
    6::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'MJUJ4wbFm_A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Merge Conflicts'::text,
    NULL::text,
    931::numeric,
    1345::numeric,
    7::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'MJUJ4wbFm_A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Git Log'::text,
    NULL::text,
    1345::numeric,
    1423::numeric,
    8::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'MJUJ4wbFm_A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Git Reset'::text,
    NULL::text,
    1423::numeric,
    1558::numeric,
    9::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'MJUJ4wbFm_A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Branching'::text,
    NULL::text,
    1558::numeric,
    1711::numeric,
    10::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'MJUJ4wbFm_A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Merging Branches'::text,
    NULL::text,
    1711::numeric,
    2103::numeric,
    11::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'MJUJ4wbFm_A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Pull Requests'::text,
    NULL::text,
    2103::numeric,
    2198::numeric,
    12::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'MJUJ4wbFm_A'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Q&A: Understanding Submit 50'::text,
    NULL::text,
    2198::numeric,
    86400::numeric,
    13::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'MJUJ4wbFm_A'
LIMIT 1;

-- Video ID: K5KVEU3aaeQ
INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Introduction'::text,
    NULL::text,
    0::numeric,
    56::numeric,
    0::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'What is Python?'::text,
    NULL::text,
    56::numeric,
    251::numeric,
    1::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Installing Python'::text,
    NULL::text,
    251::numeric,
    336::numeric,
    2::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Python Interpreter'::text,
    NULL::text,
    336::numeric,
    450::numeric,
    3::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Code Editors'::text,
    NULL::text,
    450::numeric,
    529::numeric,
    4::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Your First Python Program'::text,
    NULL::text,
    529::numeric,
    745::numeric,
    5::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Python Extension'::text,
    NULL::text,
    745::numeric,
    866::numeric,
    6::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Linting Python Code'::text,
    NULL::text,
    866::numeric,
    1120::numeric,
    7::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Formatting Python Code'::text,
    NULL::text,
    1120::numeric,
    1371::numeric,
    8::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Running Python Code'::text,
    NULL::text,
    1371::numeric,
    1470::numeric,
    9::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Python Implementations'::text,
    NULL::text,
    1470::numeric,
    1619::numeric,
    10::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'How Python Code is Executed'::text,
    NULL::text,
    1619::numeric,
    1785::numeric,
    11::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Quiz'::text,
    NULL::text,
    1785::numeric,
    1877::numeric,
    12::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Python Mastery Course'::text,
    NULL::text,
    1877::numeric,
    1904::numeric,
    13::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Variables'::text,
    NULL::text,
    1904::numeric,
    2088::numeric,
    14::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Variable Names'::text,
    NULL::text,
    2088::numeric,
    2271::numeric,
    15::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Strings'::text,
    NULL::text,
    2271::numeric,
    2600::numeric,
    16::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Escape Sequences'::text,
    NULL::text,
    2600::numeric,
    2761::numeric,
    17::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Formatted Strings'::text,
    NULL::text,
    2761::numeric,
    2889::numeric,
    18::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'String Methods'::text,
    NULL::text,
    2889::numeric,
    3243::numeric,
    19::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Numbers'::text,
    NULL::text,
    3243::numeric,
    3410::numeric,
    20::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Working With Numbers'::text,
    NULL::text,
    3410::numeric,
    3539::numeric,
    21::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Type Conversion'::text,
    NULL::text,
    3539::numeric,
    3843::numeric,
    22::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Quiz'::text,
    NULL::text,
    3843::numeric,
    4003::numeric,
    23::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Comparison Operators'::text,
    NULL::text,
    4003::numeric,
    4126::numeric,
    24::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Conditional Statements'::text,
    NULL::text,
    4126::numeric,
    4376::numeric,
    25::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Ternary Operator'::text,
    NULL::text,
    4376::numeric,
    4504::numeric,
    26::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Logical Operators'::text,
    NULL::text,
    4504::numeric,
    4747::numeric,
    27::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Short-circuit Evaluations'::text,
    NULL::text,
    4747::numeric,
    4873::numeric,
    28::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Chaining Comparison Operators'::text,
    NULL::text,
    4873::numeric,
    4955::numeric,
    29::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Quiz'::text,
    NULL::text,
    4955::numeric,
    5058::numeric,
    30::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'For Loops'::text,
    NULL::text,
    5058::numeric,
    5276::numeric,
    31::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'For..Else'::text,
    NULL::text,
    5276::numeric,
    5442::numeric,
    32::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Nested Loops'::text,
    NULL::text,
    5442::numeric,
    5606::numeric,
    33::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Iterables'::text,
    NULL::text,
    5606::numeric,
    5794::numeric,
    34::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'While Loops'::text,
    NULL::text,
    5794::numeric,
    6093::numeric,
    35::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Infinite Loops'::text,
    NULL::text,
    6093::numeric,
    6190::numeric,
    36::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Exercise'::text,
    NULL::text,
    6190::numeric,
    6313::numeric,
    37::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Defining Functions'::text,
    NULL::text,
    6313::numeric,
    6457::numeric,
    38::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Arguments'::text,
    NULL::text,
    6457::numeric,
    6597::numeric,
    39::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Types of Functions'::text,
    NULL::text,
    6597::numeric,
    6839::numeric,
    40::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Keyword Arguments'::text,
    NULL::text,
    6839::numeric,
    6959::numeric,
    41::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Default Arguments'::text,
    NULL::text,
    6959::numeric,
    7054::numeric,
    42::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'xargs'::text,
    NULL::text,
    7054::numeric,
    86400::numeric,
    43::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'K5KVEU3aaeQ'
LIMIT 1;

-- Video ID: gOMW_n2-2Mw
INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'intro'::text,
    NULL::text,
    0::numeric,
    49::numeric,
    0::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'gOMW_n2-2Mw'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'list'::text,
    NULL::text,
    49::numeric,
    580::numeric,
    1::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'gOMW_n2-2Mw'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'set'::text,
    NULL::text,
    580::numeric,
    760::numeric,
    2::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'gOMW_n2-2Mw'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'tuple'::text,
    NULL::text,
    760::numeric,
    862::numeric,
    3::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'gOMW_n2-2Mw'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'conclusion'::text,
    NULL::text,
    862::numeric,
    86400::numeric,
    4::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'gOMW_n2-2Mw'
LIMIT 1;

-- Video ID: DloR0BOGNU0
INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Aborting the merge'::text,
    NULL::text,
    0::numeric,
    26::numeric,
    0::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'DloR0BOGNU0'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Understanding conflict markers'::text,
    NULL::text,
    26::numeric,
    90::numeric,
    1::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'DloR0BOGNU0'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Automatic merge options'::text,
    NULL::text,
    90::numeric,
    158::numeric,
    2::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'DloR0BOGNU0'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Doing a manual merge'::text,
    NULL::text,
    158::numeric,
    216::numeric,
    3::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'DloR0BOGNU0'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Understanding complex conflicts'::text,
    NULL::text,
    216::numeric,
    249::numeric,
    4::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'DloR0BOGNU0'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Adding the resolved files'::text,
    NULL::text,
    249::numeric,
    272::numeric,
    5::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'DloR0BOGNU0'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Completing the merge'::text,
    NULL::text,
    272::numeric,
    86400::numeric,
    6::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = 'DloR0BOGNU0'
LIMIT 1;

-- Video ID: 3iLALsW5qAQ
INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Introduction to Kotlin Scope Functions'::text,
    NULL::text,
    0::numeric,
    16::numeric,
    0::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = '3iLALsW5qAQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'What Are Scope Functions?'::text,
    NULL::text,
    16::numeric,
    41::numeric,
    1::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = '3iLALsW5qAQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Types of Scope Functions in Kotlin'::text,
    NULL::text,
    41::numeric,
    71::numeric,
    2::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = '3iLALsW5qAQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Understanding Return Types in Scope Functions'::text,
    NULL::text,
    71::numeric,
    107::numeric,
    3::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = '3iLALsW5qAQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Demo: How Scope Functions Work'::text,
    NULL::text,
    107::numeric,
    192::numeric,
    4::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = '3iLALsW5qAQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Context Reference: Using `it` vs `this`'::text,
    NULL::text,
    192::numeric,
    290::numeric,
    5::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = '3iLALsW5qAQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Modifying Objects with Apply and Also'::text,
    NULL::text,
    290::numeric,
    556::numeric,
    6::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = '3iLALsW5qAQ'
LIMIT 1;

INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, concept_id)
SELECT
    l.id,
    'Conclusion and Next Steps'::text,
    NULL::text,
    556::numeric,
    86400::numeric,
    7::int,
    NULL::uuid
FROM lessons l
WHERE l.youtube_video_id = '3iLALsW5qAQ'
LIMIT 1;

-- ============================================================
-- END OF INSERT STATEMENTS
-- ============================================================
