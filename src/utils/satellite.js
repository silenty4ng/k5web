import * as satellite from "satellite.js";

export function getDopplerShifts({
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
    tle1,
    tle2,
    latitude,
    longitude,
    heightKm = 0,
    date,
    downlinkHz,
    uplinkHz
}) {
    const satrec = satellite.twoline2satrec(
        tle1,
        tle2
    );

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
    const satrec = satellite.twoline2satrec(tle1, tle2);

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