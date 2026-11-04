/**
 * SQL Sandbox progress store — MBI802
 *
 * Paste this whole file into a Google Sheet's Apps Script editor
 * (Extensions → Apps Script), then deploy it as a web app.
 * Full steps: scripts/sql-sandbox-sheet/README.md in the repo.
 *
 * It keeps two tabs, created on first use:
 *   Progress  one row per student ID, updated in place. Sort or filter it
 *             in class to see who is where.
 *   Log       one row per event: opened on a device, finished a level,
 *             tried a challenge. Pastes and seconds-to-solve are here too.
 */

var PROGRESS = 'Progress';
var LOG = 'Log';

var PROGRESS_HEADERS = [
  'Student ID', 'Last seen', 'XP', 'Levels done', 'Up to', 'Stars',
  'Challenges solved', 'Which challenges', 'Challenge tries', 'Pastes in challenges',
  'Streak (days)', 'Device', 'Profile (do not edit)',
];
var LOG_HEADERS = ['Time', 'Student ID', 'What', 'Which', 'Result', 'Tries so far', 'Pastes so far', 'Seconds'];

function sheet_(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    // Keep student IDs as text, so 0123 stays 0123 and never becomes 123.
    var idCol = headers.indexOf('Student ID') + 1;
    sh.getRange(1, idCol, sh.getMaxRows(), 1).setNumberFormat('@');
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function cleanId_(id) {
  id = String(id || '').trim().toUpperCase();
  return /^[A-Z0-9-]{3,20}$/.test(id) ? id : '';
}

function findRow_(sh, id) {
  var last = sh.getLastRow();
  if (last < 2) return -1;
  var ids = sh.getRange(2, 1, last - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]).toUpperCase() === id) return i + 2;
  }
  return -1;
}

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'ping';
  if (action === 'load') {
    var id = cleanId_(e.parameter.id);
    if (!id) return json_({ ok: false, error: 'bad id' });
    var sh = sheet_(PROGRESS, PROGRESS_HEADERS);
    var row = findRow_(sh, id);
    if (row < 0) return json_({ ok: true, profile: null });
    var profile = sh.getRange(row, PROGRESS_HEADERS.length).getValue();
    return json_({ ok: true, profile: profile || null });
  }
  if (action === 'board') {
    var shb = sheet_(PROGRESS, PROGRESS_HEADERS);
    var last = shb.getLastRow();
    if (last < 2) return json_({ ok: true, rows: [] });
    var data = shb.getRange(2, 1, last - 1, 7).getValues();
    var rows = data
      .filter(function (r) { return r[0]; })
      .map(function (r) {
        var id = String(r[0]);
        return { id: id.length > 3 ? '•••' + id.slice(-3) : id, xp: Number(r[2]) || 0, levels: Number(r[3]) || 0, challenges: Number(r[6]) || 0 };
      })
      .sort(function (a, b) { return b.xp - a.xp; })
      .slice(0, 10);
    return json_({ ok: true, rows: rows });
  }
  return json_({ ok: true, hello: 'SQL Sandbox sheet is running' });
}

function doPost(e) {
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: 'bad json' });
  }
  if (body.action !== 'save') return json_({ ok: false, error: 'unknown action' });
  var id = cleanId_(body.id);
  if (!id) return json_({ ok: false, error: 'bad id' });
  var profile = String(body.profile || '');
  if (profile.length > 45000) return json_({ ok: false, error: 'too big' });

  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var s = body.summary || {};
    var values = [
      id, new Date(), s.xp || 0, s.levelsDone || 0, s.currentLevel || '', s.stars || 0,
      s.challengesSolved || 0, s.challengeList || '', s.attempts || 0, s.pastes || 0,
      s.streak || 0, s.device || '', profile,
    ];
    var sh = sheet_(PROGRESS, PROGRESS_HEADERS);
    var row = findRow_(sh, id);
    if (row < 0) sh.appendRow(values);
    else sh.getRange(row, 1, 1, values.length).setValues([values]);

    var events = (body.events || []).slice(0, 100);
    if (events.length) {
      var log = sheet_(LOG, LOG_HEADERS);
      var rows = events.map(function (ev) {
        return [
          ev.at ? new Date(ev.at) : new Date(), id, ev.type || '', ev.ref || '', ev.result || '',
          ev.attempts == null ? '' : ev.attempts, ev.pastes == null ? '' : ev.pastes, ev.secs == null ? '' : ev.secs,
        ];
      });
      log.getRange(log.getLastRow() + 1, 1, rows.length, LOG_HEADERS.length).setValues(rows);
    }
  } finally {
    lock.releaseLock();
  }
  return json_({ ok: true });
}
