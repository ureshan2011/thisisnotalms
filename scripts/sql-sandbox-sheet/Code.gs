/**
 * SQL Sandbox progress store — MBI802
 *
 * Paste this whole file into a Google Sheet's Apps Script editor
 * (Extensions → Apps Script), set TA_PIN below, then deploy it as a web app.
 * Full steps: scripts/sql-sandbox-sheet/README.md in the repo.
 *
 * It keeps two tabs, created on first use:
 *   Progress  one row per student, updated in place: name, progress, and
 *             what they are doing right now (level, step, time on it).
 *   Log       one row per event: opened on a device, finished a level,
 *             tried a challenge. Pastes and seconds-to-solve are here too.
 *
 * The TA screen (/sql-sandbox/ta) reads the Progress tab through
 * ?action=live, which needs TA_PIN.
 */

// Change this before you deploy. The TA types it once on the TA screen.
var TA_PIN = 'change-me';

var PROGRESS = 'Progress';
var LOG = 'Log';

var PROGRESS_HEADERS = [
  'Student ID', 'Name', 'Last seen', 'XP', 'Levels done', 'Up to', 'Stars',
  'Challenges solved', 'Which challenges', 'Challenge tries', 'Pastes in challenges',
  'Streak (days)', 'Device', 'Doing now', 'Step', 'On this step since', 'Failed tries on this step',
  'Profile (do not edit)',
];
var LOG_HEADERS = ['Time', 'Student ID', 'Name', 'What', 'Which', 'Result', 'Tries so far', 'Pastes so far', 'Seconds'];

function col_(name) {
  return PROGRESS_HEADERS.indexOf(name);
}

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

function text_(v, max) {
  return String(v == null ? '' : v).slice(0, max);
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

function allRows_() {
  var sh = sheet_(PROGRESS, PROGRESS_HEADERS);
  var last = sh.getLastRow();
  if (last < 2) return [];
  return sh.getRange(2, 1, last - 1, PROGRESS_HEADERS.length).getValues().filter(function (r) { return r[0]; });
}

function secsSince_(d, now) {
  if (!(d instanceof Date)) return 0;
  return Math.max(0, Math.round((now.getTime() - d.getTime()) / 1000));
}

function doGet(e) {
  var p = (e && e.parameter) || {};
  var action = p.action || 'ping';

  if (action === 'load') {
    var id = cleanId_(p.id);
    if (!id) return json_({ ok: false, error: 'bad id' });
    var sh = sheet_(PROGRESS, PROGRESS_HEADERS);
    var row = findRow_(sh, id);
    if (row < 0) return json_({ ok: true, profile: null });
    var profile = sh.getRange(row, PROGRESS_HEADERS.length).getValue();
    return json_({ ok: true, profile: profile || null });
  }

  if (action === 'board') {
    // IDs are masked and names left out: this list is shown to every student.
    var rows = allRows_()
      .map(function (r) {
        var id = String(r[0]);
        return {
          id: id.length > 3 ? '•••' + id.slice(-3) : id,
          xp: Number(r[col_('XP')]) || 0,
          levels: Number(r[col_('Levels done')]) || 0,
          challenges: Number(r[col_('Challenges solved')]) || 0,
        };
      })
      .sort(function (a, b) { return b.xp - a.xp; })
      .slice(0, 10);
    return json_({ ok: true, rows: rows });
  }

  if (action === 'live') {
    if (TA_PIN === 'change-me') return json_({ ok: false, error: 'Set TA_PIN in Code.gs and deploy a new version first.' });
    if (String(p.pin || '') !== TA_PIN) return json_({ ok: false, error: 'Wrong PIN.' });
    var now = new Date();
    var names = {};
    var live = allRows_().map(function (r) {
      var id = String(r[0]);
      names[id] = String(r[col_('Name')] || '');
      return {
        id: id,
        name: names[id],
        xp: Number(r[col_('XP')]) || 0,
        levelsDone: Number(r[col_('Levels done')]) || 0,
        upTo: String(r[col_('Up to')] || ''),
        challengesSolved: Number(r[col_('Challenges solved')]) || 0,
        pastes: Number(r[col_('Pastes in challenges')]) || 0,
        doing: String(r[col_('Doing now')] || ''),
        step: String(r[col_('Step')] || ''),
        stepSecs: secsSince_(r[col_('On this step since')], now),
        fails: Number(r[col_('Failed tries on this step')]) || 0,
        idleSecs: secsSince_(r[col_('Last seen')], now),
        device: String(r[col_('Device')] || ''),
      };
    });

    // Worth a word: a challenge solved within four minutes, by someone who pasted.
    var flags = [];
    var log = sheet_(LOG, LOG_HEADERS);
    var last = log.getLastRow();
    if (last >= 2) {
      var from = Math.max(2, last - 400);
      var events = log.getRange(from, 1, last - from + 1, LOG_HEADERS.length).getValues();
      events.forEach(function (ev) {
        var ago = secsSince_(ev[0], now);
        var pastes = Number(ev[7]) || 0;
        var secs = Number(ev[8]);
        if (ev[3] === 'challenge' && ev[5] === 'solved' && pastes > 0 && secs > 0 && secs <= 240 && ago <= 4 * 3600) {
          var sid = String(ev[1]);
          flags.push({ id: sid, name: names[sid] || String(ev[2] || ''), challenge: String(ev[4]), secs: secs, pastes: pastes, agoSecs: ago });
        }
      });
    }
    flags.reverse();
    return json_({ ok: true, rows: live, flags: flags.slice(0, 30) });
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
    var a = body.activity || {};
    var now = new Date();
    var stepSecs = Math.max(0, Number(a.stepSecs) || 0);
    var values = [
      id, text_(s.name, 30), now, s.xp || 0, s.levelsDone || 0, text_(s.currentLevel, 60), s.stars || 0,
      s.challengesSolved || 0, text_(s.challengeList, 80), s.attempts || 0, s.pastes || 0,
      s.streak || 0, text_(s.device, 20),
      text_(a.doing, 80), text_(a.step, 140), new Date(now.getTime() - stepSecs * 1000), Number(a.fails) || 0,
      profile,
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
          ev.at ? new Date(ev.at) : now, id, text_(s.name, 30), ev.type || '', ev.ref || '', ev.result || '',
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
