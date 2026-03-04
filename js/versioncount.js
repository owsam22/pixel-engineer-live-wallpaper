const OWNER = "owsam22";
const REPO = "pixel-engineer-live-wallpaper"; 

const CACHE_KEY = "commit_cache";
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours

function calculateVersion(commitCount) {
  const baseMajor = 1;

  const major = baseMajor + Math.floor(commitCount / 30);
  const minor = Math.floor((commitCount % 30) / 10);
  const patch = commitCount % 10;

  return `${major}.${minor}.${patch}`;
}

async function fetchCommitCount() {
  const response = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/commits?per_page=1&page=1`
  );

  if (!response.ok) {
    throw new Error("GitHub API failed");
  }

  const linkHeader = response.headers.get("Link");

  let totalCommits = 1;

  if (linkHeader) {
    const match = linkHeader.match(/page=(\d+)>; rel="last"/);
    if (match) {
      totalCommits = parseInt(match[1]);
    }
  }

  return totalCommits;
}

async function loadVersion() {
  const watermark = document.getElementById("watermark");
  const cached = localStorage.getItem(CACHE_KEY);

  if (cached) {
    const parsed = JSON.parse(cached);
    if (Date.now() - parsed.timestamp < CACHE_DURATION) {
      displayVersion(watermark, parsed.count);
      return;
    }
  }

  try {
    const count = await fetchCommitCount();

    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        count: count,
        timestamp: Date.now()
      })
    );

    displayVersion(watermark, count);
  } catch (err) {
    console.error(err);
  }
}

function displayVersion(container, commitCount) {
  const version = calculateVersion(commitCount);

  const versionDiv = document.createElement("div");
  versionDiv.classList.add("version-text");
  versionDiv.textContent = `V ${version}`;

  container.appendChild(versionDiv);
}

loadVersion();