import App from "../src/App.vue";
import FadeInEffect from "../src/components/FadeInEffect.vue";
import Notifications from "../src/components/Notifications.vue";

import {RouterView} from "vue-router";
import {test, expect, beforeEach} from "vitest";
import {shallowMount} from "@vue/test-utils";

beforeEach((): void => {
    expect(App).toBeTruthy();
});

test("Child components render on mount", (): void => {
    const wrapper = shallowMount(App);

    expect(wrapper.findComponent(FadeInEffect).exists()).toBe(true);
    expect(wrapper.findComponent(Notifications).exists()).toBe(true);
    expect(wrapper.findComponent(RouterView).exists()).toBe(true);
});