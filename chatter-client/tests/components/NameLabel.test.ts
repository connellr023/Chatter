import {beforeEach, expect, test, vitest} from "vitest";
import {shallowMount} from "@vue/test-utils";

import NameLabel from "../../src/components/NameLabel.vue";

beforeEach((): void => {
    expect(NameLabel).toBeTruthy();
});

test("Mount component", async (): Promise<void> => {
    const wrapper = shallowMount(NameLabel);

    expect(wrapper.text()).toContain("Connell Reffo");
});

test("openGithub() opens proper window", async (): Promise<void> => {
    const originalOpen = window.open;
    window.open = vitest.fn();

    const wrapper = shallowMount(NameLabel);
    const button = wrapper.find("#gh-logo-a");

    await button.trigger("click");

    expect(window.open).toHaveBeenCalledWith("https://github.com/connellr023", "_blank");

    window.open = originalOpen;
});