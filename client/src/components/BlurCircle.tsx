import { type CSSProperties } from 'react'

type Side = CSSProperties['top'];

interface BlurCircleProps {
    top?: Side;
    right?: Side;
    bottom?: Side;
    left?: Side;
}

const BlurCircle = ({ top, right, bottom, left }: BlurCircleProps) => {
    return (
        <div
            className='absolute -z-50 h-58 w-58 aspect-square rounded-full bg-primary/30 blur-3xl'
            style={{
                top,
                right,
                bottom,
                left
            }}
        ></div>
    )
}

export default BlurCircle