/**
 * Skill Taxonomy — Canonical skill registry for Fixeth LMS
 *
 * Rules:
 * - Skill keys are lowercase, hyphen-separated canonical IDs
 * - All skill matching normalizes through `resolveSkill(raw)` → canonical key
 * - Aliases handle common abbreviations and variations
 * - Skills map 1:1 to job posting required_skills arrays
 */

export type SkillCategory =
  | "programming"
  | "data-analysis"
  | "machine-learning"
  | "deep-learning"
  | "statistics"
  | "databases"
  | "visualization"
  | "mlops"
  | "mathematics"
  | "tools"
  | "soft-skills";

export type SkillDef = {
  id: string;
  label: string;
  labelBn?: string;
  category: SkillCategory;
  aliases: string[];
};

// ── Master Skill List ─────────────────────────────────────────────────────────
export const SKILL_TAXONOMY: Record<string, SkillDef> = {
  // ── Programming ────────────────────────────────────────────────────────────
  "python": {
    id: "python",
    label: "Python",
    labelBn: "পাইথন",
    category: "programming",
    aliases: ["python3", "py", "python programming", "python scripting"]
  },
  "javascript": {
    id: "javascript",
    label: "JavaScript",
    labelBn: "জাভাস্ক্রিপ্ট",
    category: "programming",
    aliases: ["js", "es6", "ecmascript", "vanilla js"]
  },
  "sql": {
    id: "sql",
    label: "SQL",
    labelBn: "এসকিউএল",
    category: "databases",
    aliases: ["mysql", "psql", "relational", "structured query language"]
  },
  "git": {
    id: "git",
    label: "Git & GitHub",
    labelBn: "গিট ও গিটহাব",
    category: "tools",
    aliases: ["github", "version control", "git version control", "vcs"]
  },
  "bash": {
    id: "bash",
    label: "Bash / Shell",
    labelBn: "ব্যাশ",
    category: "programming",
    aliases: ["shell", "linux cli", "command line", "terminal", "cmd"]
  },
  "r-lang": {
    id: "r-lang",
    label: "R",
    labelBn: "আর",
    category: "programming",
    aliases: ["r language", "r programming", "rstudio"]
  },
  "oop": {
    id: "oop",
    label: "Object-Oriented Programming",
    labelBn: "অবজেক্ট-ওরিয়েন্টেড প্রোগ্রামিং",
    category: "programming",
    aliases: ["object oriented", "oop concepts", "classes and objects"]
  },
  "api-integration": {
    id: "api-integration",
    label: "REST API Integration",
    labelBn: "REST API ইন্টিগ্রেশন",
    category: "programming",
    aliases: ["rest api", "api calls", "requests library", "http api", "json api"]
  },

  // ── Data Analysis ──────────────────────────────────────────────────────────
  "numpy": {
    id: "numpy",
    label: "NumPy",
    labelBn: "নামপাই",
    category: "data-analysis",
    aliases: ["numpy arrays", "numerical python", "np"]
  },
  "pandas": {
    id: "pandas",
    label: "Pandas",
    labelBn: "প্যান্ডাস",
    category: "data-analysis",
    aliases: ["pandas dataframe", "pd", "data manipulation"]
  },
  "data-wrangling": {
    id: "data-wrangling",
    label: "Data Wrangling",
    labelBn: "ডেটা র‍্যাংলিং",
    category: "data-analysis",
    aliases: ["data cleaning", "data preprocessing", "etl", "data transformation"]
  },
  "eda": {
    id: "eda",
    label: "Exploratory Data Analysis",
    labelBn: "EDA",
    category: "data-analysis",
    aliases: ["exploratory data analysis", "eda", "data exploration"]
  },
  "feature-engineering": {
    id: "feature-engineering",
    label: "Feature Engineering",
    labelBn: "ফিচার ইঞ্জিনিয়ারিং",
    category: "data-analysis",
    aliases: ["feature creation", "feature extraction", "feature construction"]
  },
  "feature-selection": {
    id: "feature-selection",
    label: "Feature Selection",
    labelBn: "ফিচার সিলেকশন",
    category: "data-analysis",
    aliases: ["variable selection", "feature importance", "dimensionality"]
  },
  "time-series": {
    id: "time-series",
    label: "Time Series Analysis",
    labelBn: "টাইম সিরিজ",
    category: "data-analysis",
    aliases: ["time series", "temporal data", "arima", "forecasting", "prophet"]
  },

  // ── Statistics ─────────────────────────────────────────────────────────────
  "statistics": {
    id: "statistics",
    label: "Statistics",
    labelBn: "পরিসংখ্যান",
    category: "statistics",
    aliases: ["descriptive statistics", "statistical analysis", "stats"]
  },
  "probability": {
    id: "probability",
    label: "Probability Theory",
    labelBn: "সম্ভাব্যতা",
    category: "statistics",
    aliases: ["probability", "bayes theorem", "conditional probability"]
  },
  "hypothesis-testing": {
    id: "hypothesis-testing",
    label: "Hypothesis Testing",
    labelBn: "হাইপোথিসিস টেস্টিং",
    category: "statistics",
    aliases: ["t-test", "chi-square", "anova", "p-value", "inferential statistics"]
  },
  "ab-testing": {
    id: "ab-testing",
    label: "A/B Testing",
    labelBn: "A/B টেস্টিং",
    category: "statistics",
    aliases: ["ab testing", "a/b test", "experiment design", "split testing"]
  },
  "linear-algebra": {
    id: "linear-algebra",
    label: "Linear Algebra",
    labelBn: "রৈখিক বীজগণিত",
    category: "mathematics",
    aliases: ["matrix operations", "vectors", "matrices", "dot product", "eigenvalues"]
  },
  "calculus": {
    id: "calculus",
    label: "Calculus",
    labelBn: "ক্যালকুলাস",
    category: "mathematics",
    aliases: ["derivatives", "gradients", "gradient descent", "backpropagation calculus"]
  },

  // ── Visualization ──────────────────────────────────────────────────────────
  "matplotlib": {
    id: "matplotlib",
    label: "Matplotlib",
    labelBn: "ম্যাটপ্লটলিব",
    category: "visualization",
    aliases: ["plt", "matplotlib pyplot"]
  },
  "seaborn": {
    id: "seaborn",
    label: "Seaborn",
    labelBn: "সিবর্ন",
    category: "visualization",
    aliases: ["sns", "seaborn plots"]
  },
  "plotly": {
    id: "plotly",
    label: "Plotly",
    labelBn: "প্লটলি",
    category: "visualization",
    aliases: ["plotly express", "plotly interactive", "px"]
  },
  "data-visualization": {
    id: "data-visualization",
    label: "Data Visualization",
    labelBn: "ডেটা ভিজুয়ালাইজেশন",
    category: "visualization",
    aliases: ["data viz", "charts", "graphs", "visualization", "charts and graphs"]
  },
  "tableau": {
    id: "tableau",
    label: "Tableau",
    labelBn: "ট্যাবলো",
    category: "visualization",
    aliases: ["tableau public", "tableau desktop"]
  },
  "power-bi": {
    id: "power-bi",
    label: "Power BI",
    labelBn: "পাওয়ার বিআই",
    category: "visualization",
    aliases: ["powerbi", "microsoft power bi", "pbi"]
  },
  "looker-studio": {
    id: "looker-studio",
    label: "Google Looker Studio",
    labelBn: "লুকার স্টুডিও",
    category: "visualization",
    aliases: ["looker studio", "google data studio", "data studio"]
  },

  // ── Databases ──────────────────────────────────────────────────────────────
  "postgresql": {
    id: "postgresql",
    label: "PostgreSQL",
    labelBn: "পোস্টগ্রেসকিউএল",
    category: "databases",
    aliases: ["postgres", "psql", "postgresql database"]
  },
  "sql-advanced": {
    id: "sql-advanced",
    label: "Advanced SQL",
    labelBn: "অ্যাডভান্সড SQL",
    category: "databases",
    aliases: ["window functions", "cte", "common table expressions", "sql analytics"]
  },
  "dbt": {
    id: "dbt",
    label: "dbt Core",
    labelBn: "dbt",
    category: "databases",
    aliases: ["dbt core", "data build tool", "dbt models"]
  },
  "duckdb": {
    id: "duckdb",
    label: "DuckDB",
    labelBn: "ডাকডিবি",
    category: "databases",
    aliases: ["duck db", "duckdb sql"]
  },
  "sqlite": {
    id: "sqlite",
    label: "SQLite",
    labelBn: "SQLite",
    category: "databases",
    aliases: ["sqlite3"]
  },

  // ── Machine Learning ────────────────────────────────────────────────────────
  "machine-learning": {
    id: "machine-learning",
    label: "Machine Learning",
    labelBn: "মেশিন লার্নিং",
    category: "machine-learning",
    aliases: ["ml", "supervised learning", "unsupervised learning", "scikit-learn", "sklearn"]
  },
  "scikit-learn": {
    id: "scikit-learn",
    label: "Scikit-Learn",
    labelBn: "সায়কিট-লার্ন",
    category: "machine-learning",
    aliases: ["sklearn", "scikit learn", "scikitlearn"]
  },
  "regression": {
    id: "regression",
    label: "Regression",
    labelBn: "রিগ্রেশন",
    category: "machine-learning",
    aliases: ["linear regression", "logistic regression", "regression models"]
  },
  "classification": {
    id: "classification",
    label: "Classification",
    labelBn: "ক্লাসিফিকেশন",
    category: "machine-learning",
    aliases: ["decision tree", "random forest", "svm", "classification models"]
  },
  "clustering": {
    id: "clustering",
    label: "Clustering",
    labelBn: "ক্লাস্টারিং",
    category: "machine-learning",
    aliases: ["k-means", "hierarchical clustering", "dbscan", "unsupervised clustering"]
  },
  "xgboost": {
    id: "xgboost",
    label: "XGBoost",
    labelBn: "XGBoost",
    category: "machine-learning",
    aliases: ["xgb", "gradient boosting", "gbm", "boosting"]
  },
  "lightgbm": {
    id: "lightgbm",
    label: "LightGBM",
    labelBn: "LightGBM",
    category: "machine-learning",
    aliases: ["lgbm", "light gbm"]
  },
  "catboost": {
    id: "catboost",
    label: "CatBoost",
    labelBn: "CatBoost",
    category: "machine-learning",
    aliases: ["cat boost"]
  },
  "dimensionality-reduction": {
    id: "dimensionality-reduction",
    label: "Dimensionality Reduction",
    labelBn: "ডাইমেনশনালিটি রিডাকশন",
    category: "machine-learning",
    aliases: ["pca", "umap", "t-sne", "tsne", "principal component analysis"]
  },
  "imbalanced-learning": {
    id: "imbalanced-learning",
    label: "Imbalanced Data Handling",
    labelBn: "ইমব্যালান্সড ডেটা",
    category: "machine-learning",
    aliases: ["smote", "class imbalance", "oversampling", "undersampling", "imbalanced-learn"]
  },
  "anomaly-detection": {
    id: "anomaly-detection",
    label: "Anomaly Detection",
    labelBn: "অ্যানোমালি ডিটেকশন",
    category: "machine-learning",
    aliases: ["outlier detection", "isolation forest", "lof", "one-class svm"]
  },
  "model-evaluation": {
    id: "model-evaluation",
    label: "Model Evaluation",
    labelBn: "মডেল মূল্যায়ন",
    category: "machine-learning",
    aliases: ["cross validation", "metrics", "accuracy", "f1 score", "roc auc", "confusion matrix"]
  },
  "hyperparameter-tuning": {
    id: "hyperparameter-tuning",
    label: "Hyperparameter Tuning",
    labelBn: "হাইপারপ্যারামিটার টিউনিং",
    category: "machine-learning",
    aliases: ["optuna", "gridsearchcv", "randomizedsearchcv", "bayesian optimization"]
  },
  "shap": {
    id: "shap",
    label: "SHAP (Model Interpretability)",
    labelBn: "SHAP",
    category: "machine-learning",
    aliases: ["shap values", "model interpretability", "explainable ai", "xai", "lime"]
  },
  "nlp": {
    id: "nlp",
    label: "NLP",
    labelBn: "ন্যাচারাল ল্যাঙ্গুয়েজ প্রসেসিং",
    category: "machine-learning",
    aliases: ["natural language processing", "spacy", "hugging face", "transformers", "text analysis"]
  },
  "model-stacking": {
    id: "model-stacking",
    label: "Ensemble Methods & Stacking",
    labelBn: "এনসেম্বল মেথড",
    category: "machine-learning",
    aliases: ["stacking", "blending", "ensemble learning", "bagging", "boosting"]
  },

  // ── Deep Learning ──────────────────────────────────────────────────────────
  "deep-learning": {
    id: "deep-learning",
    label: "Deep Learning",
    labelBn: "ডিপ লার্নিং",
    category: "deep-learning",
    aliases: ["neural networks", "ann", "artificial neural networks"]
  },
  "tensorflow": {
    id: "tensorflow",
    label: "TensorFlow / Keras",
    labelBn: "টেনসরফ্লো",
    category: "deep-learning",
    aliases: ["tensorflow", "keras", "tf", "tf.keras"]
  },
  "pytorch": {
    id: "pytorch",
    label: "PyTorch",
    labelBn: "পাইটর্চ",
    category: "deep-learning",
    aliases: ["torch", "pytorch framework"]
  },
  "cnn": {
    id: "cnn",
    label: "CNNs (Computer Vision)",
    labelBn: "CNN",
    category: "deep-learning",
    aliases: ["convolutional neural network", "image classification", "computer vision", "opencv"]
  },
  "rnn-lstm": {
    id: "rnn-lstm",
    label: "RNNs & LSTMs",
    labelBn: "RNN/LSTM",
    category: "deep-learning",
    aliases: ["rnn", "lstm", "recurrent neural network", "sequence models", "gru"]
  },
  "transformers": {
    id: "transformers",
    label: "Transformers & LLMs",
    labelBn: "ট্রান্সফর্মার",
    category: "deep-learning",
    aliases: ["transformers", "bert", "gpt", "llm", "large language model", "hugging face transformers"]
  },
  "fast-ai": {
    id: "fast-ai",
    label: "fast.ai",
    labelBn: "fast.ai",
    category: "deep-learning",
    aliases: ["fastai", "fast ai"]
  },

  // ── MLOps & Deployment ─────────────────────────────────────────────────────
  "mlflow": {
    id: "mlflow",
    label: "MLflow",
    labelBn: "MLflow",
    category: "mlops",
    aliases: ["ml flow", "experiment tracking"]
  },
  "wandb": {
    id: "wandb",
    label: "Weights & Biases",
    labelBn: "WandB",
    category: "mlops",
    aliases: ["wandb", "weights and biases", "w&b"]
  },
  "docker": {
    id: "docker",
    label: "Docker",
    labelBn: "ডকার",
    category: "mlops",
    aliases: ["containerization", "docker container", "dockerfile"]
  },
  "github-actions": {
    id: "github-actions",
    label: "GitHub Actions (CI/CD)",
    labelBn: "GitHub Actions",
    category: "mlops",
    aliases: ["ci/cd", "github actions", "continuous integration", "continuous deployment"]
  },
  "fastapi": {
    id: "fastapi",
    label: "FastAPI",
    labelBn: "FastAPI",
    category: "mlops",
    aliases: ["fast api", "api development", "rest api development"]
  },
  "streamlit": {
    id: "streamlit",
    label: "Streamlit",
    labelBn: "স্ট্রিমলিট",
    category: "mlops",
    aliases: ["streamlit app", "data app"]
  },
  "gradio": {
    id: "gradio",
    label: "Gradio",
    labelBn: "গ্রেডিও",
    category: "mlops",
    aliases: ["gradio ui", "gradio interface"]
  },
  "dvc": {
    id: "dvc",
    label: "DVC (Data Version Control)",
    labelBn: "DVC",
    category: "mlops",
    aliases: ["data version control", "dvc pipeline"]
  },
  "parquet": {
    id: "parquet",
    label: "Parquet & Modern Data Formats",
    labelBn: "Parquet",
    category: "data-analysis",
    aliases: ["parquet files", "apache parquet", "columnar storage", "json normalization"]
  },
  "polars": {
    id: "polars",
    label: "Polars",
    labelBn: "পোলার্স",
    category: "data-analysis",
    aliases: ["polars dataframe", "rust dataframe"]
  },

  // ── Soft Skills / Portfolio ─────────────────────────────────────────────────
  "data-storytelling": {
    id: "data-storytelling",
    label: "Data Storytelling",
    labelBn: "ডেটা স্টোরিটেলিং",
    category: "soft-skills",
    aliases: ["storytelling", "data communication", "presentation", "insight communication"]
  },
  "technical-writing": {
    id: "technical-writing",
    label: "Technical Writing",
    labelBn: "টেকনিক্যাল রাইটিং",
    category: "soft-skills",
    aliases: ["documentation", "readme", "blog writing", "technical documentation"]
  },
  "portfolio-development": {
    id: "portfolio-development",
    label: "Portfolio Development",
    labelBn: "পোর্টফোলিও",
    category: "soft-skills",
    aliases: ["portfolio", "github portfolio", "project showcase", "resume"]
  }
};

// ── Alias lookup map (built at module load time) ─────────────────────────────
const _aliasMap = new Map<string, string>();
for (const [id, def] of Object.entries(SKILL_TAXONOMY)) {
  _aliasMap.set(id.toLowerCase(), id);
  _aliasMap.set(def.label.toLowerCase(), id);
  for (const alias of def.aliases) {
    _aliasMap.set(alias.toLowerCase(), id);
  }
}

/**
 * Resolve a raw skill string to a canonical skill ID.
 * Returns null if no match is found.
 */
export function resolveSkill(raw: string): string | null {
  const normalized = raw.trim().toLowerCase();
  return _aliasMap.get(normalized) ?? null;
}

/**
 * Resolve multiple raw skills, deduplicated, ignoring unknowns.
 */
export function resolveSkills(rawSkills: string[]): string[] {
  const resolved = new Set<string>();
  for (const raw of rawSkills) {
    const id = resolveSkill(raw);
    if (id) resolved.add(id);
  }
  return [...resolved];
}

/**
 * Jaccard similarity between two skill sets.
 * Returns a percentage 0–100.
 */
export function jaccardMatch(userSkills: string[], jobSkills: string[]): number {
  if (!jobSkills.length) return 0;
  const userSet = new Set(userSkills.map((s) => s.toLowerCase()));
  const jobSet = new Set(jobSkills.map((s) => s.toLowerCase()));

  let intersection = 0;
  for (const skill of jobSet) {
    if (userSet.has(skill)) intersection++;
  }
  const union = new Set([...userSet, ...jobSet]).size;
  return union === 0 ? 0 : Math.round((intersection / union) * 100);
}

/**
 * Get matched and missing skills between user and job.
 */
export function getSkillBreakdown(
  userSkills: string[],
  requiredSkills: string[],
  preferredSkills: string[] = []
): {
  matchedSkills: string[];
  missingRequired: string[];
  missingPreferred: string[];
  matchPct: number;
} {
  const userSet = new Set(userSkills.map((s) => s.toLowerCase()));
  const resolve = (s: string) => s.toLowerCase();

  const matchedSkills = [
    ...requiredSkills.filter((s) => userSet.has(resolve(s))),
    ...preferredSkills.filter((s) => userSet.has(resolve(s)))
  ];
  const missingRequired = requiredSkills.filter((s) => !userSet.has(resolve(s)));
  const missingPreferred = preferredSkills.filter((s) => !userSet.has(resolve(s)));

  const allJobSkills = [...requiredSkills, ...preferredSkills];
  const matchPct = jaccardMatch(userSkills, allJobSkills);

  return { matchedSkills, missingRequired, missingPreferred, matchPct };
}

/** All canonical skill IDs as a flat array (for DB validation). */
export const ALL_SKILL_IDS = Object.keys(SKILL_TAXONOMY);
