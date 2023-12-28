import ErrorView from "../../src/views/ErrorView.vue";
import CornerLogo from "../../src/components/CornerLogo.vue";
import NameLabel from "../../src/components/NameLabel.vue";

import {test, expect} from "vitest";
import {shallowMount} from "@vue/test-utils";
import {createRouter, createWebHistory, Router} from "vue-router";

const router: Router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/chat",
            component: {template: "<div>Chat</div>"}
        },
        {
            path: "/error",
            component: {template: "<div>Error</div>"}
        },
        {
            path: "/",
            component: {template: "<div>Root</div>"}
        }
    ]
});

test("Mount component", async (): Promise<void> => {
    expect(ErrorView).toBeTruthy();

    const wrapper = shallowMount(ErrorView, {
        props: {
            code: "test code",
            message: "test message"
        }
    });

    const code = wrapper.find("#error-code");
    const message = wrapper.find("#error-message");

    expect(code.text()).toContain("test code");
    expect(message.text()).toContain("test message");
});

test("Child components exist on mount", async (): Promise<void> => {
    expect(ErrorView).toBeTruthy();

    const wrapper = shallowMount(ErrorView, {
        props: {
            code: "test code",
            message: "test message"
        }
    });

    expect(wrapper.findComponent(CornerLogo).exists()).toBe(true);
    expect(wrapper.findComponent(NameLabel).exists()).toBe(true);
});

test("Return button goes back to root route", async (): Promise<void> => {
    expect(ErrorView).toBeTruthy();

    const wrapper = shallowMount(ErrorView, {
        props: {
            code: "test code",
            message: "test message"
        },
        global: {
            plugins: [router]
        }
    });

    const button = wrapper.find("#return-button");

    await button.trigger("click");
    await wrapper.vm.$nextTick();

    expect(router.currentRoute.value.path).toBe("/");
});