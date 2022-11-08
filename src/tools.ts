

// Generates props for a MUI Avatar based on a avatar name. 

import { AvatarProps, SxProps, Theme } from "@mui/material";
import { SystemStyleObject } from "@mui/system";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";

// see https://mui.com/material-ui/react-avatar/#BackgroundLetterAvatars.tsx
export function stringAvatar(name: string): AvatarProps {
    return {
        style: {
            backgroundColor: stringToColor(name),
        },
        children: initials(name),
    };
}

function initials(name: string) {
    if(!name) return "?";
    const s = name.split(" ");
    if (s[1]) return s[0][0]+s[1][0];
    if (s[0][1]) return s[0][0]+s[0][1];
    return name[0];
}

// Generates a color for a generic string to use with the `stringAvatar` function. 
// see https://mui.com/material-ui/react-avatar/#BackgroundLetterAvatars.tsx
export function stringToColor(str: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < str.length; i += 1) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

// delay makes the Promise pending for at least [d] milliseconds.
// No matter if the promise fullfills or rejects before the delay, the returned promise will wait and the fullfill or reject accordingly.
export async function delay<T>(p: Promise<T>, d: number): Promise<T> {
    await wait(d);
    return p;
}

// wait returns a promise that fulfills after the given delay (milliseconds).
function wait(d: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, d);
    })
}

// snake2title converts a snake string "like_this_string" to a title case string "Like This String".
export function snake2title(key: string) {
    return key.replaceAll(/(?:^|_)([a-z])/g, (c, d) => " "+d.toUpperCase())
}

export function usePageWidth() {
    const [width, setWidth] = useState(document.body.clientWidth);
    useEffect(() => {
        const handleResize = () => setWidth(document.body.clientWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return width;
}

export function joinSx(a: SystemStyleObject<Theme>, b?: SxProps<Theme>): SxProps<Theme> {
    if (!b) return a;
    if (Array.isArray(b)) return [a, ...b];
    return [a, b as | SystemStyleObject<Theme> | ((theme: Theme) => SystemStyleObject<Theme>)];
}

export function useForceUpdate() {
    const [n, setN] = useState(0);
    const forceUpdate = useMemo(() => () => setN(n+1), [n]);
    return forceUpdate;
}

// type GlobalStateKey = number;

// var globalStateKeyCounter: GlobalStateKey = 0;

// export function globalStateKey(): GlobalStateKey {
//     globalStateKeyCounter++;
//     return globalStateKeyCounter;
// }

// const globalStates = new Map<GlobalStateKey, [any, Dispatch<SetStateAction<any>>, Set<(s: any) => void>]>();

// export function useGlobalState<S>(key: GlobalStateKey, initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
//     const [state, setState] = useState(() => {
//         let v = globalStates.get(key);
//         if(v) return v[0];
//         const s = initialState instanceof Function ? initialState() : initialState;
//         globalStates.set(key, [s, setState]);
//     });

//     const v = globalStates.get(key)!;
//     useEffect(() => {

//     }, []);
//     return [v[0], v[1]];
//     // if (v) return v;
//     // v = [
//     //     typeof initialState === "function" ? (initialState as () => S)() : initialState,
//     //     (s: SetStateAction<S>) => {
//     //         if (typeof s === "function") {
//     //             v![0] = (s as (s: S) => S)(v![0]);
//     //         } else {
//     //            v[0] = s;
//     //         }
//     //     }
//     // ]
// }