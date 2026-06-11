# 📝 Free Data Science Track 2026 — Complete Assessment Bank
### Professional-Grade Assessments for All 11 Courses
*Aligned to the Revised Curriculum — June 2026*

---

> **How to Use This Assessment Bank**
> - Every module includes a **10–15 question quiz** with mixed question types
> - Every course includes an **End-of-Course Assessment** (25–50 questions)
> - Every course includes a **Practical Assignment** with grading rubric
> - Difficulty distribution per quiz: **30% Beginner / 40% Intermediate / 30% Advanced**
> - All answers and explanations are provided in the Answer Key sections

---

# COURSE 01 — Python Programming Foundations

---

## Module 1.1 — Environment Setup & Introduction

### Learning Objectives Covered
- Explain why Python is preferred for Data Science
- Navigate a Jupyter Notebook environment
- Distinguish between Jupyter Notebooks and plain Python scripts
- Set up a reproducible Anaconda environment

---

### Module 1.1 Quiz

**Q1. [Multiple Choice — Beginner]**
Which of the following best describes why Python is widely preferred for Data Science over languages like Java or C++?

A) Python is the fastest language for numerical computation  
B) Python has the largest open-source ecosystem of data libraries, readable syntax, and broad community support  
C) Python is the only language supported by cloud platforms  
D) Python compiles to machine code, making it efficient for large datasets  

**Q2. [True/False — Beginner]**
A Jupyter Notebook cell can contain either code or Markdown text, but not both in the same cell.

**Q3. [Multiple Choice — Beginner]**
What is the primary advantage of using Anaconda over a plain Python installation for Data Science work?

A) Anaconda runs Python code faster than the standard interpreter  
B) Anaconda includes a curated collection of pre-installed data science libraries and conda environment management  
C) Anaconda is the only way to run Jupyter Notebooks  
D) Anaconda prevents all package version conflicts automatically  

**Q4. [Short Answer — Intermediate]**
You are starting a new data science project. A colleague sends you their project folder, which includes an `environment.yml` file. What does this file contain, and what command would you run to recreate their exact environment?

**Q5. [Multiple Choice — Intermediate]**
A Jupyter Notebook has the following cells in order: (1) a Markdown cell explaining the analysis, (2) a code cell importing pandas, (3) a code cell loading a CSV. You run cell 3 *without* running cell 2 first. What happens?

A) The CSV loads successfully because Jupyter shares state across all sessions  
B) A `NameError` occurs because `pandas` was never imported in the current kernel session  
C) A `FileNotFoundError` occurs  
D) The cell runs successfully but the DataFrame is empty  

**Q6. [True/False — Intermediate]**
`%matplotlib inline` is a Jupyter magic command that causes matplotlib plots to render directly inside the notebook rather than in a separate window.

**Q7. [Scenario-Based — Advanced]**
A junior data analyst shares a notebook that produces different results each time it is run. Upon inspection, you notice the cells have been executed out of order — cell 5 was run before cell 3, which defines a key variable. 

(a) Explain why this is a reproducibility problem.  
(b) What is the best practice to prevent this issue before sharing a notebook?  
(c) What menu option or action guarantees cells run in sequential order from a clean state?

**Q8. [Multiple Choice — Advanced]**
You are choosing between running your analysis in a Jupyter Notebook versus a plain `.py` script. Which scenario best justifies using a `.py` script instead of a notebook?

A) Performing exploratory data analysis where you need to see results inline  
B) Scheduling an automated daily data pipeline that runs on a server without user interaction  
C) Presenting findings to a non-technical stakeholder  
D) Teaching a concept where markdown explanations are needed alongside code  

**Q9. [Matching — Beginner]**
Match each term to its correct description:

| Term | Description |
|------|-------------|
| 1. JupyterLab | A. A text cell format using `#`, `**bold**`, etc. |
| 2. Kernel | B. The next-generation interface replacing the classic Notebook UI |
| 3. Markdown | C. The Python process that executes code cells |
| 4. conda env | D. An isolated Python environment with its own packages |

**Q10. [Short Answer — Advanced]**
A data science team is working collaboratively. Notebooks committed to GitHub show large diffs because Jupyter stores output cell results in the JSON file. Name two approaches for managing this problem in a professional setting.

---

### Answer Key — Module 1.1

**Q1: B**  
*Explanation: Python's combination of readable syntax, extensive data libraries (NumPy, Pandas, scikit-learn), and large community make it the lingua franca of Data Science. Python is NOT the fastest (that's typically C/C++ or Rust) — NumPy achieves speed through compiled C under the hood.*

**Q2: True**  
*Explanation: Each Jupyter cell has a single type — either Code or Markdown. You switch types using the cell type dropdown or keyboard shortcuts (M for Markdown, Y for Code).*

**Q3: B**  
*Explanation: Anaconda bundles 250+ data science packages and provides the conda package/environment manager, which handles complex dependency resolution better than pip alone. You can run Jupyter without Anaconda using pip.*

**Q4:**  
*The `environment.yml` file specifies the conda environment name, all package dependencies with pinned versions, and the Python version. To recreate it, run: `conda env create -f environment.yml`. Then activate with `conda activate <env_name>`.*

**Q5: B**  
*Explanation: Jupyter kernels are stateful — names only exist after the cell that defines them is executed. `pandas` has not been imported in the kernel's memory, so any reference to `pd` raises a NameError.*

**Q6: True**  
*Explanation: `%matplotlib inline` is an IPython magic command that configures matplotlib's backend to render plots in the notebook output area. Without it (in some environments), plots open in separate windows.*

**Q7:**  
*(a) Reproducibility problem: The notebook cannot be re-run by another person and produce the same results, because cells depend on state from out-of-order execution. The variable defined in cell 3 may have a different value than expected when cell 5 runs out of sequence.*  
*(b) Best practice: Always restart the kernel and run all cells from top to bottom before sharing. Use "Restart & Run All" before committing.*  
*(c) Action: Kernel → Restart & Run All (in both classic Jupyter and JupyterLab). This guarantees a clean state with sequential execution.*

**Q8: B**  
*Explanation: Automated pipelines that run on servers, scheduled jobs (cron, Airflow), and production code should be `.py` scripts. Notebooks have execution order ambiguity, hidden state, and don't behave well as command-line programs. Notebooks are ideal for exploration and presentation.*

**Q9:** 1→B, 2→C, 3→A, 4→D

**Q10:**  
*Two approaches: (1) Use `nbstripout` — a Git filter that automatically strips output from notebooks before committing. (2) Always clear all outputs (Cell → All Output → Clear) before committing. Bonus: tools like `nbconvert` can convert notebooks to scripts for diff-friendly version control.*

---

## Module 1.2 — Python Basics

### Learning Objectives Covered
- Declare variables with appropriate data types
- Apply arithmetic and comparison operators
- Format strings using f-strings
- Convert between data types safely

---

### Module 1.2 Quiz

**Q1. [Multiple Choice — Beginner]**
What is the output of the following code?

```python
x = 10
y = 3
print(x // y, x % y)
```

A) `3.33 1`  
B) `3 1`  
C) `4 1`  
D) `3 0`  

**Q2. [True/False — Beginner]**
In Python, `"5" + 5` will produce `10`.

**Q3. [Code Interpretation — Beginner]**
What is the data type of the variable `result` after the following code?

```python
result = 7 / 2
```

A) `int`  
B) `float`  
C) `str`  
D) `bool`  

**Q4. [Multiple Choice — Intermediate]**
You have a variable `temperature = 98.6`. Which f-string correctly formats this as `"Temperature: 98.60°F"`?

A) `f"Temperature: {temperature}°F"`  
B) `f"Temperature: {temperature:.2f}°F"`  
C) `f"Temperature: {temperature:2f}°F"`  
D) `f"Temperature: {round(temperature, 2)}°F"`  

**Q5. [Code Interpretation — Intermediate]**
What is the output of this code?

```python
name = "  Data Science  "
print(name.strip().lower().replace(" ", "_"))
```

A) `data_science`  
B) `  data_science  `  
C) `data science`  
D) `Data_Science`  

**Q6. [True/False — Intermediate]**
In Python, `bool` is a subclass of `int`, so `True + True` evaluates to `2`.

**Q7. [Short Answer — Intermediate]**
Explain the difference between `==` and `is` in Python. Provide an example where they return different results.

**Q8. [Scenario-Based — Advanced]**
A data pipeline receives age values as strings from a CSV. Write a Python expression using type conversion that safely converts the string `"32"` to an integer. Then explain what exception would be raised if the value were `"32.5"` instead of `"32"`, and how you would handle it.

**Q9. [Code Interpretation — Advanced]**
Predict the output:

```python
a = None
b = False
c = 0
d = ""

results = [bool(a), bool(b), bool(c), bool(d)]
print(all(results), any(results))
```

A) `True False`  
B) `False True`  
C) `False False`  
D) `True True`  

**Q10. [Multiple Choice — Advanced]**
Which of the following is the correct way to check if a variable `x` contains the value `None`?

A) `if x == None:`  
B) `if x is None:`  
C) `if not x:`  
D) Both A and B are equivalent and both are correct  

---

### Answer Key — Module 1.2

**Q1: B**  
*`//` is floor division (returns integer quotient), `%` is modulo (returns remainder). 10 // 3 = 3, 10 % 3 = 1.*

**Q2: False**  
*Python raises a `TypeError`: you cannot add a `str` and an `int`. You must first convert: `int("5") + 5` → 10.*

**Q3: B (float)**  
*In Python 3, `/` always returns a float, even when dividing two integers. 7 / 2 = 3.5 (float). Use `//` for integer division.*

**Q4: B**  
*`:.2f` is the format specifier for exactly 2 decimal places. Option A gives `98.6` (not 2 decimals). Option C uses wrong syntax. Option D would give `98.6` (round doesn't guarantee trailing zero).*

**Q5: A — `data_science`**  
*`.strip()` removes leading/trailing whitespace → `"Data Science"`. `.lower()` → `"data science"`. `.replace(" ", "_")` → `"data_science"`.*

**Q6: True**  
*`bool` inherits from `int` in Python. `True == 1` and `False == 0`. So `True + True = 2`. This is a documented Python behavior, used carefully in counting operations.*

**Q7:**  
*`==` tests value equality (do the two objects have the same value?). `is` tests identity (are they the exact same object in memory?). Example: `a = [1, 2]; b = [1, 2]; a == b` is `True` (same values), but `a is b` is `False` (different objects). For `None`, always use `is None`, not `== None`.*

**Q8:**  
*Safe conversion: `int("32")` → 32. If the value is `"32.5"`, Python raises `ValueError: invalid literal for int() with base 10: '32.5'`. Handle it: first convert to float, then to int: `int(float("32.5"))` → 32 (truncates). Or use try/except.*

**Q9: C — `False False`**  
*`bool(None)`, `bool(False)`, `bool(0)`, `bool("")` are all `False`. `all([F,F,F,F])` is `False`. `any([F,F,F,F])` is `False`.*

**Q10: B**  
*Always use `is None` (identity check) rather than `== None`. The `==` check can be overridden by `__eq__` in custom objects, leading to bugs. Option C (`not x`) also catches `False`, `0`, `""`, `[]` — it does NOT specifically check for `None`.*

---

## Module 1.3 — Control Flow & Loops

### Learning Objectives Covered
- Write if/elif/else decision logic
- Implement for loops and while loops
- Use break, continue, and pass appropriately
- Write list comprehensions

---

### Module 1.3 Quiz

**Q1. [Multiple Choice — Beginner]**
What does the `pass` statement do in Python?

A) Exits the current loop iteration  
B) Terminates the loop entirely  
C) Acts as a placeholder that does nothing  
D) Skips to the next function call  

**Q2. [Code Interpretation — Beginner]**
What is the output?

```python
for i in range(1, 6):
    if i == 3:
        continue
    print(i, end=" ")
```

A) `1 2 3 4 5`  
B) `1 2 4 5`  
C) `1 2`  
D) `4 5`  

**Q3. [True/False — Beginner]**
A `while` loop always executes its body at least once.

**Q4. [Code Interpretation — Intermediate]**
What does this list comprehension produce?

```python
result = [x**2 for x in range(10) if x % 2 == 0]
```

A) `[0, 1, 4, 9, 16, 25, 36, 49, 64, 81]`  
B) `[0, 4, 16, 36, 64]`  
C) `[4, 16, 36, 64]`  
D) `[1, 4, 9, 25, 49]`  

**Q5. [Multiple Choice — Intermediate]**
A data cleaning script needs to iterate through a list of temperatures and stop processing as soon as a temperature exceeds 100°C (a sensor error). Which control statement is most appropriate?

A) `continue`  
B) `pass`  
C) `break`  
D) `return`  

**Q6. [Short Answer — Intermediate]**
Rewrite this for loop as a list comprehension:

```python
words = ["apple", "banana", "cherry", "date"]
long_words = []
for word in words:
    if len(word) > 5:
        long_words.append(word)
```

**Q7. [Code Interpretation — Advanced]**
What is the output of the following nested loop code?

```python
matrix = [[1, 2], [3, 4], [5, 6]]
flat = [num for row in matrix for num in row]
print(flat)
```

**Q8. [Scenario-Based — Advanced]**
You are processing a large list of 1 million user records. For each record, you need to skip records where `age` is `None`, process records where `age < 18` with a flag, and stop entirely if you encounter a record where `status == "CORRUPTED"`. Write the Python loop structure (pseudocode or real code) that handles all three conditions correctly using `continue`, `pass` or `break` as appropriate.

**Q9. [Multiple Choice — Advanced]**
What is the key performance advantage of a list comprehension over an equivalent `for` loop with `.append()`?

A) List comprehensions are syntactically evaluated in parallel  
B) List comprehensions pre-allocate the list size, reducing the number of memory reallocations  
C) List comprehensions execute in compiled C internally, avoiding Python overhead per iteration  
D) Both B and C — they pre-allocate and run in C  

**Q10. [True/False — Advanced]**
The `else` clause of a `for` loop executes when the loop completes all iterations without hitting a `break`.

---

### Answer Key — Module 1.3

**Q1: C**  
*`pass` is a null statement — it does nothing. It's used as a placeholder when code is syntactically required but no action should be taken.*

**Q2: B — `1 2 4 5`**  
*`continue` skips the rest of the current iteration and moves to the next. When `i == 3`, the `print` is skipped, so 3 is omitted from output.*

**Q3: False**  
*A `while` loop checks the condition BEFORE executing. If the condition is `False` from the start, the body never runs. (Note: Python has no `do-while` loop.)*

**Q4: B — `[0, 4, 16, 36, 64]`**  
*Even numbers from 0–9: 0, 2, 4, 6, 8. Squared: 0, 4, 16, 36, 64. Note 0 is included because 0 % 2 == 0.*

**Q5: C — `break`**  
*`break` exits the loop entirely when the error condition is detected. `continue` would skip only the current record and continue processing.*

**Q6:**  
```python
long_words = [word for word in words if len(word) > 5]
```

**Q7:**  
*Output: `[1, 2, 3, 4, 5, 6]`*  
*The nested comprehension reads: for each row in matrix, for each num in row, collect num. This flattens the 2D list.*

**Q8:**
```python
for record in user_records:
    if record["status"] == "CORRUPTED":
        break                        # stop everything
    if record["age"] is None:
        continue                     # skip this record
    if record["age"] < 18:
        process_minor(record)        # flag as minor
    else:
        process_adult(record)
```

**Q9: D — Both B and C**  
*List comprehensions are implemented in CPython with a single LIST_APPEND opcode and pre-allocation optimization, reducing Python-level overhead per iteration versus calling `.append()` repeatedly in a loop.*

**Q10: True**  
*The `for...else` construct: the `else` block runs when the loop exhausts all items naturally. If `break` exits the loop, the `else` is skipped. Useful for "search and not found" patterns.*

---

## Module 1.4 — Functions & Modules

### Learning Objectives Covered
- Define and call functions with parameters and return values
- Use default and keyword arguments
- Write lambda functions
- Import and use standard library modules

---

### Module 1.4 Quiz

**Q1. [Multiple Choice — Beginner]**
What is the output of the following code?

```python
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Alice"))
print(greet("Bob", "Hi"))
```

A) `Hello, Alice!` then `Hi, Bob!`  
B) `Hello, Alice!` then `Hello, Bob!`  
C) `Alice, Hello!` then `Bob, Hi!`  
D) Error — greeting is required  

**Q2. [True/False — Beginner]**
A Python function that has no explicit `return` statement returns `None`.

**Q3. [Code Interpretation — Intermediate]**
What does this lambda function do, and what is its output when called as shown?

```python
process = lambda x, y: x * 2 + y
print(process(3, 4))
```

**Q4. [Multiple Choice — Intermediate]**
You are writing a data cleaning function that should process a list of prices. Which function signature correctly implements a default list parameter safely?

A) `def clean_prices(prices=[]):`  
B) `def clean_prices(prices=None): prices = prices if prices is not None else []`  
C) Both are equally safe  
D) Neither is correct  

**Q5. [Short Answer — Intermediate]**
Explain the difference between positional arguments and keyword arguments. Why do keyword arguments improve code readability in data science functions?

**Q6. [Code Interpretation — Intermediate]**
What is the output?

```python
import math
print(math.floor(3.9), math.ceil(3.1), round(3.5))
```

**Q7. [Scenario-Based — Advanced]**
You are building a reusable data transformation function. It should:
- Accept a list of numbers
- Accept an optional `multiplier` parameter (default: 1)
- Accept an optional `offset` parameter (default: 0)
- Return a new list where each element is `(x * multiplier) + offset`

Write this function. Then show how to call it with keyword arguments to apply a 2x scale and +10 offset to `[1, 2, 3]`.

**Q8. [Code Interpretation — Advanced]**
What is the scope issue in this code, and what is its output?

```python
x = 10

def modify():
    x = 20
    print(x)

modify()
print(x)
```

**Q9. [True/False — Advanced]**
The `*args` parameter in a function definition collects extra positional arguments as a **tuple**, not a list.

**Q10. [Multiple Choice — Advanced]**
When should you use a lambda function vs a named function defined with `def`?

A) Use lambda for any function under 3 lines of code  
B) Use lambda for simple, one-expression operations used inline (e.g., as a key function in `sorted()`); use `def` for anything requiring logic, multiple expressions, or documentation  
C) Lambda and `def` functions are identical — the choice is purely stylistic  
D) Use `def` always; lambda functions cannot be assigned to variables  

---

### Answer Key — Module 1.4

**Q1: A**  
*Default arguments are used when no value is provided. `greet("Alice")` uses `greeting="Hello"`. `greet("Bob", "Hi")` overrides it.*

**Q2: True**  
*All Python functions return a value. If no `return` statement is present, Python implicitly returns `None`.*

**Q3:**  
*The lambda multiplies `x` by 2 and adds `y`. Output: `3 * 2 + 4 = 10`.*

**Q4: B**  
*Using a mutable default like `[]` in Python is a notorious bug — the same list object is shared across all calls. The safe pattern is to use `None` as default and create a new list inside the function.*

**Q5:**  
*Positional arguments are matched by order: `f(1, 2)`. Keyword arguments are matched by name: `f(y=2, x=1)`. In data science, functions often have many parameters (e.g., scaling, imputation strategy, threshold). Keyword arguments make calls self-documenting: `preprocess(df, strategy="median", threshold=0.05)` is far clearer than `preprocess(df, "median", 0.05)`.*

**Q6:**  
*`math.floor(3.9) = 3`, `math.ceil(3.1) = 4`, `round(3.5) = 4`. Output: `3 4 4`. Note: Python uses banker's rounding — `round(2.5)` returns 2, not 3.*

**Q7:**
```python
def transform(numbers, multiplier=1, offset=0):
    return [(x * multiplier) + offset for x in numbers]

result = transform([1, 2, 3], multiplier=2, offset=10)
# Result: [12, 14, 16]
```

**Q8:**  
*No error, but the local `x` inside `modify()` is a separate variable from the global `x`. Python creates a new local scope for each function call. Output: `20` (local x), then `10` (global x unchanged). To modify global x, you'd need `global x` declaration.*

**Q9: True**  
*`*args` collects extra positional arguments as a `tuple` (immutable). `**kwargs` collects extra keyword arguments as a `dict`.*

**Q10: B**  
*Lambda is ideal for short, inline operations like `sorted(data, key=lambda x: x["score"])`. For anything requiring multiple lines, conditionals, documentation, or debugging, `def` is always preferred because named functions have better tracebacks, can have docstrings, and are easier to test.*

---

## Module 1.5 — Data Structures

### Learning Objectives Covered
- Perform CRUD operations on lists, dicts, tuples, and sets
- Choose the appropriate data structure for a given problem
- Use slicing and indexing correctly
- Understand mutability implications

---

### Module 1.5 Quiz

**Q1. [Multiple Choice — Beginner]**
Which data structure should you use to store a collection of unique customer IDs where you need fast membership testing?

A) List  
B) Tuple  
C) Set  
D) Dictionary  

**Q2. [Code Interpretation — Beginner]**
What is the output?

```python
data = [10, 20, 30, 40, 50]
print(data[1:4])
print(data[-2:])
```

**Q3. [True/False — Beginner]**
Tuples are mutable — you can change their elements after creation.

**Q4. [Code Interpretation — Intermediate]**
What does this code produce?

```python
record = {"name": "Alice", "score": 95, "grade": "A"}
record["score"] = 98
record["department"] = "Data Science"
del record["grade"]
print(record)
```

**Q5. [Multiple Choice — Intermediate]**
You are storing the configuration for a machine learning pipeline (model type, hyperparameters, dataset path) that should never be accidentally modified during a run. Which data structure is most appropriate?

A) Dictionary  
B) List  
C) Tuple  
D) Set  

**Q6. [Short Answer — Intermediate]**
Explain what happens when you try to use a list as a dictionary key. Why does Python forbid this? What data structure could you use instead?

**Q7. [Scenario-Based — Advanced]**
A dataset has records as a list of dictionaries:

```python
records = [
    {"name": "Alice", "dept": "Engineering", "salary": 95000},
    {"name": "Bob", "dept": "Marketing", "salary": 72000},
    {"name": "Carol", "dept": "Engineering", "salary": 88000},
]
```

Write Python code (using a dictionary comprehension or loop) that creates a new dictionary mapping each person's name to their salary. Then write a one-liner that returns the name of the highest-paid person.

**Q8. [Multiple Choice — Advanced]**
What is the time complexity of membership testing (`x in collection`) for a Python set vs a Python list?

A) Both are O(1)  
B) Set: O(1) average; List: O(n)  
C) Set: O(n); List: O(1)  
D) Both are O(n)  

**Q9. [Code Interpretation — Advanced]**
Predict the output and explain why:

```python
a = [1, 2, 3]
b = a
b.append(4)
print(a)
```

**Q10. [True/False — Advanced]**
`dict.get("key", default)` is safer than `dict["key"]` when the key might not exist, because it returns the default instead of raising a `KeyError`.

---

### Answer Key — Module 1.5

**Q1: C — Set**  
*Sets are hash-based, making `in` lookups O(1) average. Lists require O(n) linear search. Dictionaries also offer O(1) lookup but store key-value pairs — a set is the right choice for a collection of unique IDs with no associated values.*

**Q2:**  
*`data[1:4]` → `[20, 30, 40]` (indices 1, 2, 3; excludes 4). `data[-2:]` → `[40, 50]` (last two elements).*

**Q3: False**  
*Tuples are **immutable** — once created, their elements cannot be changed. This immutability makes them hashable (usable as dict keys), unlike lists.*

**Q4:**  
*Output: `{'name': 'Alice', 'score': 98, 'department': 'Data Science'}`. The score was updated, a new key was added, and the "grade" key was deleted.*

**Q5: C — Tuple**  
*Tuples are immutable, making them ideal for configuration that must not change. A dictionary would work but is mutable. Sets don't support key-value pairs. A named tuple is even better for labeled configs.*

**Q6:**  
*Python raises `TypeError: unhashable type: 'list'`. Dictionary keys must be hashable (immutable). Lists are mutable and therefore not hashable. You could use a **tuple** instead: `{(1, 2): "value"}`.*

**Q7:**
```python
# Dictionary comprehension
salary_map = {r["name"]: r["salary"] for r in records}

# Highest paid
highest_paid = max(salary_map, key=salary_map.get)
# Result: "Alice" (95000)
```

**Q8: B**  
*Python sets use hash tables — membership testing is O(1) average case. List membership testing requires scanning every element: O(n). This difference is critical for large datasets.*

**Q9:**  
*Output: `[1, 2, 3, 4]`. When you do `b = a`, both `a` and `b` point to the **same list object** in memory. Modifying `b` with `.append()` also modifies `a`. This is shallow assignment, not a copy. To avoid this: `b = a.copy()` or `b = list(a)`.*

**Q10: True**  
*`dict.get(key, default)` returns the default value without raising an exception when the key is missing. This is essential in data processing where missing keys are common.*

---

## Module 1.6 — File I/O & Error Handling

### Learning Objectives Covered
- Read and write text and CSV files using context managers
- Handle exceptions with try/except/finally
- Identify common data processing exceptions

---

### Module 1.6 Quiz

**Q1. [Multiple Choice — Beginner]**
What is the correct way to open a file for reading in Python using a context manager?

A) `file = open("data.txt", "r")`  
B) `with open("data.txt", "r") as f:`  
C) `with open("data.txt") as f, mode="r":`  
D) `read_file("data.txt")`  

**Q2. [True/False — Beginner]**
The `finally` block in a try/except/finally structure executes only when no exception is raised.

**Q3. [Code Interpretation — Intermediate]**
What is the output of this code?

```python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero")
except Exception as e:
    print(f"Other error: {e}")
finally:
    print("Done")
```

**Q4. [Scenario-Based — Intermediate]**
You are writing a data ingestion script that reads a CSV file. The file may not exist, or it may contain rows with invalid numeric values. Write the error handling structure (skeleton code acceptable) that:
1. Catches `FileNotFoundError` with a helpful message
2. Catches `ValueError` when parsing numbers
3. Always closes the file, even if an error occurs

**Q5. [Multiple Choice — Advanced]**
In a data pipeline that processes millions of records, you use bare `except:` clauses without specifying exception types. Why is this considered dangerous?

A) Bare except is slower than specific exceptions  
B) Bare except catches SystemExit and KeyboardInterrupt, preventing the user from stopping the program  
C) Bare except cannot handle ValueError  
D) Bare except is valid and recommended for simplicity  

**Q6. [Code Interpretation — Advanced]**
What is wrong with this code, and how would you fix it?

```python
data = []
f = open("prices.txt", "r")
for line in f:
    data.append(float(line.strip()))
f.close()
```

---

### Answer Key — Module 1.6

**Q1: B**  
*Context managers (`with` statement) automatically close the file when the block exits, even if an exception occurs. Option A doesn't guarantee closure. Option C has invalid syntax.*

**Q2: False**  
*`finally` executes ALWAYS — whether an exception was raised or not. It is used for cleanup code (closing files, releasing resources) that must run regardless of outcome.*

**Q3:**  
*Output: `Cannot divide by zero` then `Done`. The ZeroDivisionError is caught by the first except clause. `finally` always runs after.*

**Q4:**
```python
try:
    with open("data.csv", "r") as f:
        for line in f:
            try:
                value = float(line.strip().split(",")[1])
            except ValueError:
                print(f"Invalid numeric value in line: {line}")
except FileNotFoundError:
    print("Error: data.csv not found. Check the file path.")
```
*The `with` statement handles file closure automatically — `finally` is redundant when using context managers.*

**Q5: B**  
*Bare `except:` catches everything including `SystemExit` (raised by `sys.exit()`) and `KeyboardInterrupt` (raised when the user presses Ctrl+C). This makes it impossible to stop a runaway script. Always use at minimum `except Exception:` to let system-level signals through.*

**Q6:**  
*Problem: If `float(line.strip())` raises a `ValueError` (e.g., empty line or non-numeric text), `f.close()` is never called, leaving the file handle open (resource leak).*  
*Fix: Use a context manager:*
```python
data = []
with open("prices.txt", "r") as f:
    for line in f:
        data.append(float(line.strip()))
```

---

## Module 1.7 — Object-Oriented Programming (Intro)

### Learning Objectives Covered
- Define classes with `__init__` and methods
- Understand instance vs class attributes
- Apply basic inheritance concepts

---

### Module 1.7 Quiz

**Q1. [Multiple Choice — Beginner]**
What is the purpose of the `__init__` method in a Python class?

A) To initialize a class variable shared by all instances  
B) To define the constructor — code that runs when a new object is created  
C) To destroy an object when it goes out of scope  
D) To return a string representation of the object  

**Q2. [True/False — Beginner]**
All instance methods in a Python class must have `self` as their first parameter.

**Q3. [Code Interpretation — Intermediate]**
What is the output?

```python
class DataSet:
    count = 0  # class attribute
    
    def __init__(self, name, rows):
        self.name = name
        self.rows = rows
        DataSet.count += 1

ds1 = DataSet("Sales", 1000)
ds2 = DataSet("Customers", 5000)
print(DataSet.count, ds1.name, ds2.rows)
```

**Q4. [Scenario-Based — Advanced]**
You are modeling a data pipeline. Create a Python class `Pipeline` that:
- Has an `__init__` that accepts a `name` and initializes an empty list `steps`
- Has an `add_step(step_name)` method that appends to `steps`
- Has a `run()` method that prints each step in order
- Has a `__str__` method that returns `"Pipeline: <name> (<n> steps)"`

Write the complete class definition.

**Q5. [Multiple Choice — Advanced]**
In data science, OOP is used when building custom Scikit-Learn transformers. What method must a custom transformer class inherit from `BaseEstimator, TransformerMixin` implement to work in a sklearn `Pipeline`?

A) `transform()` only  
B) `fit()` and `transform()`  
C) `predict()` and `fit()`  
D) `run()` and `execute()`  

---

### Answer Key — Module 1.7

**Q1: B**  
*`__init__` is Python's constructor — it runs automatically when a new instance is created with `ClassName()`. It initializes instance attributes.*

**Q2: True**  
*`self` refers to the instance itself and is required as the first parameter of all instance methods (not class methods or static methods). Python passes it automatically when you call `instance.method()`.*

**Q3:**  
*`DataSet.count` is a class attribute shared across all instances. Each `__init__` call increments it. Output: `2 Sales 5000`.*

**Q4:**
```python
class Pipeline:
    def __init__(self, name):
        self.name = name
        self.steps = []
    
    def add_step(self, step_name):
        self.steps.append(step_name)
    
    def run(self):
        for i, step in enumerate(self.steps, 1):
            print(f"Step {i}: {step}")
    
    def __str__(self):
        return f"Pipeline: {self.name} ({len(self.steps)} steps)"
```

**Q5: B**  
*Scikit-Learn pipelines require `fit(X, y)` (to learn from data) and `transform(X)` (to apply the transformation). `TransformerMixin` provides a `fit_transform()` method for free when both are implemented.*

---

## Module 1.8 — Code Quality, Environments & Working with APIs

### Learning Objectives Covered
- Create and manage virtual environments
- Use `requirements.txt` for reproducibility
- Write type hints on functions
- Call a REST API and parse JSON responses
- Handle nested JSON structures

---

### Module 1.8 Quiz

**Q1. [Multiple Choice — Beginner]**
What is the purpose of a `requirements.txt` file in a Python project?

A) To list all Python files in the project  
B) To specify the exact package versions needed to reproduce the project's environment  
C) To document the project's functional requirements in plain English  
D) To configure the virtual environment's Python version  

**Q2. [Code Interpretation — Beginner]**
What does this code do?

```python
import json

data = '{"city": "New York", "temp_c": 22.5}'
parsed = json.loads(data)
print(parsed["city"], parsed["temp_c"])
```

**Q3. [Multiple Choice — Intermediate]**
You call a public weather API and receive the response object `response`. What is the correct way to check if the request succeeded before parsing the JSON?

A) `if response.text == "OK":`  
B) `if response.status_code == 200:`  
C) `if response.json():`  
D) `if response:`  

**Q4. [Code Interpretation — Intermediate]**
An API returns this nested JSON:

```json
{
  "country": "Germany",
  "capital": "Berlin",
  "languages": [{"name": "German", "native": "Deutsch"}],
  "currencies": {"EUR": {"name": "Euro"}}
}
```

Write Python code to extract: the country name, the native name of the first language, and the currency name.

**Q5. [Short Answer — Intermediate]**
What is the difference between `json.loads()` and `json.load()`? When would you use each?

**Q6. [True/False — Intermediate]**
Python type hints (e.g., `def process(data: list) -> dict:`) enforce type checking at runtime — if you pass a string, Python will raise a TypeError.

**Q7. [Scenario-Based — Advanced]**
You are writing a function that fetches weather data from the Open-Meteo API. The function should:
- Accept `latitude` and `longitude` as float parameters
- Return a dictionary with the current temperature and wind speed
- Raise a descriptive exception if the API call fails

Write the function with proper type hints and error handling. The Open-Meteo API endpoint is: `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,wind_speed_10m`

**Q8. [Multiple Choice — Advanced]**
A production data pipeline uses a secret API key. Which of the following is the WORST practice for managing this key?

A) Storing it in a `.env` file and loading with `python-dotenv`  
B) Setting it as an operating system environment variable  
C) Hardcoding it as a string in the Python source file committed to GitHub  
D) Storing it in a secrets manager service  

---

### Answer Key — Module 1.8

**Q1: B**  
*`requirements.txt` lists packages and their versions (e.g., `pandas==2.1.0`) so that anyone can recreate the exact environment with `pip install -r requirements.txt`.*

**Q2:**  
*The code parses a JSON string into a Python dictionary and prints the values. Output: `New York 22.5`.*

**Q3: B**  
*HTTP status code 200 means "OK". Always check `response.status_code` before processing. Option D (`if response:`) evaluates based on the requests library truthy check (also works for 2xx codes, but checking explicitly is clearer). Option C could raise an error if the response isn't valid JSON.*

**Q4:**
```python
import json

data = json.loads('...')  # the JSON above
country = data["country"]                        # "Germany"
native_language = data["languages"][0]["native"]  # "Deutsch"
currency_name = data["currencies"]["EUR"]["name"] # "Euro"
```

**Q5:**  
*`json.loads(string)` parses a **string** containing JSON. `json.load(file_object)` reads from an **open file object**. Use `loads` when your JSON is already in memory as a string (e.g., from an API response: `json.loads(response.text)`). Use `load` when reading from a `.json` file: `json.load(open("data.json"))`.*

**Q6: False**  
*Python type hints are for documentation and static analysis tools (like mypy) only. At runtime, Python does NOT enforce them — you can still pass the wrong type without any error. Use a static checker like `mypy` or `pyright` for enforcement.*

**Q7:**
```python
import requests

def get_weather(latitude: float, longitude: float) -> dict:
    url = (
        f"https://api.open-meteo.com/v1/forecast"
        f"?latitude={latitude}&longitude={longitude}"
        f"&current=temperature_2m,wind_speed_10m"
    )
    response = requests.get(url, timeout=10)
    if response.status_code != 200:
        raise RuntimeError(f"API request failed: {response.status_code}")
    data = response.json()
    current = data["current"]
    return {
        "temperature_c": current["temperature_2m"],
        "wind_speed_kmh": current["wind_speed_10m"]
    }
```

**Q8: C — Hardcoding in source code committed to GitHub**  
*This is the most dangerous practice. Once committed to a public GitHub repo, the key is permanently exposed in git history (even if later deleted). API keys exposed this way are scanned by bots within minutes. Always use environment variables or secrets managers.*

---

# COURSE 01 — End-of-Course Assessment
## Python Programming Foundations

**Instructions:** 35 questions. Allow 90 minutes. Mix of all question types.

---

**Q1. [MCQ]** What is the output of `type(True)` in Python?
A) `<class 'int'>` B) `<class 'bool'>` C) `<class 'str'>` D) `<class 'object'>`

**Q2. [T/F]** `range(5)` produces the list `[0, 1, 2, 3, 4]`.

**Q3. [MCQ]** Which is the correct f-string for formatting `pi = 3.14159` to 3 decimal places?
A) `f"{pi:.3}"` B) `f"{pi:.3f}"` C) `f"{pi:3f}"` D) `f"{pi, 3}"`

**Q4. [Code]** What is the output?
```python
x = [1, 2, 3, 4, 5]
print(x[::2])
```
A) `[1, 3, 5]` B) `[2, 4]` C) `[1, 2]` D) `[5, 4, 3, 2, 1]`

**Q5. [MCQ]** Which exception is raised when you try to access a dictionary key that doesn't exist using `dict["key"]`?
A) `IndexError` B) `KeyError` C) `ValueError` D) `AttributeError`

**Q6. [T/F]** `*args` in a function definition allows the function to accept any number of keyword arguments.

**Q7. [MCQ]** What does `set([1, 2, 2, 3, 3, 3])` produce?
A) `[1, 2, 3]` B) `{1, 2, 3}` C) `{1, 2, 2, 3}` D) Error

**Q8. [Code]** Predict the output:
```python
def counter(start=0):
    start += 1
    return start

print(counter(), counter(5), counter())
```
A) `1 6 1` B) `1 6 2` C) `1 5 1` D) `0 5 0`

**Q9. [Short Answer]** What is the difference between `append()` and `extend()` on a Python list? Give an example where they produce different results.

**Q10. [MCQ]** Which virtual environment command creates a new environment called `ds_env` using conda?
A) `conda create ds_env` B) `conda create --name ds_env python=3.11` C) `conda init ds_env` D) `venv create ds_env`

**Q11. [T/F]** In a Jupyter Notebook, you can execute cells in any order, regardless of the order they appear in the document.

**Q12. [Code]** What does this list comprehension return?
```python
[i for i in range(20) if i % 3 == 0 and i % 5 == 0]
```
A) `[15]` B) `[0, 15]` C) `[3, 5, 15]` D) `[0, 3, 5, 15]`

**Q13. [Scenario]** A colleague's script crashes with `ModuleNotFoundError: No module named 'requests'`. They have Python installed. What are the two most likely causes and their solutions?

**Q14. [MCQ]** What HTTP status code indicates a successful API request?
A) 404 B) 500 C) 200 D) 301

**Q15. [Code]** What is the output?
```python
class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return f"{self.name} makes a sound"

class Dog(Animal):
    def speak(self):
        return f"{self.name} barks"

d = Dog("Rex")
print(d.speak())
```
A) `Rex makes a sound` B) `Rex barks` C) Error D) `Dog barks`

**Q16. [MCQ]** Which of the following correctly reads JSON from a file?
A) `data = json.loads("file.json")` B) `data = json.load(open("file.json"))` C) `data = json.read("file.json")` D) `data = json.parse("file.json")`

**Q17. [T/F]** `black` is a Python linter that checks for code style errors and potential bugs.

**Q18. [Short Answer]** Explain what `if __name__ == "__main__":` does and why it's used in Python modules.

**Q19. [Code]** What is the output?
```python
data = {"a": 1, "b": 2, "c": 3}
result = {k: v*2 for k, v in data.items() if v > 1}
print(result)
```
A) `{"b": 4, "c": 6}` B) `{"a": 2, "b": 4, "c": 6}` C) `{"b": 2, "c": 3}` D) Error

**Q20. [MCQ]** What is the correct way to add a new key-value pair to a dictionary `d`?
A) `d.add("key", "value")` B) `d["key"] = "value"` C) `d.insert("key", "value")` D) `d.push("key", "value")`

**Q21. [Scenario-Advanced]** You receive an API response with 100 pages of data. Each call returns a JSON object with `results` (a list) and `next_page` (a URL or null). Write a Python function `fetch_all_pages(first_url)` that retrieves all pages and returns a flat list of all results.

**Q22. [Code]** What happens?
```python
try:
    x = int("abc")
    print("Success")
except ValueError:
    print("ValueError caught")
except TypeError:
    print("TypeError caught")
finally:
    print("Always runs")
```
A) `ValueError caught` then `Always runs`  
B) `TypeError caught` then `Always runs`  
C) `Success` then `Always runs`  
D) `ValueError caught` only

**Q23. [T/F]** A Python `set` is ordered — items maintain their insertion order.

**Q24. [MCQ]** Which tool automatically reformats Python code to be PEP 8 compliant without the user needing to manually fix each violation?
A) flake8 B) pylint C) black D) mypy

**Q25. [Short Answer]** What is a `requirements.txt` and what command generates one from the current environment?

**Q26. [Code — Advanced]** What is the output and why?
```python
a = (1, 2, [3, 4])
a[2].append(5)
print(a)
```
A) Error — tuples are immutable  
B) `(1, 2, [3, 4, 5])`  
C) `(1, 2, [3, 4])`  
D) `(1, 2, [3, 4], 5)`

**Q27. [MCQ]** In Python, what does `os.path.join("data", "raw", "file.csv")` return on Windows?
A) `data/raw/file.csv` B) `data\raw\file.csv` C) Platform-appropriate separator D) An error

**Q28. [T/F]** Lambda functions can include multiple lines of code separated by semicolons.

**Q29. [Scenario]** A data science script takes 20 minutes to download data from an API. Write a design strategy (not full code) to cache the downloaded data locally so subsequent runs skip the download.

**Q30. [MCQ]** Which of the following is NOT a valid Python type hint?
A) `def f(x: int) -> str:` B) `def f(x: list[str]) -> None:` C) `def f(x: Array) -> Float:` D) `def f(x: dict[str, int]) -> bool:`

**Q31. [Code]** What is the output?
```python
numbers = [5, 3, 8, 1, 9, 2]
print(sorted(numbers, reverse=True)[:3])
```
A) `[9, 8, 5]` B) `[1, 2, 3]` C) `[5, 3, 8]` D) `[9, 8, 5, 3]`

**Q32. [Short Answer]** Explain why `import *` from a module is considered bad practice in professional Python code.

**Q33. [Scenario-Advanced]** You are writing a module `utils.py` with 3 helper functions used across a project. A teammate accidentally calls `utils.process_data()` with no arguments and gets an unhelpful `TypeError`. How would you improve the function signature and error messaging to make debugging easier for future users?

**Q34. [T/F]** `enumerate(["a", "b", "c"])` returns `[(0, "a"), (1, "b"), (2, "c")]` as a list.

**Q35. [MCQ — Advanced]** Which pattern correctly implements a context manager using a class?
A) A class with `__enter__` and `__exit__` methods  
B) A class with `__open__` and `__close__` methods  
C) A class decorated with `@contextmanager`  
D) Any class that inherits from `FileIO`

---

### End-of-Course Assessment — Answer Key

Q1:B | Q2:False (range returns a range object, not a list) | Q3:B | Q4:A | Q5:B | Q6:False (*args captures positional args, **kwargs captures keyword) | Q7:B | Q8:A | Q9: `append` adds a single element; `extend` adds all elements of an iterable. `a=[1,2]; a.append([3,4])` → `[1,2,[3,4]]`; `a.extend([3,4])` → `[1,2,3,4]` | Q10:B | Q11:True | Q12:B | Q13: (1) `requests` not installed in current environment — fix: `pip install requests`; (2) Using wrong Python/environment — fix: verify active environment with `conda activate` or `which python` | Q14:C | Q15:B (method overriding/polymorphism) | Q16:B | Q17:False (black is a formatter; flake8 is the linter) | Q18: Code inside `if __name__ == "__main__":` runs only when the file is executed directly, not when imported as a module — enables reusable code without side effects on import | Q19:A | Q20:B | Q21: Iteratively call each `next_page` URL, collecting `results` lists, until `next_page` is null | Q22:A | Q23:False (sets are unordered; dicts are ordered in Python 3.7+) | Q24:C | Q25: Lists project dependencies and versions; generate with `pip freeze > requirements.txt` | Q26:B (tuple itself is immutable but its mutable list element can be modified) | Q27:C (os.path.join is OS-aware) | Q28:False (lambda is a single expression only) | Q29: Check if a local cache file exists; if yes, load from it; if no, call the API and save results to file | Q30:C (Array and Float are not built-in Python types; use `np.ndarray` or `list`, `float`) | Q31:A | Q32: It imports all names from a module into the current namespace, causing potential name collisions, making it unclear where functions come from, and polluting the namespace | Q33: Add type hints, a docstring, and raise a descriptive `ValueError` with the expected format if inputs are invalid | Q34:False (returns an enumerate object, not a list; convert with `list()`) | Q35:A

---

## Course 01 — Practical Assignment

### Title: Public Data Dashboard — Weather + Country Data Aggregator

**Objective:** Build a professional Python script that calls two public APIs, parses their JSON responses, writes output files, and meets professional code quality standards.

**APIs (all free, no key needed):**
- Open-Meteo: `https://api.open-meteo.com/v1/forecast`
- REST Countries: `https://restcountries.com/v3.1/all`

**Requirements:**
1. **Environment:** Create a virtual environment. Include a `requirements.txt` with all dependencies pinned.
2. **API Calls:** Fetch current weather for 3 cities of your choice (use latitude/longitude). Fetch all countries from REST Countries API.
3. **Data Extraction:** From weather: temperature, wind speed, city name. From countries: name, capital, population, languages spoken, currencies.
4. **Output:** Write a summary `.json` file and a human-readable `.txt` report.
5. **Code Quality:** Format with `black` before submission. All functions must have type hints and a one-line docstring.
6. **Error Handling:** Handle `ConnectionError`, `TimeoutError`, and malformed JSON gracefully with descriptive messages.
7. **Documentation:** Include a `README.md` explaining how to install and run the script.

**Expected Deliverables:**
- `main.py` — main script, formatted with black, passes flake8
- `requirements.txt` — pinned dependencies
- `README.md` — setup and run instructions
- `output/weather_report.json` — structured JSON
- `output/country_report.txt` — human-readable summary

---

### Grading Rubric — Course 01 Practical

| Category | Max Points | Criteria |
|----------|-----------|----------|
| Environment Setup | 15 | Virtual env created (5), requirements.txt complete (5), README with setup instructions (5) |
| API Integration | 20 | Both APIs called successfully (10), error handling implemented (10) |
| JSON Parsing | 15 | Correctly extracts all required fields (10), handles nested JSON (5) |
| Output Files | 15 | JSON output well-structured (7), TXT report readable (8) |
| Code Quality | 20 | Passes `black` and `flake8` (5), type hints on all functions (5), docstrings present (5), no hardcoded credentials (5) |
| Error Handling | 15 | Handles connection errors (5), handles bad status codes (5), handles malformed JSON (5) |
| **Total** | **100** | |

**Passing threshold: 70/100**

---

---

# COURSE 02 — Mathematics & Statistics for Data Science

---

## Module 2.1 — Descriptive Statistics

### Learning Objectives Covered
- Calculate and interpret measures of central tendency and spread
- Understand skewness and its implication for data distributions
- Compute correlation and covariance
- Implement descriptive statistics using Python

---

### Module 2.1 Quiz

**Q1. [Multiple Choice — Beginner]**
A dataset contains the following salaries (in thousands): `[45, 52, 48, 200, 50, 47, 51]`. Which measure of central tendency is LEAST affected by the value of 200?

A) Mean  
B) Median  
C) Mode  
D) Standard Deviation  

**Q2. [True/False — Beginner]**
Variance is measured in the same units as the original data.

**Q3. [Data Interpretation — Beginner]**
For the dataset `[2, 4, 4, 4, 5, 5, 7, 9]`:
- Mean = ?
- Median = ?
- Mode = ?
- Standard deviation ≈ ?

**Q4. [Multiple Choice — Intermediate]**
A dataset has a mean of 75 and a standard deviation of 10. A new data point of 105 is added. This point is approximately how many standard deviations from the mean?

A) 1.5 B) 2.0 C) 3.0 D) 5.0

**Q5. [Code Interpretation — Intermediate]**
What does this code compute, and what does a high value indicate?

```python
import scipy.stats as stats
data = [2, 4, 4, 4, 5, 5, 7, 9, 100]
print(stats.skew(data))
```

**Q6. [Data Interpretation — Intermediate]**
You are analyzing a salary dataset. The `df.describe()` output shows:

```
count    1000.0
mean     52000.0
std      35000.0
min      20000.0
25%      35000.0
50%      44000.0
75%      58000.0
max      500000.0
```

(a) Is this distribution likely to be symmetric, left-skewed, or right-skewed? Explain why.  
(b) Would you use mean or median to represent a "typical" salary? Justify.

**Q7. [Short Answer — Intermediate]**
Explain the difference between **correlation** and **covariance**. Why is correlation generally preferred for comparing relationships between pairs of variables?

**Q8. [Scenario-Based — Advanced]**
A data scientist reports: "Our model's error has a standard deviation of 500." A business analyst says: "Our model's error has a variance of 250,000." Are they describing the same model? Which metric is more interpretable, and why?

**Q9. [Multiple Choice — Advanced]**
A dataset has Q1 = 20 and Q3 = 50. What are the lower and upper bounds for outlier detection using the IQR method?

A) Lower: 10, Upper: 60  
B) Lower: -25, Upper: 95  
C) Lower: 5, Upper: 65  
D) Lower: -5, Upper: 95  

**Q10. [Data Interpretation — Advanced]**
Two features in a dataset have a Pearson correlation of **0.95**. A junior analyst says: "Feature B causes Feature A — we should keep only one." Identify two problems with this conclusion.

---

### Answer Key — Module 2.1

**Q1: B — Median**  
*The median is resistant to outliers because it depends only on the middle value's rank, not its magnitude. The extreme value of 200 shifts the mean dramatically but has no effect on the median. Sorted: [45, 47, 48, 50, 51, 52, 200] → median = 50.*

**Q2: False**  
*Variance is in squared units of the original data. If data is in meters, variance is in m². Standard deviation is in the original units, which is why it's more interpretable.*

**Q3:**
- Mean = (2+4+4+4+5+5+7+9)/8 = 40/8 = **5.0**
- Median: sorted=[2,4,4,4,5,5,7,9], middle=(4+5)/2 = **4.5**
- Mode = **4** (appears 3 times)
- Std ≈ **2.0** (variance = mean of squared deviations = 4.0, std = 2.0)

**Q4: C — 3.0**  
*(105 - 75) / 10 = 3.0 standard deviations. This is a significant outlier by the empirical rule (99.7% of normally distributed data falls within 3 std dev).*

**Q5:**  
*`stats.skew()` computes the **skewness** of the distribution. A high positive value (>1) indicates the distribution has a long right tail — the bulk of values cluster on the left with extreme high values pulling the mean rightward. The value 100 creates strong positive skew here.*

**Q6:**  
*(a) Right-skewed (positively skewed). The mean (52,000) is much higher than the median (44,000) — a hallmark of right skew. The max (500,000) is an extreme outlier pulling the mean up.*  
*(b) Use median (44,000) to represent a "typical" salary. The mean is inflated by a few very high earners and does not represent the experience of most employees.*

**Q7:**  
*Covariance measures the direction of the linear relationship between two variables but is scale-dependent — its magnitude is affected by the units of measurement. Correlation (Pearson r) is a normalized version: it divides covariance by the product of standard deviations, giving a dimensionless value in [-1, 1]. Correlation allows comparison across variable pairs regardless of scale.*

**Q8:**  
*Yes — they are describing the same model: 500² = 250,000. Standard deviation (500) is more interpretable because it is in the same units as the original error. "Our average error is approximately ±500 units" is immediately meaningful; "variance of 250,000" requires mental conversion.*

**Q9: B — Lower: -25, Upper: 95**  
*IQR = Q3 - Q1 = 50 - 20 = 30. Lower fence: Q1 - 1.5×IQR = 20 - 45 = -25. Upper fence: Q3 + 1.5×IQR = 50 + 45 = 95.*

**Q10:**  
*(1) **Correlation ≠ causation.** High correlation only means the variables move together, not that one causes the other — there may be a confounding variable. (2) **Dropping one correlated feature is not always correct.** High multicollinearity can be handled with regularization or PCA. Blindly removing one feature may discard useful signal, especially in non-linear models that can leverage both.*

---

## Module 2.2 — Probability Theory

### Learning Objectives Covered
- Apply probability rules (addition, multiplication)
- Calculate conditional probability
- Apply Bayes' theorem in data science contexts

---

### Module 2.2 Quiz

**Q1. [Multiple Choice — Beginner]**
A fair six-sided die is rolled. What is the probability of rolling a 3 or a 5?

A) 1/3  B) 1/6  C) 1/2  D) 2/3

**Q2. [True/False — Beginner]**
If P(A) = 0.3 and P(B) = 0.4 and A and B are mutually exclusive, then P(A or B) = 0.7.

**Q3. [Short Answer — Intermediate]**
A spam filter classifies emails. The probability of an email being spam is 0.2. The filter correctly identifies spam 95% of the time (true positive rate). It also incorrectly flags legitimate emails 5% of the time (false positive rate).

If an email is flagged as spam, what is the probability it is actually spam? Apply Bayes' theorem. Show your work.

**Q4. [Multiple Choice — Intermediate]**
In the context of machine learning, why is Bayes' theorem foundational to the Naive Bayes classifier?

A) It uses Bayesian optimization for hyperparameter tuning  
B) It computes the posterior probability of a class given the observed features  
C) It assumes all features are normally distributed  
D) It is the fastest classification algorithm  

**Q5. [Scenario-Based — Advanced]**
A medical test for a rare disease has 99% sensitivity (true positive rate) and 98% specificity (true negative rate). The disease affects 0.1% of the population.

(a) Calculate the probability that a person who tests positive actually has the disease (positive predictive value).  
(b) Explain why this result might surprise a clinician who trusts in the test's 99% accuracy.

---

### Answer Key — Module 2.2

**Q1: A — 1/3**  
*P(3 or 5) = P(3) + P(5) = 1/6 + 1/6 = 2/6 = 1/3. Events are mutually exclusive.*

**Q2: True**  
*Addition rule for mutually exclusive events: P(A ∪ B) = P(A) + P(B) = 0.3 + 0.4 = 0.7.*

**Q3:**  
*Let S = spam, F = flagged. P(S) = 0.2, P(not S) = 0.8, P(F|S) = 0.95, P(F|not S) = 0.05.*  
*P(F) = P(F|S)×P(S) + P(F|not S)×P(not S) = 0.95×0.2 + 0.05×0.8 = 0.19 + 0.04 = 0.23*  
*P(S|F) = P(F|S)×P(S) / P(F) = 0.19 / 0.23 ≈ **0.826 (82.6%)**.*

**Q4: B**  
*Naive Bayes computes P(class | features) using Bayes' theorem: P(class|features) ∝ P(features|class) × P(class). The "naive" assumption is that features are conditionally independent.*

**Q5:**  
*(a) P(disease) = 0.001. P(positive|disease) = 0.99. P(positive|no disease) = 0.02.*  
*P(positive) = 0.99×0.001 + 0.02×0.999 = 0.00099 + 0.01998 = 0.02097*  
*P(disease|positive) = 0.00099 / 0.02097 ≈ **0.047 (4.7%)** — only about 1 in 20 positives actually has the disease!*  
*(b) The base rate is so low (0.1%) that even with a 99% accurate test, the false positives from the large healthy population swamp the true positives. This is the base rate fallacy — accuracy alone is misleading when prevalence is very low.*

---

## Module 2.3 — Probability Distributions

### Learning Objectives Covered
- Identify and apply common probability distributions
- Understand the Central Limit Theorem and its implications
- Implement distribution calculations with scipy.stats

---

### Module 2.3 Quiz

**Q1. [Multiple Choice — Beginner]**
Which distribution would best model the number of customer support tickets received per hour, given that they arrive independently at a constant average rate?

A) Normal B) Binomial C) Poisson D) Exponential

**Q2. [True/False — Intermediate]**
The Central Limit Theorem states that the sampling distribution of the sample mean approaches a normal distribution as sample size increases, regardless of the population's distribution shape.

**Q3. [Code Interpretation — Intermediate]**
What does this code compute?

```python
from scipy import stats
prob = stats.norm.cdf(1.96, loc=0, scale=1)
print(round(prob, 4))
```

A) 0.0250  B) 0.9750  C) 0.9500  D) 0.0500

**Q4. [Scenario-Based — Advanced]**
A factory produces bolts where the diameter follows a Normal distribution with mean = 10mm and std = 0.5mm. Quality control rejects bolts outside [9mm, 11mm].

(a) What percentage of bolts will be rejected? (Use the empirical rule)  
(b) Write the `scipy.stats` code to get the exact answer.

**Q5. [Short Answer — Advanced]**
Explain how the Central Limit Theorem enables hypothesis testing even when you don't know the population distribution.

---

### Answer Key — Module 2.3

**Q1: C — Poisson**  
*Poisson models the number of events occurring in a fixed interval when events are independent and occur at a constant average rate (λ). Classic examples: calls per hour, tickets per day, defects per unit.*

**Q2: True**  
*The CLT is one of the most important theorems in statistics. For large enough n (typically n≥30), the distribution of sample means approaches normal regardless of the underlying population shape.*

**Q3: B — 0.9750**  
*`stats.norm.cdf(1.96)` gives the probability that a standard normal variable is ≤ 1.96, which is approximately 0.9750 (97.5th percentile). This is the basis of the 95% confidence interval: the middle 95% lies between -1.96 and +1.96 standard deviations.*

**Q4:**  
*(a) 9mm = mean - 2σ, 11mm = mean + 2σ. By the empirical rule, ~95.4% of bolts fall within 2σ, so ~4.6% are rejected.*  
*(b):*
```python
from scipy import stats
dist = stats.norm(loc=10, scale=0.5)
prob_accepted = dist.cdf(11) - dist.cdf(9)
prob_rejected = 1 - prob_accepted
print(f"Rejection rate: {prob_rejected:.4%}")  # ≈ 4.55%
```

**Q5:**  
*Without CLT, we'd need to know the population distribution to conduct inference. CLT tells us that if we take many samples and compute their means, those means will be approximately normally distributed — even if individual observations follow a skewed or uniform distribution. This allows us to use t-tests and z-tests on sample means regardless of the population's shape, as long as the sample is large enough.*

---

## Module 2.4 — Inferential Statistics & Hypothesis Testing

### Learning Objectives Covered
- Set up null and alternative hypotheses correctly
- Conduct t-tests and chi-square tests using scipy.stats
- Interpret p-values correctly
- Understand Type I and Type II errors

---

### Module 2.4 Quiz

**Q1. [Multiple Choice — Beginner]**
A p-value of 0.03 in a hypothesis test with α = 0.05 means:

A) There is a 3% chance the null hypothesis is true  
B) There is a 97% chance the alternative hypothesis is true  
C) If the null hypothesis were true, there is a 3% chance of observing results at least as extreme as ours  
D) The effect size is small  

**Q2. [True/False — Beginner]**
Failing to reject the null hypothesis proves that the null hypothesis is true.

**Q3. [Multiple Choice — Intermediate]**
You want to test whether the average conversion rate differs between two versions of a landing page. Which statistical test is most appropriate?

A) Chi-square test of independence  
B) Two-sample independent t-test  
C) Paired t-test  
D) One-sample z-test  

**Q4. [Code Interpretation — Intermediate]**
What is this code testing, and how do you interpret the output?

```python
from scipy import stats
group_a = [52, 48, 55, 50, 53, 47, 51]
group_b = [58, 62, 60, 65, 59, 61, 63]

t_stat, p_value = stats.ttest_ind(group_a, group_b)
print(f"t={t_stat:.3f}, p={p_value:.4f}")
```

If the output is `t=-7.234, p=0.0001`, what do you conclude at α = 0.05?

**Q5. [Scenario-Based — Advanced]**
A Type I error in a clinical trial that tests a new drug means:

A) Declaring the drug effective when it actually is not  
B) Failing to detect that the drug is effective when it actually is  
C) The drug causes side effects  
D) The sample size was too small  

**Q6. [Short Answer — Advanced]**
A company runs 50 simultaneous A/B tests across their website, all using α = 0.05. How many tests would you expect to incorrectly declare "statistically significant" even if none of the changes actually had any effect? What technique addresses this problem?

---

### Answer Key — Module 2.4

**Q1: C**  
*A p-value is NOT the probability the null is true. It is: P(data | H₀ is true) — the probability of observing results at least as extreme as ours, assuming the null is true. A common misconception in interviews.*

**Q2: False**  
*Failing to reject H₀ does not prove H₀ is true. It means we don't have enough evidence to reject it. Absence of evidence is not evidence of absence. The test might have low statistical power.*

**Q3: B — Two-sample independent t-test**  
*Two separate, independent groups (page A visitors vs page B visitors) with a continuous outcome (conversion rate or time on page). Note: If conversion is binary (converted/not), a proportion z-test or chi-square would be appropriate.*

**Q4:**  
*The code tests whether the means of `group_a` and `group_b` are significantly different using an independent t-test. With t=-7.234 and p=0.0001 < 0.05: We **reject the null hypothesis**. There is strong statistical evidence that the means of the two groups differ significantly (group_b has a higher mean).*

**Q5: A**  
*Type I error = false positive = rejecting a true null hypothesis. In a drug trial: declaring the drug works when it doesn't. Type II error = false negative = failing to reject a false null hypothesis (missing a real effect).*

**Q6:**  
*With 50 tests at α=0.05, we expect 50 × 0.05 = **2.5 false positives** by chance alone, even with no real effects. This is the **multiple comparisons problem**. Solution: **Bonferroni correction** — divide α by the number of tests (0.05/50 = 0.001), or use the **Benjamini-Hochberg procedure** for controlling the False Discovery Rate (FDR), which is less conservative.*

---

## Module 2.5 — Linear Algebra for Data Science

### Learning Objectives Covered
- Perform matrix operations relevant to machine learning
- Understand the geometric interpretation of vectors
- Apply NumPy for linear algebra computations

---

### Module 2.5 Quiz

**Q1. [Multiple Choice — Beginner]**
In a dataset with 1000 rows and 20 features, the data matrix X has dimensions:

A) (20, 1000) B) (1000, 20) C) (20, 20) D) (1000, 1000)

**Q2. [Code Interpretation — Intermediate]**
What does this compute, and what is the result?

```python
import numpy as np
A = np.array([[1, 2], [3, 4]])
b = np.array([5, 6])
print(A @ b)
```

**Q3. [Short Answer — Advanced]**
Explain intuitively what eigenvalues and eigenvectors represent. Why are they important in Principal Component Analysis (PCA)?

---

### Answer Key — Module 2.5

**Q1: B — (1000, 20)**  
*Standard convention: rows = observations (1000 samples), columns = features (20 variables). This is the (n_samples, n_features) shape used by scikit-learn.*

**Q2:**  
*`A @ b` is matrix-vector multiplication. Result: `[1*5 + 2*6, 3*5 + 4*6]` = `[17, 39]`.*

**Q3:**  
*An eigenvector of a matrix A is a vector that doesn't change its direction when A is applied — only its length (scale) changes. That scale factor is the eigenvalue. Intuitively: eigenvectors point in the directions of maximum variance in the data. In PCA, the eigenvectors of the covariance matrix are the **principal components** — the directions of greatest variability. The corresponding eigenvalues tell you how much variance is explained in each direction, allowing you to rank and select the most informative dimensions.*

---

## Module 2.6 — Calculus Concepts (Intuition)

### Module 2.6 Quiz

**Q1. [Multiple Choice — Beginner]**
In the context of machine learning, gradient descent is used to:

A) Calculate the derivative of the activation function  
B) Iteratively update model parameters to minimize the loss function  
C) Compute the second derivative to find saddle points  
D) Scale features before training  

**Q2. [True/False — Intermediate]**
In gradient descent, a learning rate that is too high can cause the algorithm to overshoot the minimum and diverge.

**Q3. [Scenario-Based — Advanced]**
A loss function's gradient is computed as follows during training. Explain what each scenario means for the training process:

(a) Gradient is very large (e.g., 10,000)  
(b) Gradient is approximately 0  
(c) Gradient oscillates between large positive and negative values each epoch  

---

### Answer Key — Module 2.6

**Q1: B**  
*Gradient descent is an optimization algorithm. The gradient tells us the direction of steepest ascent; we move in the opposite direction (descent) to minimize loss.*

**Q2: True**  
*With a large learning rate, each update step is too large, causing the loss to bounce around the minimum or diverge entirely rather than converging. This is one of the most common training failures.*

**Q3:**  
*(a) Very large gradient: The model is far from the minimum — large parameter updates will occur. If the learning rate is also large, there's a risk of exploding gradients (especially in deep networks).*  
*(b) Gradient ≈ 0: Training has either converged to a minimum, is stuck at a local minimum, or is at a saddle point. The model is not learning.*  
*(c) Oscillating gradients: The learning rate is likely too high. The optimizer is bouncing between sides of the loss landscape. Reduce the learning rate or use adaptive optimizers like Adam.*

---

## Module 2.7 — A/B Testing & Experimental Design

### Learning Objectives Covered
- Design statistically valid A/B tests
- Calculate required sample sizes
- Interpret A/B test results correctly
- Understand practical pitfalls of A/B testing

---

### Module 2.7 Quiz

**Q1. [Multiple Choice — Beginner]**
The "control group" in an A/B test refers to:

A) The group that receives the experimental treatment  
B) The group that receives the original, unchanged experience  
C) The group used to validate the test results  
D) The larger of the two test groups  

**Q2. [True/False — Beginner]**
Statistical power of 80% means there is an 80% chance of detecting a real effect if one truly exists.

**Q3. [Scenario-Based — Intermediate]**
An e-commerce company wants to test whether changing the checkout button color from blue to green increases conversion rate. The current conversion rate is 5%. They want to detect a 1 percentage point improvement (to 6%) with 80% power and α = 0.05.

(a) What are the null and alternative hypotheses?  
(b) Should you use a one-tailed or two-tailed test here, and why?  
(c) Why must you calculate sample size BEFORE running the test?

**Q4. [Code Interpretation — Intermediate]**
Interpret this A/B test result:

```python
from scipy import stats
control = [0, 1, 0, 0, 1, 0, 0, 0, 1, 0]  # conversions
treatment = [1, 1, 0, 1, 1, 0, 1, 1, 0, 1]

t, p = stats.ttest_ind(control, treatment)
print(f"p-value: {p:.4f}")  # Output: p-value: 0.0267
```

With α = 0.05, what do you conclude? What caveat should you mention?

**Q5. [Scenario-Based — Advanced]**
A product manager reports: "We ran the test and got p=0.04 on day 3! Let's ship the green button." What are two critical problems with this approach?

**Q6. [Short Answer — Advanced]**
Explain the difference between statistical significance and practical significance. Give an example where a result is statistically significant but practically meaningless.

---

### Answer Key — Module 2.7

**Q1: B**  
*The control group receives the existing, unmodified experience. The treatment (or variant) group receives the change being tested.*

**Q2: True**  
*Statistical power (1 - β) = probability of correctly rejecting H₀ when it's false. 80% power means: if there's a real effect, we have an 80% chance of detecting it. Equivalently, a 20% chance of a Type II error (false negative).*

**Q3:**  
*(a) H₀: Conversion rate(green) = Conversion rate(blue) = 5%. H₁: Conversion rate(green) ≠ 5% (two-tailed) or H₁: Conversion rate(green) > 5% (one-tailed).*  
*(b) One-tailed test is defensible here — the business only cares if green is BETTER (not worse). However, two-tailed is safer statistically as it guards against being fooled if green performs worse but shows a large effect.*  
*(c) Pre-registration prevents p-hacking. If you check results during the test and stop when p < 0.05, your actual Type I error rate skyrockets above 5%. You must commit to sample size and duration before starting.*

**Q4:**  
*p = 0.0267 < 0.05, so we reject H₀ — the treatment (green button) shows statistically significantly higher conversion. Caveat: The sample (10 users each) is far too small for a reliable conclusion. This appears significant by chance. Real A/B tests require hundreds or thousands of users per variant.*

**Q5:**  
*(1) **Peeking problem**: Checking results daily and stopping early when p < 0.05 inflates the Type I error rate. If you check at many interim points, you're more likely to find a false positive by chance. Use fixed-horizon testing or sequential testing methods.*  
*(2) **Sample size too small after 3 days**: Unless they pre-calculated that 3 days would yield the required sample size, the test is likely underpowered and the result is unreliable.*

**Q6:**  
*Statistical significance means: given the sample, it's unlikely to see this result if H₀ were true. Practical significance means: the effect is large enough to matter in the real world. Example: A website tests font size changes. With 10 million users, a p-value of 0.0001 might be obtained for a 0.001% improvement in click rate — statistically highly significant, but a change of 0.001% will generate no meaningful business impact. Always compute effect size (Cohen's d) alongside p-values.*

---

# COURSE 02 — End-of-Course Assessment
## Mathematics & Statistics for Data Science (30 Questions)

**Q1.** [MCQ] The IQR equals Q3 − Q1. For data [1,3,5,7,9,11,13], what is the IQR?
A) 6  B) 8  C) 4  D) 12

**Q2.** [T/F] A correlation of -0.85 indicates a stronger linear relationship than a correlation of +0.70.

**Q3.** [Code] What is the result?
```python
import numpy as np
data = np.array([2, 4, 6, 8, 10])
print(np.std(data, ddof=1))
```
A) 2.0  B) 3.16  C) 8.0  D) 4.0

**Q4.** [MCQ] Which test compares the means of MORE than 2 groups simultaneously?
A) t-test  B) Chi-square  C) ANOVA  D) Pearson correlation

**Q5.** [T/F] P(A and B) = P(A) × P(B) only when A and B are independent.

**Q6.** [Data] A dataset's histogram shows a long left tail. This distribution is:
A) Right-skewed  B) Left-skewed  C) Normal  D) Bimodal

**Q7.** [MCQ] Which scipy function performs a two-sample t-test?
A) `stats.ttest_1samp`  B) `stats.ttest_ind`  C) `stats.ttest_rel`  D) `stats.f_oneway`

**Q8.** [T/F] The standard error of the mean decreases as sample size increases.

**Q9.** [MCQ] In matrix multiplication A × B, if A is (3×4) and B is (4×2), the result has shape:
A) (3×2)  B) (4×4)  C) (3×4)  D) (4×2)

**Q10.** [Short Answer] What is the difference between Type I and Type II errors? Which does α control?

**Q11.** [MCQ] A binomial distribution with n=10, p=0.3 models:
A) Continuous outcomes  B) Number of successes in 10 independent trials with P(success)=0.3
C) Average of 10 measurements  D) Exponential decay

**Q12.** [T/F] Gradient descent always converges to the global minimum.

**Q13.** [MCQ] What does a confidence interval of 95% mean?
A) There's a 95% chance the true mean falls in this interval  
B) If we repeat the study 100 times, approximately 95 intervals would contain the true mean  
C) 95% of data points fall in this range  D) The p-value is less than 0.05

**Q14.** [Code] What does `stats.chi2_contingency(observed)` test?
A) Whether a distribution is normal  B) Whether two categorical variables are independent  
C) Whether variances are equal  D) Whether means differ

**Q15.** [Scenario] You run 20 hypothesis tests with α=0.05 on unrelated variables. How many false positives do you expect by chance?
A) 0  B) 1  C) 5  D) 10

**Q16.** [T/F] Spearman correlation captures monotonic relationships and is more robust to outliers than Pearson.

**Q17.** [MCQ] The dot product of two perpendicular (orthogonal) vectors equals:
A) 1  B) -1  C) 0  D) Their product of magnitudes

**Q18.** [Short Answer] Explain why using "95% accuracy" as the sole metric is problematic for a fraud detection model where 99.5% of transactions are legitimate.

**Q19.** [MCQ] Which distribution assumption underlies a standard linear regression's error terms?
A) Poisson  B) Binomial  C) Normal (Gaussian)  D) Uniform

**Q20.** [T/F] Statistical power increases when sample size increases.

**Q21.** [MCQ] What does a Pearson correlation of 0 mean?
A) No relationship exists between the variables  
B) No linear relationship; a nonlinear relationship may still exist  
C) The variables are independent  D) The data has no variance

**Q22.** [Code Interpretation]
```python
x = np.random.normal(loc=50, scale=10, size=10000)
means = [np.mean(np.random.choice(x, 30)) for _ in range(1000)]
```
What principle does this simulation demonstrate?
A) Law of Large Numbers  B) Central Limit Theorem  C) Bayes' Theorem  D) Regression to Mean

**Q23.** [MCQ] Bootstrap resampling is used to:
A) Create synthetic training data  B) Estimate the sampling distribution of a statistic without assuming a distribution  
C) Validate a machine learning model  D) Balance imbalanced classes

**Q24.** [T/F] A one-tailed test is more powerful than a two-tailed test for the same α level and effect size.

**Q25.** [MCQ] You want to determine if smoking status (smoker/non-smoker) is associated with disease presence (yes/no). Which test is appropriate?
A) t-test  B) Pearson correlation  C) Chi-square test of independence  D) ANOVA

**Q26.** [Short Answer] What is the "novelty effect" in A/B testing and how does it bias results?

**Q27.** [MCQ] A p-value of 0.001 compared to a p-value of 0.04 (both below α=0.05) means:
A) The first result has a larger effect size  B) The first result is more statistically robust given the data  
C) The first experiment had more participants  D) The first result is more practically significant

**Q28.** [T/F] Variance is always non-negative.

**Q29.** [MCQ] Which NumPy function computes the dot product of two 1D arrays?
A) `np.multiply(a, b)`  B) `np.dot(a, b)`  C) `np.sum(a, b)`  D) `np.cross(a, b)`

**Q30.** [Scenario-Advanced] A data scientist reports a correlation of 0.92 between ice cream sales and drowning rates. They propose ice cream causes drownings. (a) What statistical concept explains this? (b) What is the likely confounding variable?

---

### End-of-Course Assessment — Answer Key (Course 02)

Q1:A (IQR=[1,3,5,7,9,11,13]; Q1=3, Q3=11, IQR=8 — wait: n=7, Q1=3rd value=5... Let me recalculate: sorted=[1,3,5,7,9,11,13]. Q1=median of lower half [1,3,5]=3. Q3=median of upper half [9,11,13]=11. IQR=11-3=8. Answer: **B**) | Q2:True (|-0.85|>|+0.70|) | Q3:B (ddof=1 gives sample std; variance=[(2-6)²+(4-6)²+(6-6)²+(8-6)²+(10-6)²]/4=40/4=10; std=√10≈3.16) | Q4:C | Q5:True | Q6:B | Q7:B | Q8:True (SE=σ/√n) | Q9:A | Q10: Type I=false positive (reject true H₀), α controls Type I error rate; Type II=false negative (fail to reject false H₀), β controls Type II | Q11:B | Q12:False (can get stuck in local minima for non-convex loss surfaces) | Q13:B | Q14:B | Q15:B (20×0.05=1) | Q16:True | Q17:C | Q18:A model that predicts "not fraud" for all transactions achieves 99.5% accuracy but catches 0 fraudulent transactions; accuracy is meaningless for highly imbalanced classes | Q19:C | Q20:True | Q21:B | Q22:B | Q23:B | Q24:True (concentrates the rejection region on one tail) | Q25:C | Q26: Users behave differently simply because something is new (novelty), not because the change is genuinely better; early test results may be inflated, disappearing over time | Q27:B (lower p-value means results are more extreme under H₀; doesn't imply larger effect size) | Q28:True (sum of squares is always ≥0) | Q29:B | Q30: (a) Spurious correlation / confounding; (b) Hot weather — summer causes more swimming (more drownings) AND more ice cream sales

---

## Course 02 — Practical Assignment

### Title: Statistical Analysis Report — Public Health Dataset

**Objective:** Conduct a complete statistical analysis of a public health dataset, applying every major concept from this course.

**Dataset:** CDC NHANES Data or WHO Global Health Observatory  
**Suggested focus:** Relationship between BMI, physical activity, age, and blood pressure

**Requirements:**
1. Load dataset and compute full descriptive statistics for 5 key variables
2. Plot distributions (histogram + box plot) and identify skewness
3. Conduct at least 3 hypothesis tests (one t-test, one chi-square, one ANOVA or correlation test) using `scipy.stats`
4. Correctly state H₀ and H₁ for each test; interpret p-values
5. Compute and visualize the correlation matrix
6. Simulate an A/B test: split the dataset by a binary variable (e.g., smoker/non-smoker) and test whether BMI differs significantly between groups
7. Calculate the required sample size for your A/B test using `statsmodels.stats.power`
8. Apply Bonferroni correction if running multiple tests
9. Write a 1-page non-technical executive summary of findings

**Expected Deliverables:**
- Jupyter Notebook with narrative, code, and visualizations
- Every statistical test output must be followed by a written interpretation
- Executive summary PDF or Markdown document
- GitHub repository with README

**Grading Rubric:**

| Category | Points |
|----------|--------|
| Descriptive statistics complete and correct | 15 |
| Visualizations appropriate and labeled | 10 |
| Hypothesis tests correctly set up (H₀/H₁) | 15 |
| p-value interpretation correct | 15 |
| A/B test simulation | 15 |
| Sample size calculation | 10 |
| Bonferroni correction applied | 5 |
| Executive summary (clarity, accuracy) | 15 |
| **Total** | **100** |

---

---

# COURSE 03 — Data Wrangling with NumPy & Pandas

---

## Module 3.1 — NumPy Fundamentals

### Learning Objectives Covered
- Create and manipulate NumPy arrays
- Apply broadcasting rules
- Use vectorized operations for efficiency

---

### Module 3.1 Quiz

**Q1. [Multiple Choice — Beginner]**
What is the shape of the array created by `np.zeros((3, 4))`?

A) A 1D array of 12 zeros  
B) A 3-row, 4-column matrix of zeros  
C) A 4-row, 3-column matrix of zeros  
D) Error — zeros requires a single integer  

**Q2. [Code Interpretation — Beginner]**
What is the output?

```python
import numpy as np
a = np.array([1, 2, 3, 4, 5])
print(a[1:4])
print(a[-1])
```

**Q3. [True/False — Beginner]**
Unlike Python lists, NumPy arrays can contain elements of different data types in the same array.

**Q4. [Code Interpretation — Intermediate]**
Explain what broadcasting does in this code, and what the output shape will be:

```python
a = np.array([[1, 2, 3], [4, 5, 6]])   # shape (2, 3)
b = np.array([10, 20, 30])              # shape (3,)
result = a + b
print(result.shape, result)
```

**Q5. [Multiple Choice — Intermediate]**
Which NumPy operation is most efficient for computing the sum of all elements in a large 2D array?

A) A Python `for` loop with accumulator  
B) `np.sum(array)`  
C) `sum(array.flatten())`  
D) `array.apply(sum)`  

**Q6. [Scenario-Based — Advanced]**
You have a NumPy array of 1 million pixel values (0–255, int) from a grayscale image. You need to normalize them to the range [0, 1]. Write the one-line NumPy expression to do this efficiently (no loops).

**Q7. [Code Interpretation — Advanced]**
What is the output and why does it differ from expected?

```python
a = np.array([1, 2, 3])
b = a
b[0] = 99
print(a)
```

---

### Answer Key — Module 3.1

**Q1: B**  
*`np.zeros((3, 4))` creates a 2D array with 3 rows and 4 columns. The tuple argument specifies shape: (rows, columns).*

**Q2:**  
*`a[1:4]` → `[2, 3, 4]` (indices 1, 2, 3). `a[-1]` → `5` (last element).*

**Q3: False**  
*NumPy arrays are homogeneous — all elements must be the same dtype. If you mix types, NumPy upcasts to accommodate (e.g., int + float → float). Python lists can hold mixed types.*

**Q4:**  
*Broadcasting: `b` (shape 3) is broadcast across each row of `a` (shape 2×3). NumPy adds 10 to column 0, 20 to column 1, 30 to column 2 for both rows. Result shape: (2, 3). Values: `[[11, 22, 33], [14, 25, 36]]`.*

**Q5: B**  
*`np.sum()` is vectorized — implemented in compiled C. It is orders of magnitude faster than a Python loop for large arrays.*

**Q6:**  
```python
normalized = pixels / 255.0
```
*Division by 255 vectorizes across all million elements simultaneously.*

**Q7:**  
*Output: `[99, 2, 3]`. In NumPy, `b = a` does NOT create a copy — both `a` and `b` point to the same underlying memory buffer. Modifying `b[0]` also modifies `a[0]`. To create an independent copy, use `b = a.copy()`.*

---

## Module 3.2 — Pandas Series & DataFrames

### Module 3.2 Quiz

**Q1. [Multiple Choice — Beginner]**
Which Pandas method provides a quick statistical summary including count, mean, std, min, quartiles, and max for numerical columns?

A) `df.info()`  B) `df.head()`  C) `df.describe()`  D) `df.summary()`

**Q2. [Code Interpretation — Beginner]**
What does `df.loc[2, "salary"]` return, and how does it differ from `df.iloc[2, 3]`?

**Q3. [Multiple Choice — Intermediate]**
You want to select all rows where `age > 30` AND `salary < 80000`. Which is correct?

A) `df[df["age"] > 30 and df["salary"] < 80000]`  
B) `df[(df["age"] > 30) & (df["salary"] < 80000)]`  
C) `df[df["age"] > 30 & df["salary"] < 80000]`  
D) `df.filter(age>30, salary<80000)`  

**Q4. [Scenario-Based — Advanced]**
Given this DataFrame:

```python
df = pd.DataFrame({
    "name": ["Alice", "Bob", "Carol"],
    "salary": [90000, 72000, 85000],
    "dept": ["Eng", "Marketing", "Eng"]
})
```

Write a single line of Pandas code that filters for Engineering employees and returns only the `name` and `salary` columns, sorted by salary descending.

---

### Answer Key — Module 3.2

**Q1: C**  
*`describe()` generates descriptive statistics for numeric columns. `info()` shows dtypes and non-null counts.*

**Q2:**  
*`df.loc[2, "salary"]` uses label-based indexing — row with **index label** 2, column named "salary". `df.iloc[2, 3]` uses integer position-based indexing — row at position 2 (0-based), column at position 3. They differ when the index is not the default 0,1,2,... range.*

**Q3: B**  
*Pandas boolean indexing requires `&` (bitwise AND), not Python's `and`. The conditions must each be wrapped in parentheses because `&` has higher precedence than `>`.*

**Q4:**
```python
result = df[df["dept"] == "Eng"][["name", "salary"]].sort_values("salary", ascending=False)
```

---

## Module 3.3 — Data Cleaning & Preprocessing

### Module 3.3 Quiz

**Q1. [Multiple Choice — Beginner]**
Which Pandas method detects missing values in a DataFrame?

A) `df.missing()` B) `df.isna()` C) `df.null()` D) `df.check_na()`

**Q2. [True/False — Beginner]**
`df.dropna()` drops any row that has at least one missing value.

**Q3. [Code Interpretation — Intermediate]**
What does this code do to the `age` column, and when might you prefer this over dropping rows?

```python
df["age"].fillna(df["age"].median(), inplace=True)
```

**Q4. [Scenario-Based — Advanced]**
A real estate dataset has a column `price` with 15% missing values. Propose a decision framework for choosing between (a) dropping missing rows, (b) mean imputation, (c) median imputation, and (d) model-based imputation. What factors would determine your choice?

**Q5. [Code Interpretation — Advanced]**
What does this code detect, and what does a high percentage signal about the column?

```python
missing_pct = df.isnull().sum() / len(df) * 100
print(missing_pct.sort_values(ascending=False).head(10))
```

---

### Answer Key — Module 3.3

**Q1: B — `df.isna()`**  
*(Also `df.isnull()` — they are aliases.)*

**Q2: True**  
*By default, `dropna()` drops any row containing at least one NaN. Use `thresh` to require a minimum number of non-null values, or `subset` to check specific columns.*

**Q3:**  
*Fills missing `age` values with the column's median. Preferred over dropping when: missing data is limited (< ~20%), rows are expensive to lose, and the missing mechanism is MCAR or MAR. Median is more robust than mean when the distribution is skewed or has outliers.*

**Q4:**  
*Framework:*  
*(a) Drop rows: Only if <5% missing AND missingness is MCAR (random). Risky if missing is systematic.*  
*(b) Mean: Only for roughly symmetric, normally distributed data with no outliers.*  
*(c) Median: When distribution is skewed or has outliers (prices often are).*  
*(d) Model-based (KNN imputation, iterative): When >5% missing, when missing data correlates with other features, or when accuracy is critical. Computationally expensive but produces better estimates.*  
*For a `price` column with 15% missing: first check if missing prices correlate with property type, location, or age — if so, model-based imputation is most appropriate.*

**Q5:**  
*Computes the percentage of missing values per column, sorted descending. A high percentage (e.g., >30%) signals that the column has too many missing values to impute reliably — the column may need to be dropped entirely, or missing could be informative (presence/absence is itself a feature).*

---

## Module 3.4 — Groupby, Aggregation & Transformation

### Module 3.4 Quiz

**Q1. [Code Interpretation — Beginner]**
What does this code compute?

```python
result = df.groupby("department")["salary"].mean()
```

**Q2. [Code Interpretation — Intermediate]**
What is the difference between `groupby().agg()` and `groupby().transform()`? Give a use case for each.

**Q3. [Code Interpretation — Advanced]**
You have sales data with columns `[store, month, revenue]`. Write Pandas code that adds a column `pct_of_monthly_total` showing each store's revenue as a percentage of that month's total revenue.

---

### Answer Key — Module 3.4

**Q1:**  
*Computes the mean salary for each unique department. Returns a Series with department names as index and average salaries as values.*

**Q2:**  
*`agg()`: Reduces each group to a single summary value — returns a DataFrame with fewer rows than the original. Use case: computing mean sales by region.*  
*`transform()`: Returns a Series/DataFrame with the same shape as the original, where each value is replaced by its group's aggregate. Use case: computing each row's deviation from its group mean, or filling missing values with group-level statistics.*

**Q3:**
```python
monthly_total = df.groupby("month")["revenue"].transform("sum")
df["pct_of_monthly_total"] = df["revenue"] / monthly_total * 100
```

---

## Module 3.5 — Merging, Joining & Reshaping

### Module 3.5 Quiz

**Q1. [Multiple Choice — Beginner]**
A `LEFT JOIN` in Pandas `merge()` keeps:

A) Only rows where keys match in both DataFrames  
B) All rows from the left DataFrame, with NaN for unmatched right rows  
C) All rows from both DataFrames  
D) Only rows from the right DataFrame  

**Q2. [Scenario-Based — Intermediate]**
You have two DataFrames: `orders` (order_id, customer_id, amount) and `customers` (customer_id, name, country). Write a `pd.merge()` call to join them so ALL orders are kept, even if the customer record is missing.

**Q3. [Code Interpretation — Advanced]**
What does `pd.melt()` do? Given a "wide" DataFrame with columns `[student, math_score, science_score, english_score]`, write a `melt()` call that produces a "long" format with columns `[student, subject, score]`.

---

### Answer Key — Module 3.5

**Q1: B**  
*LEFT JOIN keeps all rows from the left DataFrame. Rows from the right that don't match get NaN in the joined columns.*

**Q2:**
```python
result = pd.merge(orders, customers, on="customer_id", how="left")
```

**Q3:**  
*`pd.melt()` converts a wide DataFrame to long format — turning column headers into values in a new "variable" column. It is the inverse of pivot.*
```python
long_df = pd.melt(
    df,
    id_vars=["student"],
    value_vars=["math_score", "science_score", "english_score"],
    var_name="subject",
    value_name="score"
)
```

---

## Module 3.6 — DateTime & Time Series Data

### Module 3.6 Quiz

**Q1. [Code Interpretation — Beginner]**
What does `pd.to_datetime(df["date"])` do?

**Q2. [Scenario-Based — Intermediate]**
You have daily sales data with a datetime index. Write Pandas code to compute the monthly total revenue using resampling.

**Q3. [Code Interpretation — Advanced]**
Explain what `df["sales"].rolling(7).mean()` computes and why this is useful for time series analysis.

---

### Answer Key — Module 3.6

**Q1:**  
*Converts the `date` column from string or other format to Pandas `datetime64` dtype, enabling time-based operations like resampling, filtering by date range, and extracting date components.*

**Q2:**
```python
monthly_revenue = df.resample("ME")["revenue"].sum()
```
*Note: `"M"` (deprecated in newer Pandas) or `"ME"` (Month End) resamples to monthly frequency.*

**Q3:**  
*Computes a 7-day rolling (moving) average — for each day, takes the mean of that day and the 6 preceding days. This smooths out short-term fluctuations (noise) and makes longer-term trends more visible. Useful for detecting trends in noisy time series like daily sales, stock prices, or web traffic.*

---

## Module 3.7 — Modern Data Formats, Memory & Polars Awareness

### Module 3.7 Quiz

**Q1. [Multiple Choice — Beginner]**
What is the key advantage of Parquet over CSV for data storage?

A) Parquet is human-readable in any text editor  
B) Parquet stores data by column (columnar format), enabling faster analytical queries and efficient compression  
C) Parquet is the only format supported by cloud services  
D) Parquet requires no additional libraries to read  

**Q2. [True/False — Beginner]**
`pd.read_parquet()` requires the entire file to be loaded into memory before you can query it.

**Q3. [Code Interpretation — Intermediate]**
What does `pd.json_normalize()` do, and why is it needed for this data?

```python
import pandas as pd
data = [
    {"name": "Alice", "address": {"city": "NYC", "state": "NY"}},
    {"name": "Bob", "address": {"city": "LA", "state": "CA"}}
]
df = pd.json_normalize(data, sep="_")
```

**Q4. [Scenario-Based — Advanced]**
You need to process a 50GB CSV file on a machine with 16GB of RAM. Pandas `pd.read_csv("data.csv")` fails with a MemoryError. Describe two approaches using Pandas/Python features covered in this module.

**Q5. [Multiple Choice — Advanced]**
Which dtype change would most significantly reduce memory usage for a column with 5 unique string values repeated across 1 million rows?

A) Converting from `object` to `str`  
B) Converting from `object` to `category`  
C) Converting from `object` to `int64`  
D) Converting from `object` to `float32`  

---

### Answer Key — Module 3.7

**Q1: B**  
*Columnar storage means analytical queries that read only a few columns scan only those columns' data, not the entire row. Combined with compression (Parquet achieves 5–10x better compression than CSV for tabular data), this dramatically reduces I/O.*

**Q2: False**  
*Parquet supports predicate pushdown and column projection — query engines can read only specific columns or filter rows at the storage level without loading the entire file.*

**Q3:**  
*`pd.json_normalize()` flattens nested JSON (dictionaries within dictionaries) into a flat DataFrame. Without it, the `address` column would contain a dictionary object in each cell. The `sep="_"` argument names the flattened columns with underscores: `address_city`, `address_state`.*

**Q4:**  
*(1) **Chunked reading**: Use `pd.read_csv("data.csv", chunksize=100000)` to process the file in chunks of 100,000 rows at a time, aggregating results incrementally.*  
*(2) **Convert to Parquet first** (if possible, using a tool that can stream): Then use DuckDB to query it with SQL without loading the full file: `import duckdb; duckdb.query("SELECT * FROM 'data.parquet' WHERE condition").df()`*

**Q5: B — category**  
*For a column with only 5 unique strings repeated 1M times, storing it as `object` dtype allocates a separate string object per row (~50MB+). Converting to `category` stores an integer code per row (mapping to a small lookup table of 5 strings), typically reducing memory by 90%+.*

---

# COURSE 03 — End-of-Course Assessment
## Data Wrangling with NumPy & Pandas (30 Questions)

**Q1.** [Code] What is the output?
```python
import numpy as np
a = np.array([[1, 2], [3, 4]])
print(a.T)
```
A) `[[1,2],[3,4]]` B) `[[1,3],[2,4]]` C) `[[4,3],[2,1]]` D) Error

**Q2.** [T/F] `df.copy()` creates a deep copy — modifying it does not affect the original DataFrame.

**Q3.** [MCQ] Which Pandas function stacks two DataFrames vertically (row-wise)?
A) `pd.merge()` B) `pd.concat([df1, df2], axis=0)` C) `pd.concat([df1, df2], axis=1)` D) `df.append(df2)`

**Q4.** [Code] What is the output?
```python
import numpy as np
a = np.arange(12).reshape(3, 4)
print(a[:, 1])
```
A) `[0, 1, 2, 3]` B) `[1, 5, 9]` C) `[4, 5, 6, 7]` D) `[1, 2, 3]`

**Q5.** [MCQ] Which method converts a Pandas column to datetime?
A) `pd.convert_datetime()` B) `pd.to_datetime(df["col"])` C) `df["col"].to_date()` D) `datetime.parse(df["col"])`

**Q6.** [T/F] `df.groupby("col").mean()` returns a DataFrame with the same number of rows as the original.

**Q7.** [MCQ] The `how="inner"` option in `pd.merge()`:
A) Keeps all rows from both DataFrames B) Keeps only rows with matching keys in both DataFrames C) Keeps all rows from the left D) Adds a new column

**Q8.** [Short Answer] What is the difference between `df.loc[]` and `df.iloc[]`?

**Q9.** [Code] What is the result?
```python
import numpy as np
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
print(np.dot(a, b))
```
A) `[4, 10, 18]` B) `32` C) `15` D) Error

**Q10.** [MCQ] After loading a CSV, you discover a numeric column has dtype `object`. What is the most likely cause?
A) The column has too many values B) The column contains non-numeric characters (e.g., "$", ",") C) The CSV was compressed D) The column has more than 100 unique values

**Q11.** [T/F] `df.fillna(method="ffill")` fills missing values using the NEXT valid observation.

**Q12.** [Code] What does this produce?
```python
df = pd.DataFrame({"A": [1,2,3], "B": [4,5,6]})
print(df.apply(lambda x: x.max() - x.min()))
```
A) A Series with max-min per column B) A single value C) Error D) The same DataFrame

**Q13.** [MCQ] What is the Pandas equivalent of SQL's `GROUP BY department HAVING COUNT(*) > 5`?
A) `df.groupby("dept").count().query("count > 5")`
B) `df.groupby("dept").filter(lambda x: len(x) > 5)`
C) `df[df.groupby("dept").count() > 5]`
D) `df.groupby("dept").having(5)`

**Q14.** [T/F] Parquet format preserves column data types when saving and loading, unlike CSV which stores everything as text.

**Q15.** [MCQ] To extract the month from a datetime column `df["date"]`, you use:
A) `df["date"].month` B) `df["date"].dt.month` C) `df["date"].get_month()` D) `pd.month(df["date"])`

**Q16.** [Short Answer] What is broadcasting in NumPy and why is it important for performance?

**Q17.** [Code] What is the output shape?
```python
import numpy as np
a = np.ones((4, 1))
b = np.ones((1, 3))
print((a + b).shape)
```

**Q18.** [MCQ] `df.pivot_table(values="sales", index="region", columns="month", aggfunc="sum")` creates:
A) A long-format DataFrame B) A cross-tabulation with regions as rows, months as columns, summed sales as values C) A correlation matrix D) A new column for each month

**Q19.** [T/F] `df.drop_duplicates(subset=["email"])` keeps the first occurrence of each duplicate email by default.

**Q20.** [MCQ] Which is the most memory-efficient way to read a 10GB CSV in Pandas?
A) `pd.read_csv("file.csv")` B) `pd.read_csv("file.csv", chunksize=50000)` C) `pd.read_parquet("file.csv")` D) `pd.read_table("file.csv")`

**Q21.** [Short Answer] Explain the difference between `INNER JOIN` and `LEFT JOIN` in Pandas merges.

**Q22.** [Code] What is the result?
```python
df = pd.DataFrame({"val": [1, None, 3, None, 5]})
df["val"].interpolate()
```
A) Drops NaN rows B) Fills NaN with linear interpolation C) Fills NaN with mean D) Replaces NaN with 0

**Q23.** [MCQ] Which operation converts a wide DataFrame to long format?
A) `df.pivot()` B) `df.melt()` C) `df.stack()` D) Both B and C

**Q24.** [T/F] A 7-day rolling mean on daily data produces values for the first 6 days (they have NaN by default).

**Q25.** [MCQ] What does `df.memory_usage(deep=True)` report?
A) The size of the DataFrame on disk B) The actual RAM used by each column, including Python object overhead C) The number of cells in the DataFrame D) CPU usage during computation

**Q26.** [Scenario] A column `price` contains values like `"$1,234.56"`. Write Pandas code to convert it to a numeric float.

**Q27.** [T/F] `pd.json_normalize()` can handle nested JSON objects but not nested arrays (lists) within JSON.

**Q28.** [MCQ] Polars compared to Pandas:
A) Uses Python loops internally B) Is slower but has more features C) Uses Rust under the hood and is often 5-10x faster for large datasets D) Only works on Linux

**Q29.** [Short Answer] Why should you avoid using Python `for` loops on Pandas DataFrames? What should you use instead?

**Q30.** [Scenario-Advanced] You receive a Parquet file with 500 columns and 10 million rows. You only need 3 specific columns. Write the Pandas code that reads only those 3 columns from the Parquet file without loading the rest into memory.

---

### Answer Key — Course 03 End-of-Course Assessment

Q1:B | Q2:True | Q3:B | Q4:B (column at index 1 across all rows: [1, 5, 9]) | Q5:B | Q6:False (groupby aggregation reduces rows to one per group) | Q7:B | Q8: loc uses index labels; iloc uses integer positions | Q9:B (1×4 + 2×5 + 3×6 = 4+10+18=32) | Q10:B | Q11:False (ffill=forward fill uses PREVIOUS valid observation; bfill uses next) | Q12:A | Q13:B | Q14:True | Q15:B | Q16: Broadcasting allows NumPy to perform operations on arrays of different shapes without copying data, by virtually expanding smaller arrays to match larger ones — enables vectorized operations without Python loops | Q17: (4,3) — NumPy broadcasts (4,1)+(1,3)→(4,3) | Q18:B | Q19:True | Q20:B | Q21: INNER: only matching rows from both DataFrames; LEFT: all rows from left, NaN for non-matching right rows | Q22:B | Q23:D | Q24:True (first 6 values don't have 7 preceding days) | Q25:B | Q26: `df["price"].str.replace("$","",regex=False).str.replace(",","",regex=False).astype(float)` | Q27:False — `pd.json_normalize()` handles nested arrays too via the `record_path` parameter | Q28:C | Q29: Python loops iterate row by row in Python space, losing vectorization speed; use `.apply()`, `.map()`, `.groupby()`, broadcasting, or vectorized Pandas/NumPy operations | Q30: `pd.read_parquet("file.parquet", columns=["col1", "col2", "col3"])`

---

## Course 03 — Practical Assignment

### Title: Data Cleaning Deep Dive — Real Messy Dataset

**Objective:** Apply the complete data wrangling pipeline to a real-world messy dataset.

**Dataset:** NYC 311 Service Requests from NYC OpenData OR US COVID-19 Data (NYT GitHub)

**Requirements:**
1. Load dataset and perform initial profiling (`df.info()`, `df.describe()`, missing value analysis)
2. Identify and document all data quality issues: missing values, wrong dtypes, duplicates, outliers, inconsistent formatting
3. Fix all issues programmatically (no manual edits)
4. Parse and convert all datetime columns correctly
5. Perform a groupby analysis answering 3 business questions (e.g., "What are the top 5 complaint types?")
6. Complete at least one merge with an external dataset
7. Flatten one nested JSON data source using `pd.json_normalize()`
8. Export the cleaned dataset to both CSV and Parquet; compare file sizes
9. Optimize memory: downcast dtypes and convert appropriate columns to `category`
10. Document before/after: memory usage before and after optimization

**Deliverables:**
- Jupyter Notebook with documented pipeline
- Clean CSV and Parquet output files
- Markdown summary: data issues found + business insights + memory savings achieved

**Grading Rubric:**

| Category | Points |
|----------|--------|
| Initial profiling complete | 10 |
| All data issues identified and documented | 15 |
| Cleaning steps implemented correctly | 20 |
| DateTime handling | 10 |
| Groupby analysis with 3 business questions | 15 |
| JSON normalization exercise | 10 |
| Parquet export + file size comparison | 10 |
| Memory optimization with before/after | 10 |
| **Total** | **100** |
