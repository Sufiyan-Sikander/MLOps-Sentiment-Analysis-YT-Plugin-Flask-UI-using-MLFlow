const API_KEY = 'AIzaSyDiTa7dBxrJsk18EjEqtJlre-u0ak5E4H4';

const form = document.getElementById('analyzeForm');
const input = document.getElementById('videoInput');
const btn = document.getElementById('analyzeBtn');
const scrubber = document.getElementById('scrubber');
const scrubberFill = document.getElementById('scrubberFill');
const statusLine = document.getElementById('statusLine');
const errorLine = document.getElementById('errorLine');
const results = document.getElementById('results');
const signalDot = document.getElementById('signalDot');
const signalLabel = document.querySelector('.signal-label');

function extractVideoId(raw) {
  const trimmed = raw.trim();
  const m = trimmed.match(/(?:v=|youtu\.be\/|\/embed\/)([\w-]{11})/);
  if (m) return m[1];
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
  return null;
}

function setProgress(pct, label) {
  scrubberFill.style.width = pct + '%';
  statusLine.textContent = label;
}

function setLive(isLive, label) {
  signalDot.classList.toggle('live', isLive);
  signalLabel.textContent = 'SIGNAL: ' + label;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorLine.classList.add('hidden');
  results.classList.add('hidden');

  const videoId = extractVideoId(input.value);
  if (!videoId) {
    errorLine.textContent = 'Could not read a video ID from that input.';
    errorLine.classList.remove('hidden');
    return;
  }

  btn.disabled = true;
  scrubber.classList.add('active');
  setLive(true, 'ANALYZING');
  setProgress(10, 'Fetching comments…');

  try {
    const comments = await fetchComments(videoId);
    if (comments.length === 0) {
      throw new Error('No comments found for this video.');
    }

    setProgress(35, `Fetched ${comments.length} comments. Running sentiment model…`);
    const predictions = await getSentimentPredictions(comments);
    if (!predictions) throw new Error('Sentiment prediction failed.');

    setProgress(55, 'Computing metrics…');
    const sentimentCounts = { '1': 0, '0': 0, '-1': 0 };
    const sentimentData = [];
    const totalSentimentScore = predictions.reduce((sum, item) => sum + parseInt(item.sentiment), 0);
    predictions.forEach((item) => {
      sentimentCounts[item.sentiment]++;
      sentimentData.push({ timestamp: item.timestamp, sentiment: parseInt(item.sentiment) });
    });

    const totalComments = comments.length;
    const uniqueCommenters = new Set(comments.map(c => c.authorId)).size;
    const totalWords = comments.reduce((sum, c) => sum + c.text.split(/\s+/).filter(w => w.length > 0).length, 0);
    const avgWordLength = (totalWords / totalComments).toFixed(2);
    const avgSentimentScore = (totalSentimentScore / totalComments).toFixed(2);
    const normalizedScore = (((parseFloat(avgSentimentScore) + 1) / 2) * 10).toFixed(2);

    document.getElementById('mTotal').textContent = totalComments;
    document.getElementById('mUnique').textContent = uniqueCommenters;
    document.getElementById('mAvgLen').textContent = avgWordLength + ' words';
    document.getElementById('mAvgSent').textContent = normalizedScore + '/10';

    setProgress(70, 'Rendering charts…');
    await Promise.all([
      fetchImage('/generate_chart', { sentiment_counts: sentimentCounts }, 'chartImg'),
      fetchImage('/generate_trend_graph', { sentiment_data: sentimentData }, 'trendImg'),
      fetchImage('/generate_wordcloud', { comments: comments.map(c => c.text) }, 'cloudImg')
    ]);

    setProgress(95, 'Finalizing…');
    const feed = document.getElementById('commentFeed');
    feed.innerHTML = predictions.slice(0, 25).map((item, i) => {
      const cls = item.sentiment == 1 ? 'pos' : item.sentiment == -1 ? 'neg' : '';
      const tagText = item.sentiment == 1 ? 'POSITIVE' : item.sentiment == -1 ? 'NEGATIVE' : 'NEUTRAL';
      return `<li class="comment-item ${cls}">
        <span class="comment-tag ${cls}">${tagText}</span>
        <span class="comment-index">${String(i + 1).padStart(2, '0')}</span>${escapeHtml(item.comment)}
      </li>`;
    }).join('');

    setProgress(100, 'Done.');
    setLive(true, 'COMPLETE');
    results.classList.remove('hidden');
  } catch (err) {
    console.error(err);
    errorLine.textContent = err.message || 'Something went wrong.';
    errorLine.classList.remove('hidden');
    setLive(false, 'ERROR');
  } finally {
    btn.disabled = false;
    setTimeout(() => scrubber.classList.remove('active'), 800);
  }
});

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

async function fetchComments(videoId) {
  let comments = [];
  let pageToken = '';
  while (comments.length < 500) {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=100&pageToken=${pageToken}&key=${API_KEY}`);
    const data = await res.json();
    if (data.items) {
      data.items.forEach(item => {
        comments.push({
          text: item.snippet.topLevelComment.snippet.textOriginal,
          timestamp: item.snippet.topLevelComment.snippet.publishedAt,
          authorId: item.snippet.topLevelComment.snippet.authorChannelId?.value || 'Unknown'
        });
      });
    }
    pageToken = data.nextPageToken;
    if (!pageToken) break;
  }
  return comments;
}

async function getSentimentPredictions(comments) {
  const res = await fetch('/predict_with_timestamps', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comments })
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Error fetching predictions');
  return result;
}

async function fetchImage(endpoint, body, imgId) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`Failed to load ${endpoint}`);
  const blob = await res.blob();
  document.getElementById(imgId).src = URL.createObjectURL(blob);
}