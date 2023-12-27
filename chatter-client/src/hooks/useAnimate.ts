import {type Ref, ref} from "vue";

/**
 * Function for implementing basic animations on the DOM
 * @author Connell Reffo
 * @param frames The list of frames to cycle through
 * @param shouldContinue A reference to a boolean that should be true if the animation should be running
 * @param ms The number of milliseconds between each frame
 */
export function useAnimate(frames: string[], shouldContinue: Ref<boolean>, ms: number) {
    const frame: Ref<string> = ref("");

    /**
     * Updates the reactive `frame` variable to the next frame in the `frames` array after a given interval
     */
    function animate(): void {
        let i: number = 0;

        frame.value = frames[frames.length - 1];
        const interval: number = window.setInterval((): void => {
            if (shouldContinue.value) {
                frame.value = frames[i];

                if (i >= frames.length - 1) {
                    i = 0;
                }
                else {
                    i++;
                }
            }
            else {
                window.clearInterval(interval);
            }
        }, ms);
    }

    return {
        frame,
        animate
    };
}