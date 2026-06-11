
---

# COURSE 04 — Data Visualization & Storytelling

---

## Module 4.1 — Matplotlib Fundamentals

### Module 4.1 Quiz

**Q1. [Multiple Choice — Beginner]**
In Matplotlib's object-oriented interface, what do `fig` and `ax` represent?

```python
fig, ax = plt.subplots()
```

A) `fig` is the plot area; `ax` is the canvas  
B) `fig` is the entire figure window; `ax` is the individual plot area (axes)  
C) `fig` and `ax` are identical objects  
D) `ax` is the x-axis label  

**Q2. [True/False — Beginner]**
`plt.show()` is required in Jupyter Notebooks to display a plot.

**Q3. [Code Interpretation — Intermediate]**
What chart type does this code produce, and what does each parameter do?

```python
fig, ax = plt.subplots(figsize=(10, 6))
ax.hist(df["income"], bins=30, color="steelblue", edgecolor="white", alpha=0.8)
ax.set_xlabel("Income ($)")
ax.set_ylabel("Count")
ax.set_title("Income Distribution")
plt.tight_layout()
```

**Q4. [Scenario-Based — Advanced]**
A colleague's bar chart shows 5 categories, but it's difficult to compare because the bars are all different colors with no logical grouping, the y-axis starts at a non-zero value making differences appear exaggerated, and there is no value label on the bars.

Identify and fix all three design problems in code or description.

**Q5. [Multiple Choice — Advanced]**
When should you use a `fig, axes = plt.subplots(2, 3)` call?

A) To create a 2x3 grid of 6 separate plots in one figure  
B) To create a plot with 2 x-axes and 3 y-axes  
C) To set the figure size to 2×3 inches  
D) To create 2 figures each with 3 plots  

---

### Answer Key — Module 4.1

**Q1: B**  
*`fig` (Figure) is the outermost container — the entire canvas including white space. `ax` (Axes) is the coordinate system where data is plotted. A figure can contain multiple axes (subplots).*

**Q2: False**  
*In Jupyter Notebooks with `%matplotlib inline` or in JupyterLab, plots render automatically without `plt.show()`. It is needed in script-based Python execution.*

**Q3:**  
*Produces a **histogram** of income distribution. `bins=30` sets 30 equal-width buckets. `figsize=(10,6)` sets the figure dimensions in inches. `alpha=0.8` makes bars 80% opaque (slight transparency). `edgecolor="white"` adds white borders between bars for visual separation. `tight_layout()` adjusts padding to prevent label clipping.*

**Q4:**  
*(1) Color fix: Use a single color for all bars (they represent one variable) or a sequential palette. Random multi-color for categories not semantically different is noise.*  
*(2) Y-axis baseline fix: Start y-axis at 0 (`ax.set_ylim(0, ...)`). Non-zero baselines visually exaggerate differences — a common misleading chart trick.*  
*(3) Value labels fix:*
```python
for bar in ax.patches:
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height(),
            f"{bar.get_height():.0f}", ha="center", va="bottom")
```

**Q5: A**  
*`plt.subplots(nrows, ncols)` creates a grid of axes. `subplots(2, 3)` creates 6 plots in a 2-row × 3-column layout, returning `axes` as a 2D array of Axes objects.*

---

## Module 4.2 — Seaborn for Statistical Visualization

### Module 4.2 Quiz

**Q1. [Multiple Choice — Beginner]**
Which Seaborn plot is best for visualizing the correlation structure between all numerical features in a dataset?

A) `sns.scatterplot()` B) `sns.heatmap(df.corr())` C) `sns.histplot()` D) `sns.barplot()`

**Q2. [Scenario-Based — Intermediate]**
You are exploring a dataset of house prices and want to see how `price` varies across 4 `neighborhood` categories, including the distribution shape and outliers. Which Seaborn plot is most appropriate and why?

A) Bar plot — to show mean prices  
B) Box plot or violin plot — to show the full distribution and outliers  
C) Line plot — to show trends  
D) Scatter plot — to show individual prices  

**Q3. [Code Interpretation — Advanced]**
What does this code produce and what insight does it reveal?

```python
g = sns.FacetGrid(df, col="gender", row="education_level")
g.map(sns.histplot, "income", bins=20)
```

---

### Answer Key — Module 4.2

**Q1: B**  
*A heatmap of the correlation matrix color-codes correlations between all feature pairs simultaneously. It reveals at a glance which variables are highly correlated (multicollinearity) — critical for feature selection.*

**Q2: B — Box plot or violin plot**  
*Box plots show median, IQR, and outliers. Violin plots add the full distribution shape (KDE). Both are better than bar charts (mean only) for understanding distribution differences. A box plot immediately shows whether price distributions differ in shape, not just average, across neighborhoods.*

**Q3:**  
*Creates a grid of histograms: each column corresponds to a `gender` value and each row to an `education_level`. This is a **faceted** plot — it shows the income distribution for every combination of gender and education. Reveals insights like: "Does the income gap between genders differ across education levels?" — a multivariate question impossible to answer with a single plot.*

---

## Module 4.3 — Plotly for Interactive Visualization

### Module 4.3 Quiz

**Q1. [Multiple Choice — Beginner]**
What is the primary advantage of Plotly charts over Matplotlib/Seaborn charts for stakeholder presentations?

A) Plotly is faster to render  
B) Plotly charts are interactive — hover, zoom, filter, without any additional code  
C) Plotly has more chart types  
D) Plotly works offline without any internet  

**Q2. [Code Interpretation — Intermediate]**
What does this Plotly Express code create?

```python
import plotly.express as px
fig = px.scatter(df, x="gdp_per_capita", y="life_expectancy",
                 color="continent", size="population",
                 hover_name="country", log_x=True,
                 title="GDP vs Life Expectancy")
fig.show()
```

**Q3. [Scenario-Based — Advanced]**
You need to present regional sales performance to non-technical executives. They need to explore the data themselves (filter by region, hover for details, zoom into time periods). Should you use Matplotlib, Seaborn, or Plotly? Justify your answer.

---

### Answer Key — Module 4.3

**Q1: B**  
*Plotly's biggest differentiator is interactivity out of the box. Users can hover for exact values, zoom, pan, toggle legend items, and export — without any JavaScript coding. Static Matplotlib plots require careful annotation to convey the same detail.*

**Q2:**  
*Creates an interactive **bubble scatter plot**: GDP per capita on x-axis (log scale), life expectancy on y-axis, bubble color = continent, bubble size = population, hover reveals country name. This single chart encodes 5 variables simultaneously. This is the famous "Hans Rosling" style plot.*

**Q3:**  
*Use **Plotly** (or a dashboard tool like Tableau). Executives exploring data themselves require interactivity — filtering by region, hovering for details, zooming into time ranges. Matplotlib/Seaborn produce static images that require a data analyst to be present to answer follow-up questions. Plotly can be exported to HTML and shared without any Python environment.*

---

## Module 4.4 — Dashboard Tools (Tableau Public & Power BI)

### Module 4.4 Quiz

**Q1. [Multiple Choice — Beginner]**
Tableau Public differs from Tableau Desktop in that:

A) Tableau Public cannot connect to databases  
B) Tableau Public is free but requires dashboards to be published publicly on Tableau's servers  
C) Tableau Public can only create bar charts  
D) Tableau Public requires a cloud subscription  

**Q2. [True/False — Intermediate]**
Power BI's DAX (Data Analysis Expressions) is used to create custom calculated columns and measures in Power BI reports.

**Q3. [Scenario-Based — Advanced]**
A client wants a dashboard showing sales KPIs that refreshes automatically when new data arrives in their database. They ask whether to use Tableau Public or Power BI Desktop. What would you recommend and why?

---

### Answer Key — Module 4.4

**Q1: B**  
*Tableau Public is completely free but all dashboards must be hosted publicly on Tableau's public server — not suitable for confidential business data. Tableau Desktop is paid and allows private publishing.*

**Q2: True**  
*DAX is Power BI's formula language, similar in concept to Excel formulas but designed for relational data models. It's used for calculated columns, measures, and KPIs.*

**Q3:**  
*Recommend **Power BI Desktop** (with Power BI Service for scheduling, if budget allows). Power BI connects directly to SQL databases with scheduled refresh. Tableau Public cannot connect to private databases — it's for public data. For a production business dashboard with live database connections and automatic refresh, neither free tool is fully sufficient — but Power BI Service (paid) or Power BI Desktop with manual refresh is the practical choice for this workflow.*

---

## Module 4.5 — Visualization Design Principles & Data Storytelling

### Module 4.5 Quiz

**Q1. [Multiple Choice — Beginner]**
The "SCR" framework for data storytelling stands for:

A) Statistics, Conclusion, Recommendations  
B) Situation, Complication, Resolution  
C) Summary, Chart, Report  
D) Source, Context, Result  

**Q2. [True/False — Intermediate]**
Using 3D bar charts is generally recommended because they look more professional and add depth to the presentation.

**Q3. [Scenario-Based — Advanced]**
You are presenting to a VP of Sales. Your analysis shows that the North region underperforms by 23% vs. target while all other regions are on track. Design the structure of a 3-slide data story using the SCR framework.

---

### Answer Key — Module 4.5

**Q1: B**  
*Situation-Complication-Resolution: Set the context (Situation), introduce the problem or question (Complication), present the insight or recommendation (Resolution). This narrative arc is adapted from McKinsey's consulting communication framework.*

**Q2: False**  
*3D charts introduce visual distortion — the third dimension creates perspective effects that make it impossible to accurately compare bar heights. The brain parses 2D length more accurately than 3D depth. 3D charts should almost always be avoided in professional data communication.*

**Q3:**  
*Slide 1 (Situation): "All regions met Q3 targets overall — company performance is on track. Here is regional performance by month."*  
*Slide 2 (Complication): "However, the North region has consistently underperformed by 23% against target for 3 consecutive quarters. This concentrated gap is masking company-wide growth potential." [Annotated chart highlighting North's line diverging from target.]*  
*Slide 3 (Resolution): "Root cause analysis points to two factors: [X] and [Y]. Recommended actions: [1], [2]. Implementing these by Q4 is projected to close the gap by 15%."*

---

## Module 4.6 — Google Looker Studio & Visualization Accessibility

### Module 4.6 Quiz

**Q1. [Multiple Choice — Beginner]**
What percentage of men are colorblind, making colorblind-accessible design a professional requirement?

A) 1% B) 8% C) 15% D) 25%

**Q2. [True/False — Intermediate]**
The viridis colormap is preferred over rainbow/jet colormaps for sequential data because it is perceptually uniform and colorblind-friendly.

**Q3. [Scenario-Based — Advanced]**
A data analyst creates a chart comparing two values: "Revenue" in red and "Costs" in green. A colorblind user with deuteranopia (red-green colorblindness) views this chart. What problem occurs, and how would you fix it?

---

### Answer Key — Module 4.6

**Q1: B — 8%**  
*Approximately 8% of men and 0.5% of women have some form of color vision deficiency. In an audience of 100 men, 8 cannot distinguish red from green — making red/green contrast charts actively exclusionary.*

**Q2: True**  
*Viridis is designed to be perceptually uniform (equal visual steps correspond to equal value steps), colorblind-safe, and readable in grayscale. Rainbow/jet colormaps have perceptual non-uniformities that can create false visual features in data.*

**Q3:**  
*Problem: Red and green appear as the same brownish-yellow to users with red-green colorblindness — they cannot distinguish Revenue from Costs on the chart.*  
*Fix: Use blue and orange (a colorblind-safe pair). Add a pattern/texture distinction in addition to color. Add direct labels on the lines/bars instead of relying on color legend alone. Test with a colorblindness simulator (Coblis).*

---

# COURSE 04 — End-of-Course Assessment
## Data Visualization & Storytelling (25 Questions)

**Q1.** [MCQ] Which chart type is best for showing the distribution of a single continuous variable?
A) Pie chart B) Histogram C) Line chart D) Scatter plot

**Q2.** [T/F] A scatter plot with a correlation of 0.95 between two variables proves one causes the other.

**Q3.** [MCQ] In Matplotlib, `ax.set_ylim(0, 100)` sets:
A) The number of y-axis ticks B) The y-axis range from 0 to 100 C) The y-axis label D) The figure height

**Q4.** [Design] A journalist's pie chart has 12 thin slices. What problem does this create, and what chart type should replace it?

**Q5.** [MCQ] Which Seaborn plot is designed to show the relationship between two continuous variables including their individual distributions on the margins?
A) `sns.heatmap()` B) `sns.jointplot()` C) `sns.pairplot()` D) `sns.catplot()`

**Q6.** [T/F] `plt.savefig("chart.png", dpi=300)` saves a high-resolution version of the figure.

**Q7.** [MCQ] In data storytelling, what is "pre-attentive processing"?
A) Data preparation before visualization B) Visual properties (color, size, position) the brain processes before conscious attention C) The preview step in a dashboard D) Statistical preprocessing

**Q8.** [Short Answer] What is the difference between `Plotly Express` and `Plotly Graph Objects`?

**Q9.** [Code] What does `sns.pairplot(df, hue="species")` produce?

**Q10.** [MCQ] Which color scale is appropriate for data ranging from negative to positive (e.g., temperature anomaly from -5°C to +5°C)?
A) Sequential (e.g., blues) B) Qualitative (e.g., Set1) C) Diverging (e.g., RdBu) D) Grayscale

**Q11.** [T/F] Tableau Public dashboards can be embedded in websites and shared via a public URL.

**Q12.** [MCQ] In Power BI, a "measure" differs from a "calculated column" in that:
A) Measures are stored per row; calculated columns aggregate B) Measures are computed dynamically during report interaction; calculated columns are static row-level computations C) They are identical D) Measures only work with dates

**Q13.** [Short Answer] Explain the "data-ink ratio" concept and why maximizing it improves charts.

**Q14.** [Scenario] A sales manager asks for a chart showing monthly revenue trends for 5 products over 2 years. Which chart type and which design principles would you apply?

**Q15.** [MCQ] Google Looker Studio is primarily used for:
A) Machine learning model training B) Interactive web-based reporting connected to Google Sheets, BigQuery, and other sources C) Database management D) Statistical analysis in Python

**Q16.** [T/F] A line chart is appropriate for showing discrete categories with no natural ordering.

**Q17.** [Code] What does `fig.write_html("chart.html")` do in Plotly?

**Q18.** [MCQ] Which of these is NOT a pre-attentive attribute in data visualization?
A) Color B) Size C) Position D) Font name used for labels

**Q19.** [Design Critique] A stacked bar chart is used to compare 8 categories across 12 time periods. Identify two readability problems and suggest better alternatives.

**Q20.** [T/F] `sns.set_theme(style="whitegrid")` changes the default plot background for all subsequent Seaborn plots.

**Q21.** [Short Answer] What is the purpose of `plt.tight_layout()` and when is it particularly important?

**Q22.** [MCQ] A chart has no title, no axis labels, and uses 8 different colors for 8 data points. The audience cannot understand it without explanation. This chart fails the:
A) Scalability principle B) Self-sufficiency principle C) Proportionality principle D) Annotation principle

**Q23.** [T/F] A scatter plot matrix (pairplot) with 20 features would produce 400 individual scatter plots.

**Q24.** [Scenario-Advanced] A product team asks you to build a dashboard for a non-technical audience showing daily active users, revenue, and support tickets for the past 90 days. List 5 specific design decisions you would make.

**Q25.** [MCQ] Which tool is best for creating a publication-quality chart suitable for a news article without writing code?
A) Matplotlib B) Datawrapper C) Plotly D) Tableau

---

### Answer Key — Course 04

Q1:B | Q2:False | Q3:B | Q4: Too many thin slices are impossible to read; use a bar chart instead | Q5:B | Q6:True | Q7:B | Q8: Plotly Express is a high-level API for creating common charts in one line; Graph Objects is the lower-level API for full customization of every element | Q9: A matrix of scatter plots for every pair of features, colored by species — reveals pairwise relationships and class separation | Q10:C | Q11:True | Q12:B | Q13: Data-ink ratio (Tufte) = data ink / total ink; maximize by removing chart junk — unnecessary gridlines, borders, legends when redundant, decorative 3D effects; every visual element should earn its place by conveying information | Q14: Multi-line chart; one line per product; consistent colors throughout; direct labels at line ends (avoid legend look-up); annotate significant events; clear time axis | Q15:B | Q16:False (bar chart is appropriate for discrete categories; line implies continuity) | Q17: Exports the interactive Plotly chart as a standalone HTML file that can be opened in any browser without Python | Q18:D | Q19: (1) Hard to compare non-bottom segments; (2) 8×12=96 stacked bars is overwhelming. Better: small multiples (faceted bar charts) or a line chart per category | Q20:True | Q21: Adjusts subplot spacing so labels/titles don't overlap each other; critical when using subplots or when axis labels are long | Q22:B | Q23:True (20×20=400, though diagonal shows distribution of each feature) | Q24: Minimalist design with white background; 3 KPI scorecards at top; trend lines (not bars) for daily metrics; 7-day rolling average overlay; consistent color scheme; hover tooltips for exact values | Q25:B

---

## Course 04 — Practical Assignment

### Title: Interactive Sales Performance Dashboard

**Dataset:** Superstore Sales Dataset (Kaggle)

**Requirements:**
1. Build a Plotly Express dashboard in a Jupyter Notebook with at least 5 different chart types
2. Create a published Tableau Public dashboard (public URL required)
3. Recreate the same dashboard in Google Looker Studio
4. All charts must use colorblind-accessible color palettes (viridis, ColorBrewer, or manually selected accessible colors)
5. Design storytelling narrative: write a 3-paragraph SCR framework summary of your key insights
6. Apply design best practices: no 3D charts, no pie charts with >5 slices, direct labels where possible

**Deliverables:**
- Jupyter Notebook with Plotly charts
- Tableau Public URL
- Looker Studio link (shareable)
- Written narrative summary

**Grading Rubric:**

| Category | Points |
|----------|--------|
| Chart variety and correctness (5+ types) | 20 |
| Tableau Public dashboard (published, functional) | 20 |
| Looker Studio version | 15 |
| Colorblind accessibility | 10 |
| Design quality (labels, titles, no junk) | 15 |
| SCR narrative accuracy and clarity | 20 |
| **Total** | **100** |

---

---

# COURSE 05 — SQL & Relational Databases

---

## Module 5.1 — Relational Database Concepts

### Module 5.1 Quiz

**Q1. [Multiple Choice — Beginner]**
A primary key in a relational database:

A) Can contain duplicate values  
B) Uniquely identifies each row in a table and cannot be NULL  
C) Must be a single integer column  
D) Is the same as a foreign key  

**Q2. [True/False — Beginner]**
Database normalization reduces data redundancy by organizing tables to minimize duplicate data.

**Q3. [Scenario-Based — Intermediate]**
You are designing a database for an e-commerce store. You have: customers (name, email, address), orders (order_id, date, total), and order_items (product, quantity, price). 

(a) Draw the relationship between these 3 tables (describe the foreign key structure)  
(b) What type of relationship exists between `customers` and `orders`?

**Q4. [Multiple Choice — Advanced]**
A table is in **Third Normal Form (3NF)** when:

A) Every non-key column depends on the whole primary key (2NF), AND every non-key column depends only on the primary key (not on other non-key columns)  
B) There are no repeating groups  
C) All columns have unique values  
D) There are no NULL values  

---

### Answer Key — Module 5.1

**Q1: B**  
*Primary keys must be unique (no duplicates) and NOT NULL. They identify exactly one row. They can be composite (multiple columns) but each combination must be unique.*

**Q2: True**  
*Normalization decomposes tables to remove redundancy and insertion/update/deletion anomalies. A customer's address stored once (not in every order row) is a classic example.*

**Q3:**  
*(a) `orders` has a foreign key `customer_id` → `customers.customer_id`. `order_items` has a foreign key `order_id` → `orders.order_id`. This ensures referential integrity — you can't have an order item for an order that doesn't exist.*  
*(b) One-to-many: one customer can have many orders, but each order belongs to exactly one customer.*

**Q4: A**  
*3NF eliminates transitive dependencies. Example: if `zip_code` determines `city`, storing both in an `orders` table creates a transitive dependency (city depends on zip_code, not on the primary key order_id). Solution: move zip/city to a separate `locations` table.*

---

## Module 5.2 — Basic SQL Queries

### Module 5.2 Quiz

**Q1. [SQL Writing — Beginner]**
Write a SQL query to retrieve all customers from a `customers` table who are from 'Germany', ordered by last name alphabetically.

**Q2. [SQL Debugging — Beginner]**
What is wrong with this SQL, and how do you fix it?

```sql
SELECT name, salary 
FROM employees 
WHERE salary > 50000 
ORDER department ASC;
```

**Q3. [SQL Writing — Intermediate]**
From an `orders` table with columns `[order_id, customer_id, amount, status]`, write a query that returns:
- Only orders with status 'completed' or 'shipped'  
- Amount between $100 and $5000  
- Only the `order_id` and `amount` columns  
- The top 10 highest amounts  

**Q4. [SQL Interpretation — Intermediate]**
What does `COALESCE(discount, 0)` do in a SELECT clause?

**Q5. [Scenario-Based — Advanced]**
The NULL value causes unexpected behavior in SQL. Explain what `WHERE discount != 0` returns when some rows have NULL in the `discount` column. How would you write the query to correctly include non-discounted rows?

---

### Answer Key — Module 5.2

**Q1:**
```sql
SELECT * FROM customers
WHERE country = 'Germany'
ORDER BY last_name ASC;
```

**Q2:**  
*Missing `BY` in `ORDER BY`. Fixed:*
```sql
ORDER BY department ASC;
```

**Q3:**
```sql
SELECT order_id, amount
FROM orders
WHERE status IN ('completed', 'shipped')
  AND amount BETWEEN 100 AND 5000
ORDER BY amount DESC
LIMIT 10;
```

**Q4:**  
*`COALESCE(discount, 0)` returns the first non-NULL value in its argument list. If `discount` is NULL, it returns 0. This prevents NULL from propagating through calculations (e.g., `price - COALESCE(discount, 0)` correctly returns `price` when there is no discount).*

**Q5:**  
*`WHERE discount != 0` returns NEITHER discounted rows nor NULL rows — NULL comparisons in SQL always return UNKNOWN (not TRUE or FALSE), so NULL rows are excluded. To include rows with no discount: `WHERE discount != 0 OR discount IS NULL`.*

---

## Module 5.3 — Aggregation & Grouping

### Module 5.3 Quiz

**Q1. [SQL Writing — Beginner]**
Write a SQL query to count the number of orders per customer, returning only customers with more than 5 orders.

**Q2. [SQL Debugging — Intermediate]**
What is wrong with this query?

```sql
SELECT department, employee_name, COUNT(*) as emp_count
FROM employees
GROUP BY department;
```

**Q3. [SQL Writing — Intermediate]**
Write a query using `CASE WHEN` to add a `revenue_tier` column: 'High' if revenue > 100000, 'Medium' if 50000–100000, 'Low' otherwise.

**Q4. [SQL Interpretation — Advanced]**
Explain the difference between `WHERE` and `HAVING`. Which executes first?

---

### Answer Key — Module 5.3

**Q1:**
```sql
SELECT customer_id, COUNT(*) AS order_count
FROM orders
GROUP BY customer_id
HAVING COUNT(*) > 5;
```

**Q2:**  
*`employee_name` is not in the `GROUP BY` clause and is not aggregated. SQL requires every non-aggregated column in SELECT to appear in GROUP BY. Fix: either add `employee_name` to GROUP BY, or remove it, or use an aggregate like `MAX(employee_name)` if you want a representative name.*

**Q3:**
```sql
SELECT 
    *,
    CASE 
        WHEN revenue > 100000 THEN 'High'
        WHEN revenue BETWEEN 50000 AND 100000 THEN 'Medium'
        ELSE 'Low'
    END AS revenue_tier
FROM sales;
```

**Q4:**  
*`WHERE` filters individual rows BEFORE grouping — it operates on raw data. `HAVING` filters groups AFTER `GROUP BY` — it operates on aggregated results. Execution order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY. Use `WHERE` to filter rows before aggregation; `HAVING` to filter groups based on aggregate conditions.*

---

## Module 5.4 — JOINs

### Module 5.4 Quiz

**Q1. [Multiple Choice — Beginner]**
A LEFT JOIN between `orders` (left) and `customers` (right) returns:

A) Only orders with matching customers  
B) All orders, with customer information where available (NULL otherwise)  
C) All customers, with order information where available  
D) All orders AND all customers  

**Q2. [SQL Writing — Intermediate]**
Write a query that retrieves all orders along with the customer name and country. The `orders` table has `customer_id`; the `customers` table has `customer_id, name, country`.

**Q3. [SQL Writing — Advanced]**
Find all customers who have **never** placed an order. The `customers` table has `customer_id, name`; the `orders` table has `order_id, customer_id`. Write two approaches: one using LEFT JOIN and one using NOT EXISTS.

**Q4. [SQL Interpretation — Advanced]**
You join two tables and the result has MORE rows than either input table. What most likely caused this?

---

### Answer Key — Module 5.4

**Q1: B**  
*LEFT JOIN keeps all rows from the left table (orders). Where no matching customer exists, customer columns are NULL. This is the most common join in data analysis — it preserves your primary dataset.*

**Q2:**
```sql
SELECT o.order_id, o.amount, c.name, c.country
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id;
```
*(INNER JOIN — returns only orders with matching customers)*

**Q3:**
```sql
-- LEFT JOIN approach
SELECT c.customer_id, c.name
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;

-- NOT EXISTS approach
SELECT c.customer_id, c.name
FROM customers c
WHERE NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id
);
```

**Q4:**  
*A **many-to-many relationship** in the data caused row duplication. If one customer has placed 5 orders and one order can have multiple line items, joining without proper filtering multiplies rows. Also called a "fan-out" or "join explosion." Always verify row count after joins: `SELECT COUNT(*)` before and after.*

---

## Module 5.5 — Subqueries & CTEs

### Module 5.5 Quiz

**Q1. [SQL Writing — Beginner]**
Write a query using a subquery to find all employees who earn more than the average salary.

**Q2. [SQL Writing — Intermediate]**
Rewrite the following subquery as a CTE (WITH clause):

```sql
SELECT customer_id, total_spent
FROM (
    SELECT customer_id, SUM(amount) as total_spent
    FROM orders
    GROUP BY customer_id
) AS spending
WHERE total_spent > 1000;
```

**Q3. [SQL Interpretation — Advanced]**
What is the advantage of a CTE over a subquery from a readability and maintenance perspective? When would you choose a subquery instead?

---

### Answer Key — Module 5.5

**Q1:**
```sql
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
```

**Q2:**
```sql
WITH spending AS (
    SELECT customer_id, SUM(amount) AS total_spent
    FROM orders
    GROUP BY customer_id
)
SELECT customer_id, total_spent
FROM spending
WHERE total_spent > 1000;
```

**Q3:**  
*CTEs improve readability by naming intermediate results at the top of the query like a "sub-pipeline." Complex queries with multiple transformations become self-documenting. CTEs can also be referenced multiple times in the same query (unlike subqueries which must be repeated). Choose a subquery when the logic is simple, used in one place, and a CTE would add unnecessary overhead — especially inside WHERE clauses where correlated subqueries are sometimes more direct.*

---

## Module 5.6 — Window Functions

### Module 5.6 Quiz

**Q1. [SQL Interpretation — Beginner]**
What does `ROW_NUMBER() OVER (ORDER BY salary DESC)` produce?

**Q2. [SQL Writing — Intermediate]**
Write a query that adds a column `running_total` to a `sales` table with `[date, amount]`, showing the cumulative sum of `amount` ordered by date.

**Q3. [SQL Writing — Intermediate]**
From a `sales` table with `[region, month, revenue]`, rank the months within each region by revenue (highest = rank 1), using `RANK()` (not `ROW_NUMBER()`). What happens if two months have the same revenue?

**Q4. [SQL Writing — Advanced]**
Using `LAG()`, write a query that computes the month-over-month revenue change for each row in the `sales` table.

**Q5. [SQL Interpretation — Advanced]**
What is the difference between `RANK()` and `DENSE_RANK()`? Give an example where they produce different results.

---

### Answer Key — Module 5.6

**Q1:**  
*Assigns a sequential integer (1, 2, 3...) to each row, ordered by salary descending. The highest earner gets rank 1. Unlike `RANK()`, ties get different numbers.*

**Q2:**
```sql
SELECT date, amount,
       SUM(amount) OVER (ORDER BY date) AS running_total
FROM sales;
```

**Q3:**
```sql
SELECT region, month, revenue,
       RANK() OVER (PARTITION BY region ORDER BY revenue DESC) AS rank
FROM sales;
```
*If two months tie, `RANK()` gives them the same rank (e.g., both get rank 2) and skips the next rank (next gets rank 4). `ROW_NUMBER()` would assign 2 and 3 arbitrarily.*

**Q4:**
```sql
SELECT month, revenue,
       LAG(revenue, 1) OVER (ORDER BY month) AS prev_month_revenue,
       revenue - LAG(revenue, 1) OVER (ORDER BY month) AS mom_change
FROM sales;
```

**Q5:**  
*Both assign the same rank to ties, but `DENSE_RANK()` does not skip rank numbers. Example: scores [100, 100, 90]. `RANK()` → [1, 1, 3] (skips 2). `DENSE_RANK()` → [1, 1, 2] (no skip). Use `DENSE_RANK()` when you want consecutive rank numbers.*

---

## Module 5.7 — SQL + Python Integration

### Module 5.7 Quiz

**Q1. [Code Interpretation — Beginner]**
What does this code do?

```python
import sqlite3
import pandas as pd

conn = sqlite3.connect("sales.db")
df = pd.read_sql("SELECT * FROM orders WHERE amount > 100", conn)
conn.close()
```

**Q2. [Code Interpretation — Intermediate]**
What is the advantage of using `pd.read_sql()` over cursor-based querying with `sqlite3`?

**Q3. [Scenario-Based — Advanced]**
You have a cleaned Pandas DataFrame `df_clean` that you want to persist to a SQLite database table called `clean_sales` for future SQL querying. Write the Python code using both `sqlite3` and `df.to_sql()`.

---

### Answer Key — Module 5.7

**Q1:**  
*Opens a connection to a SQLite database file `sales.db`, executes a SQL SELECT query filtered to amounts > 100, and loads the result directly into a Pandas DataFrame. Closes the connection after.*

**Q2:**  
*`pd.read_sql()` returns a DataFrame directly — no manual cursor management, row fetching, or column naming. With raw `sqlite3`, you'd need: `cursor.execute(sql)`, `rows = cursor.fetchall()`, `columns = [d[0] for d in cursor.description]`, `pd.DataFrame(rows, columns=columns)`. `pd.read_sql()` does all of this in one line.*

**Q3:**
```python
import sqlite3
import pandas as pd

conn = sqlite3.connect("sales.db")
df_clean.to_sql("clean_sales", conn, if_exists="replace", index=False)
conn.close()

# Verify
conn = sqlite3.connect("sales.db")
result = pd.read_sql("SELECT COUNT(*) FROM clean_sales", conn)
conn.close()
```

---

## Module 5.8 — dbt Core Fundamentals

### Module 5.8 Quiz

**Q1. [Multiple Choice — Beginner]**
What problem does dbt (Data Build Tool) primarily solve?

A) Running Python machine learning models in production  
B) Versioning SQL transformation pipelines with testing, documentation, and lineage tracking  
C) Visualizing database schemas  
D) Replacing SQL with a Python-only workflow  

**Q2. [True/False — Intermediate]**
In dbt, a `{{ ref('model_name') }}` macro creates a dependency between two models and ensures the referenced model runs first.

**Q3. [Code Interpretation — Intermediate]**
What does this dbt model do?

```sql
-- models/stg_orders.sql
SELECT
    order_id,
    customer_id,
    amount,
    CAST(order_date AS DATE) AS order_date,
    UPPER(status) AS status
FROM {{ source('raw', 'orders') }}
WHERE amount > 0
```

**Q4. [Scenario-Based — Advanced]**
You are an analytics engineer. A business analyst says: "The `revenue` column in our dashboard is wrong — it includes refunds." You trace the issue to a raw SQL transformation applied directly to the source table without any tests or version control.

How would implementing this transformation as a dbt model prevent this type of problem in the future?

---

### Answer Key — Module 5.8

**Q1: B**  
*dbt treats SQL transformations as software — with version control (Git), testing (not_null, unique), documentation, and lineage graphs. It fills the gap between raw SQL scripts and production data engineering.*

**Q2: True**  
*`{{ ref() }}` creates a DAG dependency. dbt analyzes the full graph and runs models in dependency order. It also substitutes the correct table name in different environments (dev vs prod).*

**Q3:**  
*A staging model that reads from the raw `orders` source table, filters out zero-amount records, standardizes the `order_date` to DATE type, and uppercases the `status` field. This is a typical "staging" layer — light cleaning before downstream models consume the data.*

**Q4:**  
*With dbt: the transformation is in a versioned `.sql` file → any change is tracked in Git with a commit message. A `dbt test` can be added: `WHERE status != 'REFUNDED'` excludes refunds. The `not_null` and `unique` tests catch data quality issues automatically. The lineage graph shows all downstream dashboards that depend on this model — when someone changes the revenue logic, all affected models are visible. Without dbt, this transformation lives in undocumented, untested SQL that any analyst can overwrite.*

---

## Module 5.9 — DuckDB & SQL Performance

### Module 5.9 Quiz

**Q1. [Multiple Choice — Beginner]**
DuckDB differs from SQLite in that:

A) DuckDB requires a server to run  
B) DuckDB is optimized for analytical (OLAP) queries on large files; SQLite is optimized for transactional (OLTP) row-level operations  
C) DuckDB cannot read CSV files  
D) DuckDB only works with cloud storage  

**Q2. [Code Interpretation — Intermediate]**
What does this Python code do, and why is it particularly powerful?

```python
import duckdb

result = duckdb.query("""
    SELECT region, SUM(amount) as total
    FROM 'sales_data.parquet'
    GROUP BY region
    ORDER BY total DESC
""").df()
```

**Q3. [SQL Optimization — Advanced]**
The following query is running slowly on a 100M row table:

```sql
SELECT *
FROM orders
WHERE YEAR(order_date) = 2024 
  AND customer_id IN (SELECT customer_id FROM vip_customers);
```

Identify two performance problems and propose fixes.

---

### Answer Key — Module 5.9

**Q1: B**  
*DuckDB is an embedded OLAP database — it excels at full-table scans, aggregations, and analytical queries across many rows. SQLite excels at transactional, row-level insert/update operations with indexed lookups. For analytical data work, DuckDB is typically 10-100x faster than SQLite.*

**Q2:**  
*Queries a Parquet file directly using SQL without loading the entire file into memory first. DuckDB reads only the data it needs (predicate pushdown, column pruning), aggregates by region, and returns a Pandas DataFrame. This is transformational: you can run SQL on large Parquet files on a laptop with minimal memory overhead.*

**Q3:**  
*(1) `YEAR(order_date) = 2024`: Applying a function to the indexed column prevents index usage (function on indexed column = full table scan). Fix: `WHERE order_date >= '2024-01-01' AND order_date < '2025-01-01'` — allows the query engine to use an index on `order_date`.*  
*(2) `SELECT *`: Reads all columns; use `SELECT order_id, customer_id, amount` — only the needed columns.*  
*(Bonus) `IN (subquery)`: Can be slow for large subquery results. Consider `JOIN vip_customers ON orders.customer_id = vip_customers.customer_id` which the optimizer can handle more efficiently.*

---

# COURSE 05 — End-of-Course Assessment
## SQL & Relational Databases (35 Questions)

**Q1.** [MCQ] What does `SELECT DISTINCT` do?
A) Selects the fastest rows B) Returns unique values, removing duplicates C) Selects random rows D) Orders results

**Q2.** [SQL] Write a query to find the 2nd highest salary in an `employees` table.

**Q3.** [T/F] In SQL, `NULL = NULL` evaluates to TRUE.

**Q4.** [MCQ] `LEFT JOIN` vs `INNER JOIN`: which should you use when you want to keep all rows from the first table even if there's no match?
A) INNER JOIN B) LEFT JOIN C) FULL OUTER JOIN D) CROSS JOIN

**Q5.** [SQL] Write a CTE that calculates each customer's total spending, then selects only customers who spent more than $500 in the past 30 days.

**Q6.** [T/F] `HAVING` can be used without a `GROUP BY` clause.

**Q7.** [SQL Optimization] Explain why `SELECT *` is discouraged in production SQL queries.

**Q8.** [MCQ] `ROW_NUMBER()` vs `RANK()`: which allows ties?
A) ROW_NUMBER only B) RANK only C) Neither D) Both, but handle ties differently

**Q9.** [SQL] Write a query using LAG() to find users who made a purchase in the previous month.

**Q10.** [T/F] An INNER JOIN between two tables with 100 and 200 rows can produce more than 200 rows.

**Q11.** [MCQ] Which SQL clause filters AFTER aggregation?
A) WHERE B) HAVING C) GROUP BY D) ORDER BY

**Q12.** [SQL Debugging] Fix this query:
```sql
SELECT customer_id, SUM(amount)
FROM orders
WHERE SUM(amount) > 1000
GROUP BY customer_id;
```

**Q13.** [MCQ] What does `COALESCE(a, b, c)` return?
A) The sum B) The average C) The first non-NULL value D) The last non-NULL value

**Q14.** [T/F] dbt models are written in Python.

**Q15.** [SQL] Write a window function query that shows each sale and the 3-month rolling average revenue per region.

**Q16.** [MCQ] Which normal form eliminates transitive dependencies?
A) 1NF B) 2NF C) 3NF D) BCNF

**Q17.** [Short Answer] What is referential integrity and how does a foreign key enforce it?

**Q18.** [SQL] Find all pairs of customers from the same country (SELF JOIN).

**Q19.** [T/F] DuckDB can query Parquet and CSV files directly without importing them into a database first.

**Q20.** [MCQ] What is the correct order of SQL clause execution?
A) SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY
B) FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY
C) FROM → SELECT → WHERE → GROUP BY → HAVING → ORDER BY
D) WHERE → FROM → SELECT → GROUP BY

**Q21.** [SQL] Write a query to find customers who placed orders in BOTH January and February (not OR).

**Q22.** [MCQ] The `{{ source() }}` macro in dbt:
A) Connects to an external API B) References a raw source table defined in sources.yml C) Runs a Python transformation D) Creates a new database

**Q23.** [Short Answer] What is the multiple comparisons problem in the context of running many SQL analyses on the same dataset?

**Q24.** [SQL Optimization] A query on a 500M row table with `WHERE email = 'user@example.com'` runs in 45 seconds. What would you add to make it run in milliseconds?

**Q25.** [T/F] `pd.read_sql()` requires SQLAlchemy to work with any database.

**Q26.** [SQL] Write a recursive CTE to generate a sequence of numbers from 1 to 10.

**Q27.** [MCQ] In DuckDB, `EXPLAIN SELECT * FROM data.parquet WHERE year = 2024` will show:
A) The result of the query B) The execution plan the engine will use C) The schema of the file D) Syntax errors

**Q28.** [Short Answer] What is predicate pushdown in query optimization?

**Q29.** [SQL] Using window functions, write a query to label each row as 'Top 25%', 'Middle 50%', or 'Bottom 25%' based on their salary percentile.

**Q30.** [T/F] `NOT IN` with a subquery that returns NULL values can produce unexpected results.

**Q31.** [MCQ] Which dbt test checks that a column has no duplicate values?
A) `not_null` B) `unique` C) `accepted_values` D) `relationships`

**Q32.** [Short Answer] What is the difference between `UNION` and `UNION ALL`?

**Q33.** [SQL Debugging] Find the bug:
```sql
SELECT * FROM orders o
LEFT JOIN customers c ON o.id = c.order_id
WHERE c.country = 'USA';
```

**Q34.** [MCQ] Which SQL function returns the number of rows in a group?
A) `SUM()` B) `COUNT(*)` C) `AVG()` D) `TOTAL()`

**Q35.** [Scenario-Advanced] A CEO asks: "Who are our top 10 customers by lifetime value, and did their spending increase this year vs. last year?" Write the SQL query structure (CTEs encouraged).

---

### Answer Key — Course 05

Q1:B | Q2:`SELECT MAX(salary) FROM employees WHERE salary < (SELECT MAX(salary) FROM employees)` | Q3:False (NULL=NULL is UNKNOWN) | Q4:B | Q5: CTE with date filter, HAVING total>500 | Q6:True (rare but valid — HAVING with no GROUP BY treats entire result as one group) | Q7:Reads all columns unnecessarily, wastes I/O and memory, breaks if table schema changes | Q8:D | Q9:LAG(order_date) OVER PARTITION BY customer_id | Q10:True (many-to-many produces fan-out) | Q11:B | Q12:Move `WHERE SUM(amount) > 1000` to `HAVING SUM(amount) > 1000` | Q13:C | Q14:False (dbt models are written in SQL) | Q15:AVG(revenue) OVER (PARTITION BY region ORDER BY month ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) | Q16:C | Q17:Referential integrity ensures a foreign key value always references an existing primary key — the database prevents orphaned records; FK enforces this with ON DELETE/UPDATE rules | Q18:`SELECT a.name, b.name, a.country FROM customers a JOIN customers b ON a.country=b.country AND a.id < b.id` | Q19:True | Q20:B | Q21:Use two subqueries or CTE for each month, then INTERSECT or JOIN on customer_id | Q22:B | Q23:Running many queries on the same data increases the chance of false "discoveries" by random chance — similar to the multiple comparisons problem in statistics | Q24:Create an index on the `email` column | Q25:False (works with `sqlite3` directly; SQLAlchemy needed for some databases) | Q26:WITH RECURSIVE seq AS (SELECT 1 AS n UNION ALL SELECT n+1 FROM seq WHERE n<10) SELECT * FROM seq | Q27:B | Q28:Pushing filter conditions (WHERE predicates) down to the storage layer so only matching data is read, rather than reading all data and filtering in memory | Q29:NTILE(4) OVER(ORDER BY salary) to get quartiles, then CASE WHEN ntile=4 THEN 'Top 25%'... | Q30:True (NOT IN with NULL returns UNKNOWN for all rows, effectively returning no results — use NOT EXISTS instead) | Q31:B | Q32:UNION removes duplicates; UNION ALL keeps all rows including duplicates (faster) | Q33:The WHERE clause `c.country = 'USA'` filters out NULL values from the LEFT JOIN, effectively turning it into an INNER JOIN — move condition to ON clause: `ON o.id=c.order_id AND c.country='USA'` | Q34:B | Q35:CTE1: lifetime value by customer; CTE2: this year spending; CTE3: last year spending; JOIN all, RANK by LTV, SELECT top 10 with YoY change

---

## Course 05 — Practical Assignment

### Title: SQL Analytics on NYC Taxi Data

**Dataset:** NYC TLC Trip Record Data (Parquet format)

**Requirements:**
1. Set up DuckDB in Python and query the Parquet files directly
2. Answer 10+ business questions using SQL (examples: busiest hours, average trip distance by borough, revenue by payment type)
3. Write at least 3 queries using CTEs
4. Write at least 2 queries using window functions
5. Write one dbt model that creates a clean analytical layer from the raw data
6. Identify one slow query, run `EXPLAIN` on it, and propose an optimization
7. Connect Python + SQL: export one query result to Pandas and visualize with Seaborn

**Deliverables:**
- DuckDB Python notebook with 10+ business question queries
- One dbt model `.sql` file
- EXPLAIN output analysis (written commentary)
- One visualization from the SQL results

**Grading Rubric:**

| Category | Points |
|----------|--------|
| 10+ business question queries (correct results) | 25 |
| CTE usage (3+) | 15 |
| Window function usage (2+) | 15 |
| dbt model (correct syntax, runs) | 20 |
| EXPLAIN analysis | 10 |
| Python-SQL integration + visualization | 15 |
| **Total** | **100** |

---

---

# COURSE 06 — Exploratory Data Analysis & Feature Engineering

---

## Module 6.1 — The EDA Framework & Profiling Tools

### Module 6.1 Quiz

**Q1. [Multiple Choice — Beginner]**
The 5-phase EDA framework begins with which step?

A) Visualize distributions  
B) Understand the domain and dataset context  
C) Train a baseline model  
D) Remove outliers  

**Q2. [Code Interpretation — Intermediate]**
What does this code produce and why is it valuable before any EDA?

```python
from ydata_profiling import ProfileReport
profile = ProfileReport(df, title="Dataset Report", explorative=True)
profile.to_file("profile_report.html")
```

**Q3. [Scenario-Based — Advanced]**
A new dataset arrives containing customer transactions. Before writing a single line of analysis code, what are the 5 most important questions you would ask about this dataset?

---

### Answer Key — Module 6.1

**Q1: B**  
*Understanding domain context first prevents misinterpretation. Knowing what each column represents, what the data was collected for, and what business question you're answering determines every subsequent analytical choice.*

**Q2:**  
*Generates a comprehensive HTML profiling report automatically covering: data types, missing value counts, distributions, correlations, duplicate rows, and outliers for every column. It replaces 30-40 minutes of manual profiling code with a single function call. Valuable as a first look to identify issues before deep analysis.*

**Q3:**  
*1. What is the unit of analysis? (Is each row a transaction, a customer, or a session?)*  
*2. What is the time period covered? Are there gaps?*  
*3. What does each column represent, and how was it collected?*  
*4. What is the target variable for modeling (if any)?*  
*5. Are there known data quality issues, exclusions, or sampling biases in this dataset?*

---

## Module 6.2 — Univariate & Bivariate Analysis

### Module 6.2 Quiz

**Q1. [Multiple Choice — Beginner]**
Which visualization is most appropriate for exploring the relationship between a numerical variable and a categorical variable?

A) Scatter plot  
B) Box plot or violin plot  
C) Line chart  
D) Pie chart  

**Q2. [Data Interpretation — Intermediate]**
A histogram of `loan_amount` shows strong right skew with most values below $50,000 but a long tail extending to $500,000. What preprocessing step might improve model performance?

**Q3. [Scenario-Based — Advanced]**
You are analyzing whether `income` and `credit_score` are related. Describe the full bivariate analysis approach: what plot(s) you'd use, what statistic(s) you'd compute, and what interpretation you'd make for each possible pattern (strong positive, no relationship, nonlinear).

---

### Answer Key — Module 6.2

**Q1: B**  
*Box plots and violin plots show the distribution (median, IQR, outliers) of a numerical variable for each category. Scatter plots require two continuous variables. Line charts imply continuity.*

**Q2:**  
*Log transformation: `np.log1p(df["loan_amount"])` compresses the right tail. Log-transforming right-skewed features often improves the performance of linear models and neural networks that assume approximate normality, while having minimal effect on tree-based models.*

**Q3:**  
*Plot: Scatter plot of income vs. credit_score, colored by a third variable if available. Add a regression line and confidence band.*  
*Statistics: Pearson correlation (linear), Spearman correlation (monotonic/ordinal), scatter plot for visual pattern.*  
*Strong positive (r > 0.7): Higher income tends to come with higher credit score. Strong linear relationship. Good candidate for feature inclusion; may have multicollinearity with other financial features.*  
*No relationship (r ≈ 0): Income does not linearly predict credit score — but check for nonlinear patterns in the scatter plot.*  
*Nonlinear: A U-shape or step pattern. Pearson correlation would be near 0 but scatter shows structure. Consider binning income or using a nonlinear model.*

---

## Module 6.3 — Handling Missing Data & Outliers

### Module 6.3 Quiz

**Q1. [Multiple Choice — Beginner]**
"Missing Completely at Random" (MCAR) means:

A) Data is missing because of the values in other columns  
B) The probability of missing is unrelated to any observed or unobserved data  
C) The missing data follows a specific pattern  
D) All missing values can be imputed with the mean  

**Q2. [Scenario-Based — Intermediate]**
In a salary dataset, senior employees have their salary recorded but junior employees have NULL in the `bonus` column. Is this MCAR, MAR, or MNAR? What is the appropriate handling strategy?

**Q3. [Code Interpretation — Advanced]**
What does this code do, and when is this approach preferable to mean/median imputation?

```python
from sklearn.impute import KNNImputer
imputer = KNNImputer(n_neighbors=5)
df_imputed = pd.DataFrame(imputer.fit_transform(df), columns=df.columns)
```

---

### Answer Key — Module 6.3

**Q1: B**  
*MCAR: missingness is purely random — unrelated to the data itself or other variables. Can safely use mean/median imputation or drop rows with minimal bias.*

**Q2:**  
*This is **MAR (Missing at Random)**: the missingness in `bonus` depends on a known observed variable (`seniority` or `job_level`). It's not MCAR because junior status predicts missingness. It might also be MNAR if the most junior employees with the LOWEST performance have no bonus recorded (missing related to the unobserved bonus value itself).*  
*Strategy: Impute using seniority group median (group by job_level, fill missing bonus with group median). Or add a binary indicator column `has_bonus` (0/1) which itself becomes a predictive feature.*

**Q3:**  
*KNN imputation replaces each missing value with the weighted average of the k nearest neighbors' values for that feature. Preferable to mean/median when: features are correlated (nearby points share structure), the dataset is not too large (KNN is O(n²)), and you want to preserve local data structure. Mean imputation is faster but ignores inter-feature relationships.*

---

## Module 6.4 — Feature Engineering

### Module 6.4 Quiz

**Q1. [Multiple Choice — Beginner]**
From a `purchase_datetime` column, which engineered feature would most help a model predict weekend shopping patterns?

A) Year extracted from date  
B) Day of week (0=Monday, 6=Sunday)  
C) Hour of day  
D) Month number  

**Q2. [Scenario-Based — Intermediate]**
A dataset has columns `gross_revenue` and `total_cost`. What interaction feature would you create and why?

**Q3. [Code Interpretation — Advanced]**
This code transforms a skewed feature. What does it do and why is `log1p` used instead of `log`?

```python
df["log_price"] = np.log1p(df["price"])
```

---

### Answer Key — Module 6.4

**Q1: B — Day of week**  
*Day of week (is_weekend = 1 if day >= 5) most directly captures weekend shopping patterns. Year captures trends, hour captures time-of-day patterns.*

**Q2:**  
*`profit_margin = (gross_revenue - total_cost) / gross_revenue`. An interaction (ratio) feature that captures the relative profitability. Either value alone doesn't convey whether the business is profitable at scale. High revenue with high costs can mean lower margin than moderate revenue with low costs.*

**Q3:**  
*`np.log1p(x)` computes `log(1 + x)`, which is mathematically equivalent to `log(x)` for large values but handles `x = 0` without producing `-infinity`. Plain `np.log(0) = -inf`, which would introduce infinite values into the dataset and break any model. `log1p` is the safe choice for non-negative data that may contain zeros.*

---

## Module 6.5 — Encoding & Scaling

### Module 6.5 Quiz

**Q1. [Multiple Choice — Beginner]**
Why is One-Hot Encoding preferred over Label Encoding for nominal categorical variables in linear models?

A) One-Hot Encoding is faster  
B) Label Encoding implies a false ordinal relationship (e.g., 'Red'=1 < 'Blue'=2) that the model treats as numerical magnitude  
C) Label Encoding requires more memory  
D) One-Hot Encoding always produces better model accuracy  

**Q2. [Multiple Choice — Intermediate]**
You have a categorical column `city` with 500 unique values in a dataset of 10,000 rows. One-Hot Encoding would create 500 new columns. What encoding strategy is more appropriate?

A) Label Encoding B) Target Encoding C) Binary Encoding D) No encoding needed

**Q3. [Scenario-Based — Advanced]**
A K-Nearest Neighbors model is trained on a dataset with two features: `age` (range 20–80) and `income` (range 20,000–200,000). Without scaling, income will dominate the distance calculation. Which scaler should you use, and what transformation does it apply?

---

### Answer Key — Module 6.5

**Q1: B**  
*Nominal categories (color, city, department) have no inherent order. Label Encoding (Red=1, Blue=2, Green=3) implies Blue is "twice Red" and Green is "between Red and Blue" — nonsense for a linear model that treats these as real numbers. OHE creates binary columns, making each category orthogonal.*

**Q2: C or B — Binary Encoding or Target Encoding**  
*500 OHE columns from 500 cities would cause the "curse of dimensionality" and high sparsity. Binary Encoding represents 500 categories in log₂(500) ≈ 9 columns. Target Encoding replaces each category with the mean target value — compact and often powerful, but requires careful out-of-fold computation to avoid leakage.*

**Q3:**  
*StandardScaler (zero mean, unit variance): `(x - mean) / std`. After scaling, `age` and `income` both have mean ≈ 0 and std = 1 — equal contribution to Euclidean distance. Alternatively, MinMaxScaler scales to [0, 1]. StandardScaler is generally preferred when you don't know the distribution shape.*

---

## Module 6.6 — Feature Selection Methods

### Module 6.6 Quiz

**Q1. [Multiple Choice — Beginner]**
The "curse of dimensionality" refers to:

A) The difficulty of visualizing more than 3 dimensions  
B) The problem where model performance degrades and data becomes increasingly sparse as the number of features grows  
C) The computational cost of training on large datasets  
D) The requirement for more training data when using ensemble methods  

**Q2. [Code Interpretation — Intermediate]**
What does this code do?

```python
from sklearn.feature_selection import SelectKBest, f_classif
selector = SelectKBest(score_func=f_classif, k=20)
X_selected = selector.fit_transform(X_train, y_train)
selected_features = X.columns[selector.get_support()]
```

**Q3. [Scenario-Based — Intermediate]**
You train a Random Forest on a dataset with 50 features. After checking `feature_importances_`, you see that 35 features have importance scores below 0.005. What action do you take and why might simple Gini importance be misleading?

**Q4. [Multiple Choice — Advanced]**
Recursive Feature Elimination (RFE) works by:

A) Randomly removing features and checking model performance  
B) Training a model, removing the least important feature, retraining, and repeating until the desired number of features remains  
C) Using correlation to select features before training  
D) Adding features one at a time (forward selection)  

**Q5. [Scenario-Based — Advanced]**
You are preparing features for a customer churn prediction model. You have 80 features, some are correlated (r > 0.95), some have low variance, and a few were engineered by domain experts. Design a feature selection workflow using at least 3 different methods.

---

### Answer Key — Module 6.6

**Q1: B**  
*As dimensionality increases, the volume of feature space grows exponentially. Data becomes increasingly sparse — distance metrics lose meaning, models require exponentially more data to generalize, and spurious correlations multiply.*

**Q2:**  
*Applies univariate ANOVA F-test (`f_classif`) to score each feature's relationship with the target, then selects the top 20 highest-scoring features. Returns the filtered feature matrix and the names of selected features.*

**Q3:**  
*Action: Consider training with only the top 15 features (remove the 35 low-importance ones) and compare cross-validation AUC.*  
*Why Gini importance is misleading: (1) It systematically favors high-cardinality features (more splits possible). (2) It measures performance on training data, not generalization. Preferred alternative: **permutation importance** on a holdout set — shuffles each feature and measures the drop in model score.*

**Q4: B**  
*RFE is a backward elimination wrapper method. It trains a model (usually a linear model or tree), uses its importance scores to rank features, removes the weakest, and repeats. Computationally expensive but thorough.*

**Q5:**  
*Step 1 — Filter: Remove near-zero variance features (`VarianceThreshold`). Remove features with correlation > 0.95 with each other (keep one from each pair).*  
*Step 2 — Univariate: Apply `SelectKBest` with mutual information score to identify top candidates.*  
*Step 3 — Embedded: Train a Lasso regression or Random Forest with the remaining features; use `SelectFromModel` to threshold by coefficient or importance.*  
*Step 4 — Expert knowledge override: Never remove a feature the domain expert says is theoretically important, even if the model de-prioritizes it — validate with permutation importance first.*

---

# COURSE 06 — End-of-Course Assessment (25 Questions)

**Q1.** [MCQ] Which phase of EDA involves asking "is this a MCAR, MAR, or MNAR missing data pattern?"
A) Profile B) Clean C) Explore D) Communicate

**Q2.** [T/F] Sweetviz is specifically designed to compare two DataFrames (e.g., train vs. test) side by side.

**Q3.** [MCQ] A feature with all values equal to 1 (zero variance) should be:
A) One-hot encoded B) Log-transformed C) Removed D) Mean-imputed

**Q4.** [Short Answer] What is target leakage in feature engineering and give an example?

**Q5.** [MCQ] RobustScaler is preferred over StandardScaler when:
A) The feature is categorical B) The feature has many outliers C) The feature is normally distributed D) The feature has high cardinality

**Q6.** [Code] What does `df.corr().abs().unstack().sort_values(ascending=False)` find?

**Q7.** [T/F] Log transformation requires the feature to have no zero values (use log1p for zero-containing data).

**Q8.** [MCQ] Permutation importance differs from Gini importance in that it:
A) Is faster to compute B) Measures feature impact on a test set by shuffling C) Uses Bayesian methods D) Only works for linear models

**Q9.** [Short Answer] What is the "dummy variable trap" in OHE, and how is it avoided?

**Q10.** [MCQ] For a classification problem with 10 classes, how many binary columns does OHE produce?
A) 10 B) 9 (drop one) C) Either 9 or 10 depending on implementation D) log₂(10) ≈ 3

**Q11.** [T/F] `ydata-profiling` ProfileReport can be generated on both Pandas DataFrames and Spark DataFrames.

**Q12.** [Scenario] A column `zip_code` has 30,000 unique values. OHE would create 30,000 columns. What two alternative feature engineering approaches would be more practical?

**Q13.** [MCQ] Adding polynomial features (degree=2) to a dataset with 10 features produces how many features?
A) 20 B) 55 (including interactions) C) 100 D) 10

**Q14.** [T/F] Feature selection should be performed AFTER the train/test split, using only training data, to prevent information leakage.

**Q15.** [MCQ] Which method is most appropriate for imputing missing values in a column where missingness correlates with another observed column?
A) Mean imputation B) KNN imputation using related features C) Delete the column D) Replace with mode

**Q16.** [Code] What does `df.skew()` return and what threshold suggests action?

**Q17.** [Short Answer] Explain the IQR method for outlier detection.

**Q18.** [MCQ] In a churn dataset, the feature `days_since_last_login` is strongly correlated (r=0.98) with `days_since_last_purchase`. You should:
A) Keep both B) Remove one, keeping the more domain-relevant C) Average them D) Apply PCA only to these two

**Q19.** [T/F] `MNAR` missingness can be addressed by simply imputing with the median.

**Q20.** [Scenario] Create two date-based features from a `signup_date` column that would improve a model predicting user retention.

**Q21.** [MCQ] Target encoding should be applied using:
A) The full dataset B) Only the test set C) Out-of-fold averages on training data to prevent leakage D) Only validation set

**Q22.** [Short Answer] What is the difference between univariate and multivariate feature selection?

**Q23.** [T/F] SMOTE (covered in Course 07) is a feature engineering technique.

**Q24.** [MCQ] The `SelectFromModel` class in sklearn:
A) Trains a model for you B) Uses a fitted model's feature importances to select features above a threshold C) Randomly selects features D) Only works with linear models

**Q25.** [Scenario-Advanced] You receive a financial dataset with 150 features. The target is 90-day loan default. Describe a complete EDA and feature engineering pipeline you would apply before handing this to a model.

---

### Answer Key — Course 06

Q1:B | Q2:True | Q3:C | Q4: Target leakage = including information in features that would not be available at prediction time. Example: using `claim_approved` to predict `claim_filed` — the outcome already implies the event | Q5:B | Q6: Finds all pairwise absolute correlations, sorted from highest to lowest — reveals the most correlated feature pairs | Q7:True | Q8:B | Q9: With k binary OHE columns, one is redundant (determined by the others); drop one per group to avoid perfect multicollinearity — `drop_first=True` in pd.get_dummies() | Q10:C | Q11:True | Q12:(1) Target encoding (replace zip with mean target value per zip); (2) Group zip codes by geographic hierarchy (state, region) and encode at that level | Q13:B (n*(n+1)/2 + n for degree=2) | Q14:True | Q15:B | Q16: Skewness values per column; |skew|>1 typically suggests log transform | Q17: IQR = Q3-Q1; lower fence = Q1-1.5×IQR; upper fence = Q3+1.5×IQR; values outside are flagged as outliers | Q18:B | Q19:False (MNAR requires understanding WHY data is missing — the missingness relates to the value itself; imputing ignores this structure and introduces bias) | Q20: `days_since_signup` (longer tenure = more loyal) and `signup_day_of_week` or `signup_month` (seasonal patterns) | Q21:C | Q22: Univariate selects features based on their individual relationship with the target (ignores interactions); multivariate considers features jointly (accounts for redundancy and interactions) | Q23:False (SMOTE is a class imbalance handling technique, not feature engineering) | Q24:B | Q25: Profile with ydata-profiling → check missing patterns → clean/impute → analyze target distribution (imbalanced?) → univariate analysis per feature → bivariate analysis with target → engineer date features, log-transform skewed numerical → encode categoricals (target encoding for high-cardinality) → remove zero-variance/near-duplicate features → permutation importance on a simple model → finalize top 50 features

---

## Course 06 — Practical Assignment

### Title: EDA on a Real-World Dataset

**Dataset:** Airbnb Open Data (insideairbnb.com) or US Census Income Data

**Requirements:**
1. Generate a ydata-profiling report
2. Document all data quality issues and resolution strategy
3. Perform univariate analysis on 5 key variables (distribution, skew, outliers)
4. Perform bivariate analysis on 5 pairs of variables (appropriate charts + correlation)
5. Engineer at least 5 new features with business justification for each
6. Apply appropriate encoding to all categorical features
7. Scale numerical features using an appropriate method; justify choice
8. Conduct feature selection: filter method + embedded method; compare which features are selected by each
9. Write findings as a professional analytical narrative (500+ words)

**Rubric:**

| Category | Points |
|----------|--------|
| Profiling report + issue documentation | 10 |
| Univariate analysis (5 features) | 15 |
| Bivariate analysis (5 pairs) | 15 |
| Feature engineering (5+ features, justified) | 20 |
| Encoding and scaling | 10 |
| Feature selection (2 methods) | 15 |
| Analytical narrative | 15 |
| **Total** | **100** |

---

---

# COURSE 07 — Machine Learning Fundamentals

---

## Module 7.1 — The Machine Learning Workflow

### Module 7.1 Quiz

**Q1. [Multiple Choice — Beginner]**
In the ML pipeline, what is the correct order?

A) Train → Define Problem → Collect Data → Evaluate  
B) Define Problem → Collect Data → Preprocess → Train → Evaluate → Deploy  
C) Preprocess → Collect Data → Define Problem → Train  
D) Collect Data → Train → Preprocess → Evaluate  

**Q2. [True/False — Beginner]**
A model that achieves 99% accuracy on training data but 60% on test data is likely underfitting.

**Q3. [Multiple Choice — Intermediate]**
The bias-variance tradeoff states:

A) High bias models are too complex; high variance models are too simple  
B) High bias models underfit (too simple); high variance models overfit (too complex)  
C) You can simultaneously minimize both bias and variance  
D) Bias only affects training accuracy; variance only affects test accuracy  

**Q4. [Scenario-Based — Advanced]**
A fraud detection model is trained and evaluated. Training accuracy is 98.5%; test accuracy is 97.8%. However, of the 0.5% actual fraud cases in test data, the model only catches 12%.

(a) What two problems are present here?  
(b) Why is accuracy a misleading metric in this context?  
(c) What metrics should be used instead?  

---

### Answer Key — Module 7.1

**Q1: B**  
*The ML workflow always begins with problem definition (what are we predicting? what's the business objective?), then data collection, preprocessing, training, evaluation, and deployment/iteration.*

**Q2: False**  
*This is **overfitting** (high variance), not underfitting. The model memorized the training data but generalizes poorly. Underfitting = low training AND test accuracy.*

**Q3: B**  
*High bias = oversimplified model (e.g., linear model for non-linear data) = underfitting. High variance = overcomplicated model = overfitting. The tradeoff is that reducing one often increases the other.*

**Q4:**  
*(a) (1) **Class imbalance**: with 0.5% fraud rate, the model predicts "not fraud" for almost everything and still gets 99.5% accuracy. (2) **Failure to detect fraud**: 12% recall on fraud (the actual target class) is catastrophically low for a fraud system.*  
*(b) Accuracy is misleading because a trivial model predicting "not fraud" for all transactions achieves 99.5% accuracy with zero business value.*  
*(c) Use: **Recall** (maximize fraud detection), **Precision** (minimize false alarms), **F1-score** (balance), **PR-AUC** (area under Precision-Recall curve), and **cost-weighted metrics** (cost of missed fraud >> cost of false alarm).*

---

## Module 7.2 — Linear Regression

### Module 7.2 Quiz

**Q1. [Multiple Choice — Beginner]**
What does the R² (coefficient of determination) measure?

A) The average prediction error  
B) The proportion of variance in the target explained by the model  
C) The slope of the regression line  
D) The correlation between two features  

**Q2. [Code Interpretation — Intermediate]**
You fit a linear regression and get these coefficients:
`intercept = 5000, age = 800, years_experience = 1200, has_degree = 15000`

Interpret the coefficient for `years_experience = 1200` in a salary prediction model.

**Q3. [Multiple Choice — Intermediate]**
The key difference between Ridge and Lasso regression is:

A) Ridge is faster; Lasso is more accurate  
B) Lasso can reduce coefficients to exactly zero (feature selection); Ridge shrinks coefficients but never to zero  
C) Ridge works for classification; Lasso for regression  
D) They are identical with different names  

**Q4. [Scenario-Based — Advanced]**
You build a linear regression to predict house prices. The residual plot shows a clear U-shape (not random). What does this tell you about the model and what would you do?

---

### Answer Key — Module 7.2

**Q1: B**  
*R² = 0 means the model explains no variance (as bad as predicting the mean). R² = 1 means perfect predictions. R² = 0.82 means 82% of target variance is explained by the model.*

**Q2:**  
*All else equal, each additional year of experience is associated with a $1,200 increase in predicted salary. Coefficients represent the marginal effect of a one-unit increase in that feature, holding all other features constant (ceteris paribus).*

**Q3: B**  
*Lasso (L1) regularization penalizes the absolute value of coefficients, forcing some to exactly zero — performing implicit feature selection. Ridge (L2) penalizes squared coefficients, shrinking all toward zero but never reaching it. Lasso is preferred when you believe many features are irrelevant; Ridge when most features contribute.*

**Q4:**  
*A U-shaped residual plot indicates a **nonlinear relationship** — the linear model systematically underpredicts for low and high house prices and overpredicts for mid-range. Actions: (1) Add polynomial features (e.g., `size²`). (2) Log-transform the target variable. (3) Switch to a nonlinear model (tree-based). The model is misspecified — it's the wrong functional form.*

---

## Module 7.3 — Classification Algorithms

### Module 7.3 Quiz

**Q1. [Multiple Choice — Beginner]**
Which metric measures the proportion of actual positives correctly identified?

A) Precision B) Recall (Sensitivity) C) Accuracy D) F1-score

**Q2. [Code Interpretation — Intermediate]**
Given a confusion matrix where:
- True Positive (TP) = 85
- False Positive (FP) = 15
- False Negative (FN) = 30
- True Negative (TN) = 870

Calculate: Precision, Recall, and F1-score.

**Q3. [Scenario-Based — Intermediate]**
For a spam filter, which is a worse error: (a) flagging a legitimate email as spam, or (b) letting a spam email through? How does your answer affect whether you optimize for Precision or Recall?

**Q4. [Multiple Choice — Advanced]**
The AUC-ROC curve measures:

A) The model's accuracy across all threshold settings  
B) The model's ability to distinguish between classes across all decision thresholds — higher AUC = better discrimination  
C) The optimal threshold for the model  
D) The precision at 50% threshold  

---

### Answer Key — Module 7.3

**Q1: B — Recall**  
*Recall = TP / (TP + FN). Of all actual positives, how many did we catch? Also called Sensitivity or True Positive Rate.*

**Q2:**  
*Precision = TP / (TP + FP) = 85 / (85+15) = **0.85***  
*Recall = TP / (TP + FN) = 85 / (85+30) = **0.739***  
*F1 = 2 × (Precision × Recall) / (Precision + Recall) = 2 × (0.85 × 0.739) / (0.85 + 0.739) = **0.790***

**Q3:**  
*(a) False negative (spam gets through): Mild annoyance. (b) False positive (legitimate email flagged as spam): High harm — user misses important emails.*  
*Therefore: Optimize for **high Recall on legitimate email** (low false positives). In other words, optimize Precision on the spam class. A spam filter that accidentally blocks legitimate email is worse than one that occasionally lets spam through.*

**Q4: B**  
*AUC (Area Under the ROC Curve) ranges from 0.5 (random classifier) to 1.0 (perfect). It measures discrimination ability independent of threshold choice. An AUC of 0.9 means: given a random positive and a random negative, the model correctly ranks the positive higher 90% of the time.*

---

## Module 7.4 — Model Evaluation & Cross-Validation

### Module 7.4 Quiz

**Q1. [Multiple Choice — Beginner]**
Why is K-Fold cross-validation preferable to a single train/test split for model evaluation?

A) It is faster to compute  
B) It provides a more reliable estimate of model performance by evaluating on k different test sets and averaging  
C) It prevents overfitting automatically  
D) It removes the need for a test set  

**Q2. [True/False — Intermediate]**
When using `GridSearchCV` for hyperparameter tuning, you should perform the hyperparameter search on the test set.

**Q3. [Code Interpretation — Advanced]**
What does this code do, and why is `StratifiedKFold` used instead of `KFold`?

```python
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.ensemble import RandomForestClassifier

skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(
    RandomForestClassifier(n_estimators=100),
    X, y, cv=skf, scoring="roc_auc"
)
print(f"AUC: {scores.mean():.3f} ± {scores.std():.3f}")
```

---

### Answer Key — Module 7.4

**Q1: B**  
*Single splits produce noisy estimates that depend heavily on which data happened to land in test. K-Fold uses k different splits, evaluates on each, and averages — giving a more stable, less biased estimate of generalization performance.*

**Q2: False**  
*Performing hyperparameter search on the test set contaminates it — you are now implicitly optimizing on the test set, so it no longer provides an unbiased estimate of generalization. Use a separate validation set or cross-validation on training data for tuning; keep the test set completely untouched until final evaluation.*

**Q3:**  
*Evaluates a Random Forest using 5-fold stratified cross-validation, scoring by ROC-AUC. Reports mean ± standard deviation of AUC across folds.*  
*`StratifiedKFold` is used instead of `KFold` because it ensures each fold has the same class proportion as the full dataset. Without stratification, a small class could be entirely absent from some folds, making evaluation unreliable.*

---

## Module 7.5 — Unsupervised Learning & Dimensionality Reduction

### Module 7.5 Quiz

**Q1. [Multiple Choice — Beginner]**
K-Means clustering requires the user to specify which parameter in advance?

A) The cluster centroids B) The number of clusters (K) C) The distance metric D) The maximum iterations

**Q2. [Code Interpretation — Intermediate]**
What does the "elbow method" for K-Means show?

```python
inertias = []
for k in range(1, 11):
    km = KMeans(n_clusters=k, random_state=42)
    km.fit(X)
    inertias.append(km.inertia_)
plt.plot(range(1, 11), inertias, "bo-")
```

**Q3. [Multiple Choice — Intermediate]**
DBSCAN differs from K-Means in that:

A) DBSCAN requires you to specify K clusters in advance  
B) DBSCAN can find arbitrarily shaped clusters and identifies noise/outlier points  
C) DBSCAN only works on 2D data  
D) DBSCAN is faster than K-Means  

**Q4. [Scenario-Based — Advanced]**
You have a dataset with 1000 features for customer segmentation. Explain why you should apply PCA or UMAP before K-Means clustering, and what information is lost in the process.

---

### Answer Key — Module 7.5

**Q1: B**  
*K-Means requires K (number of clusters) as a hyperparameter. This is a key limitation — the user must specify or discover the optimal K using methods like the elbow method or silhouette score.*

**Q2:**  
*Each point shows the total within-cluster sum of squares (inertia) for that value of K. As K increases, inertia decreases (more clusters = smaller, tighter). The "elbow" — where the rate of decrease levels off sharply — suggests the optimal K. Beyond the elbow, adding clusters produces diminishing returns.*

**Q3: B**  
*DBSCAN (Density-Based Spatial Clustering of Applications with Noise) groups points based on density, can find non-spherical clusters (circles, crescents), and explicitly labels low-density points as noise (-1). K-Means forces spherical, equal-variance clusters and assigns every point to a cluster.*

**Q4:**  
*1000 features = extreme curse of dimensionality. In high dimensions, all distances become approximately equal (the concentration of measure phenomenon), making K-Means ineffective — it cannot distinguish "similar" from "different" meaningfully.*  
*PCA: Reduces to the most variance-explaining components (say, 50 dimensions). Fast, linear. Information lost: variance in the discarded components (typically noise or redundant directions).*  
*UMAP: Nonlinear dimensionality reduction, better at preserving cluster structure for visualization (2D). But UMAP's 2D representation is not suitable as input features for downstream tasks — use PCA/t-SVD for that.*

---

## Module 7.6 — Scikit-Learn Pipelines & Preprocessing

### Module 7.6 Quiz

**Q1. [Multiple Choice — Beginner]**
The primary purpose of a Scikit-Learn `Pipeline` is:

A) To speed up model training  
B) To chain preprocessing steps and a model into a single object that prevents data leakage  
C) To parallelize cross-validation  
D) To automatically select the best model  

**Q2. [Code Interpretation — Intermediate]**
What does this Pipeline do, and why is it safer than applying transformations manually?

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("clf", LogisticRegression())
])
pipe.fit(X_train, y_train)
pipe.predict(X_test)
```

**Q3. [Scenario-Based — Advanced]**
A data scientist applies `StandardScaler` to the entire dataset before splitting into train/test, then uses the scaled data for cross-validation. What data leakage has occurred, and how should it be fixed?

---

### Answer Key — Module 7.6

**Q1: B**  
*Pipelines prevent data leakage by fitting transformations only on training data. When used with cross-validation, the Pipeline ensures scaling parameters (mean, std) are computed from each fold's training portion only, not from validation data.*

**Q2:**  
*Applies StandardScaler (fit on X_train, transform X_train) then trains Logistic Regression. When predicting, applies the SAME scaler (fitted on training) to X_test. Safer because: (1) Test data never influences the scaling. (2) Deployment is simple — `pipe.predict(new_data)` applies the full preprocessing + prediction in one call.*

**Q3:**  
*Leakage: Fitting StandardScaler on the entire dataset (including what becomes the test set) means the scaler's mean and std include information from the test data. When the same "test" data is later evaluated, it has indirectly influenced its own preprocessing parameters. In cross-validation, this means each fold's "validation" data influenced the scaler.*  
*Fix: Always put the scaler inside a Pipeline, then pass the Pipeline to `cross_val_score`. The Pipeline will fit the scaler only on each fold's training portion.*

---

## Module 7.7 — Imbalanced Data Handling

### Module 7.7 Quiz

**Q1. [Multiple Choice — Beginner]**
A credit card fraud dataset has 99,850 legitimate transactions and 150 fraud cases. A model that predicts "legitimate" for every single transaction would achieve what accuracy?

A) 50% B) 99.85% C) 0.15% D) 15%

**Q2. [True/False — Intermediate]**
SMOTE (Synthetic Minority Oversampling Technique) creates exact duplicates of minority class samples.

**Q3. [Code Interpretation — Intermediate]**
What does `class_weight="balanced"` do in a Logistic Regression classifier?

```python
from sklearn.linear_model import LogisticRegression
model = LogisticRegression(class_weight="balanced")
```

**Q4. [Scenario-Based — Advanced]**
You are training a model to detect sepsis from ICU patient data. Only 5% of patients develop sepsis. A senior clinician says: "I need to catch at least 90% of sepsis cases — I can tolerate some false alarms."

(a) Which metric should you primarily optimize?  
(b) Should you use SMOTE, class_weight, or threshold tuning? Justify each choice.  
(c) At what classification threshold might you set the model?  

---

### Answer Key — Module 7.7

**Q1: B — 99.85%**  
*A naive "always predict negative" classifier achieves 99.85% accuracy but catches 0% of fraud. This illustrates why accuracy is a completely meaningless metric for imbalanced classification.*

**Q2: False**  
*SMOTE creates **synthetic** new minority class samples by interpolating between existing minority class points in feature space. It does NOT create exact duplicates (that would be simple oversampling). New points are created along the line segments connecting nearby minority class neighbors.*

**Q3:**  
*`class_weight="balanced"` automatically adjusts the penalty for misclassification inversely proportional to class frequencies. Minority class samples are weighted more heavily, effectively making the model pay more attention to correctly classifying rare examples. This is the simplest way to address imbalance without changing the dataset.*

**Q4:**  
*(a) Optimize **Recall** (sensitivity) for the sepsis class. The clinician explicitly states 90% detection rate requirement (recall = 0.90) with tolerance for false alarms (lower precision acceptable).*  
*(b) All three are applicable:*  
*- `class_weight="balanced"`: simplest starting point*  
*- SMOTE: appropriate if training data is small; creates more sepsis training examples*  
*- Threshold tuning: essential. With a probabilistic model, lower the threshold from 0.5 to ~0.2 so more cases are flagged as sepsis. Construct the PR curve and pick the threshold where recall = 0.90.*  
*(c) Find the threshold where recall ≈ 0.90 on validation data using: `precision_recall_curve()`, then select the threshold where recall first exceeds 0.90.*

---

## Module 7.8 — Anomaly Detection

### Module 7.8 Quiz

**Q1. [Multiple Choice — Beginner]**
Anomaly detection differs from classification in that:

A) Anomaly detection is always faster  
B) Anomaly detection is typically unsupervised — you don't have labeled examples of anomalies to train on  
C) Anomaly detection only works on time series  
D) Anomaly detection cannot use machine learning  

**Q2. [Code Interpretation — Intermediate]**
What does `contamination=0.05` mean in this code?

```python
from sklearn.ensemble import IsolationForest
iso = IsolationForest(contamination=0.05, random_state=42)
iso.fit(X)
predictions = iso.predict(X)  # -1 = anomaly, 1 = normal
```

**Q3. [Scenario-Based — Advanced]**
You are monitoring network traffic for intrusions. You decide to use Local Outlier Factor (LOF) instead of Isolation Forest. In what scenario would LOF be more appropriate, and what is LOF's key limitation for production systems?

---

### Answer Key — Module 7.8

**Q1: B**  
*In most real-world anomaly detection scenarios (fraud, equipment failure, intrusion), you have abundant normal data but few or no labeled anomalies. Supervised classification requires labeled examples of both classes. Isolation Forest and LOF learn the "normal" distribution from unlabeled data and flag deviations.*

**Q2:**  
*`contamination=0.05` tells the algorithm to expect approximately 5% of the data to be anomalies. This sets the decision threshold: the algorithm will label roughly 5% of training points as anomalies (-1) and 95% as normal (1). If you don't know the actual contamination rate, start with 0.01–0.05 and tune based on operational requirements.*

**Q3:**  
*LOF is more appropriate when anomalies are **local** — a point that is normal in one region of the feature space might be anomalous in another (density varies). For example, in a city with varied neighborhoods, a "medium-priced" house is normal downtown but anomalous in a very cheap suburb. LOF detects points that have lower local density than their neighbors.*  
*LOF's key limitation: It is a **transductive** method — it cannot predict whether new, unseen data points are anomalies without rerunning on the full dataset. For production (streaming data), Isolation Forest is preferred because it is inductive (you fit once and call `predict()` on new points).*

---

# COURSE 07 — End-of-Course Assessment
## Machine Learning Fundamentals (40 Questions)

**Q1.** [MCQ] A learning curve shows training score ≈ validation score, both low. This indicates:
A) Overfitting B) Underfitting C) Good fit D) Data leakage

**Q2.** [T/F] Linear regression assumes the relationship between features and target is linear.

**Q3.** [MCQ] The penalty term in Lasso regression is proportional to:
A) Sum of squared coefficients B) Sum of absolute values of coefficients C) Number of features D) MSE of predictions

**Q4.** [Code] This code has data leakage. Identify it:
```python
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y)
```

**Q5.** [MCQ] Which algorithm handles non-linear decision boundaries natively without kernel tricks?
A) Logistic Regression B) SVM with linear kernel C) Decision Tree D) Ridge Regression

**Q6.** [T/F] K-Means requires the data to be scaled because it uses Euclidean distance.

**Q7.** [MCQ] DBSCAN's `eps` parameter defines:
A) Number of clusters B) Minimum points to form a cluster C) Radius defining neighborhood D) Distance from centroid

**Q8.** [Short Answer] Explain precision vs. recall tradeoff in a medical diagnostic test scenario.

**Q9.** [MCQ] Which cross-validation strategy is appropriate when time ordering matters (e.g., stock prices)?
A) KFold B) StratifiedKFold C) TimeSeriesSplit D) LeaveOneOut

**Q10.** [T/F] SMOTE should be applied after the train/test split, only to training data.

**Q11.** [Code Interpretation] What does this ROC analysis reveal?
```python
from sklearn.metrics import roc_auc_score
auc = roc_auc_score(y_test, model.predict_proba(X_test)[:, 1])
# Output: 0.52
```

**Q12.** [MCQ] Permutation importance vs. tree feature importance: which is more reliable and why?
A) Tree importance (faster) B) Permutation importance (model-agnostic, test-set based) C) They are identical D) Both unreliable

**Q13.** [Scenario] A Random Forest achieves 97% training accuracy and 72% test accuracy. What three steps would you try to improve generalization?

**Q14.** [MCQ] PCA's principal components are:
A) The features with highest variance B) Orthogonal directions of maximum variance in the data C) The most correlated feature pairs D) The features most correlated with the target

**Q15.** [T/F] A Decision Tree with `max_depth=None` will always overfit.

**Q16.** [MCQ] GridSearchCV with 5-fold CV and 20 hyperparameter combinations trains how many models?
A) 20 B) 25 C) 100 D) 5

**Q17.** [Short Answer] What is the difference between `predict()` and `predict_proba()` in sklearn classifiers?

**Q18.** [MCQ] Isolation Forest detects anomalies by:
A) Computing local density B) Randomly partitioning data — anomalies require fewer splits to isolate C) Clustering and finding points outside clusters D) Using labeled anomaly examples

**Q19.** [T/F] `joblib.dump(model, "model.pkl")` saves a trained sklearn model to disk.

**Q20.** [Scenario-Advanced] You are building a predictive maintenance system. Equipment failure rate is 0.3%. What evaluation metric would you present to the engineering team and why?

**Q21.** [MCQ] Which statement about K-Nearest Neighbors (KNN) is correct?
A) KNN requires training phase B) KNN stores all training data and computes distances at prediction time (lazy learning) C) KNN only works for classification D) KNN is robust to feature scaling

**Q22.** [T/F] UMAP preserves global structure better than t-SNE for high-dimensional data.

**Q23.** [MCQ] Cross-entropy loss is used for:
A) Regression B) Binary and multiclass classification C) Clustering D) Dimensionality reduction

**Q24.** [Code] What is the purpose of `random_state=42` in sklearn algorithms?

**Q25.** [MCQ] Which metric is best for evaluating a regression model?
A) AUC-ROC B) F1-Score C) RMSE D) Recall

**Q26.** [T/F] LOF (Local Outlier Factor) can be used as a transductive method to score new streaming data points.

**Q27.** [Short Answer] When should you choose SVM over Logistic Regression?

**Q28.** [MCQ] In a 5-class classification problem, a macro-averaged F1 score:
A) Weights classes by their frequency B) Computes F1 for each class and averages with equal weight C) Only evaluates the most common class D) Requires balanced classes

**Q29.** [T/F] `StandardScaler` must be fitted on training data only, then applied to both training and test data.

**Q30.** [Scenario] Explain in plain language what this code does: `Pipeline([("imputer", SimpleImputer(strategy="median")), ("scaler", StandardScaler()), ("pca", PCA(n_components=10)), ("model", LogisticRegression())])`

**Q31.** [MCQ] The silhouette score for clustering:
A) Measures how many clusters were identified B) Measures how similar each point is to its own cluster vs. other clusters (range -1 to 1) C) Compares to ground truth labels D) Only works for K-Means

**Q32.** [T/F] A model with high variance tends to underfit the training data.

**Q33.** [Short Answer] What is the "no free lunch" theorem in machine learning?

**Q34.** [MCQ] Adjusted R² penalizes adding irrelevant features because:
A) It squares the R² value B) It decreases when features are added that don't meaningfully improve fit C) It uses a logarithm D) It requires cross-validation

**Q35.** [Scenario-Advanced] You have three models: Model A (AUC=0.88, training time 2min), Model B (AUC=0.91, training time 4hr), Model C (AUC=0.89, training time 5min) for a churn prediction task rerun weekly. Which would you deploy and why?

**Q36.** [T/F] Naive Bayes assumes features are conditionally independent given the class label.

**Q37.** [MCQ] Which regularization technique performs both feature selection and regularization simultaneously?
A) Ridge B) Lasso C) Elastic Net D) Dropout

**Q38.** [Code] What hyperparameter in `KMeans(n_init=10)` controls?

**Q39.** [T/F] Random Forest's out-of-bag (OOB) score provides a free validation estimate without needing a separate validation set.

**Q40.** [Scenario-Advanced] A team builds a model that correctly classifies 95% of loan applications. But upon inspection, the model denies loans to 40% of Black applicants vs. 10% of White applicants with the same credit score. What ML problem does this illustrate, and what fairness metric would you compute?

---

### Answer Key — Course 07 (Selected Key Answers)

Q1:B | Q2:True | Q3:B | Q4:Scaler fitted before train/test split — test data influenced scaler parameters | Q5:C | Q6:True | Q7:C | Q8:Higher recall=fewer missed positives (good for serious disease); higher precision=fewer false alarms (good for patient anxiety/cost); threshold determines tradeoff | Q9:C | Q10:True | Q11:AUC=0.52≈random classifier; model barely better than chance | Q12:B | Q13:(1)Reduce max_depth or n_estimators; (2)Add regularization (min_samples_leaf, min_samples_split); (3)Get more training data | Q14:B | Q15:True (with unlimited depth, will memorize training data) | Q16:C (20×5) | Q17:predict() returns class labels; predict_proba() returns probability of each class — allows threshold tuning | Q18:B | Q19:True | Q20:PR-AUC or Recall at fixed FPR — failure rate is 0.3% so accuracy is meaningless | Q21:B | Q22:True | Q23:B | Q24:Sets random seed for reproducibility | Q25:C | Q26:False (LOF is transductive; use IsolationForest for streaming) | Q27:SVM excels in high-dimensional spaces with clear margins, and with kernels for non-linear boundaries; prefer when n_features >> n_samples | Q28:B | Q29:True | Q30:For each sample: fills missing values with median, standardizes, reduces to 10 PCA components, then classifies with Logistic Regression — all fitted on training data | Q31:B | Q32:False (high variance = overfitting; high bias = underfitting) | Q33:No single algorithm is universally best across all problems; performance depends on the problem structure | Q34:B | Q35:Model C — AUC=0.89 close to B but 48× faster; weekly retraining at 4 hours (Model B) is impractical; Model A's 0.01 lower AUC is unlikely to justify the 5min vs 4hr difference | Q36:True | Q37:B | Q38:Number of times K-Means is run with different initializations; uses best (lowest inertia) run | Q39:True | Q40:Algorithmic bias/fairness; compute disparate impact ratio and equalized odds (true positive rate should be equal across demographic groups)

---

## Course 07 — Practical Assignment

### Title: Predicting Credit Card Fraud — Imbalanced Classification

**Dataset:** Kaggle Credit Card Fraud Detection Dataset (0.17% fraud rate)

**Requirements:**
1. Full EDA: class distribution, feature distributions, correlation analysis
2. Build a Scikit-Learn Pipeline: preprocessing + classifier (at minimum: Logistic Regression, Random Forest)
3. Implement at minimum 2 strategies for imbalanced data (SMOTE, class_weight)
4. Evaluate using: confusion matrix, PR-AUC, F1-score at multiple thresholds
5. Implement 5-fold StratifiedKFold cross-validation
6. Anomaly detection comparison: train IsolationForest on same data; compare results
7. Business interpretation: at what threshold does this model minimize total financial loss? (Assume a missed fraud costs $500; a false alarm costs $5 in investigation time)

**Deliverables:**
- Jupyter Notebook with complete pipeline
- PR-curve visualization
- Threshold analysis table
- Business recommendation: which threshold to deploy and why

**Grading Rubric:**

| Category | Points |
|----------|--------|
| EDA + class imbalance analysis | 15 |
| sklearn Pipeline implementation | 15 |
| Imbalanced data handling (2 methods) | 15 |
| Evaluation metrics (PR-AUC, confusion matrix, F1) | 15 |
| Cross-validation with stratification | 10 |
| Anomaly detection comparison | 10 |
| Threshold analysis + business interpretation | 20 |
| **Total** | **100** |
