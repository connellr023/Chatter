import FadeInEffect from "../../src/components/FadeInEffect.vue";

import {test, expect, vitest, beforeEach, afterEach} from "vitest";
import {shallowMount} from "@vue/test-utils";

const hideTime: number = 130;
const disabledTime: number = 500;

beforeEach((): void => {
   expect(FadeInEffect).toBeTruthy();
   vitest.useFakeTimers();
});

afterEach((): void => {
   vitest.useRealTimers();
});

test("Has no classes on mount", async (): Promise<void> => {
   const wrapper = shallowMount(FadeInEffect);
   const overlay = wrapper.find("#overlay");

   expect(overlay.attributes("class")).toBe("");
});

test("`hide` class should be added", async (): Promise<void> => {
   const wrapper = shallowMount(FadeInEffect);
   const overlay = wrapper.find("#overlay");

   await wrapper.vm.$nextTick();
   vitest.advanceTimersByTime(hideTime);
   await wrapper.vm.$nextTick();

   expect(overlay.attributes("class")).toBe("hide");
});

test("`hide` and `disable` class should be added", async (): Promise<void> => {
   const wrapper = shallowMount(FadeInEffect);
   const overlay = wrapper.find("#overlay");

   await wrapper.vm.$nextTick();
   vitest.advanceTimersByTime(disabledTime);
   await wrapper.vm.$nextTick();

   expect(overlay.attributes("class")).toBe("hide disable");
});