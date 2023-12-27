import LoadingButton from "../../src/components/LoadingButton.vue";

import {test, expect, vitest, beforeEach, afterEach} from "vitest";
import {mount} from "@vue/test-utils";

const frames: string[] = ["•", "••", "•••", "••••", "•••••", "••••", "•••", "••"];
const ms: number = 250;

test("Mount component with `isLoading` prop false", async (): Promise<void> => {
    expect(LoadingButton).toBeTruthy();

    const wrapper = mount(LoadingButton, {
        props: {
            id: "test",
            classes: "",
            text: "Sample"
        }
    });

    expect(wrapper.text()).toContain("Sample");
});

test("Mount component with `isLoading` prop true", async (): Promise<void> => {
    expect(LoadingButton).toBeTruthy();

    const wrapper = mount(LoadingButton, {
        props: {
            isLoading: true,
            id: "test",
            classes: "",
            text: "Sample"
        }
    });

    expect(wrapper.text()).not.toContain("Sample");
});

test("Test that button text updates when `isLoading` switches from false to true", async (): Promise<void> => {
    expect(LoadingButton).toBeTruthy();

    const wrapper = mount(LoadingButton, {
        props: {
            id: "test",
            classes: "",
            text: "Sample"
        }
    });

    await wrapper.setProps({isLoading: true});
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).not.toContain("Sample");
});

test("First frame displayed is the last item in `frames` array", async (): Promise<void> => {
    expect(LoadingButton).toBeTruthy();

    const wrapper = mount(LoadingButton, {
        props: {
            id: "test",
            classes: "",
            text: "Sample",
        },
    });

    const button = wrapper.find("#test");

    await button.trigger("click");
    await wrapper.setProps({isLoading: true});
    await wrapper.vm.$nextTick();

    vitest.useFakeTimers();

    window.setTimeout((): void => {
        expect(wrapper.text()).toContain(frames[frames.length - 1]);
    }, ms * 1.1);

    vitest.runAllTimers();
    vitest.useRealTimers();
});

test("Second frame displayed is the first item in `frames` array", async () => {
    expect(LoadingButton).toBeTruthy();

    const wrapper = mount(LoadingButton, {
        props: {
            id: "test",
            classes: "",
            text: "Sample",
        },
    });

    const button = wrapper.find("#test");

    await button.trigger("click");
    await wrapper.setProps({isLoading: true});
    await wrapper.vm.$nextTick();

    vitest.useFakeTimers();

    window.setTimeout((): void => {
        expect(wrapper.text()).toContain(frames[0]);
    }, ms * 2.1);

    vitest.runAllTimers();
    vitest.useRealTimers();
});