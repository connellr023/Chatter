import Notifications from "../../src/components/Notifications.vue";

import {test, expect, beforeEach, vitest, afterEach} from "vitest";
import {shallowMount} from "@vue/test-utils";
import {pushNotification} from "../../src/hooks/useNotifications";

beforeEach((): void => {
    expect(Notifications).toBeTruthy();
    vitest.useFakeTimers();
});

afterEach((): void => {
    vitest.useRealTimers();
});

test("No notification elements on mount", async (): Promise<void> => {
    const wrapper = shallowMount(Notifications);
    const container = wrapper.find("#notifications-container");

    expect(container.find(".notification-element").exists()).toBe(false);

    wrapper.unmount();
});

test("Test notification is displayed after being pushed", async (): Promise<void> => {
    const wrapper = shallowMount(Notifications);
    const container = wrapper.find("#notifications-container");

    await wrapper.vm.$nextTick();
    pushNotification("test");
    await wrapper.vm.$nextTick();

    expect(container.find(".notification-element").text()).toContain("test");
});

test("Test notification is deleted after being cleared", async (): Promise<void> => {
    const wrapper = shallowMount(Notifications);
    const container = wrapper.find("#notifications-container");

    await wrapper.vm.$nextTick();
    pushNotification("test");
    await wrapper.vm.$nextTick();

    const notification = container.find(".notification-element");
    expect(notification.text()).toContain("test");

    await notification.trigger("click");
    await wrapper.vm.$nextTick();

    expect(container.find(".notification-element").exists()).toBe(false);
});

test("Test notification is deleted after time", async (): Promise<void> => {
    const wrapper = shallowMount(Notifications);
    const container = wrapper.find("#notifications-container");

    await wrapper.vm.$nextTick();
    pushNotification("test");
    await wrapper.vm.$nextTick();

    const notification = container.find(".notification-element");
    expect(notification.text()).toContain("test");

    vitest.advanceTimersByTime(1000);
    await wrapper.vm.$nextTick();

    expect(container.find(".notification-element").exists()).toBe(false);
});