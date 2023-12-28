import WelcomeTitle from "../../src/components/WelcomeTitle.vue";

import {test, expect} from "vitest";
import {shallowMount} from "@vue/test-utils";

test("Mount component", async (): Promise<void> => {
    expect(WelcomeTitle).toBeTruthy();

    const wrapper = shallowMount(WelcomeTitle);
    expect(wrapper.text()).toContain("Welcome back");

    wrapper.unmount();
});