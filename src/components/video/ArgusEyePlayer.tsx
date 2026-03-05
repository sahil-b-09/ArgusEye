"use client";

import { Player } from "@remotion/player";
import { ArgusEyeDemo } from "./ArgusEyeDemo";

export default function ArgusEyePlayer() {
    return (
        <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10 relative z-20 group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#00FF66]/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
            <Player
                component={ArgusEyeDemo}
                durationInFrames={300}
                compositionWidth={1920}
                compositionHeight={1080}
                fps={30}
                style={{
                    width: "100%",
                    height: "100%",
                }}
                autoPlay
                loop
            />
        </div>
    );
}
