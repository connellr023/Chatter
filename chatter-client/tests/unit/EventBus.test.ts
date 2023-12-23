import EventBus from "../../src/lib/EventBus";

import {beforeEach, test, expect, } from "vitest";

let eventBus: EventBus;

beforeEach((): void => {
    eventBus = EventBus.resetInstance();
});

test("Test resetInstance() equals getInstance()", (): void => {
    expect(EventBus.resetInstance()).toStrictEqual(EventBus.getInstance());
});

test("Test emit() with exactly 1 listener", (): void => {
    const expected = {"test": 0};
    let actual: {};

    eventBus.on("test", (payload): void => {actual = payload});
    eventBus.emit("test", {"test": 0});

    expect(actual).toStrictEqual(expected);
});

test("Test emit() with 2 listeners; only one should trigger", (): void => {
    const expected = {"test": 0};
    let actual: {};

    eventBus.on("test", (payload): void => {actual = payload});
    eventBus.on("test2", (): void => {throw new Error("Listener for 'test2' triggered when not expected")});
    eventBus.emit("test", {"test": 0});

    expect(actual).toStrictEqual(expected);
});

test("Test emit() with 2 listeners; all should be triggered", (): void => {
    const expected = {"test": 0};
    let actual1: {};
    let actual2: {};

    eventBus.on("test", (payload): void => {actual1 = payload});
    eventBus.on("test", (payload): void => {actual2 = payload});
    eventBus.emit("test", {"test": 0});

    expect(actual1).toStrictEqual(expected);
    expect(actual2).toStrictEqual(expected);
});

test("Test off() with 1 listener; none should be triggered", (): void => {
    let triggered: boolean = false;

    const off = eventBus.on("test", (): void => {triggered = true});
    off();

    eventBus.emit("test", {});

    expect(triggered).toBe(false);
});