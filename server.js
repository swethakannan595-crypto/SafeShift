const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'incidents.json');

const MODEL_URLS = {
  image:  'https://teachablemachine.withgoogle.com/models/YOUR_IMAGE_MODEL_ID/',
  pose:   'https://teachablemachine.withgoogle.com/models/YOUR_POSE_MODEL_ID/',
  audio:  'https://teachablemachine.withgoogle.com/models/YOUR_AUDIO_MODEL_ID/',
  idcard: 'https://teachablemachine.withgoogle.com/models/YOUR_IDCARD_MODEL_ID/',
  mask:   'https://teachablemachine.withgoogle.com/models/YOUR_MASK_MODEL_ID/',
};

const app = express();
app.use(cors());
app.use(express.json());

function loadIncidents() {
  try {
    if (fs.existsSync(DATA_FILE)) return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) { console.error('[DB] Read error:', e.message); }
  return [];
}

function saveIncidents(data) {
  try { fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8'); }
  catch (e) { console.error('[DB] Write error:', e.message); }
}

if (!fs.existsSync(DATA_FILE)) { saveIncidents([]); console.log('[DB] Created incidents.json'); }
else { console.log('[DB] Loaded', loadIncidents().length, 'existing incidents'); }

const modelCache = new Map();

async function proxyModelFile(req, res) {
  var sensor = req.params.sensor;
  var file = req.params.file;
  if (!MODEL_URLS[sensor]) return res.status(404).json({ error: 'Unknown sensor: ' + sensor });
  var remoteUrl = MODEL_URLS[sensor] + file;
  if (modelCache.has(remoteUrl)) {
    var cached = modelCache.get(remoteUrl);
    res.set('Content-Type', cached.type);
    return res.send(cached.data);
  }
  try {
    var fetchMod = require('node-fetch');
    var response = await fetchMod(remoteUrl);
    if (!response.ok) throw new Error('HTTP ' + response.status);
    var data = await response.buffer();
    var type = file.endsWith('.json') ? 'application/json' : 'application/octet-stream';
    modelCache.set(remoteUrl, { data: data, type: type });
    console.log('[PROXY] Cached: ' + sensor + '/' + file + ' (' + (data.length / 1024).toFixed(1) + ' KB)');
    res.set('Content-Type', type);
    res.send(data);
  } catch (err) {
    console.error('[PROXY] Failed: ' + remoteUrl, err.message);
    res.status(502).json({ error: 'Failed to fetch', detail: err.message });
  }
}

app.get('/api/model/:sensor/:file', proxyModelFile);

app.get('/api/sensors', function(req, res) {
  res.json(Object.keys(MODEL_URLS).map(function(key) {
    return { key: key, url: '/api/model/' + key + '/model.json', status: 'configured' };
  }));
});

app.post('/api/incidents', function(req, res) {
  if (!req.body.status || !req.body.reason) return res.status(400).json({ error: 'status and reason required' });
  var incidents = loadIncidents();
  var incident = { id: Date.now(), status: req.body.status, reason: req.body.reason, sensor_data: req.body.sensor_data || {}, created_at: new Date().toLocaleString() };
  incidents.unshift(incident);
  saveIncidents(incidents);
  console.log('[INCIDENT] ' + incident.status + ' - ' + incident.reason);
  res.status(201).json(incident);
});

app.get('/api/incidents', function(req, res) {
  var incidents = loadIncidents();
  var status = req.query.status;
  var limit = parseInt(req.query.limit) || 50;
  var offset = parseInt(req.query.offset) || 0;
  var filtered = incidents;
  if (status) filtered = filtered.filter(function(e) { return e.status === status; });
  if (req.query.since) filtered = filtered.filter(function(e) { return e.created_at >= req.query.since; });
  res.json({ data: filtered.slice(offset, offset + limit), total: filtered.length, limit: limit, offset: offset });
});

app.delete('/api/incidents', function(req, res) { saveIncidents([]); res.json({ deleted: true }); });

app.get('/api/stats', function(req, res) {
  var incidents = loadIncidents();
  var byStatus = {};
  incidents.forEach(function(e) { byStatus[e.status] = (byStatus[e.status] || 0) + 1; });
  res.json({ total: incidents.length, byStatus: byStatus, latest: incidents[0] || null });
});

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res) { res.sendFile(path.join(__dirname, 'public', 'index.html')); });

app.listen(PORT, function() {
  console.log('');
  console.log('  ==================================================');
  console.log('     SAFESHIFT BACKEND  ONLINE');
  console.log('  ==================================================');
  console.log('  Port:     ' + PORT);
  console.log('  Sensors:  ' + Object.keys(MODEL_URLS).length);
  console.log('  Storage:  ' + DATA_FILE);
  console.log('  --------------------------------------------------');
  console.log('  Open http://localhost:' + PORT + ' in your browser');
  console.log('  ==================================================');
  console.log('');
});
