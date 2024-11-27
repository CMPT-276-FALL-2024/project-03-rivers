import React from 'react';
import { cardio } from 'ldrs';

cardio.register();

export default function Cardio(){
    return (
        <l-cardio
            size="50"
            speed="1.75"
            color="orange"
        ></l-cardio>
    )
}
