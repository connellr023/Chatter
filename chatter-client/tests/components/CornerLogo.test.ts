import CornerLogo from "../../src/components/CornerLogo.vue";

import {test, expect} from "vitest";
import {shallowMount} from "@vue/test-utils";

test("Image is rendered", async (): Promise<void> => {
    expect(CornerLogo).toBeTruthy();

    const wrapper = shallowMount(CornerLogo);
    const logo = wrapper.find("img");

    expect(logo.exists()).toBe(true);
    expect(logo.attributes("src")).toBe("/src/assets/logo_white.png");
});