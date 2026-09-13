import * as satellite from "satellite.js";

// CelesTrak FORMAT=json 的 GP 数据即 OMM 数组，可直接给 json2satrec。
function parseGpNumber(v) {
    if (v === null || v === undefined || v === '') return 0;
    if (typeof v === 'number') return v;
    const n = Number(String(v).trim().replace(/E/i, 'e'));
    return Number.isFinite(n) ? n : 0;
}

// json2satrec / 轨道计算所需最小字段；仅有名称和历元不够
const OMM_REQUIRED_KEYS = [
    'EPOCH',
    'MEAN_MOTION',
    'ECCENTRICITY',
    'INCLINATION',
    'RA_OF_ASC_NODE',
    'ARG_OF_PERICENTER',
    'MEAN_ANOMALY',
];

export function isUsableOmm(omm) {
    if (!omm || typeof omm !== 'object') return false;
    return OMM_REQUIRED_KEYS.every((k) => {
        const v = omm[k];
        return v !== null && v !== undefined && v !== '';
    });
}

export function parseGpJson(text) {
    // 接口被限流/返回 HTML 错误页、或缓存被写坏时不应抛出异常，否则调用方会卡在 loading
    try {
        const data = JSON.parse(text);
        if (!Array.isArray(data)) return [];
        return data.filter((e) => e && e.OBJECT_NAME && isUsableOmm(e));
    } catch {
        return [];
    }
}

/**
 * 解析「添加我的卫星」输入：支持 CelesTrak OMM JSON，或经典 TLE 文本。
 * 返回 [{ name, omm }] 或 [{ name, tle1, tle2 }]
 */
export function parseSelfSatInput(text) {
    const raw = String(text || '').trim();
    if (!raw) return [];

    // JSON / OMM（数组或单个对象）
    if (raw.startsWith('[') || raw.startsWith('{')) {
        try {
            const data = JSON.parse(raw);
            const arr = Array.isArray(data) ? data : [data];
            return arr
                .filter((e) => e && e.OBJECT_NAME && isUsableOmm(e))
                .map((omm) => ({ name: String(omm.OBJECT_NAME).trim(), omm }));
        } catch {
            return [];
        }
    }

    // 经典 TLE
    const lines = (raw + '\n').split(/\r?\n/);
    const sat = [];
    let _sat = {};
    for (let i = 0; i < lines.length; i++) {
        if (Number.isNaN(parseInt(lines[i].substring(0, 1)))) {
            if (_sat.name && _sat.name != '' && _sat.path?.length >= 2) {
                sat.push({ name: _sat.name, tle1: _sat.path[0], tle2: _sat.path[1] });
            }
            // 无论上一颗是否完整都重置，避免残缺 TLE 与下一颗卫星的行串在一起
            _sat = { name: lines[i] };
        } else {
            if (!_sat.path) { _sat.path = []; }
            _sat.path.push(lines[i]);
        }
    }
    if (_sat.name && _sat.name != '' && _sat.path?.length >= 2) {
        sat.push({ name: _sat.name, tle1: _sat.path[0], tle2: _sat.path[1] });
    }
    return sat;
}

function isValidSatrec(satrec) {
    return !!(satrec && Number.isFinite(satrec.no) && Number.isFinite(satrec.ecco) && Number.isFinite(satrec.inclo));
}

/** 由 OMM 或 TLE 生成 satrec，供过境/多普勒计算。失败返回 null，不抛异常。 */
export function toSatrec(item) {
    if (!item) return null;
    try {
        if (item.omm) {
            if (!isUsableOmm(item.omm)) return null;
            const satrec = satellite.json2satrec(item.omm);
            return isValidSatrec(satrec) ? satrec : null;
        }
        if (item.tle1 && item.tle2) {
            // twoline2satrec 对垃圾输入不抛错，而是返回含 NaN 的 satrec
            const satrec = satellite.twoline2satrec(item.tle1, item.tle2);
            return isValidSatrec(satrec) ? satrec : null;
        }
    } catch {
        return null;
    }
    return null;
}

function padLeft(s, n) {
    s = String(s);
    return s.length >= n ? s.slice(-n) : ' '.repeat(n - s.length) + s;
}

function padRight(s, n) {
    s = String(s);
    return s.length >= n ? s.slice(0, n) : s + ' '.repeat(n - s.length);
}

function tleChecksum(line68) {
    let sum = 0;
    for (const ch of line68) {
        if (ch >= '0' && ch <= '9') sum += ch.charCodeAt(0) - 48;
        else if (ch === '-') sum += 1;
    }
    return sum % 10;
}

function isoToTleEpoch(iso) {
    // "2026-09-12T23:49:09.869376" -> "26255.99247534"
    const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?/);
    if (!m) return '00001.00000000';
    let year = +m[1];
    const month = +m[2];
    const day = +m[3];
    const secOfDay = (+m[4]) * 3600 + (+m[5]) * 60 + parseFloat(m[6] + (m[7] || ''));
    const mdays = [31, (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let doy = day;
    for (let i = 0; i < month - 1; i++) doy += mdays[i];
    const frac = secOfDay / 86400;
    const daysInYear = mdays.reduce((a, b) => a + b, 0);
    let epochDay = doy + frac;
    let epochStr = epochDay.toFixed(8);
    // 年末最后一刻四舍五入可能进位成不存在的 366/367 日，需要归一化到次年 001 日
    if (Number(epochStr) >= daysInYear + 1) {
        epochDay -= daysInYear;
        year += 1;
        epochStr = epochDay.toFixed(8);
    }
    const [ip, fp] = epochStr.split('.');
    return String(year % 100).padStart(2, '0') + ip.padStart(3, '0') + '.' + fp;
}

function toTleBstar(v) {
    // TLE 科学计数：0.mmmmm × 10^E（隐含小数点在尾数前）
    const n = typeof v === 'number' ? v : parseGpNumber(v);
    if (!n) return ' 00000+0';
    const sign = n < 0 ? '-' : ' ';
    const abs = Math.abs(n);
    let exp = Math.floor(Math.log10(abs)) + 1;
    let mant = Math.round(abs * Math.pow(10, 5 - exp));
    if (mant >= 100000) {
        mant = Math.round(mant / 10);
        exp += 1;
    }
    if (mant <= 0) return ' 00000+0';
    if (exp > 9) return sign + '99999+9';
    if (exp < -9) return sign + '99999-9';
    return sign + String(mant).padStart(5, '0') + (exp < 0 ? '-' : '+') + String(Math.abs(exp));
}

function toTleNdot(v) {
    const n = typeof v === 'number' ? v : parseGpNumber(v);
    if (!n) return ' .00000000';
    let s = n.toFixed(8);
    if (s.startsWith('-0.')) s = '-.' + s.slice(3);
    else if (s.startsWith('0.')) s = ' .' + s.slice(2);
    else if (!s.startsWith('-')) s = ' ' + s;
    if (s.length > 10) s = s.slice(0, 10);
    return s.padStart(10, ' ');
}

function toTleAngle(v) {
    return padLeft(parseGpNumber(v).toFixed(4), 8);
}

function toTleMeanMotion(v) {
    return padLeft(parseGpNumber(v).toFixed(8), 11);
}

function toTleEcc(v) {
    const n = parseGpNumber(v);
    return Math.min(9999999, Math.max(0, Math.round(n * 1e7))).toString().padStart(7, '0');
}

function toTleIntl(objectId) {
    // "1974-089B" -> "74089B  "
    const m = String(objectId || '').match(/^(\d{4})-(\d{3,4})([A-Z]*)/i);
    if (!m) return '        ';
    return padRight(m[1].slice(2) + m[2].padStart(3, '0') + m[3], 8);
}

/**
 * 将 OMM 还原为经典 TLE 两行。
 * 仅 sat2 写设备需要。
 * 经典 TLE 卫星号字段只有 5 位：NORAD ≥ 100000 时只能写入后 5 位（与 CelesTrak 不再对 6 位目标发 TLE 同一限制）。
 * 轨道根数本身不受影响；完整编号请用 OMM 的 NORAD_CAT_ID。
 */
export function ommToTle(omm) {
    if (!isUsableOmm(omm)) return null;
    const norad = Number(omm.NORAD_CAT_ID ?? 0);
    const satnum = String(norad).padStart(5, '0').slice(-5);
    const cls = (omm.CLASSIFICATION_TYPE || 'U')[0];
    const intl = toTleIntl(omm.OBJECT_ID);
    const epoch = isoToTleEpoch(omm.EPOCH);
    const ndot = toTleNdot(omm.MEAN_MOTION_DOT);
    const nddot = toTleBstar(omm.MEAN_MOTION_DDOT);
    const bstar = toTleBstar(omm.BSTAR);
    const eph = String(omm.EPHEMERIS_TYPE ?? 0)[0] || '0';
    const elset = padLeft(omm.ELEMENT_SET_NO ?? 0, 4);

    let line1 = '1 ' + satnum + cls + ' ' + intl + ' ' + epoch + ' ' + ndot + ' ' + nddot + ' ' + bstar + ' ' + eph + ' ' + elset;
    line1 = line1.slice(0, 68).padEnd(68, ' ');
    line1 += tleChecksum(line1);

    const inc = toTleAngle(omm.INCLINATION);
    const raan = toTleAngle(omm.RA_OF_ASC_NODE);
    const ecc = toTleEcc(omm.ECCENTRICITY);
    const argp = toTleAngle(omm.ARG_OF_PERICENTER);
    const ma = toTleAngle(omm.MEAN_ANOMALY);
    const mm = toTleMeanMotion(omm.MEAN_MOTION);
    const rev = padLeft(omm.REV_AT_EPOCH ?? 0, 5);

    let line2 = '2 ' + satnum + ' ' + inc + ' ' + raan + ' ' + ecc + ' ' + argp + ' ' + ma + ' ' + mm + rev;
    line2 = line2.slice(0, 68).padEnd(68, ' ');
    line2 += tleChecksum(line2);

    return [line1, line2];
}

export function getDopplerShifts({
    satrec: satrecIn,
    tle1,
    tle2,
    latitude,
    longitude,
    heightKm,
    downlinkHz,
    uplinkHz,
    startTime = new Date(),
    endTime = new Date(startTime.getTime() + 60 * 1000),
    stepSeconds = 1
}) {
    const shifts = [];
    for (let t = startTime.getTime(); t <= endTime.getTime(); t += stepSeconds * 1000) {
        const shift = getDopplerShift({
            satrec: satrecIn,
            tle1,
            tle2,
            latitude,
            longitude,
            heightKm,
            downlinkHz,
            uplinkHz,
            date: new Date(t)
        });
        if (shift) {
            shifts.push([
                Math.round(shift.uplink.shiftHz * 1000 * 1000),
                Math.round(shift.downlink.shiftHz * 1000 * 1000)
            ]);
        }
    }
    return shifts;
}

export function getDopplerShift({
    satrec: satrecIn,
    tle1,
    tle2,
    latitude,
    longitude,
    heightKm = 0,
    date,
    downlinkHz,
    uplinkHz
}) {
    const satrec = satrecIn || satellite.twoline2satrec(tle1, tle2);

    const observerGd = {
        latitude: satellite.degreesToRadians(latitude),
        longitude: satellite.degreesToRadians(longitude),
        height: heightKm
    };

    const pv = satellite.propagate(
        satrec,
        date
    );

    if (!pv.position || !pv.velocity) {
        return null;
    }

    const gmst = satellite.gstime(date);

    const positionEcf = satellite.eciToEcf(
        pv.position,
        gmst
    );

    const velocityEcf = satellite.eciToEcf(
        pv.velocity,
        gmst
    );

    const observerEcf =
        satellite.geodeticToEcf(observerGd);

    const factor =
        satellite.dopplerFactor(
            observerEcf,
            positionEcf,
            velocityEcf
        );

    const result = {
        factor
    };

    // 下行：卫星 -> 地面
    if (downlinkHz) {
        const rxFreq =
            downlinkHz * factor;

        result.downlink = {
            nominalHz: downlinkHz,
            receiveHz: rxFreq,
            shiftHz: rxFreq - downlinkHz
        };
    }else{
        result.downlink = {
            nominalHz: 0,
            receiveHz: 0,
            shiftHz: 0
        };
    }

    // 上行：地面 -> 卫星
    if (uplinkHz) {
        const txFreq =
            uplinkHz / factor;

        result.uplink = {
            nominalHz: uplinkHz,
            transmitHz: txFreq,
            shiftHz: txFreq - uplinkHz
        };
    }else{
        result.uplink = {
            nominalHz: 0,
            transmitHz: 0,
            shiftHz: 0
        };
    }

    return result;
}

export function getPasses({
    satrec: satrecIn,
    tle1,
    tle2,
    latitude,
    longitude,
    heightKm = 0,
    startTime = new Date(new Date().getTime() - 30 * 60 * 1000),
    days = 7,
    minElevation = 0,
    coarseStepSeconds = 30
}) {
    const satrec = satrecIn || satellite.twoline2satrec(tle1, tle2);

    const observer = {
        latitude: satellite.degreesToRadians(latitude),
        longitude: satellite.degreesToRadians(longitude),
        height: heightKm
    };

    function getElevation(date) {
        const pv = satellite.propagate(satrec, date);

        if (!pv.position) return -90;

        const gmst = satellite.gstime(date);

        const ecf = satellite.eciToEcf(
            pv.position,
            gmst
        );

        const look = satellite.ecfToLookAngles(
            observer,
            ecf
        );

        return satellite.radiansToDegrees(
            look.elevation
        );
    }

    /**
     * 搜索仰角穿越 minElevation 的精确时刻
     * rising=true  => AOS
     * rising=false => LOS
     */
    function findCrossing(start, end, rising) {
        let lo = start.getTime();
        let hi = end.getTime();

        while (hi - lo > 10) { // 10ms
            const mid = (lo + hi) / 2;

            const elev = getElevation(
                new Date(mid)
            );

            if (rising) {
                if (elev >= minElevation)
                    hi = mid;
                else
                    lo = mid;
            } else {
                if (elev >= minElevation)
                    lo = mid;
                else
                    hi = mid;
            }
        }

        return new Date(
            Math.round((lo + hi) / 2)
        );
    }

    /**
     * 在 AOS~LOS 区间搜索最大仰角
     * 三分搜索（单峰函数）
     */
    function findTCA(aos, los) {
        let left = aos.getTime();
        let right = los.getTime();

        while (right - left > 1000) {
            const m1 = left + (right - left) / 3;
            const m2 = right - (right - left) / 3;

            const e1 = getElevation(
                new Date(m1)
            );

            const e2 = getElevation(
                new Date(m2)
            );

            if (e1 < e2) {
                left = m1;
            } else {
                right = m2;
            }
        }

        const tca = new Date(
            Math.round((left + right) / 2)
        );

        return {
            tca,
            maxElevation: getElevation(tca)
        };
    }

    const endTime = new Date(
        startTime.getTime() +
        days * 24 * 3600 * 1000
    );

    const stepMs =
        coarseStepSeconds * 1000;

    const passes = [];

    let prevTime = startTime;
    let prevElev = getElevation(
        startTime
    );

    let currentAOS = null;

    for (
        let t =
            startTime.getTime() + stepMs;
        t <= endTime.getTime();
        t += stepMs
    ) {
        const currentTime = new Date(t);

        const currentElev =
            getElevation(currentTime);

        // AOS
        if (
            currentAOS === null &&
            prevElev < minElevation &&
            currentElev >= minElevation
        ) {
            currentAOS = findCrossing(
                prevTime,
                currentTime,
                true
            );
        }

        // LOS
        if (
            currentAOS !== null &&
            prevElev >= minElevation &&
            currentElev < minElevation
        ) {
            const los = findCrossing(
                prevTime,
                currentTime,
                false
            );

            const {
                tca,
                maxElevation
            } = findTCA(
                currentAOS,
                los
            );

            passes.push({
                aos: currentAOS,
                tca,
                los,
                durationSeconds: Math.round(
                    (los - currentAOS) / 1000
                ),
                maxElevation: Number(
                    maxElevation.toFixed(2)
                )
            });

            currentAOS = null;
        }

        prevTime = currentTime;
        prevElev = currentElev;
    }

    return passes;
}