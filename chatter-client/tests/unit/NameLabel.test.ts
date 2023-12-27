import {expect, test, vitest} from "vitest";
import {mount} from "@vue/test-utils";

import NameLabel from "../../src/components/NameLabel.vue";

test("Mount component", async (): Promise<void> => {
    expect(NameLabel).toBeTruthy();

    const wrapper = mount(NameLabel);

    expect(wrapper.text()).toContain("Connell Reffo");
});

test("openGithub() opens proper window", async (): Promise<void> => {
    expect(NameLabel).toBeTruthy();

    const originalOpen = window.open;
    window.open = vitest.fn();

    const wrapper = mount(NameLabel);
    const button = wrapper.find("#gh-logo-a");

    await button.trigger("click");

    expect(window.open).toHaveBeenCalledWith("https://github.com/connellr023", "_blank");

    window.open = originalOpen;
});