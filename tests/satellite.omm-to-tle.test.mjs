/**
 * ommToTle / toSatrec / parse* 单元测试。
 * 运行: node tests/satellite.omm-to-tle.test.mjs
 */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const satellite = require('satellite.js');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const modPath = pathToFileURL(path.join(__dirname, '../src/utils/satellite.js')).href;
const {
  parseGpJson,
  parseSelfSatInput,
  toSatrec,
  isUsableOmm,
  ommToTle,
} = await import(modPath);

const ISS_OMM = {
  OBJECT_NAME: 'ISS (ZARYA)',
  OBJECT_ID: '1998-067A',
  EPOCH: '2026-09-13T04:12:47.894976',
  MEAN_MOTION: 15.49096932,
  ECCENTRICITY: 0.00049173,
  INCLINATION: 51.6307,
  RA_OF_ASC_NODE: 224.6171,
  ARG_OF_PERICENTER: 134.673,
  MEAN_ANOMALY: 225.4659,
  EPHEMERIS_TYPE: 0,
  CLASSIFICATION_TYPE: 'U',
  NORAD_CAT_ID: 25544,
  ELEMENT_SET_NO: 999,
  REV_AT_EPOCH: 58539,
  BSTAR: 9.6694874e-5,
  MEAN_MOTION_DOT: 4.898e-5,
  MEAN_MOTION_DDOT: 0,
};

function checksumOk(line) {
  assert.equal(line.length, 69, `line length ${line.length}: ${line}`);
  let sum = 0;
  for (const ch of line.slice(0, 68)) {
    if (ch >= '0' && ch <= '9') sum += ch.charCodeAt(0) - 48;
    else if (ch === '-') sum += 1;
  }
  assert.equal(String(sum % 10), line[68], `checksum mismatch: ${line}`);
}

function satrecPosDiff(a, b, when) {
  const pa = satellite.propagate(a, when);
  const pb = satellite.propagate(b, when);
  const va = pa.position;
  const vb = pb.position;
  return Math.hypot(va.x - vb.x, va.y - vb.y, va.z - vb.z);
}

let passed = 0;
function ok(name, fn) {
  try {
    fn();
    passed += 1;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

console.log('isUsableOmm');
ok('完整 OMM 通过', () => assert.equal(isUsableOmm(ISS_OMM), true));
ok('缺 MEAN_MOTION 失败', () => {
  const { MEAN_MOTION, ...rest } = ISS_OMM;
  assert.equal(isUsableOmm(rest), false);
});
ok('仅有 NAME+EPOCH 失败', () => {
  assert.equal(isUsableOmm({ OBJECT_NAME: 'X', EPOCH: '2026-01-01T00:00:00' }), false);
});
ok('null 失败', () => assert.equal(isUsableOmm(null), false));

console.log('parseSelfSatInput / parseGpJson');
ok('伪 OMM 被过滤', () => {
  const text = JSON.stringify([{ OBJECT_NAME: 'fake', EPOCH: '2026-01-01T00:00:00' }]);
  assert.equal(parseSelfSatInput(text).length, 0);
});
ok('完整 OMM JSON 可解析', () => {
  const items = parseSelfSatInput(JSON.stringify(ISS_OMM));
  assert.equal(items.length, 1);
  assert.equal(items[0].name, 'ISS (ZARYA)');
});
ok('HTML 错误页不抛异常', () => {
  assert.deepEqual(parseGpJson('<html>rate limited</html>'), []);
});
ok('GP JSON 数组可解析', () => {
  const items = parseGpJson(JSON.stringify([ISS_OMM, { OBJECT_NAME: 'bad' }]));
  assert.equal(items.length, 1);
});

console.log('toSatrec');
ok('伪 OMM 返回 null 不抛', () => {
  assert.equal(toSatrec({ omm: { OBJECT_NAME: 'x', EPOCH: '2026-01-01T00:00:00' } }), null);
});
ok('完整 OMM 生成 satrec', () => {
  const satrec = toSatrec({ omm: ISS_OMM });
  assert.ok(satrec);
  assert.ok(Number.isFinite(satrec.no));
});
ok('坏 TLE 返回 null', () => {
  assert.equal(toSatrec({ tle1: 'not-a-tle', tle2: 'also-bad' }), null);
});

console.log('ommToTle');
ok('ISS OMM → 69 字节 + checksum', () => {
  const [l1, l2] = ommToTle(ISS_OMM);
  checksumOk(l1);
  checksumOk(l2);
  assert.ok(l1.startsWith('1 25544U 98067A'));
  assert.ok(l2.startsWith('2 25544'));
});
ok('生成 TLE 可再次 twoline2satrec', () => {
  const [l1, l2] = ommToTle(ISS_OMM);
  const satrec = satellite.twoline2satrec(l1, l2);
  assert.ok(Number.isFinite(satrec.no));
});
ok('OMM→TLE→satrec 与 OMM→satrec 误差 < 5km', () => {
  const [l1, l2] = ommToTle(ISS_OMM);
  const fromTle = satellite.twoline2satrec(l1, l2);
  const fromOmm = satellite.json2satrec(ISS_OMM);
  const when = new Date('2026-09-13T04:12:47.000Z');
  const d = satrecPosDiff(fromTle, fromOmm, when);
  assert.ok(d < 5, `position delta ${d} km`);
});
ok('闰年 day-of-year 29 Feb', () => {
  const omm = { ...ISS_OMM, EPOCH: '2024-02-29T12:00:00.000000', NORAD_CAT_ID: 25544 };
  const [l1] = ommToTle(omm);
  // 2024 闰年，2/29 = doy 60 → epoch "24060.50000000"
  assert.match(l1, /24060\.50000000/);
  checksumOk(l1);
});
ok('年末最后一刻归一化到次年 001 日', () => {
  // 12-31T23:59:59.999999 在 toFixed(8) 后可能进位到 367
  const omm = { ...ISS_OMM, EPOCH: '2023-12-31T23:59:59.999999' };
  const [l1] = ommToTle(omm);
  assert.match(l1, /24001\.00000000|23365\./);
  checksumOk(l1);
});
ok('负 MEAN_MOTION_DOT', () => {
  const omm = { ...ISS_OMM, MEAN_MOTION_DOT: -1.234e-4 };
  const [l1] = ommToTle(omm);
  // TLE NDOT 字段：负号 + 小数
  assert.match(l1, / -\.00012340 /);
  checksumOk(l1);
});
ok('MEAN_MOTION_DDOT 科学计数写入 B* 槽', () => {
  // 1.234e-5 → TLE 0.12340 × 10^-4，字段写作 "12340-4"
  const omm = { ...ISS_OMM, MEAN_MOTION_DDOT: 1.234e-5 };
  const [l1] = ommToTle(omm);
  assert.match(l1, /12340-4/);
  checksumOk(l1);
});
ok('极小 BSTAR', () => {
  const omm = { ...ISS_OMM, BSTAR: 1e-9 };
  const [l1] = ommToTle(omm);
  checksumOk(l1);
});
ok('极大 BSTAR 截断', () => {
  const omm = { ...ISS_OMM, BSTAR: 1e12 };
  const [l1] = ommToTle(omm);
  assert.match(l1, /99999\+9/);
  checksumOk(l1);
});
ok('NORAD>=100000 只保留后 5 位', () => {
  const omm = { ...ISS_OMM, NORAD_CAT_ID: 123456 };
  const [l1, l2] = ommToTle(omm);
  assert.ok(l1.startsWith('1 23456'));
  assert.ok(l2.startsWith('2 23456'));
  checksumOk(l1);
  checksumOk(l2);
});
ok('缺字段 ommToTle 返回 null', () => {
  assert.equal(ommToTle({ OBJECT_NAME: 'x', EPOCH: '2026-01-01T00:00:00' }), null);
});

console.log(`\n${passed} passed${process.exitCode ? ' (with failures)' : ''}`);
