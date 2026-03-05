import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion';
import React from 'react';

// Unified Theme Colors
const CHART_BG = '#0B0E14';
const GRID_COLOR = '#1f2937';
const BULL_BODY = '#089981'; // XAUUSD default TradingView Teal
const BEAR_BODY = '#f23645'; // XAUUSD default TradingView Red
const WICK_COLOR = '#6b7280';
const OPEN_LINE = '#9ca3af';
const LH_LINE = '#4b5563';

// Simulated Price Range
const MIN_PRICE = 5050;
const MAX_PRICE = 5250;

export const HTFArgusEyeDemo: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();
    const priceRange = MAX_PRICE - MIN_PRICE;

    const getPriceY = (price: number) => {
        const availableHeight = height * 0.8;
        const normalized = (price - MIN_PRICE) / priceRange;
        return height - (height * 0.1) - (normalized * availableHeight);
    };

    // 1. Generate Realistic LTF Price Action (40 Candles, 15m)
    const ltfCandles = React.useMemo(() => {
        const candles = [];
        let currentOpen = 5120;
        let seed = 42;
        const random = () => {
            const x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };

        let velocity = 0;
        for (let i = 0; i < 40; i++) {
            velocity += (random() - 0.5) * 8;
            velocity *= 0.8; // Mean reversion
            const bodyDiff = velocity + (random() - 0.5) * 6;
            const currentClose = currentOpen + bodyDiff;

            const maxOC = Math.max(currentOpen, currentClose);
            const minOC = Math.min(currentOpen, currentClose);
            const high = maxOC + random() * 15;
            const low = minOC - random() * 15;

            candles.push({ o: currentOpen, h: high, l: low, c: currentClose });
            currentOpen = currentClose;
        }
        return candles;
    }, []);

    const currentLTFCandle = ltfCandles[ltfCandles.length - 1];

    // Animate the live LTF close bouncing around
    const animatedClose = interpolate(
        frame,
        [0, 60, 120, 180, 240, 300],
        [
            currentLTFCandle.o - 5,
            currentLTFCandle.l,
            currentLTFCandle.o + 5,
            currentLTFCandle.h,
            currentLTFCandle.o + 10,
            currentLTFCandle.c
        ],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.ease) }
    );

    const liveLtfCandle = {
        ...currentLTFCandle,
        c: animatedClose,
        h: Math.max(currentLTFCandle.h, animatedClose),
        l: Math.min(currentLTFCandle.l, animatedClose)
    };

    // 2. Layout Structure (Simultaneous)
    const ltfAreaWidth = width * 0.55;
    const startX = width * 0.05;
    const ltfSpacing = ltfAreaWidth / ltfCandles.length;
    const ltfWidth = Math.max(2, ltfSpacing * 0.6);

    const htfStartX = startX + ltfAreaWidth + 40;
    const htfWidth = 45; // Thick, solid HTF candles
    const htfSpacing = 65;

    // 3. Generate HTF Candles (4-Hour Macro)
    const htfCandles = [
        { o: 5080, h: 5130, l: 5070, c: 5120 }, // Bull
        { o: 5120, h: 5140, l: 5090, c: 5100 }, // Bear
        { o: 5100, h: 5180, l: 5095, c: 5175 }, // Bull Sweep
        { o: 5175, h: 5210, l: 5160, c: 5200 }, // Bull
        { o: 5200, h: 5230, l: 5150, c: 5160 }, // Bear Rejection
    ];

    const liveHtfOpen = 5160;
    const liveHtfLow = 5145;
    const liveHtfHigh = Math.max(5190, liveLtfCandle.h);
    // CRITICAL: Live HTF Close is explicitly tied to the Live LTF close (Simultaneous tracking)
    const liveHtfClose = liveLtfCandle.c;

    const finalHtfCandles = [...htfCandles, { o: liveHtfOpen, h: liveHtfHigh, l: liveHtfLow, c: liveHtfClose }];

    const liveLtfX = startX + (ltfCandles.length - 1) * ltfSpacing;
    const liveHtfX = htfStartX + 5 * htfSpacing;

    return (
        <AbsoluteFill style={{ backgroundColor: CHART_BG }}>
            {/* Background Grid */}
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    top: `${(i + 1) * 12.5}%`,
                    left: 0, right: 0,
                    height: 1,
                    backgroundColor: GRID_COLOR,
                    opacity: 0.5
                }} />
            ))}

            {/* Y-Axis Price Labels */}
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, borderLeft: `1px solid ${GRID_COLOR}` }}>
                {Array.from({ length: 8 }).map((_, i) => {
                    const p = MIN_PRICE + ((MAX_PRICE - MIN_PRICE) * (1 - ((i + 1) * 0.125)));
                    return (
                        <div key={i} style={{ position: 'absolute', top: `${(i + 1) * 12.5}%`, right: 10, color: '#6b7280', fontSize: 16, transform: 'translateY(-50%)' }}>
                            {p.toFixed(3)}
                        </div>
                    );
                })}
            </div>

            {/* 1. LTF Candles (Left Side, Simultaneous) */}
            {ltfCandles.map((c, i) => {
                const isLive = i === ltfCandles.length - 1;
                const displayC = isLive ? liveLtfCandle : c;
                const isBull = displayC.c >= displayC.o;
                const color = isBull ? BULL_BODY : BEAR_BODY;

                const topY = getPriceY(Math.max(displayC.o, displayC.c));
                const botY = getPriceY(Math.min(displayC.o, displayC.c));
                const x = startX + i * ltfSpacing;

                return (
                    <React.Fragment key={`ltf-${i}`}>
                        <div style={{ position: 'absolute', left: x + ltfWidth / 2 - 1, top: getPriceY(displayC.h), width: 2, height: getPriceY(displayC.l) - getPriceY(displayC.h), backgroundColor: WICK_COLOR }} />
                        <div style={{
                            position: 'absolute', left: x, top: topY, width: ltfWidth, height: Math.max(1, botY - topY),
                            backgroundColor: color, border: `1px solid ${color}`
                        }} />
                    </React.Fragment>
                );
            })}

            {/* 2. Separation Zone */}
            <div style={{
                position: 'absolute', left: startX + ltfAreaWidth + 10, top: 0, bottom: 0, width: 0,
                borderLeft: `2px dotted ${GRID_COLOR}`, opacity: 0.8
            }} />

            {/* 3. HTF Candles (Right Side, Thick, Solid, Simultaneous) */}
            {finalHtfCandles.map((c, i) => {
                const isLive = i === finalHtfCandles.length - 1;
                const isBull = c.c >= c.o;
                const bodyColor = isBull ? BULL_BODY : BEAR_BODY;

                const topY = getPriceY(Math.max(c.o, c.c));
                const botY = getPriceY(Math.min(c.o, c.c));
                const hY = getPriceY(c.h);
                const lY = getPriceY(c.l);
                const x = htfStartX + i * htfSpacing;

                return (
                    <React.Fragment key={`htf-${i}`}>
                        <div style={{ position: 'absolute', left: x + htfWidth / 2 - 2, top: hY, width: 4, height: Math.max(1, lY - hY), backgroundColor: WICK_COLOR }} />
                        <div style={{
                            position: 'absolute', left: x, top: topY, width: htfWidth, height: Math.max(1, botY - topY),
                            backgroundColor: bodyColor,
                            border: `2px solid #000`, // Bold solid border
                            boxShadow: isLive ? `0 0 20px ${bodyColor}40` : 'none'
                        }} />

                        {/* Projectors tying the Live HTF back to the Live LTF */}
                        {isLive && (
                            <>
                                {/* Open Line */}
                                <div style={{
                                    position: 'absolute', left: liveLtfX, top: getPriceY(c.o), width: x - liveLtfX, height: 0,
                                    borderTop: `2px dashed ${OPEN_LINE}`, opacity: 0.6
                                }} />
                                {/* Current Price Line tracking LTF exactly */}
                                <div style={{
                                    position: 'absolute', left: liveLtfX, top: getPriceY(c.c), width: width - liveLtfX, height: 0,
                                    borderTop: `1px dashed ${OPEN_LINE}`, opacity: 0.9
                                }} />

                                <div style={{
                                    position: 'absolute', right: 5, top: getPriceY(c.c) - 12,
                                    backgroundColor: isBull ? BULL_BODY : BEAR_BODY, color: '#fff',
                                    padding: '4px 8px', fontSize: 13, fontWeight: 'bold', borderRadius: 4, zIndex: 10
                                }}>
                                    {c.c.toFixed(3)}
                                </div>
                            </>
                        )}
                    </React.Fragment>
                );
            })}

            {/* Dashboard Box explicitly tracking the Right-Side Context */}
            <div style={{
                position: 'absolute',
                left: liveHtfX + htfWidth + 24,
                top: getPriceY((liveHtfOpen + liveHtfClose) / 2) + 15,
                backgroundColor: '#ffe0b2',
                color: '#b45309',
                border: '1px solid #b45309',
                padding: '8px 16px',
                fontSize: 16,
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                boxShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                zIndex: 20
            }}>
                <span style={{ fontSize: 14 }}>4 Hour</span>
                <span style={{ fontWeight: 'bold' }}>Time Left: 02:33:33</span>
            </div>

        </AbsoluteFill>
    );
};
