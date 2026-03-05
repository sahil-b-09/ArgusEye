import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Sequence, Easing } from 'remotion';
import React from 'react';

// Mocked XAUUSD 15m Data
const CANDLES = [
    { o: 2015, h: 2016, l: 2010, c: 2011 }, // Red
    { o: 2011, h: 2012, l: 2005, c: 2006 }, // Red
    { o: 2006, h: 2008, l: 2002, c: 2003 }, // Red
    { o: 2003, h: 2005, l: 1998, c: 2004 }, // Green - Rejection
    { o: 2004, h: 2012, l: 2004, c: 2011 }, // Green - Massive (Buy Signal fires here)
    { o: 2011, h: 2018, l: 2010, c: 2017 }, // Green 
    { o: 2017, h: 2025, l: 2016, c: 2024 }, // Green
    { o: 2024, h: 2032, l: 2022, c: 2031 }, // Green - Hits TP3
];

const SIGNALS = {
    buySignalIndex: 4,
    sl: 1990,
    tp1: 2015,
    tp2: 2022,
    tp3: 2030,
};

// Theme
const CHART_BG = '#0B0E14';
const GRID_COLOR = '#1f2937';
const BULL_BODY = '#00FF66';
const BEAR_BODY = '#ef4444';
const WICK_COLOR = '#4b5563';

export const ArgusEyeDemo: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    // Scaling logic
    const minPrice = 1985;
    const maxPrice = 2040;
    const priceRange = maxPrice - minPrice;

    // X-axis layout
    const numCandles = CANDLES.length;
    // Let the candles take up about 70% of the screen width, centered
    const totalChartWidth = width * 0.7;
    const startX = width * 0.15; // 15% margin left

    const stepX = totalChartWidth / Math.max(1, (numCandles - 1));
    const candleW = stepX * 0.6; // 60% of step is candle body

    const getPriceY = (price: number) => {
        // 10% padding top and bottom
        const availableHeight = height * 0.8;
        const normalized = (price - minPrice) / priceRange;
        return height - (height * 0.1) - (normalized * availableHeight);
    };

    return (
        <AbsoluteFill style={{ backgroundColor: CHART_BG }}>
            {/* Background Grid */}
            {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    top: `${(i + 1) * 10}%`,
                    left: 0, right: 0,
                    height: 1,
                    backgroundColor: GRID_COLOR,
                    opacity: 0.5
                }} />
            ))}

            {/* Candles */}
            {CANDLES.map((c, i) => {
                // Stagger the animation so candles appear one by one
                // A new candle appears every 20 frames
                const appearFrame = i * 20;

                // The Y animation (grow the candle out of the open price)
                const progress = interpolate(
                    frame - appearFrame,
                    [0, 15],
                    [0, 1],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) }
                );

                const isBull = c.c >= c.o;
                const color = isBull ? BULL_BODY : BEAR_BODY;

                const topY = getPriceY(Math.max(c.o, c.c));
                const botY = getPriceY(Math.min(c.o, c.c));
                const currentCY = isBull ? getPriceY(c.o + (c.c - c.o) * progress) : getPriceY(c.o - (c.o - c.c) * progress);

                const currentTopY = isBull ? currentCY : topY;
                const currentBotY = isBull ? botY : currentCY;

                const currentHighY = getPriceY(c.o + (c.h - c.o) * progress);
                const currentLowY = getPriceY(c.o - (c.o - c.l) * progress);

                const xPos = startX + (i * stepX);

                if (frame < appearFrame) return null;

                return (
                    <React.Fragment key={i}>
                        {/* Wick */}
                        <div style={{
                            position: 'absolute',
                            left: xPos + candleW / 2 - 2, // center 4px wide wick
                            top: Math.min(currentHighY, currentLowY),
                            width: 4,
                            height: Math.abs(currentHighY - currentLowY),
                            backgroundColor: WICK_COLOR,
                            borderRadius: 2
                        }} />

                        {/* Body */}
                        <div style={{
                            position: 'absolute',
                            left: xPos,
                            top: currentTopY,
                            width: candleW,
                            height: Math.max(1, currentBotY - currentTopY),
                            backgroundColor: color,
                            border: `2px solid ${isBull ? '#00FFAA' : '#7f1d1d'}`,
                            borderRadius: 4,
                            boxShadow: isBull ? `0 0 15px ${color}40` : 'none',
                            opacity: interpolate(frame - appearFrame, [0, 5], [0, 1], { extrapolateRight: 'clamp' })
                        }} />
                    </React.Fragment>
                );
            })}

            {/* Indicators and Signals appearing after candle 4 */}
            {frame > (SIGNALS.buySignalIndex * 20 + 10) && (
                <Sequence from={SIGNALS.buySignalIndex * 20 + 10}>
                    {/* Buy Label */}
                    <div style={{
                        position: 'absolute',
                        left: startX + (SIGNALS.buySignalIndex * stepX) + candleW / 2 - 60,
                        top: getPriceY(CANDLES[SIGNALS.buySignalIndex].l) + 40,
                        color: '#fff',
                        backgroundColor: '#0055ff',
                        padding: '10px 20px',
                        borderRadius: 8,
                        fontSize: 24,
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 14px rgba(0, 85, 255, 0.4)',
                        transform: `scale(${spring({ fps, frame: frame - (SIGNALS.buySignalIndex * 20 + 10) })})`,
                    }}>
                        <span style={{ marginRight: 8 }}>▲</span> BUY
                    </div>

                    {/* SL Line */}
                    <TargetLine name="SL" price={SIGNALS.sl} color="#ef4444" getPriceY={getPriceY} startX={startX + SIGNALS.buySignalIndex * stepX} endX={width} frameDelay={20} currentFrame={frame - (SIGNALS.buySignalIndex * 20 + 10)} />

                    {/* TP1 Line */}
                    <TargetLine name="TP 1" price={SIGNALS.tp1} color="#00FF66" getPriceY={getPriceY} startX={startX + SIGNALS.buySignalIndex * stepX} endX={width} frameDelay={30} currentFrame={frame - (SIGNALS.buySignalIndex * 20 + 10)} />

                    {/* TP2 Line */}
                    <TargetLine name="TP 2" price={SIGNALS.tp2} color="#00FF66" getPriceY={getPriceY} startX={startX + SIGNALS.buySignalIndex * stepX} endX={width} frameDelay={40} currentFrame={frame - (SIGNALS.buySignalIndex * 20 + 10)} />

                    {/* TP3 Line */}
                    <TargetLine name="TP 3" price={SIGNALS.tp3} color="#00FF66" getPriceY={getPriceY} startX={startX + SIGNALS.buySignalIndex * stepX} endX={width} frameDelay={50} currentFrame={frame - (SIGNALS.buySignalIndex * 20 + 10)} />
                </Sequence>
            )}

            {/* Dashboard Top Right */}
            {frame > (SIGNALS.buySignalIndex * 20 + 60) && (
                <div style={{
                    position: 'absolute',
                    top: 40, right: 40,
                    backgroundColor: '#111827',
                    border: '1px solid #374151',
                    borderRadius: 16,
                    padding: 24,
                    color: 'white',
                    fontFamily: 'monospace',
                    fontSize: 24,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    opacity: spring({ fps, frame: frame - (SIGNALS.buySignalIndex * 20 + 60) })
                }}>
                    <div style={{ color: '#60a5fa', fontWeight: 'bold', marginBottom: 12, borderBottom: '1px solid #374151', paddingBottom: 12 }}>Argus Eye 24/7</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ color: '#9ca3af' }}>Trade:</span>
                        <span style={{ color: '#0055ff', fontWeight: 'bold' }}>BUY</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, minWidth: 250 }}>
                        <span style={{ color: '#9ca3af' }}>Entry:</span>
                        <span>2011.00</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ color: '#9ca3af' }}>SL:</span>
                        <span style={{ color: '#ef4444' }}>{SIGNALS.sl.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ color: '#9ca3af' }}>TP1:</span>
                        <span style={{ color: '#00FF66' }}>{SIGNALS.tp1.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ color: '#9ca3af' }}>TP2:</span>
                        <span style={{ color: '#00FF66' }}>{SIGNALS.tp2.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#9ca3af' }}>TP3:</span>
                        <span style={{ color: '#00FF66' }}>{SIGNALS.tp3.toFixed(2)}</span>
                    </div>
                </div>
            )}

        </AbsoluteFill>
    );
};

const TargetLine: React.FC<{
    name: string;
    price: number;
    color: string;
    getPriceY: (p: number) => number;
    startX: number;
    endX: number;
    currentFrame: number;
    frameDelay: number;
}> = ({ name, price, color, getPriceY, startX, endX, currentFrame, frameDelay }) => {
    if (currentFrame < frameDelay) return null;
    const tFrame = currentFrame - frameDelay;

    const progress = interpolate(tFrame, [0, 20], [0, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
    const w = (endX - startX) * progress;

    return (
        <div style={{
            position: 'absolute',
            left: startX,
            top: getPriceY(price),
            width: Math.max(0, w),
            height: 2,
            borderTop: `3px dashed ${color}`,
            opacity: 0.8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            overflow: 'visible'
        }}>
            <div style={{
                position: 'absolute',
                right: -100,
                backgroundColor: color,
                color: '#000',
                padding: '6px 16px',
                fontWeight: 'bold',
                borderRadius: 4,
                fontSize: 20,
                opacity: progress
            }}>
                {name} {price.toFixed(1)}
            </div>
        </div>
    );
};
