import { Composition } from 'remotion';
import React from 'react';
import { ArgusEyeDemo } from './ArgusEyeDemo';
import { HTFArgusEyeDemo } from './HTFArgusEyeDemo';

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="ArgusEyeDemo"
                component={ArgusEyeDemo}
                durationInFrames={300}
                fps={30}
                width={1920}
                height={1080}
            />
            <Composition
                id="HTFArgusEyeDemo"
                component={HTFArgusEyeDemo}
                durationInFrames={300}
                fps={30}
                width={1920}
                height={1080}
            />
        </>
    );
};
