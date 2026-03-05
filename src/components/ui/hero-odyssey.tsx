"use client";

import React, { useRef, useEffect, useState } from 'react';
import Image from "next/image";
import { motion, Variants } from 'framer-motion';

interface FeatureItemProps {
    name: string;
    value: string;
    position: string;
}

interface LightningProps {
    hue?: number;
    xOffset?: number;
    speed?: number;
    intensity?: number;
    size?: number;
}

const Lightning: React.FC<LightningProps> = ({
    hue = 140, // Greenish hue
    xOffset = 0,
    speed = 1,
    intensity = 1,
    size = 1,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resizeCanvas = () => {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        };
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        const gl = canvas.getContext("webgl");
        if (!gl) {
            console.error("WebGL not supported");
            return;
        }

        const vertexShaderSource = `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

        const fragmentShaderSource = `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform float uHue;
      uniform float uXOffset;
      uniform float uSpeed;
      uniform float uIntensity;
      uniform float uSize;
      
      #define OCTAVE_COUNT 10

      vec3 hsv2rgb(vec3 c) {
          vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
          return c.z * mix(vec3(1.0), rgb, c.y);
      }

      float hash11(float p) {
          p = fract(p * .1031);
          p *= p + 33.33;
          p *= p + p;
          return fract(p);
      }

      float hash12(vec2 p) {
          vec3 p3 = fract(vec3(p.xyx) * .1031);
          p3 += dot(p3, p3.yzx + 33.33);
          return fract((p3.x + p3.y) * p3.z);
      }

      mat2 rotate2d(float theta) {
          float c = cos(theta);
          float s = sin(theta);
          return mat2(c, -s, s, c);
      }

      float noise(vec2 p) {
          vec2 ip = floor(p);
          vec2 fp = fract(p);
          float a = hash12(ip);
          float b = hash12(ip + vec2(1.0, 0.0));
          float c = hash12(ip + vec2(0.0, 1.0));
          float d = hash12(ip + vec2(1.0, 1.0));
          
          vec2 t = smoothstep(0.0, 1.0, fp);
          return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
      }

      float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < OCTAVE_COUNT; ++i) {
              value += amplitude * noise(p);
              p *= rotate2d(0.45);
              p *= 2.0;
              amplitude *= 0.5;
          }
          return value;
      }

      void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
          vec2 uv = fragCoord / iResolution.xy;
          uv = 2.0 * uv - 1.0;
          uv.x *= iResolution.x / iResolution.y;
          uv.x += uXOffset;
          uv += 2.0 * fbm(uv * uSize + 0.8 * iTime * uSpeed) - 1.0;
          float dist = abs(uv.x);
          vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.7, 0.8));
          vec3 col = baseColor * pow(mix(0.0, 0.07, hash11(iTime * uSpeed)) / dist, 1.0) * uIntensity;
          col = pow(col, vec3(1.0));
          fragColor = vec4(col, 1.0);
      }

      void main() {
          mainImage(gl_FragColor, gl_FragCoord.xy);
      }
    `;

        const compileShader = (source: string, type: number): WebGLShader | null => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error("Shader compile error:", gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
        const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
        gl.useProgram(program);

        const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const aPosition = gl.getAttribLocation(program, "aPosition");
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

        const iResolutionLocation = gl.getUniformLocation(program, "iResolution");
        const iTimeLocation = gl.getUniformLocation(program, "iTime");
        const uHueLocation = gl.getUniformLocation(program, "uHue");
        const uXOffsetLocation = gl.getUniformLocation(program, "uXOffset");
        const uSpeedLocation = gl.getUniformLocation(program, "uSpeed");
        const uIntensityLocation = gl.getUniformLocation(program, "uIntensity");
        const uSizeLocation = gl.getUniformLocation(program, "uSize");

        const startTime = performance.now();
        const render = () => {
            resizeCanvas();
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform2f(iResolutionLocation, canvas.width, canvas.height);
            const currentTime = performance.now();
            gl.uniform1f(iTimeLocation, (currentTime - startTime) / 1000.0);
            gl.uniform1f(uHueLocation, hue);
            gl.uniform1f(uXOffsetLocation, xOffset);
            gl.uniform1f(uSpeedLocation, speed);
            gl.uniform1f(uIntensityLocation, intensity);
            gl.uniform1f(uSizeLocation, size);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);

        return () => window.removeEventListener("resize", resizeCanvas);
    }, [hue, xOffset, speed, intensity, size]);

    return <canvas ref={canvasRef} className="w-full h-full relative" />;
};

const FeatureItem: React.FC<FeatureItemProps> = ({ name, value, position }) => {
    return (
        <motion.div
            className={`absolute ${position} z-10 group hidden md:block`}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: Math.random() * 2 + 3, repeat: Infinity, ease: "easeInOut", delay: Math.random() }}
            whileHover={{ scale: 1.05 }}
        >
            <div className="relative p-4 rounded-xl bg-black/40 backdrop-blur-md border border-[#00FF66]/20 shadow-[0_0_15px_rgba(0,255,102,0.1)] group-hover:border-[#00FF66]/50 group-hover:shadow-[0_0_25px_rgba(0,255,102,0.3)] transition-all duration-500 overflow-hidden">
                {/* Subtle inner glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#00FF66]/5 to-transparent pointer-events-none" />

                <div className="flex items-center gap-3 relative z-10">
                    <div className="relative">
                        <div className="w-2 h-2 bg-[#00FF66] rounded-full group-hover:animate-pulse shadow-[0_0_8px_#00FF66]"></div>
                    </div>
                    <div className="text-white">
                        <div className="font-bold text-[#00FF66] tracking-wider text-sm uppercase">{name}</div>
                        <div className="text-white/80 text-xs mt-0.5">{value}</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export const HeroSection: React.FC = () => {
    const lightningHue = 140; // Greenish Hue for ArgusEye

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.3, delayChildren: 0.2 } }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <div className="relative w-full bg-[#0C0A09] text-white overflow-hidden min-h-screen">
            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-screen flex flex-col justify-center">

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full absolute inset-0 pointer-events-none"
                >
                    <motion.div variants={itemVariants}>
                        <FeatureItem name="Argus Eye 24/7" value="Intraday Momentum" position="left-10 top-40" />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <FeatureItem name="HTF Argus Eye" value="Macro Analysis" position="right-10 top-40" />
                    </motion.div>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative z-30 flex flex-col items-center text-center max-w-4xl mx-auto -mt-20"
                >
                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl md:text-7xl font-bold mb-2 tracking-widest mt-16 text-white uppercase"
                    >
                        ARGUSEYE
                    </motion.h1>

                    <motion.h2
                        variants={itemVariants}
                        className="text-3xl md:text-5xl pb-3 font-light bg-gradient-to-r from-[#00FF66] via-white to-gray-400 bg-clip-text text-transparent"
                    >
                        Trade With Absolute Clarity.
                    </motion.h2>

                    <motion.p
                        variants={itemVariants}
                        className="text-gray-400 mt-6 mb-12 max-w-2xl text-lg leading-relaxed"
                    >
                        Institutional-grade TradingView indicators that eliminate market noise. Map liquidity, track high timeframe momentum, and identify high-probability setups without the guesswork.
                    </motion.p>

                    <motion.button
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => document.getElementById('indicators')?.scrollIntoView({ behavior: 'smooth' })}
                        className="px-8 py-4 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors border border-white/10"
                    >
                        Explore The Indicators
                    </motion.button>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 z-0 pointer-events-none"
            >
                <div className="absolute inset-0 bg-[#0C0A09]/80 mix-blend-multiply"></div>
                <div className="absolute top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-b from-[#00FF66]/5 to-[#009933]/5 blur-3xl"></div>

                <div className="absolute top-0 w-full left-1/2 transform -translate-x-1/2 h-full opacity-60">
                    <Lightning
                        hue={lightningHue}
                        xOffset={0}
                        speed={1.2}
                        intensity={0.4}
                        size={1.5}
                    />
                </div>

                {/* Planet Sphere Bottom */}
                <div className="absolute top-[65%] left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] backdrop-blur-3xl rounded-full bg-[radial-gradient(circle_at_50%_10%,_#0a1f10_10%,_#000000_60%,_#000000_100%)] border-t border-white/5 shadow-2xl"></div>
            </motion.div>
        </div>
    );
};
